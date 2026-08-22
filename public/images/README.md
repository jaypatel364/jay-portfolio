# Profile & brand images

| File            | Size                | Used for                                       |
| --------------- | ------------------- | ---------------------------------------------- |
| `avatar.png`    | 512×512 square      | Favicon, Apple icon, OG card portrait, JSON-LD |
| `jay-patel.png` | Portrait (high-res) | About page profile photo                       |

After replacing `avatar.png`, run:

```bash
chmod +x scripts/sync-brand-icons.sh
./scripts/sync-brand-icons.sh
```

That updates `public/icons/icon-{16,32,192,512}.png`, `app/apple-icon.png`, and `app/favicon.ico`.

Keep `avatar.png` **square** — do not pre-round or export 16×16. Browsers and iOS apply their own masks.
