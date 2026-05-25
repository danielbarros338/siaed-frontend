const CONVENTION_PATTERNS: Record<string, RegExp> = {
  RANGE_0_10: /^(10(\.0)?|[0-9](\.[0-9])?)$/,
  LETTER_F_A: /^[A-Fa-f]$/,
}

export const CONVENTION_OPTIONS = [
  { key: 'RANGE_0_10', label: '0 a 10 (uma casa decimal)' },
  { key: 'LETTER_F_A', label: 'F a A' },
  { key: 'CUSTOM', label: 'Convencao personalizada' },
]

export function isConventionLockedByGrades(gradeCount: number): boolean {
  return gradeCount > 0
}

export function normalizeConventionKey(value: string): string {
  return value.trim().toUpperCase()
}

export function isValidGradeForConvention(gradeValue: string, conventionKey: string): boolean {
  const normalizedValue = gradeValue.trim()
  const normalizedConvention = normalizeConventionKey(conventionKey)

  if (!normalizedValue) {
    return false
  }

  const pattern = CONVENTION_PATTERNS[normalizedConvention]
  if (!pattern) {
    return true
  }

  return pattern.test(normalizedValue)
}

export function conventionValidationMessage(conventionKey: string): string {
  const normalizedConvention = normalizeConventionKey(conventionKey)

  if (normalizedConvention === 'RANGE_0_10') {
    return 'Informe uma nota de 0 a 10 (aceita uma casa decimal).'
  }

  if (normalizedConvention === 'LETTER_F_A') {
    return 'Informe uma letra entre F e A.'
  }

  return 'Informe uma nota valida para a convencao selecionada.'
}
