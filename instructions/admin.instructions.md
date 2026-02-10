# Admin Web Instructions

> Domain: `apps/admin/` – Next.js (React)

---

## Responsibilities

- Provide a CMS interface for managing all content (scenarios, steps, translations, home buttons).
- Media management: upload, view, delete files via GCS.
- User/role management (if applicable).
- Dashboard for content overview and status.
- Export content (JSON/CSV) for backup or transfer.

---

## Conventions

### Tech
- **Framework**: Next.js (App Router, React Server Components)
- **Language**: TypeScript (strict mode)
- **UI Library**: TBD (Tailwind CSS + shadcn/ui recommended)
- **Data Fetching**: React Query or SWR
- **Forms**: React Hook Form + Zod validation
- **Auth**: TBD

### File Structure
```
apps/admin/
├── src/
│   └── app/             # Next.js App Router
│       ├── layout.tsx
│       ├── page.tsx     # Dashboard
│       ├── scenarios/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── home-buttons/
│       ├── translations/
│       ├── media/
│       └── settings/
├── src/
│   ├── components/      # Shared UI components
│   │   ├── ui/          # Base components (button, input…)
│   │   └── layout/      # Layout components (sidebar, header…)
│   ├── hooks/           # Custom hooks
│   ├── services/        # API service layer
│   ├── lib/             # Utilities
│   └── types/           # TypeScript types
├── public/              # Static assets
├── next.config.js
├── tailwind.config.ts
└── package.json
```

### Naming
| Element           | Convention     | Example                  |
| ----------------- | -------------- | ------------------------ |
| Pages/routes      | kebab-case     | `scenarios/page.tsx`     |
| Components        | PascalCase     | `ScenarioForm.tsx`       |
| Hooks             | camelCase      | `useScenarios.ts`        |
| Services          | kebab-case     | `scenario-service.ts`    |
| API routes        | kebab-case     | `/api/scenarios`         |

---

## Acceptance Criteria (per feature)

- [ ] Page renders with correct data from API.
- [ ] CRUD operations work (create, read, update, delete).
- [ ] Form validation prevents invalid submissions.
- [ ] Success/error notifications shown to user.
- [ ] Responsive layout (desktop-first, but usable on tablet).
- [ ] Loading skeletons or spinners during data fetch.
- [ ] No TypeScript errors.
- [ ] Translations management allows editing for all languages.

---

## Testing & Verification

| Type         | Tool                        | Run Command            |
| ------------ | --------------------------- | ---------------------- |
| Unit tests   | Jest + React Testing Lib    | `npm test`             |
| Type check   | TypeScript                  | `npx tsc --noEmit`    |
| Lint         | ESLint                      | `npm run lint`         |
| E2E (future) | Playwright or Cypress       | TBD                    |
| Manual       | Browser (localhost:3000)    | `npm run dev`          |

### Test Checklist
- [ ] Components render without crash.
- [ ] Form submit sends correct payload.
- [ ] Error states show user-friendly messages.
- [ ] Auth-protected pages redirect when unauthenticated.
- [ ] File upload shows progress and confirmation.

---

## Security Notes

- Admin pages must be auth-protected.
- Validate file type and size before upload.
- Sanitize any user input before displaying (XSS prevention).
- CSRF protection on mutation endpoints.
