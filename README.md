# 🧬 PharmaGuard X

**AI-Powered Pharmacogenomic Risk Detection Platform**

PharmaGuard X analyzes patient genomic variants from VCF files and predicts drug response risk using pharmacogenomic rules and AI-generated clinical interpretation. The system produces explainable, structured, and clinically meaningful outputs aligned with CPIC-style logic.

---

## 🚀 Live Deployed web application URL

👉 🔗 [https://pharma-guard-ai-mad-thinkers.vercel.app](https://pharma-guard-ai-mad-thinkers.vercel.app)


---

## 🎥 LinkedIn Demo Video 

👉 [https://www.linkedin.com/posts/dharna-sharma-bb8189322_rift2026-madthinkers-hackathon-activity-7430417955944812544-tu5G?utm_source=social_share_video_v2&utm_medium=android_app&rcm=ACoAAFGKN3wBvDpLoai1OUDqCk3vLInRuRLaVA4&utm_campaign=copy_link](https://www.linkedin.com/posts/dharna-sharma-bb8189322_rift2026-madthinkers-hackathon-activity-7430417955944812544-tu5G?utm_source=social_share_video_v2&utm_medium=android_app&rcm=ACoAAFGKN3wBvDpLoai1OUDqCk3vLInRuRLaVA4&utm_campaign=copy_link)

---

## 🧠 Project Overview

PharmaGuard X is a clinical decision-support prototype that integrates genomic data and pharmacogenomic rules to predict drug safety, dosage adjustment needs, or toxicity risks.

The system:

* Parses Variant Call Format (VCF) genomic data
* Maps variants → gene → star allele → phenotype
* Applies drug-specific pharmacogenomic rules
* Generates structured clinical risk assessment
* Produces explainable AI medical summaries
* Returns standardized JSON output for downstream systems

---

## 🏗 Architecture Overview

```
User Interface (Next.js + Tailwind)
        │
        ▼
API Layer (Next.js API Routes / FastAPI)
        │
        ├── VCF Parser Engine
        ├── Pharmacogenomic Rule Engine
        ├── Confidence Scoring Module
        ├── LLM Explanation Generator
        │
        ▼
Structured JSON Response
        │
        ▼
Interactive Results Dashboard
```

### Key Components

Frontend

* File upload & validation
* Drug input processing
* Results visualization
* Explainable AI popups
* Genomic Risk Battlefield simulation

Backend

* VCF parsing engine
* Gene variant interpretation
* Rule-based risk detection
* Clinical recommendation generator
* JSON schema validator

AI Layer

* Mechanism explanation
* Clinical interpretation
* Patient-friendly summary

---

## 🧪 Supported Pharmacogenomic Genes

* CYP2D6
* CYP2C19
* CYP2C9
* SLCO1B1
* TPMT
* DPYD

---

## 💊 Supported Drugs

* CODEINE
* WARFARIN
* CLOPIDOGREL
* SIMVASTATIN
* AZATHIOPRINE
* FLUOROURACIL

---

## 🛠 Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* ShadCN UI
* Framer Motion
* Recharts

### Backend

* FastAPI or Next.js API Routes
* Python / Node.js
* Pydantic Schema Validation
* cyvcf2 (VCF parsing)

### AI Layer

* OpenAI API (explanation generation)

### Deployment

* Vercel
* GitHub (version control)

---

## ⚙ Installation Instructions

## ⚙️ Run Locally

```bash
git clone https://github.com/Mihiranhanumat/PharmaGuard-AI-MADThinkers-.git
cd PharmaGuard-AI-MADThinkers-
npm install
npm run dev

---

#### Response Schema

```
{
 "patient_id": "PATIENT_XXX",
 "drug": "DRUG_NAME",
 "timestamp": "ISO8601",
 "risk_assessment": {
   "risk_label": "",
   "confidence_score": 0.0,
   "severity": ""
 },
 "pharmacogenomic_profile": {
   "primary_gene": "",
   "diplotype": "",
   "phenotype": "",
   "detected_variants": []
 },
 "clinical_recommendation": {},
 "llm_generated_explanation": {},
 "quality_metrics": {}
}
```

---

## 💡 Usage Example

### Input

* Upload VCF file
* Enter drug name: CLOPIDOGREL

### Output

* Risk Label: Ineffective
* Phenotype: Poor Metabolizer
* Gene: CYP2C19
* Clinical Recommendation generated
* JSON report downloadable

---

## 🔥 Unique Features

* Deterministic pharmacogenomic rule engine
* Explainable AI decision trace popup
* Genomic Risk Battlefield simulation
* Structured clinical JSON output
* Confidence scoring system
* Multi-drug support
* Hackathon-compliant validation

---

## 🧑‍💻 Team Members

Mihiran Hanumat (leader)
Abhinav Rakhunde 
Dharna Sharma 
Tanmay Gargey
---

## 📌 Hackathon Compliance

✔ VCF upload validation
✔ Multi-drug text input
✔ Exact JSON schema
✔ Risk classification system
✔ Structured output
✔ User-friendly UI
✔ Error handling

---

## 📜 License

This project is developed for hackathon demonstration and research purposes.

---

## ❤️ Acknowledgements

* CPIC Pharmacogenomic Guidelines
* OpenAI API
* Pharmacogenomic Knowledge Bases

---
