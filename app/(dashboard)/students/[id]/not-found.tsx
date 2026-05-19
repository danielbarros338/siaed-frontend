import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function StudentNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Aluno não encontrado</h1>
      <p className="mt-2 text-muted-foreground">
        O aluno que você está procurando não existe ou foi removido.
      </p>
      <Button asChild className="mt-6">
        <Link href="/students">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Alunos
        </Link>
      </Button>
    </div>
  )
}
