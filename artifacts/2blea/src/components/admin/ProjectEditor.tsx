import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, RotateCcw, CheckCircle2, Circle, Loader2, CreditCard } from "lucide-react";
import { saveOverride, resetOverride } from "@/lib/store";
import type { ProjectData, Payment } from "@/data/projects";

const STAGES = [
  { name: "Consulta", short: "Consulta" },
  { name: "Diseño", short: "Diseño" },
  { name: "Desarrollo", short: "Desarrollo" },
  { name: "Revisión", short: "Revisión" },
  { name: "Optimización", short: "Optimiz." },
  { name: "Entregado", short: "Entregado" },
];

const STATUS_OPTIONS = [
  "En consulta",
  "En diseño",
  "En desarrollo",
  "En revisión",
  "En optimización",
  "Entregado",
];

interface Props {
  project: ProjectData;
  onClose: () => void;
}

export function ProjectEditor({ project, onClose }: Props) {
  const [progress, setProgress] = useState(project.progress);
  const [currentStage, setCurrentStage] = useState(project.currentStage);
  const [status, setStatus] = useState(project.status);
  const [deliveryDate, setDeliveryDate] = useState(project.deliveryDate);
  const [payments, setPayments] = useState<Payment[]>(project.payments.map((p) => ({ ...p })));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProgress(project.progress);
    setCurrentStage(project.currentStage);
    setStatus(project.status);
    setDeliveryDate(project.deliveryDate);
    setPayments(project.payments.map((p) => ({ ...p })));
  }, [project.code]);

  const handleStageClick = (idx: number) => {
    setCurrentStage(idx);
    setProgress(Math.max(progress, Math.round((idx / 5) * 100)));
    setStatus(STATUS_OPTIONS[idx]);
  };

  const togglePayment = (idx: number) => {
    setPayments((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, paid: !p.paid } : p))
    );
  };

  const handleSave = () => {
    saveOverride(project.code, { progress, currentStage, status, deliveryDate, payments });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetOverride(project.code);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

        {/* Drawer */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative ml-auto w-full max-w-lg h-full bg-[#0e0e11] border-l border-white/10 flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
            <div>
              <h2 className="font-bold text-lg">{project.projectName}</h2>
              <p className="text-xs text-muted-foreground">{project.clientName} · <span className="font-mono text-violet-400">{project.code}</span></p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
              aria-label="Cerrar editor"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Timeline editor */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Etapa actual</h3>
              <div className="grid grid-cols-3 gap-2">
                {STAGES.map((s, i) => {
                  const isDone = i < currentStage;
                  const isCurrent = i === currentStage;
                  return (
                    <button
                      key={s.name}
                      onClick={() => handleStageClick(i)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        isCurrent
                          ? "bg-primary/20 border-primary text-primary shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                          : isDone
                          ? "bg-primary/8 border-primary/30 text-primary/70"
                          : "bg-white/3 border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                      ) : isCurrent ? (
                        <Loader2 className="h-3.5 w-3.5 flex-shrink-0 animate-spin" aria-hidden="true" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                      )}
                      {s.short}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progreso</h3>
                <span className="text-2xl font-black text-primary">{progress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-violet-500 h-2 cursor-pointer"
                aria-label="Progreso del proyecto"
              />
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado visible</h3>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatus(opt)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                      status === opt
                        ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
                        : "bg-white/3 border-white/10 text-muted-foreground hover:border-white/20"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery date */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha de entrega</h3>
              <input
                type="text"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                placeholder="Ej: 20 Mayo 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/30 text-sm text-white focus:outline-none transition-all"
              />
            </div>

            {/* Payments */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
                Estado de pagos
              </h3>
              <div className="space-y-2">
                {payments.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => togglePayment(i)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                      p.paid
                        ? "bg-emerald-500/8 border-emerald-500/30"
                        : "bg-white/3 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${p.paid ? "text-emerald-400" : "text-foreground"}`}>
                        {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(p.amount)}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        p.paid ? "bg-emerald-500 border-emerald-500" : "border-border"
                      }`}>
                        {p.paid && <CheckCircle2 className="h-3 w-3 text-white" aria-hidden="true" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground transition-all"
              title="Restaurar datos originales"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Restaurar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
            >
              {saved ? (
                <><CheckCircle2 className="h-4 w-4" aria-hidden="true" />¡Guardado!</>
              ) : (
                <><Save className="h-4 w-4" aria-hidden="true" />Guardar cambios</>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
