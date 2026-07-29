import { useSignIn } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { LoginFormData, loginSchema } from '@/features/auth/login/schemas/LoginSchema';
import { getClerkErrorMessage, isAccountNotFound } from '@/features/auth/utils/clerk';

/**
 * Email + password sign-in inside `SignInPopup`. Reports success through
 * `onSuccess` instead of navigating, so the screen behind the popup keeps its
 * state.
 */
export default function PopupEmailForm({
    onSuccess,
    onForgotPassword,
}: {
    onSuccess: () => void;
    onForgotPassword: () => void;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const { signIn, setActive, isLoaded } = useSignIn();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: LoginFormData) => {
        if (!isLoaded) return;
        setApiError(null);

        try {
            const attempt = await signIn.create({
                identifier: data.email,
                password: data.password,
            });

            if (attempt.status === 'complete') {
                await setActive({ session: attempt.createdSessionId });
                onSuccess();
            } else {
                // e.g. MFA / additional verification configured in Clerk
                setApiError('Additional verification is required to sign in.');
            }
        } catch (err) {
            if (isAccountNotFound(err)) {
                setApiError('No account found with this email. Please register first.');
            } else {
                setApiError(getClerkErrorMessage(err));
            }
        }
    };

    return (
        <View className="gap-y-4">
            {/* Email Input */}
            <View className="gap-y-2">
                <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                    Email Address
                </Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`bg-neutral-900 border ${errors.email ? 'border-red-500' : 'border-neutral-800'} h-14 px-4 rounded-2xl text-white text-base`}
                            placeholder="Enter your email"
                            placeholderTextColor="#525252"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            textContentType="emailAddress"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.email && (
                    <Text className="text-red-500 text-xs font-medium ml-1">{errors.email.message}</Text>
                )}
            </View>

            {/* Password Input */}
            <View className="gap-y-2">
                <View className="flex-row justify-between items-center">
                    <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                        Password
                    </Text>
                    <TouchableOpacity onPress={onForgotPassword}>
                        <Text className="text-primary text-xs font-semibold">Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className={`relative flex-row items-center justify-between bg-neutral-900 border ${errors.password ? 'border-red-500' : 'border-neutral-800'} h-14 px-4 rounded-2xl w-full`}>
                            <TextInput
                                className="flex-1 text-white text-base h-full pr-10"
                                placeholder="Enter your password"
                                placeholderTextColor="#525252"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoComplete="current-password"
                                textContentType="password"
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
                {errors.password && (
                    <Text className="text-red-500 text-xs font-medium ml-1">{errors.password.message}</Text>
                )}
            </View>

            {apiError && (
                <Text className="text-red-500 text-xs font-medium text-center">{apiError}</Text>
            )}

            <TouchableOpacity
                className="bg-primary h-14 items-center justify-center rounded-2xl w-full mt-2 shadow-lg shadow-primary/20"
                disabled={isSubmitting}
                onPress={handleSubmit(onSubmit)}
            >
                {isSubmitting
                    ? <ActivityIndicator size="small" color="#FFFFFF" />
                    : <Text className="text-white font-bold text-base">Sign In</Text>}
            </TouchableOpacity>
        </View>
    );
}
