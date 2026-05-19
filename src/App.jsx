import { useState, useMemo, useCallback } from "react";

const N="#1B3358",NM="#264573",G="#B8962E",GL="#D4AF52",W="#FFFFFF",OW="#F5F7FA",GR="#E8ECF0",GD="#6B7A92",INK="#1A1F2E",ALT="#EEF2F7";
const FS={xs:12,sm:14,base:15,md:16,lg:18,xl:20,h1:26};
const ZONE_COL={West:"#2E7D32",South:"#1565C0",North:"#6A1B9A",East:"#E65100",NE:"#00695C",National:"#B8962E"};

// ── DATA ─────────────────────────────────────────────────────────────────────

const CEA_OFFICES=[
  {office:"CEA HQ / CEI Division",city:"New Delhi",address:"Sewa Bhavan, R.K. Puram, Sector-1, New Delhi – 110066",phone:"011-26510249",contact:"Sh. Gaurav Srivastava, Asst. Director (CEI Division) | +91-9650373381",jurisdiction:"National — Advisory Origin",priority:"Day 1–7 ★",zone:"National"},
  {office:"RIO (North)",city:"New Delhi",address:"Room No. 324, NRPC Building, 18-A, Shaheed Jeet Singh Marg, Katwaria Sarai, New Delhi – 110016",phone:"011-26510249",contact:"Sh. I.K. Mehra, Director",jurisdiction:"Delhi, UP, Uttarakhand, Haryana, Punjab, HP, Rajasthan, J&K, Ladakh",priority:"Day 7–15",zone:"North"},
  {office:"RIO (West)",city:"Mumbai",address:"Ground Floor, WRPC Building, Plot No. F-3, MIDC Area Marol, Andheri (East), Mumbai – 400093",phone:"022-28211003",contact:"Sh. B. Venkata Sandeep, Dy. Director",jurisdiction:"Maharashtra, Gujarat, MP, Chhattisgarh, Goa, Daman & Diu, Dadra & NH",priority:"Day 7–15",zone:"West"},
  {office:"RIO (South)",city:"Chennai",address:"Block-4, III Floor, Shastri Bhawan, Haddows Road, Chennai – 600006",phone:"044-28257051",contact:"Sh. Lenin B., Dy. Director",jurisdiction:"Tamil Nadu, Kerala, Andhra Pradesh, Karnataka, Telangana, Puducherry",priority:"Day 10–20",zone:"South"},
  {office:"RIO (East)",city:"Kolkata",address:"ERPC Building, 14 Golf Club Road, Tollygunge, Kolkata – 700033",phone:"033-24235107",contact:"Sh. Mohit Bansal, Dy. Director",jurisdiction:"West Bengal, Bihar, Odisha, Jharkhand, Sikkim",priority:"Day 15–25",zone:"East"},
  {office:"RIO (North-East)",city:"Shillong",address:"NERPC Complex, Nongrim Hills, Shillong – 793003",phone:"0364-2521086",contact:"Sh. Farooq Iqbal, Dy. Director",jurisdiction:"Assam, Arunachal Pradesh, Nagaland, Manipur, Meghalaya, Mizoram, Tripura",priority:"Day 20–30",zone:"NE"},
];

const PSU_UTILITIES=[
  {name:"POWERGRID / PGCIL",role:"National transmission; 287+ substations; India's first 315 MVA Synthetic Ester transformer (Bhiwadi, Jan 2026)",address:"Saudamini, Plot No. 2, Sector 29, Gurugram, Haryana – 122001",phone:"0124-2822000",category:"CTUIL/PGCIL/STU",priority:"Day 15–20 ★"},
  {name:"NTPC Limited",role:"Largest power generator; owns substations; generator transformers",address:"NTPC Bhawan, SCOPE Complex, Lodhi Road, New Delhi – 110003",phone:"+91-11-24387001",category:"Central PSU",priority:"Day 15–20"},
  {name:"NHPC Limited",role:"Hydro generation; operates EHV substations at hydro projects",address:"NHPC Office Complex, Sector 33, Faridabad, Haryana",phone:"—",category:"Central PSU",priority:"Day 25–30"},
  {name:"NLC India Limited",role:"Lignite-based power generation; major transformer fleet",address:"No. 135, EVR Periyar High Road, Kilpauk, Chennai – 600010",phone:"044-28369111",category:"Central PSU",priority:"Day 30–40"},
  {name:"SECI",role:"Renewable energy; HV substations for solar & wind parks across India",address:"6th Floor, Plate-B, NBCC Office Block Tower-2, East Kidwai Nagar, New Delhi – 110023",phone:"—",category:"Central PSU",priority:"Day 25–35"},
  {name:"REC Limited",role:"Finances utility infrastructure; embed ester spec in loan conditions",address:"Core-4, SCOPE Complex, Lodhi Road, New Delhi",phone:"—",category:"Financing Body",priority:"Day 30–45"},
  {name:"PFC (Power Finance Corp.)",role:"Government infrastructure financier; embed ester spec in funded projects",address:"Urjanidhi, 1 Barakhamba Lane, New Delhi – 110001",phone:"—",category:"Financing Body",priority:"Day 30–45"},
];

// ALL 36 STATE/UT TRANSCOS from database
const STATE_TRANSCOS=[
  {state:"Andaman & Nicobar",utility:"Electricity Department, UT of A&N Islands",hq:"Port Blair",address:"Vidyut Bhawan, Marine Hill, Port Blair",pin:"744101",zone:"South",priority:"Day 55–70"},
  {state:"Andhra Pradesh",utility:"Transmission Corporation of AP Ltd (APTRANSCO)",hq:"Vijayawada",address:"#48-12-16, Vidyut Soudha, Gunadala, Vijayawada",pin:"520004",zone:"South",priority:"Day 30–40"},
  {state:"Arunachal Pradesh",utility:"Department of Power, Arunachal Pradesh",hq:"Itanagar",address:"Vidyut Bhawan, NH-52A, Itanagar",pin:"791113",zone:"NE",priority:"Day 55–70"},
  {state:"Assam",utility:"Assam Electricity Grid Corporation Ltd (AEGCL)",hq:"Guwahati",address:"1st Floor, Bijulee Bhawan, Paltan Bazar, Guwahati",pin:"781001",zone:"NE",priority:"Day 45–60"},
  {state:"Bihar",utility:"Bihar State Power Transmission Company Ltd (BSPTCL)",hq:"Patna",address:"4th Floor, Vidyut Bhawan, Bailey Road, Patna",pin:"800021",zone:"East",priority:"Day 40–55"},
  {state:"Chandigarh",utility:"Chandigarh Electricity Department",hq:"Chandigarh",address:"Deluxe Building, 5th Floor, Sector 9-D, Chandigarh",pin:"160009",zone:"North",priority:"Day 45–55"},
  {state:"Chhattisgarh",utility:"Chhattisgarh State Power Transmission Co Ltd (CSPTCL)",hq:"Raipur",address:"Vidyut Seva Bhavan, Dangania, Raipur",pin:"492013",zone:"West",priority:"Day 35–45"},
  {state:"D&NH and D&D",utility:"DNH & DD Power Distribution Corporation Ltd",hq:"Silvassa",address:"Vidhyut Bhavan, 66 KV Road, Near Secretariat, Silvassa",pin:"396230",zone:"West",priority:"Day 50–65"},
  {state:"Delhi",utility:"Delhi Transco Limited (DTL)",hq:"New Delhi",address:"Shakti Sadan, Kotla Marg, Near ITO, New Delhi",pin:"110002",zone:"North",priority:"Day 40–55"},
  {state:"Goa",utility:"Electricity Department, Government of Goa",hq:"Panaji",address:"Vidyut Bhavan, 3rd Floor, Panaji, Goa",pin:"403001",zone:"West",priority:"Day 40–55"},
  {state:"Gujarat",utility:"Gujarat Energy Transmission Corporation Ltd (GETCO)",hq:"Vadodara",address:"Sardar Patel Vidyut Bhavan, Race Course, Vadodara",pin:"390007",zone:"West",priority:"Day 25–35 ★ Early Adopter"},
  {state:"Haryana",utility:"Haryana Vidyut Prasaran Nigam Limited (HVPNL)",hq:"Panchkula",address:"Shakti Bhawan, Plot No. C-4, Sector-6, Panchkula",pin:"134109",zone:"North",priority:"Day 35–45"},
  {state:"Himachal Pradesh",utility:"HP Power Transmission Corporation Ltd (HPPTCL)",hq:"Shimla",address:"Himfed Bhawan, Panjari, Below Old MLA Quarters, Shimla",pin:"171005",zone:"North",priority:"Day 40–55"},
  {state:"Jammu & Kashmir",utility:"J&K Power Transmission Corporation Ltd (JKPTCL)",hq:"Jammu",address:"Gladni Grid Substation Building, Narwal, Jammu",pin:"180006",zone:"North",priority:"Day 45–60"},
  {state:"Jharkhand",utility:"Jharkhand Urja Sancharan Nigam Limited (JUSNL)",hq:"Ranchi",address:"Engineering Building, H.E.C. Dhurwa, Ranchi",pin:"834004",zone:"East",priority:"Day 45–60"},
  {state:"Karnataka",utility:"Karnataka Power Transmission Corporation Ltd (KPTCL)",hq:"Bengaluru",address:"Kaveri Bhavan, 'A' Block, Kempegowda Road, Bengaluru",pin:"560009",zone:"South",priority:"Day 25–35"},
  {state:"Kerala",utility:"Kerala State Electricity Board Limited (KSEBL)",hq:"Thiruvananthapuram",address:"Vydyuthi Bhavanam, Pattom, Thiruvananthapuram",pin:"695004",zone:"South",priority:"Day 35–45"},
  {state:"Ladakh",utility:"Ladakh Power Development Department",hq:"Leh",address:"Civil Secretariat, Leh, UT of Ladakh",pin:"194101",zone:"North",priority:"Day 55–70"},
  {state:"Lakshadweep",utility:"Lakshadweep Electricity Department",hq:"Kavaratti",address:"Divisional Office, Kavaratti Island, UT of Lakshadweep",pin:"682555",zone:"South",priority:"Day 60–75"},
  {state:"Madhya Pradesh",utility:"MP Power Transmission Company Limited (MPPTCL)",hq:"Jabalpur",address:"Shakti Bhawan, P.O. Vidyut Nagar, Rampur, Jabalpur",pin:"482008",zone:"West",priority:"Day 30–40"},
  {state:"Maharashtra",utility:"Maharashtra State Electricity Transmission Co Ltd (MAHATRANSCO)",hq:"Mumbai",address:"Prakashganga, Plot No. C-19, E-Block, Bandra-Kurla Complex, Mumbai",pin:"400051",zone:"West",priority:"Day 20–25 ★"},
  {state:"Manipur",utility:"Manipur State Power Company Limited (MSPCL)",hq:"Imphal",address:"Electricity Complex, Keishampat Junction, Imphal",pin:"795001",zone:"NE",priority:"Day 55–70"},
  {state:"Meghalaya",utility:"Meghalaya Power Transmission Corporation Ltd",hq:"Shillong",address:"Lumjingshai, Short Round Road, Shillong",pin:"793001",zone:"NE",priority:"Day 50–65"},
  {state:"Mizoram",utility:"Power & Electricity Department, Mizoram",hq:"Aizawl",address:"Kawlphetha Building, New Secretariat Complex, Khatla, Aizawl",pin:"796001",zone:"NE",priority:"Day 55–70"},
  {state:"Nagaland",utility:"Department of Power, Nagaland",hq:"Kohima",address:"Electricity House, A.G. Colony, Kohima",pin:"797001",zone:"NE",priority:"Day 55–70"},
  {state:"Odisha",utility:"Odisha Power Transmission Corporation Ltd (OPTCL)",hq:"Bhubaneswar",address:"OPTCL Tech Tower, Janpath, Sahid Nagar, Bhubaneswar",pin:"751022",zone:"East",priority:"Day 40–55"},
  {state:"Puducherry",utility:"Electricity Department, Government of Puducherry",hq:"Puducherry",address:"137, NSC Bose Salai, Puducherry",pin:"605001",zone:"South",priority:"Day 50–65"},
  {state:"Punjab",utility:"Punjab State Transmission Corporation Ltd (PSTCL)",hq:"Patiala",address:"PSEB Head Office, The Mall, Patiala",pin:"147001",zone:"North",priority:"Day 35–50"},
  {state:"Rajasthan",utility:"Rajasthan Rajya Vidyut Prasaran Nigam Ltd (RVPN)",hq:"Jaipur",address:"Vidyut Bhawan, Janpath, Jyoti Nagar, Jaipur",pin:"302005",zone:"North",priority:"Day 30–40"},
  {state:"Sikkim",utility:"Power Department, Government of Sikkim",hq:"Gangtok",address:"Kazi Road, Gangtok, Sikkim",pin:"737101",zone:"East",priority:"Day 55–70"},
  {state:"Tamil Nadu",utility:"Tamil Nadu Transmission Corporation Ltd (TANTRANSCO)",hq:"Chennai",address:"NPKRR Maaligai, 144 Anna Salai, Chennai",pin:"600002",zone:"South",priority:"Day 25–35"},
  {state:"Telangana",utility:"Transmission Corporation of Telangana Ltd (TSTRANSCO)",hq:"Hyderabad",address:"Vidyut Soudha, Khairatabad, Hyderabad",pin:"500082",zone:"South",priority:"Day 30–40"},
  {state:"Tripura",utility:"Tripura State Electricity Corporation Ltd (TSECL)",hq:"Agartala",address:"Bidyut Bhavan, Banamalipur, Agartala",pin:"799001",zone:"NE",priority:"Day 50–65"},
  {state:"Uttar Pradesh",utility:"UP Power Transmission Corporation Ltd (UPPTCL)",hq:"Lucknow",address:"Shakti Bhawan, 14-Ashok Marg, Lucknow",pin:"226001",zone:"North",priority:"Day 25–40"},
  {state:"Uttarakhand",utility:"Power Transmission Corporation of Uttarakhand Ltd (PTCUL)",hq:"Dehradun",address:"Vidyut Bhawan, Saharanpur Road, Majra, Dehradun",pin:"248002",zone:"North",priority:"Day 40–55"},
  {state:"West Bengal",utility:"West Bengal State Electricity Transmission Co Ltd (WBSETCL)",hq:"Kolkata",address:"Vidyut Bhavan, Block DJ, Sector II, Bidhannagar, Kolkata",pin:"700091",zone:"East",priority:"Day 35–50"},
];

