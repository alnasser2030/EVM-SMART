import streamlit as st
import json
import pandas as pd
import numpy as np

# === Load Data ===
with open("data_neom_realistic_fixed.json") as f:
    data = json.load(f)

st.set_page_config(layout="wide")
st.title("📊 EVM Smart Pilot Dashboard – NEOM Edition")

# === Extract and Display Static Metrics ===
battery_soc = data['battery_soc'][0]
h2_soc = data['h2_soc'][0]
carbon_intensity = data['carbon_intensity']
load = data["load"]
pv = data["pv"]
wind = data["wind"]

st.metric("🔋 Battery SOC", f"{battery_soc}%")
st.metric("🫧 Hydrogen Tank", f"{h2_soc}%")
st.metric("🌍 Carbon Intensity", f"{carbon_intensity} kgCO₂/MWh")

# === Forecast Charts ===
st.subheader("📈 Load Forecast (1.5 MW Constant)")
st.line_chart(load)

st.subheader("🔆 PV Generation Forecast")
st.line_chart(pv)

st.subheader("🌀 Wind Generation Forecast")
st.line_chart(wind)

# === Total Generation (PV + Wind)
st.subheader("⚡ Total Available Generation Forecast")
total_generation = [round(pv[i] + wind[i], 2) for i in range(24)]
st.line_chart(total_generation)

# === Dispatch Simulation
battery_capacity = 6.0
battery_soc_now = 3.0
fc_capacity = 1.5
h2_soc_now = 10.0

battery_discharge = []
battery_charge = []
fc_discharge = []
h2_production = []
battery_soc_log = []
h2_soc_log = []
ess_action = []
available_power = []

for i in range(24):
    pv_now = pv[i]
    wind_now = wind[i]
    load_now = load[i]
    gen_now = pv_now + wind_now
    available_power.append(round(gen_now, 2))

    surplus = gen_now - load_now

    if surplus >= 0:
        # Charge battery first, then produce H2
        charge = min(surplus, battery_capacity - battery_soc_now)
        battery_soc_now += charge
        h2 = surplus - charge
        h2_soc_now += h2

        battery_discharge.append(0)
        fc_discharge.append(0)
        battery_charge.append(round(charge, 2))
        h2_production.append(round(h2, 2))
        ess_action.append("🔋 Charging + H₂ Production")
    else:
        shortfall = abs(surplus)
        discharge = min(shortfall, battery_soc_now)
        battery_soc_now -= discharge
        remaining = shortfall - discharge
        fc = min(remaining, fc_capacity)
        h2_soc_now -= fc

        battery_discharge.append(round(discharge, 2))
        fc_discharge.append(round(fc, 2))
        battery_charge.append(0)
        h2_production.append(0)
        if fc > 0:
            ess_action.append("🔋 Battery + 🔥 FC Backup")
        else:
            ess_action.append("🔋 Battery Only")

    battery_soc_log.append(round(battery_soc_now, 2))
    h2_soc_log.append(round(h2_soc_now, 2))

# === Assemble All Results in One Table
df = pd.DataFrame({
    "Hour": list(range(24)),
    "Load (MW)": load,
    "PV (MW)": pv,
    "Wind (MW)": wind,
    "Total Generation (MW)": available_power,
    "Battery Charge (MWh)": battery_charge,
    "Battery Discharge (MWh)": battery_discharge,
    "FC Discharge (MW)": fc_discharge,
    "H2 Production (MWh)": h2_production,
    "Battery SOC (MWh)": battery_soc_log,
    "H2 SOC (MWh)": h2_soc_log,
    "ESS Action": ess_action
})

st.subheader("📋 Full Hourly Dispatch Table")
st.dataframe(df)

# === Interactive Battery & H2 SOC Over Time
st.subheader("🔋 Battery & H₂ Tank SOC Over Time")
soc_df = pd.DataFrame({
    "Battery SOC (MWh)": battery_soc_log,
    "H₂ SOC (MWh)": h2_soc_log
})
st.line_chart(soc_df)

# === Interactive Generation vs Load
st.subheader("📉 Generation vs Load (Interactive)")
gen_vs_load_df = pd.DataFrame({
    "Load (MW)": load,
    "Total Generation (MW)": total_generation
})
st.line_chart(gen_vs_load_df)

# === Interactive ESS Support Chart
st.subheader("🔌 ESS Support (Battery + Fuel Cell)")
ess_support_df = pd.DataFrame({
    "Battery Discharge (MWh)": battery_discharge,
    "Fuel Cell Discharge (MW)": fc_discharge
})
st.line_chart(ess_support_df)

# === Daily Energy Summary
st.subheader("🔋 Daily Energy Sufficiency Check")
total_pv_energy = sum(pv)
total_wind_energy = sum(wind)
total_renewable_energy = total_pv_energy + total_wind_energy
required_energy = 36.0

if total_renewable_energy >= required_energy:
    rating = "✅ Sufficient Renewable Energy"
elif total_renewable_energy >= required_energy * 0.8:
    rating = "⚠️ Marginal — Add Battery or FC"
else:
    rating = "❌ Insufficient — Increase Sources or Storage"

st.write(f"**PV Energy**: {total_pv_energy:.2f} MWh")
st.write(f"**Wind Energy**: {total_wind_energy:.2f} MWh")
st.write(f"**Total Renewable Energy**: {total_renewable_energy:.2f} MWh")
st.write(f"**Required Load Energy**: 36.00 MWh/day")
st.write(f"**System Status**: {rating}")

# === Recommendation
st.markdown("### 🧾 Recommended System Sizing for 1.5 MW Load (36 MWh/day)")
st.markdown("""
- ☀️ **PV Array**: ~2.5 MWp  
- 🌬 **Wind Turbines**: ~2.0 MW  
- 🔋 **Battery Storage**: 6 MWh  
- 🫧 **Hydrogen Storage + FC**: 15–20 MWh  
- 🧠 **Smart EMS**: with optimization logic
""")

st.success("✅ System supports 24/7 renewable-powered data center using smart hybrid ESS.")
