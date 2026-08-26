// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Each test gets a fresh module instance so the internal `cache`, `ready`,
// `loadPromise` etc. don't leak between cases.
async function freshModule() {
  vi.resetModules();
  return await import('./syncedStorage');
}

// Convenience: build a Response-shape object for our fetch mock.
function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  const ok = init.ok ?? true;
  const status = init.status ?? (ok ? 200 : 500);
  return {
    ok,
    status,
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  };
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  window.localStorage.clear();
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('loadFromServer', () => {
  it('returns true and hydrates cache when the GET succeeds', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: { 'dnd-active-tab': '"Stats"' } }));
    fetchMock.mockResolvedValueOnce(jsonResponse('[]')); // spell list seed

    const mod = await freshModule();
    const ok = await mod.loadFromServer();

    expect(ok).toBe(true);
    expect(mod.syncedStorage.isReady()).toBe(true);
    expect(mod.syncedStorage.getItem('dnd-active-tab')).toBe('"Stats"');
  });

  it('returns false and stays not-ready when the GET throws (network error)', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline'));

    const mod = await freshModule();
    const ok = await mod.loadFromServer();

    expect(ok).toBe(false);
    expect(mod.syncedStorage.isReady()).toBe(false);
  });

  it('returns false and stays not-ready when the GET returns non-ok', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(null, { ok: false, status: 500 }));

    const mod = await freshModule();
    const ok = await mod.loadFromServer();

    expect(ok).toBe(false);
    expect(mod.syncedStorage.isReady()).toBe(false);
  });

  it('does NOT schedule a PUT after a failed load (data-loss guard)', async () => {
    vi.useFakeTimers();
    fetchMock.mockRejectedValueOnce(new Error('offline'));

    const mod = await freshModule();
    await mod.loadFromServer();

    // Fast-forward well past any possible debounce.
    await vi.advanceTimersByTimeAsync(10_000);

    // Only the failed GET should have been attempted — never a PUT.
    const puts = fetchMock.mock.calls.filter((c) => (c[1] as { method?: string } | undefined)?.method === 'PUT');
    expect(puts).toHaveLength(0);
  });

  it('memoizes concurrent load calls (StrictMode double-effect)', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: {} }));
    fetchMock.mockResolvedValueOnce(jsonResponse('[]')); // spell list seed

    const mod = await freshModule();
    const [a, b] = await Promise.all([mod.loadFromServer(), mod.loadFromServer()]);

    expect(a).toBe(true);
    expect(b).toBe(true);
    // Server GET should only fire once even with two concurrent callers.
    const gets = fetchMock.mock.calls.filter((c) => {
      const method = (c[1] as { method?: string } | undefined)?.method;
      return c[0] === '/api/character' && (!method || method === 'GET');
    });
    expect(gets).toHaveLength(1);
  });
});

describe('localStorage migration', () => {
  it('migrates legacy dnd-* keys to the cache when the server row is empty', async () => {
    window.localStorage.setItem('dnd-character-data', '{"name":"Elara"}');
    window.localStorage.setItem('dnd-active-tab', '"Stats"');
    window.localStorage.setItem('not-dnd-key', 'ignored');
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: {} })); // empty server
    fetchMock.mockResolvedValueOnce(jsonResponse('[]')); // spell list seed

    const mod = await freshModule();
    await mod.loadFromServer();

    expect(mod.syncedStorage.getItem('dnd-character-data')).toBe('{"name":"Elara"}');
    expect(mod.syncedStorage.getItem('dnd-active-tab')).toBe('"Stats"');
    expect(mod.syncedStorage.getItem('not-dnd-key')).toBe(null);
  });

  it('writes the dnd-migrated-to-server marker after a successful migration', async () => {
    vi.useFakeTimers();
    window.localStorage.setItem('dnd-character-data', '{"name":"Elara"}');
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: {} }));
    fetchMock.mockResolvedValueOnce(jsonResponse('[]'));

    const mod = await freshModule();
    await mod.loadFromServer();
    await vi.advanceTimersByTimeAsync(2000); // let the scheduled save fire

    expect(window.localStorage.getItem('dnd-migrated-to-server')).toBe('1');
  });

  it('skips migration when the marker is already present (stale-data hijack guard)', async () => {
    window.localStorage.setItem('dnd-migrated-to-server', '1');
    window.localStorage.setItem('dnd-character-data', '{"name":"OldElara"}');
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: {} })); // empty new account
    fetchMock.mockResolvedValueOnce(jsonResponse('[]')); // spell list seed

    const mod = await freshModule();
    await mod.loadFromServer();

    // Marker present → stale localStorage must not leak into the new account.
    expect(mod.syncedStorage.getItem('dnd-character-data')).toBe(null);
  });

  it('does NOT migrate when the server already has data', async () => {
    window.localStorage.setItem('dnd-character-data', '{"name":"StaleElara"}');
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ data: { 'dnd-character-data': '{"name":"RealElara"}' } })
    );

    const mod = await freshModule();
    await mod.loadFromServer();

    // Server data must win — legacy localStorage stays out of the cache.
    expect(mod.syncedStorage.getItem('dnd-character-data')).toBe('{"name":"RealElara"}');
  });
});

