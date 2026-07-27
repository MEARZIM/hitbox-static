import * as z from 'zod'

/**
 * Mirrors the PATCH /api/v1/users/me body rules from the backend API reference:
 * all fields optional, username 3–50 chars (letters/numbers/_/.), names ≤100.
 * Validating client-side keeps the 422 VALIDATION_ERROR round-trip for edge cases only.
 */
export const editProfileSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be at most 50 characters')
        .regex(/^[a-zA-Z0-9_.]+$/, 'Only letters, numbers, underscore and dot are allowed'),
    firstName: z
        .string()
        .max(100, 'First name must be at most 100 characters'),
    lastName: z
        .string()
        .max(100, 'Last name must be at most 100 characters'),
})

export type EditProfileFormData = z.infer<typeof editProfileSchema>
