# Data Model: Activity Generation Module

## Activity

Represents a pedagogical activity generated or created by a professor.

### Fields

- `id`: string
- `teacherId`: string
- `lessonPlanId`: string | null
- `title`: string
- `description`: string | null
- `subject`: string
- `grade`: string
- `ageRange`: string
- `content`: string
- `answerKey`: string | null
- `simplifiedVersion`: string | null
- `type`: ActivityType
- `isAIGenerated`: boolean
- `status`: ActivityStatus
- `createdAt`: string
- `updatedAt`: string

### Relationships

- Belongs to one professor user via `teacherId`.
- May optionally reference one lesson plan via `lessonPlanId`.

### Validation rules

- `lessonPlanId` is required in the generation request.
- `teacherId` is never chosen manually by the user in the generation flow.
- Draft is the initial state for generated activities.
- Archived activities are read-only from the frontend perspective.

## ActivityStatus

### Values

- `1` = Draft
- `2` = Published
- `3` = Archived

### State transitions

- Draft → Published
- Draft → Archived
- Published → Archived
- Archived → no editable transitions from the frontend

## ActivityType

### Values

- `1` = Exercise
- `2` = Quiz
- `3` = Project
- `4` = Homework

## ActivitiesListParams

### Fields

- `teacherId`: string
- `page`: number | undefined
- `pageSize`: number | undefined
- `status`: string | undefined (`Draft`, `Published`, `Archived`)
- `type`: number | undefined
- `isAIGenerated`: boolean | undefined
- `lessonPlanId`: string | undefined

### Notes

- Query params are serialized from the filters UI and must preserve pagination state.

## CreateActivityRequest

### Fields

- `teacherId`: string
- `title`: string
- `description`: string
- `subject`: string
- `grade`: string
- `ageRange`: string
- `content`: string
- `type`: ActivityType
- `lessonPlanId`: string | null

### Notes

- Exists only if manual creation remains part of the scope.

## GenerateActivityRequest

### Fields

- `teacherId`: string
- `lessonPlanId`: string
- `subject`: string
- `grade`: string
- `ageRange`: string
- `type`: ActivityType
- `numberOfQuestions`: number
- `additionalInstructions`: string | undefined

### Validation rules

- `lessonPlanId` required.
- `numberOfQuestions` must be positive.
- `additionalInstructions` may be omitted.

## UpdateActivityRequest

### Fields

- `id`: string
- `title`: string
- `description`: string
- `content`: string

### Notes

- Update applies only to Draft activities.
- The backend derives requesting user from the JWT, so the frontend should not ask for it explicitly.

## ActivityListItem

### Fields

- `id`: string
- `teacherId`: string
- `lessonPlanId`: string | null
- `title`: string
- `subject`: string
- `grade`: string
- `ageRange`: string
- `type`: ActivityType
- `isAIGenerated`: boolean
- `status`: ActivityStatus
- `createdAt`: string
- `updatedAt`: string

## ActivityDetail

### Fields

- Includes all list item fields plus full pedagogical content, `answerKey`, `simplifiedVersion`, and any detail metadata returned by the backend.

## ActivityFilters

### Fields

- `status`: string | undefined
- `type`: number | undefined
- `isAIGenerated`: boolean | undefined
- `lessonPlanId`: string | undefined
- `page`: number
- `pageSize`: number

### Notes

- Filters must be serializable into query params and preserved across pagination.

## ActivityGenerationResult

### Fields

- `id`: string
- Optional detail payload if the backend returns it later

### Notes

- The current backend contract returns an id for generation commands; detail data must be fetched through the detail endpoint when needed.
