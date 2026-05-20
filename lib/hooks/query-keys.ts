export const queryKeys = {
  lessonPlans: {
    all: ['lesson-plans'] as const,
    list: (params: object) => ['lesson-plans', 'list', params] as const,
    detail: (id: string) => ['lesson-plans', 'detail', id] as const,
  },
  activities: {
    all: ['activities'] as const,
    list: (params: object) => ['activities', 'list', params] as const,
    detail: (id: string) => ['activities', 'detail', id] as const,
    generationResult: (id: string) => ['activities', 'generation-result', id] as const,
  },
  students: {
    all: ['students'] as const,
    list: (params: object) => ['students', 'list', params] as const,
    detail: (id: string) => ['students', 'detail', id] as const,
  },
  classes: {
    all: ['classes'] as const,
    list: (params: object) => ['classes', 'list', params] as const,
    detail: (id: string) => ['classes', 'detail', id] as const,
  },
  teachers: {
    all: ['teachers'] as const,
    list: (params: object) => ['teachers', 'list', params] as const,
  },
}
