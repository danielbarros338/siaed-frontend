import { activityHandlers } from './activities'
import { authHandlers } from './auth'
import { classHandlers } from './classes'
import { gradeHandlers } from './grades'
import { lessonPlanHandlers } from './lesson-plans'
import { reportHandlers } from './reports'
import { studentHandlers } from './students'
import { teacherHandlers } from './teachers'

export const handlers = [
  ...authHandlers,
  ...lessonPlanHandlers,
  ...activityHandlers,
  ...classHandlers,
  ...studentHandlers,
  ...reportHandlers,
  ...gradeHandlers,
  ...teacherHandlers,
]
