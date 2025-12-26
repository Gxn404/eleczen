---
description: Upgrade Blog, Tools, and Projects pages
---
# Upgrade Plan

## 1. Blog Page (/blog)
- **Objective**: Upgrade UI/UX to "Premium Glassmorphism" and integrate Supabase.
- **Actions**:
  - [ ] Modify `src/app/blog/page.js` to fetch posts from Supabase `blogs` table instead of MongoDB.
  - [ ] Map Supabase data fields to the UI components.
  - [ ] Enhance UI with "Premium Glassmorphism & Neon Theme" (ensure consistency with `LibraryBrowser` style).
  - [ ] Handle loading and error states gracefully.

## 2. Tools Page (/tools)
- **Objective**: Improve UI/UX.
- **Actions**:
  - [ ] Review `src/app/tools/page.js`.
  - [ ] Enhance card styles, hover effects, and layout to match the global premium theme.

## 3. Projects Page (/projects)
- **Objective**: Add redirection logic.
- **Actions**:
  - [ ] Update `src/app/projects/ProjectsClient.jsx`.
  - [ ] Wrap project cards in `Link` pointing to `/design?project_id={id}`.
  - [ ] Ensure hover states indicate clickability.

## 4. Verification
- **Actions**:
  - [ ] Verify `bun run dev` works (if memory issue resolves).
  - [ ] Check `/blog` loads posts (mock or real if table exists).
  - [ ] Check `/tools` looks good.
  - [ ] Check `/projects` links work.
