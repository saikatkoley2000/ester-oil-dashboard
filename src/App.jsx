import { useState, useMemo } from "react";

const N = "#1B3358";
const NM = "#264573";
const G = "#B8962E";
const GL = "#D4AF52";
const W = "#FFFFFF";
const OW = "#F5F7FA";
const GR = "#E8ECF0";
const GD = "#6B7A92";
const INK = "#1A1F2E";
const ALT = "#EEF2F7";

const CEA_OFFICES = [
  { office:"CEA HQ / CEI Division", city:"New Delhi", address:"Sewa Bhavan, R.K. Puram, Sector-1, New Delhi – 110066", phone:"011-26510249", contact:"Sh. Gaurav Srivastava, Asst. Director (CEI Division) | +91-9650373381", jurisdiction:"National — Advisory Origin", priority:"Day 1–7 ★", zone:"National" },
  { office:"RIO (North)", city:"New Delhi", address:"Room No. 324, NRPC Building, 18-A, Shaheed Jeet Singh Marg, Katwaria Sarai, New Delhi – 110016", phone:"011-26510249", contact:"Sh. I.K. Mehra, Director", jurisdiction:"Delhi, UP, Uttarakhand, Haryana, Punjab, HP, Rajasthan, J&K, Ladakh", priority:"Day 7–15", zone:"North" },
  { office:"RIO (West)", city:"Mumbai", address:"Ground Floor, WRPC Building, Plot No. F-3, MIDC Area Marol, Andheri (East), Mumbai – 400093", phone:"022-28211003", contact:"Sh. B. Venkata Sandeep, Dy. Director", jurisdiction:"Maharashtra, Gujarat, MP, Chhattisgarh, Goa, Daman & Diu, Dadra & NH", priority:"Day 7–15", zone:"West" },
  { office:"RIO (South)", city:"Chennai", address:"Block-4, III Floor, Shastri Bhawan, Haddows Road, Chennai – 600006", phone:"044-28257051", contact:"Sh. Lenin B., Dy. Director", jurisdiction:"Tamil Nadu, Kerala, Andhra Pradesh, Karnataka, Telangana, Puducherry", priority:"Day 10–20", zone:"South" },
  { office:"RIO (East)", city:"Kolkata", address:"ERPC Building, 14 Golf Club Road, Tollygunge, Kolkata – 700033", phone:"033-24235107", contact:"Sh. Mohit Bansal, Dy. Director", jurisdiction:"West Bengal, Bihar, Odisha, Jharkhand, Sikkim", priority:"Day 15–25", zone:"East" },
  { office:"RIO (North-East)", city:"Shillong", address:"NERPC Complex, Nongrim Hills, Shillong – 793003", phone:"0364-2521086", contact:"Sh. Farooq Iqbal, Dy. Director", jurisdiction:"Assam, Arunachal Pradesh, Nagaland, Manipur, Meghalaya, Mizoram, Tripura", priority:"Day 20–30", zone:"NE" },
];

const PSU_UTILITIES = [
  { name:"POWERGRID / PGCIL", role:"National transmission; 287+ substations; India's first 315 MVA Synthetic Ester transformer (Bhiwadi, Jan 2026)", address:"Saudamini, Plot No. 2, Sector 29, Gurugram, Haryana – 122001", phone:"0124-2822000", category:"CTUIL/PGCIL/STU", priority:"Day 15–20 ★" },
  { name:"NTPC Limited", role:"Largest power generator; owns substations; generator transformers", address:"NTPC Bhawan, SCOPE Complex, Lodhi Road, New Delhi – 110003", phone:"+91-11-24387001", category:"Central PSU", priority:"Day 15–20" },
  { name:"NHPC Limited", role:"Hydro generation; operates EHV substations at hydro projects", address:"NHPC Office Complex, Sector 33, Faridabad, Haryana", phone:"—", category:"Central PSU", priority:"Day 25–30" },
  { name:"NLC India Limited", role:"Lignite-based power generation; major transformer fleet", address:"No. 135, EVR Periyar High Road, Kilpauk, Chennai – 600010", phone:"044-28369111", category:"Central PSU", priority:"Day 30–40" },
  { name:"SECI", role:"Renewable energy; HV substations for solar & wind parks across India", address:"6th Floor, Plate-B, NBCC Office Block Tower-2, East Kidwai Nagar, New Delhi – 110023", phone:"—", category:"Central PSU", priority:"Day 25–35" },
  { name:"REC Limited", role:"Finances utility infrastructure; embed ester oil spec in loan conditions", address:"Core-4, SCOPE Complex, Lodhi Road, New Delhi", phone:"—", category:"Financing Body", priority:"Day 30–45" },
  { name:"PFC (Power Finance Corp.)", role:"Government infrastructure financier; embed ester spec in funded projects", address:"Urjanidhi, 1 Barakhamba Lane, New Delhi – 110001", phone:"—", category:"Financing Body", priority:"Day 30–45" },
];

const PG_REGIONS = [
  { region:"Northern Region – I", address:"SCO Bay 05-10, Sector 16A, Faridabad – 121001, Haryana", phone:"0129-2666500", coverage:"Delhi, Haryana, J&K, HP, Punjab" },
  { region:"Northern Region – II", address:"OB-26, Grid Bhawan, Rail Head Complex, Jammu – 180012", phone:"0191-2471506", coverage:"J&K, Ladakh" },
  { region:"Northern Region – III", address:"Plot No. 2A/INS02, Awadh Vihar Yojna, Lucknow – 226002", phone:"0522-220519", coverage:"Uttar Pradesh, Uttarakhand" },
  { region:"Eastern Region – I", address:"Near Transformer Repair Works, Board Colony, Shastri Nagar, Patna – 800023", phone:"0612-2283440", coverage:"Bihar, Jharkhand" },
  { region:"Eastern Region – II", address:"CF-17, Action Area-1C, New Town, Kolkata – 700156", phone:"033-2324-2820", coverage:"West Bengal, Odisha, Sikkim" },
  { region:"North East Region", address:"Dongtieh, Lower Nongrah, Lapalang, Shillong – 793006", phone:"0364-2536683", coverage:"All North-East States" },
];

const STATE_TRANSCOS = [
  { state:"Maharashtra", utility:"MAHATRANSCO", hq:"Mumbai", zone:"West", priority:"Day 20–25 ★" },
  { state:"Gujarat", utility:"GETCO", hq:"Vadodara", zone:"West", priority:"Day 25–35 ★ Early Adopter" },
  { state:"Madhya Pradesh", utility:"MPTRANSCO", hq:"Jabalpur", zone:"West", priority:"Day 30–40" },
  { state:"Chhattisgarh", utility:"CSPTCL", hq:"Raipur", zone:"West", priority:"Day 35–45" },
  { state:"Goa", utility:"Electricity Department, Goa", hq:"Panaji", zone:"West", priority:"Day 40–55" },
  { state:"Tamil Nadu", utility:"TANTRANSCO", hq:"Chennai", zone:"South", priority:"Day 25–35" },
  { state:"Karnataka", utility:"KPTCL", hq:"Bengaluru", zone:"South", priority:"Day 25–35" },
  { state:"Andhra Pradesh", utility:"APTRANSCO", hq:"Visakhapatnam", zone:"South", priority:"Day 30–40" },
  { state:"Telangana", utility:"TSTRANSCO", hq:"Hyderabad", zone:"South", priority:"Day 30–40" },
  { state:"Kerala", utility:"KSEB", hq:"Thiruvananthapuram", zone:"South", priority:"Day 35–45" },
  { state:"Uttar Pradesh", utility:"UPPTCL", hq:"Lucknow", zone:"North", priority:"Day 25–40" },
  { state:"Rajasthan", utility:"RVPN", hq:"Jaipur", zone:"North", priority:"Day 30–40" },
  { state:"Haryana", utility:"HVPNL", hq:"Panchkula", zone:"North", priority:"Day 35–45" },
  { state:"Punjab", utility:"PSTCL", hq:"Patiala", zone:"North", priority:"Day 35–50" },
  { state:"Delhi", utility:"Delhi Transco Limited (DTL)", hq:"New Delhi", zone:"North", priority:"Day 40–55" },
  { state:"Himachal Pradesh", utility:"HPPTCL", hq:"Shimla", zone:"North", priority:"Day 40–55" },
  { state:"Uttarakhand", utility:"PTCUL", hq:"Dehradun", zone:"North", priority:"Day 40–55" },
  { state:"Jammu & Kashmir", utility:"Power Development Dept., J&K", hq:"Srinagar", zone:"North", priority:"Day 45–60" },
  { state:"West Bengal", utility:"WBSETCL", hq:"Kolkata", zone:"East", priority:"Day 35–50" },
  { state:"Bihar", utility:"BSPHCL", hq:"Patna", zone:"East", priority:"Day 40–55" },
  { state:"Odisha", utility:"OPTCL", hq:"Bhubaneswar", zone:"East", priority:"Day 40–55" },
  { state:"Jharkhand", utility:"JSEB", hq:"Ranchi", zone:"East", priority:"Day 45–60" },
  { state:"Assam", utility:"APDCL", hq:"Guwahati", zone:"NE", priority:"Day 45–60" },
  { state:"Meghalaya", utility:"MePDCL", hq:"Shillong", zone:"NE", priority:"Day 50–65" },
  { state:"Tripura", utility:"TSECL", hq:"Agartala", zone:"NE", priority:"Day 50–65" },
  { state:"Manipur", utility:"MSPDCL", hq:"Imphal", zone:"NE", priority:"Day 55–70" },
  { state:"Arunachal Pradesh", utility:"Dept. of Power, Arunachal Pradesh", hq:"Itanagar", zone:"NE", priority:"Day 55–70" },
];

