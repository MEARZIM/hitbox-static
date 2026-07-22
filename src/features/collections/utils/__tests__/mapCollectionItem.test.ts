import { CollectionItem } from '../../types/collection'
import {
  COLLECTION_PLACEHOLDER_IMAGE,
  titleCase,
  toCollectibleItem,
  toCollectionCard,
} from '../mapCollectionItem'

/**
 * Unit tests for the CollectionItemDto → view-model mappers.
 * See src/features/collections/__tests__/README.md for the documented matrix.
 */

/** Builds a CollectionItem, overriding the product/row fields under test. */
function makeItem(overrides: Partial<CollectionItem> = {}): CollectionItem {
  return {
    id: 'ci_1',
    visibility: 'PRIVATE',
    totalClaimedNo: 1,
    genre: 'MUSIC',
    addedAt: '2026-07-17T06:33:06.201Z',
    product: {
      id: 'p_1',
      name: 'Pierce The Veil — Poster',
      imageUrl: 'https://img/1.jpg',
      rarity: 'RARE',
      rewardPoints: 4500,
      claimedStatus: 'CLAIMED',
    },
    ...overrides,
  }
}

describe('titleCase', () => {
  // Lowercases the tail and keeps the first char — inputs are UPPER_CASE enums.
  it.each([
    ['LEGENDARY', 'Legendary'],
    ['MUSIC', 'Music'],
    ['RARE', 'Rare'],
  ])('%s → %s', (input, expected) => {
    expect(titleCase(input)).toBe(expected)
  })
})

describe('toCollectionCard', () => {
  it('maps the product name and image', () => {
    const card = toCollectionCard(makeItem())
    expect(card.id).toBe('ci_1')
    expect(card.title).toBe('Pierce The Veil — Poster')
    expect(card.image).toEqual({ uri: 'https://img/1.jpg' })
  })

  it('uses the genre as subtitle when present', () => {
    expect(toCollectionCard(makeItem({ genre: 'GAMING' })).subtitle).toBe('Gaming')
  })

  it('falls back to rarity as subtitle when genre is null', () => {
    expect(toCollectionCard(makeItem({ genre: null })).subtitle).toBe('Rare')
  })

  it('uses the placeholder image when the product has none', () => {
    const card = toCollectionCard(makeItem({ product: { ...makeItem().product, imageUrl: null } }))
    expect(card.image).toEqual({ uri: COLLECTION_PLACEHOLDER_IMAGE })
  })

  it('sets owned and total to totalClaimedNo (full bar)', () => {
    const card = toCollectionCard(makeItem({ totalClaimedNo: 3 }))
    expect(card.owned).toBe(3)
    expect(card.total).toBe(3)
  })

  it.each([
    ['LEGENDARY', true],
    ['EXCLUSIVE', true],
    ['RARE', false],
    ['COMMON', false],
  ])('flags featured for %s → %s', (rarity, featured) => {
    const card = toCollectionCard(makeItem({ product: { ...makeItem().product, rarity: rarity as any } }))
    expect(card.featured).toBe(featured)
  })
})

describe('toCollectibleItem', () => {
  it('title-cases rarity and marks the item owned/not-new', () => {
    const item = toCollectibleItem(makeItem({ product: { ...makeItem().product, rarity: 'EPIC' } }))
    expect(item.rarity).toBe('Epic')
    expect(item.owned).toBe(true)
    expect(item.isNew).toBe(false)
  })

  it('uses genre subtitle, falling back to rarity', () => {
    expect(toCollectibleItem(makeItem({ genre: 'ANIME' })).subtitle).toBe('Anime')
    expect(toCollectibleItem(makeItem({ genre: null })).subtitle).toBe('Rare')
  })

  it('falls back to the placeholder image', () => {
    const item = toCollectibleItem(makeItem({ product: { ...makeItem().product, imageUrl: null } }))
    expect(item.image).toEqual({ uri: COLLECTION_PLACEHOLDER_IMAGE })
  })
})
