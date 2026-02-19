import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Download,
  Copy,
  Check,
  ChevronDown,
  Dna,
  Stethoscope,
  BrainCircuit,
  BarChart3,
  Zap,
} from "lucide-react";
import { PharmaGuardResult } from "@/types/pharmacogenomics";
import ExplainableAIModal from "./ExplainableAIModal";
import GenomicBattlefield from "./GenomicBattlefield";

interface ResultsPanelProps {
  results: PharmaGuardResult[];
}

function RiskBadge({ label, onClick }: { label: string; onClick: () => void }) {
  const cls =
    label === "Safe"
      ? "risk-safe"
      : label === "Adjust Dosage"
      ? "risk-adjust"
      : label === "Toxic"
      ? "risk-toxic"
      : label === "Ineffective"
      ? "risk-ineffective"
      : "risk-adjust";

  return (
    <button
      onClick={onClick}
      className={`${cls} px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer transition-transform hover:scale-105 active:scale-95`}
    >
      {label}
    </button>
  );
}

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          {title}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 text-sm space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ result }: { result: PharmaGuardResult }) {
  const [showAI, setShowAI] = useState(false);
  const [showBattlefield, setShowBattlefield] = useState(false);
  const [copied, setCopied] = useState(false);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.patient_id}_${result.drug}_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyJSON = async () => {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const p = result.pharmacogenomic_profile;
  const c = result.clinical_recommendation;
  const e = result.llm_generated_explanation;
  const q = result.quality_metrics;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {result.drug}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {result.patient_id} · {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge
            label={result.risk_assessment.risk_label}
            onClick={() => setShowAI(true)}
          />
        </div>
      </div>

      {/* Accordions */}
      <div className="space-y-2">
        <AccordionSection
          title="Pharmacogenomic Profile"
          icon={<Dna className="w-4 h-4 text-primary" />}
          defaultOpen
        >
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Primary Gene</span>
              <p className="font-mono font-bold text-primary">{p.primary_gene}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Diplotype</span>
              <p className="font-mono font-bold">{p.diplotype}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Phenotype</span>
              <p className="font-bold">{p.phenotype}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Variants Detected</span>
              <p className="font-mono">{p.detected_variants.length}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">Detected rsIDs:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {p.detected_variants.map((v, i) => (
                <span key={i} className="text-xs font-mono bg-muted px-2 py-0.5 rounded-full">
                  {v.rsid}
                </span>
              ))}
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          title="Clinical Recommendation"
          icon={<Stethoscope className="w-4 h-4 text-accent" />}
        >
          <p className="text-muted-foreground text-xs">
            Source: <span className="text-primary font-medium">{c.guideline_source}</span>
          </p>
          <p className="text-foreground">{c.recommendation_text}</p>
          {c.alternative_options.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Alternatives:</span>
              <ul className="list-disc list-inside text-xs text-foreground/80 mt-1">
                {c.alternative_options.map((alt, i) => (
                  <li key={i}>{alt}</li>
                ))}
              </ul>
            </div>
          )}
        </AccordionSection>

        <AccordionSection
          title="AI Explanation"
          icon={<BrainCircuit className="w-4 h-4 text-accent" />}
        >
          {e ? (
            <div className="space-y-3">
              <div>
                <span className="text-xs text-muted-foreground font-semibold">Summary</span>
                <p>{e.summary}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-semibold">Mechanism</span>
                <p>{e.mechanism}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-semibold">Clinical Impact</span>
                <p>{e.clinical_impact}</p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <span className="text-xs text-primary font-semibold">Patient-Friendly</span>
                <p className="mt-1">{e.patient_friendly_explanation}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">Generating AI explanation...</p>
          )}
        </AccordionSection>

        <AccordionSection
          title="Quality Metrics"
          icon={<BarChart3 className="w-4 h-4 text-primary" />}
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-safe">
                {q.vcf_parsing_success ? "✓" : "✗"}
              </div>
              <span className="text-xs text-muted-foreground">VCF Parse</span>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {(q.annotation_completeness * 100).toFixed(0)}%
              </div>
              <span className="text-xs text-muted-foreground">Annotation</span>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent">
                {(q.rule_engine_confidence * 100).toFixed(0)}%
              </div>
              <span className="text-xs text-muted-foreground">Confidence</span>
            </div>
          </div>
        </AccordionSection>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={downloadJSON}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          <Download className="w-4 h-4" /> Download JSON
        </button>
        <button
          onClick={copyJSON}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-safe" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={() => setShowBattlefield(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors ml-auto"
        >
          <Zap className="w-4 h-4" /> View Full Simulation
        </button>
      </div>

      {/* Modals */}
      <ExplainableAIModal
        open={showAI}
        onClose={() => setShowAI(false)}
        result={result}
      />
      <GenomicBattlefield
        open={showBattlefield}
        onClose={() => setShowBattlefield(false)}
        result={result}
      />
    </motion.div>
  );
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Risk Assessment Results
      </h2>
      {results.map((r, i) => (
        <ResultCard key={`${r.drug}-${i}`} result={r} />
      ))}
    </div>
  );
}
