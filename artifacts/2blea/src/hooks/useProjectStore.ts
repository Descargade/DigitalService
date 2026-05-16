import { useState, useEffect } from "react";
import { getProjectData, getAllProjectData, STORE_EVENT } from "@/lib/store";
import type { ProjectData } from "@/data/projects";

export function useProjectData(code: string | null): ProjectData | null {
  const [data, setData] = useState<ProjectData | null>(
    () => (code ? getProjectData(code) : null)
  );

  useEffect(() => {
    if (!code) { setData(null); return; }
    setData(getProjectData(code));
    const handler = () => setData(getProjectData(code));
    window.addEventListener(STORE_EVENT, handler);
    return () => window.removeEventListener(STORE_EVENT, handler);
  }, [code]);

  return data;
}

export function useAllProjects(): ProjectData[] {
  const [data, setData] = useState<ProjectData[]>(() => getAllProjectData());

  useEffect(() => {
    const handler = () => setData(getAllProjectData());
    window.addEventListener(STORE_EVENT, handler);
    return () => window.removeEventListener(STORE_EVENT, handler);
  }, []);

  return data;
}
