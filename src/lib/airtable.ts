const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = 'appNtz7nZG1UfPv4a';

export const TABLES = {
  ELEVES: 'tbll5MlIcTSqCOLEJ',
  MESURES: 'tbltPTb2ybigc8FDJ',
  BCG: 'BCG',
  WORKOUT: 'Workout',
  PLAN_ALIMENTAIRE: 'Plan Alimentaire',
  EBOOK: 'Ebook',
};

export async function airtableFetch(tableId: string, params?: Record<string, string>) {
  const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Airtable error: ${res.status}`);
  return res.json();
}

export async function airtableFetchAll(tableId: string, params?: Record<string, string>) {
  let allRecords: any[] = [];
  let offset: string | undefined;

  do {
    const queryParams: Record<string, string> = { pageSize: '100', ...params };
    if (offset) queryParams.offset = offset;

    const data = await airtableFetch(tableId, queryParams);
    allRecords = [...allRecords, ...data.records];
    offset = data.offset;
  } while (offset);

  return allRecords;
}

// Session helpers
const SESSION_KEY = 'coachApp_session';

export interface SessionData {
  eleveId: string;
  eleveName: string;
  eleveCode: string;
  eleveIDU: string;
}

export function getSession(): SessionData | null {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setSession(session: SessionData) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