const DISCOMS = [
  { name:"HPSEBL", state:"Himachal Pradesh", zone:"North" },
  { name:"Tata Power Delhi Distribution Ltd. (TPDDL)", state:"Delhi", zone:"North" },
  { name:"BSES Rajdhani Power Ltd.", state:"Delhi", zone:"North" },
  { name:"BSES Yamuna Power Ltd.", state:"Delhi", zone:"North" },
  { name:"New Delhi Municipal Council (NDMC)", state:"Delhi", zone:"North" },
  { name:"UHBVN", state:"Haryana", zone:"North" },
  { name:"DHBVN", state:"Haryana", zone:"North" },
  { name:"UPCL", state:"Uttarakhand", zone:"North" },
  { name:"PSPCL", state:"Punjab", zone:"North" },
  { name:"PVVNL (Purvanchal)", state:"Uttar Pradesh", zone:"North" },
  { name:"PVVNL (Paschimanchal)", state:"Uttar Pradesh", zone:"North" },
  { name:"MVVNL", state:"Uttar Pradesh", zone:"North" },
  { name:"DVVNL", state:"Uttar Pradesh", zone:"North" },
  { name:"Electricity Dept., Chandigarh", state:"Chandigarh", zone:"North" },
  { name:"Power Dev. Dept., J&K", state:"J&K", zone:"North" },
  { name:"JDVVNL", state:"Rajasthan", zone:"North" },
  { name:"JVVNL", state:"Rajasthan", zone:"North" },
  { name:"AVVNL", state:"Rajasthan", zone:"North" },
  { name:"MSEDCL", state:"Maharashtra", zone:"West" },
  { name:"MGVCL", state:"Gujarat", zone:"West" },
  { name:"DGVCL", state:"Gujarat", zone:"West" },
  { name:"PGVCL", state:"Gujarat", zone:"West" },
  { name:"UGVCL", state:"Gujarat", zone:"West" },
  { name:"MP Poorv Kshetra Vidyut Vitaran Co. Ltd.", state:"Madhya Pradesh", zone:"West" },
  { name:"MP Madhya Kshetra Vidyut Vitaran Co. Ltd.", state:"Madhya Pradesh", zone:"West" },
  { name:"MP Paschim Kshetra Vidyut Vitaran Co. Ltd.", state:"Madhya Pradesh", zone:"West" },
  { name:"CSPDCL", state:"Chhattisgarh", zone:"West" },
  { name:"Goa Electricity Department", state:"Goa", zone:"West" },
  { name:"TANGEDCO", state:"Tamil Nadu", zone:"South" },
  { name:"BESCOM", state:"Karnataka", zone:"South" },
  { name:"CESC (Chamundeshwari)", state:"Karnataka", zone:"South" },
  { name:"GESCOM (Gulbarga)", state:"Karnataka", zone:"South" },
  { name:"HESCOM (Hubli)", state:"Karnataka", zone:"South" },
  { name:"MESCOM (Mangalore)", state:"Karnataka", zone:"South" },
  { name:"TSSPDCL", state:"Telangana", zone:"South" },
  { name:"TSNPDCL", state:"Telangana", zone:"South" },
  { name:"APEPDCL", state:"Andhra Pradesh", zone:"South" },
  { name:"APSPDCL", state:"Andhra Pradesh", zone:"South" },
  { name:"APCPDCL", state:"Andhra Pradesh", zone:"South" },
  { name:"KSEB", state:"Kerala", zone:"South" },
  { name:"Electricity Dept., Puducherry", state:"Puducherry", zone:"South" },
  { name:"Electricity Dept., Andaman & Nicobar", state:"A&N Islands", zone:"South" },
  { name:"Electricity Dept., Lakshadweep", state:"Lakshadweep", zone:"South" },
  { name:"WBSEDCL", state:"West Bengal", zone:"East" },
  { name:"NBPDCL (North Bihar)", state:"Bihar", zone:"East" },
  { name:"SBPDCL (South Bihar)", state:"Bihar", zone:"East" },
  { name:"CESU / TPCODL", state:"Odisha", zone:"East" },
  { name:"JBVNL", state:"Jharkhand", zone:"East" },
  { name:"Sikkim Power Dev. Corp.", state:"Sikkim", zone:"East" },
  { name:"APDCL", state:"Assam", zone:"NE" },
  { name:"TSECL", state:"Tripura", zone:"NE" },
  { name:"MePDCL", state:"Meghalaya", zone:"NE" },
  { name:"Manipur State Power Distribution Co.", state:"Manipur", zone:"NE" },
  { name:"Dept. of Power, Nagaland", state:"Nagaland", zone:"NE" },
  { name:"Dept. of Power, Arunachal Pradesh", state:"Arunachal Pradesh", zone:"NE" },
  { name:"Power & Electricity Dept., Mizoram", state:"Mizoram", zone:"NE" },
];

const PRIVATE_UTILITIES = [
  { name:"Adani Electricity Mumbai Ltd. (AEML)", territory:"Mumbai suburbs (~3 million consumers) — MoP Rank #1", hq:"Adani House, Borivali West, Mumbai – 400092", approach:"Leverage Mumbai proximity; target Long-Term Agreement (LTA)", priority:"Day 30–40", urgency:"Highest" },
  { name:"Tata Power Delhi Distribution Ltd. (TPDDL)", territory:"North & NW Delhi (~19.5 million consumers); pioneer in natural ester adoption", hq:"Kingsway Camp, New Delhi", approach:"Chief Engineer (Material); use Hitachi Energy natural ester India reference", priority:"Day 35–45", urgency:"Highest" },
  { name:"BSES Rajdhani Power Ltd.", territory:"South & West Delhi — subsidiary of Reliance Infrastructure", hq:"Nehru Place, New Delhi", approach:"Combine with TPDDL Delhi trip; approach procurement head", priority:"Day 35–45", urgency:"High" },
  { name:"BSES Yamuna Power Ltd.", territory:"East & Central Delhi", hq:"Shahdara, New Delhi", approach:"Combine with BSES Rajdhani — single Delhi trip covers 3 private utilities", priority:"Day 35–45", urgency:"High" },
  { name:"Torrent Power Ltd.", territory:"Ahmedabad, Surat, Dahej, Bhiwandi, Agra, Dholera — extensive fleet", hq:"Torrent House, Off Ashram Road, Ahmedabad", approach:"Combine with GETCO & TRIL Ahmedabad visits; extensive distribution fleet", priority:"Day 30–40", urgency:"Highest" },
  { name:"CESC Limited", territory:"Kolkata & West Bengal (~3.4 million consumers)", hq:"CESC House, Chowringhee Square, Kolkata", approach:"Meet procurement head; combine with East RIO + WBSETCL visit", priority:"Day 30–40", urgency:"High" },
  { name:"Reliance Infrastructure Ltd. (R-Infra)", territory:"Navi Mumbai suburbs (~6.5 million consumers)", hq:"Reliance Centre, Santacruz East, Mumbai", approach:"Coordinate with Mumbai AEML visit; separate procurement meeting", priority:"Day 40–50", urgency:"High" },
  { name:"Noida Power Company Ltd. (NPCL)", territory:"Greater Noida industrial zone", hq:"Noida, Uttar Pradesh", approach:"Coordinate with UP Transco Lucknow visit", priority:"Day 45–55", urgency:"Medium" },
  { name:"New Delhi Municipal Council (NDMC)", territory:"Lutyens Zone, New Delhi — premium high-visibility installations", hq:"Palika Kendra, Parliament Street, New Delhi", approach:"Direct meeting; coordinate with DTL Delhi visit", priority:"Day 45–60", urgency:"Medium" },
  { name:"Tata Power W. Odisha Distribution Ltd. (TPWODL)", territory:"Western Odisha distribution", hq:"Sambalpur, Odisha", approach:"Coordinate with Odisha OPTCL visit", priority:"Day 50–65", urgency:"Medium" },
  { name:"TP Northern Odisha Distribution Ltd. (TPNODL)", territory:"Northern Odisha distribution", hq:"Balasore, Odisha", approach:"Coordinate with East Zone visit", priority:"Day 50–65", urgency:"Medium" },
];

const MANUFACTURERS_T1 = [
  { name:"BHEL (Bharat Heavy Electricals Ltd.)", location:"Haridwar (mfg) + Bhopal + Jhansi", voltageRange:"Up to 765–800 kV", mvaRange:"Up to 500 MVA", products:"Power transformers, auto-transformers, generator transformers, shunt reactors, traction transformers", clients:"POWERGRID, NTPC, State Transcos, Indian Railways; India's largest public sector OEM", contact:"Haridwar Plant: 01334-281001 | Bhopal TF Division", approach:"Full-day technical seminar + trial quantity offer; both Haridwar & Bhopal plants", window:"Day 25–35" },
  { name:"Hitachi Energy India Ltd. (formerly ABB Power)", location:"Vadodara, Gujarat", voltageRange:"Up to 765 kV EHV", mvaRange:"Up to 630 MVA", products:"Power & auto transformers, traction, HVDC converter transformers, smart digital transformers, eco-design units", clients:"Tata Power (installed India's most powerful natural ester TF), POWERGRID, State Transcos", contact:"Vadodara: 0265-3924100", approach:"Vadodara plant; leverage Tata Power Mumbai natural ester reference; technical seminar", window:"Day 30–40" },
  { name:"Siemens Energy India Ltd.", location:"Kalwa, Thane, Maharashtra + Nashik", voltageRange:"Up to 400 kV", mvaRange:"Up to 500 MVA", products:"Power transformers, distribution, phase-shifting, IoT-enabled smart grid units, eco-series transformers", clients:"POWERGRID, MSEDCL, urban utilities, smart city projects; known for digital integration", contact:"Kalwa Works: 022-2767-2000", approach:"Kalwa manufacturing site + Mumbai tech office; digital transformer + ESG angle", window:"Day 25–35" },
  { name:"CG Power & Industrial Solutions Ltd.", location:"Nashik + Kanjurmarg Mumbai + Bhopal", voltageRange:"Up to 1200 kV UHV", mvaRange:"Up to 1000 MVA", products:"Power transformers, furnace transformers, auto-transformers, EHV units, phase-shifting, special purpose UHV", clients:"POWERGRID, State Transcos, PSUs, industrial; major national grid supplier", contact:"Nashik Plant: 0253-6640000 | Mumbai: 022-6229-3000", approach:"Nashik plant + corporate Mumbai; leverage POWERGRID reference; BOM spec request", window:"Day 25–35" },
  { name:"Transformers & Rectifiers India Ltd. (TRIL)", location:"Moraiya, Ahmedabad, Gujarat", voltageRange:"Up to 400 kV (UHV in progress)", mvaRange:"Up to 315 MVA", products:"EHV power transformers, converter transformers, furnace transformers, HVDC, dry-type, rectifier transformers", clients:"POWERGRID, PSUs, major industrial groups; growing export portfolio globally", contact:"Ahmedabad: 079-6190-6000", approach:"Factory visit + trial; coordinate with GETCO & Torrent Ahmedabad visits simultaneously", window:"Day 30–40" },
  { name:"GE T&D India Ltd. / Grid Solutions", location:"Vadodara, Gujarat", voltageRange:"Up to 765 kV", mvaRange:"Up to 500 MVA", products:"Grid-scale power transformers, auto-transformers, HVDC converter transformers, gas-insulated transformers", clients:"POWERGRID, State Transcos, renewable energy sector interconnections, export markets", contact:"Vadodara: 0265-2580071", approach:"Technical meeting + BOM spec; coordinate with TRIL Ahmedabad visit on same trip", window:"Day 35–45" },
  { name:"TBEA Energy (India) Pvt. Ltd.", location:"Delhi/NCR + Moradabad, UP", voltageRange:"Up to 750 kV", mvaRange:"Up to 750 MVA", products:"EHV power transformers, UHV prototypes, auto-transformers, converter transformers; global UHV 1000 kV expertise", clients:"PSUs, State Transcos; growing India order book; 1000 kV UHV deployments globally", contact:"Delhi NCR Regional Office", approach:"Regional sales office; EHV product presentation; reference TBEA global ester adoption track record", window:"Day 35–45" },
  { name:"Schneider Electric India", location:"Bengaluru + Nashik", voltageRange:"Up to 400 kV", mvaRange:"Up to 200 MVA", products:"Smart/digital transformers, IoT-enabled units, medium-voltage transformers, eco-design transformers for green buildings", clients:"Urban utilities, IT parks, data centres, smart cities, renewable farms; ESG-focused buyers", contact:"Bengaluru: 080-6177-5500", approach:"Bengaluru tech office; ESG + digital twin angle; eco-friendly transformer product alignment", window:"Day 35–45" },
];

