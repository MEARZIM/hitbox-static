import { buildMyCollectionPath, collectionKeys, COLLECTION_ROUTES } from '../routes'

/**
 * Unit tests for the collections route/query-key helpers.
 * See src/features/collections/__tests__/README.md for the documented matrix.
 */

describe('COLLECTION_ROUTES', () => {
  it('exposes the me / stats paths', () => {
    expect(COLLECTION_ROUTES.me).toBe('/api/v1/collections/me')
    expect(COLLECTION_ROUTES.meStats).toBe('/api/v1/collections/me/stats')
  })

  it('builds the per-item path from a product id', () => {
    expect(COLLECTION_ROUTES.meItem('p_42')).toBe('/api/v1/collections/me/p_42')
  })
})

describe('collectionKeys', () => {
  it('has stable all / stats keys', () => {
    expect(collectionKeys.all).toEqual(['collections'])
    expect(collectionKeys.stats).toEqual(['collections', 'me', 'stats'])
  })

  it('embeds filters in the me key and defaults to {}', () => {
    expect(collectionKeys.me({ genre: 'MUSIC' })).toEqual(['collections', 'me', { genre: 'MUSIC' }])
    expect(collectionKeys.me()).toEqual(['collections', 'me', {}])
  })

  it('keeps stats under the collections/me prefix (so invalidating all clears it)', () => {
    expect(collectionKeys.stats.slice(0, 1)).toEqual(collectionKeys.all)
  })
})

describe('buildMyCollectionPath', () => {
  it('returns the bare path with no filters', () => {
    expect(buildMyCollectionPath({})).toBe('/api/v1/collections/me')
  })

  it('appends genre', () => {
    expect(buildMyCollectionPath({ genre: 'SPORTS' })).toBe('/api/v1/collections/me?genre=SPORTS')
  })

  it('appends visibility', () => {
    expect(buildMyCollectionPath({ visibility: 'PUBLIC' })).toBe(
      '/api/v1/collections/me?visibility=PUBLIC'
    )
  })

  it('appends page and limit', () => {
    expect(buildMyCollectionPath({ page: 2, limit: 12 })).toBe(
      '/api/v1/collections/me?page=2&limit=12'
    )
  })

  it('combines every filter in a stable order', () => {
    expect(
      buildMyCollectionPath({ genre: 'ART', visibility: 'PRIVATE', page: 3, limit: 20 })
    ).toBe('/api/v1/collections/me?genre=ART&visibility=PRIVATE&page=3&limit=20')
  })

  it('omits page 0 (falsy)', () => {
    expect(buildMyCollectionPath({ page: 0 })).toBe('/api/v1/collections/me')
  })
})
