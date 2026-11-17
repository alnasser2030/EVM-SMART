# Chapter 2 — Literature Review (Core Draft v0)

> Status: draft of the core argument (themes 2, 4, 5 and the research gap), based on 28 papers read in full or in substantial part. Background themes (AI data center demand, supply configurations, multi-objective methods, Saudi context) to be added. Citations in IEEE numeric style; reference list at the end. **Every claim must be checked by the author against the cited paper before submission.**

---

## 2.1 Introduction

Electricity demand from data centers is growing rapidly, and the newest facilities, dedicated to training and serving artificial-intelligence (AI) models, add large blocks of nearly constant load to power systems [1], [24]. Two research streams address how such loads can be reconciled with decarbonizing grids. The first studies the *flexibility of the data center itself*: whether its computing workload, servers, cooling or backup assets can be scheduled to support the grid. The second studies *clean-energy procurement*: how a large consumer can claim, and actually cause, low-carbon supply. A third stream, *demand-side flexibility in the power system*, investigates how other consumers' loads can be shifted to balance variable renewable generation. This chapter reviews the three streams and shows that, although each is mature, their intersection—using the flexibility of *other* grid-connected loads to deliver hourly clean supply to an *inflexible* AI data center—has not been studied. This gap motivates the concept of **External Energy Flexibility (EEF)** proposed in this dissertation.

## 2.2 Internal Flexibility of Data Centers

The established view in the literature is that data centers are flexible loads. Early work showed that combining workload shifting with local generation lets a data center avoid coincident-peak charges, saving up to 40% of electricity costs compared with either measure alone [2]. Peak shaving was later formulated as joint control of delay-tolerant workload classes and on-site batteries, validated with Google traces [6], and demand response was co-optimized with server provisioning and power procurement from renewables and storage in a two-stage stochastic program [5]. A comprehensive review of Internet data centers (IDCs) in demand response organizes the field around load modeling, spatial and temporal workload regulation, economic mechanisms and program participation [3], and a bottom-up IDC load model couples multiple regulation methods—geographic workload migration, temporal deferral and server control—for hierarchical grid control [4]. Beyond energy-scale services, grid-interactive uninterruptible power supplies (UPS) can provide fast frequency response over seconds to minutes, while balancing over hours to days is attributed to other energy-intensive assets [7].

For AI data centers specifically, recent studies co-optimize AI workload scheduling with colocated renewables and market participation [8] or embed deferrable AI load in capacity-expansion models with network constraints [24]. Shifting computation in time and across geographically distributed sites has also been used to pursue hourly clean-energy matching [9], and representing data center load as firm, flexible or interruptible tiers shows that the value of flexibility depends on the host grid—for example, shifting load into midday solar hours enables additional solar and avoids gas and battery capacity [27].

**Common assumption.** All of these studies draw flexibility from *inside* the data center: its workloads, servers, UPS or batteries. This assumption is increasingly questioned for AI facilities. An analysis of a 155,410-GPU production trace found that immediately curtailable load averages only about 6.35% of median facility power, that dependable relief shrinks as event duration grows, and that the production scheduler exposes almost no additional delay-based capacity [26]. Large AI training and inference facilities are therefore better described as nearly constant loads with very limited internal flexibility—precisely the class of load for which internal-flexibility solutions are least effective.

## 2.3 Clean-Energy Matching for Large Consumers

Corporate buyers traditionally claim renewable supply through *annual (volumetric) matching*: procuring renewable energy or certificates equal to annual consumption. Evidence shows this overstates real mitigation. Excluding certificate-based claims, the combined 2015–2019 scope 2 trajectories of companies with science-based targets are no longer aligned with 1.5 °C, and 42% of committed scope 2 reductions may not reflect real-world mitigation [12]. Annual-average emission accounting can itself bias inventories by up to ±35% where grid carbon intensity varies by hour and season [13]. System-level capacity-expansion studies find that annually matched procurement has negligible emission benefits, whereas *hourly (24/7) matching* reduces system emissions at a cost premium and accelerates advanced clean technologies [10], [11].

