/** Matches GET /api/v1/users/me (MeDto). */
export interface Me {
    id: string
    username: string | null
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
    createdAt: string
    email: string
    role: 'USER'
    state: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
    rewardPoints: number
}

/** Matches GET /api/v1/users/:id (public profile). */
export interface PublicUser {
    id: string
    username: string | null
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
    createdAt: string
}