# External Energy Flexibility in Saudi Arabia: Status Quo, Comparison and Implementation Framework

*Working document for Chapter 3 (concept and accounting) and Chapter 5 (contracts and decision maps). Model numbers refer to a 100-MW data center in Riyadh at an 80% hourly-matching target (TPEC 2027 model, `tpec2027/results`). Market facts were checked in November 2026; sources are listed at the end, and third-party analyses are flagged where no official source was found.*

*Terminology: **displacement** X is the share of the data center's annual use freed on the grid hour by hour (PV injected in the same hour plus supply freed by flexible loads). The data center itself always takes 100% of its energy from the grid. The literature, and the TPEC paper, call the same number hourly matching (CFE).*

*Currency: all prices are in US dollars. Saudi sources quote SAR or halalas; these are converted at the fixed peg of 1 US$ = 3.75 SAR, so 1 halala/kWh = US$2.67/MWh. The original SAR value is kept in parentheses.*

---

## الملخص التنفيذي (بالعربي)

**الوضع الحالي:** مراكز البيانات في المملكة تتغذى اليوم من الشبكة عبر **السعودية للطاقة** (الشركة السعودية للكهرباء سابقًا) بتعريفة منظّمة. تعريفة الحوسبة السحابية **48 دولار/م.و.س** (18 هللة/ك.و.س) منذ 2021، والصناعية 53 دولار (20 هللة) وتصير 61 دولار (23 هللة) من يناير 2027. التوصيل يتم عبر **الشبكة الوطنية** (National Grid SA)، والاحتياط عبر UPS ومولدات في الموقع. الشبكة نفسها شبه كلها وقود أحفوري (غاز ونفط)، والمتجددة فوق 5% بقليل في 2025. ادعاءات "الطاقة النظيفة" اليوم تتم بشهادات I-REC سنوية، وهي مطابقة سنوية فقط: نظيفة على الورق و**40% ساعيًا** في الواقع. البدائل كلها محدودة:
- الاستهلاك الذاتي في نفس الموقع مسقوفه **50 ميجاواط**.
- لا يوجد إطار نشط للعقود الثنائية المباشرة.
- البطاريات مكلفة: 1,027 م.و.س لكل 100 ميجاواط عند 80%.
- لا يوجد إطار سعودي منشور لمجمّعي الأحمال أو الاستجابة للطلب.

**المصطلح:** نستخدم **نسبة الإزاحة**، وهي نسبة استهلاك المركز اللي تنفضى لها على الشبكة ساعة بساعة. المركز نفسه ياخذ 100% من الشبكة دائمًا، والشمسي يُباع كله لـ SPPC، والأحمال المرنة تفضّي نفس الكمية. نفس الرقم تسميه الأدبيات المطابقة الساعية.

**الحكم (25 سنة، الرياض ونيوم):** فكرتك هي الخيار الأفضل عند **إزاحة 85–97%** (الأمثل ≈ 90%)، ولمراكز من **≈ 8 ميجاواط إلى 1.5 جيجاواط** (أكبر مركز مخطط له؛ الأكبر مجموعات مراكز بنفس النتيجة). الشروط:
1. يشترط المركز اعتمادية الشبكة الكاملة.
2. الإزاحة 85–97%: ليالي الصيف تنفضى ≥ 93% والسقف ≈ 98% بشمسي ×1.25.
3. سعر المرونة أقل من ≈ 87 دولار/م.و.س مُزاحة.
4. المركز ≥ 8 ميجاواط، أو تتجمّع المراكز الصغيرة في عقد واحد. الأحمال المرنة من أي مكان على الشبكة الوطنية عبر المشغل، والمتاح وطنيًا (7.1–29.9 جيجاواط) أكبر من المراكز المخطط لها.
5. تُحسب قيمة تفضية الشبكة (125 دولار/ك.و/سنة) والكربون (50 دولار/طن)، أو تشتري SPPC الشمسي بـ ≈ 33 دولار/م.و.س (أقل من 48).

عند 90%: EEF ≈ 28 دولار/م.و.س فوق التعريفة، مقابل 31 (AM) و43 (الشبكة) و45 (البطارية).

**التطبيق:** الجهات هي:
- وزارة الطاقة: السياسة.
- الهيئة السعودية لتنظيم الكهرباء (SERA): التراخيص وقواعد الخط الأساسي والتسوية.
- الشركة السعودية لشراء الطاقة (المشتري الرئيس، SPPC): شراء إنتاج الطاقة الشمسية.
- السعودية للطاقة: البيع للمركز والعدادات.
- الشبكة الوطنية: التوصيل وفحص الشبكة والتشغيل.
- مُجمّع مرونة مرخّص (Aggregator): دور جديد.
- الأحمال المرنة: التحلية، التبريد المركزي، الضخ، الصناعة.
- هيئة الاتصالات والفضاء والتقنية (CST): تسجيل المركز وخطة الاستدامة.

