import { motion } from "framer-motion";
import { CheckCircle2, DollarSign, Layers, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectData } from "@/data/projects";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.1 } }),
};

interface Props {
  project: ProjectData;
}

export function ProjectInfoCards({ project }: Props) {
  const { features, price, extras, payments } = project;
  const paid = payments.filter((p) => p.paid).reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => !p.paid).reduce((s, p) => s + p.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Features */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="bg-card/60 border-border hover:border-primary/30 transition-colors h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              Funcionalidades incluidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2" role="list">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Price + Extras */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="bg-card/60 border-border hover:border-primary/30 transition-colors h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-accent" aria-hidden="true" />
              </span>
              Precio acordado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-black text-foreground">{formatPrice(price)}</p>
              <p className="text-xs text-muted-foreground mt-1">ARS — precio final acordado</p>
            </div>
            {extras.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Extras incluidos</p>
                <div className="flex flex-wrap gap-2">
                  {extras.map((ex) => (
                    <span
                      key={ex}
                      className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment status */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants} className="md:col-span-2">
        <Card className="bg-card/60 border-border hover:border-primary/30 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              </span>
              Estado de pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {payments.map((p) => (
                <div
                  key={p.label}
                  className={`flex items-start justify-between p-4 rounded-xl border ${
                    p.paid ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted/30 border-border"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold">{formatPrice(p.amount)}</p>
                    <span className={`inline-block text-xs font-semibold mt-1 px-2 py-0.5 rounded-full ${
                      p.paid
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}>
                      {p.paid ? "Pagado" : "Pendiente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pagado: <span className="text-emerald-400 font-semibold">{formatPrice(paid)}</span></span>
                <span>Pendiente: <span className="text-foreground font-semibold">{formatPrice(pending)}</span></span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(paid / price) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
