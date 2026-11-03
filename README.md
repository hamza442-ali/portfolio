# Ali Hamza — Portfolio

Personal portfolio for Ali Hamza, Full-Stack Software Engineer in Regensburg, Germany.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Motion and React Three Fiber.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute public URL, used for metadata, Open Graph image and sitemap. |
| `RESEND_API_KEY` | Resend API key for the contact form. Without it the form returns a friendly "not configured" message. |
| `CONTACT_TO_EMAIL` | Inbox that receives contact form messages. |
| `CONTACT_FROM_EMAIL` | Sender shown on the email. Use `onboarding@resend.dev` until a domain is verified in Resend. |

## Editing content

All copy lives in `src/content/`. Nothing is hard-coded in components.

| File | What it holds |
|---|---|
| `profile.ts` | Name, title, location, contact details, bios, marquee technologies. Set `headshot`, `calendarUrl` and `cvUrl` once the assets exist. |
| `experience.ts` | Work history. Dates are `YYYY-MM`; the overlap chart is drawn from them. |
| `projects.ts` | Featured and other projects. `myWork` is personal contribution; `productCapabilities` is the team/product. |
| `skills.ts` | Skill groups with a proof level per item (`professional`, `project`, `learning`). |
| `ai-journey.ts` | The three AI proof tiers and the roadmap list. |
| `education.ts` | Degrees and certifications. |

### Images

Originals live in `assets/source/` and are never served directly:

```
assets/source/profile/ali-hamza.png              -> public/images/profile/ali-hamza.webp (+ a 480px JPEG for Open Graph)
assets/source/projects/<project-id>/<name>.png   -> public/images/projects/<project-id>/<name>.webp
```

Run `npm run images` after adding or replacing a file. It resizes, converts to WebP and regenerates `src/content/images.generated.ts` (sizes and blur placeholders). Then reference the output path in `projects.ts` under `images` with an `alt` and a `caption`; the first entry is the cover. A path that does not exist is skipped, so nothing ever renders broken.

## Content rules

- No metrics, testimonials, titles or links that are not verified.
- Personal contribution is always separated from team or product capability.
- Public personal data is limited to name, city, professional email, the approved phone number and public social profiles.

## Deploy

1. Push to GitHub and import the repository in Vercel.
2. Add the environment variables above in the Vercel project settings.
3. Attach the custom domain and set `NEXT_PUBLIC_SITE_URL` to match.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint
