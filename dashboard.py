import streamlit as st
import pandas as pd

st.set_page_config(layout="wide")
st.title("📊 EVM Smart Dashboard – Full ESS & Energy Flow Visualization")

# === Load Data ===
df = pd.read_csv("final_ess_response_table.csv")

# === Key Metrics ===
st.subheader("🔢 Key Hourly Metrics Overview")
st.dataframe(df)

# === Battery & H₂ SOC Plot ===
st.subheader("🔋 Battery & H₂ Tank State of Charge (SOC) Over Time")
st.image("ess_soc_profiles.png", caption="Battery and Hydrogen Storage Profiles", use_column_width=True)

# === Energy Sufficiency Summary ===
total_pv = df["PV (MW)"].sum()
total_wind = df["Wind (MW)"].sum()
total_gen = df["Total Available (MW)"].sum()
total_load = df["Load (MW)"].sum()
required_energy = 36.0

if total_gen >= required_energy:
    energy_status = "✅ Sufficient Renewable Energy"
elif total_gen >= required_energy * 0.8:
    energy_status = "⚠️ Marginal — Add Battery or FC"
else:
    energy_status = "❌ Insufficient — Increase Sources or Storage"

st.subheader("⚡ Energy Sufficiency Check")
st.write(f"**PV Energy**: {total_pv:.2f} MWh")
st.write(f"**Wind Energy**: {total_wind:.2f} MWh")
st.write(f"**Total Generation**: {total_gen:.2f} MWh")
st.write(f"**Load Requirement**: 36.00 MWh/day")
st.write(f"**Status**: {energy_status}")

# === ESS Actions Summary ===
st.markdown("### 🧠 System Response Legend")
st.markdown("""
- `🔋 Charging + H₂ Production`: Surplus used for storage  
- `🔋 Battery Only`: Discharge used to support shortfall  
- `🔋 Battery + 🔥 FC Backup`: Full energy recovery during large shortfall  
- `❌ Critical`: Even ESS may not be enough  
""")

# === Final Recommendations ===
st.markdown("### 🧾 Infrastructure Recommendation")
st.markdown("""
- ☀️ **PV**: 2.5 MWp  
- 🌬 **Wind**: 2.0 MW  
- 🔋 **Battery**: 6 MWh  
- 🫧 **Hydrogen**: 15–20 MWh equivalent  
- 🧠 **EVM Smart EMS**: Full dispatch control
""")

st.success("Live energy flow and ESS dispatch simulated for a 1.5 MW, 24/7 data center in NEOM.")
