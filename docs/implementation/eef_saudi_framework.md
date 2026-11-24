# External Energy Flexibility in Saudi Arabia: Status Quo, Comparison and Implementation Framework

*Working document for Chapter 3 (concept and accounting) and Chapter 5 (contracts and decision maps). Model numbers refer to a 100-MW data center in Riyadh at an 80% hourly-matching target (TPEC 2027 model, `tpec2027/results`). Market facts were checked in November 2026; sources are listed at the end, and third-party analyses are flagged where no official source was found.*

---

## الملخص التنفيذي (بالعربي)

**الوضع الحالي:** مراكز البيانات في المملكة تتغذى اليوم من الشبكة عبر **السعودية للطاقة** (الشركة السعودية للكهرباء سابقًا) بتعريفة منظّمة. تعريفة الحوسبة السحابية **18 هللة/ك.و.س** منذ 2021، والصناعية 20 هللة وتصير 23 هللة من يناير 2027. التوصيل يتم عبر **الشبكة الوطنية** (National Grid SA)، والاحتياط عبر UPS ومولدات في الموقع. الشبكة نفسها شبه كلها وقود أحفوري (غاز ونفط)، والمتجددة فوق 5% بقليل في 2025. ادعاءات "الطاقة النظيفة" اليوم تتم بشهادات I-REC سنوية، وهي مطابقة سنوية فقط: نظيفة على الورق و**40% ساعيًا** في الواقع. البدائل كلها محدودة:
- الاستهلاك الذاتي في نفس الموقع مسقوفه **50 ميجاواط**.
- لا يوجد إطار نشط للعقود الثنائية المباشرة.
- البطاريات مكلفة: 1,027 م.و.س لكل 100 ميجاواط عند 80%.
- لا يوجد إطار سعودي منشور لمجمّعي الأحمال أو الاستجابة للطلب.

**متى تكون فكرتك الأفضل:** حين يتحقق ما يلي:
1. يشترط المركز اعتمادية الشبكة الكاملة.
2. الهدف ساعي بين 60 و90%.
3. سعر المرونة أقل من نقطة التعادل (≈ 87 دولار/م.و.س مُزاحة، أو ≈ 215 دولار/ك.و/سنة).
4. تتوفر في نفس المنطقة أحمال مرنة بنحو 1.4 ميجاواط لكل ميجاواط من المركز، بمدة ≥ 8 ساعات.
5. تُعترف المطابقة الساعية في الحسابات.

خارج هذه الشروط يكون الأفضل خليطًا، أو المطابقة السنوية، أو التخزين.

**التطبيق:** الجهات هي:
- وزارة الطاقة: السياسة.
- الهيئة السعودية لتنظيم الكهرباء (SERA): التراخيص وقواعد الخط الأساسي والتسوية.
- الشركة السعودية لشراء الطاقة (المشتري الرئيس، SPPC): شراء إنتاج الطاقة الشمسية.
- السعودية للطاقة: البيع للمركز والعدادات.
- الشبكة الوطنية: التوصيل وفحص الشبكة والتشغيل.
- مُجمّع مرونة مرخّص (Aggregator): دور جديد.
- الأحمال المرنة: التحلية، التبريد المركزي، الضخ، الصناعة.
- هيئة الاتصالات والفضاء والتقنية (CST): تسجيل المركز وخطة الاستدامة.

يوقّع المركز ستة عقود (القسم 6). يدفع التعريفة كاملة كما هي، ويدفع **رسم خدمة EEF**: في الحالة الأساسية ≈ 17.3 مليون دولار/سنة، أي ≈ 7.4 هللة لكل ك.و.س يستهلكها المركز، مقابل ≈ 30.2 مليون دولار للبطارية. يحصل مقابلها على 80% مطابقة ساعية موثقة دون أي تغيير في اعتماديته.

---

## 1. How Saudi data centers are supplied today

