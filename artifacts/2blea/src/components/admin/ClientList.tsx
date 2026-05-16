import { motion } from "framer-motion";
import { Edit2, ArrowUpRight } from "lucide-react";
import type { ProjectData } from "@/data/projects";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const STAGES = ["Consulta", "Diseño", "Desarrollo", "Revisión", "Optimización", "Entregado"];

const STAGE_COLORS: Record<number, string> = {
  0: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  1: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  2: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  3: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  4: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  5: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

interface Props {
  projects: ProjectData[];
  onEdit: (code: string) => void;
}

export function ClientList({ projects, onEdit }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Clientes y proyectos</h2>
        <p className="text-muted-foreground text-sm mt-1">{projects.length} proyectos registrados en la plataforma.</p>
      </div>

      <div className="space-y-4">
        {projects.map((p, i) => {
          const paid = p.payments.filter((pay) => pay.paid).reduce((s, pay) => s + pay.amount, 0);

          return (
            <motion.div
              key={p.code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card/60 hover:border-primary/30 transition-all p-5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0 select-none">
                    {p.clientInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-foreground">{p.clientName}</h3>
                      <span className="font-mono text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                        {p.code}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 truncate">{p.projectName} · {p.projectType}</p>
                  </div>
                </div>
                <button
                  onClick={() => onEdit(p.code)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all flex-shrink-0"
                >
                  <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Editar
                </button>
              </div>

              {/* Progress */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${STAGE_COLORS[p.currentStage]}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden="true" />
                    {p.status || STAGES[p.currentStage]}
                  </span>
                  <span className="text-sm font-bold text-primary">{p.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted/40 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Precio</p>
                  <p className="text-sm font-bold mt-0.5">{formatPrice(p.price)}</p>
                </div>
                <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/20 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Cobrado</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{formatPrice(paid)}</p>
                </div>
                <div className="rounded-xl bg-muted/40 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Entrega</p>
                  <p className="text-sm font-bold mt-0.5 truncate">{p.deliveryDate}</p>
                </div>
              </div>

              {/* Client portal link */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <a
                  href="/portal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  Ver portal del cliente (código: <span className="font-mono text-violet-400">{p.code}</span>)
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
