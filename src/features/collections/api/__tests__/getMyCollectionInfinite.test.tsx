import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'

import { useMyCollectionInfinite } from '../getMyCollectionInfinite'

/**
 * Unit tests for the useMyCollectionInfinite (load-more) query hook.
 * See src/features/collections/__tests__/README.md for the documented matrix.
 */

const mockGetPage = jest.fn()

jest.mock('@/lib/api', () => ({ useApi: () => ({ getPage: mockGetPage, get: jest.fn() }) }))
jest.mock('@/lib/queries', () => ({ retryAuthAware: () => false }))
jest.mock('@clerk/clerk-expo', () => ({ useAuth: () => ({ isSignedIn: true }) }))

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const makePage = (page: number, totalPages: number) => ({
  data: [{ id: `ci_${page}` }],
  meta: { page, limit: 12, total: totalPages * 12, totalPages },
})

beforeEach(() => jest.clearAllMocks())

describe('useMyCollectionInfinite', () => {
  it('fetches page 1 with the default limit and exposes hasNextPage', async () => {
    mockGetPage.mockResolvedValueOnce(makePage(1, 2))
    const { result } = renderHook(() => useMyCollectionInfinite(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetPage).toHaveBeenCalledWith('/api/v1/collections/me?page=1&limit=20')
    expect(result.current.hasNextPage).toBe(true)
  })

  it('has no next page when only one page exists', async () => {
    mockGetPage.mockResolvedValueOnce(makePage(1, 1))
    const { result } = renderHook(() => useMyCollectionInfinite({ limit: 12 }), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.hasNextPage).toBe(false)
  })

  it('fetchNextPage requests the next page and accumulates items', async () => {
    mockGetPage.mockResolvedValueOnce(makePage(1, 2)).mockResolvedValueOnce(makePage(2, 2))
    const { result } = renderHook(() => useMyCollectionInfinite({ limit: 12 }), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    result.current.fetchNextPage()

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2))
    expect(mockGetPage).toHaveBeenLastCalledWith('/api/v1/collections/me?page=2&limit=12')
    const items = result.current.data!.pages.flatMap((p) => p.data)
    expect(items).toEqual([{ id: 'ci_1' }, { id: 'ci_2' }])
  })
})
