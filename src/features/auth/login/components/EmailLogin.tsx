import { useSignIn } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Eye, EyeOff, Mail, ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { router, useLocalSearchParams } from 'expo-router';
import { LoginFormData, loginSchema } from '../schemas/LoginSchema';

export default function EmailLogin({
    isEmailDialogOpen,
    setIsEmailDialogOpen
}: {
    isEmailDialogOpen: boolean
    setIsEmailDialogOpen: (value: boolean) => void
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    // Two-phase sign-in: credentials, then the email 2FA code the instance requires.
    const [phase, setPhase] = useState<'credentials' | 'otp'>('credentials');
    const [code, setCode] = useState('');
    const { signIn, setActive, isLoaded } = useSignIn();
    const { claimTag } = useLocalSearchParams<{ claimTag?: string }>();

    const {
        control: emailControl,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors },
        reset: resetEmailForm
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' }
    });

    const finishSignIn = async (sessionId: string | null | undefined) => {
        if (setActive && sessionId) await setActive({ session: sessionId });
        setIsEmailDialogOpen(false);
        resetEmailForm();
        setPhase('credentials');
        setCode('');
        router.replace((claimTag ? `/(routes)/claim/${claimTag}` : '/(tabs)/discover') as never);
    };

    const onEmailSubmit = async (data: LoginFormData) => {
        if (!isLoaded || !signIn || submitting) return;
        setSubmitting(true);
        setAuthError(null);
        try {
            const attempt = await signIn.create({ identifier: data.email, password: data.password });
            if (attempt.status === 'complete') {
                await finishSignIn(attempt.createdSessionId);
            } else if (attempt.status === 'needs_second_factor') {
                // Instance requires a 2FA email code — prepare + switch to OTP entry.
                const factor = attempt.supportedSecondFactors?.find((f) => f.strategy === 'email_code');
                await signIn.prepareSecondFactor({
                    strategy: 'email_code',
                    emailAddressId: (factor as { emailAddressId?: string })?.emailAddressId as string,
                });
                setPhase('otp');
            } else {
                setAuthError('Additional verification is required for this account.');
            }
        } catch (err) {
            const msg = (err as { errors?: { message?: string }[] })?.errors?.[0]?.message;
            setAuthError(msg ?? 'Sign in failed — check your email and password.');
        } finally {
            setSubmitting(false);
        }
    };

    const onVerifyCode = async () => {
        if (!isLoaded || !signIn || submitting) return;
        setSubmitting(true);
        setAuthError(null);
        try {
            const res = await signIn.attemptSecondFactor({ strategy: 'email_code', code });
            if (res.status === 'complete') {
                await finishSignIn(res.createdSessionId);
            } else {
                setAuthError('Invalid or expired code. Try again.');
            }
        } catch (err) {
            const msg = (err as { errors?: { message?: string }[] })?.errors?.[0]?.message;
            setAuthError(msg ?? 'Verification failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View>
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogTrigger asChild>
                    <TouchableOpacity className="flex-row items-center justify-between bg-background border border-neutral-800 h-14 px-4 rounded-2xl w-full">
                        <View className="flex-row items-center gap-x-3">
                            <Mail size={22} color="#FFFFFF" />
                            <Text className="text-white font-semibold text-base">Continue with Email</Text>
                        </View>
                        <ChevronRight size={18} color="#525252" />
                    </TouchableOpacity>
                </DialogTrigger>

                <DialogContent className="bg-background opacity-100 border w-[350px] border-primary p-6 rounded-3xl max-w-lg mx-auto shadow-xl shadow-primary">
                    {phase === 'credentials' ? (
                        <>
                            <DialogHeader className="mb-4">
                                <DialogTitle className="text-white text-xl font-bold">Sign In with Email</DialogTitle>
                                <Text className="text-neutral-400 text-xs mt-1">
                                    Enter your credentials to access your account.
                                </Text>
                            </DialogHeader>

                            <View className="gap-y-4">
                                {/* Email Input */}
                                <View className="gap-y-2">
                                    <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                                        Email Address
                                    </Text>
                                    <Controller
                                        control={emailControl}
                                        name="email"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                className={`bg-neutral-900 border ${emailErrors.email ? 'border-red-500' : 'border-neutral-800'} h-14 px-4 rounded-2xl text-white text-base`}
                                                placeholder="Enter your email"
                                                placeholderTextColor="#525252"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        )}
                                    />
                                    {emailErrors.email && (
                                        <Text className="text-red-500 text-xs font-medium ml-1">{emailErrors.email.message}</Text>
                                    )}
                                </View>

                                {/* Password Input */}
                                <View className="gap-y-2">
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                                            Password
                                        </Text>
                                        <TouchableOpacity onPress={() => {
                                            setIsEmailDialogOpen(false);
                                            router.push("/(auth)/forget-password")
                                        }}>
                                            <Text className="text-primary text-xs font-semibold">Forgot Password?</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Controller
                                        control={emailControl}
                                        name="password"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View className={`relative flex-row items-center justify-between bg-neutral-900 border ${emailErrors.password ? 'border-red-500' : 'border-neutral-800'} h-14 px-4 rounded-2xl w-full`}>
                                                <TextInput
                                                    className="flex-1 text-white text-base h-full pr-10"
                                                    placeholder="Enter your password"
                                                    placeholderTextColor="#525252"
                                                    secureTextEntry={!showPassword}
                                                    autoCapitalize="none"
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                />
                                                <TouchableOpacity
                                                    className="absolute right-4"
                                                    onPress={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff size={20} color="#A3A3A3" />
                                                    ) : (
                                                        <Eye size={20} color="#A3A3A3" />
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                    {emailErrors.password && (
                                        <Text className="text-red-500 text-xs font-medium ml-1">{emailErrors.password.message}</Text>
                                    )}
                                </View>

                                {authError && (
                                    <Text className="text-red-500 text-xs font-medium ml-1">{authError}</Text>
                                )}

                                <TouchableOpacity
                                    className="bg-primary h-14 flex-row gap-2 items-center justify-center rounded-2xl w-full mt-2 shadow-lg shadow-primary/20"
                                    onPress={handleEmailSubmit(onEmailSubmit)}
                                    disabled={submitting}
                                    activeOpacity={0.85}
                                >
                                    {submitting && <ActivityIndicator size="small" color="#fff" />}
                                    <Text className="text-white font-bold text-base">{submitting ? 'Signing in…' : 'Sign In'}</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <DialogHeader className="mb-4">
                                <DialogTitle className="text-white text-xl font-bold">Enter verification code</DialogTitle>
                                <Text className="text-neutral-400 text-xs mt-1">
                                    We sent a 6-digit code to your email.
                                </Text>
                            </DialogHeader>

                            <View className="gap-y-4">
                                <View className="flex-row items-center bg-neutral-900 border border-neutral-800 h-14 px-4 rounded-2xl">
                                    <ShieldCheck size={20} color="#208AEF" />
                                    <TextInput
                                        className="flex-1 text-white text-lg tracking-[8px] ml-3"
                                        placeholder="000000"
                                        placeholderTextColor="#525252"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        value={code}
                                        onChangeText={setCode}
                                    />
                                </View>

                                {authError && (
                                    <Text className="text-red-500 text-xs font-medium ml-1">{authError}</Text>
                                )}

                                <TouchableOpacity
                                    className="bg-primary h-14 flex-row gap-2 items-center justify-center rounded-2xl w-full mt-2 shadow-lg shadow-primary/20"
                                    onPress={onVerifyCode}
                                    disabled={submitting || code.length < 6}
                                    activeOpacity={0.85}
                                >
                                    {submitting && <ActivityIndicator size="small" color="#fff" />}
                                    <Text className="text-white font-bold text-base">{submitting ? 'Verifying…' : 'Verify & Sign In'}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { setPhase('credentials'); setAuthError(null); }}>
                                    <Text className="text-neutral-400 text-xs text-center">← Back to email & password</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </View>
    )
}
