# Profile & brand images

| File            | Size                | Used for                                       |
| --------------- | ------------------- | ---------------------------------------------- |
| `avatar.png`    | 512×512 square      | Favicon, Apple icon, OG card portrait, JSON-LD |
| `jay-patel.png` | Portrait (high-res) | About page profile photo                       |

## Project screenshots

Name each file after the project **slug** (same as the `/work/<slug>/` URL):

```
public/images/projects/
  spendly-personal-expense-tracker.png
  social-media-backend-api.png
  minilist-headless-cms.png
  real-time-chat-application.png
  pms-hr-management-system.png
  philantro-ai-ngo-management-platform.png
  verify-360-kyc-platform.png
```

| Convention       | Detail                                                        |
| ---------------- | ------------------------------------------------------------- |
| **Filename**     | `<slug>.png` — matches project slug in `settings/projects.ts` |
| **Alt text**     | Project `title` (`projectImageAlt`)                           |
| **Title attr**   | Project `title` (`projectImageTitle`)                         |
| **Figcaption**   | Project `title` (screen-reader / semantic caption)            |
| **OG / Twitter** | Project screenshot on `/work/<slug>/` pages                   |
| **JSON-LD**      | `ImageObject` on project pages + work index `ItemList`        |
| **Dimensions**   | 1672×941 (`PROJECT_COVER_IMAGE` in `settings/projects.ts`)    |
| **Display**      | Full-bleed `object-cover`, 16:9 aspect                        |

Used on work cards, `/work/` catalog, project detail hero, and coming-soon pages via `ProjectVisual`.

After replacing `avatar.png`, run:

```bash
chmod +x scripts/sync-brand-icons.sh
./scripts/sync-brand-icons.sh
```

That updates `public/icons/icon-{16,32,192,512}.png`, `app/apple-icon.png`, and `app/favicon.ico`.

Keep `avatar.png` **square** — do not pre-round or export 16×16. Browsers and iOS apply their own masks.
