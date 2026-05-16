import { PROJECTS, VALID_CODES } from "@/data/projects";
import type { ProjectData, ProjectMessage } from "@/data/projects";

export const STORE_EVENT = "2blea-store-update";

function dispatch() {
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

export function saveOverride(code: string, override: ProjectOverride) {
  const all = getOverrides();
  storageSet(OVERRIDES_KEY, { ...all, [code]: { ...(all[code] ?? {}), ...override } });
  dispatch();
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

export function getMessages(code: string): ProjectMessage[] {
  return storageGet<ProjectMessage[]>(msgKey(code)) ?? PROJECTS[code]?.messages ?? [];
}

export function addMessage(code: string, msg: ProjectMessage) {
  const msgs = getMessages(code);
  storageSet(msgKey(code), [...msgs, msg]);
  dispatch();
}

export function resetMessages(code: string) {
  try {
    localStorage.removeItem(msgKey(code));
  } catch {}
  dispatch();
}

// ─── Derived full project data ─────────────────────────────────────────────────

export function getProjectData(code: string): ProjectData | null {
  const base = PROJECTS[code];
  if (!base) return null;
  const overrides = getOverrides()[code] ?? {};
  const messages = getMessages(code);
  return { ...base, ...overrides, messages };
}

export function getAllProjectData(): ProjectData[] {
  return VALID_CODES.map((code) => getProjectData(code)!).filter(Boolean);
}

// ─── Admin session ─────────────────────────────────────────────────────────────

const ADMIN_KEY = "2blea_admin";
const ADMIN_CREDENTIALS = { username: "admin", password: "2blea2026" };

export function adminLogin(username: string, password: string): boolean {
  if (
    username.trim() === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    storageSet(ADMIN_KEY, true);
    return true;
  }
  return false;
}

export function adminLogout() {
  try {
    localStorage.removeItem(ADMIN_KEY);
  } catch {}
}

export function isAdminAuthenticated(): boolean {
  return storageGet<boolean>(ADMIN_KEY) === true;
}
