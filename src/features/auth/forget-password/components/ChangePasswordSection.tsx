import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react-native'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import { Controller, useForm, UseFormGetValues, UseFormReset } from 'react-hook-form'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

import { PasswordStepData, passwordStepSchema } from '../schemas/ForgetPassword'

export default function ChangePasswordSection({
    getEmailValues,
    setCurrentStep,
    resetOtpForm
}: {
    getEmailValues: UseFormGetValues<{
        email: string;
    }>
    resetOtpForm: UseFormReset<{
        otp: string;
    }>
    setCurrentStep: (val: "email" | "otp" | "password") => void
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
    } = useForm<PasswordStepData>({
        resolver: zodResolver(passwordStepSchema),
        defaultValues: { password: '', confirmPassword: '' },
    });

    const onPasswordSubmit = (data: PasswordStepData) => {
        console.log('Updating password credentials for account:', getEmailValues('email'));

        // Reset component states back to step 1
        setCurrentStep('email');
        resetOtpForm();
        resetPasswordForm();
    };

    return (
        <MotiView
            key="password-step"
            from={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ type: 'timing', duration: 200 }}
            className="w-full"
        >
            <View className="mb-6">
                <TouchableOpacity
                    onPress={() => setCurrentStep('otp')}
                    className="flex-row items-center gap-x-1.5 mb-4"
                >
                    <ArrowLeft size={16} color="#A3A3A3" />
                    <Text className="text-neutral-400 text-xs font-medium">Back</Text>
                </TouchableOpacity>
                <View className="bg-neutral-900 border border-neutral-800 w-12 h-12 rounded-2xl items-center justify-center mb-4">
                    <KeyRound size={22} color="#FFFFFF" />
                </View>
                <Text className="text-white text-xl font-bold">Reset Password</Text>
                <Text className="text-neutral-400 text-xs mt-1">
                    Set a strong new security password for your account.
                </Text>
            </View>

            <View className="gap-y-4">
                <View className="gap-y-2">
                    <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                        New Password
                    </Text>
                    <Controller
                        control={passwordControl}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className={`relative flex-row items-center justify-between bg-neutral-900 border ${passwordErrors.password ? 'border-red-500' : 'border-neutral-800'} h-14 px-4 rounded-2xl w-full`}>
                                <TextInput
                                    className="flex-1 text-white text-base h-full pr-10"
                                    placeholder="Minimum 6 characters"
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
                                    {showPassword ? <EyeOff size={20} color="#A3A3A3" /> : <Eye size={20} color="#A3A3A3" />}
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    {passwordErrors.password && (
                        <Text className="text-red-500 text-xs font-medium ml-1">{passwordErrors.password.message}</Text>
                    )}
                </View>

                <View className="gap-y-2">
                    <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                        Confirm Password
                    </Text>
                    <Controller
                        control={passwordControl}
                        name="confirmPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className={`relative flex-row items-center justify-between bg-neutral-900 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-neutral-800'} h-14 px-4 rounded-2xl w-full`}>
                                <TextInput
                                    className="flex-1 text-white text-base h-full pr-10"
                                    placeholder="Re-enter your password"
                                    placeholderTextColor="#525252"
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                <TouchableOpacity
                                    className="absolute right-4"
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} color="#A3A3A3" /> : <Eye size={20} color="#A3A3A3" />}
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    {passwordErrors.confirmPassword && (
                        <Text className="text-red-500 text-xs font-medium ml-1">{passwordErrors.confirmPassword.message}</Text>
                    )}
                </View>

                <TouchableOpacity
                    className="bg-primary h-14 items-center justify-center rounded-2xl w-full mt-2 shadow-lg shadow-primary/20"
                    onPress={handlePasswordSubmit(onPasswordSubmit)}
                >
                    <Text className="text-white font-bold text-base">Update Password</Text>
                </TouchableOpacity>
            </View>
        </MotiView>
    )
}