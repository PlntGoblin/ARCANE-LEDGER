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
  'https://i.pinimg.com/1200x/64/9f/27/649f276cc34c702c26addb2293b7bc9e.jpg',
  { url: 'https://i.pinimg.com/1200x/ec/1f/9b/ec1f9bce9111eaf955abc421c55742b6.jpg', rotate: 270 },
  'https://i.pinimg.com/1200x/89/c1/14/89c114a249ed39e22571ada158520dd0.jpg',
  'https://i.pinimg.com/736x/2b/14/ad/2b14adfe29464b13454bedeed9862a47.jpg',
  'https://i.pinimg.com/1200x/6f/6b/ff/6f6bff47dd8490c5456c83c7cd40c860.jpg',
  'https://i.pinimg.com/736x/62/6c/e9/626ce902a963908660f538ebefd6f865.jpg',
  'https://i.pinimg.com/1200x/ab/0d/02/ab0d02ecd93bacea66469934ec1e24d2.jpg',
  'https://i.pinimg.com/736x/cb/28/f1/cb28f16ef4255c34a04a3763ce3050c1.jpg',
  'https://i.pinimg.com/736x/a3/a9/a6/a3a9a67b4c7ea485dce9883653e44c9e.jpg',
  'https://i.pinimg.com/1200x/46/14/e6/4614e6a99c89d198f301951ebfe4e6fa.jpg',
  { url: 'https://i.pinimg.com/736x/89/0f/e3/890fe38448a32547bfe9c89c5d611dfd.jpg', rotate: 90 },
  'https://i.pinimg.com/1200x/0a/9e/b9/0a9eb9f8570efe64c24ca79955d8f31b.jpg',
];

export function pickRandomAuthBackground(): { url: string; rotate: 0 | 90 | 180 | 270 } | null {
  if (AUTH_BACKGROUND_IMAGES.length === 0) return null;
  const idx = Math.floor(Math.random() * AUTH_BACKGROUND_IMAGES.length);
  const entry = AUTH_BACKGROUND_IMAGES[idx];
  if (typeof entry === 'string') return { url: entry, rotate: 0 };
  return { url: entry.url, rotate: entry.rotate ?? 0 };
}
