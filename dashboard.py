import streamlit as st
import json

# Load NEOM-based realistic data
with open("data_neom_realistic_fixed.json") as f:

    data = json.load(f)

st.set_page_config(layout="wide")
st.title("📊 EVM Smart Pilot Dashboard – NEOM Edition")

# --- Ratings ---

# Battery Rating
battery_soc = data['battery_soc'][0]
if battery_soc > 70:
    battery_rating = "🟢 Excellent"
elif battery_soc > 40:
    battery_rating = "🟡 Moderate"
else:
    battery_rating = "🔴 Low"

st.subheader("🔋 Battery Health Status")
st.write(f"Rating: **{battery_rating}**")

# Hydrogen Tank Rating
h2_soc = data['h2_soc'][0]
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
st.metric("🌍 Carbon Intensity", f"{data['carbon_intensity']} kgCO₂/MWh")

# --- Charts ---
st.subheader("📈 Load Profile (1.5 MW Constant)")
st.line_chart(data["load"])

st.subheader("🔆 PV Generation Forecast (Simulated)")
st.line_chart(data["pv"])

st.subheader("🌀 Wind Generation Forecast (Simulated)")
st.line_chart(data["wind"])

# --- Customer Requirements Section ---
st.markdown("### 🧾 Recommended Infrastructure for This Load (1.5 MW x 24h = 36 MWh/day)")

st.markdown("""
- ☀️ **PV Array**: ~2.5 MWp  
  _Assumes 6–7 full sun hours in NEOM to supply ~15–18 MWh/day_
- 🌬 **Wind Turbines**: ~2 MW  
  _Covers nighttime and low-sun conditions; contributes ~12–15 MWh/day_
- 🔋 **Battery Storage**: 5–6 MWh  
  _For 2–4 hours of short-term backup (e.g. evening, storm buffering)_
- 🫧 **Hydrogen Storage + Fuel Cell**: 15–20 MWh equivalent  
  _Long-duration backup for night, low-wind scenarios (especially for 100% uptime)_
- 🖥 **Smart EMS Software** (EVM Smart™):  
  _To forecast, optimize, and dispatch resources based on real-time conditions_
""")

st.success("This setup can power your 1.5 MW data center in NEOM with 100% renewable energy and no grid dependency.")