// COMPLETE DISCOMS — Government + Private, all from database + original
const DISCOMS=[
  // A&N
  {name:"Electricity Department, UT of A&N Islands",state:"Andaman & Nicobar",zone:"South",sector:"Govt",address:"Vidyut Bhawan, Marine Hill, Port Blair",pin:"744101"},
  // AP
  {name:"Eastern Power Distribution Co. (APEPDCL)",state:"Andhra Pradesh",zone:"South",sector:"Govt",address:"Corporate Office, P&T Colony, Seethammadhara, Visakhapatnam",pin:"530013"},
  {name:"Southern Power Distribution Co. (APSPDCL)",state:"Andhra Pradesh",zone:"South",sector:"Govt",address:"#19-13-65/A, Srinivasapuram, Tiruchanoor Road, Tirupati",pin:"517503"},
  {name:"Central Power Distribution Co. (APCPDCL)",state:"Andhra Pradesh",zone:"South",sector:"Govt",address:"Corporate Office Beside Govt. Polytechnic, ITI Road, Vijayawada",pin:"520008"},
  // Arunachal
  {name:"Department of Power, Arunachal Pradesh",state:"Arunachal Pradesh",zone:"NE",sector:"Govt",address:"Vidyut Bhawan, NH-52A, Itanagar",pin:"791113"},
  // Assam
  {name:"Assam Power Distribution Company Ltd (APDCL)",state:"Assam",zone:"NE",sector:"Govt",address:"4th Floor, Bijulee Bhawan, Paltan Bazar, Guwahati",pin:"781001"},
  // Bihar
  {name:"North Bihar Power Distribution Co. (NBPDCL)",state:"Bihar",zone:"East",sector:"Govt",address:"3rd Floor, Vidyut Bhawan, Bailey Road, Patna",pin:"800001"},
  {name:"South Bihar Power Distribution Co. (SBPDCL)",state:"Bihar",zone:"East",sector:"Govt",address:"2nd Floor, Vidyut Bhawan, Bailey Road, Patna",pin:"800001"},
  // Chandigarh
  {name:"Chandigarh Power Distribution Ltd (CESC)",state:"Chandigarh",zone:"North",sector:"Private",address:"4th Floor, SCO 33-35, Sector 34A, Chandigarh",pin:"160022"},
  // CG
  {name:"Chhattisgarh State Power Distribution (CSPDCL)",state:"Chhattisgarh",zone:"West",sector:"Govt",address:"Vidyut Seva Bhavan, Daganiya, Raipur",pin:"492013"},
  {name:"Jindal Steel & Power Ltd (JSPL)",state:"Chhattisgarh",zone:"West",sector:"Private",address:"O.P. Jindal Industrial Park, Punjipathra, Raigarh",pin:"496109"},
  // D&NH
  {name:"DNH & DD Power Distribution Corporation Ltd",state:"D&NH and D&D",zone:"West",sector:"Private",address:"Vidhyut Bhavan, 66 KV Road, Near Secretariat, Silvassa",pin:"396230"},
  // Delhi
  {name:"Tata Power Delhi Distribution Ltd (TPDDL)",state:"Delhi",zone:"North",sector:"Private",address:"NDPL House, Hudson Lines, Kingsway Camp, Delhi",pin:"110009"},
  {name:"BSES Rajdhani Power Limited (BRPL)",state:"Delhi",zone:"North",sector:"Private",address:"BSES Bhawan, Nehru Place, New Delhi",pin:"110019"},
  {name:"BSES Yamuna Power Limited (BYPL)",state:"Delhi",zone:"North",sector:"Private",address:"Shakti Kiran Building, Karkardooma, Delhi",pin:"110032"},
  {name:"New Delhi Municipal Council (NDMC)",state:"Delhi",zone:"North",sector:"Govt",address:"Palika Kendra, Sansad Marg, New Delhi",pin:"110001"},
  // Goa
  {name:"Electricity Department, Government of Goa",state:"Goa",zone:"West",sector:"Govt",address:"Vidyut Bhavan, 3rd Floor, Panaji",pin:"403001"},
  // Gujarat
  {name:"Uttar Gujarat Vij Company Ltd (UGVCL)",state:"Gujarat",zone:"West",sector:"Govt",address:"Corporate Office, Visnagar Road, Mehsana",pin:"384001"},
  {name:"Dakshin Gujarat Vij Company Ltd (DGVCL)",state:"Gujarat",zone:"West",sector:"Govt",address:"Urja Sadan, Nana Varachha Road, Kapodra, Surat",pin:"395006"},
  {name:"Madhya Gujarat Vij Company Ltd (MGVCL)",state:"Gujarat",zone:"West",sector:"Govt",address:"Sardar Patel Vidyut Bhavan, Race Course, Vadodara",pin:"390007"},
  {name:"Paschim Gujarat Vij Company Ltd (PGVCL)",state:"Gujarat",zone:"West",sector:"Govt",address:"Laxminagar, Nana Mava Main Road, Rajkot",pin:"360004"},
  {name:"Torrent Power Ltd (Ahmedabad/Surat)",state:"Gujarat",zone:"West",sector:"Private",address:"'Samanvay', 600, Tapovan, Ambavadi, Ahmedabad",pin:"380015"},
  // Haryana
  {name:"Uttar Haryana Bijli Vitran Nigam (UHBVNL)",state:"Haryana",zone:"North",sector:"Govt",address:"IP No. 3 & 4, Vidyut Sadan, Sector-14, Panchkula",pin:"134113"},
  {name:"Dakshin Haryana Bijli Vitran Nigam (DHBVNL)",state:"Haryana",zone:"North",sector:"Govt",address:"Vidyut Sadan, Vidyut Nagar, Hisar",pin:"125005"},
  // HP
  {name:"HP State Electricity Board Limited (HPSEBL)",state:"Himachal Pradesh",zone:"North",sector:"Govt",address:"Vidyut Bhawan, Kumar House, Shimla",pin:"171004"},
  // J&K
  {name:"Jammu Power Distribution Company (JPDCL)",state:"Jammu & Kashmir",zone:"North",sector:"Govt",address:"Gladni Narwal, Jammu",pin:"180006"},
  {name:"Kashmir Power Distribution Company (KPDCL)",state:"Jammu & Kashmir",zone:"North",sector:"Govt",address:"PDD Complex, Exhibition Grounds, Srinagar",pin:"190001"},
  // Jharkhand
  {name:"Jharkhand Bijli Vitran Nigam Ltd (JBVNL)",state:"Jharkhand",zone:"East",sector:"Govt",address:"Engineering Building, H.E.C., Dhurwa, Ranchi",pin:"834004"},
  {name:"Tata Steel Utilities (TSUISL / JUSCO)",state:"Jharkhand",zone:"East",sector:"Private",address:"Sakchi Boulevard Road, Northern Town, Jamshedpur",pin:"831001"},
  // Karnataka
  {name:"Bangalore Electricity Supply Co. (BESCOM)",state:"Karnataka",zone:"South",sector:"Govt",address:"BESCOM Bhavana, K.R. Circle, Bengaluru",pin:"560001"},
  {name:"Hubli Electricity Supply Co. (HESCOM)",state:"Karnataka",zone:"South",sector:"Govt",address:"Corporate Office, Navanagar, P.B. Road, Hubballi",pin:"580025"},
  {name:"Mangalore Electricity Supply Co. (MESCOM)",state:"Karnataka",zone:"South",sector:"Govt",address:"MESCOM Bhavan, Kavoor Cross Road, Bejai, Mangaluru",pin:"575004"},
  {name:"Gulbarga Electricity Supply Co. (GESCOM)",state:"Karnataka",zone:"South",sector:"Govt",address:"Corporate Office, Station Road, Kalaburagi",pin:"585102"},
  {name:"Chamundeshwari Electricity Supply Corp (CESC Mysuru)",state:"Karnataka",zone:"South",sector:"Govt",address:"No. 29, Vijayanagara 2nd Stage, Hinkal, Mysuru",pin:"570017"},
  // Kerala
  {name:"Kerala State Electricity Board Ltd (KSEBL)",state:"Kerala",zone:"South",sector:"Govt",address:"Vydyuthi Bhavanam, Pattom, Thiruvananthapuram",pin:"695004"},
  // Ladakh
  {name:"Ladakh Power Development Department",state:"Ladakh",zone:"North",sector:"Govt",address:"Civil Secretariat, Leh, UT of Ladakh",pin:"194101"},
  // Lakshadweep
  {name:"Lakshadweep Electricity Department",state:"Lakshadweep",zone:"South",sector:"Govt",address:"Divisional Office, Kavaratti Island",pin:"682555"},
  // MP
  {name:"Poorv Kshetra Vidyut Vitaran (Jabalpur)",state:"Madhya Pradesh",zone:"West",sector:"Govt",address:"Shakti Bhawan, Vidyut Nagar, Rampur, Jabalpur",pin:"482008"},
  {name:"Madhya Kshetra Vidyut Vitaran (Bhopal)",state:"Madhya Pradesh",zone:"West",sector:"Govt",address:"Nishtha Parisar, Bijli Nagar, Govindpura, Bhopal",pin:"462023"},
  {name:"Paschim Kshetra Vidyut Vitaran (Indore)",state:"Madhya Pradesh",zone:"West",sector:"Govt",address:"GPH Compound, Polo Ground, Indore",pin:"452003"},
  // Maharashtra
  {name:"Maharashtra State Distribution (MSEDCL)",state:"Maharashtra",zone:"West",sector:"Govt",address:"Prakashgad, Plot No. G-9, Bandra East, Mumbai",pin:"400051"},
  {name:"Adani Electricity Mumbai Ltd (AEML)",state:"Maharashtra",zone:"West",sector:"Private",address:"Devidas Lane, Off S.V. Road, Borivali West, Mumbai",pin:"400103"},
  {name:"Tata Power Company Ltd (Mumbai)",state:"Maharashtra",zone:"West",sector:"Private",address:"Bombay House, 24 Homi Mody Street, Fort, Mumbai",pin:"400001"},
  {name:"BEST Undertaking",state:"Maharashtra",zone:"West",sector:"Govt",address:"BEST Bhavan, Colaba, Mumbai",pin:"400001"},
  // Manipur
  {name:"Manipur State Distribution Co. (MSPDCL)",state:"Manipur",zone:"NE",sector:"Govt",address:"Electricity Complex, Keishampat Junction, Imphal",pin:"795001"},
  // Meghalaya
  {name:"Meghalaya Power Distribution Co. (MePDCL)",state:"Meghalaya",zone:"NE",sector:"Govt",address:"Lumjingshai, Short Round Road, Shillong",pin:"793001"},
  // Mizoram
  {name:"Power & Electricity Dept, Government of Mizoram",state:"Mizoram",zone:"NE",sector:"Govt",address:"Kawlphetha Building, New Secretariat, Khatla, Aizawl",pin:"796001"},
  // Nagaland
  {name:"Department of Power, Nagaland",state:"Nagaland",zone:"NE",sector:"Govt",address:"Electricity House, A.G. Colony, Kohima",pin:"797001"},
  // Odisha — 4 TP companies
  {name:"TP Central Odisha Distribution (TPCODL)",state:"Odisha",zone:"East",sector:"Private",address:"2nd Floor, IDCO Tower, Janpath, Bhubaneswar",pin:"751022"},
  {name:"TP Northern Odisha Distribution (TPNODL)",state:"Odisha",zone:"East",sector:"Private",address:"Plot No. 1379/3525, Sovarampur, Balasore",pin:"756001"},
  {name:"TP Western Odisha Distribution (TPWODL)",state:"Odisha",zone:"East",sector:"Private",address:"Burla, Near Police Station, Sambalpur",pin:"768017"},
  {name:"TP Southern Odisha Distribution (TPSODL)",state:"Odisha",zone:"East",sector:"Private",address:"Courtpeta, Berhampur, Ganjam",pin:"760004"},
  // Puducherry
  {name:"Electricity Department, Govt. of Puducherry",state:"Puducherry",zone:"South",sector:"Govt",address:"No. 137, NSC Bose Salai, Puducherry",pin:"605001"},
  // Punjab
  {name:"Punjab State Power Corporation (PSPCL)",state:"Punjab",zone:"North",sector:"Govt",address:"PSEB Head Office, The Mall, Patiala",pin:"147001"},
  // Rajasthan
  {name:"Jaipur Vidyut Vitran Nigam Ltd (JVVNL)",state:"Rajasthan",zone:"North",sector:"Govt",address:"Vidyut Bhawan, Janpath, Jyoti Nagar, Jaipur",pin:"302005"},
  {name:"Ajmer Vidyut Vitran Nigam Ltd (AVVNL)",state:"Rajasthan",zone:"North",sector:"Govt",address:"Vidyut Bhawan, Makarwali Road, Ajmer",pin:"305004"},
  {name:"Jodhpur Vidyut Vitran Nigam Ltd (JdVVNL)",state:"Rajasthan",zone:"North",sector:"Govt",address:"New Power House, Jodhpur",pin:"342003"},
  // Sikkim
  {name:"Power Department, Government of Sikkim",state:"Sikkim",zone:"East",sector:"Govt",address:"Kazi Road, Vishal Gaon, Gangtok",pin:"737101"},
  // TN
  {name:"Tamil Nadu Distribution Corp (TANGEDCO)",state:"Tamil Nadu",zone:"South",sector:"Govt",address:"NPKRR Maaligai, 144 Anna Salai, Chennai",pin:"600002"},
  // Telangana
  {name:"Telangana Southern Distribution (TSSPDCL)",state:"Telangana",zone:"South",sector:"Govt",address:"#6-1-50, Corporate Office, Mint Compound, Hyderabad",pin:"500063"},
  {name:"Telangana Northern Distribution (TSNPDCL)",state:"Telangana",zone:"South",sector:"Govt",address:"#2-5-31/2, Vidyut Bhavan, Hanamkonda, Warangal",pin:"506001"},
  // Tripura
  {name:"Tripura State Electricity Corp (TSECL)",state:"Tripura",zone:"NE",sector:"Govt",address:"Bidyut Bhavan, Banamalipur, Agartala",pin:"799001"},
  // UP
  {name:"Paschimanchal Vidyut Vitran (PVVNL)",state:"Uttar Pradesh",zone:"North",sector:"Govt",address:"Urja Bhawan, Victoria Park, Meerut",pin:"250001"},
  {name:"Madhyanchal Vidyut Vitran (MVVNL)",state:"Uttar Pradesh",zone:"North",sector:"Govt",address:"4-A, Gokhale Marg, Lucknow",pin:"226001"},
  {name:"Purvanchal Vidyut Vitran (PuVVNL)",state:"Uttar Pradesh",zone:"North",sector:"Govt",address:"DLW Bhikharipur, Varanasi",pin:"221004"},
  {name:"Dakshinanchal Vidyut Vitran (DVVNL)",state:"Uttar Pradesh",zone:"North",sector:"Govt",address:"Urja Bhawan, NH-2, Sikandra, Agra",pin:"282007"},
  {name:"Noida Power Company Limited (NPCL)",state:"Uttar Pradesh",zone:"North",sector:"Private",address:"Knowledge Park-IV, Greater Noida City",pin:"201310"},
  // Uttarakhand
  {name:"Uttarakhand Power Corporation Ltd (UPCL)",state:"Uttarakhand",zone:"North",sector:"Govt",address:"Victoria Cross Urja Bhawan, Kanwali Road, Dehradun",pin:"248001"},
  // WB
  {name:"WB State Distribution Company (WBSEDCL)",state:"West Bengal",zone:"East",sector:"Govt",address:"Vidyut Bhavan, Block-DJ, Sector-II, Bidhannagar",pin:"700091"},
  {name:"CESC Limited",state:"West Bengal",zone:"East",sector:"Private",address:"CESC House, Chowringhee Square, Kolkata",pin:"700001"},
  {name:"India Power Corporation Ltd (IPCL)",state:"West Bengal",zone:"East",sector:"Private",address:"Sanctoria, PO-Dishergarh, Dist-Burdwan",pin:"713333"},
];

