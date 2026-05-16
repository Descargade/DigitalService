import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, Clock, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Agencia de desarrollo web en Argentina
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Landing pages modernas que{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              convierten visitantes en clientes
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Diseñamos tu presencia digital desde cero, optimizada para atraer, convencer y generar resultados reales para tu negocio local.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto text-lg h-14 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all group"
              asChild
            >
              <a href="#presupuesto">
                Crear mi presupuesto
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg h-14 px-8 border-border hover:bg-muted/50"
              asChild
            >
              <a href="#servicios">Ver servicios</a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-20 border-y border-border/50 bg-card/30 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
            {[
              { icon: <CheckCircle2 className="h-5 w-5 text-primary" />, label: "50+ proyectos" },
              { icon: <Zap className="h-5 w-5 text-accent" />, label: "100% satisfacción" },
              { icon: <Clock className="h-5 w-5 text-primary" />, label: "72h entrega promedio" },
              { icon: <ShieldCheck className="h-5 w-5 text-accent" />, label: "Soporte continuo" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-center gap-3">
                {stat.icon}
                <span className="font-medium text-sm md:text-base">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
