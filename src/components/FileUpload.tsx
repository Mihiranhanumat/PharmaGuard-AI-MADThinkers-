import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, XCircle, FileText } from "lucide-react";
import { validateVCFFile, parseVCF } from "@/lib/vcf-parser";
import { VCFParseResult } from "@/types/pharmacogenomics";

interface FileUploadProps {
  onParsed: (result: VCFParseResult) => void;
}

export default function FileUpload({ onParsed }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

  const processFile = useCallback(
    async (file: File) => {
      const validation = validateVCFFile(file);
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + " KB");

      if (!validation.valid) {
        setStatus("error");
        setMessage(validation.error || "Invalid file");
        return;
      }

      try {
        const text = await file.text();
        const result = parseVCF(text);
        if (result.success) {
          setStatus("success");
          setMessage(`Parsed ${result.variants.length} variants successfully`);
          onParsed(result);
        } else {
          setStatus("error");
          setMessage(result.errors.join("; "));
        }
      } catch {
        setStatus("error");
        setMessage("Failed to read file");
      }
    },
    [onParsed]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        VCF File Upload
      </h2>

      <label
        className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
          dragOver
            ? "border-primary bg-primary/10"
            : status === "success"
            ? "border-safe bg-safe/5"
            : status === "error"
            ? "border-toxic bg-toxic/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".vcf"
          className="hidden"
          onChange={handleChange}
        />

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <Upload className="w-10 h-10 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Drag & drop a <span className="font-mono text-primary">.vcf</span> file or click to browse
              </span>
              <span className="text-xs text-muted-foreground/60">
                Max 5MB · VCF v4.2
              </span>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <CheckCircle className="w-10 h-10 text-safe" />
              <span className="text-sm text-safe font-medium">{message}</span>
              <span className="text-xs text-muted-foreground">
                {fileName} ({fileSize})
              </span>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <XCircle className="w-10 h-10 text-toxic" />
              <span className="text-sm text-toxic font-medium">{message}</span>
              <span className="text-xs text-muted-foreground">
                Click to try again
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </label>
    </div>
  );
}