يوقّع المركز ستة عقود (القسم 6). يدفع التعريفة كاملة كما هي، ويدفع **رسم خدمة EEF**: في الحالة الأساسية ≈ 17.3 مليون دولار/سنة، أي ≈ 19.8 دولار لكل م.و.س يستهلكها المركز (7.4 هللة/ك.و.س)، مقابل ≈ 30.2 مليون دولار (34.4 دولار/م.و.س) للبطارية. يحصل مقابلها على 80% إزاحة موثقة دون أي تغيير في اعتماديته (حالة ورقة TPEC؛ والموصى به 85–97%).

**حسب حجم المركز (القسم 4أ):**
- أقل من ≈ 8 ميجاواط: التكاليف الثابتة للعقد تطغى. الحل تجميع عدة مراكز صغيرة في عقد EEF واحد. ومع ذلك يغلب EEF البطارية من ≈ 2 ميجاواط.
- من ≈ 8 ميجاواط إلى 1.5 جيجاواط: **EEF الأفضل**. يوفّر ≈ 3.2 دولار/م.و.س مقابل أرخص بديل، و≈ 17 دولار/م.و.س مقابل البطارية (عند 90%).
- فوق 1.5 جيجاواط: مجموعات مراكز، والمنحنى ثابت فالنتيجة نفسها.

**لماذا الفكرة مهمة (درس تكساس):** طلبات ربط الأحمال الكبيرة في ERCOT قفزت من 233 جيجاواط (ديسمبر 2025) إلى ≈ 474 جيجاواط (منتصف 2026)، ≈ 90% منها مراكز بيانات. في أبريل 2026 كان 22 جيجاواط فقط قد استوفى متطلبات الدراسة. صدر قانون SB 6 (يونيو 2025) الذي يسمح بفصل الأحمال الكبيرة الجديدة في الطوارئ ويفرض دراسات ربط جديدة. EEF يحافظ على اعتمادية الشبكة الكاملة للمركز، ويخفض صافي حمل الليل على المنظومة بنحو 59% من حجم المركز (البطارية 49%). تنبيه: توصيلة المركز نفسها تبقى بكامل قدرته، لكن العبء على التوليد ليلًا يقل.

**سعر بيع الطاقة الشمسية:** لا يوجد سعر منشور لهذه الحالة. أسعار مناقصات NREP مرجع فقط، وسعر الفائض في إطار الاستهلاك الذاتي "تحدده الهيئة" ولم يُنشر. لذلك:
- نعتمد في الأطروحة **فرضية 13.6 دولار/م.و.س** (5.1 هللة)، وهي أقل بكثير من سعر الشراء من الشبكة (48 دولار).
- نوصي بإضافة **قاعدة سعر شراء من ثلاث درجات** إلى الإطار التنظيمي للهيئة (القسم 7ج).

---

## 1. How Saudi data centers are supplied today

