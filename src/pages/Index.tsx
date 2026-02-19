import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Dna, Activity, Shield } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import DrugInput from "@/components/DrugInput";
import ResultsPanel from "@/components/ResultsPanel";
import ComplianceModal from "@/components/ComplianceModal";
import { VCFParseResult, PharmaGuardResult, LLMExplanation } from "@/types/pharmacogenomics";
import { runRuleEngine, addLLMExplanation } from "@/lib/rule-engine";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [vcfData, setVcfData] = useState<VCFParseResult | null>(null);
  const [results, setResults] = useState<PharmaGuardResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = useCallback(
    async (drugs: string[]) => {
      if (!vcfData) return;
      setLoading(true);
      setResults([]);

      const allResults: PharmaGuardResult[] = [];

      for (const drug of drugs) {
        const partial = runRuleEngine(vcfData.variants, drug);

        // Get LLM explanation
        let explanation: LLMExplanation;
        try {
          const { data, error } = await supabase.functions.invoke("pharma-explain", {
            body: {
              drug: partial.drug,
              gene: partial.pharmacogenomic_profile.primary_gene,
              diplotype: partial.pharmacogenomic_profile.diplotype,
              phenotype: partial.pharmacogenomic_profile.phenotype,
              risk_label: partial.risk_assessment.risk_label,
              severity: partial.risk_assessment.severity,
            },
          });

          if (error || data?.error) {
            throw new Error(data?.error || "LLM call failed");
          }

          explanation = data as LLMExplanation;
        } catch (err) {
          console.error("LLM error:", err);
          explanation = {
            summary: `${partial.drug}: ${partial.risk_assessment.risk_label} risk for ${partial.pharmacogenomic_profile.phenotype} metabolizer.`,
            mechanism: `${partial.pharmacogenomic_profile.primary_gene} ${partial.pharmacogenomic_profile.diplotype} affects ${partial.drug} metabolism.`,
            clinical_impact: `Severity: ${partial.risk_assessment.severity}. ${partial.clinical_recommendation.recommendation_text}`,
            patient_friendly_explanation: `Your genetic profile affects how your body handles ${partial.drug}. Please discuss with your healthcare provider.`,
          };
        }

        allResults.push(addLLMExplanation(partial, explanation));
      }

      setResults(allResults);
      setLoading(false);
    },
    [vcfData]
  );

  return (
    <div className="min-h-screen bg-background">
      <ComplianceModal />

      {/* Header */}
      <header className="border-b border-border bg-card/40 backdrop-blur-lg sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Dna className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                PharmaGuard <span className="glow-text">X</span>
              </h1>
              <p className="text-xs text-muted-foreground">AI Pharmacogenomic Risk Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-safe/10 border border-safe/20">
              <Activity className="w-3 h-3 text-safe" />
              <span className="text-xs font-medium text-safe">CPIC Compliant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="glow-text">Precision Medicine</span>{" "}
            <span className="text-foreground">Risk Analysis</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
            Upload a VCF file and enter drug names to generate clinically explainable
            pharmacogenomic risk assessments powered by AI.
          </p>
        </motion.div>

        {/* Input section */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FileUpload onParsed={setVcfData} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DrugInput
              onSubmit={handleAnalyze}
              disabled={!vcfData || loading}
            />
          </motion.div>
        </div>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Analyzing pharmacogenomic risk...</p>
          </motion.div>
        )}

        {/* Results */}
        <ResultsPanel results={results} />

        {/* Footer */}
        {results.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <Shield className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              Upload a VCF file and enter drug names to begin analysis
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
