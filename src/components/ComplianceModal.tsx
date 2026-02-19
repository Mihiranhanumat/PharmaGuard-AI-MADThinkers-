import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ComplianceModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pharmaguard_compliance_dismissed");
    if (!dismissed) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("pharmaguard_compliance_dismissed", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-6 max-w-md w-full text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Clinical Decision Support Notice</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This application provides pharmacogenomic decision support aligned with{" "}
              <span className="text-primary font-medium">CPIC guidelines</span>. It does not replace
              professional medical judgment. All results should be reviewed by a qualified healthcare
              professional before clinical use.
            </p>
            <button
              onClick={dismiss}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all"
            >
              I Understand
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