| Route | How it works | Who is involved |
|---|---|---|
| **Grid supply (default)** | The data center (DC) is connected to the transmission or distribution network and buys all of its energy at a regulated tariff. | Saudi Energy (formerly Saudi Electricity Company, renamed Feb 2026) as supplier; National Grid SA for transmission connections; SERA approves tariffs. |
| **Tariff** | Public cloud-computing operators: **US$48/MWh (18 halalas/kWh)**, a reduced rate approved by the Council of Ministers in 2021 and still listed by Saudi Energy. Industrial: US$53.3/MWh (20 halalas/kWh), rising to **US$61.3/MWh (23 halalas/kWh) on 1 Jan 2027**. KAPSARC notes that the exact tariff for AI data centers "is yet to be decided". | Council of Ministers, SERA, Saudi Energy. |
| **Backup** | UPS for ride-through plus on-site backup generators (typically diesel) for outages; Tier III certification is required for CST's "Advanced" category. | DC operator; CST registration. |
| **"Green" claims** | Unbundled **I-REC** certificates: issuance in Saudi Arabia started in Q2 2024, and S&P Global Platts has assessed Saudi I-REC prices since Jan 2025. These certificates support **annual** matching only. | Accredited I-REC issuer; DC buys certificates. |
| **On-site renewables** | SERA's *Regulatory Framework for Renewable Energy for Self-Consumption* (ERD-TA-004, V02/23) sets these rules: generation and consumption **at the same facility in all cases** (Art. 3-5); **≤ 30 MW per facility** (Art. 5-1), raised to **50 MW in the Nov 2026 update**; connected capacity **≤ the facility's contracted load** (Art. 5-1(c)); mandatory **net billing**, in which energy counts as self-consumed only within the same metering period and surplus is credited at a SERA-set price valid 12 months (Art. 8); transmission-connected self-consumption capped at **3% of last year's national peak** (Art. 11-1); storage only if integrated, ≤ the PV's capacity and for self-consumption (Art. 11-4); a 20-year connection agreement (+5). A 100-MW constant load needs ≈ 477 MWp of PV for annual matching. | SERA (study permit and licence); the transmission service provider and principal buyer for transmission connections. |
| **Utility-scale renewables** | Built only through the **single buyer**: SPPC (the "Principal Buyer") tenders NREP projects and signs the PPAs. Round 6 solar tariffs were US$11.0–14.9/MWh (1.10–1.49 US¢/kWh); Round 4 was ≈ US$16.8/MWh. No in-force wheeling or bilateral regime for consumers was found. | Ministry of Energy (NREP), SPPC, IPPs. |
| **Off-grid PV + battery (a real design)** | An industry design for an off-grid ≈ 0.7-MW data center in Riyadh (2024; 6,000 MWh/yr, 924.6 kW peak) needs **6.25 MWp of PV, ≈ 9.1 kWp per kW** of load (EEF: 4.8). It **curtails 46%** of the possible PV output (5.88 of 12.68 GWh/yr) and serves 53% of the load from batteries. The module output is ≈ 85% of the original after 25 years. | private developer (design report shared with the author; not public) |
| **Dedicated / off-grid campuses** | Announced, e.g. the NEOM–Oxagon 1.5-GW campus "powered by solar, wind, on-site battery storage and hydrogen backup". Reports say it will initially draw power from thermal plants. | NEOM, DataVolt, HUMAIN. |
| **Large campus connections** | HUMAIN signed an electricity-provision agreement with National Grid SA for its Riyadh AI project (Sep 2026; no capacity published). HUMAIN targets 1.9 GW by 2030 and 6.6 GW by 2034 (KAPSARC). | National Grid SA, Saudi Energy, HUMAIN. |

**The grid behind the meter.** Saudi generation was 58.2% natural gas and 41.2% oil in 2022 (KAPSARC). Solar and wind rose above 5% in 2025 (MEES), against a target of 50% renewables by 2030. Existing data centers emitted ≈ 1.6 Mt CO₂ in 2024, which could reach 5.8–24 Mt by 2030 (KAPSARC).

## 2. Problems with the status quo

1. **Clean on paper only.** Annual I-RECs equal to annual use leave the night on gas and oil. In our Riyadh model, annual matching is **40.4%** hourly and emits **296 kt CO₂/yr** per 100 MW on an hourly basis, against 497.6 kt for plain grid supply.
2. **Hourly accounting is coming.** The GHG Protocol is revising Scope 2. One option adds hourly matching, deliverability and incrementality, and the new standard is expected in 2027. The outcome is contested (70% of 909 respondents opposed hourly matching), but large AI buyers already ask for 24/7 clean supply.
3. **Self-supply does not scale.** On-site renewables are capped at 30–50 MW per facility and at the facility's contracted load, are tied to the same premises, and are limited nationally to 3% of peak for transmission-connected systems. An off-grid design needs about twice the PV of annual matching and wastes almost half of it. A 100-MW to multi-GW AI campus cannot cover itself, and there is no in-force wheeling regime.
4. **Batteries are expensive at high matching.** Reaching 80% needs **1,027 MWh** per 100 MW (≈ 10 h of load), costing ≈ **US$30 M/yr** (US$18–49 M). Each further point of matching needs more storage.
5. **Off-grid campuses trade away grid-grade reliability or pay for it twice.** They need firm backup (hydrogen, gas) in addition to storage.
6. **Grid stress.** The grid was built for air-conditioning peaks. Multi-GW constant loads raise evening and night demand exactly when solar is absent, and connection lead times and transformer backlogs are binding (KAPSARC).
   - **The Texas lesson.**
     - ERCOT's large-load queue grew from more than 233 GW (Dec 2025, over 70% data centers) to about 474 GW (mid-2026, about 90% data centers).
     - In April 2026 only 22 GW had met ERCOT's study requirements.
     - Texas Senate Bill 6 (June 2025) lets transmission providers curtail non-critical new large loads in grid emergencies and adds new interconnection standards and batch studies. The PUCT rules are due by the end of 2026.
     - The queue figures differ across sources and dates and are not forecasts of what will be built.
   - **What EEF changes.**
     - EEF keeps the data center fully grid-connected, so it keeps grid-grade reliability.
     - It also cuts the system's net night load by ≈ 59% of the DC's size (battery: ≈ 49%), because the freed supply comes from loads that already exist.
     - The DC's own connection must still be sized for its full load. The relief is at system level (night generation and the shared network upstream), not at the DC's substation.
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
| Displacement target | **85–97%, best ≈ 90%** (summer evenings ≥ 93% freed; ceiling ≈ 98% with PV ×1.25 and the window from 09:00) | model |
| Flexibility price | **< ≈ US$87/MWh shifted** (US$51–146 across battery cost cases), or **< ≈ US$215/kW-yr** of contracted power | model |
| Flexible load on the national grid | **≈ 2.0 MW per MW of DC** at 90% (1.4 at 80%), shiftable for **≥ 8 h**, anywhere on the one national grid through the operator; the national potential (7.1–29.9 GW) exceeds planned DC capacity | model, KAPSARC 2026 |
| Data-center size | **≈ 8 MW to 1.5 GW** (largest single campus planned); smaller sites grouped in one contract | model |
| Grid room and carbon valued | reinforcement US$125/kW-yr + carbon US$50/t, or SPPC buys the EEF-linked PV at ≈ US$33/MWh | model, Section 7c |
| Hourly claims recognized | a registry that issues time-stamped credits | Section 7 |

