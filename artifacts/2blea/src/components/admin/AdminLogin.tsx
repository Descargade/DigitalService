import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Eye, EyeOff, ArrowRight, Loader2, User, Lock } from "lucide-react";
import { adminLogin } from "@/lib/store";

interface Props {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const usernameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Completá usuario y contraseña.");
      setShakeKey((k) => k + 1);
      return;
    }
    setLoading(true);
    setError("");
    const ok = await adminLogin(username, password);
    if (ok) {
      onLogin();
    } else {
      setLoading(false);
      setError("Credenciales incorrectas.");
      setShakeKey((k) => k + 1);
      usernameRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-60 -right-40 w-[600px] h-[600px] rounded-full bg-violet-800/15 blur-[130px]" />
        <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-blue-800/12 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/8 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-violet-600 via-blue-500 to-violet-600" />
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                <ShieldCheck className="h-7 w-7 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Panel Admin</h1>
              <p className="text-zinc-400 text-sm mt-1">2bleA — Gestión de proyectos</p>
            </div>

            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" aria-hidden="true" />
                Acceso restringido — solo administradores
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="admin-user" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" aria-hidden="true" />
                  <input
                    ref={usernameRef}
                    id="admin-user"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    placeholder="admin"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/30 text-white placeholder:text-zinc-600 text-sm focus:outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="admin-pass" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Contraseña
                </label>
                <motion.div key={shakeKey} animate={error ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}} transition={{ duration: 0.45 }} className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" aria-hidden="true" />
                  <input
                    id="admin-pass"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/30 text-white placeholder:text-zinc-600 text-sm focus:outline-none transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
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
                disabled={loading || !username.trim() || !password}
                className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25 focus:outline-none focus:ring-2 focus:ring-violet-500/50 mt-2"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Verificando…</>
                ) : (
                  <>Ingresar al panel <ArrowRight className="h-4 w-4" aria-hidden="true" /></>
                )}
              </button>
            </form>

            <div className="mt-6 p-3 rounded-xl bg-white/[0.03] border border-white/8 text-center">
              <p className="text-xs text-zinc-500">Demo: <span className="text-zinc-400 font-mono">admin</span> / <span className="text-zinc-400 font-mono">2blea2026</span></p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-zinc-600 text-xs">
          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" aria-hidden="true" />Sesión cifrada</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" aria-hidden="true" />
          <span>Solo uso interno</span>
        </div>
      </motion.div>
    </div>
  );
}
