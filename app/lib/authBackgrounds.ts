// Add more Pinterest / direct image URLs here — one per line. Each visit to
// /login or /signup picks a random one. Use direct `i.pinimg.com/...jpg` URLs;
// Pinterest *page* URLs won't render.
//
// If a Pinterest image is stored sideways (Pinterest sometimes does this for
// portrait-cropped pins), wrap it as `{ url, rotate }` where `rotate` is one
// of 90, 180, or 270 (degrees clockwise):
//
//   { url: 'https://i.pinimg.com/…jpg', rotate: 90 }
//
// A plain string means no rotation.
export type AuthBackground = string | { url: string; rotate?: 90 | 180 | 270 };

export const AUTH_BACKGROUND_IMAGES: AuthBackground[] = [
  'https://i.pinimg.com/736x/11/4a/8e/114a8edea7d5b8905b8480e091a5855d.jpg',
  { url: 'https://i.pinimg.com/1200x/a5/f8/d0/a5f8d060d21acc42ac155c35f40c33bd.jpg', rotate: 270 },
  { url: 'https://i.pinimg.com/736x/e9/af/cb/e9afcb23fe9f33d2cfd0fe1e8c17e68c.jpg', rotate: 270 },
];

export function pickRandomAuthBackground(): { url: string; rotate: 0 | 90 | 180 | 270 } | null {
  if (AUTH_BACKGROUND_IMAGES.length === 0) return null;
  const idx = Math.floor(Math.random() * AUTH_BACKGROUND_IMAGES.length);
  const entry = AUTH_BACKGROUND_IMAGES[idx];
  if (typeof entry === 'string') return { url: entry, rotate: 0 };
  return { url: entry.url, rotate: entry.rotate ?? 0 };
}
