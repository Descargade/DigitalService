import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Cuánto tarda en estar lista mi web?",
    a: "El tiempo de entrega promedio es de 72 horas para landing pages simples. Proyectos más complejos con sistema de turnos, panel admin o base de datos pueden tomar entre 5 y 10 días hábiles.",
  },
  {
    q: "¿Puedo hacer cambios después de la entrega?",
    a: "Sí. Te entregamos el código fuente completo o te ofrecemos un servicio de mantenimiento mensual para actualizaciones, cambios de contenido o mejoras.",
  },
  {
    q: "¿El precio incluye el dominio y hosting?",
    a: "El precio base no incluye dominio ni hosting. Podés sumar el servicio de Hosting/Configuración (+$10.000 ARS) y te ayudamos a configurar todo en Vercel, Netlify o el proveedor que prefieras.",
  },
  {
    q: "¿Hacen páginas en cualquier rubro?",
    a: "Sí, trabajamos con todo tipo de negocios: barberías, gimnasios, restaurantes, profesionales independientes, tiendas, estudios y más. Si tenés un negocio, tenemos una solución para vos.",
  },
  {
    q: "¿Cómo es el proceso de pago?",
    a: "Trabajamos con 50% al inicio del proyecto y 50% al finalizar y aprobar el resultado. Aceptamos transferencia bancaria, Mercado Pago y otras plataformas de pago digital.",
  },
  {
    q: "¿Puedo ver el presupuesto antes de contratar?",
    a: "Claro que sí. Usá nuestro configurador de presupuesto para ver el costo exacto en tiempo real, antes de comprometerte con nada. Si tenés dudas, escribinos por WhatsApp.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-muted-foreground text-lg">
            Todo lo que necesitás saber antes de empezar tu proyecto.
          </p>
        </div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                data-testid={`faq-item-${i}`}
                className="bg-card/60 border border-border rounded-xl px-6 hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
