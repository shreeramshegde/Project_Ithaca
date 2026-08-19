# Project Ithaca Frontend

This React app lives in `Project_Ithaca/fronted` to match the requested folder name and keeps backend integration isolated through a small API layer.

## Run locally

1. Start the backend from `Project_Ithaca/backend`.
2. Install dependencies with `npm install`.
3. Start the frontend with `npm run dev`.

The Vite dev server proxies `/api` to `http://localhost:3000`, so the frontend can integrate with the existing backend without altering backend routes.

## Cinematic landing background (assets)

This project expects a local cinematic ocean video and a poster image for the landing page. Place these files in the public folder so they are served from the app root:

- `public/assets/landing/ocean-background.mp4` — the cinematic ocean MP4 (autoplay, muted, loop, playsInline)
- `public/assets/landing/ocean-poster.webp` — fallback poster image when the video can't play or for reduced-motion

Recommended video specs:
- 1080p (1920×1080)
- 24–30 FPS
- Compressed MP4 H.264, reasonable bitrate (preferably under ~20 MB)
- No people, boats, text, logos, neon, or fantasy elements — realistic cinematic ocean footage only

If you don't have the video yet, add the poster image at the path above; the landing page will show the poster when necessary. After adding the files, restart the dev server if needed.
