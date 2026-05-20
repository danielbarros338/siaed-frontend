# Research: Activity Generation Module

## 1) Domain naming and scope

- **Decision**: use `activities` as the canonical frontend domain.
- **Rationale**: the backend endpoint surface is `/api/v1/activities`, and the clarified spec already uses this naming consistently.
- **Alternatives considered**: `lesson-generation` as primary domain naming; rejected because it would drift from the backend contract and increase cognitive load.

## 2) App Router composition pattern

- **Decision**: keep the established pattern of server `page.tsx` wrappers and client `*_view.tsx` implementations.
- **Rationale**: this is how the existing dashboard routes are organized, particularly `lesson-plans`.
- **Alternatives considered**: putting all logic in route pages; rejected due to architecture rules and maintainability risk.

## 3) UI and state management

- **Decision**: use TanStack Query for list/detail/mutation state and local React state only for ephemeral UI concerns like filters and modal state.
- **Rationale**: the project already standardizes on TanStack Query as the server state source of truth.
- **Alternatives considered**: introducing a feature store; rejected because it duplicates server state and complicates invalidation.

## 4) Generation flow handling

- **Decision**: generation requires selected `lessonPlanId` and uses a clear loading state plus retry on failure.
- **Rationale**: the backend contract depends on lesson-plan context, so the frontend should prevent invalid requests early.
- **Alternatives considered**: allowing generation without a plan and validating only at the backend; rejected for poor UX.

## 5) Reuse strategy

- **Decision**: mirror `lesson-plans` UI patterns for filters, badges, dialogs, skeletons, and mutation feedback.
- **Rationale**: it is the closest and most mature domain implementation in the repository.
- **Alternatives considered**: a brand new visual system for activities; rejected because it would diverge from the established product.

## 6) Data and type strategy

- **Decision**: define activities-specific types in a feature folder, while reusing global `PagedResult`, auth/session, and API error contracts from `lib/types`.
- **Rationale**: preserves strong typing without creating multiple competing sources of truth.
- **Alternatives considered**: duplicating all types in `lib/types` only; rejected because feature-local types are needed for cohesion.

## 7) Cache and invalidation

- **Decision**: use structured query keys and invalidate list/detail after each mutation.
- **Rationale**: this matches the project's existing TanStack Query patterns and keeps the UI consistent after actions.
- **Alternatives considered**: manual cache patching everywhere; rejected because it increases complexity and risks stale UI.

## 8) Error handling

- **Decision**: query failures render inline states; mutation failures use toast + contextual feedback; generation failures keep the user in context.
- **Rationale**: the UX rules in the project distinguish between read failures and command failures.
- **Alternatives considered**: toast for all errors; rejected because list/detail errors should be visible in-place.

## 9) Auth and authorization

- **Decision**: reuse JWT cookie + auth provider + current-user hook; derive `teacherId` from the authenticated user.
- **Rationale**: aligns with existing auth flow and avoids duplicated identity state.
- **Alternatives considered**: passing `teacherId` via route params or local form fields; rejected because it weakens security and UX.

## 10) Future AI extensibility

- **Decision**: structure the domain so future AI actions can be added without redesigning the feature boundaries.
- **Rationale**: the backend already has multiple AI-powered flows and more are likely to appear.
- **Alternatives considered**: single hardcoded generation screen; rejected because it would not scale to future AI capabilities.
