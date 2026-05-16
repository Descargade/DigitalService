import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, LayoutDashboard, MessageSquare, FolderOpen, Settings, LogOut, ShieldCheck } from "lucide-react";
import { ProjectProgress } from "@/components/portal/ProjectProgress";
import { ProjectInfoCards } from "@/components/portal/ProjectInfoCards";
import { ProjectChat } from "@/components/portal/ProjectChat";
import { ProjectFiles } from "@/components/portal/ProjectFiles";
import { PortalAccess } from "@/components/portal/PortalAccess";
import { usePortalSession } from "@/hooks/usePortalSession";
import type { ProjectData } from "@/data/projects";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "messages", icon: MessageSquare, label: "Mensajes" },
  { id: "files", icon: FolderOpen, label: "Archivos" },
  { id: "settings", icon: Settings, label: "Configuración" },
];

export default function Portal() {
  const { project, isAuthenticated, login, logout } = usePortalSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated || !project) {
    return <PortalAccess onLogin={login} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="portal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-background text-foreground flex"
      >
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0`}
        >
          {/* Brand */}
          <div className="p-6 border-b border-sidebar-border">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              2bleA
            </Link>
            <p className="text-xs text-muted-foreground mt-1">Portal del cliente</p>
          </div>

          {/* Project chip */}
          <div className="mx-4 mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Proyecto activo</p>
            <p className="text-sm font-semibold text-foreground truncate">{project.projectName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{project.projectType}</p>
          </div>

          {/* Session code badge */}
          <div className="mx-4 mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-500/8 border border-violet-500/15">
            <ShieldCheck className="h-3 w-3 text-violet-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs text-violet-400 font-mono tracking-wider truncate">{project.code}</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 mt-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer: back + logout */}
          <div className="p-4 border-t border-sidebar-border space-y-1">
            <Link href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Volver al sitio
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/8 transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menú"
              >
                <div className="space-y-1">
                  <span className="block w-5 h-0.5 bg-foreground" />
                  <span className="block w-5 h-0.5 bg-foreground" />
                  <span className="block w-5 h-0.5 bg-foreground" />
                </div>
              </button>
              <div>
                <h1 className="text-lg font-bold">{project.projectName}</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Entrega estimada: <span className="text-foreground font-medium">{project.deliveryDate}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs font-semibold text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
                {project.status}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold select-none">
                {project.clientInitials}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-8 overflow-auto">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 max-w-5xl"
                >
                  <ProjectProgress project={project} />
                  <ProjectInfoCards project={project} />
                </motion.div>
              )}
              {activeTab === "messages" && (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl"
                >
                  <ProjectChat project={project} />
                </motion.div>
              )}
              {activeTab === "files" && (
                <motion.div
                  key="files"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl"
                >
                  <ProjectFiles project={project} />
                </motion.div>
              )}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-2xl"
                >
                  <SettingsTab project={project} onLogout={logout} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function SettingsTab({ project, onLogout }: { project: ProjectData; onLogout: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Configuración</h2>
        <p className="text-muted-foreground text-sm">Datos de tu cuenta y preferencias.</p>
      </div>

      {/* Profile */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Perfil</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold select-none">
            {project.clientInitials}
          </div>
          <div>
            <p className="font-semibold">{project.clientName}</p>
            <p className="text-sm text-muted-foreground">cliente@email.com</p>
            <p className="text-xs text-muted-foreground mt-0.5">Cliente desde {project.startDate}</p>
          </div>
        </div>
      </div>

      {/* Session */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Sesión activa</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-violet-400" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">Código:</span>
            <span className="font-mono text-sm text-violet-300 tracking-wider">{project.code}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 transition-colors"
          >
            <LogOut className="h-3 w-3" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Notificaciones</h3>
        <p className="text-sm text-muted-foreground">
          Las notificaciones por email están activas. Recibirás actualizaciones cuando haya cambios en tu proyecto.
        </p>
      </div>

      {/* Support */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Soporte</h3>
        <p className="text-sm text-muted-foreground mb-4">¿Tenés alguna duda? Contactanos directamente.</p>
        <a
          href="https://wa.me/5492622530837"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/25 transition-colors"
        >
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  );
}
