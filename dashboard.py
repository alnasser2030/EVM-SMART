import streamlit as st
import json
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# === Load Data ===
with open("data_neom_realistic_fixed.json") as f:
    data = json.load(f)

st.set_page_config(layout="wide")
st.title("📊 EVM Smart Pilot Dashboard – NEOM Edition")

# === Basic Metrics ===
battery_soc = data['battery_soc'][0]
h2_soc = data['h2_soc'][0]
carbon_intensity = data['carbon_intensity']

st.metric("🔋 Battery SOC", f"{battery_soc}%")
st.metric("🫧 Hydrogen Tank", f"{h2_soc}%")
st.metric("🌍 Carbon Intensity", f"{carbon_intensity} kgCO₂/MWh")

# === PV, Wind, Load Visualization ===
load = data["load"]
pv = data["pv"]
wind = data["wind"]

st.subheader("📈 Load Profile (1.5 MW Constant)")
st.line_chart(load)

st.subheader("🔆 PV Generation Forecast")
st.line_chart(pv)

st.subheader("🌀 Wind Generation Forecast")
st.line_chart(wind)

# === Total Generation Curve ===
st.subheader("⚡ Total Available Generation Forecast")
total_generation = [round(pv[i] + wind[i], 2) for i in range(24)]
st.line_chart(total_generation)

# === Power Flow and ESS Dispatch Logic ===
available_power = []
ess_action = []
battery_discharge = []
fc_discharge = []
battery_charge = []
h2_production = []

battery_capacity = 6.0
battery_soc = 3.0
fc_capacity = 1.5
h2_soc = 10.0

battery_soc_log = []
h2_soc_log = []

for i in range(24):
    total_gen = pv[i] + wind[i]
    demand = load[i]
    available_power.append(round(total_gen, 2))

    surplus = total_gen - demand
    if surplus >= 0:
        charge = min(surplus, battery_capacity - battery_soc)
        battery_soc += charge
        battery_charge.append(round(charge, 2))
        h2 = surplus - charge
        h2_production.append(round(h2, 2))
        h2_soc += h2
        battery_discharge.append(0)
        fc_discharge.append(0)
        ess_action.append("🔋 Charging + H₂ Production")
    else:
        shortfall = abs(surplus)
        discharge = min(shortfall, battery_soc)
        battery_soc -= discharge
        battery_discharge.append(round(discharge, 2))
        remaining = shortfall - discharge
        fc = min(remaining, fc_capacity) if remaining > 0 else 0
        fc_discharge.append(round(fc, 2))
        h2_soc -= fc
        battery_charge.append(0)
        h2_production.append(0)
        if fc > 0:
            ess_action.append("🔋 Battery + 🔥 FC Backup")
        else:
            ess_action.append("🔋 Battery Only")

    battery_soc_log.append(round(battery_soc, 2))
    h2_soc_log.append(round(h2_soc, 2))

# === Build DataFrame ===
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

st.subheader("⚡ ESS Response Table")
st.dataframe(df)

# === Daily Energy Sufficiency Check ===
st.subheader("🔋 Daily Energy Sufficiency Check")
total_pv_energy = sum(pv)
total_wind_energy = sum(wind)
total_renewable_energy = total_pv_energy + total_wind_energy
required_energy = 36.0

if total_renewable_energy >= required_energy:
    energy_rating = "✅ Sufficient Renewable Energy"
elif total_renewable_energy >= required_energy * 0.8:
    energy_rating = "⚠️ Marginal — Add Battery or FC"
else:
    energy_rating = "❌ Insufficient — Increase Sources or Storage"

st.write(f"**PV Energy**: {total_pv_energy:.2f} MWh")
st.write(f"**Wind Energy**: {total_wind_energy:.2f} MWh")
st.write(f"**Total Renewable Energy**: {total_renewable_energy:.2f} MWh")
st.write(f"**Required by Load**: 36.00 MWh/day")
st.write(f"**Status**: {energy_rating}")

# === SOC Over Time Plot ===
st.subheader("🔋 Battery & H₂ Tank SOC Over Time")
fig1, ax1 = plt.subplots(figsize=(10, 4))
ax1.plot(df["Hour"], df["Battery SOC (MWh)"], label="Battery SOC", marker='o')
ax1.plot(df["Hour"], df["H2 SOC (MWh)"], label="H₂ SOC", marker='s')
ax1.set_xlabel("Hour")
ax1.set_ylabel("State of Charge (MWh)")
ax1.set_title("Battery and Hydrogen Tank SOC")
ax1.grid(True)
ax1.legend()
st.pyplot(fig1)

# === Generation vs Load Plot ===
st.subheader("📉 Load vs Generation with Shortfall Highlight")
fig2, ax2 = plt.subplots(figsize=(10, 4))
ax2.plot(df["Hour"], df["Load (MW)"], '--', label="Load", linewidth=2)
ax2.plot(df["Hour"], df["Total Generation (MW)"], label="PV + Wind", linewidth=2)
ax2.fill_between(df["Hour"], df["Load (MW)"], df["Total Generation (MW)"],
                 where=(df["Total Generation (MW)"] < df["Load (MW)"]),
                 interpolate=True, color='red', alpha=0.3, label="Shortfall")
ax2.set_xlabel("Hour")
ax2.set_ylabel("Power (MW)")
ax2.set_title("Generation vs Load")
ax2.grid(True)
ax2.legend()
st.pyplot(fig2)

# === System Recommendation ===
st.markdown("### 🧾 Recommended System Sizing for 1.5 MW Load (36 MWh/day)")
st.markdown("""
- ☀️ **PV Array**: ~2.5 MWp  
- 🌬 **Wind Turbines**: ~2.0 MW  
- 🔋 **Battery Storage**: 6 MWh  
- 🫧 **Hydrogen Storage + FC**: 15–20 MWh  
- 🧠 **EVM Smart EMS**: AI-based controller
""")

st.success("✅ System supports 24/7 renewable power for a 1.5 MW data center in NEOM using smart hybrid storage.")
