# Icons

Use the square headshot (`public/images/avatar.png`, 512×512). Do **not** export 16×16 or 32×32 sources — a photo cannot stay sharp at those sizes. Keep the 512 file and let browsers downscale.

| File                      | Size     | Used for                             |
| ------------------------- | -------- | ------------------------------------ |
| `app/icon.png`            | 512×512  | Browser tab / PWA favicon            |
| `app/apple-icon.png`      | 180×180  | iOS home screen                      |
| `app/favicon.ico`         | 32 + 48  | Legacy `/favicon.ico` requests       |
| `app/opengraph-image.tsx` | 1200×630 | LinkedIn / Facebook / WhatsApp cards |
| `app/twitter-image.tsx`   | 1200×630 | X / Twitter cards                    |

Replace `public/images/avatar.png`, then copy it to `app/icon.png` and resize to 180 for `app/apple-icon.png`.
