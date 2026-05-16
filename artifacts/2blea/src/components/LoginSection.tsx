import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export function LoginSection() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section id="cuenta" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Accedé a tu cuenta</h2>
          <p className="text-muted-foreground text-lg mb-4">
            Seguí el avance de tu proyecto en tiempo real desde tu panel personal.
          </p>
          <a
            href="/portal"
            data-testid="link-portal-demo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            Ver demo del portal de seguimiento
          </a>
        </div>

        <div className="max-w-md mx-auto">
          {/* Tab toggle */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                data-testid={`tab-${t}`}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  tab === t
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22 }}
              >
                <Card className="bg-card/80 backdrop-blur-md border-border shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Bienvenido de vuelta</CardTitle>
                    <CardDescription>Ingresá tus datos para acceder a tu cuenta.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="login-email"
                          data-testid="input-login-email"
                          type="email"
                          autoComplete="email"
                          placeholder="tu@email.com"
                          className="pl-10 bg-muted/50 border-border focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="login-password"
                          data-testid="input-login-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-muted/50 border-border focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      data-testid="button-login"
                      className="w-full h-11 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all"
                    >
                      Ingresar
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      No tenés cuenta?{" "}
                      <button
                        type="button"
                        onClick={() => setTab("register")}
                        className="text-primary hover:underline font-medium"
                      >
                        Registrate
                      </button>
                    </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
              >
                <Card className="bg-card/80 backdrop-blur-md border-border shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent to-primary" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Crear una cuenta</CardTitle>
                    <CardDescription>Completá el formulario para registrarte.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Nombre</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="reg-name"
                          data-testid="input-register-name"
                          autoComplete="name"
                          placeholder="Tu nombre"
                          className="pl-10 bg-muted/50 border-border focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="reg-email"
                          data-testid="input-register-email"
                          type="email"
                          autoComplete="email"
                          placeholder="tu@email.com"
                          className="pl-10 bg-muted/50 border-border focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="reg-password"
                          data-testid="input-register-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-muted/50 border-border focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-confirm">Confirmar contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="reg-confirm"
                          data-testid="input-register-confirm"
                          type={showConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-muted/50 border-border focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      data-testid="button-register"
                      className="w-full h-11 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all"
                    >
                      Crear cuenta
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      Ya tenés cuenta?{" "}
                      <button
                        type="button"
                        onClick={() => setTab("login")}
                        className="text-primary hover:underline font-medium"
                      >
                        Iniciá sesión
                      </button>
                    </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
