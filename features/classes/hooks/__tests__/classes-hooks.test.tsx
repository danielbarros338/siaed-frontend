import { classesApi } from '@/lib/api/classes'
import { queryKeys } from '@/lib/hooks/query-keys'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useClasses } from '../use-classes'
import { useDeleteClass } from '../use-delete-class'

vi.mock('@/lib/api/classes', () => ({
  classesApi: {
    list: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  TestWrapper.displayName = 'ClassesHooksTestWrapper'

  return TestWrapper
}

describe('classes hooks', () => {
  it('carrega listagem de turmas', async () => {
    vi.mocked(classesApi.list).mockResolvedValueOnce({
      items: [
        {
          id: '1',
          name: 'Turma A',
          grade: '5º Ano',
          schoolYear: 2026,
          status: 1,
        },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    })

    const { result } = renderHook(
      () => useClasses({ page: 1, pageSize: 20, search: 'Turma' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.items).toHaveLength(1)
  })

  it('invalida cache após inativação', async () => {
    vi.mocked(classesApi.delete).mockResolvedValueOnce(undefined)

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useDeleteClass('1'), { wrapper })
    result.current.mutate()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.classes.detail('1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.classes.all })
  })
})