How hourly matching is achieved is therefore central. Existing studies rely on three means: (i) a portfolio of procured clean generators, optimized to reach a target hourly carbon-free energy (CFE) score at least cost under uncertainty [16]; (ii) dedicated storage and firm resources, sized with stochastic and risk-averse (CVaR) planning for data center and industrial load profiles [14] or combined with direct power purchase agreements and market purchases [15]; and (iii) the buyer's *own* demand flexibility, including spatio-temporal shifting across its data centers [9], [10]. Storage-based matching becomes expensive at high matching levels: for an industrial consumer, direct-PPA procurement is infeasible without storage beyond roughly 20% renewable share, and storage requirements grow non-linearly beyond about 80%, sharply raising cost [15].

**Common assumption.** Hourly matching is achieved with assets the buyer owns or contracts on the *supply* side, or with the buyer's *own* load flexibility. The flexibility of *other* consumers on the grid is not used as a means of matching.

## 2.4 Demand-Side Flexibility in the Power System

Demand response (DR) is a well-established resource for integrating variable renewables, comprising incentive- and price-based programs, enabling technologies and measurement against customer *baselines* [17]. Flexibility is typically procured by system or grid operators, either directly from consumers or through service providers (aggregators); game-theoretic analysis shows that a direct channel can mitigate double marginalization and expand the DR market [18]. Specific industrial loads have been characterized as flexibility resources: desalination plants can adjust power while meeting water requirements when given incentives [20], and their technical and economic flexibility intervals can be quantified with adaptive robust optimization [19]. In Saudi Arabia, aggregator-based shifting of flexible load to solar hours has been studied for voltage regulation in PV-rich distribution systems [21], and a national assessment projects that flexibility needs will intensify by 2030 (duck-curve depth tripling, one-hour ramps rising 3.5–5.5 times) while industrial DR potential reaches 7.1–29.9 GW; however, the role of DR remains under-defined in the Kingdom's single-buyer market [23]. More broadly, highly renewable grids require new flexibility together with policy and regulatory change [25].

**Common assumption.** External flexibility is procured *by the system operator* for *system services* (balancing, peak shaving, voltage). It is not procured *by a large consumer* to firm its own renewable supply.

## 2.5 Closest Related Work

The study closest to this dissertation integrates a data center with a seawater desalination plant [22]. A flexible data center, a reverse-osmosis plant, photovoltaics and storage are co-located behind one substation; data center waste heat preheats seawater, lowering desalination energy use, and investment and operation are co-optimized with two-stage stochastic programming, reducing annualized cost by 86.5% (17% from heat synergy). The work is motivated by the coexistence of data centers and desalination on arid coasts such as Saudi Arabia's.

EEF differs from [22] in five respects: (1) the data center in [22] is *flexible* (workload scheduling within daily task totals), whereas EEF targets an *inflexible* AI data center; (2) [22] couples one *co-located, co-planned* plant, whereas EEF draws on a *portfolio of existing grid-connected* flexible loads; (3) the coupling in [22] is *physical* (waste heat), whereas EEF's is *contractual*, through the grid; (4) [22] minimizes cost, whereas EEF targets *hourly clean-energy matching* jointly with reliability and cost; and (5) EEF is benchmarked against direct grid supply, renewable-plus-storage supply and annual matching, and analyzed for saturation as data center capacity grows. Similarly, studies of renewable-colocated AI data centers [8] and spatio-temporal 24/7 matching [9] depend on internal workload flexibility that constant-load AI facilities lack [26].

## 2.6 Research Gap

Table 2.1 summarizes the positioning.

