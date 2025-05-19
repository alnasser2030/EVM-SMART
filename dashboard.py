import streamlit as st
import json
import pandas as pd

# Load corrected NEOM-based data
with open("data_neom_realistic_fixed.json") as f:
    data = json.load(f)

st.set_page_config(layout="wide")
st.title("📊 EVM Smart Pilot Dashboard – NEOM Edition")

# --- Ratings ---
battery_soc = data['battery_soc'][0]
h2_soc = data['h2_soc'][0]
carbon_intensity = data['carbon_intensity']

# Battery Rating
if battery_soc > 70:
    battery_rating = "🟢 Excellent"
elif battery_soc > 40:
    battery_rating = "🟡 Moderate"
else:
    battery_rating = "🔴 Low"

st.subheader("🔋 Battery Health Status")
st.write(f"Rating: **{battery_rating}**")

# Hydrogen Rating
if h2_soc >= 90:
    h2_rating = "⚠️ Full — consider reducing production"
elif h2_soc >= 50:
    h2_rating = "✅ Normal"
else:
    h2_rating = "🔵 Low — safe to produce more hydrogen"

st.subheader("🫧 Hydrogen Storage Status")
st.write(f"Rating: **{h2_rating}**")

# --- Metrics ---
st.metric("🔋 Battery SOC", f"{battery_soc}%")
st.metric("🫧 Hydrogen Tank", f"{h2_soc}%")
st.metric("🌍 Carbon Intensity", f"{carbon_intensity} kgCO₂/MWh")

# --- Charts ---
st.subheader("📈 Load Profile (1.5 MW Constant)")
st.line_chart(data["load"])

st.subheader("🔆 PV Generation Forecast (Simulated)")
st.line_chart(data["pv"])

st.subheader("🌀 Wind Generation Forecast (Simulated)")
st.line_chart(data["wind"])

# --- Supply vs Load Table ---
st.subheader("⚡ Load Support Analysis")

load = data["load"]
pv = data["pv"]
wind = data["wind"]

available_power = []
supply_status = []

for i in range(24):
    total = pv[i] + wind[i]
    available_power.append(round(total, 2))
    if total >= load[i]:
        supply_status.append("✅ Covered by PV/Wind")
    elif total >= load[i] * 0.8:
        supply_status.append("⚠️ Partial — Need Battery or FC")
    else:
        supply_status.append("❌ Shortfall — Critical")

df_status = pd.DataFrame({
    "Hour": list(range(24)),
    "Load (MW)": load,
    "PV (MW)": pv,
    "Wind (MW)": wind,
    "Available Power (MW)": available_power,
    "Status": supply_status
})

# ✅ FIXED: use plain dataframe
st.dataframe(df_status)


# --- Recommendations ---
st.markdown("### 🧾 Recommended System Sizing for 1.5 MW Load (36 MWh/day)")
st.markdown("""
- ☀️ **PV Array**: ~2.5 MWp  
- 🌬 **Wind Turbines**: ~2.0 MW  
- 🔋 **Battery Storage**: 5–6 MWh  
- 🫧 **Hydrogen Storage + FC**: 15–20 MWh  
- 🧠 **EVM Smart EMS**: AI-based controller for real-time dispatch
""")

st.success("This setup ensures 24/7 renewable coverage with hybrid energy storage backup.")
