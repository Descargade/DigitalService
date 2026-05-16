import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Mail } from "lucide-react";

export interface BudgetInfo {
  service: string;
  extras: string[];
  total: number;
  summary: string;
}

export const extras = [
  { id: "turnos", name: "Sistema de turnos", price: 10000 },
  { id: "confirmacion", name: "Confirmación automática", price: 10000 },
  { id: "login", name: "Login de usuarios", price: 10000 },
  { id: "admin", name: "Panel administrador", price: 30000 },
  { id: "db", name: "Base de datos", price: 60000 },
  { id: "hosting", name: "Hosting / configuración", price: 15000 },
];

export const baseServices = [
  {
    id: "landing",
    name: "Landing Page Simple",
    price: 30000,
    includedExtras: [],
    disabledExtras: [],
  },

  {
    id: "landing-turnos",
    name: "Landing + Turnos + Confirmación",
    price: 45000,
    includedExtras: ["turnos", "confirmacion"],
    disabledExtras: ["turnos", "confirmacion"],
  },

  {
    id: "ventas",
    name: "Página de Ventas",
    price: 60000,
    includedExtras: [],
    disabledExtras: ["turnos", "confirmacion"],
  },

  {
    id: "negocios",
    name: "Web para Negocios",
    price: 120000,
    includedExtras: ["hosting", "login", "confirmacion", "admin"],
    disabledExtras: ["turnos", "hosting", "login", "confirmacion", "admin"],
  },

  {
    id: "catalogo",
    name: "Catálogo Online",
    price: 100000,
    includedExtras: ["hosting", "login"],
    disabledExtras: ["turnos", "confirmacion", "hosting", "login"],
  },

  {
    id: "profesional",
    name: "Sitio Web Profesional",
    price: 200000,
    includedExtras: [
      "confirmacion",
      "login",
      "admin",
      "db",
      "hosting",
    ],
    disabledExtras: [
      "turnos",
      "confirmacion",
      "login",
      "admin",
      "db",
      "hosting",
    ],
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);

interface Props {
  onBudgetChange?: (info: BudgetInfo) => void;
}

export function BudgetCalculator({ onBudgetChange }: Props) {
  const [selectedBase, setSelectedBase] = useState<string>("landing");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const currentBaseService = useMemo(
    () => baseServices.find((s) => s.id === selectedBase) || baseServices[0],
    [selectedBase]
  );

  const includedExtras = useMemo(
    () =>
      extras.filter((e) =>
        currentBaseService.includedExtras.includes(e.id)
      ),
    [currentBaseService]
  );

  const availableExtras = useMemo(
    () =>
      extras.filter(
        (e) => !currentBaseService.disabledExtras.includes(e.id)
      ),
    [currentBaseService]
  );

  const currentSelectedExtras = useMemo(
    () => extras.filter((e) => selectedExtras.includes(e.id)),
    [selectedExtras]
  );

  const allExtras = useMemo(
    () => [...includedExtras, ...currentSelectedExtras],
    [includedExtras, currentSelectedExtras]
  );

  useEffect(() => {
    setSelectedExtras((prev) =>
      prev.filter(
        (id) => !currentBaseService.disabledExtras.includes(id)
      )
    );
  }, [currentBaseService]);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id)
        ? prev.filter((e) => e !== id)
        : [...prev, id]
    );
  };

  const totalPrice = useMemo(() => {
    return (
      currentBaseService.price +
      currentSelectedExtras.reduce((sum, e) => sum + e.price, 0)
    );
  }, [currentBaseService, currentSelectedExtras]);

  useEffect(() => {
    if (!onBudgetChange) return;

    const extraNames = allExtras.map((e) => e.name);

    const summary =
      `Servicio: ${currentBaseService.name}\n` +
      (extraNames.length > 0
        ? `Extras: ${extraNames.join(", ")}\n`
        : "") +
      `Total: ${formatPrice(totalPrice)} ARS`;

    onBudgetChange({
      service: currentBaseService.name,
      extras: extraNames,
      total: totalPrice,
      summary,
    });
  }, [
    currentBaseService,
    allExtras,
    totalPrice,
    onBudgetChange,
  ]);

  const generateMessage = () => {
    const extrasList =
      allExtras.length > 0
        ? allExtras.map((e) => `- ${e.name}`).join("\n")
        : "Ninguno";

    return `Hola 2bleA! Quiero el siguiente presupuesto:\n\nServicio: ${currentBaseService.name}\nExtras:\n${extrasList}\n\nTotal estimado: ${formatPrice(totalPrice)} ARS`;
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/5492622530837?text=${encodeURIComponent(
        generateMessage()
      )}`,
      "_blank"
    );
  };

  const handleEmail = () => {
    window.location.href = `mailto:2bleadeveloper@gmail.com?subject=${encodeURIComponent(
      "Presupuesto 2bleA"
    )}&body=${encodeURIComponent(generateMessage())}`;
  };

  return (
    <section id="presupuesto" className="py-24 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Creá tu Presupuesto
          </h2>

          <p className="text-muted-foreground text-lg">
            Personalizá tu web y calculá el precio al instante.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CONFIGURADOR */}
          <div className="lg:col-span-7 space-y-8">
            {/* SERVICIO BASE */}
            <Card className="bg-background border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold">
                    1
                  </span>
                  Elegí tu servicio base
                </h3>

                <RadioGroup
                  value={selectedBase}
                  onValueChange={setSelectedBase}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {baseServices.map((service) => (
                    <div key={service.id}>
                      <RadioGroupItem
                        value={service.id}
                        id={`base-${service.id}`}
                        className="peer sr-only"
                      />

                      <Label
                        htmlFor={`base-${service.id}`}
                        className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/10 peer-data-[state=checked]:border-primary cursor-pointer transition-all"
                      >
                        <span className="font-semibold block w-full">
                          {service.name}
                        </span>

                        <span className="text-sm text-muted-foreground mt-1 block">
                          {formatPrice(service.price)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* EXTRAS */}
            <Card className="bg-background border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold">
                    2
                  </span>
                  Funcionalidades disponibles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableExtras.map((extra) => (
                    <div
                      key={extra.id}
                      className="flex items-center space-x-3 bg-muted/30 p-3 rounded-lg border border-border/50 hover:border-border transition-colors cursor-pointer"
                      onClick={() => toggleExtra(extra.id)}
                    >
                      <Checkbox
                        id={`extra-${extra.id}`}
                        checked={selectedExtras.includes(extra.id)}
                        onCheckedChange={() => toggleExtra(extra.id)}
                        className="pointer-events-none"
                      />

                      <div className="grid gap-1 leading-none w-full">
                        <label
                          htmlFor={`extra-${extra.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {extra.name}
                        </label>

                        <p className="text-xs text-muted-foreground">
                          +{formatPrice(extra.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {includedExtras.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                      Ya incluidos en este plan
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {includedExtras.map((extra) => (
                        <div
                          key={extra.id}
                          className="flex items-center justify-between bg-primary/10 border border-primary/20 p-3 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {extra.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Incluido
                            </p>
                          </div>

                          <span className="text-primary text-sm font-semibold">
                            ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RESUMEN */}
          <div className="lg:col-span-5 sticky top-24">
            <Card className="border-border shadow-lg bg-card/80 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />

              <CardContent className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold mb-6">
                  Resumen
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {currentBaseService.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Servicio base
                      </p>
                    </div>

                    <p className="font-semibold">
                      {formatPrice(currentBaseService.price)}
                    </p>
                  </div>

                  <AnimatePresence>
                    {allExtras.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div className="pt-2">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">
                            Extras
                          </p>

                          {allExtras.map((extra) => {
                            const isIncluded =
                              currentBaseService.includedExtras.includes(
                                extra.id
                              );

                            return (
                              <div
                                key={extra.id}
                                className="flex justify-between items-center text-sm py-1"
                              >
                                <span className="text-muted-foreground">
                                  {extra.name}
                                  {isIncluded && (
                                    <span className="ml-2 text-primary">
                                      (Incluido)
                                    </span>
                                  )}
                                </span>

                                <span>
                                  {isIncluded
                                    ? "✓"
                                    : formatPrice(extra.price)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between items-end mb-8">
                  <p className="text-lg font-medium text-muted-foreground">
                    Total estimado
                  </p>

                  <motion.p
                    key={totalPrice}
                    initial={{
                      scale: 1.1,
                      color: "hsl(var(--primary))",
                    }}
                    animate={{
                      scale: 1,
                      color: "hsl(var(--foreground))",
                    }}
                    className="text-4xl font-black"
                  >
                    {formatPrice(totalPrice)}
                  </motion.p>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white h-12"
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Enviar por WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={handleEmail}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Enviar por Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}