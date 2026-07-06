import { Mail } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Control, Controller, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EmailStepData } from '../schemas/ForgetPassword';

export default function VerifyEmail({
    setCurrentStep,
    emailControl,
    handleEmailSubmit,
    emailErrors,
}: {
    setCurrentStep: (val: "email" | "otp" | "password") => void,
    emailControl: Control<{
        email: string;
    }, any, {
        email: string;
    }>,
    handleEmailSubmit: UseFormHandleSubmit<{
        email: string;
    }, {
        email: string;
    }>,
    emailErrors: FieldErrors<{
        email: string;
    }>,
   
}) {

    const onEmailSubmit = (data: EmailStepData) => {
        console.log('Sending recovery OTP code to:', data.email);
        setCurrentStep('otp');
    };

    return (
        <MotiView
            key="email-step"
            from={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'timing', duration: 200 }}
            className="w-full"
        >
            <View className="mb-6">
                <View className="bg-neutral-900 border border-neutral-800 w-12 h-12 rounded-2xl items-center justify-center mb-4">
                    <Mail size={22} color="#FFFFFF" />
                </View>
                <Text className="text-white text-xl font-bold">Forgot Password</Text>
                <Text className="text-neutral-400 text-xs mt-1">
                    Enter your registered email address to reset your account credentials.
                </Text>
            </View>

            <View className="gap-y-4">
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

                <TouchableOpacity
                    className="bg-primary h-14 items-center justify-center rounded-2xl w-full mt-2 shadow-lg shadow-primary/20"
                    onPress={handleEmailSubmit(onEmailSubmit)}
                >
                    <Text className="text-white font-bold text-base">Send Code</Text>
                </TouchableOpacity>
            </View>
        </MotiView>
    )
}