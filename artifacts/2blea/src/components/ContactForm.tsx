import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";
import type { BudgetInfo } from "@/components/BudgetCalculator";
import { formatPrice } from "@/components/BudgetCalculator";

const PROJECT_TYPES = [
  "Landing Page Simple",
  "Landing Page con Turnos",
  "Página de Ventas",
  "Web para Negocios",
  "Catálogo Online",
  "Sitio Web Profesional",
  "Otro / Consulta general",
];

interface FormState {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
}

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = "Ingresá tu nombre completo (mínimo 2 caracteres).";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Ingresá un email válido.";
  if (!form.projectType)
    errors.projectType = "Seleccioná el tipo de proyecto.";
  if (!form.message.trim() || form.message.trim().length < 10)
    errors.message = "Contanos más sobre tu proyecto (mínimo 10 caracteres).";
  return errors;
}

interface Props {
  budgetInfo?: BudgetInfo;
}

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ budgetInfo }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const set = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validate({ ...form, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  }, [form, touched]);

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, projectType: true, message: true });
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");

    const budgetText = budgetInfo
      ? `\n\n--- Presupuesto generado ---\nServicio: ${budgetInfo.service}${budgetInfo.extras.length > 0 ? `\nExtras: ${budgetInfo.extras.join(", ")}` : ""}\nTotal estimado: ${formatPrice(budgetInfo.total)} ARS`
      : "";

    const fullMessage = form.message + budgetText;

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("_subject", `[2bleA] Nuevo contacto: ${form.projectType}`);
      formData.append("Tipo de proyecto", form.projectType);
      formData.append("message", fullMessage);
      formData.append("_template", "table");
      formData.append("_captcha", "false");

      const res = await fetch("https://formsubmit.co/ajax/2bleadeveloper@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", projectType: "", message: "" });
        setTouched({});
        setErrors({});
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section id="contacto" className="py-24 bg-card/20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-card/80 backdrop-blur-md border-border text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" aria-hidden="true" />
                <CardContent className="p-12">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Mensaje enviado</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                    Recibimos tu consulta. Te respondemos en menos de 24 horas.
                  </p>
                  <Button
                    onClick={() => setStatus("idle")}
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10 hover:text-primary"
                  >
                    Enviar otro mensaje
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="py-24 bg-card/20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[80px]" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contactanos</h2>
          <p className="text-muted-foreground text-lg">
            Contanos tu proyecto y te enviamos un presupuesto detallado en menos de 24hs.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-md border-border shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" aria-hidden="true" />
            <CardContent className="p-8">
              {/* Budget pill */}
              <AnimatePresence>
                {budgetInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20"
                  >
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Presupuesto generado</p>
                    <p className="text-sm text-foreground font-medium">{budgetInfo.service}</p>
                    {budgetInfo.extras.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">+ {budgetInfo.extras.join(" · ")}</p>
                    )}
                    <p className="text-lg font-bold text-primary mt-2">{formatPrice(budgetInfo.total)} ARS</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Nombre completo <span aria-hidden="true" className="text-primary">*</span></Label>
                  <Input
                    id="contact-name"
                    data-testid="input-contact-name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="Tu nombre y apellido"
                    className={`bg-muted/50 border-border focus:border-primary ${errors.name ? "border-destructive focus:border-destructive" : ""}`}
                    aria-required="true"
                    aria-describedby={errors.name ? "error-name" : undefined}
                    aria-invalid={!!errors.name}
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        id="error-name"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-destructive flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email <span aria-hidden="true" className="text-primary">*</span></Label>
                  <Input
                    id="contact-email"
                    data-testid="input-contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="tu@email.com"
                    className={`bg-muted/50 border-border focus:border-primary ${errors.email ? "border-destructive focus:border-destructive" : ""}`}
                    aria-required="true"
                    aria-describedby={errors.email ? "error-email" : undefined}
                    aria-invalid={!!errors.email}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        id="error-email"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-destructive flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Project type */}
                <div className="space-y-2">
                  <Label htmlFor="contact-project">Tipo de proyecto <span aria-hidden="true" className="text-primary">*</span></Label>
                  <Select
                    value={form.projectType}
                    onValueChange={(v) => set("projectType", v)}
                  >
                    <SelectTrigger
                      id="contact-project"
                      data-testid="select-project-type"
                      className={`bg-muted/50 border-border focus:border-primary ${errors.projectType ? "border-destructive" : ""}`}
                      aria-required="true"
                      aria-describedby={errors.projectType ? "error-project" : undefined}
                      aria-invalid={!!errors.projectType}
                    >
                      <SelectValue placeholder="Seleccioná el tipo de proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((pt) => (
                        <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {errors.projectType && (
                      <motion.p
                        id="error-project"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-destructive flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                        {errors.projectType}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Mensaje <span aria-hidden="true" className="text-primary">*</span></Label>
                  <Textarea
                    id="contact-message"
                    data-testid="textarea-contact-message"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    placeholder="Contanos sobre tu negocio y qué necesitás..."
                    rows={4}
                    className={`bg-muted/50 border-border focus:border-primary resize-none ${errors.message ? "border-destructive focus:border-destructive" : ""}`}
                    aria-required="true"
                    aria-describedby={errors.message ? "error-message" : undefined}
                    aria-invalid={!!errors.message}
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        id="error-message"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-destructive flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                        {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Error banner */}
                <AnimatePresence>
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                      role="alert"
                    >
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold">Error al enviar el mensaje</p>
                        <p className="text-xs opacity-80 mt-0.5">Intentá de nuevo o escribinos directamente por WhatsApp.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  data-testid="button-contact-submit"
                  disabled={status === "loading"}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" aria-hidden="true" />
                      Enviar mensaje
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  También podés escribirnos directamente por{" "}
                  <a
                    href="https://wa.me/5492622530837"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline"
                  >
                    WhatsApp
                  </a>
                  {" "}o{" "}
                  <a
                    href="mailto:2bleadeveloper@gmail.com"
                    className="text-primary hover:underline"
                  >
                    Email
                  </a>.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
