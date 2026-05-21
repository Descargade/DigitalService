import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, CheckCircle2 } from "lucide-react";
import { addMessage, getLocalMessages } from "@/lib/store";
import type { ProjectData } from "@/data/projects";

interface Props {
  projects: ProjectData[];
}

export function MessageComposer({ projects }: Props) {
  const [selectedCode, setSelectedCode] = useState(projects[0]?.code ?? "");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const selectedProject = projects.find((p) => p.code === selectedCode);
  const messages = selectedProject ? getLocalMessages(selectedCode) : [];
  const agencyMessages = messages.filter((m) => m.from === "agency").slice(-5).reverse();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !selectedCode) return;
    const now = new Date();
    const timeStr = `${now.getDate()} May · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    addMessage(selectedCode, {
      id: Date.now(),
      from: "agency",
      text: trimmed,
      time: timeStr,
      read: false,
    });
    setText("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mensajes</h2>
        <p className="text-muted-foreground text-sm mt-1">Enviá mensajes que aparecen en el chat del portal del cliente.</p>
      </div>

      {/* Project selector */}
      <div className="flex flex-wrap gap-2">
        {projects.map((p) => (
          <button
            key={p.code}
            onClick={() => setSelectedCode(p.code)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              selectedCode === p.code
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-card/60 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              selectedCode === p.code ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}>
              {p.clientInitials}
            </div>
            {p.clientName}
          </button>
        ))}
      </div>

      {selectedProject && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Composer */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Enviando como: Equipo 2bleA</p>
                  <p className="text-xs text-muted-foreground">→ {selectedProject.clientName} ({selectedProject.projectName})</p>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend(); }}
                placeholder="Escribí el mensaje para el cliente… (Ctrl+Enter para enviar)"
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary/60 focus:ring-2 focus:ring-primary/20 text-sm resize-none text-foreground placeholder:text-muted-foreground focus:outline-none transition-all"
                aria-label="Mensaje para el cliente"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-500/20"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Enviar mensaje
                </button>

                <AnimatePresence>
                  {sent && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      ¡Mensaje enviado!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <p className="text-xs text-muted-foreground">
                Este mensaje aparecerá inmediatamente en el chat del portal de <strong>{selectedProject.clientName}</strong>.
              </p>
            </div>
          </div>

          {/* Recent messages from agency */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Últimos mensajes enviados a este cliente
            </h3>
            {agencyMessages.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">No hay mensajes previos.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {agencyMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-primary/15 bg-primary/5 p-4"
                  >
                    <p className="text-sm text-foreground">{msg.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">{msg.time}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
