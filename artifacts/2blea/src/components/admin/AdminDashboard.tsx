import { motion } from "framer-motion";
import { TrendingUp, Users, CheckCircle2, DollarSign, Activity, ArrowUpRight } from "lucide-react";
import type { ProjectData } from "@/data/projects";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

interface Props {
  projects: ProjectData[];
}

const STAGES = ["Consulta", "Diseño", "Desarrollo", "Revisión", "Optimización", "Entregado"];

export function AdminDashboard({ projects }: Props) {
  const totalIncome = projects.reduce((s, p) => s + p.price, 0);
  const paidIncome = projects.reduce(
    (s, p) => s + p.payments.filter((pay) => pay.paid).reduce((a, pay) => a + pay.amount, 0),
    0
  );
  const activeCount = projects.filter((p) => p.currentStage < 5).length;
  const deliveredCount = projects.filter((p) => p.currentStage === 5).length;

  const stats = [
    {
      label: "Total proyectos",
      value: projects.length,
      sub: "en la plataforma",
      icon: Users,
      color: "from-violet-600 to-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      label: "Proyectos activos",
      value: activeCount,
      sub: "en progreso",
      icon: Activity,
      color: "from-blue-600 to-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Entregados",
      value: deliveredCount,
      sub: "completados",
      icon: CheckCircle2,
      color: "from-emerald-600 to-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Ingresos cobrados",
      value: formatPrice(paidIncome),
      sub: `de ${formatPrice(totalIncome)} total`,
      icon: DollarSign,
      color: "from-amber-600 to-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  const activity = projects
    .flatMap((p) =>
      p.messages.slice(-1).map((m) => ({
        project: p.projectName,
        code: p.code,
        text: m.text.slice(0, 60) + (m.text.length > 60 ? "…" : ""),
        time: m.time,
        from: m.from,
      }))
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Resumen general de todos los proyectos.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className={`rounded-2xl border ${s.border} ${s.bg} p-5 flex items-start gap-4`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <s.icon className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className="text-xl font-black text-foreground mt-0.5">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.35 }}
          className="rounded-2xl border border-border bg-card/60 p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
            Estado de proyectos
          </h3>
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{p.projectName}</p>
                    <p className="text-xs text-muted-foreground">{STAGES[p.currentStage]} · {p.clientName}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{p.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.45 }}
          className="rounded-2xl border border-border bg-card/60 p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
            Actividad reciente
          </h3>
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  a.from === "agency"
                    ? "bg-gradient-to-br from-primary to-accent text-white"
                    : "bg-gradient-to-br from-blue-500 to-violet-600 text-white"
                }`}>
                  {a.from === "agency" ? "2A" : a.code.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold truncate">{a.project}</p>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.text}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Income breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.55 }}
        className="rounded-2xl border border-border bg-card/60 p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          Desglose de ingresos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="pb-2 font-semibold">Proyecto</th>
                <th className="pb-2 font-semibold">Cliente</th>
                <th className="pb-2 font-semibold text-right">Total</th>
                <th className="pb-2 font-semibold text-right">Cobrado</th>
                <th className="pb-2 font-semibold text-right">Pendiente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {projects.map((p) => {
                const paid = p.payments.filter((pay) => pay.paid).reduce((s, pay) => s + pay.amount, 0);
                return (
                  <tr key={p.code} className="text-sm">
                    <td className="py-3 font-medium">{p.projectName}</td>
                    <td className="py-3 text-muted-foreground">{p.clientName}</td>
                    <td className="py-3 text-right font-semibold">{formatPrice(p.price)}</td>
                    <td className="py-3 text-right text-emerald-400 font-medium">{formatPrice(paid)}</td>
                    <td className="py-3 text-right text-muted-foreground">{formatPrice(p.price - paid)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-border text-sm font-bold">
                <td className="pt-3" colSpan={2}>Total</td>
                <td className="pt-3 text-right">{formatPrice(totalIncome)}</td>
                <td className="pt-3 text-right text-emerald-400">{formatPrice(paidIncome)}</td>
                <td className="pt-3 text-right text-muted-foreground">{formatPrice(totalIncome - paidIncome)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
