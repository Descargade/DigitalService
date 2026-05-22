import { useState } from "react";
import { createProject } from "@/lib/store";

interface Props {
  onClose: () => void;
}

export function CreateProjectModal({ onClose }: Props) {
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!clientName.trim() || !projectName.trim() || !projectType.trim() || !deliveryDate.trim()) {
      setError("Completá todos los campos antes de continuar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createProject({ clientName, projectName, projectType, deliveryDate });
      setClientName("");
      setProjectName("");
      setProjectType("");
      setDeliveryDate("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold">Nuevo Proyecto</h2>
          <p className="text-sm text-muted-foreground">
            Crear nuevo cliente/proyecto
          </p>
        </div>

        <input
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Nombre cliente"
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border disabled:opacity-50"
        />

        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Nombre proyecto"
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border disabled:opacity-50"
        />

        <input
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          placeholder="Tipo proyecto (ej: Landing Page, E-commerce)"
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl bg-background border border-border disabled:opacity-50"
        />

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground px-1">Fecha de entrega</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border disabled:opacity-50"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-border disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando…
              </>
            ) : (
              "Crear Proyecto"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
