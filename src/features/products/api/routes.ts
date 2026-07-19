/** Products module endpoints (reads are public). */
export const PRODUCT_ROUTES = {
    list: '/api/v1/products',
    byId: (id: string) => `/api/v1/products/${id}`,
    byCode: (productCode: string) => `/api/v1/products/code/${productCode}`,
} as const

/** TanStack Query keys for the products feature. */
export const productKeys = {
    all: ['products'] as const,
    detail: (id: string) => ['products', 'byId', id] as const,
    byCode: (productCode: string) => ['products', 'byCode', productCode] as const,
}
