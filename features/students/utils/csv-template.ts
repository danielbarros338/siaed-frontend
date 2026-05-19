export function generateCsvTemplate(): void {
  const header = 'fullName,documentType,documentId,birthDate,classId,enrollmentDate,notes'
  const example =
    'João da Silva,1,12345678901,2010-05-15,00000000-0000-0000-0000-000000000001,2026-02-01,'

  const csvContent = `${header}\n${example}`
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'template-alunos.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
