/**
 * Unit tests for the shared data-layer helpers the profile hooks rely on:
 * `queryKeys` and the `retryAuthAware` retry policy (from @/lib/queries).
 * See src/features/profile/__tests__/README.md for the documented matrix.
 */

// lib/queries + lib/api both import useAuth at module load — stub it.
jest.mock('@clerk/clerk-expo', () => ({ useAuth: () => ({ isSignedIn: true }) }))

import { ApiRequestError } from '@/lib/api'
import { queryKeys, retryAuthAware } from '@/lib/queries'

describe('queryKeys', () => {
  it('exposes stable auth/me keys', () => {
    expect(queryKeys.authMe).toEqual(['auth', 'me'])
    expect(queryKeys.me).toEqual(['users', 'me'])
  })

  it('builds a per-user key from an id', () => {
    expect(queryKeys.user('u_9')).toEqual(['users', 'u_9'])
  })
})

describe('retryAuthAware', () => {
  const err = (status: number, code: string) => new ApiRequestError(status, { code, message: code })

  it('retries the post-signup webhook race (AUTH_ACCOUNT_NOT_FOUND) up to 5 times', () => {
    const e = err(401, 'AUTH_ACCOUNT_NOT_FOUND')
    expect(retryAuthAware(0, e)).toBe(true)
    expect(retryAuthAware(4, e)).toBe(true)
    expect(retryAuthAware(5, e)).toBe(false)
  })

  it('does NOT retry other 4xx API errors', () => {
    expect(retryAuthAware(0, err(409, 'USERS_USERNAME_TAKEN'))).toBe(false)
    expect(retryAuthAware(0, err(404, 'USERS_NOT_FOUND'))).toBe(false)
  })

  it('retries unknown/network errors up to twice', () => {
    const e = new Error('network')
    expect(retryAuthAware(0, e)).toBe(true)
    expect(retryAuthAware(1, e)).toBe(true)
    expect(retryAuthAware(2, e)).toBe(false)
  })

  it('retries a 5xx API error (server-side, transient) up to twice', () => {
    const e = err(500, 'INTERNAL_ERROR')
    expect(retryAuthAware(0, e)).toBe(true)
    expect(retryAuthAware(2, e)).toBe(false)
  })
})
