'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useImportStudents } from '@/features/students/hooks/use-import-students'
import type { ImportResult } from '@/features/students/types'
import { generateCsvTemplate } from '@/features/students/utils/csv-template'
import { extractApiErrors } from '@/lib/api/auth'
import { useRef, useState } from 'react'

export function ImportCsvForm() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [apiErrors, setApiErrors] = useState<string[]>([])
  const mutation = useImportStudents()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setFileError(null)
    setImportResult(null)
    setApiErrors([])

    if (file) {
      if (!file.name.endsWith('.csv')) {
        setFileError('Apenas arquivos .csv são permitidos.')
        setSelectedFile(null)
        return
      }
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFile) return
    setApiErrors([])
    try {
      const result = await mutation.mutateAsync(selectedFile)
      setImportResult(result)
      setSelectedFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setApiErrors(extractApiErrors(err))
    }
  }

  function handleReset() {
    setSelectedFile(null)
    setImportResult(null)
    setApiErrors([])
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      {!importResult && (
        <Card>
          <CardHeader>
            <CardTitle>Importar Alunos via CSV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-muted/20 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Formato esperado do CSV</p>
              <p className="mt-1">
                Colunas (nesta ordem): fullName, documentType, documentId, birthDate, classId,
                enrollmentDate, notes.
              </p>
              <p className="mt-1">
                Regras: documentType (1=CPF, 2=RegistroEstrangeiro, 3=IdInterno), datas em
                YYYY-MM-DD e classId em GUID. A coluna notes e opcional.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Precisa do modelo?</span>
              <Button type="button" variant="outline" size="sm" onClick={generateCsvTemplate}>
                Baixar template
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="csv-file" className="text-sm font-medium">
                  Arquivo CSV
                </label>
                <input
                  id="csv-file"
                  ref={inputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
                {fileError && <p className="text-sm text-destructive">{fileError}</p>}
              </div>

              {apiErrors.length > 0 && (
                <div className="rounded border border-destructive/50 bg-destructive/10 p-3">
                  <ul className="list-disc pl-4 space-y-1">
                    {apiErrors.map((e, i) => (
                      <li key={i} className="text-sm text-destructive">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button type="submit" disabled={!selectedFile || mutation.isPending}>
                {mutation.isPending ? 'Importando...' : 'Importar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Importação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded border p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{importResult.imported}</p>
                <p className="text-sm text-muted-foreground">Importados</p>
              </div>
              <div className="rounded border p-3 text-center">
                <p className="text-2xl font-bold text-yellow-600">{importResult.skipped}</p>
                <p className="text-sm text-muted-foreground">Ignorados</p>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="rounded border border-destructive/50 bg-destructive/10 p-3 space-y-1">
                <p className="text-sm font-medium text-destructive">Erros encontrados:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {importResult.errors.map((e, i) => (
                    <li key={i} className="text-sm text-destructive">
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button type="button" variant="outline" onClick={handleReset}>
              Importar outro arquivo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
