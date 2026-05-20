# Activities API Contract

## GET `/api/v1/activities`

Returns a paginated list of activities for the authenticated professor.

### Query params

- `teacherId` (required)
- `page` (optional)
- `pageSize` (optional)
- `status` (optional: `Draft`, `Published`, `Archived`)
- `type` (optional: `1`, `2`, `3`, `4`)
- `isAIGenerated` (optional)
- `lessonPlanId` (optional)

### Response

- `PagedResult<ActivityListItem>`

## GET `/api/v1/activities/{id}`

Returns a full activity detail by id.

### Response

- `ActivityDetail`

## POST `/api/v1/activities/generate`

Creates a new activity from a lesson plan using IA.

### Body

- `teacherId`
- `lessonPlanId`
- `subject`
- `grade`
- `ageRange`
- `type`
- `numberOfQuestions`
- `additionalInstructions`

### Response

- `{ id: string }`

## PUT `/api/v1/activities/{id}`

Updates an existing Draft activity.

### Body

- `id`
- `title`
- `description`
- `content`

### Response

- `204 No Content`

## PATCH `/api/v1/activities/{id}/publish`

Publishes a Draft activity.

### Response

- `204 No Content`

## PATCH `/api/v1/activities/{id}/archive`

Archives an activity.

### Response

- `204 No Content`

## DELETE `/api/v1/activities/{id}`

Deletes an activity logically.

### Response

- `204 No Content`
