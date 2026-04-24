export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}

const BASE = '/api/notes';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || `Request failed with status ${res.status}`);
  }

  // DELETE returns 204 No Content
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export const notesApi = {
  list: () => request<Note[]>(BASE),
  create: (input: CreateNoteInput) =>
    request<Note>(BASE, { method: 'POST', body: JSON.stringify(input) }),
  remove: (id: string) => request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
};
