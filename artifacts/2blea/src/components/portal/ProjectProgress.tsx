import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { ProjectData } from "@/data/projects";

const STAGES = [
  { name: "Consulta", description: "Relevamiento y presupuesto" },
  { name: "Diseño", description: "Wireframes y maqueta visual" },
  { name: "Desarrollo", description: "Construcción del sitio" },
  { name: "Revisión", description: "Correcciones y ajustes" },
  { name: "Optimización", description: "SEO, velocidad y tests" },
  { name: "Entregado", description: "Publicación final" },
];

interface Props {
  project: ProjectData;
}

export function ProjectProgress({ project }: Props) {
  const { currentStage, progress, deliveryDate } = project;

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold">Progreso del proyecto</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Etapa actual: <span className="text-primary font-semibold">{STAGES[currentStage].name}</span>
          </p>
        </div>
        <div className="flex items-baseline gap-1">
          <motion.span
            className="text-4xl font-black text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {progress}%
          </motion.span>
          <span className="text-muted-foreground text-sm">completado</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-40" />
      </div>

      {/* Timeline */}
      <div className="relative mt-8">
        <div className="hidden sm:block absolute top-5 left-5 right-5 h-px bg-border z-0" aria-hidden="true" />
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
          {STAGES.map((stage, i) => {
            const isDone = i < currentStage;
            const isCurrent = i === currentStage;
            const isPending = i > currentStage;

            return (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="relative">
                  {isDone && (
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                  )}
                  {isCurrent && (
                    <div className="w-10 h-10 rounded-full bg-primary border-2 border-primary flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.6)]">
                      <Loader2 className="h-5 w-5 text-white animate-spin" aria-hidden="true" />
                    </div>
                  )}
                  {isPending && (
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center">
                      <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-semibold leading-tight ${
                    isDone ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {stage.name}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5 hidden sm:block">
                    {stage.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current stage detail card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Loader2 className="h-5 w-5 text-primary animate-spin" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">Actualmente en: {STAGES[currentStage].name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {STAGES[currentStage].description} — tu equipo está trabajando en esta etapa.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs font-medium text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
              En progreso
            </span>
            <span className="text-xs text-muted-foreground">Entrega estimada: {deliveryDate}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