| Route | How it works | Who is involved |
|---|---|---|
| **Grid supply (default)** | The data center (DC) is connected to the transmission or distribution network and buys all of its energy at a regulated tariff. | Saudi Energy (formerly Saudi Electricity Company, renamed Feb 2026) as supplier; National Grid SA for transmission connections; SERA approves tariffs. |
| **Tariff** | Public cloud-computing operators: **18 halalas/kWh (≈ US$48/MWh)**, a reduced rate approved by the Council of Ministers in 2021 and still listed by Saudi Energy. Industrial: 20 halalas/kWh, rising to **23 halalas/kWh on 1 Jan 2027**. KAPSARC notes that the exact tariff for AI data centers "is yet to be decided". | Council of Ministers, SERA, Saudi Energy. |
| **Backup** | UPS for ride-through plus on-site backup generators (typically diesel) for outages; Tier III certification is required for CST's "Advanced" category. | DC operator; CST registration. |
| **"Green" claims** | Unbundled **I-REC** certificates: issuance in Saudi Arabia started in Q2 2024, and S&P Global Platts has assessed Saudi I-REC prices since Jan 2025. These certificates support **annual** matching only. | Accredited I-REC issuer; DC buys certificates. |
| **On-site renewables** | SERA's self-consumption framework now covers systems **up to 50 MW** (raised from 2 MW, Nov 2026), with net billing, but generation and consumption must be **at the same facility**. A 100-MW constant load needs ≈ 477 MWp of PV. | SERA (generation licence above 2 MW). |
| **Utility-scale renewables** | Built only through the **single buyer**: SPPC (the "Principal Buyer") tenders NREP projects and signs the PPAs. Round 6 solar tariffs were 1.10–1.49 US¢/kWh; Round 4 was ≈ 1.68 ¢/kWh. No in-force wheeling or bilateral regime for consumers was found. | Ministry of Energy (NREP), SPPC, IPPs. |
| **Dedicated / off-grid campuses** | Announced, e.g. the NEOM–Oxagon 1.5-GW campus "powered by solar, wind, on-site battery storage and hydrogen backup". Reports say it will initially draw power from thermal plants. | NEOM, DataVolt, HUMAIN. |
| **Large campus connections** | HUMAIN signed an electricity-provision agreement with National Grid SA for its Riyadh AI project (Sep 2026; no capacity published). HUMAIN targets 1.9 GW by 2030 and 6.6 GW by 2034 (KAPSARC). | National Grid SA, Saudi Energy, HUMAIN. |

**The grid behind the meter.** Saudi generation was 58.2% natural gas and 41.2% oil in 2022 (KAPSARC). Solar and wind rose above 5% in 2025 (MEES), against a target of 50% renewables by 2030. Existing data centers emitted ≈ 1.6 Mt CO₂ in 2024, which could reach 5.8–24 Mt by 2030 (KAPSARC).

## 2. Problems with the status quo

1. **Clean on paper only.** Annual I-RECs equal to annual use leave the night on gas and oil. In our Riyadh model, annual matching is **40.4%** hourly and emits **296 kt CO₂/yr** per 100 MW on an hourly basis, against 497.6 kt for plain grid supply.
2. **Hourly accounting is coming.** The GHG Protocol is revising Scope 2. One option adds hourly matching, deliverability and incrementality, and the new standard is expected in 2027. The outcome is contested (70% of 909 respondents opposed hourly matching), but large AI buyers already ask for 24/7 clean supply.
3. **Self-supply does not scale.** On-site renewables are capped at 50 MW and tied to the same premises. A 100-MW to multi-GW AI campus cannot cover itself, and there is no in-force wheeling regime.
4. **Batteries are expensive at high matching.** Reaching 80% needs **1,027 MWh** per 100 MW (≈ 10 h of load), costing ≈ **US$30 M/yr** (US$18–49 M). Each further point of matching needs more storage.
5. **Off-grid campuses trade away grid-grade reliability or pay for it twice.** They need firm backup (hydrogen, gas) in addition to storage.
6. **Grid stress.** The grid was built for air-conditioning peaks. Multi-GW constant loads raise evening and night demand exactly when solar is absent, and connection lead times and transformer backlogs are binding (KAPSARC).
7. **Unused flexibility.** An estimated 7.1–29.9 GW of industrial demand response exists by 2030 (KAPSARC 2026). Reverse osmosis is about half of Saudi desalination capacity and can shift load (IEA). But **no Saudi demand-response or aggregator framework** was found, and DR is procured, if at all, only for system services.

