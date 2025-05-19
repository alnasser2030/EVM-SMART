import streamlit as st
import pandas as pd

st.set_page_config(layout="wide")
st.title("📊 EVM Smart Dashboard – Full ESS & Energy Flow Visualization")

# === Load Data ===
df = pd.read_csv("final_ess_response_table.csv")

# === Key Metrics Table ===
st.subheader("🔢 Hourly Energy Flow & ESS Response")
st.dataframe(df)

# === Battery & H₂ SOC Plot ===
st.subheader("🔋 Battery & Hydrogen Tank SOC Over Time")
st.image("ess_soc_profiles.png", caption="State of Charge (SOC) for Battery and Hydrogen Tank", use_column_width=True)

# === Energy Sufficiency Check ===
st.subheader("⚡ Daily Energy Sufficiency Check")

total_pv_energy = df["PV (MW)"].sum()
total_wind_energy = df["Wind (MW)"].sum()
total_renewable_energy = df["Total Available (MW)"].sum()
required_energy = 36.0  # MWh/day for 1.5 MW x 24h

if total_renewable_energy >= required_energy:
    energy_status = "✅ Sufficient Renewable Energy"
elif total_renewable_energy >= required_energy * 0.8:
    energy_status = "⚠️ Marginal — Add Battery or FC"
else:
    energy_status = "❌ Insufficient — Increase Sources or Storage"

st.write(f"**PV Energy**: {total_pv_energy:.2f} MWh")
st.write(f"**Wind Energy**: {total_wind_energy:.2f} MWh")
st.write(f"**Total Renewable Energy**: {total_renewable_energy:.2f} MWh")
st.write(f"**Required by Load**: 36.00 MWh/day")
st.write(f"**Status**: {energy_status}")

# === Legend: What Each ESS Action Means ===
st.markdown("### 🧠 ESS Dispatch Logic (Legend)")
st.markdown("""
- `🔋 Charging + H₂ Production`: PV/Wind surplus — battery charged first, excess goes to H₂  
- `🔋 Battery Only`: Shortfall — battery supports load  
- `🔋 Battery + 🔥 FC Backup`: Shortfall covered by both battery and fuel cell  
- `❌ Critical`: Even battery + FC may not be enough to meet demand  
""")

# === Final Infrastructure Recommendation ===
st.markdown("### 🧾 Infrastructure Recommendation for 1.5 MW Load (36 MWh/day)")
st.markdown("""
- ☀️ **PV Array**: 2.5 MWp (to produce ~16–18 MWh/day)  
- 🌬 **Wind Turbines**: 2.0 MW (to cover ~12–15 MWh/day)  
- 🔋 **Battery Storage**: 6 MWh (short-term backup)  
- 🫧 **Hydrogen Storage + FC**: 15–20 MWh equivalent (long-term backup)  
- 🧠 **EVM Smart EMS**: Smart logic to dispatch all components efficiently  
""")

st.success("✅ Your dashboard simulates real-time load, renewable generation, and ESS decisions for a 1.5 MW NEOM data center.")
