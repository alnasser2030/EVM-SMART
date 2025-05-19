import streamlit as st
import json

# Load data
with open("data.json") as f:
    data = json.load(f)

st.set_page_config(layout="wide")
st.title("📊 EVM Smart Pilot Dashboard")

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
