import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'

import { useCollectionStats } from '../getCollectionStats'

/**
 * Unit tests for the useCollectionStats query hook.
 * See src/features/collections/__tests__/README.md for the documented matrix.
 */

const mockGet = jest.fn()
let mockIsSignedIn = true

jest.mock('@/lib/api', () => ({ useApi: () => ({ get: mockGet, getPage: jest.fn() }) }))
jest.mock('@/lib/queries', () => ({ retryAuthAware: () => false }))
jest.mock('@clerk/clerk-expo', () => ({ useAuth: () => ({ isSignedIn: mockIsSignedIn }) }))

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const stats = {
  totalClaimedItems: 3,
  totalArtistCollections: 2,
  collectionProgress: { owned: 3, total: 20, percentage: 15 },
}

beforeEach(() => {
  jest.clearAllMocks()
  mockIsSignedIn = true
})

describe('useCollectionStats', () => {
  it('fetches GET /api/v1/collections/me/stats and returns the aggregates', async () => {
    mockGet.mockResolvedValueOnce(stats)
    const { result } = renderHook(() => useCollectionStats(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGet).toHaveBeenCalledWith('/api/v1/collections/me/stats')
    expect(result.current.data).toEqual(stats)
  })

  it('does not fetch when signed out', async () => {
    mockIsSignedIn = false
    const { result } = renderHook(() => useCollectionStats(), { wrapper })

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'))
    expect(mockGet).not.toHaveBeenCalled()
  })
})
