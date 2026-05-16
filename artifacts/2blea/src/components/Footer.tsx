import { MessageCircle, Mail, ArrowUpRight, LayoutDashboard } from "lucide-react";

const navLinks = [
  { name: "Servicios", href: "#servicios" },
  { name: "Presupuesto", href: "#presupuesto" },
  { name: "Opiniones", href: "#opiniones" },
  { name: "FAQ", href: "#faq" },
];

export function Footer() {
  return (
    <footer className="relative bg-card/30 border-t border-border overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a
              href="#"
              className="inline-block text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4"
            >
              2bleA
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Creamos presencias digitales que convierten visitantes en clientes. Diseño moderno, resultados reales.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/5492622530837"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-whatsapp-footer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-[#25D366] transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#25D366]/10 group-hover:bg-[#25D366]/20 transition-colors">
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  </span>
                  2622530837
                </a>
              </li>
              <li>
                <a
                  href="mailto:2bleadeveloper@gmail.com"
                  data-testid="link-email-footer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  2bleadeveloper@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 2bleA. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hecho con dedicacion en{" "}
            <span className="text-primary font-medium">Argentina</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