// GENERATION COMPANIES — full from database
const GENERATION=[
  {state:"Andaman & Nicobar",company:"Electricity Department, UT of A&N Islands",address:"Vidyut Bhawan, Marine Hill, Port Blair",pin:"744101",zone:"South"},
  {state:"Andhra Pradesh",company:"AP Power Generation Corp. Ltd (APGENCO)",address:"Vidyut Soudha, Gunadala, Vijayawada",pin:"520004",zone:"South"},
  {state:"Arunachal Pradesh",company:"Department of Power, Arunachal Pradesh",address:"Vidyut Bhawan, NH-52A, Itanagar",pin:"791113",zone:"NE"},
  {state:"Assam",company:"Assam Power Generation Corp. Ltd (APGCL)",address:"3rd Floor, Bijulee Bhawan, Paltan Bazar, Guwahati",pin:"781001",zone:"NE"},
  {state:"Bihar",company:"Bihar State Power Generation Co. Ltd (BSPGCL)",address:"Vidyut Bhawan, Bailey Road, Patna",pin:"800001",zone:"East"},
  {state:"Chandigarh",company:"Chandigarh Electricity Department",address:"Deluxe Building, 5th Floor, Sector 9-D, Chandigarh",pin:"160009",zone:"North"},
  {state:"Chhattisgarh",company:"Chhattisgarh State Power Generation Co. (CSPGCL)",address:"Vidyut Seva Bhavan, Dangania, Raipur",pin:"492013",zone:"West"},
  {state:"D&NH and D&D",company:"DNH and DD Power Corporation Limited",address:"Vidhyut Bhavan, 66 KV Road, Near Secretariat, Silvassa",pin:"396230",zone:"West"},
  {state:"Delhi",company:"Indraprastha Power Generation Co. Ltd (IPGCL)",address:"Himadri, Rajghat Power House Complex, New Delhi",pin:"110002",zone:"North"},
  {state:"Delhi",company:"Pragati Power Corporation Ltd (PPCL)",address:"Himadri, Rajghat Power House Complex, New Delhi",pin:"110002",zone:"North"},
  {state:"Goa",company:"Electricity Department, Government of Goa",address:"Vidyut Bhavan, 3rd Floor, Panaji, Goa",pin:"403001",zone:"West"},
  {state:"Gujarat",company:"Gujarat State Electricity Corp. Ltd (GSECL)",address:"Sardar Patel Vidyut Bhavan, Race Course, Vadodara",pin:"390007",zone:"West"},
  {state:"Haryana",company:"Haryana Power Generation Corp. Ltd (HPGCL)",address:"Urja Bhawan, C-7, Sector-6, Panchkula",pin:"134109",zone:"North"},
  {state:"Himachal Pradesh",company:"HP Power Corporation Ltd (HPPCL)",address:"Himfed Bhawan, Panjari, Shimla",pin:"171005",zone:"North"},
  {state:"Jammu & Kashmir",company:"J&K State Power Development Corp. (JKSPDCL) — Srinagar",address:"Exhibition Ground, Srinagar",pin:"190009",zone:"North"},
  {state:"Jammu & Kashmir",company:"J&K State Power Development Corp. (JKSPDCL) — Jammu",address:"Ashok Nagar, Satwari, Jammu",pin:"180004",zone:"North"},
  {state:"Jharkhand",company:"Jharkhand Urja Vikas Nigam Limited (JUVNL)",address:"Engineering Building, H.E.C. Dhurwa, Ranchi",pin:"834004",zone:"East"},
  {state:"Karnataka",company:"Karnataka Power Corporation Ltd (KPCL)",address:"Shakti Bhavan, 82, Race Course Road, Bengaluru",pin:"560001",zone:"South"},
  {state:"Kerala",company:"Kerala State Electricity Board Limited (KSEBL)",address:"Vydyuthi Bhavanam, Pattom, Thiruvananthapuram",pin:"695004",zone:"South"},
  {state:"Ladakh",company:"Ladakh Power Development Department",address:"Council Secretariat, Kurbathang, Kargil",pin:"194103",zone:"North"},
  {state:"Lakshadweep",company:"Lakshadweep Electricity Department",address:"Divisional Office, Kavaratti Island",pin:"682555",zone:"South"},
  {state:"Madhya Pradesh",company:"MP Power Generation Company Ltd (MPPGCL)",address:"Shakti Bhawan, Rampur, Jabalpur",pin:"482008",zone:"West"},
  {state:"Maharashtra",company:"Maharashtra State Power Generation Co. (MAHAGENCO)",address:"Prakashgad, Plot No. G-9, Bandra (East), Mumbai",pin:"400051",zone:"West"},
  {state:"Manipur",company:"Manipur State Power Company Limited (MSPCL)",address:"Electricity Complex, Keishampat Junction, Imphal",pin:"795001",zone:"NE"},
  {state:"Meghalaya",company:"Meghalaya Power Generation Corp. Ltd (MePGCL)",address:"Lumjingshai, Short Round Road, Shillong",pin:"793001",zone:"NE"},
  {state:"Mizoram",company:"Power & Electricity Department, Mizoram",address:"Kawlphetha Building, New Secretariat, Khatla, Aizawl",pin:"796001",zone:"NE"},
  {state:"Nagaland",company:"Department of Power, Nagaland",address:"Electricity House, A.G. Colony, Kohima",pin:"797001",zone:"NE"},
  {state:"Odisha",company:"Odisha Hydro Power Corporation (OHPC)",address:"Janpath, Bhoinagar, Bhubaneswar",pin:"751022",zone:"East"},
  {state:"Odisha",company:"Odisha Power Generation Corporation (OPGC)",address:"7th Floor, Fortune Towers, Chandrasekharpur, Bhubaneswar",pin:"751023",zone:"East"},
  {state:"Puducherry",company:"Electricity Department, Government of Puducherry",address:"137, NSC Bose Salai, Puducherry",pin:"605001",zone:"South"},
  {state:"Punjab",company:"Punjab State Power Corporation Limited (PSPCL)",address:"PSEB Head Office, The Mall, Patiala",pin:"147001",zone:"North"},
  {state:"Rajasthan",company:"Rajasthan Rajya Vidyut Utpadan Nigam (RVUNL)",address:"Vidyut Bhawan, Janpath, Jyoti Nagar, Jaipur",pin:"302005",zone:"North"},
  {state:"Sikkim",company:"Sikkim Power Development Corporation Ltd (SPDCL)",address:"National Highway-10, Near UD & HD Deptt., Gangtok",pin:"737101",zone:"East"},
  {state:"Tamil Nadu",company:"TN Generation and Distribution Corp. (TANGEDCO)",address:"NPKRR Maaligai, 144 Anna Salai, Chennai",pin:"600002",zone:"South"},
  {state:"Telangana",company:"Telangana Power Generation Corporation (TSGENCO)",address:"Vidyut Soudha, Khairatabad, Hyderabad",pin:"500082",zone:"South"},
  {state:"Tripura",company:"Tripura State Electricity Corporation Ltd (TSECL)",address:"Bidyut Bhavan, Banamalipur, Agartala",pin:"799003",zone:"NE"},
  {state:"Uttar Pradesh",company:"UP Rajya Vidyut Utpadan Nigam Ltd (UPRVUNL)",address:"10th Floor, Shakti Bhawan, 14-Ashok Marg, Lucknow",pin:"226001",zone:"North"},
  {state:"Uttar Pradesh",company:"UP Jal Vidyut Nigam Limited (UPJVNL)",address:"12th Floor, Shakti Bhawan Ext., 14-Ashok Marg, Lucknow",pin:"226001",zone:"North"},
  {state:"Uttarakhand",company:"UJVN Limited (Uttarakhand Jal Vidyut Nigam)",address:"UJJWAL, Maharani Bagh, G.M.S. Road, Dehradun",pin:"248006",zone:"North"},
  {state:"West Bengal",company:"West Bengal Power Development Corp. (WBPDCL)",address:"Bidyut Unnayan Bhaban, Plot No. 3/C, LA Block, Bidhannagar, Kolkata",pin:"700106",zone:"East"},
  {state:"West Bengal",company:"The Durgapur Projects Limited (DPL)",address:"Administrative Building, Dr. B. C. Roy Avenue, Durgapur",pin:"713201",zone:"East"},
];

// NODAL RENEWABLE POWER AGENCIES — full from database
const NODAL_AGENCIES=[
  {state:"Andaman & Nicobar",agency:"NRSE Division, Electricity Department",address:"Prothrapur, Port Blair",pin:"744105",zone:"South"},
  {state:"Andhra Pradesh",agency:"New & Renewable Energy Development Corp. of AP (NREDCAP)",address:"#12-464/5/1, River Oaks Apartment, CSR Kalyana Mandapam Road, Tadepalli, Guntur District",pin:"522501",zone:"South"},
  {state:"Arunachal Pradesh",agency:"Arunachal Pradesh Energy Development Agency (APEDA)",address:"Urja Bhawan, Tadar Tang Marg, Post Box No. 124, Itanagar",pin:"791111",zone:"NE"},
  {state:"Assam",agency:"Assam Energy Development Agency (AEDA)",address:"Bigyan Bhawan, Near IDBI Building, G S Road, Guwahati",pin:"781005",zone:"NE"},
  {state:"Bihar",agency:"Bihar Renewable Energy Development Agency (BREDA)",address:"Vidyut Bhawan, Building No-2, 2nd Floor, Bailey Road, Patna",pin:"800001",zone:"East"},
  {state:"Chandigarh",agency:"Chandigarh RE and Science & Tech Promotion Society (CREST)",address:"4th Floor, Paryavaran Bhawan, Sector-19B, Chandigarh",pin:"160019",zone:"North"},
  {state:"Chhattisgarh",agency:"Chhattisgarh State RE Development Agency (CREDA)",address:"VIP Road (Airport Road), Near Energy Education Park, Raipur",pin:"492015",zone:"West"},
  {state:"D&NH and D&D",agency:"DNH and DD Power Corporation Limited",address:"Vidhyut Bhavan, 66 KV Road, Near Secretariat, Amli, Silvassa",pin:"396230",zone:"West"},
  {state:"Delhi",agency:"Energy Efficiency & RE Management Centre (EE&REM)",address:"2nd Floor, SLDC Building, Minto Road, New Delhi",pin:"110002",zone:"North"},
  {state:"Goa",agency:"Goa Energy Development Agency (GEDA)",address:"5th Floor, GIDC, Patto, Panaji",pin:"403001",zone:"West"},
  {state:"Gujarat",agency:"Gujarat Energy Development Agency (GEDA)",address:"4th Floor, Block No. 11 & 12, Udyog Bhavan, Sector-11, Gandhinagar",pin:"382017",zone:"West"},
  {state:"Haryana",agency:"Haryana Renewable Energy Development Agency (HAREDA)",address:"Akshay Urja Bhawan, Institutional Plot No.1, Sector 17, Panchkula",pin:"134109",zone:"North"},
  {state:"Himachal Pradesh",agency:"HIMURJA",address:"Urja Bhawan, SDA Complex, Kasumpti, Shimla",pin:"171009",zone:"North"},
  {state:"Jammu & Kashmir",agency:"J&K Energy Development Agency (JAKEDA)",address:"Tawanai Ghar, S.D.A Colony, Bemina, Srinagar",pin:"190018",zone:"North"},
  {state:"Jharkhand",agency:"Jharkhand Renewable Energy Development Agency (JREDA)",address:"Plot No. 328/B, Road No. 4, Ashok Nagar, Ranchi",pin:"834002",zone:"East"},
  {state:"Karnataka",agency:"Karnataka Renewable Energy Development Ltd (KREDL)",address:"#6/13/1, 10th Block, 2nd Stage, Nagarabhavi, Bangalore",pin:"560072",zone:"South"},
  {state:"Kerala",agency:"Agency for New & RE and Rural Tech (ANERT)",address:"PMG - Law College Road, Vikas Bhavan P.O., Thiruvananthapuram",pin:"695033",zone:"South"},
  {state:"Ladakh",agency:"Ladakh Renewable Energy Development Agency (LREDA)",address:"1st Floor, 2nd Block, Council Secretariat Complex, Leh",pin:"194101",zone:"North"},
  {state:"Lakshadweep",agency:"Electricity Department, Lakshadweep Administration",address:"Divisional Office, Kavaratti Island",pin:"682555",zone:"South"},
  {state:"Madhya Pradesh",agency:"MP Urja Vikas Nigam Limited (MPUVNL)",address:"Urja Bhawan, Main Road No. 2, Near 5 Non Stop, Bhopal",pin:"462016",zone:"West"},
  {state:"Maharashtra",agency:"Maharashtra Energy Development Agency (MEDA)",address:"Aundh Road, Opposite to Spicer College, Aundh, Pune",pin:"411007",zone:"West"},
  {state:"Manipur",agency:"Manipur Renewable Energy Development Agency (MANIREDA)",address:"2nd Floor, South Block, Secured Office Complex, Imphal-Dimapur Road, Imphal",pin:"795001",zone:"NE"},
  {state:"Meghalaya",agency:"Meghalaya New & Renewable Energy Dev. Agency (MNREDA)",address:"Lumjingshai, Short Round Road, Shillong",pin:"793001",zone:"NE"},
  {state:"Mizoram",agency:"Zoram Energy Development Agency (ZEDA)",address:"ZUANHHUA, Near Assembly Annexe Building, Treasury Square, Aizawl",pin:"796001",zone:"NE"},
  {state:"Nagaland",agency:"Directorate of New & Renewable Energy",address:"Phezoucha Colony, Below Nagaland Civil Secretariat Complex, Kohima",pin:"797001",zone:"NE"},
  {state:"Odisha",agency:"Odisha Renewable Energy Development Agency (OREDA)",address:"S-59, Sector A, Mancheswar Industrial Estate, Bhubaneswar",pin:"751010",zone:"East"},
  {state:"Puducherry",agency:"Renewable Energy Agency Puducherry (REAP)",address:"Bungalow No. 2, AFT Premises, Cuddalore Main Road, Mudaliarpet, Puducherry",pin:"605004",zone:"South"},
  {state:"Punjab",agency:"Punjab Energy Development Agency (PEDA)",address:"Solar Passive Complex, Plot No. 1 & 2, Sector 33-D, Chandigarh",pin:"160020",zone:"North"},
  {state:"Rajasthan",agency:"Rajasthan Renewable Energy Corporation Ltd (RRECL)",address:"E-166, Yudhister Marg, 'C' Scheme, Jaipur",pin:"302001",zone:"North"},
  {state:"Sikkim",agency:"Sikkim Renewable Energy Development Agency (SREDA)",address:"D.P.H. Road (Near Janta Bhawan), Gangtok",pin:"737101",zone:"East"},
  {state:"Tamil Nadu",agency:"Tamil Nadu Energy Development Agency (TEDA)",address:"EVK Sampath Maaligai, 5th Floor, No. 68, College Road, Chennai",pin:"600006",zone:"South"},
  {state:"Telangana",agency:"Telangana State RE Development Corporation (TSREDCO)",address:"D. No. 6-2-910, Visvesvaraya Bhavan, Khairatabad, Hyderabad",pin:"500004",zone:"South"},
  {state:"Tripura",agency:"Tripura Renewable Energy Development Agency (TREDA)",address:"Vigyan Bhawan, 2nd Floor, Pandit Nehru Complex, Gorkha Bagh, Agartala",pin:"799006",zone:"NE"},
  {state:"Uttar Pradesh",agency:"UP New & RE Development Agency (UPNEDA)",address:"Vibhuti Khand, Gomti Nagar, Lucknow",pin:"226010",zone:"North"},
  {state:"Uttarakhand",agency:"Uttarakhand RE Development Agency (UREDA)",address:"Energy Park Campus, Industrial Area, Patel Nagar, Dehradun",pin:"248001",zone:"North"},
  {state:"West Bengal",agency:"West Bengal Renewable Energy Development Agency (WBREDA)",address:"Bikalpa Shakti Bhawan, Plot- J-1/10, EP & GP Block, Salt Lake, Sector- V, Kolkata",pin:"700091",zone:"East"},
];

