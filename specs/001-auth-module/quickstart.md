# Quickstart: Auth Module Development

**Feature**: `001-auth-module`
**Phase**: 1 — Design
**Last Updated**: 2026-05-18

---

## Pré-requisitos

- Node.js 20+
- Backend SIAED rodando em `http://localhost:5248`
  (ver `docs/backend-state.md` para setup do backend)
- Arquivo `.env.local` configurado (ver abaixo)

---

## Setup

### 1. Variável de Ambiente

Criar `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5248
```

> ⚠ **Importante**: Este projeto usa **Next.js**, não Vite. A variável correta
> é `NEXT_PUBLIC_API_URL` — não `VITE_API_BASE_URL`. Variáveis sem prefixo
> `NEXT_PUBLIC_` são invisíveis no bundle client-side do Next.js.

### 2. Instalar Dependências

```bash
npm install
```

### 3. Iniciar Dev Server

```bash
npm run dev
# → http://localhost:3000
```

---

## Rotas da Feature

| Rota        | Arquivo                                  | Proteção                                    |
|-------------|------------------------------------------|---------------------------------------------|
| `/login`    | `app/(auth)/login/page.tsx`              | Redirect → `/dashboard` se autenticado      |
| `/register` | `app/(auth)/register/page.tsx`           | Redirect → `/dashboard` se autenticado      |
| `/dashboard`| `app/(dashboard)/page.tsx`               | Redirect → `/login` se não autenticado      |

---

## Estrutura de Arquivos da Feature

```
app/
├── (auth)/
│   ├── layout.tsx                        ← Server Component: redirect se cookie presente
│   ├── login/page.tsx                    ← Server Component: renderiza <LoginView />
│   │   └── _components/login-view.tsx    ← "use client": form + useMutation
│   └── register/page.tsx
│       └── _components/register-view.tsx
├── (dashboard)/
│   └── layout.tsx                        ← Server Component: redirect se sem cookie
└── layout.tsx                            ← Root: <QueryProvider><AuthProvider>

features/auth/
├── components/
│   ├── login-form.tsx
│   └── register-form.tsx
├── hooks/
│   ├── use-login.ts
│   ├── use-register.ts
│   └── use-logout.ts
├── schemas/
│   ├── login-schema.ts
│   └── register-schema.ts
├── types/index.ts
└── utils/
    ├── cookie.ts         ← getTokenFromCookie, setAuthCookie, clearAuthCookie
    └── session.ts        ← getStoredUser, setStoredUser, clearStoredUser,
                             decodeJwtPayload, persistSession

lib/
├── api/
│   ├── client.ts         ← Axios instance + interceptors
│   └── auth.ts           ← authApi.login(), authApi.register()
├── providers/
│   ├── auth-provider.tsx ← "use client": AuthContext + session restore
│   └── query-provider.tsx
├── hooks/
│   ├── use-current-user.ts
│   └── query-keys.ts
└── types/index.ts        ← AuthResponse, LoginDto, RegisterDto, UserSession, UserRole
```

---

## Testando os Fluxos

### Fluxo de Login

1. Navegar para `http://localhost:3000/login`
2. Preencher e-mail e senha de usuário existente no banco
3. Clicar em "Entrar"
4. Verificar redirect para `/dashboard`
5. Inspecionar cookies (DevTools → Application → Cookies → localhost):
   - `siaed_token` deve estar presente
6. Inspecionar sessionStorage (DevTools → Application → Session Storage):
   - `siaed_user` deve conter `{ userId, name, email, role }`

### Fluxo de Registro

1. Navegar para `http://localhost:3000/register`
2. Preencher todos os campos obrigatórios
3. Selecionar role **Professor** → verificar que campo `Disciplina` aparece
4. Selecionar outro role → verificar que campo `Disciplina` desaparece
5. Clicar em "Registrar"
6. Verificar redirect para `/dashboard` com sessão já ativa

### Proteção de Rotas

1. Fazer login normalmente
2. DevTools → Application → Cookies → deletar `siaed_token`
3. Recarregar página ou navegar para `/dashboard/*`
4. Verificar redirect automático para `/login`

### Restauração de Sessão (sessionStorage vazio)

1. Fazer login normalmente
2. DevTools → Application → Session Storage → deletar `siaed_user`
3. Recarregar a página (F5)
4. Verificar que o usuário **permanece logado** (JWT decode restaura os dados)
5. Verificar que `siaed_user` foi recriado no sessionStorage

### Token Expirado

Para testar manualmente:

```javascript
// Executar no Console do DevTools
// Cria um JWT falso com exp no passado
const fakePayload = btoa(JSON.stringify({ sub: 'test', exp: 1000000, role: 1 }))
document.cookie = `siaed_token=header.${fakePayload}.sig; SameSite=Strict; Path=/`
```

Recarregar a página → AuthProvider deve detectar expiração → redirecionar para `/login`.

### Validação de Formulário (sem envio)

1. `/login` → submeter com e-mail inválido → verificar erro inline no campo
2. `/login` → submeter com senha < 8 chars → verificar erro inline
3. `/register` → submeter sem selecionar role → verificar erro inline
4. **Confirmar**: nenhuma chamada de rede foi feita (DevTools → Network)

---

## Debug

### Cookie não persiste?

- Acessar via `http://localhost:3000` (não `http://127.0.0.1:3000`)
- `SameSite=Strict` pode ser bloqueado se o domínio de origem for diferente
- Em desenvolvimento, a flag `Secure` é omitida automaticamente (HTTP localhost)

### API retorna 401 imediatamente após login?

- Verificar se `NEXT_PUBLIC_API_URL` está correto em `.env.local`
- Confirmar que o backend está rodando: `curl http://localhost:5248/swagger`
- Reiniciar o dev server após alterar `.env.local`

### `process.env.NEXT_PUBLIC_API_URL` retorna `undefined`?

- Confirmar nome do arquivo: `.env.local` (não `.env`, `.env.development`)
- Reiniciar completamente o dev server (`Ctrl+C` → `npm run dev`)
- Confirmar que a variável tem prefixo `NEXT_PUBLIC_` (não `VITE_`)

### AuthProvider não restaura sessão após F5?

- Verificar se `siaed_token` ainda existe no cookie (pode ter expirado)
- Verificar no Console se há erros de `decodeJwtPayload` (JWT malformado)
- Confirmar que `AuthProvider` envolve toda a app em `app/layout.tsx`

### Campo `subject` não aparece para Professor?

- Verificar que o formulário usa `watch('role')` do React Hook Form
- Confirmar que a comparação é `role === 1` (número, não `'1'` string)

---

## Comandos Úteis

```bash
# Verificar erros de TypeScript
npx tsc --noEmit

# Linting
npm run lint

# Build de produção (verifica erros de build)
npm run build
```
