import streamlit as st
import json

# Load data
with open("data.json") as f:
    data = json.load(f)

st.set_page_config(layout="wide")
st.title("📊 EVM Smart Pilot Dashboard")

# Example: Battery Rating
battery_soc = data['battery_soc'][0]

if battery_soc > 70:
    battery_rating = "🟢 Excellent"
elif battery_soc > 40:
    battery_rating = "🟡 Moderate"
else:
    battery_rating = "🔴 Low"
    
st.subheader("Battery Health Status")
st.write(f"Rating: **{battery_rating}**")

# Hydrogen Tank Rating
h2_soc = data['h2_soc'][0]

if h2_soc >= 90:
    h2_rating = "⚠️ Full — consider reducing production"
elif h2_soc >= 50:
    h2_rating = "✅ Normal"
else:
    h2_rating = "🔵 Low — safe to produce more hydrogen"

st.subheader("Hydrogen Storage Status")
st.write(f"Rating: **{h2_rating}**")



# Metrics
st.metric("🔋 Battery SOC", f"{data['battery_soc'][0]}%")
st.metric("🫧 Hydrogen Tank", f"{data['h2_soc'][0]}%")
st.metric("🌍 Carbon Intensity", f"{data['carbon_intensity']} kgCO₂/MWh")

# Charts
st.subheader("📈 Load Forecast")
st.line_chart(data["load"])

st.subheader("🔆 PV Generation Forecast")
st.line_chart(data["pv"])

st.subheader("🌀 Wind Generation Forecast")
st.line_chart(data["wind"])
