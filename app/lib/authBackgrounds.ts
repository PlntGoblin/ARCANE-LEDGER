// Add more Pinterest / direct image URLs here — one per line. Each visit to
// /login or /signup picks a random one. Use direct `i.pinimg.com/...jpg` URLs;
// Pinterest *page* URLs won't render.
export const AUTH_BACKGROUND_IMAGES: string[] = [
  'https://i.pinimg.com/736x/11/4a/8e/114a8edea7d5b8905b8480e091a5855d.jpg',
  'https://i.pinimg.com/1200x/a5/f8/d0/a5f8d060d21acc42ac155c35f40c33bd.jpg',
];

export function pickRandomAuthBackground(): string | null {
  if (AUTH_BACKGROUND_IMAGES.length === 0) return null;
  const idx = Math.floor(Math.random() * AUTH_BACKGROUND_IMAGES.length);
  return AUTH_BACKGROUND_IMAGES[idx];
}