| Stream | Flexibility source | Who procures it | Purpose | Applicable to inflexible AI DC? |
|---|---|---|---|---|
| Internal DC flexibility [2]–[9], [24], [27] | DC workloads, servers, UPS, batteries | DC operator | Cost, DR, peak shaving, 24/7 CFE | Limited [26] |
| Hourly clean matching [9]–[11], [14]–[16] | Procured generation, storage, own load | Buyer | 24/7 CFE | Only via costly storage [15] |
| Grid demand flexibility [17]–[21], [23] | Other consumers' loads | System operator / aggregator | System balancing | Not linked to a buyer's supply |
| DC–desalination coupling [22] | Co-located plant + flexible DC | Integrated owner | Cost (heat synergy) | No (assumes flexible DC) |
| **This work (EEF)** | **Portfolio of existing external loads** | **DC via contractual framework** | **Hourly matching + reliability + cost** | **Yes** |

No study was found that (i) treats a constant-load AI data center as inflexible; (ii) pairs it with grid-injected PV sized to its annual consumption; and (iii) achieves hourly clean-energy matching by contracting the flexibility of external loads already connected to the grid—evaluated jointly on reliability, cost and sustainability against direct grid supply, renewable-plus-storage supply and annual matching, and analyzed for the saturation of available flexibility. Addressing this gap is the objective of this dissertation.

---

## References

