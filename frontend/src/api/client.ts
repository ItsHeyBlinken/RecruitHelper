import type { Contact, DivisionFilter, School, SchoolStats } from "../types";

const API_BASE = "/api";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function getSchoolStats(): Promise<SchoolStats> {
  return fetchJson<SchoolStats>(`${API_BASE}/schools/stats`);
}

export function listSchools(
  division: DivisionFilter = "ALL",
  state?: string,
): Promise<School[]> {
  const params = new URLSearchParams();
  if (division !== "ALL") {
    params.set("division", division);
  }
  if (state) {
    params.set("state", state);
  }
  const query = params.toString();
  return fetchJson<School[]>(`${API_BASE}/schools${query ? `?${query}` : ""}`);
}

export function searchSchools(query: string, division: DivisionFilter = "ALL"): Promise<School[]> {
  const params = new URLSearchParams({ q: query });
  if (division !== "ALL") {
    params.set("division", division);
  }
  return fetchJson<School[]>(`${API_BASE}/schools/search?${params}`);
}

export function getSchool(id: number): Promise<School> {
  return fetchJson<School>(`${API_BASE}/schools/${id}`);
}

export function getSchoolContacts(id: number): Promise<Contact[]> {
  return fetchJson<Contact[]>(`${API_BASE}/schools/${id}/contacts`);
}
