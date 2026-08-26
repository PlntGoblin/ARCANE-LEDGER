import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { prisma } from '../../lib/prisma';

export const runtime = 'nodejs';

const MAX_BODY_CHARS = 2_000_000;

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  return id ?? null;
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // upsert instead of find-then-create so two concurrent first loads can't race
  const row = await prisma.character.upsert({
    where: { userId },
    create: { userId, name: '', data: {} },
    update: {},
  });

  return NextResponse.json({ data: row.data, name: row.name, updatedAt: row.updatedAt });
}

export async function PUT(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let text: string;
  try {
    text = await req.text();
  } catch {
    return NextResponse.json({ error: 'Unreadable body' }, { status: 400 });
  }
  if (text.length > MAX_BODY_CHARS) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  let body: { data?: unknown; name?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const data = body.data;
  if (data === undefined || data === null || typeof data !== 'object') {
    return NextResponse.json({ error: 'data required (object)' }, { status: 400 });
  }

  const derivedName = (
    typeof body.name === 'string'
      ? body.name
      : (() => {
          const c = (data as Record<string, unknown>)['dnd-character-data'];
          if (typeof c === 'string') {
            try {
              const parsed = JSON.parse(c);
              return typeof parsed?.name === 'string' ? parsed.name : '';
            } catch {
              return '';
            }
          }
          return '';
        })()
  ).slice(0, 120);

  await prisma.character.upsert({
    where: { userId },
    create: { userId, name: derivedName, data: data as object },
    update: { name: derivedName, data: data as object },
  });

  return NextResponse.json({ ok: true });
}

// navigator.sendBeacon can only POST — route it to the same handler so the
// best-effort beforeunload save actually lands instead of 405ing.
export { PUT as POST };
