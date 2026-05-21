# TODO - StoryVerse AI fixes

## Phase 1: Integration + core features
- [x] Fix TTS controls (Play/Pause/Resume/Stop)

- [ ] Standardize frontend API client + ensure consistent route usage
- [ ] Fix backend adventure response consistency (always return `story` field)
- [ ] Complete Contact page (functional form, submit to Mongo, success/error toasts)
- [ ] Complete About page (polished animated About page w/ exact palette)

## Phase 2: Story generation + history
- [ ] Verify POST /api/stories/generate returns consistent story shape
- [ ] Fix frontend story generation display/loading/error handling
- [ ] Complete Story History page (favorites/search/filter/delete)

## Phase 3: UI polish + remaining runtime errors
- [ ] Apply exact palette across UI (glassmorphism + gradients + glow)
- [ ] Ensure text contrast/accessibility and no placeholder pages
- [ ] Fix dashboard completion (favorites count, recent stories, theme settings)
- [ ] Fix PDF download formatting (Title/Mood/Location/Date/Mood)
- [ ] Run end-to-end smoke test and fix remaining console errors

## Phase 4: Verification
- [ ] Run `npm run dev` for client and server
- [ ] Verify: signup/login, protected routes, story generation, adventure branching, history, contact, toasts, TTS, PDF

