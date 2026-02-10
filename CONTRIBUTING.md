# Contributing to Emunah Companion

> Last updated: 2026-02-10

---

## Git Workflow

### Branching Strategy

```
main           ← Production-ready, protected
  └── develop  ← Integration branch
       ├── feature/<short-name>    ← New features
       ├── fix/<short-name>        ← Bug fixes
       └── hotfix/<short-name>     ← Urgent production fixes
```

| Branch           | Base       | Merge Into       | Purpose                    |
| ---------------- | ---------- | ---------------- | -------------------------- |
| `main`           | –          | –                | Production release          |
| `develop`        | `main`     | `main`           | Integration                 |
| `feature/<name>` | `develop`  | `develop`        | New feature                 |
| `fix/<name>`     | `develop`  | `develop`        | Bug fix                     |
| `hotfix/<name>`  | `main`     | `main` + `develop` | Urgent production fix    |

### Golden Rules

1. **One task per branch.** Each branch implements exactly ONE feature or fix.
2. **One PR per task.** Every branch gets its own Pull Request.
3. **Never push directly to `main` or `develop`.** Always use PRs.
4. **Merge only after**: code review ✅, tests pass ✅, docs updated ✅.
5. **Delete branch after merge.**

---

## Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | When to Use                                   |
| ---------- | --------------------------------------------- |
| `feat`     | New feature                                   |
| `fix`      | Bug fix                                       |
| `docs`     | Documentation only changes                    |
| `chore`    | Maintenance (deps, config, CI)                |
| `refactor` | Code change with no feature/fix               |
| `test`     | Adding or updating tests                      |
| `style`    | Formatting, whitespace (no code logic change) |
| `perf`     | Performance improvement                       |
| `ci`       | CI/CD configuration                           |
| `build`    | Build system changes                          |
| `revert`   | Revert a previous commit                      |

### Scopes (examples)

`api`, `mobile`, `admin`, `db`, `auth`, `gcs`, `i18n`, `docs`, `deps`

### Examples

```
feat(api): add scenario CRUD endpoints
fix(mobile): resolve navigation crash on iOS
docs(arch): update architecture diagram
chore(deps): upgrade express to 4.19
refactor(server): extract validation middleware
test(api): add journal endpoint tests
```

---

## Pull Request Process

### Creating a PR

1. Create branch: `git checkout -b feature/<name> develop`
2. Implement your changes (code + tests + docs).
3. Run checks locally:
   ```bash
   npm run lint
   npm run test
   npx tsc --noEmit
   ```
4. Push: `git push -u origin feature/<name>`
5. Open PR against `develop`.
6. Fill in PR template with:
   - What was changed and why
   - Testing steps
   - Screenshots (if UI changes)

### PR Checklist

- [ ] Code follows project naming conventions
- [ ] TypeScript strict mode passes (`tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] New/updated tests for changed functionality
- [ ] Documentation updated (if applicable)
- [ ] `docs/06_PROGRESS_LOG.md` updated
- [ ] No secrets or credentials in the code
- [ ] PR has a clear title following commit conventions

### Reviewing a PR

- Check code quality, naming, types.
- Verify tests cover the changes.
- Test manually if possible.
- Check that docs are updated.
- Approve or request changes with specific feedback.

### After Merge

1. Delete the feature branch.
2. Pull latest `develop` locally.
3. Verify the integrated code works.

---

## Development Setup

See `docs/05_DEV_WORKFLOW.md` for full environment setup instructions.

### Quick Start

```bash
git clone <remote-url>
cd emunah-companion
npm install
# Copy .env files and configure
# See docs/05_DEV_WORKFLOW.md for details
```

---

## Code of Conduct

- Be respectful and constructive in code reviews.
- Ask questions if something is unclear.
- Document decisions.
- Keep PRs small and focused.
