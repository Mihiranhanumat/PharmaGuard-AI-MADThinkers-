import { useState } from "react";
import { Pill, AlertCircle } from "lucide-react";
import { SUPPORTED_DRUGS } from "@/types/pharmacogenomics";

interface DrugInputProps {
  onSubmit: (drugs: string[]) => void;
  disabled?: boolean;
}

export default function DrugInput({ onSubmit, disabled }: DrugInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const drugs = value
      .split(",")
      .map((d) => d.trim().toUpperCase())
      .filter(Boolean);

    if (drugs.length === 0) {
      setError("Please enter at least one drug name");
      return;
    }

    const invalid = drugs.filter(
      (d) => !SUPPORTED_DRUGS.includes(d as any)
    );
    if (invalid.length > 0) {
      setError(`Unsupported: ${invalid.join(", ")}. Supported: ${SUPPORTED_DRUGS.join(", ")}`);
      return;
    }

    setError("");
    onSubmit(drugs);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Pill className="w-5 h-5 text-primary" />
        Drug Selection
      </h2>

      <div className="space-y-3">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="e.g. CODEINE, WARFARIN, CLOPIDOGREL"
          disabled={disabled}
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-sm disabled:opacity-50"
        />

        <p className="text-xs text-muted-foreground">
          Enter comma-separated drug names. Supported:{" "}
          <span className="text-primary/80 font-mono">
            {SUPPORTED_DRUGS.join(", ")}
          </span>
        </p>

        {error && (
          <div className="flex items-start gap-2 text-toxic text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {disabled ? "Processing..." : "Analyze Risk"}
        </button>
      </div>
    </div>
  );
}
