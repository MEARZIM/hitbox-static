import { Me, PublicUser, useApi } from "@/lib/api"
import { queryKeys, retryAuthAware } from "@/lib/queries"
import { useAuth } from "@clerk/clerk-expo"
import { useQuery } from "@tanstack/react-query"

/** GET /api/v1/users/me — full own profile (email, points, state). */
export function useMe() {
    const api = useApi()
    const { isSignedIn } = useAuth()

    return useQuery({
        queryKey: queryKeys.me,
        queryFn: () => api.get<Me>('/api/v1/users/me'),
        enabled: !!isSignedIn,
        staleTime: 1000 * 60 * 5,
        retry: retryAuthAware,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    })
}

/** GET /api/v1/users/:id — public profile. */
export function useUser(id: string | undefined) {
    const api = useApi()

    return useQuery({
        queryKey: queryKeys.user(id ?? ''),
        queryFn: () => api.get<PublicUser>(`/api/v1/users/${id}`),
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
    })
}