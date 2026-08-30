// One-off enrichment: swap the terse `Effect` one-liners in
// public/master-spell-list.json for the full SRD text from 5e-bits/5e-database.
//
// Local list is a compact cheat-sheet; SRD JSON has the full PHB descriptions
// for every SRD-legal spell. We match by name (case-insensitive), overwrite
// Effect only, and leave every other field (School abbrev, Comp, Cost, etc.)
// alone so the app's existing renderers keep working. Homebrew/non-SRD spells
// that don't match are reported and left as-is.
//
// Run: node scripts/enrich-spells.mjs

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const LOCAL_FILE = path.join(REPO_ROOT, 'public', 'master-spell-list.json');
const SRD_URL =
  'https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/en/5e-SRD-Spells.json';

// SRD strips the wizard's name from many classic spells ("Bigby's Hand" is
// filed as "Arcane Hand") and spells out slashes ("Detect Evil/Good" → "Detect
// Evil and Good"). Map the local title to the SRD title so we still match.
const SPELL_NAME_ALIASES = {
  'detect evil/good': 'detect evil and good',
  'protection from evil/good': 'protection from evil and good',
  'purify food/drink': 'purify food and drink',
  "bigby's hand": 'arcane hand',
  "drawmij's instant summons": 'instant summons',
  "evard's black tentacles": 'black tentacles',
  "leomund's tiny hut": 'tiny hut',
  "leomund's secret chest": 'secret chest',
  "leomud's secret chest": 'secret chest', // local typo of Leomund
  "melf's acid arrow": 'acid arrow',
  "mordenkainen's faithful hound": 'faithful hound',
  "mordenkainen's magnificent mansion": 'magnificent mansion',
  "mordenkainen's private sanctum": 'private sanctum',
  "mordenkainen's sword": 'arcane sword',
  "nystul's magic aura": "arcanist's magic aura",
  "otiluke's freezing sphere": 'freezing sphere',
  "otiluke's resilient sphere": 'resilient sphere',
  "otto's irresistible dance": 'irresistible dance',
  "rary's telepathic bond": 'telepathic bond',
  "tasha's hideous laughter": 'hideous laughter',
  "tenser's floating disk": 'floating disk',
};

async function main() {
  console.log('Fetching SRD spell data…');
  const res = await fetch(SRD_URL);
  if (!res.ok) throw new Error(`SRD fetch failed: ${res.status} ${res.statusText}`);
  const srd = await res.json();
  console.log(`  → ${srd.length} SRD spells`);

  const srdByName = new Map();
  for (const s of srd) srdByName.set(s.name.toLowerCase(), s);

  console.log('Loading local spell list…');
  const raw = await fs.readFile(LOCAL_FILE, 'utf-8');
  const local = JSON.parse(raw);
  console.log(`  → ${local.length} local spells`);

  let matched = 0;
  let unchanged = 0;
  const missed = [];

  for (const spell of local) {
    const key = (spell.Name || '').toLowerCase().trim();
    const srdSpell = srdByName.get(key) || srdByName.get(SPELL_NAME_ALIASES[key]);
    if (!srdSpell) {
      missed.push(spell.Name);
      unchanged++;
      continue;
    }
    const desc = Array.isArray(srdSpell.desc) ? srdSpell.desc.join('\n\n') : srdSpell.desc || '';
    const higher =
      Array.isArray(srdSpell.higher_level) && srdSpell.higher_level.length
        ? '\n\nAt Higher Levels: ' + srdSpell.higher_level.join('\n\n')
        : '';
    const full = (desc + higher).trim();
    if (full) {
      spell.Effect = full;
      matched++;
    } else {
      unchanged++;
    }
  }

  console.log(`\nEnriched: ${matched}`);
  console.log(`Unchanged: ${unchanged}`);
  if (missed.length) {
    console.log(`\nNot found in SRD (${missed.length}) — kept original Effect:`);
    for (const n of missed.slice(0, 40)) console.log(`  - ${n}`);
    if (missed.length > 40) console.log(`  … and ${missed.length - 40} more`);
  }

  // Preserve the original compact JSON encoding (single line) — the file is
  // fetched by the client, so we keep the download small.
  await fs.writeFile(LOCAL_FILE, JSON.stringify(local));
  console.log(`\nWrote ${path.relative(REPO_ROOT, LOCAL_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
