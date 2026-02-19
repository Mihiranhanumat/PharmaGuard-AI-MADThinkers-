import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PharmaGuardResult } from "@/types/pharmacogenomics";

interface GenomicBattlefieldProps {
  open: boolean;
  onClose: () => void;
  result: PharmaGuardResult;
}

function EnzymeBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function GenomicBattlefield({ open, onClose, result }: GenomicBattlefieldProps) {
  const p = result.pharmacogenomic_profile;
  const phenotype = p.phenotype;

  const efficiencyMap: Record<string, number> = {
    PM: 10, IM: 40, NM: 85, RM: 95, URM: 100, Unknown: 50,
  };
  const patientEff = efficiencyMap[phenotype] || 50;
  const normalEff = 85;

  const riskLabel = result.risk_assessment.risk_label;
  const isRisky = riskLabel === "Toxic" || riskLabel === "Ineffective";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col"
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold glow-text">
              Genomic Risk Battlefield™
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-8">
            {/* Drug entering body */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl"
              >
                💊
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-muted-foreground"
              >
                <span className="font-bold text-foreground">{result.drug}</span> entering hepatic metabolism
              </motion.p>

              {/* Animated path */}
              <motion.div className="flex items-center justify-center gap-2 py-4">
                {["💊", "→", "🧬", "→", "⚗️", "→", isRisky ? "⚠️" : "✅"].map((item, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.2 }}
                    className="text-2xl"
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Liver enzyme interaction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Liver Enzyme Interaction — {p.primary_gene}
              </h3>

              {/* SVG visualization */}
              <div className="flex items-center justify-center py-6">
                <svg width="300" height="120" viewBox="0 0 300 120" className="overflow-visible">
                  {/* Liver shape */}
                  <motion.path
                    d="M50,60 Q50,20 100,20 Q150,20 150,40 Q150,20 200,20 Q250,20 250,60 Q250,100 150,100 Q50,100 50,60 Z"
                    fill="none"
                    stroke="hsl(175, 75%, 42%)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1.5 }}
                  />
                  {/* Enzyme molecules */}
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={100 + i * 25}
                      cy={55 + (i % 2 === 0 ? -10 : 10)}
                      r={patientEff > 50 ? 8 : 4}
                      fill={isRisky ? "hsl(0, 72%, 51%)" : "hsl(175, 75%, 42%)"}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: patientEff > i * 20 ? 0.8 : 0.2, scale: 1 }}
                      transition={{ delay: 2 + i * 0.2 }}
                    />
                  ))}
                  <motion.text
                    x="150"
                    y="115"
                    textAnchor="middle"
                    fill="hsl(215, 20%, 55%)"
                    fontSize="11"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                  >
                    {p.primary_gene} enzyme activity
                  </motion.text>
                </svg>
              </div>
            </motion.div>

            {/* Side-by-side comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="glass-card p-5 space-y-4">
                <h4 className="text-sm font-bold text-safe text-center">Normal Metabolizer</h4>
                <EnzymeBar label="Enzyme Efficiency" pct={normalEff} color="hsl(160, 70%, 42%)" />
                <EnzymeBar label="Drug Clearance" pct={80} color="hsl(175, 75%, 42%)" />
                <EnzymeBar label="Toxicity Risk" pct={10} color="hsl(160, 70%, 42%)" />
              </div>
              <div className={`glass-card p-5 space-y-4 ${isRisky ? "glow-border" : ""}`}>
                <h4 className={`text-sm font-bold text-center ${isRisky ? "text-toxic" : "text-safe"}`}>
                  Patient ({phenotype})
                </h4>
                <EnzymeBar
                  label="Enzyme Efficiency"
                  pct={patientEff}
                  color={isRisky ? "hsl(0, 72%, 51%)" : "hsl(160, 70%, 42%)"}
                />
                <EnzymeBar
                  label="Drug Clearance"
                  pct={phenotype === "PM" ? 15 : phenotype === "IM" ? 45 : 80}
                  color={isRisky ? "hsl(45, 90%, 55%)" : "hsl(175, 75%, 42%)"}
                />
                <EnzymeBar
                  label="Toxicity Risk"
                  pct={riskLabel === "Toxic" ? 85 : riskLabel === "Adjust Dosage" ? 45 : 10}
                  color={riskLabel === "Toxic" ? "hsl(0, 72%, 51%)" : riskLabel === "Adjust Dosage" ? "hsl(45, 90%, 55%)" : "hsl(160, 70%, 42%)"}
                />
              </div>
            </motion.div>

            {/* Clinical interpretation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
              className="glass-card p-5"
            >
              <h4 className="text-sm font-semibold text-foreground mb-2">Clinical Interpretation</h4>
              <p className="text-sm text-muted-foreground">
                {result.clinical_recommendation.recommendation_text}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
