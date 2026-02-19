export interface DetectedVariant {
  rsid: string;
  gene: string;
  star_allele: string;
}

export interface RiskAssessment {
  risk_label: string;
  confidence_score: number;
  severity: "none" | "low" | "moderate" | "high" | "critical";
}

export interface PharmacogenomicProfile {
  primary_gene: string;
  diplotype: string;
  phenotype: "PM" | "IM" | "NM" | "RM" | "URM" | "Unknown";
  detected_variants: DetectedVariant[];
}

export interface ClinicalRecommendation {
  guideline_source: string;
  recommendation_text: string;
  alternative_options: string[];
}

export interface LLMExplanation {
  summary: string;
  mechanism: string;
  clinical_impact: string;
  patient_friendly_explanation: string;
}

export interface QualityMetrics {
  vcf_parsing_success: boolean;
  annotation_completeness: number;
  rule_engine_confidence: number;
}

export interface PharmaGuardResult {
  patient_id: string;
  drug: string;
  timestamp: string;
  risk_assessment: RiskAssessment;
  pharmacogenomic_profile: PharmacogenomicProfile;
  clinical_recommendation: ClinicalRecommendation;
  llm_generated_explanation: LLMExplanation;
  quality_metrics: QualityMetrics;
}

export interface VCFVariant {
  chrom: string;
  pos: number;
  id: string;
  ref: string;
  alt: string;
  qual: string;
  filter: string;
  info: Record<string, string>;
  rsid?: string;
  gene?: string;
  starAllele?: string;
}

export interface VCFParseResult {
  success: boolean;
  variants: VCFVariant[];
  errors: string[];
  meta: Record<string, string>;
}

export const SUPPORTED_DRUGS = [
  "CODEINE",
  "WARFARIN",
  "CLOPIDOGREL",
  "SIMVASTATIN",
  "AZATHIOPRINE",
  "FLUOROURACIL",
] as const;

export type SupportedDrug = (typeof SUPPORTED_DRUGS)[number];
