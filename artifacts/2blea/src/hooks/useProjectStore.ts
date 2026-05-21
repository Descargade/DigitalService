import { useState, useEffect, useCallback } from "react";
import { getProjectData, getAllProjectData, STORE_EVENT } from "@/lib/store";
import { getMyProject, getAllProjectsApi, getAdminToken } from "@/lib/api";
import type { ProjectData } from "@/data/projects";

export function useProjectData(code: string | null): ProjectData | null {
  const [data, setData] = useState<ProjectData | null>(
    () => (code ? getProjectData(code) : null)
  );

  const fetchFromApi = useCallback(async (c: string) => {
    try {
      const project = await getMyProject();
      setData(project as unknown as ProjectData);
    } catch {
      setData(getProjectData(c));
    }
  }, []);

  useEffect(() => {
    if (!code) {
      setData(null);
      return;
    }
    setData(getProjectData(code));
    fetchFromApi(code);

    const handler = () => {
      setData(getProjectData(code));
      fetchFromApi(code);
    };
    window.addEventListener(STORE_EVENT, handler);
    return () => window.removeEventListener(STORE_EVENT, handler);
  }, [code, fetchFromApi]);

  return data;
}

export function useAllProjects(): ProjectData[] {
  const [data, setData] = useState<ProjectData[]>(() => getAllProjectData());

  const fetchFromApi = useCallback(async () => {
    try {
      const token = getAdminToken();
      if (!token) return;
      const projects = await getAllProjectsApi();
      setData(projects as unknown as ProjectData[]);
    } catch {
      setData(getAllProjectData());
    }
  }, []);

  useEffect(() => {
    fetchFromApi();
    const handler = () => {
      setData(getAllProjectData());
      fetchFromApi();
    };
    window.addEventListener(STORE_EVENT, handler);
    return () => window.removeEventListener(STORE_EVENT, handler);
  }, [fetchFromApi]);

  return data;
}