EEF is **not** the best choice:
- If a site **below ≈ 8 MW** stands alone: group it with others in one EEF contract.
- If **neither grid room nor carbon is valued**: on the bill alone, grid supply or annual matching is cheaper.
- If **flexibility costs more than** the battery's annualized cost per MWh shifted, which can happen if batteries fall below ≈ US$100/kWh (break-even ≈ US$42/MWh).
- If the inter-regional ties cannot carry the freed supply at peak; the operator checks this in the daily schedule (C5).
- If only **annual** claims matter to the buyer, annual matching is cheapest, although it is clean only on paper.

Its worst case is annual matching with unchanged reliability, because control never touches the data center.

### 4a. The verdict: displacement curve and size curve

The planning LP is linear, so per-MW results do not depend on size. The verdict comes from two curves (`tpec2027/model/run_displacement.py`, `plot_displacement.py`, `plot_verdict.py`; figures `fig_displacement_curve.png`, `fig_verdict_curves.png`).

**Costs compared.** For each option, the 25-year annual-equivalent cost to the DC, on top of the US$48/MWh tariff that every option pays in full:
- PV sold to SPPC at its cost (NREP benchmark US$13.6/MWh), so PV nets to zero.
- Flexibility at US$50/MWh shifted (range US$25–75); battery at the NREL mid case.
- **Grid reinforcement** for load the DC adds on summer evenings (18:00–02:00): US$125/kW-yr (assumption, range 100–150).
- **Carbon** at US$50/t (assumption).
- A fixed overhead of US$0.25 M/yr per EEF contract.

**Displacement curve (100-MW DC, Riyadh; NEOM within ±0.5 US$/MWh):**

| Displacement | Flexible load per MW | Summer evenings freed | GRID | AM | Battery | **EEF** | PV price for EEF to win on the bill alone |
|---|---|---|---|---|---|---|---|
| 70% | 1.0 | 69% | 42.7 | 31.2 | 37.3 | **27.5** | US$25/MWh |
| 80% | 1.4 | 83% | 42.7 | 31.2 | 41.0 | **27.7** | US$29 |
| **85%** | 1.65 | 93% | 42.7 | 31.2 | 43.1 | **27.8** | US$31 |
| **90%** | 2.0 | 99% | 42.7 | 31.2 | 45.5 | **28.0** | US$33 |
| **95%** | 2.05 | 99.5% | 42.7 | 31.2 | 48.1 | **28.6** | US$35 |
| 97% | 2.3 | 99.8% | 42.7 | 31.2 | 50.3 | **28.9** | US$36 |

Costs are in US$/MWh of DC load. "EEF works" means EEF is the cheapest of the four **and** frees ≥ 90% of the DC's load on summer evenings. That holds at **85–97%**. The best point is ≈ 90%: the evenings are ≈ 100% freed and EEF saves ≈ US$3.2/MWh against the cheapest alternative and ≈ US$17/MWh against a battery.

**Why not 100%?** Riyadh and NEOM have only ≈ 14 dusty or cloudy days a year in the 2020 data. With PV equal to annual use, the gap comes mostly from the 5% shifting loss and short winter days; those 14 days explain only 15–21% of it. With PV ×1.25 and the window from 09:00, displacement reaches 98.1% (Riyadh) and 98.4% (NEOM). Two-thirds of the remaining 2% falls on the 14 low-sun days.