const MANUFACTURERS_T2 = [
  { name:"Kirloskar Electric Co. Ltd.", location:"Bengaluru, Karnataka + Mysuru", voltageRange:"Up to 220 kV", mvaRange:"Up to 200 MVA", products:"Power transformers, distribution transformers, dry-type, industrial; defence & railway transformers", clients:"State DISCOMs, industrial sector, Railways, defence establishments", window:"Day 40–55" },
  { name:"Voltamp Transformers Ltd.", location:"Vadodara, Gujarat", voltageRange:"Up to 220 kV", mvaRange:"Up to 100 MVA", products:"Power transformers, distribution transformers, oil & dry-type; exported to 40+ countries", clients:"Domestic DISCOMs, industrial, export markets; strong private sector presence", window:"Day 40–55" },
  { name:"IMP Power Ltd.", location:"Silvassa / Mumbai region", voltageRange:"Up to 220 kV", mvaRange:"Up to 100 MVA", products:"Power transformers, distribution transformers, special application units for utilities & industry", clients:"State utilities, PSUs, heavy industrial sector", window:"Day 40–55" },
  { name:"Emco Limited", location:"Aurangabad, Maharashtra", voltageRange:"Up to 400 kV", mvaRange:"Up to 315 MVA", products:"Power transformers, auto-transformers, shunt reactors, 33 kV and above; POWERGRID-approved vendor", clients:"POWERGRID, State Transcos, PSUs; approved for major substation projects", window:"Day 40–55" },
  { name:"Diamond Power Infrastructure Ltd.", location:"Vadodara, Gujarat", voltageRange:"Up to 220 kV", mvaRange:"Up to 100 MVA", products:"Distribution & power transformers, winding wire, transmission cables; Gujarat-focused", clients:"State DISCOMs, industrial sector, Gujarat utilities", window:"Day 45–55" },
  { name:"BHEL Jhansi (Distribution Division)", location:"Jhansi, Uttar Pradesh", voltageRange:"Up to 66 kV", mvaRange:"Distribution range", products:"Distribution transformers, traction transformers for Indian Railways; very high volume output", clients:"Indian Railways, UP DISCOMs, State utilities — captive demand from Railways alone is massive", window:"Day 40–50" },
  { name:"Techno Electric & Engineering Co.", location:"Kolkata, West Bengal", voltageRange:"Up to 220 kV (EPC)", mvaRange:"EPC contractor", products:"Transformer EPC integrator — procures transformers for utility substation projects across India; key oil spec influencer", clients:"State Transcos, PSUs; wins turnkey substation contracts and specifies oil as part of tender", window:"Day 45–55" },
  { name:"EVR Power (EVR Electricals)", location:"Plot 64, Ponni Amman Nagar, Ayanambakkam, Chennai – 600095", voltageRange:"Up to 110 kV", mvaRange:"Up to 50 MVA", products:"Transformers, cooling panels, radiators, distribution transformers; South India-focused", clients:"TANGEDCO, Tamil Nadu DISCOMs, South Indian industrial sector", window:"Day 50–65" },
  { name:"Gujarat Transformers Pvt. Ltd.", location:"Vadodara, Gujarat", voltageRange:"Up to 220 kV", mvaRange:"Up to 100 MVA", products:"Power transformers, 33 kV and above; utility and industrial supply; Gujarat market specialist", clients:"Gujarat DISCOMs (MGVCL, DGVCL, PGVCL, UGVCL), State utilities", window:"Day 50–65" },
  { name:"Indo Tech Transformers Ltd.", location:"Chennai, Tamil Nadu", voltageRange:"Up to 220 kV", mvaRange:"Up to 100 MVA", products:"33 kV and above power transformers; distribution transformers; South India utility supplier", clients:"TANTRANSCO, TANGEDCO, KSEB, South Indian utilities", window:"Day 50–65" },
  { name:"Kotsons Pvt. Ltd.", location:"B-7, Eldeco Sidcul Industrial Park, Sitarganj, Dist. U.S. Nagar, Uttarakhand", voltageRange:"Up to 33 kV", mvaRange:"Up to 10 MVA", products:"Distribution transformers, 33 kV class; very high volume North India presence; DISCOM supplier", clients:"PVVNL, MVVNL, UPCL, Uttarakhand & UP DISCOMs", window:"Day 50–65" },
  { name:"Uttam Bharat / UTL Transformers", location:"India (multiple plants)", voltageRange:"Up to 220 kV", mvaRange:"Up to 100 MVA", products:"Power transformers, auto-transformers; growing utility segment focus", clients:"State utilities, industrial sector; North & West India presence", window:"Day 55–70" },
  { name:"SGB Transformers India Pvt. Ltd.", location:"India (European technology)", voltageRange:"Up to 220 kV", mvaRange:"Up to 200 MVA", products:"Specialised power transformers; SGB-SMIT Group European pedigree; quality-focused", clients:"PSUs, State Transcos, renewable sector; premium segment buyer", window:"Day 55–70" },
  { name:"Om Shakti Transformers Ltd. (OSTL)", location:"Multi-location (North + West India)", voltageRange:"Up to 220 kV", mvaRange:"Up to 100 MVA", products:"33 kV and above power & distribution transformers; multi-state DISCOM supplier", clients:"State DISCOMs, industrial sector; established North + West India market", window:"Day 55–70" },
  { name:"Vijay Electricals Ltd.", location:"Hyderabad, Telangana", voltageRange:"Up to 220 kV", mvaRange:"Up to 100 MVA", products:"Power transformers, distribution transformers; strong South India & Telangana presence", clients:"TSGENCO, TSTRANSCO, TSSPDCL, TSNPDCL, AP utilities; Hyderabad market specialist", window:"Day 55–70" },
  { name:"Star Delta Transformers", location:"Bengaluru, Karnataka", voltageRange:"Up to 33 kV", mvaRange:"Up to 10 MVA", products:"Medium power transformers, distribution; South India DISCOM and industrial supplier", clients:"BESCOM, CESC Karnataka, South Indian DISCOMs, industrial sector", window:"Day 55–70" },
  { name:"Arteche India", location:"Pune, Maharashtra", voltageRange:"Up to 400 kV (Instrument)", mvaRange:"Instrument transformers", products:"Current transformers, voltage transformers, 33 kV and above; critical metering in ester-filled substations", clients:"POWERGRID, State Transcos, all major utilities; metering and protection standard", window:"Day 50–65" },
];

const MANUFACTURERS_T3 = [
  { name:"Servokon Systems Ltd.", location:"Delhi/NCR", voltageRange:"Up to 220 kV", products:"Power transformers, servo stabilisers, industrial transformers", window:"Day 60–75" },
  { name:"Makpower Trans Systems Pvt. Ltd.", location:"Multi-location", voltageRange:"Up to 66 kV", products:"Custom transformers, distribution, special application units", window:"Day 60–75" },
  { name:"Billets Elektro Werke Pvt. Ltd.", location:"UP / North India", voltageRange:"Up to 33 kV", products:"Distribution transformers; North India DISCOM supplier", window:"Day 60–80" },
  { name:"T Power Transformers", location:"India", voltageRange:"Up to 220 kV", products:"Power and distribution transformers", window:"Day 60–80" },
  { name:"Balaji Power Automation", location:"India", voltageRange:"Up to 33 kV", products:"Power transformers, automation panels, distribution", window:"Day 65–80" },
  { name:"Lumens Electricals", location:"Indore, MP", voltageRange:"Up to 33 kV", products:"Distribution transformers; MP DISCOM approved supplier", window:"Day 65–80" },
  { name:"Meem Transformers Pvt. Ltd.", location:"India", voltageRange:"Up to 33 kV", products:"Distribution and power transformers; regional utility supplier", window:"Day 65–85" },
  { name:"Billtech Electricals Pvt. Ltd.", location:"North India", voltageRange:"Up to 33 kV", products:"Distribution transformers; DISCOM supplier North India", window:"Day 65–85" },
  { name:"Trutech Products", location:"Gujarat", voltageRange:"Up to 66 kV", products:"Power & distribution transformers; Gujarat market focus", window:"Day 65–85" },
  { name:"Mehru Electrical & Mechanical Engineers", location:"Roorkee, Uttarakhand", voltageRange:"Up to 33 kV (Instrument)", products:"Instrument transformers, CTs, VTs; ester-compatible instrument transformer designs", window:"Day 70–90" },
  { name:"Altrans Electricals", location:"India", voltageRange:"Up to 66 kV", products:"Distribution transformers; rural electrification and DISCOM supply", window:"Day 70–90" },
  { name:"Zenith Transformers", location:"India", voltageRange:"Up to 33 kV", products:"Distribution transformers; industrial supply; regional supplier", window:"Day 70–90" },
  { name:"Power Max Transformers", location:"India", voltageRange:"Up to 33 kV", products:"Distribution and special application transformers", window:"Day 70–90" },
  { name:"Central Transformers", location:"India", voltageRange:"Up to 66 kV", products:"Power transformers; State DISCOM approved vendor", window:"Day 70–90" },
  { name:"National Electricals", location:"India", voltageRange:"Up to 66 kV", products:"Distribution transformers; multi-state DISCOM presence", window:"Day 75–90" },
];

