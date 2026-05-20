# Quickstart: Activity Generation Module

## Goal

Validate the end-to-end frontend experience for generating, reviewing, editing, publishing, archiving, and deleting activities based on lesson plans.

## Required environment

- Backend running at the configured `NEXT_PUBLIC_API_URL`
- Valid professor session stored in cookie/session storage
- Existing lesson plans for the logged-in professor

## Primary user flows to validate

### 1) List activities

- Open the activities list route.
- Confirm paginated results, status indicators, AI origin markers, and actions.
- Confirm loading skeletons and empty state behavior.

### 2) Filter and paginate

- Apply status, type, AI-generated, and lesson-plan-related filters.
- Move between pages.
- Confirm the filter state persists and cache updates do not reset the view.

### 3) Generate a new activity

- Open the generation route.
- Select a lesson plan.
- Configure type, number of questions, and additional instructions.
- Submit and confirm loading feedback while the IA request is processed.

### 4) Review generated content

- Confirm the result shows full content, answer key, and simplified version.
- Open the generated activity detail.
- Verify the visual marker for IA origin.

### 5) Edit a draft activity

- Open a Draft activity.
- Edit the allowed fields.
- Save and verify the detail and list reflect the updated content.

### 6) Publish, archive, delete

- Publish only Draft items.
- Archive eligible items.
- Delete with confirmation dialog.
- Confirm cache invalidation updates list and detail views.

## Error scenarios to validate

- IA generation failure
- Network timeout
- Unauthorized session
- Draft-only edit blocked on Archived activity
- Empty list after filtering

## Implementation checkpoints

- `activities` feature folder created.
- `lib/api/activities.ts` added.
- Query keys extended or refined for activities.
- Routes and view components added under `app/(dashboard)/activities`.
- Forms, dialogs, badges, and tables wired to TanStack Query.
