import type { ProjectData, ProjectMessage, ProjectFile, Payment } from "@/data/projects";

const BASE = "/api";

const PORTAL_TOKEN_KEY = "2blea_portal_token";
const ADMIN_TOKEN_KEY = "2blea_admin_token";

export function getPortalToken(): string | null {
  try {
    return localStorage.getItem(PORTAL_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setPortalToken(token: string) {
  try {
    localStorage.setItem(PORTAL_TOKEN_KEY, token);
  } catch {}
}

export function clearPortalToken() {
  try {
    localStorage.removeItem(PORTAL_TOKEN_KEY);
  } catch {}
}

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string) {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {}
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {}
}

async function request<T>(
  path: string,
  options?: RequestInit,
  auth?: "portal" | "admin"
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth === "portal") {
    const token = getPortalToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  } else if (auth === "admin") {
    const token = getAdminToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> | undefined) },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export type ApiProjectData = ProjectData;

export async function portalAuth(code: string): Promise<{ token: string; project: ApiProjectData }> {
  return request<{ token: string; project: ApiProjectData }>("/portal/auth", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function getMyProject(): Promise<ApiProjectData> {
  return request<ApiProjectData>("/portal/me", undefined, "portal");
}

export async function adminAuthApi(
  username: string,
  password: string
): Promise<{ token: string; username: string }> {
  return request<{ token: string; username: string }>("/admin/auth", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function getAllProjectsApi(): Promise<ApiProjectData[]> {
  return request<ApiProjectData[]>("/admin/projects", undefined, "admin");
}

export async function updateProjectApi(
  code: string,
  data: {
    progress?: number;
    currentStage?: number;
    status?: string;
    deliveryDate?: string;
    payments?: Payment[];
  }
): Promise<ApiProjectData> {
  return request<ApiProjectData>(`/admin/projects/${code}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }, "admin");
}

export async function getMessagesApi(code: string): Promise<ProjectMessage[]> {
  return request<ProjectMessage[]>(`/messages/${code}`, undefined, "portal");
}

export async function addMessageApi(
  code: string,
  text: string,
  fromRole: "client" | "agency"
): Promise<ProjectMessage> {
  return request<ProjectMessage>(`/messages/${code}`, {
    method: "POST",
    body: JSON.stringify({ text, fromRole }),
  }, fromRole === "agency" ? "admin" : "portal");
}