// EPC COMPANIES — Tier 1/2/3 from database
const EPC_T1=[
  {name:"Larsen & Toubro (L&T)",location:"Mumbai, Maharashtra",segments:"EPC, Power, Infrastructure, Hi-Tech Manufacturing, Defence",website:"larsentoubro.com"},
  {name:"BHEL (Bharat Heavy Electricals)",location:"New Delhi",segments:"Power Equipment, Transmission, EPC, Manufacturing",website:"bhel.in"},
  {name:"Tata Projects Ltd",location:"Mumbai, Maharashtra",segments:"EPC Projects, Power, Infrastructure, Industrial",website:"tataprojects.com"},
  {name:"KEC International",location:"Mumbai, Maharashtra",segments:"Power Transmission, EPC, Manufacturing",website:"kecrpg.com"},
  {name:"Kalpataru Projects Intl (KPIL)",location:"Mumbai, Maharashtra",segments:"Power T&D, Buildings, Water, Railways, Oil & Gas",website:"kalpataruprojects.com"},
  {name:"Adani Enterprises (Infra)",location:"Ahmedabad, Gujarat",segments:"Power, Infrastructure, Gas, Renewable",website:"adanienterprises.com"},
  {name:"Power Grid Corp (PGCIL)",location:"Gurugram, Haryana",segments:"Power Transmission, Smart Grid, Telecom",website:"powergrid.in"},
  {name:"NTPC Limited (EPC Div.)",location:"New Delhi",segments:"Thermal Power, Renewable Energy, EPC",website:"ntpc.co.in"},
  {name:"Megha Engineering & Infrastructure (MEIL)",location:"Hyderabad, Telangana",segments:"Infrastructure, Water, Power, Rail",website:"meihan.in"},
  {name:"NCC Limited",location:"Hyderabad, Telangana",segments:"Bridges, Civil Works, Infrastructure EPC",website:"nccltd.com"},
  {name:"Reliance Infrastructure",location:"Navi Mumbai, Maharashtra",segments:"Power, Metro Rail, Airports, Bridges, Defence",website:"relianceindia.com"},
  {name:"Afcons Infrastructure",location:"Mumbai, Maharashtra",segments:"Bridges, Metros, Tunnels, Highways, Ports",website:"afcons.com"},
  {name:"GMR Infrastructure",location:"New Delhi",segments:"Airports, Power, Highways, Urban Infrastructure",website:"gmrinfra.com"},
  {name:"Dilip Buildcon",location:"Bhopal, Madhya Pradesh",segments:"Highways, Infrastructure, EPC",website:"dilipbuildcon.com"},
  {name:"G R Infraprojects",location:"Udaipur, Rajasthan",segments:"Highways, Infrastructure EPC",website:"grinfra.com"},
  {name:"PNC Infratech",location:"Agra, Uttar Pradesh",segments:"Highways, Infrastructure, EPC",website:"pncinfrateach.com"},
  {name:"Shapoorji Pallonji & Co",location:"Mumbai, Maharashtra",segments:"Civil Works, EPC, Infrastructure",website:"shapoorjipallonji.com"},
  {name:"IRB Infrastructure",location:"Mumbai, Maharashtra",segments:"Highways, Toll Roads",website:"irb.co.in"},
  {name:"Rail Vikas Nigam Ltd (RVNL)",location:"New Delhi",segments:"Railway Infrastructure, Civil Works",website:"rvnl.org"},
  {name:"IRCON International",location:"New Delhi",segments:"Railway Infrastructure, Turnkey Projects",website:"ircon.org"},
];
const EPC_T2=[
  {name:"Techno Electric & Engineering",location:"Kolkata, West Bengal",segments:"Power, Infrastructure, Substation EPC",website:"technoelectric.in"},
  {name:"Sterling & Wilson",location:"Mumbai, Maharashtra",segments:"MEP, Transmission, Data Centers, Solar",website:"sterlingandwilson.com"},
  {name:"Tata Power Solar",location:"Mumbai, Maharashtra",segments:"Solar Energy, Power",website:"tatapowersolar.com"},
  {name:"Mahindra Susten",location:"Mumbai, Maharashtra",segments:"Renewable Energy, Solar",website:"mahindrasusten.com"},
  {name:"Hindustan Construction Co (HCC)",location:"Mumbai, Maharashtra",segments:"Hydro Power, Nuclear, Tunneling, Infrastructure",website:"hccindia.com"},
  {name:"Engineers India Ltd (EIL)",location:"New Delhi",segments:"Oil & Gas, Petrochemicals, Power",website:"engineersindia.com"},
  {name:"NBCC (India)",location:"New Delhi",segments:"Building Construction, Infrastructure",website:"nbccindia.com"},
  {name:"Thermax Limited",location:"Pune, Maharashtra",segments:"Energy, Environment, Boilers, Power",website:"thermax.com"},
  {name:"Ashoka Buildcon",location:"Nashik, Maharashtra",segments:"Highways, EPC, BOT, HAM",website:"ashokabuildcon.com"},
  {name:"PSP Projects",location:"Ahmedabad, Gujarat",segments:"Infrastructure, Civil Works",website:"pspprojects.com"},
  {name:"Elecon Engineering",location:"Anand, Gujarat",segments:"Power, Transmission Equipment",website:"elecon.com"},
  {name:"RITES Ltd",location:"Gurugram, Haryana",segments:"Railway Infrastructure, Consultancy",website:"rites.com"},
  {name:"VA Tech Wabag",location:"Chennai, Tamil Nadu",segments:"Water Treatment, Infrastructure",website:"vatechwabagin.com"},
  {name:"KNR Constructions",location:"Hyderabad, Telangana",segments:"Highways, Infrastructure",website:"knrconstructions.com"},
  {name:"ISGEC Heavy Engineering",location:"Noida, Uttar Pradesh",segments:"Power Equipment, Heavy Equipment",website:"isgec.com"},
  {name:"HG Infra Engineering",location:"Jaipur, Rajasthan",segments:"Highways, Infrastructure",website:"hginfraindia.com"},
  {name:"Welspun Enterprises",location:"Mumbai, Maharashtra",segments:"Pipes, Infrastructure",website:"welspun.com"},
  {name:"J.Kumar Infraprojects",location:"Mumbai, Maharashtra",segments:"Civil Infrastructure, EPC",website:"jkumarinfra.com"},
  {name:"Ceigall India",location:"Ludhiana, Punjab",segments:"Infrastructure, Piling, Civil Works",website:"ceigall.com"},
  {name:"Brahmaputra Infrastructure",location:"Guwahati, Assam",segments:"Hydro Power, Infrastructure",website:"brahmaputra-infra.com"},
];
const EPC_T3=[
  {name:"Salasar Techno Engineering",location:"New Delhi",segments:"Power, Transmission Towers",website:"salasartech.com"},
  {name:"Skipper Limited",location:"Kolkata, West Bengal",segments:"Manufacturing, Power Cables, Towers",website:"skippercables.com"},
  {name:"Pennar Industries",location:"Hyderabad, Telangana",segments:"Structures, Towers, Manufacturing",website:"pennarindustries.com"},
  {name:"Montecarlo Ltd",location:"Ahmedabad, Gujarat",segments:"Infrastructure, Civil Works",website:"montecarloinfra.com"},
  {name:"Sadbhav Engineering",location:"Ahmedabad, Gujarat",segments:"Roads, Infrastructure",website:"sadbhav.com"},
  {name:"Gensol Engineering",location:"Ahmedabad, Gujarat",segments:"Solar Energy, EPC",website:"gensol.com"},
  {name:"Ramky Infrastructure",location:"Hyderabad, Telangana",segments:"Roads, Infrastructure EPC",website:"ramkyinfra.com"},
  {name:"Gayatri Projects",location:"Hyderabad, Telangana",segments:"Power, Infrastructure",website:"gayatriproject.com"},
  {name:"RPP Infra Projects",location:"Erode, Tamil Nadu",segments:"Infrastructure, Civil Works",website:"rppinfra.com"},
  {name:"Patel Engineering",location:"Mumbai, Maharashtra",segments:"Hydro Power, Civil Infrastructure",website:"patelengineering.com"},
  {name:"MECON Limited",location:"Ranchi, Jharkhand",segments:"Steel, Mining, Power EPC",website:"meconlimited.co.in"},
  {name:"ITD Cementation",location:"Mumbai, Maharashtra",segments:"Deep Foundations, Underground Works",website:"itdcem.com"},
  {name:"Simplex Infrastructures",location:"Kolkata, West Bengal",segments:"Roads, Bridges, Civil Works",website:"simplexindia.com"},
  {name:"Texmaco Rail",location:"Kolkata, West Bengal",segments:"Railway Equipment, Infrastructure",website:"texmaco.com"},
  {name:"Jakson Group",location:"Noida, Uttar Pradesh",segments:"Manufacturing, Energy, DG Sets",website:"jaksongroup.com"},
  {name:"Gawar Construction",location:"Hisar, Haryana",segments:"Infrastructure, Civil Works",website:"gawar.com"},
  {name:"MBL Infrastructures",location:"New Delhi",segments:"Infrastructure, Roads",website:"mblinfra.com"},
  {name:"Apco Infratech",location:"Lucknow, Uttar Pradesh",segments:"Infrastructure, Civil Works",website:"apcoinfra.com"},
  {name:"Oriental Structural Engineers",location:"New Delhi",segments:"Structural Engineering",website:"orientalstruct.com"},
  {name:"SPML Infra",location:"Kolkata, West Bengal",segments:"Water, Infrastructure",website:"spmlinfra.com"},
];

const MANUFACTURERS_T1=[
  {name:"BHEL (Bharat Heavy Electricals Ltd.)",location:"Haridwar + Bhopal + Jhansi",voltageRange:"Up to 765–800 kV",mvaRange:"Up to 500 MVA",products:"Power transformers, auto-transformers, generator TFs, shunt reactors, traction TFs",clients:"POWERGRID, NTPC, State Transcos, Railways",contact:"Haridwar Plant: 01334-281001",approach:"Full-day seminar + trial quantity offer; both Haridwar & Bhopal plants",window:"Day 25–35"},
  {name:"Hitachi Energy India Ltd. (formerly ABB Power)",location:"Vadodara, Gujarat",voltageRange:"Up to 765 kV EHV",mvaRange:"Up to 630 MVA",products:"Power & auto TFs, traction, HVDC converter TFs, smart digital transformers",clients:"Tata Power (India's most powerful natural ester TF), POWERGRID, State Transcos",contact:"Vadodara: 0265-3924100",approach:"Vadodara plant; Tata Power natural ester reference; technical seminar",window:"Day 30–40"},
  {name:"Siemens Energy India Ltd.",location:"Kalwa, Thane, Maharashtra",voltageRange:"Up to 400 kV",mvaRange:"Up to 500 MVA",products:"Power TFs, distribution, phase-shifting, IoT-enabled smart grid, eco-series",clients:"POWERGRID, MSEDCL, urban utilities; digital integration specialist",contact:"Kalwa Works: 022-2767-2000",approach:"Kalwa site + Mumbai office; digital transformer + ESG angle",window:"Day 25–35"},
  {name:"CG Power & Industrial Solutions Ltd.",location:"Nashik + Kanjurmarg Mumbai + Bhopal",voltageRange:"Up to 1200 kV UHV",mvaRange:"Up to 1000 MVA",products:"Power TFs, furnace TFs, auto-TFs, EHV units, phase-shifting, UHV special",clients:"POWERGRID, State Transcos, PSUs; major national grid supplier",contact:"Nashik: 0253-6640000",approach:"Nashik plant + corporate Mumbai; POWERGRID reference; BOM spec",window:"Day 25–35"},
  {name:"Transformers & Rectifiers India Ltd. (TRIL)",location:"Moraiya, Ahmedabad, Gujarat",voltageRange:"Up to 400 kV",mvaRange:"Up to 315 MVA",products:"EHV power TFs, converter TFs, furnace TFs, HVDC, dry-type, rectifier TFs",clients:"POWERGRID, PSUs, major industrial; growing export portfolio",contact:"Ahmedabad: 079-6190-6000",approach:"Factory visit + trial; coordinate with GETCO & Torrent visits",window:"Day 30–40"},
  {name:"GE T&D India Ltd. / Grid Solutions",location:"Vadodara, Gujarat",voltageRange:"Up to 765 kV",mvaRange:"Up to 500 MVA",products:"Grid-scale power TFs, auto-TFs, HVDC converter TFs, gas-insulated TFs",clients:"POWERGRID, State Transcos, renewable energy interconnections",contact:"Vadodara: 0265-2580071",approach:"Technical meeting + BOM spec; coordinate with TRIL Ahmedabad visit",window:"Day 35–45"},
  {name:"TBEA Energy (India) Pvt. Ltd.",location:"Delhi/NCR + Moradabad, UP",voltageRange:"Up to 750 kV",mvaRange:"Up to 750 MVA",products:"EHV power TFs, UHV prototypes, auto-TFs, converter TFs; global 1000 kV UHV expertise",clients:"PSUs, State Transcos; growing India order book",contact:"Delhi NCR Regional Office",approach:"Regional sales office; EHV presentation; reference TBEA global ester adoption",window:"Day 35–45"},
  {name:"Schneider Electric India",location:"Bengaluru + Nashik",voltageRange:"Up to 400 kV",mvaRange:"Up to 200 MVA",products:"Smart/digital TFs, IoT-enabled units, medium-voltage TFs, eco-design for green buildings",clients:"Urban utilities, IT parks, data centres, smart cities, renewable farms",contact:"Bengaluru: 080-6177-5500",approach:"Bengaluru tech office; ESG + digital twin angle; eco-friendly product line",window:"Day 35–45"},
];

