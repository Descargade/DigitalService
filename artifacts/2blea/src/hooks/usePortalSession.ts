import { useState, useEffect, useRef } from "react";
import { getMyProject } from "@/lib/api";
import {
  getStoredPortalCode,
  portalLogin,
  portalLogout,
  getProjectData,
} from "@/lib/store";
import type { ProjectData } from "@/data/projects";

export function usePortalSession() {
  const [code, setCode] = useState<string | null>(() => getStoredPortalCode());
  const [project, setProject] = useState<ProjectData | null>(() => {
    const storedCode = getStoredPortalCode();
    return storedCode ? getProjectData(storedCode) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshed = useRef(false);

  // On mount, if we have a stored token try to refresh project data from API
  useEffect(() => {
    if (code && !refreshed.current) {
      refreshed.current = true;
      getMyProject()
        .then((p) => setProject(p as unknown as ProjectData))
        .catch(() => {
          // Keep the local/cached project data
        });
    }
  }, [code]);

  const login = async (newCode: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await portalLogin(newCode);
      if (result) {
        const normalized = newCode.trim().toUpperCase();
        setCode(normalized);
        setProject(result);
        return true;
      } else {
        setError("Código inválido. Verificá que sea correcto.");
        return false;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al verificar código";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    portalLogout();
    refreshed.current = false;
    setCode(null);
    setProject(null);
    setError(null);
  };

  return {
    code,
    project,
    isAuthenticated: !!project,
    loading,
    error,
    login,
    logout,
  };
}