**Size curve (at 90%).** The only size effect is the fixed contract overhead, which adds US$28.5/MWh ÷ size in MW.
- **Below ≈ 8 MW:** the overhead dominates. Group small sites in one contract. EEF still beats a battery from ≈ 2 MW.
- **≈ 8 MW to 1.5 GW:** EEF is the best option. 1.5 GW is the largest single campus planned (NEOM–Oxagon).
- **Above 1.5 GW:** groups of campuses. The curve stays flat, so the result is the same.
- **Flexible load is not a limit here.** The Saudi grid is one interconnected system, and a DC can contract loads anywhere through the operator. The national potential (7.1–29.9 GW) exceeds planned DC capacity; a 1.5-GW campus needs ≈ 3 GW at 90%. Saturation is tested in Chapter 6.
- **Small DCs cannot self-supply either.** SERA caps on-site PV at the contracted load.

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
| C2 | **PV power purchase agreement** | PV IPP ↔ SPPC; the DC sponsors or co-invests, or signs an attribute-assignment agreement with SPPC | PV sized to the DC's annual use; all output injected; PPA price ≈ US$11–17/MWh; certificates assigned to the EEF registry account. |
| C3 | **EEF service agreement** | DC ↔ Aggregator | Hourly obligation: reduce the portfolio's consumption below baseline by up to the DC load, within the contracted Pᶠ and an energy-neutral 24-h window starting 06:00. Price = capacity fee (US$/kW-yr) + energy fee (US$/MWh shifted), capped below break-even. Performance penalties; term of 10–15 years; **no right to curtail the DC**. |
| C4 | **Flexibility agreements** | Aggregator ↔ each flexible load | Baseline method, up/down limits, notice times, energy neutrality, payment share, penalties, **water-security and safety override** for desalination and pumping. |
| C5 | **Dispatch and settlement protocol** | Aggregator ↔ National Grid SA (and SPPC) | Day-ahead schedule submission, network check, intraday updates, data exchange, monthly settlement statement. |
| C6 | **Registry and claims agreement** | Aggregator, DC ↔ registry (with SERA rules) | PV certificates to the absorbing loads; hourly freed-supply credits to the DC; cancellation for the DC's claims; no double counting with other services. |

## 7. Prices and money flows (per 100 MW, Riyadh, 80%)

```
                 tariff US$48/MWh × 876 GWh ≈ US$42.0 M/yr (unchanged)
   Data center ─────────────────────────────────────────────► Saudi Energy
        │  EEF fee: e.g. US$50/MWh × 346.7 GWh ≈ US$17.3 M/yr
        └──────────────────────────► Aggregator ──(payments − margin)──► Flexible loads
                                                                          (energy bill unchanged:
   PV IPP ◄── PPA ≈ US$11–17/MWh × 876 GWh ≈ US$9.6–14.9 M/yr ── SPPC      they move, not add, MWh)
   Registry ──► hourly credits for ≈ 700.8 GWh/yr (80%) ──► Data center
```

- **What the DC pays:** the same tariff bill as today, plus the EEF fee. At US$50/MWh shifted that is ≈ US$17.3 M/yr, about **US$19.8 per MWh of DC consumption (7.4 halalas/kWh)**. The battery route costs ≈ US$34.4/MWh (12.9 halalas/kWh). From 2027 the tariff part may rise to US$61.3/MWh (23 halalas) if the industrial class applies, but it does so for every option.
- **Ceiling price the DC should accept:** the break-even, ≈ US$87/MWh shifted or ≈ US$215/kW-yr for 140 MW (mid battery cost). Above it, the battery is cheaper.
- **What the flexible loads gain:** the payment share. Their annual energy use and tariff bill are unchanged because each window is energy-neutral. They need the ability to move consumption (storage of water or chilled water, process scheduling).
- **PV:** its cost is recovered by the SPPC PPA price, so it adds no net cost to any configuration.
- **Horizon:** results are annual equivalents over a **25-year horizon** (PV life). The battery is annualized over a 15-year life at 8% plus 2.5% fixed O&M. Re-computing over 25 years with one replacement at year 15 changes the battery cost by ≈ 1% (US$30.5 M vs US$30.2 M/yr).

### 7a. The data center's full bill, including PV sales (per 100 MW, 80%)