const MANUFACTURERS_T2=[
  {name:"Kirloskar Electric Co. Ltd.",location:"Bengaluru, Karnataka + Mysuru",voltageRange:"Up to 220 kV",mvaRange:"Up to 200 MVA",products:"Power transformers, distribution TFs, dry-type, industrial; defence & railway TFs",clients:"State DISCOMs, industrial sector, Railways, defence establishments",window:"Day 40–55"},
  {name:"Voltamp Transformers Ltd.",location:"Vadodara, Gujarat",voltageRange:"Up to 220 kV",mvaRange:"Up to 100 MVA",products:"Power TFs, distribution TFs, oil & dry-type; exported to 40+ countries",clients:"Domestic DISCOMs, industrial; strong private sector and export market",window:"Day 40–55"},
  {name:"IMP Power Ltd.",location:"Silvassa / Mumbai region",voltageRange:"Up to 220 kV",mvaRange:"Up to 100 MVA",products:"Power transformers, distribution TFs, special application units for utilities & industry",clients:"State utilities, PSUs, heavy industrial sector",window:"Day 40–55"},
  {name:"Emco Limited",location:"Aurangabad, Maharashtra",voltageRange:"Up to 400 kV",mvaRange:"Up to 315 MVA",products:"Power TFs, auto-transformers, shunt reactors, 33 kV and above; POWERGRID-approved vendor",clients:"POWERGRID, State Transcos, PSUs; approved for major substation projects",window:"Day 40–55"},
  {name:"Diamond Power Infrastructure Ltd.",location:"Vadodara, Gujarat",voltageRange:"Up to 220 kV",mvaRange:"Up to 100 MVA",products:"Distribution & power TFs, winding wire, transmission cables",clients:"State DISCOMs, industrial sector, Gujarat utilities",window:"Day 45–55"},
  {name:"BHEL Jhansi (Distribution Division)",location:"Jhansi, Uttar Pradesh",voltageRange:"Up to 66 kV",mvaRange:"Distribution range",products:"Distribution TFs, traction TFs for Indian Railways; very high volume output annually",clients:"Indian Railways, UP DISCOMs, State utilities — captive demand from Railways alone is massive",window:"Day 40–50"},
  {name:"Techno Electric & Engineering Co.",location:"Kolkata, West Bengal",voltageRange:"Up to 220 kV (EPC)",mvaRange:"EPC integrator",products:"Transformer EPC integrator — procures TFs for utility substation projects across India; key oil spec influencer",clients:"State Transcos, PSUs; wins turnkey substation contracts and specifies oil as part of tender",window:"Day 45–55"},
  {name:"EVR Power (EVR Electricals)",location:"Plot 64, Ponni Amman Nagar, Ayanambakkam, Chennai – 600095",voltageRange:"Up to 110 kV",mvaRange:"Up to 50 MVA",products:"Transformers, cooling panels, radiators, distribution TFs; South India-focused",clients:"TANGEDCO, Tamil Nadu DISCOMs, South Indian industrial sector",window:"Day 50–65"},
  {name:"Gujarat Transformers Pvt. Ltd.",location:"Vadodara, Gujarat",voltageRange:"Up to 220 kV",mvaRange:"Up to 100 MVA",products:"Power TFs, 33 kV and above; utility and industrial supply; Gujarat market specialist",clients:"Gujarat DISCOMs (MGVCL, DGVCL, PGVCL, UGVCL), State utilities",window:"Day 50–65"},
  {name:"Indo Tech Transformers Ltd.",location:"Chennai, Tamil Nadu",voltageRange:"Up to 220 kV",mvaRange:"Up to 100 MVA",products:"33 kV and above power TFs; distribution TFs; South India utility supplier",clients:"TANTRANSCO, TANGEDCO, KSEB, South Indian utilities",window:"Day 50–65"},
  {name:"Kotsons Pvt. Ltd.",location:"B-7, Eldeco Sidcul Industrial Park, Sitarganj, Dist. U.S. Nagar, Uttarakhand",voltageRange:"Up to 33 kV",mvaRange:"Up to 10 MVA",products:"Distribution TFs, 33 kV class; very high volume North India presence; DISCOM supplier",clients:"PVVNL, MVVNL, UPCL, Uttarakhand & UP DISCOMs",window:"Day 50–65"},
  {name:"Uttam Bharat / UTL Transformers",location:"India (multiple plants)",voltageRange:"Up to 220 kV",mvaRange:"Up to 100 MVA",products:"Power TFs, auto-transformers; growing utility segment focus",clients:"State utilities, industrial sector; North & West India presence",window:"Day 55–70"},
  {name:"SGB Transformers India Pvt. Ltd.",location:"India (European SGB-SMIT Group technology)",voltageRange:"Up to 220 kV",mvaRange:"Up to 200 MVA",products:"Specialised power transformers; European technology pedigree; quality-focused premium segment",clients:"PSUs, State Transcos, renewable sector; premium segment buyers",window:"Day 55–70"},
  {name:"Om Shakti Transformers Ltd. (OSTL)",location:"Multi-location (North + West India)",voltageRange:"Up to 220 kV",mvaRange:"Up to 100 MVA",products:"33 kV and above power & distribution TFs; multi-state DISCOM supplier",clients:"State DISCOMs, industrial sector; established North + West India market",window:"Day 55–70"},
  {name:"Vijay Electricals Ltd.",location:"Hyderabad, Telangana",voltageRange:"Up to 220 kV",mvaRange:"Up to 100 MVA",products:"Power TFs, distribution TFs; strong South India & Telangana presence",clients:"TSGENCO, TSTRANSCO, TSSPDCL, TSNPDCL, AP utilities; Hyderabad specialist",window:"Day 55–70"},
  {name:"Star Delta Transformers",location:"Bengaluru, Karnataka",voltageRange:"Up to 33 kV",mvaRange:"Up to 10 MVA",products:"Medium power TFs, distribution; South India DISCOM and industrial supplier",clients:"BESCOM, CESC Karnataka, South Indian DISCOMs, industrial sector",window:"Day 55–70"},
  {name:"Arteche India",location:"Pune, Maharashtra",voltageRange:"Up to 400 kV (Instrument)",mvaRange:"Instrument TFs",products:"Current TFs, voltage TFs, 33 kV and above; critical metering in ester-filled substations",clients:"POWERGRID, State Transcos, all major utilities; metering and protection standard",window:"Day 50–65"},
];

const MANUFACTURERS_T3=[
  {name:"Servokon Systems Ltd.",location:"Delhi/NCR",voltageRange:"Up to 220 kV",products:"Power TFs, servo stabilisers, industrial transformers",window:"Day 60–75"},
  {name:"Makpower Trans Systems Pvt. Ltd.",location:"Multi-location",voltageRange:"Up to 66 kV",products:"Custom TFs, distribution, special application units",window:"Day 60–75"},
  {name:"Billets Elektro Werke Pvt. Ltd.",location:"UP / North India",voltageRange:"Up to 33 kV",products:"Distribution TFs; North India DISCOM approved supplier",window:"Day 60–80"},
  {name:"T Power Transformers",location:"India",voltageRange:"Up to 220 kV",products:"Power and distribution transformers",window:"Day 60–80"},
  {name:"Balaji Power Automation",location:"India",voltageRange:"Up to 33 kV",products:"Power TFs, automation panels, distribution",window:"Day 65–80"},
  {name:"Lumens Electricals",location:"Indore, Madhya Pradesh",voltageRange:"Up to 33 kV",products:"Distribution TFs; MP DISCOM approved supplier",window:"Day 65–80"},
  {name:"Meem Transformers Pvt. Ltd.",location:"India",voltageRange:"Up to 33 kV",products:"Distribution and power TFs; regional utility supplier",window:"Day 65–85"},
  {name:"Billtech Electricals Pvt. Ltd.",location:"North India",voltageRange:"Up to 33 kV",products:"Distribution TFs; DISCOM supplier North India",window:"Day 65–85"},
  {name:"Trutech Products",location:"Gujarat",voltageRange:"Up to 66 kV",products:"Power & distribution TFs; Gujarat market focus",window:"Day 65–85"},
  {name:"Mehru Electrical & Mechanical Engineers",location:"Roorkee, Uttarakhand",voltageRange:"Up to 33 kV (Instrument)",products:"Instrument TFs, CTs, VTs; ester-compatible instrument TF designs",window:"Day 70–90"},
  {name:"Altrans Electricals",location:"India",voltageRange:"Up to 66 kV",products:"Distribution TFs; rural electrification and DISCOM supply",window:"Day 70–90"},
  {name:"Zenith Transformers",location:"India",voltageRange:"Up to 33 kV",products:"Distribution TFs; industrial supply; regional supplier",window:"Day 70–90"},
  {name:"Power Max Transformers",location:"India",voltageRange:"Up to 33 kV",products:"Distribution and special application TFs",window:"Day 70–90"},
  {name:"Central Transformers",location:"India",voltageRange:"Up to 66 kV",products:"Power TFs; State DISCOM approved vendor",window:"Day 70–90"},
  {name:"National Electricals",location:"India",voltageRange:"Up to 66 kV",products:"Distribution TFs; multi-state DISCOM presence",window:"Day 75–90"},
];

const KPIS=[
  {category:"CEA Regulatory",kpi:"CEA HQ Meeting Completed",target:"YES — by Day 10",gate:"Day 14"},
  {category:"CEA Regulatory",kpi:"RIO Offices Visited",target:"5 of 5 (100%)",gate:"Day 30"},
  {category:"Central PSUs",kpi:"PSUs Formally Engaged",target:"6 of 7 (minimum)",gate:"Day 45"},
  {category:"Central PSUs",kpi:"Empanelment Applications Filed",target:"All 6 Central PSUs by Day 45",gate:"Day 45"},
  {category:"State Transcos",kpi:"Transcos Formally Presented",target:"Minimum 25 of 36",gate:"Day 75"},
  {category:"DISCOMs",kpi:"Product Letter Dispatched",target:"100% of 70+ DISCOMs by Day 14",gate:"Day 14"},
  {category:"DISCOMs",kpi:"Priority DISCOM Meetings (in-person)",target:"Minimum 20",gate:"Day 75"},
  {category:"Generation",kpi:"Generation Companies Engaged",target:"Minimum 15",gate:"Day 75"},
  {category:"Nodal Agencies",kpi:"Nodal RE Agencies Covered",target:"Minimum 20 of 36",gate:"Day 90"},
  {category:"Private Utilities",kpi:"Private DISCOMs Engaged",target:"Minimum 10 of 14",gate:"Day 75"},
  {category:"Manufacturers",kpi:"Confirmation Letters Dispatched",target:"100% of Tier 1+2+3 by Day 15",gate:"Day 15"},
  {category:"Manufacturers",kpi:"Tier-1 OEM Factory Meetings",target:"8 of 8 (100%)",gate:"Day 45"},
  {category:"Manufacturers",kpi:"Trial Quantities Deployed",target:"Minimum 3 Tier-1 OEMs",gate:"Day 60"},
  {category:"EPC",kpi:"EPC Tier-1 Companies Engaged",target:"Minimum 10 of 20",gate:"Day 75"},
  {category:"Commercial",kpi:"LOIs / Confirmed Orders (utility)",target:"Minimum 3",gate:"Day 90"},
  {category:"Commercial",kpi:"LOIs / Confirmed Orders (OEM)",target:"Minimum 2",gate:"Day 90"},
  {category:"Commercial",kpi:"Empanelment Approvals Obtained",target:"Minimum 5 utilities",gate:"Day 120"},
  {category:"Commercial",kpi:"Long-Term Agreements (LTAs) Signed",target:"Minimum 1 private utility",gate:"Day 120"},
];

const RISKS=[
  {risk:"PSU procurement cycles cause 6–9 month delay to actual orders",likelihood:"High",impact:"Medium",mitigation:"File empanelment + offer pilot supply outside tender; target private utilities for early cash flow"},
  {risk:"Utilities unfamiliar with ester oil handling, storage and maintenance",likelihood:"Medium",impact:"Medium",mitigation:"Free handling manual + certified maintenance training; deploy Field Application Engineer at buyer site"},
  {risk:"Price resistance — ester is 2–3x more expensive than mineral oil",likelihood:"High",impact:"High",mitigation:"Present lifecycle cost model: 5–8x longer insulation life, K-class fire safety, import-substitution value"},
  {risk:"Competitor pre-emption by APAR POWEROIL Ester or Cargill",likelihood:"Medium",impact:"High",mitigation:"Speed is primary defence — letter dispatch Day 15, Tier-1 factory visits Day 35"},
  {risk:"Trade receivable accumulation with slow-paying PSU customers",likelihood:"Medium",impact:"Medium",mitigation:"Prioritise private utilities (faster payment) for first supply agreements"},
  {risk:"Utility requests retro-filling — service may not be ready",likelihood:"Medium",impact:"Medium",mitigation:"Prepare retro-filling offering with filtration rigs; partner with transformer maintenance firms"},
  {risk:"CEA Advisory treated as optional by some utilities",likelihood:"Medium",impact:"Low",mitigation:"Para 9 references West Asia crisis urgency; use RIO compliance letter in all meetings"},
];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function Badge({text,color=N,textColor=W}){return <span style={{display:"inline-block",padding:"3px 10px",borderRadius:4,fontSize:FS.sm,fontWeight:700,background:color,color:textColor,whiteSpace:"nowrap"}}>{text}</span>}
function SearchBar({value,onChange,placeholder="Search..."}){return <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{padding:"8px 14px",border:`1px solid ${GR}`,borderRadius:6,fontSize:FS.base,width:"100%",maxWidth:360,outline:"none",background:W,color:INK}}/>}
function FilterPills({options,selected,onChange}){return <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["All",...options].map(o=><button key={o} onClick={()=>onChange(o)} style={{padding:"5px 14px",borderRadius:20,fontSize:FS.sm,cursor:"pointer",border:"none",background:selected===o?N:GR,color:selected===o?W:GD,fontWeight:selected===o?700:400}}>{o}</button>)}</div>}

function Table({cols,rows,maxH=540}){return(
  <div style={{overflowX:"auto",overflowY:"auto",maxHeight:maxH,borderRadius:8,border:`1px solid ${GR}`}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:FS.base}}>
      <thead><tr style={{background:N,position:"sticky",top:0,zIndex:2}}>{cols.map((c,i)=><th key={i} style={{padding:"12px 14px",color:W,fontWeight:700,textAlign:"left",whiteSpace:"nowrap",fontSize:FS.sm,borderRight:i<cols.length-1?`1px solid ${NM}`:""}}>{c}</th>)}</tr></thead>
      <tbody>
        {rows.length===0&&<tr><td colSpan={cols.length} style={{padding:36,textAlign:"center",color:GD,fontSize:FS.base}}>No results found</td></tr>}
        {rows.map((row,ri)=><tr key={ri} style={{background:ri%2===0?W:ALT,borderBottom:`1px solid ${GR}`}}>{row.map((cell,ci)=><td key={ci} style={{padding:"11px 14px",color:INK,verticalAlign:"top",borderRight:ci<row.length-1?`1px solid ${GR}`:"",fontSize:FS.base,lineHeight:1.6}}>{cell}</td>)}</tr>)}
      </tbody>
    </table>
  </div>
)}

function SectionHeader({title,subtitle,count}){return(
  <div style={{marginBottom:24}}>
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <h2 style={{margin:0,fontSize:FS.h1,fontWeight:800,color:N}}>{title}</h2>
      {count!==undefined&&<span style={{background:G,color:W,fontSize:FS.sm,fontWeight:700,padding:"3px 12px",borderRadius:12}}>{count}</span>}
    </div>
    {subtitle&&<p style={{margin:"6px 0 0",fontSize:FS.md,color:GD,lineHeight:1.55}}>{subtitle}</p>}
    <div style={{width:54,height:3,background:G,marginTop:11,borderRadius:2}}/>
  </div>
)}