## 3. Status quo vs. EEF (per 100 MW, 80% target, Riyadh)

| | Grid only (today's default) | Grid + annual I-RECs (today's "green") | PV + battery | **EEF** |
|---|---|---|---|---|
| Data-center load served | 100% | 100% | 100% | **100%** |
| Hourly matching | 0% | 40.4% | 80% | **80%** |
| Emissions (kt CO₂/yr, hourly) | 497.6 | 296.4 | 99.5 | **99.5** |
| New storage | — | — | 1,027 MWh | **none** |
| Cost of hourly matching (US$ M/yr) | — | — | 30.2 (18.1–49.2) | **17.3 (8.7–26.0)** |
| Net grid load, night 0–5 h (MW) | 100 | 100 | 50.8 | **40.7** |
| Needs new regulation? | no | no | no (storage licence) | **yes: aggregator, M&V, hourly credits** |

Every configuration buys the same 876 GWh/yr at the same tariff, so tariff changes (e.g., 2027) shift all of them equally and do not change the ranking.

## 4. When is EEF the best choice?

EEF dominates when **all** of the following hold. The thresholds come from the preliminary model.

| Condition | Threshold (Riyadh, 80%) | Source |
|---|---|---|
| The DC must keep grid-grade reliability | always grid-connected | concept |
| Hourly-matching target | between ≈ 60% and ≈ 90% (ceiling 91.2% Riyadh, 89.5% NEOM with daily shifting) | model |
| Flexibility price | **< ≈ US$87/MWh shifted** (US$51–146 across battery cost cases), or **< ≈ US$215/kW-yr** of contracted power | model |
| Flexibility available in the same grid region | **≈ 1.4 MW per MW of DC** for 80% (≈ 2.0 for 90%), shiftable for **≥ 8 h** within a day | model |
| National pool not saturated | first-order: 80% saturates at ≈ 5–21 GW of data centers; the 1.5-GW national target needs 2.1 GW | model, KAPSARC 2026 |
| Hourly claims recognized | a registry that issues time-stamped credits | Section 7 |

EEF is **not** the best choice:
- If the target is **above ≈ 90%**: add PV oversizing (+25% PV gives 93.1%) or a small battery, i.e. a hybrid.
- If **flexibility costs more than** the battery's annualized cost per MWh shifted, which can happen if batteries fall below ≈ US$100/kWh (break-even ≈ US$42/MWh).
- If **local flexibility is scarce or network-constrained** around the DC.
- If only **annual** claims matter to the buyer, annual matching is cheapest, although it is clean only on paper.

Its worst case is annual matching with unchanged reliability, because control never touches the data center.

## 5. Who is responsible: actors and roles