| US$ M/yr | GRID | AM | RE+BESS | EEF |
|---|---|---|---|---|
| Grid purchases (876 GWh × US$48/MWh) | 42.0 | 42.0 | 42.0 | 42.0 |
| PV plant cost (annualized) | — | ≈ 11.9 | ≈ 11.9 | ≈ 11.9 |
| PV sales to SPPC (876 GWh × US$13.6/MWh = 5.1 halalas/kWh) | — | −11.9 | −11.9 | −11.9 |
| Cost of hourly matching | — | — | 30.2 | 17.3 |
| **Net** | **42.0** | **42.0** | **72.2** | **59.4** |
| Net per MWh of DC use | US$48.0 | US$48.0 | US$82.4 | US$67.8 |

- **PV sales:** selling the PV output pays for the PV plant. At NREP-level prices (US$11–17/MWh, i.e. US$9.6–14.9 M/yr), sales ≈ the plant's annualized cost, so the net is ≈ 0.
- **Margin:** every US$1/MWh sold above the PV cost lowers the bill by ≈ US$0.9 M/yr.
- **Ranking:** the same PV sits in AM, RE+BESS and EEF, so the sale lowers all three equally and the ranking does not change.
- **Cost per tonne of CO₂ avoided relative to AM:** EEF ≈ US$88/t (US$50/MWh ÷ 0.568 t/MWh), battery ≈ US$153/t.

### 7c. Proposed rule for the PV purchase price (for the regulatory framework)

**Is there an official selling price today? No.**
- NREP tariffs are tender results for IPPs selling to SPPC. They are a benchmark, not a rule for a DC-linked plant.
- The SERA self-consumption framework credits surplus at a price "set by the Authority" for 12 months (Art. 8). That price is not published, and it applies only to on-site plants ≤ 50 MW.
- The dissertation therefore takes the selling price as an **assumption**: **US$13.6/MWh (5.1 halalas/kWh)**, the NREP benchmark. This is far below the DC's purchase price from the grid (US$48/MWh).
- It **recommends** that SERA add the rule below to its framework.

**Proposed rule.** SPPC buys the output of the EEF-linked PV plant under a 25-year PPA at a price set in three tiers:

| Tier | Price (US$/MWh; halalas/kWh in brackets) | Basis | Effect per 100 MW (EEF, 80%) |
|---|---|---|---|
| **1. Base (recommended)** | **NREP benchmark: the latest competitively bid tariff for the same technology and region.** Round 6: US$11.0–14.9 (4.1–5.6); base case **US$13.6 (5.1)** | Cost-reflective: SPPC pays what it pays any NREP plant, so other consumers are neutral | Sales ≈ PV cost → DC net **US$59.4 M/yr (US$67.8/MWh)** |
| **2. Optional system-value adder** | Up to **+US$19.8 → ≈ US$33.4 (12.5)** | Only if the grid benefits are shown to be worth at least the adder. Benefits: night net load cut by ≈ 59 MW per 100 MW, and midday PV absorbed instead of curtailed. To be quantified in Chapter 5 | At US$33.4 the DC pays **US$42.1 M/yr = the same as plain grid supply**, so 80% hourly clean supply costs it nothing extra |
| **3. Ceiling** | **Below the DC's own tariff:** US$48 (18) for cloud; US$61.3 (23) industrial from 2027 | Above it, the DC would profit from selling midday energy back above its purchase price, a cross-subsidy paid by other consumers | — |

**Sensitivity:**
- Every US$1/MWh of sale price is worth ≈ **US$0.88 M/yr** per 100 MW to the DC (1 halala/kWh ≈ US$2.3 M/yr).
- Below the PV's own cost (e.g. US$10.9/MWh, 4.1 halalas), the DC loses ≈ US$2.3 M/yr.
- The price **does not change which configuration wins**, because the same PV sits in AM, RE+BESS and EEF.

**Why not net metering at the tariff?** Valuing midday PV at US$48/MWh would make the DC's net bill ≈ US$29 M/yr while SPPC pays ≈ 3.5× the market value of midday solar. That is the "clean on paper" problem again, paid by other consumers.

### 7b. How much of the data center's use is shifted

EEF does **not** shift 100% of the data center's consumption. For a chosen hourly-matching target X, the LP finds the smallest contracted flexibility that meets Σd ≥ X·ΣL − Σmin(L,P).

| Target | Netted in the same hour | Shifted by the loads | Still from the grid mix | Pᶠ | Share of the night deficit shifted |
|---|---|---|---|---|---|
| 60% | 40.4% | 19.6% | 40.0% | 63 MW | 33% |
| **80%** | **40.4%** | **39.6% (346.7 GWh)** | **20.0%** | **140 MW** | **66%** |
| 90% | 40.4% | 49.6% | 10.0% | 203 MW | 83% |
| max | 40.4% | 50.7% | 8.8% | unlimited | 85% |

