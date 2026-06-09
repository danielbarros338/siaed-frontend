'use client';
  
import { useRouter } from "next/navigation";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card";

export function RegisterSuccessView() {
  const router = useRouter();
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Cadastro realizado com sucesso!</CardTitle>
        <CardDescription>
          Verifique o email cadastrado para ativar sua conta e começar a usar o SIAED.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/login')}
        >
          Ir para Login
        </Button>
      </CardContent>
    </Card>
  )
}
