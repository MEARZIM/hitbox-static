import { z } from 'zod';

export const emailStepSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const otpStepSchema = z.object({
    otp: z.string().min(6, 'Verification code must be 6 digits').max(6),
});

export const passwordStepSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type EmailStepData = z.infer<typeof emailStepSchema>;
export type OtpStepData = z.infer<typeof otpStepSchema>;
export type PasswordStepData = z.infer<typeof passwordStepSchema>;