const TIMELINE_PHASES = [
  { phase:1, title:"Foundation & Internal Readiness", days:"Days 1–14", items:[
    { day:"Day 1–3", action:"Assemble Product Documentation Pack: TDS, SDS, IS/IEC certificates, fire test reports (Natural & Synthetic Ester)", owner:"Product Manager" },
    { day:"Day 1–3", action:"Prepare CEA Advisory Reference One-Pager (Ref: CEA-PS-16/13/2025-CEI Division, I/64705/2026)", owner:"Project Manager" },
    { day:"Day 3–5", action:"Prepare POWERGRID Bhiwadi 315 MVA Case Study one-pager — key proof point for all PSU meetings", owner:"Marketing Team" },
    { day:"Day 5–7", action:"Finalise zone-wise team deployment: West (Mumbai), South (Chennai), North (Delhi/Gurugram), East (Kolkata), NE (Shillong)", owner:"Sales Head" },
    { day:"Day 7–10", action:"Finalise tiered pricing matrix: PSU LTA / State DISCOM / Private Utility / OEM factory-fill tiers", owner:"Commercial Team" },
    { day:"Day 7–14", action:"★ CRITICAL: Dispatch Confirmation Letters (Annexure A) to ALL Transformer Manufacturers — Tier 1 + Tier 2 + Tier 3", owner:"Sales Team" },
    { day:"Day 7–14", action:"★ CRITICAL: Dispatch product intro letters + CEA Advisory enclosure to ALL 55+ DISCOMs & 27 Transcos", owner:"Regional Sales Teams" },
  ]},
  { phase:2, title:"Regulatory Anchor — CEA Visits", days:"Days 7–30", items:[
    { day:"Day 7–10", action:"CEA HQ, New Delhi — Meet Sh. Gaurav Srivastava (CEI Division) + Senior Member; obtain compliance acknowledgement", owner:"Project Manager" },
    { day:"Day 10–14", action:"RIO (North), New Delhi — Director: Sh. I.K. Mehra; written meeting minutes required as deliverable", owner:"North Zone Manager" },
    { day:"Day 10–14", action:"RIO (West), Mumbai — Sh. B. Venkata Sandeep; present compliance; request advisory circular distribution to utilities", owner:"West Zone Manager" },
    { day:"Day 15–20", action:"RIO (South), Chennai — Sh. Lenin B.; combine with TANTRANSCO & KPTCL visits on same trip", owner:"South Zone Manager" },
    { day:"Day 20–25", action:"RIO (East), Kolkata — Sh. Mohit Bansal; combine with WBSETCL & CESC visits", owner:"East Zone Manager" },
    { day:"Day 25–30", action:"RIO (North-East), Shillong — Sh. Farooq Iqbal; distribute product info pack to North-East utilities", owner:"NE Zone Manager" },
  ]},
  { phase:3, title:"Central PSU Utility Visits", days:"Days 15–45", items:[
    { day:"Day 15–20", action:"POWERGRID Corporate, Gurugram — ester oil supply proposal + empanelment + leverage Bhiwadi 315 MVA success", owner:"PM + Sales Director" },
    { day:"Day 15–20", action:"NTPC, New Delhi — advisory + SOTL supply capability; vendor list inclusion request", owner:"Sales Director" },
    { day:"Day 20–25", action:"POWERGRID Regional: Northern Region I (Faridabad) & III (Lucknow)", owner:"North Zone Manager" },
    { day:"Day 25–30", action:"NHPC, Faridabad — Technical presentation + empanelment application", owner:"North Zone Manager" },
    { day:"Day 25–35", action:"SECI, New Delhi — Solar park HV substation ester oil proposal for renewable sector", owner:"North Zone Manager" },
    { day:"Day 30–40", action:"NLC India, Chennai — Technical meeting + empanelment application", owner:"South Zone Manager" },
    { day:"Day 30–45", action:"POWERGRID Eastern + NE Regional Offices (Patna, Kolkata, Shillong)", owner:"East/NE Managers" },
    { day:"Day 30–45", action:"REC Limited + PFC, New Delhi — Request ester oil specification in project loan conditions", owner:"Commercial Team" },
  ]},
  { phase:4, title:"State Transco & DISCOM Visits", days:"Days 20–75", items:[
    { day:"Day 20–25", action:"MAHATRANSCO (CE Materials) + MSEDCL (Procurement Head) — Mumbai — HIGHEST URGENCY (SOTL home territory)", owner:"West Zone Manager" },
    { day:"Day 25–35", action:"GETCO (early adopter per CEA Advisory) + Gujarat DISCOMs (PGVCL, MGVCL, DGVCL, UGVCL) — Vadodara", owner:"West Zone Manager" },
    { day:"Day 25–35", action:"TANTRANSCO + TANGEDCO (Chennai); KPTCL + BESCOM (Bengaluru)", owner:"South Zone Manager" },
    { day:"Day 25–40", action:"UPPTCL + UP DISCOMs (PVVNL Purv/Pasch, MVVNL, DVVNL) — Lucknow", owner:"North Zone Manager" },
    { day:"Day 30–40", action:"APTRANSCO + AP DISCOMs (Vizag/Vijayawada); TSTRANSCO + Telangana DISCOMs (Hyderabad)", owner:"South Zone Manager" },
    { day:"Day 35–50", action:"WBSETCL + WBSEDCL (Kolkata); BSPHCL + Bihar DISCOMs (Patna); OPTCL + CESU (Bhubaneswar)", owner:"East Zone Manager" },
    { day:"Day 45–70", action:"NE utilities: APDCL (Guwahati), TSECL (Agartala), MePDCL (Shillong), MSPDCL (Imphal)", owner:"NE Zone Manager" },
  ]},
  { phase:5, title:"Private Utility Meetings", days:"Days 30–75", items:[
    { day:"Day 30–40", action:"AEML Mumbai + Torrent Power Ahmedabad + CESC Kolkata — highest urgency, fastest decision-makers", owner:"West/East Managers" },
    { day:"Day 35–45", action:"TPDDL + BSES Rajdhani + BSES Yamuna — New Delhi (combine into single 2-day Delhi trip)", owner:"North Zone Manager" },
    { day:"Day 40–50", action:"Reliance Infrastructure — Navi Mumbai", owner:"West Zone Manager" },
    { day:"Day 45–60", action:"NPCL (Greater Noida) + NDMC (New Delhi)", owner:"North Zone Manager" },
    { day:"Day 50–65", action:"TPWODL (Sambalpur) + TPNODL (Balasore) — Western & Northern Odisha", owner:"East Zone Manager" },
  ]},
  { phase:6, title:"Transformer Manufacturer Visits", days:"Days 14–90", items:[
    { day:"Day 14", action:"Confirmation letters dispatched to ALL Tier 1 + Tier 2 + Tier 3 manufacturers Pan-India (40+ organisations)", owner:"Sales Team" },
    { day:"Day 25–35", action:"BHEL (Haridwar+Bhopal), CG Power (Nashik), Siemens Energy (Kalwa/Thane) — full-day technical seminars", owner:"PM + West Manager" },
    { day:"Day 30–40", action:"Hitachi Energy (Vadodara) + TRIL (Moraiya, Ahmedabad) — factory visits + trial quantity offer", owner:"West Zone Manager" },
    { day:"Day 35–45", action:"GE T&D (Vadodara) + TBEA Energy (Delhi/NCR) + Schneider Electric (Bengaluru)", owner:"West/North/South" },
    { day:"Day 40–55", action:"Tier-2: Kirloskar (Bengaluru), Voltamp (Vadodara), Emco (Aurangabad), IMP Power, Diamond Power, BHEL Jhansi", owner:"Zone Managers" },
    { day:"Day 50–65", action:"Tier-2: EVR Power (Chennai), Indo Tech (Chennai), Kotsons (Uttarakhand), Gujarat Transformers, Techno Electric (Kolkata), Arteche (Pune)", owner:"Zone Managers" },
    { day:"Day 55–75", action:"Tier-2: SGB Transformers, OSTL, Vijay Electricals (Hyderabad), Star Delta (Bengaluru), UTL Transformers", owner:"Zone Managers" },
    { day:"Day 70–90", action:"IEEMA DG Engagement — request speaking slot at Transformer Division meeting to address ALL member manufacturers", owner:"Project Manager" },
  ]},
  { phase:7, title:"Consolidation & Board Review", days:"Days 90–120", items:[
    { day:"Day 90–100", action:"Status review: all empanelment applications, pending approvals, trial outcomes", owner:"Project Manager" },
    { day:"Day 95–105", action:"Follow up on all outstanding utility LOIs and tender invitations", owner:"Sales Team" },
    { day:"Day 100–110", action:"Prepare FY27 forecast by segment: Transco / DISCOM / Private / OEM factory-fill", owner:"Commercial Team" },
    { day:"Day 110–120", action:"Board-ready report: pipeline, confirmed orders, strategic partnerships secured", owner:"Project Manager" },
  ]},
];

const KPIS = [
  { category:"CEA Regulatory", kpi:"CEA HQ Meeting Completed", target:"YES — by Day 10", gate:"Day 14" },
  { category:"CEA Regulatory", kpi:"RIO Offices Visited", target:"5 of 5 (100%)", gate:"Day 30" },
  { category:"Central PSUs", kpi:"PSUs Formally Engaged", target:"6 of 7 (minimum)", gate:"Day 45" },
  { category:"Central PSUs", kpi:"Empanelment Applications Filed", target:"All 6 Central PSUs by Day 45", gate:"Day 45" },
  { category:"State Transcos", kpi:"Transcos Formally Presented", target:"Minimum 20 of 27", gate:"Day 75" },
  { category:"DISCOMs", kpi:"Product Letter Dispatched", target:"100% of 55+ DISCOMs by Day 14", gate:"Day 14" },
  { category:"DISCOMs", kpi:"Priority DISCOM Meetings (in-person)", target:"Minimum 15", gate:"Day 75" },
  { category:"Private Utilities", kpi:"Private Utilities Engaged", target:"Minimum 8 of 11", gate:"Day 75" },
  { category:"Manufacturers", kpi:"Confirmation Letters Dispatched", target:"100% of Tier 1+2+3 by Day 15", gate:"Day 15" },
  { category:"Manufacturers", kpi:"Tier-1 OEM Factory Meetings", target:"8 of 8 (100%)", gate:"Day 45" },
  { category:"Manufacturers", kpi:"Trial Quantities Deployed", target:"Minimum 3 Tier-1 OEMs", gate:"Day 60" },
  { category:"Manufacturers", kpi:"BOM Specification Requests Filed", target:"All 8 Tier-1 OEMs", gate:"Day 45" },
  { category:"Commercial", kpi:"LOIs / Confirmed Orders (utility)", target:"Minimum 3", gate:"Day 90" },
  { category:"Commercial", kpi:"LOIs / Confirmed Orders (OEM)", target:"Minimum 2", gate:"Day 90" },
  { category:"Commercial", kpi:"Empanelment Approvals Obtained", target:"Minimum 5 utilities", gate:"Day 120" },
  { category:"Commercial", kpi:"Long-Term Agreements (LTAs) Signed", target:"Minimum 1 private utility", gate:"Day 120" },
];

const RISKS = [
  { risk:"PSU procurement cycles cause 6–9 month delay to actual orders after empanelment", likelihood:"High", impact:"Medium", mitigation:"File empanelment + offer pilot supply outside tender; target private utilities for early cash flow" },
  { risk:"Utilities unfamiliar with ester oil handling, storage and maintenance protocols", likelihood:"Medium", impact:"Medium", mitigation:"Free handling manual + certified maintenance training; deploy Field Application Engineer at buyer site" },
  { risk:"Price resistance — ester is 2–3x more expensive than mineral oil", likelihood:"High", impact:"High", mitigation:"Present lifecycle cost model: 5–8x longer insulation life, K-class fire safety, reduced insurance, import-substitution" },
  { risk:"Competitor pre-emption by APAR POWEROIL Ester or Cargill Envirotemp", likelihood:"Medium", impact:"High", mitigation:"Speed is primary defence — letter dispatch by Day 15 and Tier-1 factory visits by Day 35 before competitors" },
  { risk:"Trade receivable accumulation with slow-paying PSU customers", likelihood:"Medium", impact:"Medium", mitigation:"Stagger supply terms; prioritise private utilities (faster payment cycles) for first supply agreements" },
  { risk:"Utility requests retro-filling capability — service may not be ready", likelihood:"Medium", impact:"Medium", mitigation:"Prepare retro-filling offering with dedicated filtration rigs; partner with transformer maintenance firms immediately" },
  { risk:"CEA Advisory treated as optional / advisory-only by some utilities", likelihood:"Medium", impact:"Low", mitigation:"Para 9 references West Asia crisis urgency; use RIO compliance letter obtained in Phase 2 in all meetings" },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const FS = { xs:12, sm:14, base:15, md:16, lg:18, xl:20, h2:22, h1:26 };

function Badge({ text, color=N, textColor=W }) {
  return <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:4, fontSize:FS.sm, fontWeight:700, background:color, color:textColor, whiteSpace:"nowrap" }}>{text}</span>;
}

