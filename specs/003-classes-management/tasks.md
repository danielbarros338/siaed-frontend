# Tasks: Classes Management

**Input**: Design documents from `/specs/003-classes-management/`

**Note**: `spec.md` is empty in this feature folder, so the story split below was inferred from `docs/backend-state.md` and the existing frontend structure.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the classes feature scaffold and shared contracts used by all stories.

- [X] T001 Create the classes feature folder structure in `features/classes/{components,hooks,schemas,types,utils}` and `app/(dashboard)/classes/{_components,new,[id]/_components,[id]/edit/_components}`
- [X] T002 Define the shared classes domain types in `lib/types/index.ts` and `features/classes/types/index.ts` for `ClassStatus`, list items, detail models, and create/update DTOs
- [X] T003 Expand `lib/api/classes.ts` with typed `list`, `getById`, `create`, `update`, `delete`, and `reactivate` methods using the classes types

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build reusable classes primitives that block both user stories.

**Checkpoint**: Classes contracts, shared schemas, and reusable UI primitives are ready for story implementation.

- [X] T004 Create the classes query hooks in `features/classes/hooks/use-classes.ts` and `features/classes/hooks/use-class-detail.ts`
- [X] T005 Add the classes form schemas in `features/classes/schemas/create-class-schema.ts` and `features/classes/schemas/edit-class-schema.ts`
- [X] T006 Build the reusable classes UI primitives in `features/classes/components/class-form.tsx` and `features/classes/components/class-status-badge.tsx`

---

## Phase 3: User Story 1 - Consultar turmas (Priority: P1) 🎯 MVP

**Goal**: Allow authenticated users to list, search, paginate, and inspect class details.

**Independent Test**: Open `/classes`, confirm the list renders with pagination/search, then open `/classes/{id}` and verify the detail page shows the correct class data and status.

### Implementation for User Story 1

- [X] T007 [P] [US1] Implement the classes table and empty/loading states in `features/classes/components/classes-table.tsx`
- [X] T008 [US1] Implement the classes list view in `app/(dashboard)/classes/_components/classes-view.tsx` and wire it from `app/(dashboard)/classes/page.tsx`
- [X] T009 [US1] Implement the class detail view in `app/(dashboard)/classes/[id]/_components/class-detail-view.tsx` and wire it from `app/(dashboard)/classes/[id]/page.tsx`

**Checkpoint**: The classes list and detail pages should work independently as a usable MVP.

### Parallel Example: User Story 1

```bash
Task: "Implement the classes table and empty/loading states in features/classes/components/classes-table.tsx"
Task: "Implement the classes list view in app/(dashboard)/classes/_components/classes-view.tsx and wire it from app/(dashboard)/classes/page.tsx"
```

---

## Phase 4: User Story 2 - Manter turmas (Priority: P2)

**Goal**: Allow users to create, edit, inactivate, and reactivate classes from dedicated flows.

**Independent Test**: Create a class, edit it, inactivate it, and reactivate it from the detail flow; each action should refresh the list/detail state and preserve the correct status.

### Implementation for User Story 2

- [X] T010 [P] [US2] Implement the mutation hooks in `features/classes/hooks/use-create-class.ts`, `features/classes/hooks/use-update-class.ts`, `features/classes/hooks/use-delete-class.ts`, and `features/classes/hooks/use-reactivate-class.ts`
- [X] T011 [P] [US2] Implement the create and edit route shells in `app/(dashboard)/classes/new/page.tsx`, `app/(dashboard)/classes/new/_components/create-class-view.tsx`, `app/(dashboard)/classes/[id]/edit/page.tsx`, and `app/(dashboard)/classes/[id]/edit/_components/edit-class-view.tsx`
- [X] T012 [P] [US2] Implement the class action controls and confirmation dialogs in `features/classes/components/class-actions.tsx`, `features/classes/components/deactivate-class-dialog.tsx`, and `features/classes/components/reactivate-class-dialog.tsx`
- [X] T013 [US2] Connect `features/classes/components/class-form.tsx` to the create and edit views in `app/(dashboard)/classes/new/_components/create-class-view.tsx` and `app/(dashboard)/classes/[id]/edit/_components/edit-class-view.tsx`

**Checkpoint**: The classes management flows should now be complete end-to-end.

### Parallel Example: User Story 2

```bash
Task: "Implement the mutation hooks in features/classes/hooks/use-create-class.ts, features/classes/hooks/use-update-class.ts, features/classes/hooks/use-delete-class.ts, and features/classes/hooks/use-reactivate-class.ts"
Task: "Implement the create and edit route shells in app/(dashboard)/classes/new/page.tsx, app/(dashboard)/classes/new/_components/create-class-view.tsx, app/(dashboard)/classes/[id]/edit/page.tsx, and app/(dashboard)/classes/[id]/edit/_components/edit-class-view.tsx"
Task: "Implement the class action controls and confirmation dialogs in features/classes/components/class-actions.tsx, features/classes/components/deactivate-class-dialog.tsx, and features/classes/components/reactivate-class-dialog.tsx"
```

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Finish the feature with consistency, cleanup, and UX polish.

- [X] T014 [P] Refine class-specific loading, empty, and error states in `app/(dashboard)/classes/_components/classes-view.tsx`, `features/classes/components/classes-table.tsx`, and `app/(dashboard)/classes/[id]/_components/class-detail-view.tsx`
- [X] T015 [P] Verify classes query invalidation and shared type usage across `features/classes/hooks/*`, `features/classes/types/index.ts`, and `lib/api/classes.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks both user stories.
- **User Story 1 (P1)**: Depends on Foundational and delivers the MVP.
- **User Story 2 (P2)**: Depends on Foundational and can ship after or alongside User Story 1.
- **Polish (Final Phase)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Independent once the shared classes contracts and primitives exist.
- **User Story 2 (P2)**: Independent of the list/detail flow, but reuses the shared classes contracts and primitives.

### Within Each User Story

- Shared contracts and reusable primitives before route wiring.
- List/detail first for the MVP.
- Mutations, dialogs, and create/edit flows after the shared base is ready.
- Keep each story independently verifiable before moving on.

### Parallel Opportunities

- `T001`, `T002`, and `T003` can be started in parallel if different files are being edited.
- `T007` can run alongside `T008` once the shared hooks and primitives are ready.
- `T010`, `T011`, and `T012` can run in parallel because they touch different files.
- The story phases themselves can be staffed in parallel after Phase 2, as long as file conflicts are avoided.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the classes list and detail flows independently.

### Incremental Delivery

1. Finish Setup + Foundational.
2. Deliver User Story 1 as the MVP.
3. Add User Story 2 for full class lifecycle management.
4. Run the polish phase last so the feature stays shippable throughout.

### Suggested Scope for the First Drop

1. User Story 1 only: list, search, paginate, and inspect class details.
2. Add User Story 2 after the MVP is stable.
