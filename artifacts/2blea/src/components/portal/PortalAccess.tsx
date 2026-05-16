import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { PROJECTS } from "@/data/projects";

interface PortalAccessProps {
  onLogin: (code: string) => void;
}

export function PortalAccess({ onLogin }: PortalAccessProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Ingresá tu código de acceso.");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 900));

    if (PROJECTS[trimmed]) {
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 1100));
      onLogin(trimmed);
    } else {
      setLoading(false);
      setError("Código inválido. Verificá y volvé a intentarlo.");
      triggerShake();
      inputRef.current?.focus();
    }
  };

  const triggerShake = () => setShakeKey((k) => k + 1);

  const useDemoCode = (demo: string) => {
    setCode(demo);
    setError("");
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-700/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-700/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-5 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <ShieldCheck className="h-9 w-9 text-white" aria-hidden="true" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">¡Acceso verificado!</h2>
              <p className="text-sm text-zinc-400 mt-1">Cargando tu panel…</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Ingresando al portal
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Card */}
            <div className="rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-violet-600 via-blue-400 to-violet-500" />

              <div className="p-8 sm:p-10">
                {/* Logo + brand */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                    <span className="text-white font-black text-xl tracking-tight">2A</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">2bleA</h1>
                  <p className="text-zinc-400 text-sm mt-1">Portal del cliente</p>
                </div>

                {/* Security badge */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold tracking-wide">
                    <Lock className="h-3 w-3" aria-hidden="true" />
                    Portal privado — acceso con código
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <label htmlFor="access-code" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Código de acceso
                    </label>
                    <motion.div
                      key={shakeKey}
                      animate={error ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
                      transition={{ duration: 0.45 }}
                      className="relative"
                    >
                      <input
                        ref={inputRef}
                        id="access-code"
                        type={showCode ? "text" : "password"}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value.toUpperCase());
                          if (error) setError("");
                        }}
                        placeholder="Ej: BARBER-2026"
                        className={`w-full px-4 py-3.5 pr-12 rounded-xl bg-white/5 border text-white placeholder:text-zinc-600 font-mono text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                          error
                            ? "border-red-500/60 bg-red-500/5"
                            : "border-white/10 hover:border-white/20 focus:border-violet-500/60"
                        }`}
                        aria-describedby={error ? "code-error" : undefined}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCode((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
                        aria-label={showCode ? "Ocultar código" : "Mostrar código"}
                        tabIndex={-1}
                      >
                        {showCode ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </motion.div>

                    <AnimatePresence>
                      {error && (
                        <motion.p
                          id="code-error"
                          role="alert"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs text-red-400 font-medium"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !code.trim()}
                    className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-violet-500/25 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    aria-label="Ingresar al portal"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Verificando…
                      </>
                    ) : (
                      <>
                        Ingresar al portal
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-zinc-600 text-xs">demo</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                {/* Demo codes */}
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 text-center mb-3">Probá con alguno de estos códigos de ejemplo</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["BARBER-2026", "STORE-2026", "FITNESS-2026"].map((demo) => (
                      <button
                        key={demo}
                        type="button"
                        onClick={() => useDemoCode(demo)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/10 text-xs font-mono tracking-wider transition-all"
                      >
                        {demo}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Security footnote */}
            <div className="flex items-center justify-center gap-4 mt-6 text-zinc-600 text-xs">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Acceso cifrado
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" aria-hidden="true" />
              <span>Sesión segura</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" aria-hidden="true" />
              <span>Solo clientes 2bleA</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
