import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'

import { useUpdateCollectionVisibility } from '../updateCollectionVisibility'

/**
 * Unit tests for the useUpdateCollectionVisibility mutation hook.
 * See src/features/collections/__tests__/README.md for the documented matrix.
 */

const mockPatch = jest.fn()

jest.mock('@/lib/api', () => ({ useApi: () => ({ patch: mockPatch }) }))

let client: QueryClient

function wrapper({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

beforeEach(() => {
  jest.clearAllMocks()
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
})

describe('useUpdateCollectionVisibility', () => {
  it('PATCHes the per-product path with the new visibility', async () => {
    mockPatch.mockResolvedValueOnce({ id: 'ci_1', visibility: 'PUBLIC' })
    const { result } = renderHook(() => useUpdateCollectionVisibility(), { wrapper })

    result.current.mutate({ productId: 'p_1', visibility: 'PUBLIC' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockPatch).toHaveBeenCalledWith('/api/v1/collections/me/p_1', {
      visibility: 'PUBLIC',
    })
  })

  it('invalidates the collections cache on success', async () => {
    const invalidateSpy = jest.spyOn(client, 'invalidateQueries')
    mockPatch.mockResolvedValueOnce({ id: 'ci_1', visibility: 'PRIVATE' })
    const { result } = renderHook(() => useUpdateCollectionVisibility(), { wrapper })

    result.current.mutate({ productId: 'p_1', visibility: 'PRIVATE' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['collections'] })
  })

  it('surfaces the error and does not invalidate on failure', async () => {
    const invalidateSpy = jest.spyOn(client, 'invalidateQueries')
    mockPatch.mockRejectedValueOnce(new Error('not yours'))
    const { result } = renderHook(() => useUpdateCollectionVisibility(), { wrapper })

    result.current.mutate({ productId: 'p_x', visibility: 'PUBLIC' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})
