'use client'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { LessonPlanStatusFilter } from '@/features/lesson-plans/types'

interface LessonPlansFiltersProps {
  status?: LessonPlanStatusFilter
  isAIGenerated?: boolean
  onStatusChange: (status?: LessonPlanStatusFilter) => void
  onIsAIGeneratedChange: (isAIGenerated?: boolean) => void
  onClear: () => void
}

export function LessonPlansFilters({
  status,
  isAIGenerated,
  onStatusChange,
  onIsAIGeneratedChange,
  onClear,
}: LessonPlansFiltersProps) {
  const originValue =
    typeof isAIGenerated === 'boolean' ? (isAIGenerated ? 'true' : 'false') : 'all'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={status ?? 'all'} onValueChange={(value) => onStatusChange(value === 'all' ? undefined : (value as LessonPlanStatusFilter))}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="Draft">Rascunho</SelectItem>
          <SelectItem value="Published">Publicado</SelectItem>
          <SelectItem value="Archived">Arquivado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={originValue}
        onValueChange={(value) => {
          if (value === 'all') {
            onIsAIGeneratedChange(undefined)
            return
          }
          onIsAIGeneratedChange(value === 'true')
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Origem" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">IA e Manual</SelectItem>
          <SelectItem value="true">Somente IA</SelectItem>
          <SelectItem value="false">Somente Manual</SelectItem>
        </SelectContent>
      </Select>

      <Button type="button" variant="outline" size="sm" onClick={onClear}>
        Limpar filtros
      </Button>
    </div>
  )
}
