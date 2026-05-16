import { useState } from "react";
import { useProjectData } from "@/hooks/useProjectStore";

const STORAGE_KEY = "2blea_portal_code";

export function usePortalSession() {
  const [code, setCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const project = useProjectData(code);

  const login = (newCode: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, newCode);
    } catch {}
    setCode(newCode);
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setCode(null);
  };

  return {
    code,
    project,
    isAuthenticated: !!project,
    login,
    logout,
  };
}
