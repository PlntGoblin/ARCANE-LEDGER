'use client';

// A localStorage-shaped shim that mirrors keys into the current user's
// server-side character row via /api/character.
//
// Design goals:
// - Same synchronous getItem/setItem/removeItem contract as window.localStorage
//   so CharacterSheet.tsx can migrate via a straight find-and-replace.
// - Values are always strings, matching localStorage semantics.
// - PUT to /api/character is debounced and serialized (no overlapping writes),
//   with a retry on failure so transient errors don't drop edits.
// - A best-effort last save fires via sendBeacon on beforeunload (the API
//   exposes POST as an alias of PUT because beacons can only POST).
// - On first successful server load, if the row is empty and the browser has
//   legacy dnd-* keys in localStorage, they are migrated up exactly once
//   (guarded by a marker so stale data can't hijack later fresh accounts).

const DND_KEY_PREFIX = 'dnd-';
const MIGRATED_MARKER = 'dnd-migrated-to-server';
const SAVE_DEBOUNCE_MS = 800;
const SAVE_RETRY_MS = 5000;

// Bump when public/master-spell-list.json ships a meaningful data change (new
// spells, enriched Effect bodies, renames). The seed logic re-fetches the
// bundled file when the stored version doesn't match, so every user picks up
// the update on their next load instead of being stuck on the copy they cached
// when they first signed up.
const BUNDLED_SPELL_LIST_VERSION = '2';
const SPELL_LIST_VERSION_KEY = 'dnd-master-spell-list-version';

type Listener = () => void;

const cache = new Map<string, string>();
let ready = false;
let inFlight = false;
let pending = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let loadPromise: Promise<boolean> | null = null;
const listeners = new Set<Listener>();
let beforeUnloadWired = false;

function notify() {
  for (const l of listeners) l();
}

function scheduleSave(delay = SAVE_DEBOUNCE_MS) {
  if (!ready) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(runSave, delay);
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

  let ok = false;
  try {
    const res = await fetch('/api/character', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: snapshot }),
      credentials: 'same-origin',
    });
    ok = res.ok;
  } catch {
    ok = false;
  }
  inFlight = false;

  if (!ok) {
    // Transient failure or expired session — retry until it lands. Edits
    // keep accumulating in the cache, so the retry always sends the latest.
    pending = false;
    scheduleSave(SAVE_RETRY_MS);
    return;
  }

  if (pending) {
    pending = false;
    scheduleSave();
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
 * Populate the in-memory cache from the server. Memoized so StrictMode's
 * double-effect (or multiple gates) can't run two loads concurrently.
 * Returns true when the server load succeeded; false means the caller should
 * offer a retry and MUST NOT let the app write, or stale/empty data could
 * clobber the user's real character.
 */
export function loadFromServer(): Promise<boolean> {
  if (loadPromise) return loadPromise;
  loadPromise = doLoad();
  return loadPromise;
}

async function doLoad(): Promise<boolean> {
  wireBeforeUnload();

  let serverData: Record<string, unknown> | null = null;
  try {
    const res = await fetch('/api/character', { credentials: 'same-origin' });
    if (res.ok) {
      const body = await res.json();
      serverData =
        body?.data && typeof body.data === 'object' ? (body.data as Record<string, unknown>) : {};
    }
  } catch {
    serverData = null;
  }

  if (serverData === null) {
    // Load failed — do NOT mark ready, do NOT migrate, do NOT save.
    // Allow a later retry.
    loadPromise = null;
    return false;
  }

  cache.clear();
  for (const [k, v] of Object.entries(serverData)) {
    if (typeof v === 'string') cache.set(k, v);
  }

  const serverIsEmpty = cache.size === 0;
  let migrated = false;
  if (serverIsEmpty && typeof window !== 'undefined') {
    const alreadyMigrated = window.localStorage.getItem(MIGRATED_MARKER) === '1';
    if (!alreadyMigrated) {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (!key || !key.startsWith(DND_KEY_PREFIX)) continue;
        const val = window.localStorage.getItem(key);
        if (val !== null) cache.set(key, val);
      }
      migrated = cache.size > 0;
    }
  }

  // Seed the bundled master spell list if the user has none yet, OR if the
  // bundled data has been bumped to a newer version than what they have. Ships
  // in public/master-spell-list.json so new signups don't have to import it,
  // and existing users pick up spell-data updates on their next load.
  const storedVersion = cache.get(SPELL_LIST_VERSION_KEY);
  const needsSeed =
    !cache.has('dnd-master-spell-list') || storedVersion !== BUNDLED_SPELL_LIST_VERSION;
  if (needsSeed) {
    try {
      const res = await fetch('/master-spell-list.json', { cache: 'no-cache' });
      if (res.ok) {
        const text = await res.text();
        JSON.parse(text); // sanity — skip seeding if the asset is corrupt
        cache.set('dnd-master-spell-list', text);
        cache.set(SPELL_LIST_VERSION_KEY, BUNDLED_SPELL_LIST_VERSION);
      }
    } catch {
      // Fall through — user just won't have a default spell list.
    }
  }

  ready = true;
  notify();

  if (migrated && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(MIGRATED_MARKER, '1');
    } catch {
      // Marker is best-effort.
    }
  }

  if (serverIsEmpty && cache.size > 0) {
    scheduleSave();
  }
  return true;
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