| Actor | Role in EEF | Status |
|---|---|---|
| **Ministry of Energy** | Policy owner (NREP, 50% renewables, Liquid Displacement); can designate EEF as a recognized clean-supply route. | existing |
| **SERA** (Saudi Electricity Regulatory Authority; formerly ECRA, then WERA) | Licenses the aggregator (new licence category or exemption under the Implementing Regulation); approves baseline and M&V rules, settlement and consumer protection; approves tariffs. | **new rules needed** |
| **SPPC** (Principal Buyer) | Signs the PV PPA (NREP-style); can host EEF procurement at system level and assign the PV attributes. | existing (role extended) |
| **Saudi Energy** (formerly SEC) | Supplier and distribution network: supplies the DC at tariff, installs interval meters, provides baseline data, bills flexible loads as usual. | existing |
| **National Grid SA** | Transmission connection; network check of day-ahead EEF schedules; real-time dispatch priority. | existing (new procedure) |
| **Aggregator** | Contracts, schedules and settles the flexible-load portfolio for the DC; carries delivery risk. Could be an energy-services company, a Saudi Energy unit or the DC's energy arm. | **new licence** |
| **Flexible loads** | RO desalination and water transmission (Saudi Water Authority, SWPC projects), district cooling with TES (SERA-licensed under the Electricity Law), water pumping, industry. | existing assets |
| **Certificate registry** | Issues PV certificates to the absorbing loads and freed-supply credits to the DC, hourly. | **hourly product needed** (I-REC exists, annual) |
| **CST** | Registers the DC; its required energy-management and sustainability plan can cite EEF. | existing |
| **PV developer / IPP** | Builds PV ≈ the DC's annual use (477 MWp per 100 MW in Riyadh) and sells all output to SPPC. | existing |

## 6. The contract chain: who signs what with whom

| # | Contract | Parties | Key terms |
|---|---|---|---|
| C1 | **Connection and supply agreement** | DC ↔ Saudi Energy (and National Grid SA for a transmission connection) | 100% of consumption at the regulated tariff; firm supply; **unchanged by EEF**. |
| C2 | **PV power purchase agreement** | PV IPP ↔ SPPC; the DC sponsors or co-invests, or signs an attribute-assignment agreement with SPPC | PV sized to the DC's annual use; all output injected; PPA price ≈ 1.1–1.7 US¢/kWh; certificates assigned to the EEF registry account. |
| C3 | **EEF service agreement** | DC ↔ Aggregator | Hourly obligation: reduce the portfolio's consumption below baseline by up to the DC load, within the contracted Pᶠ and an energy-neutral 24-h window starting 06:00. Price = capacity fee (US$/kW-yr) + energy fee (US$/MWh shifted), capped below break-even. Performance penalties; term of 10–15 years; **no right to curtail the DC**. |
| C4 | **Flexibility agreements** | Aggregator ↔ each flexible load | Baseline method, up/down limits, notice times, energy neutrality, payment share, penalties, **water-security and safety override** for desalination and pumping. |
| C5 | **Dispatch and settlement protocol** | Aggregator ↔ National Grid SA (and SPPC) | Day-ahead schedule submission, network check, intraday updates, data exchange, monthly settlement statement. |
| C6 | **Registry and claims agreement** | Aggregator, DC ↔ registry (with SERA rules) | PV certificates to the absorbing loads; hourly freed-supply credits to the DC; cancellation for the DC's claims; no double counting with other services. |

## 7. Prices and money flows (per 100 MW, Riyadh, 80%)

```
                 tariff 18 h/kWh × 876 GWh ≈ US$42.0 M/yr (unchanged)
   Data center ─────────────────────────────────────────────► Saudi Energy
        │  EEF fee: e.g. US$50/MWh × 346.7 GWh ≈ US$17.3 M/yr
        └──────────────────────────► Aggregator ──(payments − margin)──► Flexible loads
                                                                          (energy bill unchanged:
   PV IPP ◄── PPA ≈ 1.1–1.7 ¢/kWh × 876 GWh ≈ US$9.6–14.9 M/yr ── SPPC      they move, not add, MWh)
   Registry ──► hourly credits for ≈ 700.8 GWh/yr (80%) ──► Data center
```

