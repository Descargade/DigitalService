import { motion } from "framer-motion";
import { Scissors, CalendarClock, ShoppingCart, Briefcase, Store, Laptop } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "landing-barberia",
    icon: <Scissors className="h-8 w-8" />,
    title: "Landing Page",
    description: "Atrae más clientes con una landing page moderna y profesional para tu negocio.",
    price: 30000,
    color: "from-blue-500/20 to-purple-500/20",
    iconColor: "text-blue-400"
  },
  {
    id: "landing-turnos",
    icon: <CalendarClock className="h-8 w-8" />,
    title: "Landing Page Turnos",
    description: "Sistema online de reservas de turnos integrado en tu web.",
    price: 45000,
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400"
  },
  {
    id: "pagina-ventas",
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Página de Ventas",
    description: "Convierte visitas en ventas con una página optimizada para conversiones.",
    price: 60000,
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400"
  },
  {
    id: "web-negocios",
    icon: <Briefcase className="h-8 w-8" />,
    title: "Web para Negocios",
    description: "Presencia digital completa para tu negocio local o emprendimiento.",
    price: 120000,
    color: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-400"
  },
  {
    id: "catalogo-online",
    icon: <Store className="h-8 w-8" />,
    title: "Catálogo Online",
    description: "Mostrá tus productos con un catálogo elegante y fácil de actualizar.",
    price: 100000,
    color: "from-indigo-500/20 to-cyan-500/20",
    iconColor: "text-cyan-400"
  },
  {
    id: "sitio-profesional",
    icon: <Laptop className="h-8 w-8" />,
    title: "Sitio Web Profesional",
    description: "Web completa con panel admin, login de usuarios y base de datos.",
    price: 200000,
    color: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "text-primary"
  }
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(price);
};

export function ServiceCards() {
  const selectService = (id: string) => {
    // In a real app with global state, we'd set the selected service here
    // For this simple version, we just scroll to the budget section
    const el = document.getElementById("presupuesto");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="servicios" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
          <p className="text-muted-foreground text-lg">Soluciones digitales diseñadas para cada tipo de negocio. Elegí la que mejor se adapte a tus necesidades.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-colors group overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <CardHeader>
                  <div className={`mb-4 p-3 rounded-2xl bg-background/50 inline-block w-fit ring-1 ring-border shadow-sm group-hover:scale-110 transition-transform ${service.iconColor}`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">Desde</p>
                  <p className="text-2xl font-bold text-foreground">{formatPrice(service.price)}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                    variant="secondary"
                    onClick={() => selectService(service.id)}
                  >
                    Personalizar
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
