import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, LayoutDashboard, MessageSquare, FolderOpen, Settings } from "lucide-react";
import { ProjectProgress } from "@/components/portal/ProjectProgress";
import { ProjectInfoCards } from "@/components/portal/ProjectInfoCards";
import { ProjectChat } from "@/components/portal/ProjectChat";
import { ProjectFiles } from "@/components/portal/ProjectFiles";
import { MOCK_PROJECT } from "@/data/mockProject";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "messages", icon: MessageSquare, label: "Mensajes" },
  { id: "files", icon: FolderOpen, label: "Archivos" },
  { id: "settings", icon: Settings, label: "Configuración" },
];

export default function Portal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
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
          <p className="text-sm font-semibold text-foreground truncate">{MOCK_PROJECT.projectName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{MOCK_PROJECT.projectType}</p>
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

        {/* Back to site */}
        <div className="p-4 border-t border-sidebar-border">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al sitio
          </Link>
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
              <h1 className="text-lg font-bold">{MOCK_PROJECT.projectName}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Entrega estimada: <span className="text-foreground font-medium">{MOCK_PROJECT.deliveryDate}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs font-semibold text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
              {MOCK_PROJECT.status}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
              CM
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 max-w-5xl"
            >
              <ProjectProgress />
              <ProjectInfoCards />
            </motion.div>
          )}
          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl"
            >
              <ProjectChat />
            </motion.div>
          )}
          {activeTab === "files" && (
            <motion.div
              key="files"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl"
            >
              <ProjectFiles />
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl"
            >
              <SettingsTab />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Configuración</h2>
        <p className="text-muted-foreground text-sm">Datos de tu cuenta y preferencias.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Perfil</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
            CM
          </div>
          <div>
            <p className="font-semibold">{MOCK_PROJECT.clientName}</p>
            <p className="text-sm text-muted-foreground">cliente@email.com</p>
            <p className="text-xs text-muted-foreground mt-0.5">Cliente desde Mayo 2026</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Notificaciones</h3>
        <p className="text-sm text-muted-foreground">Las notificaciones por email están activas. Recibirás actualizaciones cuando haya cambios en tu proyecto.</p>
      </div>
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
