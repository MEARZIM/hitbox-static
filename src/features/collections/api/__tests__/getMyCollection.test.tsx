import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'

import { useMyCollection } from '../getMyCollection'

/**
 * Unit tests for the useMyCollection query hook.
 * See src/features/collections/__tests__/README.md for the documented matrix.
 */

const mockGetPage = jest.fn()
let mockIsSignedIn = true

jest.mock('@/lib/api', () => ({ useApi: () => ({ getPage: mockGetPage, get: jest.fn() }) }))
jest.mock('@/lib/queries', () => ({ retryAuthAware: () => false }))
jest.mock('@clerk/clerk-expo', () => ({ useAuth: () => ({ isSignedIn: mockIsSignedIn }) }))

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const pageResult = {
  data: [{ id: 'ci_1' }],
  meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
}

beforeEach(() => {
  jest.clearAllMocks()
  mockIsSignedIn = true
})

describe('useMyCollection', () => {
  it('fetches the bare shelf path with no filters', async () => {
    mockGetPage.mockResolvedValueOnce(pageResult)
    const { result } = renderHook(() => useMyCollection(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetPage).toHaveBeenCalledWith('/api/v1/collections/me')
    expect(result.current.data).toEqual(pageResult)
  })

  it('builds the path from filters (genre + visibility)', async () => {
    mockGetPage.mockResolvedValueOnce(pageResult)
    renderHook(() => useMyCollection({ genre: 'MUSIC', visibility: 'PUBLIC' }), { wrapper })

    await waitFor(() =>
      expect(mockGetPage).toHaveBeenCalledWith(
        '/api/v1/collections/me?genre=MUSIC&visibility=PUBLIC'
      )
    )
  })

  it('is disabled (no fetch) when the user is signed out', async () => {
    mockIsSignedIn = false
    const { result } = renderHook(() => useMyCollection(), { wrapper })

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'))
    expect(mockGetPage).not.toHaveBeenCalled()
  })
})
