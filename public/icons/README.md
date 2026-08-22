# Icons

Generated from `public/images/avatar.png` via `scripts/sync-brand-icons.sh`.

| File                    | Size         | Used for                          |
| ----------------------- | ------------ | --------------------------------- |
| `icon-16.png`           | 16×16        | `<link rel="icon" sizes="16x16">` |
| `icon-32.png`           | 32×32        | `<link rel="icon" sizes="32x32">` |
| `icon-192.png`          | 192×192      | Web manifest (Android)            |
| `icon-512.png`          | 512×512      | Web manifest (Android)            |
| `../app/apple-icon.png` | 180×180      | iOS home screen                   |
| `../app/favicon.ico`    | 16 + 32 + 48 | Legacy `/favicon.ico`             |

Metadata in `settings/seo.ts` references these paths. `app/manifest.ts` serves `/manifest.webmanifest`.