function StatCard({label,value}){return(
  <div style={{background:W,borderRadius:8,padding:"16px 18px",border:`1px solid ${GR}`,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
    <p style={{margin:"0 0 6px",fontSize:FS.xs,fontWeight:700,color:GD,textTransform:"uppercase",letterSpacing:1}}>{label}</p>
    <p style={{margin:0,fontSize:FS.xl,fontWeight:800,color:N,lineHeight:1.2}}>{value}</p>
  </div>
)}

// ── TRACKING (localStorage-persisted) ──────────────────────────────────────

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  const set = useCallback(v => {
    setVal(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);
  return [val, set];
}

const STATUS_COLORS = { red:"#C62828", yellow:"#E6A817", green:"#2E7D32" };
const STATUS_CYCLE = ["red","yellow","green"];
const STATUS_LABELS = { red:"Not Started", yellow:"In Progress", green:"Completed" };

function StatusBall({ id, tracking, setTracking }) {
  const current = (tracking[id] && tracking[id].status) || "red";
  const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % 3];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <button onClick={() => setTracking(t => ({ ...t, [id]: { ...t[id], status: next } }))}
        title={STATUS_LABELS[current] + " → Click to change"}
        style={{ width:20, height:20, borderRadius:"50%", background:STATUS_COLORS[current], border:"2px solid rgba(0,0,0,0.15)", cursor:"pointer", boxShadow:`0 0 6px ${STATUS_COLORS[current]}55`, transition:"all 0.2s" }} />
      <span style={{ fontSize:11, color:GD, whiteSpace:"nowrap" }}>{STATUS_LABELS[current]}</span>
    </div>
  );
}

function CommentBox({ id, tracking, setTracking }) {
  const [editing, setEditing] = useState(false);
  const comment = (tracking[id] && tracking[id].comment) || "";
  if (editing) {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:4, minWidth:180 }}>
        <textarea autoFocus defaultValue={comment}
          onBlur={e => { setTracking(t => ({ ...t, [id]: { ...t[id], comment: e.target.value } })); setEditing(false); }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.target.blur(); } }}
          style={{ padding:"6px 8px", border:`1px solid ${G}`, borderRadius:4, fontSize:12, resize:"vertical", minHeight:48, fontFamily:"inherit", outline:"none", background:"#FFFDE7" }}
          placeholder="Add comment..." />
        <span style={{ fontSize:10, color:GD }}>Enter to save · Shift+Enter for newline</span>
      </div>
    );
  }
  return (
    <div onClick={() => setEditing(true)} style={{ cursor:"pointer", minWidth:140, padding:"4px 6px", borderRadius:4, border:`1px dashed ${comment ? G : GR}`, background:comment ? "#FFFDE7" : "transparent", minHeight:28, display:"flex", alignItems:"center" }}>
      {comment
        ? <span style={{ fontSize:12, color:INK, lineHeight:1.4, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{comment}</span>
        : <span style={{ fontSize:11, color:GD, fontStyle:"italic" }}>+ Add comment</span>
      }
    </div>
  );
}

// ── PAGES ─────────────────────────────────────────────────────────────────────

function Dashboard(){
  const stats=[
    {label:"CEA Mandate",value:"10% Ester"},
    {label:"Voltage Class",value:"≥ 33 kV"},
    {label:"Global Ester Market",value:"$3.8 Billion"},
    {label:"Market CAGR",value:"7.4%"},
    {label:"CEA Offices to Visit",value:"5 RIOs + HQ"},
    {label:"Central PSUs",value:"7 Organisations"},
    {label:"State Transcos",value:"36 (All States/UTs)"},
    {label:"DISCOMs Covered",value:"70+ (Govt + Private)"},
    {label:"Generation Companies",value:"41 Companies"},
    {label:"Nodal RE Agencies",value:"36 (All States/UTs)"},
    {label:"EPC Companies",value:"60+ (Tier 1+2+3)"},
    {label:"Transformer OEMs",value:"40+ (33 kV & above)"},
  ];
  const pillars=[
    {n:"1",t:"CEA Regional Offices",d:"5 locations — engage first to obtain compliance acknowledgements for all subsequent utility meetings.",days:"Days 1–30"},
    {n:"2",t:"Central PSU Utilities",d:"7 major PSUs — highest volume & value. POWERGRID Bhiwadi 315 MVA is the most powerful reference.",days:"Days 15–60"},
    {n:"3",t:"State & Private Utilities",d:"36 Transcos + 70+ DISCOMs + 41 GenCos + 36 Nodal RE Agencies — complete Indian power ecosystem.",days:"Days 20–90"},
    {n:"4",t:"OEMs & EPC Companies",d:"40+ Transformer Manufacturers + 60+ EPC companies — factory-fill BOM spec creates durable supply chain.",days:"Days 7–90"},
  ];
  return(
    <div>
      <SectionHeader title="Executive Dashboard" subtitle="90–120 Day Market Entry Plan | Natural & Synthetic Ester Oil | Indian Power Sector | CEA Advisory I/64705/2026"/>
      <div style={{background:N,borderRadius:10,padding:"18px 24px",marginBottom:26,color:W}}>
        <p style={{margin:"0 0 8px",fontSize:FS.xs,fontWeight:700,color:GL,letterSpacing:2,textTransform:"uppercase"}}>CEA Advisory — Effective 15 May 2026 | Ref: I/64705/2026</p>
        <p style={{margin:"0 0 10px",fontSize:FS.md,fontStyle:"italic",lineHeight:1.65}}>"All Central/State/Private Transmission Utilities are hereby advised to use Ester Oil as insulating/cooling fluid in at least 10% (preferably 5% Natural & 5% Synthetic Ester) of new Transformers, Reactors etc. for all voltage classes 33 kV and above."</p>
        <p style={{margin:0,fontSize:FS.sm,color:"#9AB0CC"}}>Para 9 — URGENCY: "Implement as soon as possible in view of present West Asia crisis scenario." | Signed: Sh. Gaurav Srivastava, Asst. Director (CEI Division)</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:14}}>
        {stats.slice(0,4).map((s,i)=><StatCard key={i} {...s}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:14}}>
        {stats.slice(4,8).map((s,i)=><StatCard key={i} {...s}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:30}}>
        {stats.slice(8).map((s,i)=><StatCard key={i} {...s}/>)}
      </div>
      <SectionHeader title="The 4-Pillar Strategy"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
        {pillars.map((p,i)=>(
          <div key={i} style={{background:W,border:`1px solid ${GR}`,borderRadius:8,padding:"20px 22px",display:"flex",gap:18}}>
            <div style={{width:48,height:48,minWidth:48,borderRadius:"50%",background:N,display:"flex",alignItems:"center",justifyContent:"center",fontSize:FS.xl,fontWeight:800,color:G}}>{p.n}</div>
            <div>
              <p style={{margin:"0 0 7px",fontWeight:800,fontSize:FS.lg,color:N}}>{p.t}</p>
              <p style={{margin:"0 0 12px",fontSize:FS.base,color:INK,lineHeight:1.6}}>{p.d}</p>
              <Badge text={p.days} color={G} textColor={W}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Advisory(){
  return(
    <div>
      <SectionHeader title="Regulatory Trigger — CEA Advisory" subtitle="Landmark directive effective immediately — removes the single biggest adoption barrier: buyer inertia"/>
      <div style={{background:N,borderRadius:10,padding:"18px 22px",marginBottom:16}}>
        <p style={{margin:"0 0 8px",fontWeight:700,color:GL,fontSize:FS.lg}}>Para 8 — Core Mandate</p>
        <p style={{margin:0,color:W,fontStyle:"italic",lineHeight:1.7,fontSize:FS.md}}>"All Central/State/Private Transmission Utilities are hereby advised to use Ester Oil as insulating/cooling fluid in at least 10% (preferably 5% Natural & 5% Synthetic Ester) of new Transformers, Reactors etc. to be procured/installed for all voltage classes 33 kV and above."</p>
      </div>
      <div style={{background:G,borderRadius:8,padding:"14px 20px",marginBottom:24}}>
        <p style={{margin:0,fontWeight:700,color:W,fontSize:FS.md}}>Para 9 — Urgency: "All utilities are requested to implement above advisory as soon as possible in view of present West Asia crisis scenario."</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div>
          {[["Advisory Reference","CEA-PS-16/13/2025-CEI Division, I/64705/2026"],["Date Issued","15 May 2026"],["Issuing Authority","Central Electricity Authority (CEA), Ministry of Power, GoI"],["Signatory","Sh. Gaurav Srivastava, Asst. Director (CEI Division)"],["Para 8 Mandate","At least 10% (5% Natural + 5% Synthetic Ester) of new TFs/Reactors ≥33 kV"],["Addressees","Central PSUs | State Utilities | CTUIL/PGCIL/STUs | All DISCOMs/GENCOs | DG, IEEMA"],["Early Adopters Cited","GETCO, NTPC, POWERGRID, Indian Railways"],["IS Standards","IS/IEC 62770 (Natural Ester) | IS/IEC 61099 (Synthetic Ester)"]].map(([k,v],i)=>(
            <div key={i} style={{display:"flex",borderBottom:`1px solid ${GR}`,padding:"10px 0",gap:14}}>
              <span style={{fontSize:FS.sm,color:GD,minWidth:180,fontWeight:700}}>{k}</span>
              <span style={{fontSize:FS.base,color:INK,lineHeight:1.55}}>{v}</span>
            </div>
          ))}
        </div>
        <div>
          <h3 style={{color:N,fontSize:FS.lg,margin:"0 0 16px"}}>Key Observations</h3>
          {["Ester oil adoption accelerating globally — K-class fire safety (flash point >320°C) and biodegradability","India imports mineral oil from crude — West Asia crisis = strategic energy security risk","Advisory removes buyer inertia — every Chief Engineer now has regulatory basis to specify ester oil","Both Natural Ester (IS/IEC 62770) AND Synthetic Ester (IS/IEC 61099) explicitly mandated","OEM certification required — transformer design suitability for ester must be confirmed by manufacturer","POWERGRID Bhiwadi 315 MVA (Jan 2026) — India's most powerful ester transformer reference site"].map((o,i)=>(
            <div key={i} style={{background:i%2===0?W:ALT,borderRadius:6,padding:"12px 16px",marginBottom:7,display:"flex",gap:12}}>
              <span style={{width:8,height:8,background:G,borderRadius:"50%",marginTop:8,flexShrink:0}}/>
              <span style={{fontSize:FS.base,color:INK,lineHeight:1.6}}>{o}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CEAOffices(){
  const [search,setSearch]=useState(""); const [zone,setZone]=useState("All");
  const [tracking,setTracking]=useLocalStorage("track_cea",{});
  const filtered=useMemo(()=>CEA_OFFICES.filter(o=>(zone==="All"||o.zone===zone)&&(!search||[o.office,o.city,o.jurisdiction,o.contact].join(" ").toLowerCase().includes(search.toLowerCase()))),[search,zone]);
  return(
    <div>
      <SectionHeader title="PILLAR 1 — CEA Regional Inspectorial Organisations" subtitle="Priority: Days 1–30 | Obtain compliance acknowledgements as regulatory anchor for all utility meetings" count="6 Offices"/>
      <div style={{background:"#FFF8E7",border:`1px solid ${G}`,borderRadius:8,padding:"13px 18px",marginBottom:20,fontSize:FS.base}}>
        <strong>Objective:</strong> Register as CEA-compliant ester oil supplier. Obtain RIO acknowledgement letter — used in every utility and PSU meeting as proof of regulatory engagement.
      </div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search offices, jurisdictions..."/>
        <FilterPills options={["National","North","West","South","East","NE"]} selected={zone} onChange={setZone}/>
      </div>
      <Table cols={["Status","Office / RIO","Comment","City","Priority","Contact Officer","Jurisdiction"]} rows={filtered.map(o=>{const k="cea_"+o.office;return[
        <StatusBall id={k} tracking={tracking} setTracking={setTracking}/>,
        <strong style={{color:N,fontSize:FS.base}}>{o.office}</strong>,
        <CommentBox id={k} tracking={tracking} setTracking={setTracking}/>,
        o.city,
        <Badge text={o.priority} color={o.priority.includes("1–7")?G:N} textColor={W}/>,
        <span style={{fontSize:FS.sm}}>{o.contact}</span>,
        <span style={{fontSize:FS.sm,color:GD}}>{o.jurisdiction}</span>
      ];})}/>
    </div>
  );
}

function PSUUtilities(){
  const [search,setSearch]=useState("");
  const [tracking,setTracking]=useLocalStorage("track_psu",{});
  const filtPSU=useMemo(()=>PSU_UTILITIES.filter(u=>!search||[u.name,u.role].join(" ").toLowerCase().includes(search.toLowerCase())),[search]);
  return(
    <div>
      <SectionHeader title="PILLAR 2 — Central Government / PSU Utilities" subtitle="Days 15–60 | File empanelment for all PSUs by Day 45" count="7 PSUs"/>
      <div style={{background:"#E8F4FD",border:"1px solid #5AADEA",borderRadius:8,padding:"13px 18px",marginBottom:20,fontSize:FS.base}}>
        <strong>★ POWERGRID Reference:</strong> India's first 315 MVA Synthetic Ester transformer — Bhiwadi Substation (January 2026). Use as opening proof point in every meeting.
      </div>
      <div style={{display:"flex",gap:12,marginBottom:18}}><SearchBar value={search} onChange={setSearch} placeholder="Search PSUs..."/></div>
      <Table cols={["Status","Organisation","Comment","Role","Priority","Category"]} rows={filtPSU.map(u=>{const k="psu_"+u.name;return[
        <StatusBall id={k} tracking={tracking} setTracking={setTracking}/>,
        <strong style={{color:N,fontSize:FS.base}}>{u.name}</strong>,
        <CommentBox id={k} tracking={tracking} setTracking={setTracking}/>,
        <span style={{fontSize:FS.base,lineHeight:1.55}}>{u.role}</span>,
        <Badge text={u.priority} color={u.priority.includes("★")?G:N} textColor={W}/>,
        <span style={{fontSize:FS.sm,color:GD}}>{u.category}</span>
      ];})}/>
    </div>
  );
}

function StateTranscos(){
  const [search,setSearch]=useState(""); const [zone,setZone]=useState("All");
  const [tracking,setTracking]=useLocalStorage("track_transco",{});
  const filtered=useMemo(()=>STATE_TRANSCOS.filter(t=>(zone==="All"||t.zone===zone)&&(!search||[t.state,t.utility,t.hq].join(" ").toLowerCase().includes(search.toLowerCase()))),[search,zone]);
  const zC=["West","South","North","East","NE"].reduce((a,z)=>({...a,[z]:STATE_TRANSCOS.filter(t=>t.zone===z).length}),{});
  return(
    <div>
      <SectionHeader title="PILLAR 3A — State Transmission Utilities" subtitle="Days 20–75 | All 36 States/UTs with full addresses from official database | 33 kV & above infrastructure" count="36 Transcos"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:24}}>
        {Object.entries(zC).map(([z,c])=>(
          <div key={z} style={{background:N,borderRadius:8,padding:"14px 16px",textAlign:"center"}}>
            <p style={{margin:"0 0 4px",fontSize:28,fontWeight:800,color:GL}}>{c}</p>
            <p style={{margin:0,fontSize:FS.sm,color:"#9AB0CC"}}>{z} Zone</p>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search state, utility..."/>
        <FilterPills options={["West","South","North","East","NE"]} selected={zone} onChange={setZone}/>
      </div>
      <Table cols={["Status","State / UT","Transmission Utility","Comment","HQ","Zone","Visit Window"]} rows={filtered.map(t=>{const k="tc_"+t.utility;return[
        <StatusBall id={k} tracking={tracking} setTracking={setTracking}/>,
        <span style={{fontWeight:600,fontSize:FS.base}}>{t.state}</span>,
        <strong style={{color:N,fontSize:FS.base}}>{t.utility}</strong>,
        <CommentBox id={k} tracking={tracking} setTracking={setTracking}/>,
        t.hq,
        <Badge text={t.zone} color={ZONE_COL[t.zone]||GD} textColor={W}/>,
        <Badge text={t.priority} color={t.priority.includes("★")?G:OW} textColor={t.priority.includes("★")?W:INK}/>
      ];})}/>
    </div>
  );
}

function DISCOMs(){
  const [search,setSearch]=useState(""); const [zone,setZone]=useState("All"); const [sector,setSector]=useState("All");
  const [tracking,setTracking]=useLocalStorage("track_discom",{});
  const filtered=useMemo(()=>DISCOMS.filter(d=>(zone==="All"||d.zone===zone)&&(sector==="All"||d.sector===sector)&&(!search||[d.name,d.state].join(" ").toLowerCase().includes(search.toLowerCase()))),[search,zone,sector]);
  const zC=["North","West","South","East","NE"].reduce((a,z)=>({...a,[z]:DISCOMS.filter(d=>d.zone===z).length}),{});
  const pvt=DISCOMS.filter(d=>d.sector==="Private").length;
  return(
    <div>
      <SectionHeader title="PILLAR 3B — Distribution Companies (All India)" subtitle="100% product letter by Day 14 | Government & Private DISCOMs from official database" count={`${DISCOMS.length} DISCOMs`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:14}}>
        {Object.entries(zC).map(([z,c])=>(
          <div key={z} style={{background:OW,border:`1px solid ${GR}`,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
            <p style={{margin:"0 0 4px",fontSize:24,fontWeight:800,color:N}}>{c}</p>
            <p style={{margin:0,fontSize:FS.sm,color:GD}}>{z} Zone</p>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        <div style={{background:"#E8F5E9",border:"1px solid #2E7D32",borderRadius:8,padding:"12px 18px",textAlign:"center"}}>
          <p style={{margin:"0 0 4px",fontSize:28,fontWeight:800,color:"#2E7D32"}}>{DISCOMS.length-pvt}</p>
          <p style={{margin:0,fontSize:FS.base,color:GD}}>Government DISCOMs</p>
        </div>
        <div style={{background:"#FFF8E7",border:`1px solid ${G}`,borderRadius:8,padding:"12px 18px",textAlign:"center"}}>
          <p style={{margin:"0 0 4px",fontSize:28,fontWeight:800,color:G}}>{pvt}</p>
          <p style={{margin:0,fontSize:FS.base,color:GD}}>Private DISCOMs</p>
        </div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search DISCOM, state..."/>
        <FilterPills options={["North","West","South","East","NE"]} selected={zone} onChange={setZone}/>
        <FilterPills options={["Govt","Private"]} selected={sector} onChange={setSector}/>
      </div>
      <Table cols={["Status","#","DISCOM / Utility","Comment","State","Zone","Sector"]} rows={filtered.map((d,i)=>{const k="dc_"+d.name;return[
        <StatusBall id={k} tracking={tracking} setTracking={setTracking}/>,
        <span style={{color:GD,fontSize:FS.sm}}>{i+1}</span>,
        <strong style={{color:N,fontSize:FS.base}}>{d.name}</strong>,
        <CommentBox id={k} tracking={tracking} setTracking={setTracking}/>,
        <span style={{fontSize:FS.base}}>{d.state}</span>,
        <Badge text={d.zone} color={ZONE_COL[d.zone]||GD} textColor={W}/>,
        <Badge text={d.sector} color={d.sector==="Govt"?"#2E7D32":G} textColor={W}/>
      ];})}/>
    </div>
  );
}

function Generation(){
  const [search,setSearch]=useState(""); const [zone,setZone]=useState("All");
  const filtered=useMemo(()=>GENERATION.filter(g=>(zone==="All"||g.zone===zone)&&(!search||[g.state,g.company].join(" ").toLowerCase().includes(search.toLowerCase()))),[search,zone]);
  const zC=["West","South","North","East","NE"].reduce((a,z)=>({...a,[z]:GENERATION.filter(g=>g.zone===z).length}),{});
  return(
    <div>
      <SectionHeader title="Government Generation Companies (All India)" subtitle="Generator transformers & step-up transformers — direct ester oil opportunity at every power plant" count={`${GENERATION.length} GenCos`}/>
      <div style={{background:"#E8F4FD",border:"1px solid #5AADEA",borderRadius:8,padding:"12px 18px",marginBottom:20,fontSize:FS.base}}>
        <strong>Why GenCos matter:</strong> Every power plant has generator step-up transformers (GSUs) and station transformers at 33 kV and above. All are covered by the CEA Advisory mandate. Large gencos procure multiple units annually.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:22}}>
        {Object.entries(zC).map(([z,c])=>(
          <div key={z} style={{background:N,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
            <p style={{margin:"0 0 4px",fontSize:24,fontWeight:800,color:GL}}>{c}</p>
            <p style={{margin:0,fontSize:FS.sm,color:"#9AB0CC"}}>{z}</p>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search state, company..."/>
        <FilterPills options={["West","South","North","East","NE"]} selected={zone} onChange={setZone}/>
      </div>
      <Table cols={["State / UT","Generation Company","HQ / Address","Pincode","Zone"]} rows={filtered.map(g=>[
        <span style={{fontWeight:600,fontSize:FS.base}}>{g.state}</span>,
        <strong style={{color:N,fontSize:FS.base}}>{g.company}</strong>,
        <span style={{fontSize:FS.sm}}>{g.address}</span>,
        <span style={{color:GD,fontSize:FS.sm}}>{g.pin}</span>,
        <Badge text={g.zone} color={ZONE_COL[g.zone]||GD} textColor={W}/>
      ])}/>
    </div>
  );
}

function NodalAgencies(){
  const [search,setSearch]=useState(""); const [zone,setZone]=useState("All");
  const filtered=useMemo(()=>NODAL_AGENCIES.filter(a=>(zone==="All"||a.zone===zone)&&(!search||[a.state,a.agency].join(" ").toLowerCase().includes(search.toLowerCase()))),[search,zone]);
  const zC=["West","South","North","East","NE"].reduce((a,z)=>({...a,[z]:NODAL_AGENCIES.filter(n=>n.zone===z).length}),{});
  return(
    <div>
      <SectionHeader title="Nodal Renewable Power Agencies (All States/UTs)" subtitle="State-level nodal agencies for renewable energy — mandate solar/wind park substation transformers, all ≥33 kV" count={`${NODAL_AGENCIES.length} Agencies`}/>
      <div style={{background:"#E8F5E9",border:"1px solid #2E7D32",borderRadius:8,padding:"12px 18px",marginBottom:20,fontSize:FS.base}}>
        <strong>Why Nodal Agencies matter:</strong> Every large solar/wind project has EHV substations with power transformers. State Nodal Agencies specify transformer standards and influence procurement. They are also the key contacts for SECI-funded renewable projects. The CEA Advisory covers all 33 kV+ transformers in these projects.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:22}}>
        {Object.entries(zC).map(([z,c])=>(
          <div key={z} style={{background:OW,border:`1px solid ${GR}`,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
            <p style={{margin:"0 0 4px",fontSize:24,fontWeight:800,color:N}}>{c}</p>
            <p style={{margin:0,fontSize:FS.sm,color:GD}}>{z}</p>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search state, agency..."/>
        <FilterPills options={["West","South","North","East","NE"]} selected={zone} onChange={setZone}/>
      </div>
      <Table cols={["State / UT","Nodal Agency","Full Address","Pincode","Zone"]} rows={filtered.map(a=>[
        <span style={{fontWeight:600,fontSize:FS.base}}>{a.state}</span>,
        <strong style={{color:N,fontSize:FS.base}}>{a.agency}</strong>,
        <span style={{fontSize:FS.sm}}>{a.address}</span>,
        <span style={{color:GD,fontSize:FS.sm}}>{a.pin}</span>,
        <Badge text={a.zone} color={ZONE_COL[a.zone]||GD} textColor={W}/>
      ])}/>
    </div>
  );
}

function EPCCompanies(){
  const [tier,setTier]=useState("t1"); const [search,setSearch]=useState("");
  const fT1=useMemo(()=>EPC_T1.filter(m=>!search||[m.name,m.location,m.segments].join(" ").toLowerCase().includes(search.toLowerCase())),[search]);
  const fT2=useMemo(()=>EPC_T2.filter(m=>!search||[m.name,m.location,m.segments].join(" ").toLowerCase().includes(search.toLowerCase())),[search]);
  const fT3=useMemo(()=>EPC_T3.filter(m=>!search||[m.name,m.location,m.segments].join(" ").toLowerCase().includes(search.toLowerCase())),[search]);
  return(
    <div>
      <SectionHeader title="EPC & Infrastructure Companies" subtitle="Substation EPC contractors specify transformer oil — engage to embed ester oil specification in project tendering" count={`${EPC_T1.length+EPC_T2.length+EPC_T3.length} Companies`}/>
      <div style={{background:"#FFF8E7",border:`1px solid ${G}`,borderRadius:8,padding:"12px 18px",marginBottom:18,fontSize:FS.base}}>
        <strong>EPC Strategy:</strong> EPC companies win substation turnkey contracts and often specify the transformer oil. Embedding ester oil spec in their standard designs creates a pull-through effect — every project they execute becomes an ester oil opportunity. L&T, KEC, KPIL and Techno Electric are the highest leverage targets.
      </div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {[["t1",`Tier 1 — Mega Cap >${"₹"}10,000 Cr (${EPC_T1.length})`],["t2",`Tier 2 — Mid Cap (${EPC_T2.length})`],["t3",`Tier 3 — Niche/Regional (${EPC_T3.length})`]].map(([id,label])=>(
          <button key={id} onClick={()=>setTier(id)} style={{padding:"9px 18px",borderRadius:6,border:`1px solid ${tier===id?N:GR}`,background:tier===id?N:W,color:tier===id?W:GD,fontSize:FS.base,cursor:"pointer",fontWeight:tier===id?700:400}}>{label}</button>
        ))}
        <div style={{marginLeft:"auto"}}><SearchBar value={search} onChange={setSearch} placeholder="Search company, location, segment..."/></div>
      </div>
      {tier==="t1"&&<Table cols={["Company","Location","Key Segments","Website"]} rows={fT1.map(m=>[
        <strong style={{color:N,fontSize:FS.base}}>{m.name}</strong>,
        <span style={{fontSize:FS.base}}>{m.location}</span>,
        <span style={{fontSize:FS.base,lineHeight:1.6}}>{m.segments}</span>,
        <a href={`https://${m.website}`} target="_blank" rel="noreferrer" style={{color:G,fontSize:FS.sm}}>{m.website}</a>
      ])}/>}
      {tier==="t2"&&<Table cols={["Company","Location","Key Segments","Website"]} rows={fT2.map(m=>[
        <strong style={{color:N,fontSize:FS.base}}>{m.name}</strong>,
        <span style={{fontSize:FS.base}}>{m.location}</span>,
        <span style={{fontSize:FS.base,lineHeight:1.6}}>{m.segments}</span>,
        <a href={`https://${m.website}`} target="_blank" rel="noreferrer" style={{color:G,fontSize:FS.sm}}>{m.website}</a>
      ])}/>}
      {tier==="t3"&&<Table cols={["Company","Location","Key Segments","Website"]} rows={fT3.map(m=>[
        <strong style={{color:N,fontSize:FS.base}}>{m.name}</strong>,
        <span style={{fontSize:FS.base}}>{m.location}</span>,
        <span style={{fontSize:FS.base,lineHeight:1.6}}>{m.segments}</span>,
        <a href={`https://${m.website}`} target="_blank" rel="noreferrer" style={{color:G,fontSize:FS.sm}}>{m.website}</a>
      ])}/>}
    </div>
  );
}

function Manufacturers(){
  const [tier,setTier]=useState("t1"); const [search,setSearch]=useState("");
  const [tracking,setTracking]=useLocalStorage("track_mfr",{});
  const fT1=useMemo(()=>MANUFACTURERS_T1.filter(m=>!search||[m.name,m.location,m.products,m.clients||""].join(" ").toLowerCase().includes(search.toLowerCase())),[search]);
  const fT2=useMemo(()=>MANUFACTURERS_T2.filter(m=>!search||[m.name,m.location,m.products,m.clients||""].join(" ").toLowerCase().includes(search.toLowerCase())),[search]);
  const fT3=useMemo(()=>MANUFACTURERS_T3.filter(m=>!search||[m.name,m.location,m.products].join(" ").toLowerCase().includes(search.toLowerCase())),[search]);
  const total=MANUFACTURERS_T1.length+MANUFACTURERS_T2.length+MANUFACTURERS_T3.length;
  return(
    <div>
      <SectionHeader title="Transformer Manufacturers (33 kV & Above)" subtitle="Confirmation letters to ALL tiers by Day 14 | Factory visits Tier 1 by Day 45 | IEEMA engagement Day 70–90" count={`${total} OEMs`}/>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {[["t1",`Tier 1 — Critical Priority (${MANUFACTURERS_T1.length})`],["t2",`Tier 2 — Mid-Scale (${MANUFACTURERS_T2.length})`],["t3",`Tier 3 — Regional (${MANUFACTURERS_T3.length})`]].map(([id,label])=>(
          <button key={id} onClick={()=>setTier(id)} style={{padding:"9px 18px",borderRadius:6,border:`1px solid ${tier===id?N:GR}`,background:tier===id?N:W,color:tier===id?W:GD,fontSize:FS.base,cursor:"pointer",fontWeight:tier===id?700:400}}>{label}</button>
        ))}
        <div style={{marginLeft:"auto"}}><SearchBar value={search} onChange={setSearch} placeholder="Search manufacturer, location, product..."/></div>
      </div>

      {tier==="t1"&&<>
        <div style={{background:"#FFF8E7",border:`1px solid ${G}`,borderRadius:8,padding:"13px 18px",marginBottom:14,fontSize:FS.base}}>
          <strong>Tier 1 Protocol:</strong> Personal factory visit | Complimentary trial quantities (33 kV+ units) | Half-day IS/IEC technical seminar | BOM specification inclusion request
        </div>
        <Table cols={["Status","Manufacturer","Comment","Location","Voltage","Key Products","Window"]} rows={fT1.map(m=>{const k="m1_"+m.name;return[
          <StatusBall id={k} tracking={tracking} setTracking={setTracking}/>,
          <strong style={{color:N,fontSize:FS.base}}>{m.name}</strong>,
          <CommentBox id={k} tracking={tracking} setTracking={setTracking}/>,
          <span style={{fontSize:FS.base}}>{m.location}</span>,
          <Badge text={m.voltageRange} color={OW} textColor={INK}/>,
          <span style={{fontSize:FS.sm,lineHeight:1.6}}>{m.products}</span>,
          <Badge text={m.window} color={N} textColor={W}/>
        ];})}/>
      </>}

      {tier==="t2"&&<>
        <div style={{background:OW,border:`1px solid ${GR}`,borderRadius:8,padding:"13px 18px",marginBottom:14,fontSize:FS.base}}>
          <strong>Tier 2 Protocol:</strong> Factory visit + trial quantity offer + BOM specification request | Days 40–70 | Coordinate with nearby Tier-1 OEM and utility visits for efficiency
        </div>
        <Table cols={["Status","Manufacturer","Comment","Location","Voltage","Key Products","Window"]} rows={fT2.map(m=>{const k="m2_"+m.name;return[
          <StatusBall id={k} tracking={tracking} setTracking={setTracking}/>,
          <strong style={{color:N,fontSize:FS.base}}>{m.name}</strong>,
          <CommentBox id={k} tracking={tracking} setTracking={setTracking}/>,
          <span style={{fontSize:FS.base}}>{m.location}</span>,
          <Badge text={m.voltageRange} color={OW} textColor={INK}/>,
          <span style={{fontSize:FS.base,lineHeight:1.6}}>{m.products}{m.clients?<><br/><span style={{color:GD,fontSize:FS.sm}}>{m.clients}</span></>:null}</span>,
          <Badge text={m.window} color={N} textColor={W}/>
        ];})}/>
      </>}

      {tier==="t3"&&<>
        <div style={{background:OW,border:`1px solid ${GR}`,borderRadius:8,padding:"13px 18px",marginBottom:14,fontSize:FS.base}}>
          <strong>Tier 3 Protocol:</strong> Confirmation letter (Annexure A) dispatched by Day 14 | Follow-up calls Day 60–90 | Schedule factory visits based on positive responses | Regional DISCOM suppliers
        </div>
        <Table cols={["Status","Manufacturer","Comment","Location","Voltage","Key Products","Window"]} rows={fT3.map(m=>{const k="m3_"+m.name;return[
          <StatusBall id={k} tracking={tracking} setTracking={setTracking}/>,
          <strong style={{color:N,fontSize:FS.base}}>{m.name}</strong>,
          <CommentBox id={k} tracking={tracking} setTracking={setTracking}/>,
          <span style={{fontSize:FS.base}}>{m.location}</span>,
          <Badge text={m.voltageRange} color={OW} textColor={INK}/>,
          <span style={{fontSize:FS.base,lineHeight:1.6}}>{m.products}</span>,
          <Badge text={m.window} color={N} textColor={W}/>
        ];})}/>
        <div style={{marginTop:18,background:N,borderRadius:8,padding:"16px 20px"}}>
          <p style={{margin:"0 0 6px",fontWeight:700,color:GL,fontSize:FS.md}}>IEEMA DG Engagement — Days 70–90</p>
          <p style={{margin:0,fontSize:FS.base,color:W,lineHeight:1.65}}>IEEMA DG is a direct advisory addressee. Request speaking slot at next Transformer Division meeting — one presentation reaches the entire industry simultaneously. Also request IEEMA to circulate the CEA Advisory to all member manufacturers as a zero-cost multiplier.</p>
        </div>
      </>}
    </div>
  );
}

function KPI(){
  const [statuses,setStatuses]=useLocalStorage("track_kpi",KPIS.map(()=>0));
  const labels=["Not Started","In Progress","Completed"];
  const colors=[GD,G,"#2E7D32"];
  const cats=[...new Set(KPIS.map(k=>k.category))];
  const completed=statuses.filter(s=>s===2).length;
  const inProgress=statuses.filter(s=>s===1).length;
  return(
    <div>
      <SectionHeader title="KPI Scorecard — 120 Day Performance Targets" subtitle="Click status to cycle: Not Started → In Progress → Completed | Review gates: Day 30 / 60 / 90 / 120" count={`${KPIS.length} KPIs`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
        <div style={{background:W,border:`1px solid ${GR}`,borderRadius:8,padding:"16px 20px",textAlign:"center"}}><p style={{margin:"0 0 5px",fontSize:36,fontWeight:800,color:GD}}>{KPIS.length-completed-inProgress}</p><p style={{margin:0,fontSize:FS.md,color:GD}}>Not Started</p></div>
        <div style={{background:"#FFF8E7",border:`1px solid ${G}`,borderRadius:8,padding:"16px 20px",textAlign:"center"}}><p style={{margin:"0 0 5px",fontSize:36,fontWeight:800,color:G}}>{inProgress}</p><p style={{margin:0,fontSize:FS.md,color:GD}}>In Progress</p></div>
        <div style={{background:"#E8F5E9",border:"1px solid #2E7D32",borderRadius:8,padding:"16px 20px",textAlign:"center"}}><p style={{margin:"0 0 5px",fontSize:36,fontWeight:800,color:"#2E7D32"}}>{completed}</p><p style={{margin:0,fontSize:FS.md,color:GD}}>Completed</p></div>
      </div>
      {cats.map((cat,ci)=>(
        <div key={ci} style={{marginBottom:24}}>
          <p style={{margin:"0 0 10px",fontWeight:700,fontSize:FS.lg,color:N,borderLeft:`4px solid ${G}`,paddingLeft:12}}>{cat}</p>
          {KPIS.map((kpi,ki)=>kpi.category!==cat?null:(
            <div key={ki} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 18px",background:ki%2===0?W:ALT,borderRadius:6,marginBottom:5,border:`1px solid ${GR}`}}>
              <span style={{flex:1,fontSize:FS.base,color:INK,lineHeight:1.55}}>{kpi.kpi}</span>
              <span style={{fontSize:FS.base,color:GD,minWidth:230}}>{kpi.target}</span>
              <Badge text={`Gate: ${kpi.gate}`} color={OW} textColor={GD}/>
              <button onClick={()=>setStatuses(s=>{const n=[...s];n[ki]=(n[ki]+1)%3;return n;})}
                style={{padding:"6px 18px",borderRadius:16,border:"none",cursor:"pointer",fontSize:FS.base,fontWeight:700,background:colors[statuses[ki]],color:W,minWidth:125}}>
                {labels[statuses[ki]]}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Risk(){
  const iC={"High":"#C62828","Medium":"#E65100","Low":"#2E7D32"};
  const lC={"High":G,"Medium":NM,"Low":GD};
  return(
    <div>
      <SectionHeader title="Risk & Mitigation Framework" subtitle="7 key risks with pre-emptive mitigation strategies" count="7 Risks"/>
      {RISKS.map((r,i)=>(
        <div key={i} style={{background:i%2===0?W:ALT,borderRadius:8,padding:"16px 20px",marginBottom:10,border:`1px solid ${GR}`}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:10}}>
            <p style={{margin:0,fontWeight:700,fontSize:FS.md,color:N,lineHeight:1.45,flex:1}}>{r.risk}</p>
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <Badge text={`Likelihood: ${r.likelihood}`} color={lC[r.likelihood]} textColor={W}/>
              <Badge text={`Impact: ${r.impact}`} color={iC[r.impact]} textColor={W}/>
            </div>
          </div>
          <p style={{margin:0,fontSize:FS.base,color:INK,lineHeight:1.65}}><span style={{fontWeight:700,color:GD}}>Mitigation: </span>{r.mitigation}</p>
        </div>
      ))}
    </div>
  );
}

function Training(){
  const days=[
    {day:"Day 1",title:"Foundations & Fluid Selection",items:["Chemical & molecular differences: mineral oil vs natural ester vs synthetic ester","Flash point: Natural ester >320°C vs mineral oil ~145°C | Fire point: >350°C vs ~160°C","Moisture tolerance: Natural ester holds 1,100 ppm vs 55 ppm for mineral oil — 5–8x longer paper life","Environmental: OECD 301B biodegradability >98% for natural ester in 28 days","Life cycle cost (LCC) analysis: net saving over transformer life despite 2–3x upfront premium"]},
    {day:"Day 2",title:"Design, Integration & Manufacturing",items:["Thermal management: natural ester viscosity 3–4x higher; may run 5–8°C hotter at operating temperature","Radiator and fan configuration adjustments to maintain IEEE hot-spot rise limit of 65°C","Dielectric: smoother electrode surfaces needed; 10–15% lower impulse strength with sharp edges","Material compatibility: nitrile / Viton gaskets, adhesives, paints must be verified before use","Vacuum filling: <1 mbar for 500 kV equipment; deep impregnation; settling time before re-energization"]},
    {day:"Day 3",title:"Maintenance, Diagnostics & Retrofilling",items:["Routine tests per IEC 62975 and IS 16659 — ester-specific protocols differ from mineral oil","DGA interpretation using Duval Pentagons adapted for esters — mineral oil charts do not apply","Stray gassing: natural esters generate 200–300 ppm ethane by chemical structure — NOT a fault","Moisture monitoring: 100 ppm in natural ester = healthy (same level in mineral oil = critical failure)","Retrofilling: drain → flush with ester → vacuum fill <5 mbar → Karl Fischer test → re-energize"]},
  ];
  return(
    <div>
      <SectionHeader title="Education & Training Plan" subtitle="3-Day Technical Curriculum + Consultative Sales Training + Field Application Support"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:30}}>
        {days.map((d,i)=>(
          <div key={i} style={{borderRadius:8,overflow:"hidden",border:`1px solid ${GR}`}}>
            <div style={{background:N,padding:"15px 18px"}}>
              <p style={{margin:"0 0 4px",fontSize:FS.sm,color:GL,fontWeight:700,letterSpacing:1}}>{d.day}</p>
              <p style={{margin:0,fontWeight:800,fontSize:FS.lg,color:W,lineHeight:1.3}}>{d.title}</p>
            </div>
            <div style={{padding:"16px 18px",background:W}}>
              {d.items.map((item,j)=>(
                <div key={j} style={{display:"flex",gap:10,marginBottom:14}}>
                  <span style={{width:8,height:8,background:G,borderRadius:"50%",marginTop:8,flexShrink:0}}/>
                  <span style={{fontSize:FS.base,color:INK,lineHeight:1.65}}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{background:N,borderRadius:8,padding:"18px 22px"}}>
        <p style={{margin:"0 0 8px",fontWeight:700,color:GL,fontSize:FS.lg}}>Field Application Engineer Deployment</p>
        <p style={{margin:0,fontSize:FS.base,color:W,lineHeight:1.7}}>Deploy FAEs at Tier-1 OEM factory trials and key utility pilot sites. Provide free handling manuals, certified maintenance training, and DGA interpretation support. Converting technical inertia into advocacy dramatically accelerates empanelment decisions and creates internal champions within each organisation.</p>
      </div>
    </div>
  );
}

// ── NAV & ROOT ────────────────────────────────────────────────────────────────

const NAV=[
  {id:"dashboard",label:"Dashboard",icon:"📊"},
  {id:"advisory",label:"Regulatory Trigger",icon:"📋"},
  {id:"cea",label:"CEA Offices",icon:"🏛️"},
  {id:"psu",label:"PSU Utilities",icon:"⚡"},
  {id:"transcos",label:"State Transcos",icon:"🔌"},
  {id:"discoms",label:"DISCOMs",icon:"🏘️"},
  {id:"generation",label:"Generation Cos.",icon:"🔋"},
  {id:"nodal",label:"Nodal RE Agencies",icon:"☀️"},
  {id:"epc",label:"EPC Companies",icon:"🏗️"},
  {id:"manufacturers",label:"Manufacturers",icon:"🏭"},
  {id:"kpi",label:"KPI Scorecard",icon:"🎯"},
  {id:"risk",label:"Risk Framework",icon:"⚠️"},
  {id:"training",label:"Training Plan",icon:"🎓"},
];

// ── AUTH ──────────────────────────────────────────────────────────────────────

const VALID_USER = "skoley@savita.com";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getTodayPassword() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const monthLetter = MONTHS[now.getMonth()][0];
  return monthLetter + dd + mm + yyyy;
}

function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (user.trim().toLowerCase() !== VALID_USER) { setError("Invalid username"); return; }
    if (pass !== getTodayPassword()) { setError("Invalid password"); return; }
    sessionStorage.setItem("sotl_auth", "1");
    onLogin();
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg, ${N} 0%, #0D1F38 100%)`, fontFamily:"system-ui,sans-serif" }}>
      <div style={{ width:420, background:W, borderRadius:16, boxShadow:"0 20px 60px rgba(0,0,0,0.3)", overflow:"hidden" }}>
        <div style={{ background:N, padding:"32px 36px 28px", textAlign:"center" }}>
          <p style={{ margin:"0 0 4px", fontSize:11, fontWeight:700, color:GL, letterSpacing:3, textTransform:"uppercase" }}>Savita Oil Technologies</p>
          <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:W }}>Ester Oil Market Entry</h1>
          <p style={{ margin:0, fontSize:13, color:"#7A96B4" }}>90–120 Day Plan | FY27 | Confidential</p>
        </div>
        <form onSubmit={handleSubmit} style={{ padding:"32px 36px 36px" }}>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", marginBottom:6, fontSize:13, fontWeight:700, color:GD, textTransform:"uppercase", letterSpacing:1 }}>Username</label>
            <input value={user} onChange={e => setUser(e.target.value)} type="email" placeholder="Enter your email"
              style={{ width:"100%", padding:"12px 14px", border:`2px solid ${GR}`, borderRadius:8, fontSize:15, outline:"none", background:OW, color:INK, boxSizing:"border-box", transition:"border 0.2s" }}
              onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor=GR} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ display:"block", marginBottom:6, fontSize:13, fontWeight:700, color:GD, textTransform:"uppercase", letterSpacing:1 }}>Password</label>
            <div style={{ position:"relative" }}>
              <input value={pass} onChange={e => setPass(e.target.value)} type={showPass ? "text" : "password"} placeholder="Enter password"
                style={{ width:"100%", padding:"12px 44px 12px 14px", border:`2px solid ${GR}`, borderRadius:8, fontSize:15, outline:"none", background:OW, color:INK, boxSizing:"border-box", transition:"border 0.2s" }}
                onFocus={e => e.target.style.borderColor=G} onBlur={e => e.target.style.borderColor=GR} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:18, color:GD, padding:4 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {error && (
            <div style={{ background:"#FFF0F0", border:"1px solid #E53935", borderRadius:6, padding:"10px 14px", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>⚠️</span>
              <span style={{ fontSize:14, color:"#C62828", fontWeight:600 }}>{error}</span>
            </div>
          )}
          <button type="submit"
            style={{ width:"100%", padding:"14px 20px", background:N, color:W, border:"none", borderRadius:8, fontSize:16, fontWeight:700, cursor:"pointer", transition:"all 0.2s", letterSpacing:0.5 }}
            onMouseEnter={e => e.target.style.background=NM}
            onMouseLeave={e => e.target.style.background=N}>
            🔐 Sign In
          </button>
          <p style={{ margin:"18px 0 0", fontSize:12, color:GD, textAlign:"center", lineHeight:1.5 }}>
            Authorised personnel only · CEA Advisory I/64705/2026
          </p>
        </form>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────

function MainDashboard() {
  const [active,setActive]=useState("dashboard");
  const pages={dashboard:<Dashboard/>,advisory:<Advisory/>,cea:<CEAOffices/>,psu:<PSUUtilities/>,transcos:<StateTranscos/>,discoms:<DISCOMs/>,generation:<Generation/>,nodal:<NodalAgencies/>,epc:<EPCCompanies/>,manufacturers:<Manufacturers/>,kpi:<KPI/>,risk:<Risk/>,training:<Training/>};
  const handleLogout = () => { sessionStorage.removeItem("sotl_auth"); window.location.reload(); };
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"system-ui,sans-serif",background:OW}}>
      <div style={{width:234,minWidth:234,background:N,display:"flex",flexDirection:"column",overflowY:"auto",boxShadow:"2px 0 8px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"22px 18px 16px",borderBottom:`1px solid ${NM}`}}>
          <p style={{margin:"0 0 3px",fontSize:11,fontWeight:700,color:GL,letterSpacing:2,textTransform:"uppercase"}}>Savita Oil Technologies</p>
          <p style={{margin:"0 0 6px",fontSize:FS.md,fontWeight:800,color:W,lineHeight:1.3}}>Ester Oil Market Entry</p>
          <p style={{margin:0,fontSize:12,color:"#7A96B4"}}>90–120 Day Plan | FY27</p>
        </div>
        <div style={{padding:"10px 0",flex:1}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setActive(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:11,padding:"12px 18px",background:active===n.id?"rgba(184,150,46,0.18)":"transparent",border:"none",borderLeft:active===n.id?`3px solid ${G}`:"3px solid transparent",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
              <span style={{fontSize:18}}>{n.icon}</span>
              <span style={{fontSize:FS.base,fontWeight:active===n.id?700:400,color:active===n.id?W:"#9AB0CC"}}>{n.label}</span>
            </button>
          ))}
        </div>
        <div style={{padding:"10px 18px",borderTop:`1px solid ${NM}`}}>
          <button onClick={handleLogout} style={{width:"100%",padding:"9px 14px",background:"rgba(198,40,40,0.15)",border:"1px solid rgba(198,40,40,0.3)",borderRadius:6,color:"#E57373",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={e => { e.target.style.background="rgba(198,40,40,0.3)"; }} onMouseLeave={e => { e.target.style.background="rgba(198,40,40,0.15)"; }}>
            🚪 Sign Out
          </button>
        </div>
        <div style={{padding:"10px 18px 14px"}}>
          <p style={{margin:"0 0 3px",fontSize:12,color:"#7A96B4"}}>CEA Advisory</p>
          <p style={{margin:0,fontSize:11,color:"#5A7A9A",lineHeight:1.4}}>I/64705/2026 | 15 May 2026</p>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"32px 38px"}}>
        {pages[active]}
      </div>
    </div>
  );
}

export default function App(){
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("sotl_auth") === "1");
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <MainDashboard />;
}
