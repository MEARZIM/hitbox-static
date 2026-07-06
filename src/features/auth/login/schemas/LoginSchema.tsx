import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const phoneSchema = z.object({
    phoneNumber: z.string()
        .min(1, 'Phone number is required')
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
});

export const otpSchema = z.object({
    otp: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type PhoneFormData = z.infer<typeof phoneSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;