function SearchBar({ value, onChange, placeholder="Search..." }) {
  return <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ padding:"8px 14px", border:`1px solid ${GR}`, borderRadius:6, fontSize:FS.base, width:"100%", maxWidth:360, outline:"none", background:W, color:INK }} />;
}

function FilterPills({ options, selected, onChange }) {
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
      {["All",...options].map(o => <button key={o} onClick={()=>onChange(o)} style={{ padding:"5px 14px", borderRadius:20, fontSize:FS.sm, cursor:"pointer", border:"none", background:selected===o?N:GR, color:selected===o?W:GD, fontWeight:selected===o?700:400 }}>{o}</button>)}
    </div>
  );
}

function Table({ cols, rows, maxH=540 }) {
  return (
    <div style={{ overflowX:"auto", overflowY:"auto", maxHeight:maxH, borderRadius:8, border:`1px solid ${GR}` }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:FS.base }}>
        <thead>
          <tr style={{ background:N, position:"sticky", top:0, zIndex:2 }}>
            {cols.map((c,i) => <th key={i} style={{ padding:"12px 14px", color:W, fontWeight:700, textAlign:"left", whiteSpace:"nowrap", fontSize:FS.sm, borderRight:i<cols.length-1?`1px solid ${NM}`:"" }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length===0 && <tr><td colSpan={cols.length} style={{ padding:36, textAlign:"center", color:GD, fontSize:FS.base }}>No results found</td></tr>}
          {rows.map((row,ri) => (
            <tr key={ri} style={{ background:ri%2===0?W:ALT, borderBottom:`1px solid ${GR}` }}>
              {row.map((cell,ci) => <td key={ci} style={{ padding:"11px 14px", color:INK, verticalAlign:"top", borderRight:ci<row.length-1?`1px solid ${GR}`:"", fontSize:FS.base, lineHeight:1.6 }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeader({ title, subtitle, count }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <h2 style={{ margin:0, fontSize:FS.h1, fontWeight:800, color:N }}>{title}</h2>
        {count!==undefined && <span style={{ background:G, color:W, fontSize:FS.sm, fontWeight:700, padding:"3px 12px", borderRadius:12 }}>{count}</span>}
      </div>
      {subtitle && <p style={{ margin:"6px 0 0", fontSize:FS.md, color:GD, lineHeight:1.55 }}>{subtitle}</p>}
      <div style={{ width:54, height:3, background:G, marginTop:11, borderRadius:2 }} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background:W, borderRadius:8, padding:"16px 18px", border:`1px solid ${GR}`, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
      <p style={{ margin:"0 0 6px", fontSize:FS.xs, fontWeight:700, color:GD, textTransform:"uppercase", letterSpacing:1 }}>{label}</p>
      <p style={{ margin:0, fontSize:FS.xl, fontWeight:800, color:N, lineHeight:1.2 }}>{value}</p>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function Dashboard() {
  const stats = [
    { label:"CEA Advisory Mandate", value:"10% Ester" },
    { label:"Voltage Class Covered", value:"≥ 33 kV" },
    { label:"Global Ester Market (2025)", value:"$3.8 Billion" },
    { label:"Market CAGR (2025–2034)", value:"7.4% CAGR" },
    { label:"CEA Offices to Visit", value:"5 RIOs + HQ" },
    { label:"Central PSUs to Engage", value:"7 Organisations" },
    { label:"State Transcos", value:"27 (5 Zones)" },
    { label:"DISCOMs (Letter by Day 14)", value:"55+ DISCOMs" },
    { label:"Private Utilities", value:"11 Licensees" },
    { label:"Transformer Manufacturers", value:"40+ OEMs" },
    { label:"Union Budget FY26 Power Capex", value:"₹2.6 Lakh Cr" },
    { label:"New Distribution TFs (2025–2030)", value:"1.2M+ Estimate" },
  ];
  const pillars = [
    { n:"1", t:"CEA Regional Offices", d:"5 locations — engage first to obtain compliance acknowledgements used in every utility meeting as regulatory anchor.", days:"Days 1–30" },
    { n:"2", t:"Central PSU Utilities", d:"7 major PSUs — highest volume & value. POWERGRID Bhiwadi 315 MVA is the most powerful reference in India.", days:"Days 15–60" },
    { n:"3", t:"State & Private Utilities", d:"27 Transcos + 55+ DISCOMs + 11 Private licensees — entire Indian power ecosystem covered by the Advisory.", days:"Days 20–90" },
    { n:"4", t:"Transformer Manufacturers", d:"40+ OEMs (33 kV & above) — factory-fill BOM specification creates supply contracts independent of utility tendering.", days:"Days 7–90" },
  ];
  return (
    <div>
      <SectionHeader title="Executive Dashboard" subtitle="90–120 Day Market Entry Plan | Natural & Synthetic Ester Oil | Indian Power Utilities | CEA Advisory I/64705/2026" />
      <div style={{ background:N, borderRadius:10, padding:"18px 24px", marginBottom:26, color:W }}>
        <p style={{ margin:"0 0 8px", fontSize:FS.xs, fontWeight:700, color:GL, letterSpacing:2, textTransform:"uppercase" }}>CEA Advisory — Effective 15 May 2026 | Ref: I/64705/2026</p>
        <p style={{ margin:"0 0 10px", fontSize:FS.md, fontStyle:"italic", lineHeight:1.65 }}>"All Central/State/Private Transmission Utilities are hereby advised to use Ester Oil as insulating/cooling fluid in at least 10% (preferably 5% Natural & 5% Synthetic Ester) of new Transformers, Reactors etc. for all voltage classes 33 kV and above."</p>
        <p style={{ margin:"0 0 4px", fontSize:FS.sm, color:"#9AB0CC", lineHeight:1.5 }}>Para 9 — URGENCY: "All utilities are requested to implement above advisory as soon as possible in view of present West Asia crisis scenario."</p>
        <p style={{ margin:0, fontSize:FS.xs, color:"#7A8FA5" }}>Signed: Sh. Gaurav Srivastava, Asst. Director (CEI Division) | CEA-PS-16/13/2025-CEI Division</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:14 }}>
        {stats.slice(0,4).map((s,i) => <StatCard key={i} {...s} />)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:14 }}>
        {stats.slice(4,8).map((s,i) => <StatCard key={i} {...s} />)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:30 }}>
        {stats.slice(8).map((s,i) => <StatCard key={i} {...s} />)}
      </div>
      <SectionHeader title="The 4-Pillar Strategy" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
        {pillars.map((p,i) => (
          <div key={i} style={{ background:W, border:`1px solid ${GR}`, borderRadius:8, padding:"20px 22px", display:"flex", gap:18 }}>
            <div style={{ width:48, height:48, minWidth:48, borderRadius:"50%", background:N, display:"flex", alignItems:"center", justifyContent:"center", fontSize:FS.xl, fontWeight:800, color:G }}>{p.n}</div>
            <div>
              <p style={{ margin:"0 0 7px", fontWeight:800, fontSize:FS.lg, color:N }}>{p.t}</p>
              <p style={{ margin:"0 0 12px", fontSize:FS.base, color:INK, lineHeight:1.6 }}>{p.d}</p>
              <Badge text={p.days} color={G} textColor={W} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Advisory() {
  const items = [
    ["Advisory Reference","CEA-PS-16/13/2025-CEI Division, I/64705/2026"],
    ["Date Issued","15 May 2026"],
    ["Issuing Authority","Central Electricity Authority (CEA), Ministry of Power, Government of India"],
    ["Signatory","Sh. Gaurav Srivastava, Assistant Director (CEI Division), CEA HQ"],
    ["Para 8 — Core Mandate","At least 10% (preferably 5% Natural + 5% Synthetic Ester) of new transformers/reactors ≥33 kV"],
    ["Para 9 — Urgency","Implement as soon as possible in view of present West Asia crisis scenario"],
    ["Addressees","Central PSUs | State Power Utilities | CTUIL/PGCIL/STUs | All DISCOMs/GENCOs/TRANSCOs | DG, IEEMA"],
    ["Early Adopters Cited","GETCO, NTPC, Powergrid, Indian Railways"],
    ["IS Standards","IS/IEC 62770 (Natural Ester) | IS/IEC 61099 (Synthetic Ester)"],
    ["Regulatory Basis","CEA (Measures relating to Safety and Electric Supply) Regulations, 2023"],
  ];
  const obs = [
    "Ester oil adoption accelerating globally — high fire safety (K-class, flash point >320°C) and biodegradability",
    "India predominantly imports mineral oil from crude oil — West Asia crisis = strategic energy security risk",
    "Early adopters already on record in the Advisory: GETCO, NTPC, POWERGRID, Indian Railways",
    "Advisory removes buyer inertia — every Chief Engineer now has regulatory basis to specify ester oil",
    "Both Natural Ester (IS/IEC 62770) AND Synthetic Ester (IS/IEC 61099) explicitly mandated",
    "OEM certification required — transformer design suitability for ester must be confirmed by manufacturer",
  ];
  return (
    <div>
      <SectionHeader title="Regulatory Trigger — CEA Advisory" subtitle="Landmark directive effective immediately — removes the single biggest adoption barrier: buyer inertia" />
      <div style={{ background:N, borderRadius:10, padding:"18px 22px", marginBottom:16 }}>
        <p style={{ margin:"0 0 8px", fontWeight:700, color:GL, fontSize:FS.lg }}>Para 8 — Core Mandate</p>
        <p style={{ margin:0, color:W, fontStyle:"italic", lineHeight:1.7, fontSize:FS.md }}>"All Central/State/Private Transmission Utilities are hereby advised to use Ester Oil as insulating/cooling fluid in at least 10% (preferably 5% Natural & 5% Synthetic Ester) of new Transformers, Reactors etc. to be procured/installed for all voltage classes 33 kV and above."</p>
      </div>
      <div style={{ background:G, borderRadius:8, padding:"14px 20px", marginBottom:26 }}>
        <p style={{ margin:0, fontWeight:700, color:W, fontSize:FS.md, lineHeight:1.5 }}>Para 9 — Urgency Clause: "All utilities are requested to implement above advisory as soon as possible in view of present West Asia crisis scenario."</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        <div>
          <h3 style={{ color:N, fontSize:FS.lg, margin:"0 0 16px" }}>Advisory Details</h3>
          {items.map(([k,v],i) => (
            <div key={i} style={{ display:"flex", borderBottom:`1px solid ${GR}`, padding:"10px 0", gap:14 }}>
              <span style={{ fontSize:FS.sm, color:GD, minWidth:180, fontWeight:700 }}>{k}</span>
              <span style={{ fontSize:FS.base, color:INK, lineHeight:1.55 }}>{v}</span>
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ color:N, fontSize:FS.lg, margin:"0 0 16px" }}>Key Observations</h3>
          {obs.map((o,i) => (
            <div key={i} style={{ background:i%2===0?W:ALT, borderRadius:6, padding:"12px 16px", marginBottom:7, display:"flex", gap:12 }}>
              <span style={{ width:8, height:8, background:G, borderRadius:"50%", marginTop:8, flexShrink:0 }} />
              <span style={{ fontSize:FS.base, color:INK, lineHeight:1.6 }}>{o}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CEAOffices() {
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("All");
  const filtered = useMemo(() => CEA_OFFICES.filter(o =>
    (zone==="All"||o.zone===zone) && (!search||[o.office,o.city,o.jurisdiction,o.contact].join(" ").toLowerCase().includes(search.toLowerCase()))
  ), [search, zone]);
  return (
    <div>
      <SectionHeader title="PILLAR 1 — CEA Regional Inspectorial Organisations" subtitle="Priority: Days 1–30 | Visit all 5+HQ to obtain compliance acknowledgements as regulatory anchor" count="6 Offices" />
      <div style={{ background:"#FFF8E7", border:`1px solid ${G}`, borderRadius:8, padding:"13px 18px", marginBottom:20, fontSize:FS.base }}>
        <strong>Objective:</strong> Register as a CEA-compliant ester oil supplier. Obtain RIO acknowledgement letter — used in every state utility and PSU meeting as regulatory proof of engagement.
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search offices, jurisdictions..." />
        <FilterPills options={["National","North","West","South","East","NE"]} selected={zone} onChange={setZone} />
      </div>
      <Table cols={["Office / RIO","City","Priority","Phone","Contact Officer","Jurisdiction","Full Address"]} rows={filtered.map(o=>[
        <strong style={{color:N,fontSize:FS.base}}>{o.office}</strong>,
        o.city,
        <Badge text={o.priority} color={o.priority.includes("1–7")?G:N} textColor={W} />,
        <span style={{fontSize:FS.base}}>{o.phone}</span>,
        <span style={{fontSize:FS.sm}}>{o.contact}</span>,
        <span style={{fontSize:FS.sm,color:GD}}>{o.jurisdiction}</span>,
        <span style={{fontSize:FS.sm}}>{o.address}</span>
      ])} />
      <div style={{ marginTop:20, background:OW, borderRadius:8, padding:"14px 20px" }}>
        <p style={{ margin:"0 0 6px", fontWeight:700, color:N, fontSize:FS.md }}>Deliverable from Each RIO Visit</p>
        <p style={{ margin:0, fontSize:FS.base, color:INK, lineHeight:1.65 }}>Written product compliance acknowledgement OR countersigned meeting minutes — used in all state utility and PSU meetings. Also request RIO to circulate product information to utilities in their jurisdiction as a multiplier.</p>
      </div>
    </div>
  );
}

function PSUUtilities() {
  const [tab, setTab] = useState("psu");
  const [search, setSearch] = useState("");
  const filtPSU = useMemo(() => PSU_UTILITIES.filter(u => !search||[u.name,u.role,u.address].join(" ").toLowerCase().includes(search.toLowerCase())), [search]);
  const filtPG = useMemo(() => PG_REGIONS.filter(r => !search||[r.region,r.address,r.coverage].join(" ").toLowerCase().includes(search.toLowerCase())), [search]);
  return (
    <div>
      <SectionHeader title="PILLAR 2 — Central Government / PSU Utilities" subtitle="Days 15–60 | Highest volume & value | File empanelment for all by Day 45" count="7 PSUs + 6 Regions" />
      <div style={{ background:"#E8F4FD", border:"1px solid #5AADEA", borderRadius:8, padding:"13px 18px", marginBottom:20, fontSize:FS.base }}>
        <strong>★ POWERGRID Reference Site:</strong> India's first 315 MVA Synthetic Ester transformer commissioned at Bhiwadi Substation (January 2026). Use as opening proof point in every PSU meeting.
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {[["psu","7 Central PSUs"],["pg","6 POWERGRID Regions"]].map(([id,label]) => (
          <button key={id} onClick={()=>setTab(id)} style={{ padding:"9px 20px", borderRadius:6, border:`1px solid ${tab===id?N:GR}`, background:tab===id?N:W, color:tab===id?W:GD, fontSize:FS.base, cursor:"pointer", fontWeight:tab===id?700:400 }}>{label}</button>
        ))}
        <div style={{ marginLeft:"auto" }}><SearchBar value={search} onChange={setSearch} placeholder="Search..." /></div>
      </div>
      {tab==="psu" && <Table cols={["Organisation","Role","Priority","Phone","Address","Category"]} rows={filtPSU.map(u=>[
        <strong style={{color:N,fontSize:FS.base}}>{u.name}</strong>,
        <span style={{fontSize:FS.base,lineHeight:1.55}}>{u.role}</span>,
        <Badge text={u.priority} color={u.priority.includes("★")?G:N} textColor={W} />,
        <span style={{fontSize:FS.base}}>{u.phone}</span>,
        <span style={{fontSize:FS.sm}}>{u.address}</span>,
        <span style={{fontSize:FS.sm,color:GD}}>{u.category}</span>
      ])} />}
      {tab==="pg" && <Table cols={["Region","Phone","States Covered","Address"]} rows={filtPG.map(r=>[
        <strong style={{color:N,fontSize:FS.base}}>{r.region}</strong>,
        <span style={{fontSize:FS.base}}>{r.phone}</span>,
        <span style={{fontSize:FS.base,color:GD}}>{r.coverage}</span>,
        <span style={{fontSize:FS.sm}}>{r.address}</span>
      ])} />}
    </div>
  );
}

function StateTranscos() {
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("All");
  const filtered = useMemo(() => STATE_TRANSCOS.filter(t =>
    (zone==="All"||t.zone===zone) && (!search||[t.state,t.utility,t.hq].join(" ").toLowerCase().includes(search.toLowerCase()))
  ), [search, zone]);
  const zC = ["West","South","North","East","NE"].reduce((a,z)=>({...a,[z]:STATE_TRANSCOS.filter(t=>t.zone===z).length}),{});
  const zCol = { West:"#2E7D32", South:"#1565C0", North:"#6A1B9A", East:"#E65100", NE:"#00695C" };
  return (
    <div>
      <SectionHeader title="PILLAR 3A — State Transmission Utilities" subtitle="Days 20–75 | Primary volume targets | All own 33 kV & above infrastructure" count="27 Transcos" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:24 }}>
        {Object.entries(zC).map(([z,c]) => (
          <div key={z} style={{ background:N, borderRadius:8, padding:"14px 16px", textAlign:"center" }}>
            <p style={{ margin:"0 0 4px", fontSize:28, fontWeight:800, color:GL }}>{c}</p>
            <p style={{ margin:0, fontSize:FS.sm, color:"#9AB0CC" }}>{z} Zone</p>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search state, utility..." />
        <FilterPills options={["West","South","North","East","NE"]} selected={zone} onChange={setZone} />
      </div>
      <Table cols={["State","Transmission Utility","HQ City","Zone","Visit Window"]} rows={filtered.map(t=>[
        <span style={{fontSize:FS.base,fontWeight:600}}>{t.state}</span>,
        <strong style={{color:N,fontSize:FS.base}}>{t.utility}</strong>,
        t.hq,
        <Badge text={t.zone} color={zCol[t.zone]||GD} textColor={W} />,
        <Badge text={t.priority} color={t.priority.includes("★")?G:OW} textColor={t.priority.includes("★")?W:INK} />
      ])} />
    </div>
  );
}

function DISCOMs() {
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("All");
  const filtered = useMemo(() => DISCOMS.filter(d =>
    (zone==="All"||d.zone===zone) && (!search||[d.name,d.state].join(" ").toLowerCase().includes(search.toLowerCase()))
  ), [search, zone]);
  const zC = ["North","West","South","East","NE"].reduce((a,z)=>({...a,[z]:DISCOMS.filter(d=>d.zone===z).length}),{});
  const zCol = { West:"#2E7D32", South:"#1565C0", North:"#6A1B9A", East:"#E65100", NE:"#00695C" };
  return (
    <div>
      <SectionHeader title="PILLAR 3B — State DISCOMs (All India)" subtitle="100% product letter + CEA Advisory by Day 14 | Priority in-person meetings: minimum 15" count={`${DISCOMS.length} DISCOMs`} />
      <div style={{ background:"#FFF3CD", border:"1px solid #F0C040", borderRadius:8, padding:"13px 18px", marginBottom:18, fontSize:FS.base }}>
        <strong>Day 14 KPI:</strong> Product letter + CEA Advisory + TDS dispatched to all {DISCOMS.length}+ DISCOMs. West Zone (SOTL home territory) is highest urgency — personal visits for MSEDCL and all Gujarat DISCOMs.
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:24 }}>
        {Object.entries(zC).map(([z,c]) => (
          <div key={z} style={{ background:OW, border:`1px solid ${GR}`, borderRadius:8, padding:"14px 16px", textAlign:"center" }}>
            <p style={{ margin:"0 0 4px", fontSize:28, fontWeight:800, color:N }}>{c}</p>
            <p style={{ margin:0, fontSize:FS.sm, color:GD }}>{z} Zone</p>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search DISCOM, state..." />
        <FilterPills options={["North","West","South","East","NE"]} selected={zone} onChange={setZone} />
      </div>
      <Table cols={["#","DISCOM / Utility","State","Zone"]} rows={filtered.map((d,i)=>[
        <span style={{color:GD,fontSize:FS.sm}}>{i+1}</span>,
        <strong style={{color:N,fontSize:FS.base}}>{d.name}</strong>,
        <span style={{fontSize:FS.base}}>{d.state}</span>,
        <Badge text={d.zone} color={zCol[d.zone]||GD} textColor={W} />
      ])} />
    </div>
  );
}

function PrivateUtilities() {
  const [search, setSearch] = useState("");
  const [urgency, setUrgency] = useState("All");
  const filtered = useMemo(() => PRIVATE_UTILITIES.filter(u =>
    (urgency==="All"||u.urgency===urgency) && (!search||[u.name,u.territory,u.hq].join(" ").toLowerCase().includes(search.toLowerCase()))
  ), [search, urgency]);
  return (
    <div>
      <SectionHeader title="PILLAR 3C — Private Distribution Licensees" subtitle="Days 30–75 | Faster decisions than PSUs | Target Long-Term Agreements (LTAs) | Min 8 of 11" count="11 Utilities" />
      <div style={{ background:OW, borderRadius:8, padding:"14px 20px", marginBottom:20, fontSize:FS.base, border:`1px solid ${GR}` }}>
        <strong>Strategy:</strong> Private utilities are faster decision-makers — target for early revenue before PSU tenders open. Suitable for LTAs rather than individual tenders. Highest-urgency: AEML, Torrent, TPDDL.
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search utility, territory..." />
        <FilterPills options={["Highest","High","Medium"]} selected={urgency} onChange={setUrgency} />
      </div>
      <Table cols={["Private Utility","Territory / Consumers","Headquarters","Priority Window","Urgency","SOTL Approach"]} rows={filtered.map(u=>[
        <strong style={{color:N,fontSize:FS.base}}>{u.name}</strong>,
        <span style={{fontSize:FS.base,lineHeight:1.55}}>{u.territory}</span>,
        <span style={{fontSize:FS.base}}>{u.hq}</span>,
        <Badge text={u.priority} color={N} textColor={W} />,
        <Badge text={u.urgency} color={u.urgency==="Highest"?G:u.urgency==="High"?NM:GD} textColor={W} />,
        <span style={{fontSize:FS.base,lineHeight:1.55}}>{u.approach}</span>
      ])} />
    </div>
  );
}

function Manufacturers() {
  const [tier, setTier] = useState("t1");
  const [search, setSearch] = useState("");
  const fT1 = useMemo(() => MANUFACTURERS_T1.filter(m => !search||[m.name,m.location,m.products,m.clients||""].join(" ").toLowerCase().includes(search.toLowerCase())), [search]);
  const fT2 = useMemo(() => MANUFACTURERS_T2.filter(m => !search||[m.name,m.location,m.products].join(" ").toLowerCase().includes(search.toLowerCase())), [search]);
  const fT3 = useMemo(() => MANUFACTURERS_T3.filter(m => !search||[m.name,m.location,m.products].join(" ").toLowerCase().includes(search.toLowerCase())), [search]);
  const total = MANUFACTURERS_T1.length+MANUFACTURERS_T2.length+MANUFACTURERS_T3.length;
  return (
    <div>
      <SectionHeader title="PILLAR 4 — Transformer Manufacturers (33 kV & Above)" subtitle="Confirmation letters to ALL tiers by Day 14 | Factory visits Tier 1 by Day 45 | IEEMA engagement Day 70–90" count={`${total} OEMs`} />
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {[["t1",`Tier 1 — Critical Priority (${MANUFACTURERS_T1.length})`],["t2",`Tier 2 — Mid-Scale (${MANUFACTURERS_T2.length})`],["t3",`Tier 3 — Regional (${MANUFACTURERS_T3.length})`]].map(([id,label]) => (
          <button key={id} onClick={()=>setTier(id)} style={{ padding:"9px 18px", borderRadius:6, border:`1px solid ${tier===id?N:GR}`, background:tier===id?N:W, color:tier===id?W:GD, fontSize:FS.base, cursor:"pointer", fontWeight:tier===id?700:400 }}>{label}</button>
        ))}
        <div style={{ marginLeft:"auto" }}><SearchBar value={search} onChange={setSearch} placeholder="Search manufacturer, location, product..." /></div>
      </div>

      {tier==="t1" && <>
        <div style={{ background:"#FFF8E7", border:`1px solid ${G}`, borderRadius:8, padding:"13px 18px", marginBottom:14, fontSize:FS.base }}>
          <strong>Tier 1 Protocol:</strong> Personal factory visit + complimentary trial quantities (33 kV+ units) + half-day technical seminar on IS/IEC ester oil standards + BOM specification inclusion request
        </div>
        <Table cols={["Manufacturer","Location","Voltage","MVA Range","Key Products","Key Clients","Contact","Visit Window","Approach"]} rows={fT1.map(m=>[
          <strong style={{color:N,fontSize:FS.base}}>{m.name}</strong>,
          <span style={{fontSize:FS.base}}>{m.location}</span>,
          <Badge text={m.voltageRange} color={OW} textColor={INK} />,
          <span style={{fontSize:FS.sm,color:GD}}>{m.mvaRange}</span>,
          <span style={{fontSize:FS.sm,lineHeight:1.6}}>{m.products}</span>,
          <span style={{fontSize:FS.sm,color:GD,lineHeight:1.6}}>{m.clients}</span>,
          <span style={{fontSize:FS.sm}}>{m.contact}</span>,
          <Badge text={m.window} color={N} textColor={W} />,
          <span style={{fontSize:FS.sm,lineHeight:1.6}}>{m.approach}</span>
        ])} />
      </>}

      {tier==="t2" && <>
        <div style={{ background:OW, border:`1px solid ${GR}`, borderRadius:8, padding:"13px 18px", marginBottom:14, fontSize:FS.base }}>
          <strong>Tier 2 Protocol:</strong> Factory visit + trial quantity offer + BOM specification request | Days 40–70 | Coordinate visits with nearby Tier-1 OEM and utility visits for efficiency
        </div>
        <Table cols={["Manufacturer","Location","Voltage","MVA Range","Key Products & Clients","Visit Window"]} rows={fT2.map(m=>[
          <strong style={{color:N,fontSize:FS.base}}>{m.name}</strong>,
          <span style={{fontSize:FS.base}}>{m.location}</span>,
          <Badge text={m.voltageRange} color={OW} textColor={INK} />,
          <span style={{fontSize:FS.sm,color:GD}}>{m.mvaRange}</span>,
          <span style={{fontSize:FS.base,lineHeight:1.6}}>{m.products}</span>,
          <Badge text={m.window} color={N} textColor={W} />
        ])} />
      </>}

      {tier==="t3" && <>
        <div style={{ background:OW, border:`1px solid ${GR}`, borderRadius:8, padding:"13px 18px", marginBottom:14, fontSize:FS.base }}>
          <strong>Tier 3 Protocol:</strong> Confirmation letter (Annexure A) dispatched by Day 14 | Follow-up calls Day 60–90 | Schedule factory visits based on positive responses | Regional State DISCOM suppliers
        </div>
        <Table cols={["Manufacturer","Location","Voltage","Key Products","Visit Window"]} rows={fT3.map(m=>[
          <strong style={{color:N,fontSize:FS.base}}>{m.name}</strong>,
          <span style={{fontSize:FS.base}}>{m.location}</span>,
          <Badge text={m.voltageRange} color={OW} textColor={INK} />,
          <span style={{fontSize:FS.base,lineHeight:1.6}}>{m.products}</span>,
          <Badge text={m.window} color={N} textColor={W} />
        ])} />
        <div style={{ marginTop:20, background:N, borderRadius:8, padding:"18px 22px" }}>
          <p style={{ margin:"0 0 8px", fontWeight:700, color:GL, fontSize:FS.lg }}>IEEMA DG Engagement — Days 70–90</p>
          <p style={{ margin:0, fontSize:FS.base, color:W, lineHeight:1.7 }}>IEEMA DG is a direct addressee of the CEA Advisory. Request a speaking slot at the next IEEMA Transformer Division meeting to address ALL member manufacturers collectively — one presentation reaches the entire industry simultaneously. Also request IEEMA to circulate the advisory to all member manufacturers as a multiplier at zero cost.</p>
        </div>
      </>}
    </div>
  );
}

function Timeline() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <SectionHeader title="90–120 Day Phased Engagement Calendar" subtitle="7 phases from Day 1 to Day 120 | Click any phase to expand full activity list" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:28 }}>
        {[["Day 1–14","Foundation & Readiness"],["Day 7–30","Regulatory Visits"],["Day 15–75","Utilities & Manufacturers"],["Day 90–120","Consolidation & Board"]].map(([d,l],i) => (
          <div key={i} style={{ background:OW, borderRadius:8, padding:"13px 16px", border:`1px solid ${GR}` }}>
            <p style={{ margin:"0 0 3px", fontSize:FS.sm, fontWeight:700, color:G, letterSpacing:1 }}>{d}</p>
            <p style={{ margin:0, fontSize:FS.md, color:N, fontWeight:700 }}>{l}</p>
          </div>
        ))}
      </div>
      {TIMELINE_PHASES.map((ph,i) => (
        <div key={i} style={{ marginBottom:10, border:`1px solid ${GR}`, borderRadius:8, overflow:"hidden" }}>
          <button onClick={()=>setOpen(open===i?null:i)} style={{ width:"100%", display:"flex", alignItems:"center", gap:16, padding:"16px 22px", background:open===i?N:W, border:"none", cursor:"pointer", textAlign:"left" }}>
            <span style={{ width:36, height:36, borderRadius:"50%", background:open===i?G:N, display:"flex", alignItems:"center", justifyContent:"center", fontSize:FS.lg, fontWeight:800, color:W, flexShrink:0 }}>{ph.phase}</span>
            <div style={{ flex:1 }}>
              <p style={{ margin:"0 0 3px", fontWeight:700, fontSize:FS.lg, color:open===i?W:N }}>{ph.title}</p>
              <p style={{ margin:0, fontSize:FS.base, color:open===i?"#9AB0CC":GD }}>{ph.days}</p>
            </div>
            <span style={{ color:open===i?GL:GD, fontSize:20 }}>{open===i?"▲":"▼"}</span>
          </button>
          {open===i && (
            <div style={{ padding:"16px 22px", borderTop:`1px solid ${GR}` }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:OW }}>
                    <th style={{ padding:"9px 12px", textAlign:"left", color:GD, fontWeight:700, fontSize:FS.sm, width:125 }}>Day Window</th>
                    <th style={{ padding:"9px 12px", textAlign:"left", color:GD, fontWeight:700, fontSize:FS.sm }}>Action / Deliverable</th>
                    <th style={{ padding:"9px 12px", textAlign:"left", color:GD, fontWeight:700, fontSize:FS.sm, width:165 }}>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {ph.items.map((item,j) => (
                    <tr key={j} style={{ borderBottom:`1px solid ${GR}`, background:j%2===0?W:ALT }}>
                      <td style={{ padding:"11px 12px", color:G, fontWeight:700, fontSize:FS.sm, whiteSpace:"nowrap" }}>{item.day}</td>
                      <td style={{ padding:"11px 12px", color:INK, fontSize:FS.base, lineHeight:1.6 }}>{item.action}</td>
                      <td style={{ padding:"11px 12px", color:GD, fontSize:FS.sm }}>{item.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function KPI() {
  const [statuses, setStatuses] = useState(KPIS.map(()=>0));
  const labels = ["Not Started","In Progress","Completed"];
  const colors = [GD, G, "#2E7D32"];
  const cats = [...new Set(KPIS.map(k=>k.category))];
  const completed = statuses.filter(s=>s===2).length;
  const inProgress = statuses.filter(s=>s===1).length;
  return (
    <div>
      <SectionHeader title="KPI Scorecard — 120 Day Performance Targets" subtitle="Click status to cycle: Not Started → In Progress → Completed | Review gates: Day 30 / 60 / 90 / 120" count={`${KPIS.length} KPIs`} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:28 }}>
        <div style={{ background:W, border:`1px solid ${GR}`, borderRadius:8, padding:"16px 20px", textAlign:"center" }}>
          <p style={{ margin:"0 0 5px", fontSize:36, fontWeight:800, color:GD }}>{KPIS.length-completed-inProgress}</p>
          <p style={{ margin:0, fontSize:FS.md, color:GD }}>Not Started</p>
        </div>
        <div style={{ background:"#FFF8E7", border:`1px solid ${G}`, borderRadius:8, padding:"16px 20px", textAlign:"center" }}>
          <p style={{ margin:"0 0 5px", fontSize:36, fontWeight:800, color:G }}>{inProgress}</p>
          <p style={{ margin:0, fontSize:FS.md, color:GD }}>In Progress</p>
        </div>
        <div style={{ background:"#E8F5E9", border:"1px solid #2E7D32", borderRadius:8, padding:"16px 20px", textAlign:"center" }}>
          <p style={{ margin:"0 0 5px", fontSize:36, fontWeight:800, color:"#2E7D32" }}>{completed}</p>
          <p style={{ margin:0, fontSize:FS.md, color:GD }}>Completed</p>
        </div>
      </div>
      {cats.map((cat,ci) => (
        <div key={ci} style={{ marginBottom:24 }}>
          <p style={{ margin:"0 0 10px", fontWeight:700, fontSize:FS.lg, color:N, borderLeft:`4px solid ${G}`, paddingLeft:12 }}>{cat}</p>
          {KPIS.map((kpi,ki) => kpi.category!==cat?null:(
            <div key={ki} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 18px", background:ki%2===0?W:ALT, borderRadius:6, marginBottom:5, border:`1px solid ${GR}` }}>
              <span style={{ flex:1, fontSize:FS.base, color:INK, lineHeight:1.55 }}>{kpi.kpi}</span>
              <span style={{ fontSize:FS.base, color:GD, minWidth:230 }}>{kpi.target}</span>
              <Badge text={`Gate: ${kpi.gate}`} color={OW} textColor={GD} />
              <button onClick={()=>setStatuses(s=>{const n=[...s];n[ki]=(n[ki]+1)%3;return n;})}
                style={{ padding:"6px 18px", borderRadius:16, border:"none", cursor:"pointer", fontSize:FS.base, fontWeight:700, background:colors[statuses[ki]], color:W, minWidth:125, transition:"all 0.15s" }}>
                {labels[statuses[ki]]}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Risk() {
  const iC = {"High":"#C62828","Medium":"#E65100","Low":"#2E7D32"};
  const lC = {"High":G,"Medium":NM,"Low":GD};
  return (
    <div>
      <SectionHeader title="Risk & Mitigation Framework" subtitle="7 key risks identified with pre-emptive mitigation strategies for each" count="7 Risks" />
      {RISKS.map((r,i) => (
        <div key={i} style={{ background:i%2===0?W:ALT, borderRadius:8, padding:"16px 20px", marginBottom:10, border:`1px solid ${GR}` }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:10 }}>
            <p style={{ margin:0, fontWeight:700, fontSize:FS.md, color:N, lineHeight:1.45, flex:1 }}>{r.risk}</p>
            <div style={{ display:"flex", gap:8, flexShrink:0 }}>
              <Badge text={`Likelihood: ${r.likelihood}`} color={lC[r.likelihood]} textColor={W} />
              <Badge text={`Impact: ${r.impact}`} color={iC[r.impact]} textColor={W} />
            </div>
          </div>
          <p style={{ margin:0, fontSize:FS.base, color:INK, lineHeight:1.65 }}><span style={{ fontWeight:700, color:GD }}>Mitigation: </span>{r.mitigation}</p>
        </div>
      ))}
    </div>
  );
}

function Training() {
  const days = [
    { day:"Day 1", title:"Foundations & Fluid Selection", items:[
      "Chemical & molecular differences: mineral oil vs natural ester vs synthetic ester",
      "Flash point: Natural ester >320°C vs mineral oil ~145°C | Fire point: >350°C vs ~160°C",
      "Moisture tolerance: Natural ester holds 1,100 ppm vs 55 ppm for mineral oil — 5–8x longer paper insulation life",
      "Environmental standards & OECD 301B biodegradability testing (>98% for natural ester in 28 days)",
      "Life cycle cost (LCC) analysis: ROI through asset life extension — net saving despite 2–3x upfront premium",
    ]},
    { day:"Day 2", title:"Design, Integration & Manufacturing", items:[
      "Thermal management: natural ester viscosity 3–4x higher than mineral oil; may run 5–8°C hotter at operating temperature",
      "Radiator and fan configuration adjustments required to maintain IEEE hot-spot rise limit of 65°C",
      "Dielectric impulse withstand: smoother electrode surfaces needed; 10–15% lower impulse strength with sharp edges",
      "Material compatibility: nitrile / Viton gaskets, adhesives, paints, component verification essential before use",
      "Vacuum filling protocol: <1 mbar for 500 kV equipment; deep impregnation; settling time before re-energization",
    ]},
    { day:"Day 3", title:"Maintenance, Diagnostics & Retrofilling", items:[
      "Routine oil tests per IEC 62975 and IS 16659 — ester-specific test protocols differ from mineral oil standards",
      "DGA interpretation using Duval Pentagons (adapted for esters — mineral oil charts cannot be applied to esters)",
      "Stray gassing: natural esters generate 200–300 ppm ethane by chemical structure — this is NOT a fault indicator",
      "Moisture monitoring: 100 ppm in natural ester = extremely healthy (same level in mineral oil = critical failure risk)",
      "Retrofilling: drain → flush with ester → vacuum fill under <5 mbar → Karl Fischer test → test → re-energize",
    ]},
  ];
  const sales = [
    { t:"K-Class Fire Safety Premium", d:"Flash point >320°C eliminates mandatory oil containment infrastructure in many urban installations — significant capital saving for the utility. K-class classification also reduces insurance premiums." },
    { t:"Lifecycle Cost Model", d:"Present NPV analysis: 5–8x longer cellulose insulation life + reduced fire risk + deferred capital expenditure on transformer replacement = net saving over transformer life despite 2–3x upfront fluid premium." },
    { t:"ESG & Import-Substitution Angle", d:"Domestic, bio-based product — directly reduces crude oil import dependency. Addresses West Asia crisis narrative cited in CEA Advisory Para 9. Critical for utilities with sustainability mandates." },
    { t:"CEA Regulatory Compliance", d:"Every buyer now has the CEA Advisory as regulatory basis for procurement. Use RIO acknowledgement letter obtained in Phase 2 as third-party regulatory validation in every meeting." },
    { t:"POWERGRID Reference — India's Most Powerful Proof Point", d:"Bhiwadi 315 MVA Synthetic Ester transformer (January 2026) — India's first and most powerful deployment. POWERGRID's endorsement is the single most powerful commercial reference available in India today." },
  ];
  return (
    <div>
      <SectionHeader title="Education & Training Plan" subtitle="3-Day Technical Curriculum for Engineers + Strategic Sales Training + Field Application Support" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:32 }}>
        {days.map((d,i) => (
          <div key={i} style={{ borderRadius:8, overflow:"hidden", border:`1px solid ${GR}` }}>
            <div style={{ background:N, padding:"15px 18px" }}>
              <p style={{ margin:"0 0 4px", fontSize:FS.sm, color:GL, fontWeight:700, letterSpacing:1 }}>{d.day}</p>
              <p style={{ margin:0, fontWeight:800, fontSize:FS.lg, color:W, lineHeight:1.3 }}>{d.title}</p>
            </div>
            <div style={{ padding:"16px 18px", background:W }}>
              {d.items.map((item,j) => (
                <div key={j} style={{ display:"flex", gap:10, marginBottom:14 }}>
                  <span style={{ width:8, height:8, background:G, borderRadius:"50%", marginTop:8, flexShrink:0 }} />
                  <span style={{ fontSize:FS.base, color:INK, lineHeight:1.65 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SectionHeader title="Strategic Sales Training — Consultative Selling" />
      {sales.map((s,i) => (
        <div key={i} style={{ background:i%2===0?W:ALT, border:`1px solid ${GR}`, borderRadius:8, padding:"16px 20px", marginBottom:9, display:"flex", gap:16 }}>
          <div style={{ width:8, borderRadius:4, background:G, flexShrink:0 }} />
          <div>
            <p style={{ margin:"0 0 6px", fontWeight:700, fontSize:FS.md, color:N }}>{s.t}</p>
            <p style={{ margin:0, fontSize:FS.base, color:INK, lineHeight:1.65 }}>{s.d}</p>
          </div>
        </div>
      ))}
      <div style={{ marginTop:24, background:N, borderRadius:8, padding:"18px 22px" }}>
        <p style={{ margin:"0 0 8px", fontWeight:700, color:GL, fontSize:FS.lg }}>Field Application Engineer Deployment</p>
        <p style={{ margin:0, fontSize:FS.base, color:W, lineHeight:1.7 }}>Deploy Field Application Engineers at Tier-1 OEM factory trials and key utility pilot sites. Provide free ester oil handling manual, certified maintenance training, and DGA interpretation support. Converting technical inertia into advocacy dramatically accelerates empanelment decisions — and creates internal champions within the utility or OEM organisation.</p>
      </div>
    </div>
  );
}

const NAV = [
  { id:"dashboard", label:"Dashboard", icon:"📊" },
  { id:"advisory", label:"Regulatory Trigger", icon:"📋" },
  { id:"cea", label:"CEA Offices", icon:"🏛️" },
  { id:"psu", label:"PSU Utilities", icon:"⚡" },
  { id:"transcos", label:"State Transcos", icon:"🔌" },
  { id:"discoms", label:"DISCOMs", icon:"🏘️" },
  { id:"private", label:"Private Utilities", icon:"🏢" },
  { id:"manufacturers", label:"Manufacturers", icon:"🏭" },
  { id:"timeline", label:"90-Day Timeline", icon:"📅" },
  { id:"kpi", label:"KPI Scorecard", icon:"🎯" },
  { id:"risk", label:"Risk Framework", icon:"⚠️" },
  { id:"training", label:"Training Plan", icon:"🎓" },
];

export default function App() {
  const [active, setActive] = useState("dashboard");
  const pages = { dashboard:<Dashboard/>, advisory:<Advisory/>, cea:<CEAOffices/>, psu:<PSUUtilities/>, transcos:<StateTranscos/>, discoms:<DISCOMs/>, private:<PrivateUtilities/>, manufacturers:<Manufacturers/>, timeline:<Timeline/>, kpi:<KPI/>, risk:<Risk/>, training:<Training/> };
  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"system-ui,sans-serif", background:OW }}>
      <div style={{ width:234, minWidth:234, background:N, display:"flex", flexDirection:"column", overflowY:"auto", boxShadow:"2px 0 8px rgba(0,0,0,0.15)" }}>
        <div style={{ padding:"22px 18px 16px", borderBottom:`1px solid ${NM}` }}>
          <p style={{ margin:"0 0 3px", fontSize:11, fontWeight:700, color:GL, letterSpacing:2, textTransform:"uppercase" }}>Savita Oil Technologies</p>
          <p style={{ margin:"0 0 6px", fontSize:FS.md, fontWeight:800, color:W, lineHeight:1.3 }}>Ester Oil Market Entry</p>
          <p style={{ margin:0, fontSize:12, color:"#7A96B4" }}>90–120 Day Plan | FY27</p>
        </div>
        <div style={{ padding:"10px 0", flex:1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={()=>setActive(n.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:11, padding:"12px 18px", background:active===n.id?"rgba(184,150,46,0.18)":"transparent", border:"none", borderLeft:active===n.id?`3px solid ${G}`:"3px solid transparent", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
              <span style={{ fontSize:18 }}>{n.icon}</span>
              <span style={{ fontSize:FS.base, fontWeight:active===n.id?700:400, color:active===n.id?W:"#9AB0CC" }}>{n.label}</span>
            </button>
          ))}
        </div>
        <div style={{ padding:"14px 18px", borderTop:`1px solid ${NM}` }}>
          <p style={{ margin:"0 0 3px", fontSize:12, color:"#7A96B4" }}>CEA Advisory</p>
          <p style={{ margin:0, fontSize:11, color:"#5A7A9A", lineHeight:1.4 }}>I/64705/2026 | 15 May 2026</p>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"32px 38px" }}>
        {pages[active]}
      </div>
    </div>
  );
}