- **What the DC pays:** the same tariff bill as today, plus the EEF fee. At US$50/MWh shifted that is ≈ US$17.3 M/yr, about **US$19.8 per MWh of DC consumption (≈ 7.4 halalas/kWh)**. The battery route costs ≈ US$34.4/MWh (≈ 12.9 halalas/kWh). From 2027 the tariff part may rise (23 halalas if the industrial class applies), but it does so for every option.
- **Ceiling price the DC should accept:** the break-even, ≈ US$87/MWh shifted or ≈ US$215/kW-yr for 140 MW (mid battery cost). Above it, the battery is cheaper.
- **What the flexible loads gain:** the payment share. Their annual energy use and tariff bill are unchanged because each window is energy-neutral. They need the ability to move consumption (storage of water or chilled water, process scheduling).
- **PV:** its cost is recovered by the SPPC PPA price, so it adds no net cost to any configuration.
- **Horizon:** results are annual equivalents over a **25-year horizon** (PV life). The battery is annualized over a 15-year life at 8% plus 2.5% fixed O&M. Re-computing over 25 years with one replacement at year 15 changes the battery cost by ≈ 1% (US$30.5 M vs US$30.2 M/yr).

## 8. Step by step: what a data-center developer does

1. **Register** the DC with CST; request the grid connection (National Grid SA / Saudi Energy) and sign C1.
2. **Size the PV** at about the DC's annual consumption (×1.0–1.25) and sponsor it through an SPPC PPA (C2).
3. **Assemble the portfolio** with an aggregator: about 1.4 MW of flexible load per MW of DC for 80%, shiftable for ≥ 8 h, in the same grid region. Run the planning model (Chapter 3) for the exact numbers.
4. **Agree baselines and M&V** with Saudi Energy (interval meters), under SERA-approved rules.
5. **Sign the EEF service agreement** (C3) at a price below break-even, with the flexibility agreements (C4) behind it.
6. **Operate:** day-ahead schedule → network check by National Grid SA (C5) → intraday MPC correction → monthly settlement and hourly credits (C6).
7. **Report:** CST sustainability plan; Scope 2 under both annual and hourly methods.

## 9. Regulatory gaps to close at national level

| Gap | Proposed solution | Precedent |
|---|---|---|
| No aggregator / DR licence in KSA | SERA licence category for flexibility aggregators | Abu Dhabi DoE aggregator licensing framework (Nov 2026); its 2025 pilot cut peak demand by up to 401 MW |
| No baseline / M&V standard | SERA standard for baselines and verification of load shifts | DR baseline practice (Ch. 2) |
| Certificates are annual (I-REC) | Hourly, time-stamped certificates, or an hourly extension of I-REC | EnergyTag granular certificates |
| No rule to credit freed supply to a named consumer | Hourly accounting rule (Chapter 3): credit only verified freed supply, up to the DC's use, tied to equal PV absorption within the window | this work |
| Single-buyer market limits bilateral deals | Run EEF through SPPC and the regulated supplier (C2, C5); no wheeling needed | NREP PPAs |
| AI-DC tariff not yet decided | Keep EEF tariff-neutral: all options pay the same energy tariff | KAPSARC 2025 |
| Water security | Priority override for desalination and pumping in C4; the aggregator covers shortfalls | this work |

## 10. Gap register for the dissertation

| Gap | How it is closed | Where |
|---|---|---|
| Status quo of Saudi DC supply not described | Section 1–2 here; new film scene | this document, film |
| Comparison with today's practice | Section 3 (GRID = today's default, AM = today's I-REC claims) | here, Ch. 3 |
| When EEF is best | Section 4 conditions and thresholds | here, Ch. 5 |
| Implementation, contracts, prices, responsible entities | Sections 5–9 | here, Ch. 5 |
| Project horizon unclear | 25-year horizon with annualized costs stated; sensitivity ≈ 1% | here, paper table, film |
| Second site | NEOM–Oxagon case (`run_sites.py`) | film, Ch. 3 |
| Saturation | first-order estimate now; system model in Ch. 6 | film, Ch. 6 |
| **Still open (needs data or a decision outside this work)** | Real flexibility costs from loads; SERA position on aggregators and hourly credits; the final AI-DC tariff; GHG Protocol outcome (2027) | Ch. 4–6, interviews with SERA, SPPC, Saudi Energy, SWA |

---

## Sources

