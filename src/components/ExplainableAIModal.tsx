import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShieldAlert } from "lucide-react";
import { PharmaGuardResult } from "@/types/pharmacogenomics";

interface ExplainableAIModalProps {
  open: boolean;
  onClose: () => void;
  result: PharmaGuardResult;
}

export default function ExplainableAIModal({ open, onClose, result }: ExplainableAIModalProps) {
  const p = result.pharmacogenomic_profile;
  const r = result.risk_assessment;

  const steps = [
    { label: "Variant Detection", value: p.detected_variants.map((v) => v.rsid).join(", ") },
    { label: "Star Allele", value: p.detected_variants.map((v) => v.star_allele).join(", ") },
    { label: "Diplotype", value: p.diplotype },
    { label: "Phenotype", value: p.phenotype },
    { label: "Guideline Rule", value: `${result.clinical_recommendation.guideline_source} → ${result.drug}` },
    { label: "Risk Label", value: r.risk_label },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                How This Risk Was Determined
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Decision trace */}
            <div className="space-y-1 mb-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground">{step.label}</span>
                      <p className="font-mono text-sm font-semibold text-foreground truncate">
                        {step.value}
                      </p>
                    </div>
                    {i < steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-primary/50 shrink-0" />
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="ml-3 h-3 border-l-2 border-primary/20" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Primary Gene</span>
                <span className="font-mono font-bold text-primary">{p.primary_gene}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-bold">{(r.confidence_score * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Severity</span>
                <span className={`font-bold capitalize ${
                  r.severity === "critical" || r.severity === "high"
                    ? "text-toxic"
                    : r.severity === "moderate"
                    ? "text-adjust"
                    : "text-safe"
                }`}>
                  {r.severity}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