describe('spell list seeding', () => {
  it('fetches the bundled master spell list when the user has none', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: {} })); // empty server
    fetchMock.mockResolvedValueOnce(jsonResponse('[{"Name":"Fireball"}]')); // spell list

    const mod = await freshModule();
    await mod.loadFromServer();

    expect(mod.syncedStorage.getItem('dnd-master-spell-list')).toBe('[{"Name":"Fireball"}]');
  });

  it('does NOT overwrite an existing spell list', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ data: { 'dnd-master-spell-list': '[{"Name":"Custom"}]' } })
    );

    const mod = await freshModule();
    await mod.loadFromServer();

    expect(mod.syncedStorage.getItem('dnd-master-spell-list')).toBe('[{"Name":"Custom"}]');
    // Only the GET should have fired — no spell-list fetch.
    const spellFetches = fetchMock.mock.calls.filter((c) => c[0] === '/master-spell-list.json');
    expect(spellFetches).toHaveLength(0);
  });
});

describe('save behavior', () => {
  it('debounces rapid setItem calls into a single PUT', async () => {
    vi.useFakeTimers();
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: {} }));
    fetchMock.mockResolvedValueOnce(jsonResponse('[]'));
    fetchMock.mockResolvedValue(jsonResponse({ ok: true })); // subsequent PUTs

    const mod = await freshModule();
    await mod.loadFromServer();

    mod.syncedStorage.setItem('dnd-active-tab', '"Stats"');
    mod.syncedStorage.setItem('dnd-active-tab', '"Inventory"');
    mod.syncedStorage.setItem('dnd-active-tab', '"Character"');

    await vi.advanceTimersByTimeAsync(1000);

    const puts = fetchMock.mock.calls.filter((c) => (c[1] as { method?: string } | undefined)?.method === 'PUT');
    expect(puts).toHaveLength(1);
    const bodyText = (puts[0][1] as { body: string }).body;
    const parsed = JSON.parse(bodyText);
    // The last write should win — debounce collapses all three into a single PUT.
    expect(parsed.data['dnd-active-tab']).toBe('"Character"');
  });

  it('does not schedule a save when setItem receives an unchanged value', async () => {
    vi.useFakeTimers();
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ data: { 'dnd-active-tab': '"Stats"' } })
    );

    const mod = await freshModule();
    await mod.loadFromServer();
    fetchMock.mockClear();

    mod.syncedStorage.setItem('dnd-active-tab', '"Stats"'); // same value

    await vi.advanceTimersByTimeAsync(2000);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('no-ops getItem/setItem when not ready', async () => {
    const mod = await freshModule();
    // No loadFromServer call — ready is false.
    expect(mod.syncedStorage.getItem('dnd-active-tab')).toBe(null);
    mod.syncedStorage.setItem('dnd-active-tab', '"Stats"');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('retries a failed save (transient network / 401 recovery)', async () => {
    vi.useFakeTimers();
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: {} })); // initial GET
    fetchMock.mockResolvedValueOnce(jsonResponse('[]')); // spell list seed
    // First PUT fails, second PUT succeeds.
    fetchMock.mockResolvedValueOnce(jsonResponse(null, { ok: false, status: 500 }));
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

    const mod = await freshModule();
    await mod.loadFromServer();

    mod.syncedStorage.setItem('dnd-active-tab', '"Stats"');
    await vi.advanceTimersByTimeAsync(1000); // first PUT fires, fails
    await vi.advanceTimersByTimeAsync(6000); // retry fires

    const puts = fetchMock.mock.calls.filter((c) => (c[1] as { method?: string } | undefined)?.method === 'PUT');
    expect(puts.length).toBeGreaterThanOrEqual(2);
  });
});
