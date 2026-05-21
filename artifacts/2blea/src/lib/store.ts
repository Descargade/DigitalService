import { PROJECTS, VALID_CODES } from "@/data/projects";
import type { ProjectData, ProjectMessage, Payment } from "@/data/projects";
import {
  portalAuth,
  setPortalToken,
  clearPortalToken,
  adminAuthApi,
  setAdminToken,
  clearAdminToken,
  updateProjectApi,
  addMessageApi,
} from "@/lib/api";

export const STORE_EVENT = "2blea-store-update";

export function dispatch() {
  window.dispatchEvent(new CustomEvent(STORE_EVENT));
}

function storageGet<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function storageSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ─── Overrides (progress, stage, status, payments, deliveryDate) ───────────────

const OVERRIDES_KEY = "2blea_overrides";

type ProjectOverride = Partial<
  Pick<ProjectData, "progress" | "currentStage" | "status" | "deliveryDate" | "payments">
>;

function getOverrides(): Record<string, ProjectOverride> {
  return storageGet<Record<string, ProjectOverride>>(OVERRIDES_KEY) ?? {};
}

export async function saveOverride(code: string, override: ProjectOverride) {
  // Optimistic local update
  const all = getOverrides();
  storageSet(OVERRIDES_KEY, { ...all, [code]: { ...(all[code] ?? {}), ...override } });
  dispatch();

  // Persist to backend
  try {
    await updateProjectApi(code, override);
    dispatch();
  } catch {
    // Silently keep local state if API fails
  }
}

export function resetOverride(code: string) {
  const all = getOverrides();
  const { [code]: _removed, ...rest } = all;
  storageSet(OVERRIDES_KEY, rest);
  dispatch();
}

// ─── Messages ──────────────────────────────────────────────────────────────────

function msgKey(code: string) {
  return `2blea_msgs_${code}`;
}

export function getLocalMessages(code: string): ProjectMessage[] {
  return storageGet<ProjectMessage[]>(msgKey(code)) ?? PROJECTS[code]?.messages ?? [];
}

export async function addMessage(code: string, msg: ProjectMessage) {
  // Optimistic local update
  const msgs = getLocalMessages(code);
  storageSet(msgKey(code), [...msgs, msg]);
  dispatch();

  // Persist to backend
  try {
    const saved = await addMessageApi(
      code,
      msg.text,
      msg.from as "client" | "agency"
    );
    // Update local with server-assigned id
    const updated = getLocalMessages(code).map((m) =>
      m.text === saved.text && m.from === saved.from ? { ...m, id: saved.id as unknown as number } : m
    );
    storageSet(msgKey(code), updated);
    dispatch();
  } catch {
    // Keep optimistic state
  }
}

export function resetMessages(code: string) {
  try {
    localStorage.removeItem(msgKey(code));
  } catch {}
  dispatch();
}

// ─── Derived full project data (local/fallback) ─────────────────────────────────

export function getProjectData(code: string): ProjectData | null {
  const base = PROJECTS[code];
  if (!base) return null;
  const overrides = getOverrides()[code] ?? {};
  const messages = getLocalMessages(code);
  return { ...base, ...overrides, messages };
}

export function getAllProjectData(): ProjectData[] {
  return VALID_CODES.map((code) => getProjectData(code)!).filter(Boolean);
}

// ─── Portal session ─────────────────────────────────────────────────────────────

const PORTAL_CODE_KEY = "2blea_portal_code";

export function getStoredPortalCode(): string | null {
  try {
    return localStorage.getItem(PORTAL_CODE_KEY);
  } catch {
    return null;
  }
}

export async function portalLogin(code: string): Promise<ProjectData | null> {
  const normalized = code.trim().toUpperCase();
  try {
    const { token, project } = await portalAuth(normalized);
    setPortalToken(token);
    localStorage.setItem(PORTAL_CODE_KEY, normalized);
    return project as unknown as ProjectData;
  } catch {
    // Fallback: check locally
    if (VALID_CODES.includes(normalized)) {
      localStorage.setItem(PORTAL_CODE_KEY, normalized);
      return getProjectData(normalized);
    }
    return null;
  }
}

export function portalLogout() {
  clearPortalToken();
  try {
    localStorage.removeItem(PORTAL_CODE_KEY);
  } catch {}
}

// ─── Admin session ─────────────────────────────────────────────────────────────

const ADMIN_KEY = "2blea_admin";
const ADMIN_TOKEN_LEGACY = "2blea_admin_token";

export async function adminLogin(username: string, password: string): Promise<boolean> {
  try {
    const { token } = await adminAuthApi(username, password);
    setAdminToken(token);
    storageSet(ADMIN_KEY, true);
    return true;
  } catch {
    // Fallback to local credentials for dev/demo
    if (username.trim() === "admin" && password === "2blea2026") {
      storageSet(ADMIN_KEY, true);
      return true;
    }
    return false;
  }
}

export function adminLogout() {
  clearAdminToken();
  try {
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_LEGACY);
  } catch {}
}

export function isAdminAuthenticated(): boolean {
  return storageGet<boolean>(ADMIN_KEY) === true;
}