- **The three pillars:** reliability is 100% by design, emissions follow from the chosen X, and cost is minimized for that X.
- **Why the shift stops short of 100%:**
  - each day must balance (cloudy and winter days fall short)
  - 5% of the shifted energy is lost (η = 0.95)
  - every extra point needs more contracted flexibility
- **Load-side numbers at 80%:**
  - the loads absorb 364.9 GWh/yr of midday surplus to release 346.7 GWh/yr at night
  - they use ≈ 85% of their daily shifting capacity (950 of 1,123 MWh/day)
  - 61% of the deficit hours are fully covered, the rest partly (mostly winter nights)

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
| No rule to credit freed supply to a named consumer | Hourly accounting rule (Chapter 3): credit only verified freed supply, up to the DC's use, tied to equal PV absorption within the window | SERA net billing already matches energy within a metering period (ERD-TA-004, Art. 8-3) |
| Single-buyer market limits bilateral deals | Run EEF through SPPC and the regulated supplier (C2, C5); no wheeling needed | NREP PPAs |
| AI-DC tariff not yet decided | Keep EEF tariff-neutral: all options pay the same energy tariff | KAPSARC 2025 |
| Water security | Priority override for desalination and pumping in C4; the aggregator covers shortfalls | this work |
| No purchase price for EEF-linked PV | Three-tier rule (Section 7c): NREP benchmark as base, optional system-value adder, ceiling below the DC's tariff | NREP tenders; SERA net billing (Art. 8) |

## 10. Why linear programming

- **Linear physics.** At the planning stage every relation is linear in the hourly variables: energy balance, power limits, and the shifted-energy state with efficiency η. No on/off decisions are needed, so MILP adds cost without accuracy.
- **Guaranteed global optimum.** Each run returns the true minimum flexibility, or the true minimum battery, for the target, not a heuristic estimate. GA and PSO give no such guarantee.
- **One exact question per run:**
  - max matching for a given Pᶠ
  - min Pᶠ for a target X
  - min battery E for a target X

  The break-even price is π\* = C_B / Σd.
- **Fast at full resolution.** 8,760 hours give ≈ 26,000 variables per run. HiGHS solves one run in 0.2–1.6 s, which makes sweeps, two sites and decision maps cheap.
- **Fair and reproducible.** The battery and EEF are sized with the same method, on the same data, with an open solver.
- **Limitation.** Perfect foresight makes the results an upper bound on matching. Chapter 4 adds stochastic and robust day-ahead scheduling with intraday MPC.
- **Simulation tools** (e.g., PV design software) evaluate a given design but do not find the minimum. The off-grid design in Section 1 is an example: it curtails 46% of its PV.

## 11. Cost basis and project horizon

- **Horizon:** 25 years, the PV plant life. Results are reported as **annual equivalent costs**.
- **Shared items cancel.** The PV plant (same 477 MWp in AM, RE+BESS and EEF) and the grid tariff (876 GWh/yr at the same price in all four) are identical across configurations. The comparison is therefore the yearly cost of covering the night.
- **Battery:** C_B = c_E · E · (CRF + φ), where CRF = r / (1 − (1 + r)^−n), with r = 8%, n = 15 yr (CRF = 0.1168) and φ = 2.5%.
  - Capital: 1,027 MWh × US$207/kWh = US$212.6 M.
  - Annual cost: US$212.6 M × 0.1418 = **US$30.2 M/yr**.
- **EEF:** no capital; 346.7 GWh/yr × US$50/MWh = **US$17.3 M/yr**.
- **Check over 25 years:** explicit cash flows, with the battery replaced at year 15 and 5 years of remaining life salvaged at year 25, give US$30.5 M/yr (+1%).
- **Present value at 8% over 25 years:** battery ≈ US$326 M, EEF ≈ US$185 M.
- **Sensitivities in the dissertation:**
  - PV degradation (≈ 0.5–0.6%/yr; ≈ 85% of the original output after 25 yr in the 2024 Riyadh design)
  - battery degradation and replacement timing
  - price escalation
  - discount rate of 6/8/10%
  - horizons of 20 and 30 years

## 12. Gap register for the dissertation

