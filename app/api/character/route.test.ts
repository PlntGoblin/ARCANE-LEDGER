import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mocks are hoisted by vi.mock so they apply before the route module imports.
const authMock = vi.fn();
const upsertMock = vi.fn();

vi.mock('../../../auth', () => ({
  auth: () => authMock(),
}));

vi.mock('../../lib/prisma', () => ({
  prisma: {
    character: {
      upsert: (...args: unknown[]) => upsertMock(...args),
    },
  },
}));

import { GET, PUT, POST } from './route';

function signedInAs(userId: string) {
  authMock.mockResolvedValue({ user: { id: userId } });
}

function anonymous() {
  authMock.mockResolvedValue(null);
}

beforeEach(() => {
  authMock.mockReset();
  upsertMock.mockReset();
});

describe('GET /api/character', () => {
  it('returns 401 when no session', async () => {
    anonymous();
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('upserts (create-if-missing) and returns the character row', async () => {
    signedInAs('user-abc');
    upsertMock.mockResolvedValue({
      userId: 'user-abc',
      name: 'Elara',
      data: { 'dnd-active-tab': '"Stats"' },
      updatedAt: new Date('2026-01-01T00:00:00Z'),
    });

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toEqual({ 'dnd-active-tab': '"Stats"' });
    expect(body.name).toBe('Elara');

    // Uses upsert so two concurrent first-loads can't race on the unique constraint.
    expect(upsertMock).toHaveBeenCalledOnce();
    const call = upsertMock.mock.calls[0][0];
    expect(call.where).toEqual({ userId: 'user-abc' });
    expect(call.create.userId).toBe('user-abc');
    expect(call.update).toEqual({});
  });
});

describe('PUT /api/character', () => {
  function req(body: unknown): Request {
    return new Request('http://localhost/api/character', {
      method: 'PUT',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  it('returns 401 when no session', async () => {
    anonymous();
    const res = await PUT(req({ data: {} }));
    expect(res.status).toBe(401);
  });

  it('returns 400 when data is missing', async () => {
    signedInAs('user-abc');
    const res = await PUT(req({}));
    expect(res.status).toBe(400);
  });

  it('returns 400 when the body is not valid JSON', async () => {
    signedInAs('user-abc');
    const res = await PUT(req('this is not json'));
    expect(res.status).toBe(400);
  });

  it('returns 413 when the payload is over the 2MB cap', async () => {
    signedInAs('user-abc');
    // Craft a body whose text length exceeds 2_000_000 chars.
    const huge = 'x'.repeat(2_100_000);
    const res = await PUT(req({ data: { blob: huge } }));
    expect(res.status).toBe(413);
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it('upserts with the user id scoped from the session, never the client', async () => {
    signedInAs('user-abc');
    upsertMock.mockResolvedValue({});

    const res = await PUT(req({ data: { 'dnd-active-tab': '"Stats"' } }));
    expect(res.status).toBe(200);

    expect(upsertMock).toHaveBeenCalledOnce();
    const call = upsertMock.mock.calls[0][0];
    expect(call.where).toEqual({ userId: 'user-abc' });
    expect(call.create.userId).toBe('user-abc');
    expect(call.update.data).toEqual({ 'dnd-active-tab': '"Stats"' });
  });

  it('derives name from data["dnd-character-data"].name when name is not sent explicitly', async () => {
    signedInAs('user-abc');
    upsertMock.mockResolvedValue({});

    await PUT(
      req({
        data: {
          'dnd-character-data': JSON.stringify({ name: 'Su-nin', class: 'Wizard' }),
        },
      })
    );

    const call = upsertMock.mock.calls[0][0];
    expect(call.update.name).toBe('Su-nin');
    expect(call.create.name).toBe('Su-nin');
  });

  it('caps the derived name at 120 characters', async () => {
    signedInAs('user-abc');
    upsertMock.mockResolvedValue({});

    const longName = 'a'.repeat(200);
    await PUT(
      req({
        data: { 'dnd-character-data': JSON.stringify({ name: longName }) },
      })
    );

    const call = upsertMock.mock.calls[0][0];
    expect(call.update.name.length).toBe(120);
  });
});

describe('POST /api/character (sendBeacon alias)', () => {
  it('is exported and behaves identically to PUT', async () => {
    // POST is aliased to PUT so navigator.sendBeacon (which can only POST)
    // still hits the same handler.
    expect(POST).toBe(PUT);
  });

  it('handles a beacon-style POST body', async () => {
    signedInAs('user-abc');
    upsertMock.mockResolvedValue({});

    const beaconReq = new Request('http://localhost/api/character', {
      method: 'POST',
      body: JSON.stringify({ data: { 'dnd-active-tab': '"Stats"' } }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(beaconReq);
    expect(res.status).toBe(200);
    expect(upsertMock).toHaveBeenCalledOnce();
  });
});
