'use client';

// A localStorage-shaped shim that mirrors keys into the current user's
// server-side character row via /api/character.
//
// Design goals:
// - Same synchronous getItem/setItem/removeItem contract as window.localStorage
//   so CharacterSheet.tsx can migrate via a straight find-and-replace.
// - Values are always strings, matching localStorage semantics.
// - PUT to /api/character is debounced and serialized (no overlapping writes).
// - A best-effort last save fires via sendBeacon on beforeunload.
// - On first server load, if the server row is empty and the browser has
//   legacy dnd-* keys in localStorage, they are migrated into the server.

const DND_KEY_PREFIX = 'dnd-';
const SAVE_DEBOUNCE_MS = 800;

type Listener = () => void;

const cache = new Map<string, string>();
let ready = false;
let inFlight = false;
let pending = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();
let beforeUnloadWired = false;

function notify() {
  for (const l of listeners) l();
}

function scheduleSave() {
  if (!ready) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(runSave, SAVE_DEBOUNCE_MS);
}

async function runSave() {
  if (!ready) return;
  if (inFlight) {
    pending = true;
    return;
  }
  inFlight = true;
  const snapshot: Record<string, string> = {};
  for (const [k, v] of cache) snapshot[k] = v;

  try {
    await fetch('/api/character', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: snapshot }),
      credentials: 'same-origin',
    });
  } catch {
    // Silent — a later change will retry via the next debounce.
  } finally {
    inFlight = false;
    if (pending) {
      pending = false;
      scheduleSave();
    }
  }
}

function wireBeforeUnload() {
  if (beforeUnloadWired) return;
  if (typeof window === 'undefined') return;
  beforeUnloadWired = true;
  window.addEventListener('beforeunload', () => {
    if (!ready) return;
    const snapshot: Record<string, string> = {};
    for (const [k, v] of cache) snapshot[k] = v;
    try {
      const blob = new Blob([JSON.stringify({ data: snapshot })], {
        type: 'application/json',
      });
      navigator.sendBeacon('/api/character', blob);
    } catch {
      // Ignore — best effort only.
    }
  });
}

/**
 * Populate the in-memory cache from the server. Runs once at app startup.
 * If the server row is empty AND the browser has legacy dnd-* keys, migrate
 * them into the cache and push them up in a single save.
 */
export async function loadFromServer(): Promise<void> {
  wireBeforeUnload();
  let serverData: Record<string, unknown> = {};
  try {
    const res = await fetch('/api/character', { credentials: 'same-origin' });
    if (res.ok) {
      const body = await res.json();
      if (body?.data && typeof body.data === 'object') {
        serverData = body.data as Record<string, unknown>;
      }
    }
  } catch {
    // Fall through with empty server data — cache stays empty, UI still boots.
  }

  cache.clear();
  for (const [k, v] of Object.entries(serverData)) {
    if (typeof v === 'string') cache.set(k, v);
  }

  const serverIsEmpty = cache.size === 0;
  if (serverIsEmpty && typeof window !== 'undefined') {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(DND_KEY_PREFIX)) continue;
      const val = window.localStorage.getItem(key);
      if (val !== null) cache.set(key, val);
    }
  }

  ready = true;
  notify();

  if (serverIsEmpty && cache.size > 0) {
    scheduleSave();
  }
}

export const syncedStorage = {
  getItem(key: string): string | null {
    if (!ready) return null;
    return cache.has(key) ? cache.get(key)! : null;
  },
  setItem(key: string, value: string): void {
    if (!ready) return;
    const stringValue = typeof value === 'string' ? value : String(value);
    if (cache.get(key) === stringValue) return;
    cache.set(key, stringValue);
    scheduleSave();
  },
  removeItem(key: string): void {
    if (!ready) return;
    if (!cache.has(key)) return;
    cache.delete(key);
    scheduleSave();
  },
  clear(): void {
    if (!ready) return;
    if (cache.size === 0) return;
    cache.clear();
    scheduleSave();
  },
  isReady(): boolean {
    return ready;
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  __flush(): Promise<void> {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    return runSave();
  },
};