| Gap | How it is closed | Where |
|---|---|---|
| Status quo of Saudi DC supply not described | Section 1–2 here; new film scene | this document, film |
| Comparison with today's practice | Section 3 (GRID = today's default, AM = today's I-REC claims) | here, Ch. 3 |
| When EEF is best | Section 4 conditions and thresholds | here, Ch. 5 |
| Implementation, contracts, prices, responsible entities | Sections 5–9 | here, Ch. 5 |
| Project horizon unclear | 25-year horizon with annualized costs, shared items cancel, 25-yr check (+1%) and present values (Section 11) | here, paper table, film |
| Why linear programming | Section 10; alternatives and where they fit | here, film |
| Self-supply route | SERA self-consumption rules (Section 1) and a real off-grid design | here, film |
| Second site | NEOM–Oxagon case (`run_sites.py`) | film, Ch. 3 |
| Saturation | first-order estimate now; system model in Ch. 6 | film, Ch. 6 |
| Where EEF wins (displacement and size) | Section 4a: displacement curve and size curve (`run_displacement.py`, `plot_verdict.py`); film scenes | here, film, Ch. 5 |
| Grid reinforcement and carbon values | assumptions now (US$125/kW-yr, US$50/t); Saudi values needed | Ch. 5 |
| Grid-burden rationale | Texas lesson (Section 2, item 6) and the night-load cut | here, film |
| PV selling price | No official price: assumption US$13.6/MWh plus a proposed SERA rule (Section 7c) | here, film |
| **Still open (needs data or a decision outside this work)** | Real flexibility costs from loads; SERA position on aggregators and hourly credits; the final AI-DC tariff; GHG Protocol outcome (2027) | Ch. 4–6, interviews with SERA, SPPC, Saudi Energy, SWA |

## 13. Recommendations

1. **Size.** Use EEF for data centers from ≈ 8 MW up to the largest campus planned (1.5 GW). Group smaller sites under one aggregator contract; groups of campuses get the same result.
2. **Displacement.** Target 85–97%, best at ≈ 90%: the summer evenings are then ≈ 100% freed and EEF is the cheapest of the four options over 25 years.
3. **Flexibility to contract.** About 2.0 MW of flexible load per MW of DC at 90% (1.4 at 80%), shiftable for ≥ 8 h within the day, anywhere on the national grid through the operator.
4. **Shifting window and PV.** Start the daily energy-neutral window at ≈ 09:00 rather than 06:00. Above 90%, oversize PV by ≈ 25% (ceiling ≈ 98%).
5. **Prices.**
   - Pay flexibility below ≈ US$87/MWh shifted (≈ US$215/kW-yr).
   - SPPC buys the EEF-linked PV at US$13.6/MWh (NREP benchmark). Raise it toward ≈ US$33/MWh only to pay for the grid room EEF frees. It always stays below the US$48/MWh purchase tariff.
6. **Grid.** Report the summer-evening load freed next to emissions and cost, because it is EEF's main system benefit. Still size the DC's own connection for its full load, and have the operator check inter-regional transfers.
7. **Regulation (SERA).** Add four things to the framework:
   - an aggregator licence
   - baseline and M&V rules
   - hourly certificates and a rule for crediting freed supply
   - the PV purchase-price rule of Section 7c, valuing the grid room EEF frees

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
- ERCOT large-load queue and study status: https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf ; https://www.utilitydive.com/news/ercots-large-load-queue-jumped-almost-300-last-year/808820/ ; https://www.latitudemedia.com/news/ercots-large-load-queue-has-nearly-quadrupled-in-a-single-year/
- Texas Senate Bill 6 (2025): https://www.sidley.com/en/insights/publications/2025/11/how-new-law-transforms-large-load-power-projects-in-texas ; KAPSARC's summary (citing Paz 2025): https://www.kapsarc.org/media/ip0dt4i1/dp00503-v1.pdf
- Battery cost by size (no clear small-system premium): NREL ATB 2024, utility-scale battery storage: https://atb.nrel.gov/electricity/2024/utility-scale_battery_storage

- SERA, *Regulatory Framework for Renewable Energy for Self-Consumption* (ERD-TA-004, V02/23, Dhu al-Qadah 1444 H), Arabic edition, provided by the author; Nov 2026 update raising the cap to 50 MW (pv magazine, above)
- Energy+Environmental Economics (E3), *Load Growth Is Here to Stay, but Are Data Centers?* (July 2024). There is no 2026 edition. E3's newer papers, *Forecasting Large Loads in the Age of AI and Data Centers* (Dec 2025) and *Tailored for Scale* (Dec 2025, large-load rate design), are at https://www.ethree.com/data-center-load-growth/ but could not be read from this environment (host blocked).

Third-party analyses (no official confirmation found; use with care):
- HUMAIN – National Grid SA agreement and power constraints: https://vision2030.ai/analysis/saudi-ai-data-centre-power-agreements-september-2026/ ; https://vision2030.ai/analysis/saudi-arabia-ai-power-constraint-not-chips/
