# Mobile App Instructions

> Domain: `apps/mobile/` – React Native + Expo

---

## Responsibilities

- Render all user-facing screens (Home, Scenarios, Journal, Anchors, Settings).
- Fetch content dynamically from the backend API.
- Support Hebrew (RTL) and English (LTR) layouts.
- Handle local notifications for anchors/reminders.
- Manage local state and API caching.
- Provide offline-friendly UX where possible.

---

## Conventions

### Tech
- **Framework**: React Native + Expo (managed workflow)
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation v6+
- **State Management**: TBD (Context / Zustand / Redux Toolkit)
- **HTTP Client**: Axios or fetch wrapper from `packages/shared/`

### File Structure
```
apps/mobile/
├── src/
│   ├── screens/          # Screen components (PascalCase)
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Navigation config
│   ├── hooks/            # Custom hooks
│   ├── services/         # API service layer
│   ├── utils/            # Utility functions
│   ├── constants/        # App-level constants
│   ├── types/            # TypeScript types (or from shared)
│   └── i18n/             # Local i18n helpers
├── assets/               # Static assets (bundled)
├── app.json              # Expo config
├── App.tsx               # Entry point
└── package.json
```

### Naming
| Element           | Convention     | Example              |
| ----------------- | -------------- | -------------------- |
| Screen files      | PascalCase     | `HomeScreen.tsx`     |
| Component files   | PascalCase     | `ScenarioCard.tsx`   |
| Hooks             | camelCase      | `useScenarios.ts`    |
| Services          | kebab-case     | `scenario-service.ts`|
| Utils             | kebab-case     | `date-helpers.ts`    |

### RTL Support
- Use flexbox with `I18nManager` for RTL.
- Test every screen in both LTR and RTL modes.
- Avoid hardcoded `left`/`right` – use `start`/`end`.

---

## Acceptance Criteria (per feature)

- [ ] Screen renders correctly (visual check).
- [ ] Data loads from API (not hardcoded).
- [ ] Loading and error states handled.
- [ ] RTL layout works for Hebrew.
- [ ] Navigation works (forward, back, deep links).
- [ ] Accessibility labels present on interactive elements.
- [ ] No TypeScript errors (`tsc --noEmit`).

---

## Testing & Verification

| Type         | Tool                             | Run Command            |
| ------------ | -------------------------------- | ---------------------- |
| Unit tests   | Jest + React Native Testing Lib  | `npm test`             |
| Type check   | TypeScript compiler              | `npx tsc --noEmit`    |
| Lint         | ESLint                           | `npm run lint`         |
| Manual       | Expo Go on device/simulator      | `npx expo start`      |

### Test Checklist
- [ ] Component renders without crash.
- [ ] API calls are mocked properly.
- [ ] User interactions trigger correct state changes.
- [ ] RTL rendering tested.
- [ ] Snapshot tests for stable UI components.

---

## Security Notes

- Never store auth tokens in plain AsyncStorage in production (use expo-secure-store).
- Validate all data received from API before rendering.
- Do not expose API base URL in client bundles for production.
