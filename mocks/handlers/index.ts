import { activityHandlers } from './activities'
import { authHandlers } from './auth'
import { classHandlers } from './classes'
import { dashboardHandlers } from './dashboard'
import { gradeHandlers } from './grades'
import { lessonPlanHandlers } from './lesson-plans'
import { reportHandlers } from './reports'
import { studentHandlers } from './students'
import { teacherHandlers } from './teachers'
import { teachingPlanHandlers } from './teaching-plans'

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...lessonPlanHandlers,
  ...teachingPlanHandlers,
  ...activityHandlers,
  ...classHandlers,
  ...studentHandlers,
  ...reportHandlers,
  ...gradeHandlers,
  ...teacherHandlers,
]