Official or primary:
- Saudi Energy rebrand (EGM, 25 Feb 2026): https://www.argaam.com/en/article/articledetail/id/1883292
- Cloud-computing tariff, 18 halalas/kWh (2021): https://www.arabnews.pk/node/1825521 ; Saudi Energy tariff page: https://www.se.com.sa/en/Ourservices/ColumnC/Bills-and-Consumption/ConsumptionTariffs
- Tariff revision effective 1 Jan 2027: https://saudigazette.com.sa/article/665754/saudi-arabia/saudi-arabia-announces-revised-electricity-water-and-wastewater-tariffs-effective-january-1-2027
- KAPSARC, *AI and Energy: The Future of Data Centers in Saudi Arabia* (2025): https://www.kapsarc.org/media/ip0dt4i1/dp00503-v1.pdf
- SERA self-consumption expanded to 50 MW (Nov 2026): http://www.pv-magazine.com/2026/11/23/saudi-arabia-expands-self-consumption-rules-to-50-mw/ ; https://www.aleqt.com/الطاقة/السعودية-ترفع-سقف-الطاقة-المتجددة-للاستهلاك-الذاتي-إلى-50-ميجاواط-16418
- Market structure, SPPC single buyer, National Grid SA, SERA: https://chambers.com/practice-guides/guides/power-generation-transmission-distribution-2026/saudi-arabia/law-and-practice
- NREP Round 6 solar tariffs: https://www.pv-magazine.com/2025/10/28/saudi-arabia-awards-3-gw-of-solar-in-sixth-renewables-tender-round/ ; https://taiyangnews.info/markets/saudi-arabia-concludes-nrep-round-6 ; Round 4: https://zawya.com/en/business/energy/saudis-sppc-signs-power-purchase-agreement-for-1100-mw-al-henakiyah-solar-pv-project-cotlr39g
- Saudi I-REC issuance and prices: https://www.spglobal.com/energy/en/pricing-benchmarks/our-methodology/subscriber-notes/012725-platts-launches-saudi-arabian-i-recs-price-assessments-adding-to-global-coverage ; https://www.mei.edu/publications/measure-verify-certify-how-future-proof-gulf-companies-energy-transition
- CST Data Center Services Regulations (in force 1 Jan 2024): https://www.cst.gov.sa/en/media-center/news/CST-Announces-that-the-Data-Center-Services-Regulations-Document-has-Entered-Into-Force ; https://www.gtlaw.com/en/insights/2026/1/saudi-arabias-data-centre-expansion-regulatory-framework-and-strategic-considerations
- District cooling licensing under SERA: https://qanoniah.com/en/File/k2B9GepwYjo5gKV7OEaQW0bK6-Implementing-Regulation-of-the-Electricity-Law-concerning-the-tasks-of-the-Saudi-Electricity-Regulatory-Authority
- Abu Dhabi aggregator licensing framework (Nov 2026): https://www.wam.ae/en/article/c363dxt-abu-dhabi-department-energy-issues-energy
- GHG Protocol Scope 2 update status: https://ghgprotocol.org/blog/scope-2-market-based-method-update-2025-2026-public-consultation-current-status ; https://www.argusmedia.com/en/news-and-insights/latest-market-news/2858486-ghg-protocol-faces-pushback-on-scope-2-reforms
- Desalination flexibility (RO ≈ half of capacity): https://www.iea.org/commentaries/desalinated-water-affects-the-energy-equation-in-the-middle-east
- Renewable generation 2025: https://www.mees.com/index.php/2026/6/19/power-water/saudi-renewable-generation-doubled-to-25twh-last-year/0a59f370-6bdd-11f1-a35f-899191c3f67e

Third-party analyses (no official confirmation found; use with care):
- HUMAIN – National Grid SA agreement and power constraints: https://vision2030.ai/analysis/saudi-ai-data-centre-power-agreements-september-2026/ ; https://vision2030.ai/analysis/saudi-arabia-ai-power-constraint-not-chips/