[1] E. Masanet, A. Shehabi, N. Lei et al., "Recalibrating global data center energy-use estimates," *Science*, vol. 367, no. 6481, pp. 984–986, 2020, doi: 10.1126/science.aba3758. *(not yet read in full)*
[2] Z. Liu, A. Wierman, Y. Chen et al., "Data center demand response: Avoiding the coincident peak via workload shifting and local generation," *Performance Evaluation*, vol. 70, no. 10, pp. 770–791, 2013, doi: 10.1016/j.peva.2013.08.014.
[3] M. Chen, C. Gao, M. Song et al., "Internet data centers participating in demand response: A comprehensive review," *Renewable and Sustainable Energy Reviews*, vol. 117, Art. no. 109466, 2020, doi: 10.1016/j.rser.2019.109466.
[4] M. Chen, C. Gao, M. Shahidehpour et al., "Internet data center load modeling for demand response considering the coupling of multiple regulation methods," *IEEE Trans. Smart Grid*, vol. 12, no. 3, pp. 2060–2076, 2021, doi: 10.1109/TSG.2020.3048032.
[5] S. Kwon, L. Ntaimo, and N. Gautam, "Demand response in data centers: Integration of server provisioning and power procurement," *IEEE Trans. Smart Grid*, vol. 10, no. 5, pp. 4928–4938, 2019, doi: 10.1109/TSG.2018.2871125.
[6] M. Dabbagh, B. Hamdaoui, A. Rayes et al., "Shaving data center power demand peaks through energy storage and workload shifting control," *IEEE Trans. Cloud Comput.*, vol. 7, no. 4, pp. 1095–1108, 2019, doi: 10.1109/TCC.2017.2744623.
[7] J. Paananen, "Grid-interactive data centers enabling energy transition," *IEEE Electrific. Mag.*, vol. 11, no. 3, pp. 26–34, 2023, doi: 10.1109/MELE.2023.3291195.
[8] S. Li, L. Tong, and T. D. Mount, "Energy management for renewable-colocated artificial intelligence data centers," in *Proc. IEEE PES Int. Meeting*, 2026, pp. 1–5, doi: 10.1109/PESIM67009.2026.11439004.
[9] I. Riepin, T. Brown, and V. M. Zavala, "Spatio-temporal load shifting for truly clean computing," *Adv. Appl. Energy*, vol. 17, Art. no. 100202, 2025, doi: 10.1016/j.adapen.2024.100202.
[10] Q. Xu, W. Ricks, A. Manocha et al., "System-level impacts of voluntary carbon-free electricity procurement strategies," *Joule*, vol. 8, no. 2, pp. 374–400, 2024, doi: 10.1016/j.joule.2023.12.007.
[11] I. Riepin and T. Brown, "On the means, costs, and system-level impacts of 24/7 carbon-free energy procurement," *Energy Strategy Rev.*, vol. 54, Art. no. 101488, 2024, doi: 10.1016/j.esr.2024.101488.
[12] A. Bjørn, S. M. Lloyd, M. Brander et al., "Renewable energy certificates threaten the integrity of corporate science-based targets," *Nat. Clim. Change*, vol. 12, no. 6, pp. 539–546, 2022, doi: 10.1038/s41558-022-01379-5.
[13] G. J. Miller, K. Novan, and A. Jenn, "Hourly accounting of carbon emissions from electricity consumption," *Environ. Res. Lett.*, vol. 17, no. 4, Art. no. 044073, 2022, doi: 10.1088/1748-9326/ac6147.
[14] Y. Hwang, J. Lee, Y. Park et al., "Risk-aware planning for corporate renewable electricity procurement under hourly matching," *Energy*, vol. 367, Art. no. 142953, 2026, doi: 10.1016/j.energy.2026.142953.
[15] Y. J. Lee, E. J. Choi, and S. W. Kim, "Integrated procurement strategies for corporate renewable electricity: Combinations of direct PPA, energy storage, and market participation," *J. Electr. Eng. Technol.*, vol. 21, no. 4, pp. 3187–3198, 2026, doi: 10.1007/s42835-026-02807-8.
[16] M. Ludkovski, S. Mouti, and G. Swindle, "Least-cost structuring of 24/7 carbon-free electricity procurements," in *Proc. IEEE PES General Meeting*, 2024, pp. 1–5, doi: 10.1109/PESGM51994.2024.10688843.
[17] N. G. Paterakis, O. Erdinç, and J. P. S. Catalão, "An overview of demand response: Key-elements and international experience," *Renew. Sustain. Energy Rev.*, vol. 69, pp. 871–891, 2017, doi: 10.1016/j.rser.2016.11.167.
[18] X. Fei, C. Lyu, and Y. Ding, "Energy flexibility procurement strategy in competitive demand response markets: Dual-channel supply chain perspective," *Energy Econ.*, vol. 161, Art. no. 109542, 2026, doi: 10.1016/j.eneco.2026.109542.
[19] Z. Wu, X. Zhao, Y. Mao et al., "Flexibility quantification of desalination plants for demand response: An adaptive robust optimization methodology," *Appl. Energy*, vol. 373, Art. no. 123835, 2024, doi: 10.1016/j.apenergy.2024.123835.
[20] K. Alshehri and A. T. Al-Awami, "On the interplay between water and power grids: Desalination plants for demand response," in *Proc. IEEE PES General Meeting*, 2023, pp. 1–5, doi: 10.1109/PESGM52003.2023.10252990.
[21] I. Alsaleh, "Model-free reinforcement learning for demand response in PV-rich distribution systems," in *Proc. Saudi Arabia Smart Grid Conf. (SASG)*, 2022, pp. 1–5, doi: 10.1109/SASG57022.2022.10200928.
[22] R. Yang, C. Konstantinou, and Y. Hou, "Enabling grid-interactive data center-desalination coordination through thermo-electric coupling-based waste heat utilization," *Appl. Energy*, vol. 408, Art. no. 127428, 2026, doi: 10.1016/j.apenergy.2026.127428.
[23] M. Petitet, S. Wachon, and K. Khedim, "Evaluation and role of industrial demand response in Saudi Arabia," KAPSARC Discussion Paper, 2026, doi: 10.30573/KS--2026-DP17.
[24] Y. Chen and X. Zheng, "To defer or to shift? The role of AI data center flexibility on grid interconnection," in *Proc. ACM Sustainability Week (e-Energy)*, 2026, pp. 322–327, doi: 10.1145/3765611.3815593.
[25] R. O'Connell, A. Phadke, M. O'Boyle et al., "Carbon-free energy: How much, how soon?," *IEEE Power Energy Mag.*, vol. 19, no. 6, pp. 67–76, 2021, doi: 10.1109/MPE.2021.3104130.
[26] M. Li et al., "Beyond scalar flexibility: From eligible AI workloads to dependable load relief," arXiv:2609.05406, 2026.
[27] S. Khanal, G. Roh, B. Yao et al., "Shift or curtail? How much data-center flexibility is worth depends on the host power grid," arXiv:2608.19622, 2026.
