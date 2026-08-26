import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { prisma } from '../../lib/prisma';

export const runtime = 'nodejs';

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  return id ?? null;
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let row = await prisma.character.findUnique({ where: { userId } });
  if (!row) {
    row = await prisma.character.create({
      data: { userId, name: '', data: {} },
    });
  }

  return NextResponse.json({ data: row.data, name: row.name, updatedAt: row.updatedAt });
}

export async function PUT(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { data?: unknown; name?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const data = body.data;
  if (data === undefined || data === null || typeof data !== 'object') {
    return NextResponse.json({ error: 'data required (object)' }, { status: 400 });
  }

  const derivedName =
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
        })();

  await prisma.character.upsert({
    where: { userId },
    create: { userId, name: derivedName, data: data as object },
    update: { name: derivedName, data: data as object },
  });

  return NextResponse.json({ ok: true });
}
