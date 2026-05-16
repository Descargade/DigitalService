import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, FileText, Upload, Download, Eye, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectFile {
  id: number;
  name: string;
  type: "image" | "document";
  size: string;
  status: "received" | "pending";
  date: string;
  from: "client" | "agency";
  preview?: string;
}

const MOCK_FILES: ProjectFile[] = [
  {
    id: 1,
    name: "logo_barberia.png",
    type: "image",
    size: "142 KB",
    status: "received",
    date: "10 May 2026",
    from: "client",
    preview: "logo",
  },
  {
    id: 2,
    name: "fotos_local.zip",
    type: "document",
    size: "8.4 MB",
    status: "received",
    date: "10 May 2026",
    from: "client",
  },
  {
    id: 3,
    name: "mockup_home.png",
    type: "image",
    size: "1.1 MB",
    status: "received",
    date: "12 May 2026",
    from: "agency",
    preview: "mockup",
  },
  {
    id: 4,
    name: "mockup_turnos.png",
    type: "image",
    size: "980 KB",
    status: "received",
    date: "12 May 2026",
    from: "agency",
    preview: "turnos",
  },
  {
    id: 5,
    name: "textos_web.docx",
    type: "document",
    size: "34 KB",
    status: "pending",
    date: "Pendiente",
    from: "client",
  },
];

const PREVIEW_COLORS: Record<string, string> = {
  logo: "from-violet-600 to-blue-500",
  mockup: "from-blue-600 to-cyan-500",
  turnos: "from-emerald-600 to-teal-500",
};

function FileIcon({ file }: { file: ProjectFile }) {
  if (file.type === "image" && file.preview) {
    return (
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${PREVIEW_COLORS[file.preview] || "from-primary to-accent"} flex items-center justify-center flex-shrink-0`}>
        <ImageIcon className="h-6 w-6 text-white" aria-hidden="true" />
      </div>
    );
  }
  if (file.type === "image") {
    return (
      <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
        <ImageIcon className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
      <FileText className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}

export function ProjectFiles() {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState(MOCK_FILES);

  const received = files.filter((f) => f.from === "client");
  const fromAgency = files.filter((f) => f.from === "agency");

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length === 0) return;
    const newFiles: ProjectFile[] = dropped.map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      type: f.type.startsWith("image/") ? "image" : "document",
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
      status: "received",
      date: new Date().toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }),
      from: "client",
    }));
    setFiles((prev) => [...newFiles, ...prev]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1">Archivos del proyecto</h2>
        <p className="text-sm text-muted-foreground">Acá encontrás todos los archivos compartidos en el proyecto.</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed transition-all duration-200 p-8 text-center cursor-pointer ${
          dragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-primary/5 bg-muted/20"
        }`}
        role="button"
        tabIndex={0}
        aria-label="Zona de carga de archivos"
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            dragging ? "bg-primary/20" : "bg-muted"
          }`}>
            <Upload className={`h-7 w-7 transition-colors ${dragging ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {dragging ? "Soltá los archivos acá" : "Arrastrá archivos aquí"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Logo, fotos, textos, referencias de diseño...
            </p>
          </div>
          <p className="text-xs text-muted-foreground">PNG, JPG, PDF, DOCX · máx. 20 MB</p>
        </div>
      </div>

      {/* Archivos del cliente */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
          Tus archivos ({received.length})
        </h3>
        <div className="space-y-3">
          <AnimatePresence>
            {received.map((file, i) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/60 hover:border-primary/30 transition-all group"
              >
                <FileIcon file={file} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{file.size}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-xs text-muted-foreground">{file.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === "received" ? (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Recibido
                    </span>
                  ) : (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      Pendiente
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Descargar ${file.name}`}
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Archivos de la agencia */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
          Archivos de 2bleA ({fromAgency.length})
        </h3>
        <div className="space-y-3">
          {fromAgency.map((file, i) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-primary/15 bg-primary/5 hover:border-primary/30 transition-all group"
            >
              <FileIcon file={file} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{file.size}</span>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-xs text-muted-foreground">{file.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-60 hover:opacity-100 transition-opacity"
                  aria-label={`Ver ${file.name}`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-60 hover:opacity-100 transition-opacity"
                  aria-label={`Descargar ${file.name}`}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
