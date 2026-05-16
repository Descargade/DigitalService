import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Carlos M.",
    role: "Barbería El Punto",
    location: "Mendoza",
    text: "2bleA transformó mi barbería. Ahora recibo turnos 24/7 sin mover un dedo. La página quedó increíble y los clientes la aman.",
    initials: "CM",
    color: "from-blue-500 to-purple-600",
  },
  {
    name: "Laura G.",
    role: "Boutique Lucía",
    location: "San Rafael",
    text: "En menos de una semana tenía mi catálogo online funcionando. El proceso fue muy simple y el resultado superó lo que esperaba.",
    initials: "LG",
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "Diego R.",
    role: "Gimnasio FitPro",
    location: "Mendoza",
    text: "La landing page triplicó mis consultas en el primer mes. Recomiendo 100% el trabajo de 2bleA. Profesionales de verdad.",
    initials: "DR",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Valentina S.",
    role: "Estudio de Yoga Om",
    location: "Argentina",
    text: "Profesionales, rápidos y el resultado superó mis expectativas. La web transmite exactamente la energía que quería para mi marca.",
    initials: "VS",
    color: "from-orange-500 to-red-600",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="opiniones" className="py-24 bg-card/20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-muted-foreground text-lg">
            Negocios que confiaron en 2bleA y transformaron su presencia digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/60 backdrop-blur-sm border-border hover:border-primary/40 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 flex flex-col h-full relative z-10">
                  <Stars />
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow mb-6">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role} — {t.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
