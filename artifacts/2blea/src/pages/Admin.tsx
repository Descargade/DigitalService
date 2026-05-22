import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  LayoutDashboard, Users, MessageSquare, LogOut, ShieldCheck, ArrowLeft, Menu, X,
} from "lucide-react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ClientList } from "@/components/admin/ClientList";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { MessageComposer } from "@/components/admin/MessageComposer";
import { useAllProjects } from "@/hooks/useProjectStore";
import { isAdminAuthenticated, adminLogout } from "@/lib/store";
import { CreateProjectModal } from "@/components/admin/CreateProjectModal";

const NAV = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "clients", icon: Users, label: "Clientes" },
  { id: "messages", icon: MessageSquare, label: "Mensajes" },
];

export default function Admin() {
  const [authed, setAuthed] = useState(() => isAdminAuthenticated());
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const projects = useAllProjects();

  const handleLogout = () => {
    adminLogout();
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  const editingProject = editingCode ? projects.find((p) => p.code === editingCode) ?? null : null;

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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">2A</span>
            </div>
            <div>
              <p className="font-bold text-foreground leading-none">2bleA</p>
              <p className="text-xs text-muted-foreground mt-0.5">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Admin badge */}
        <div className="mx-4 mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/8 border border-orange-500/15">
          <ShieldCheck className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" aria-hidden="true" />
          <span className="text-xs text-orange-300 font-medium">Administrador</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 mt-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === item.id
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al sitio
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/8 transition-colors"
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              {sidebarOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
            <div>
              <h1 className="text-lg font-bold">
                {tab === "dashboard" && "Dashboard"}
                {tab === "clients" && "Clientes"}
                {tab === "messages" && "Mensajes"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{projects.length} proyectos activos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreatingProject(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              + Nuevo Proyecto
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-300">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" aria-hidden="true" />
              Admin
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-xs font-bold select-none">
              AD
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            {tab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <AdminDashboard projects={projects} />
              </motion.div>
            )}
            {tab === "clients" && (
              <motion.div
                key="clients"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <ClientList projects={projects} onEdit={(code) => setEditingCode(code)} />
              </motion.div>
            )}
            {tab === "messages" && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <MessageComposer projects={projects} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Project editor drawer */}
      <AnimatePresence>
        {editingProject && (
          <ProjectEditor
            key={editingProject.code}
            project={editingProject}
            onClose={() => setEditingCode(null)}
          />
        )}
      </AnimatePresence>
      {creatingProject && (
        <CreateProjectModal
          onClose={() => setCreatingProject(false)}
        />
      )}
    </div>
  );
}
