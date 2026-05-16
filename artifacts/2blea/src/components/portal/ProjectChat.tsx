import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addMessage } from "@/lib/store";
import type { ProjectData } from "@/data/projects";

interface Props {
  project: ProjectData;
}

export function ProjectChat({ project }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!isTypingRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [project.messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const timeStr = `${now.getDate()} May · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    addMessage(project.code, {
      id: Date.now(),
      from: "client",
      text,
      time: timeStr,
    });
    setInput("");
    isTypingRef.current = false;

    setTimeout(() => {
      addMessage(project.code, {
        id: Date.now() + 1,
        from: "agency",
        text: "Recibimos tu mensaje. Te respondemos a la brevedad. ¡Gracias!",
        time: timeStr,
      });
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1">Mensajes</h2>
        <p className="text-sm text-muted-foreground">Comunicación directa con el equipo de 2bleA.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 overflow-hidden flex flex-col" style={{ height: "520px" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-card/80">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Bot className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-sm">Equipo 2bleA</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">En línea</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <AnimatePresence initial={false}>
            {project.messages.map((msg) => {
              const isClient = msg.from === "client";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.22 }}
                  className={`flex items-end gap-2 ${isClient ? "justify-end" : "justify-start"}`}
                >
                  {!isClient && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mb-1">
                      <span className="text-white text-xs font-bold">2A</span>
                    </div>
                  )}
                  <div className={`max-w-[75%] ${isClient ? "order-first" : ""}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isClient
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${isClient ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </p>
                  </div>
                  {isClient && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mb-1">
                      <span className="text-white text-xs font-bold">{project.clientInitials}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border bg-card/80">
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2">
            <Input
              data-testid="input-chat-message"
              value={input}
              onChange={(e) => { setInput(e.target.value); isTypingRef.current = true; }}
              placeholder="Escribí tu mensaje..."
              className="flex-1 bg-muted/50 border-border focus:border-primary text-sm h-10"
              aria-label="Escribir mensaje"
            />
            <Button
              type="submit"
              data-testid="button-chat-send"
              size="sm"
              disabled={!input.trim()}
              className="h-10 w-10 p-0 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 disabled:opacity-40 flex-shrink-0"
              aria-label="Enviar mensaje"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
