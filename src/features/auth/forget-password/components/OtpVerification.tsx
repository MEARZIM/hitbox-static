import { ArrowLeft, ShieldAlert } from 'lucide-react-native'
import { MotiView } from 'moti'
import React from 'react'
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormHandleSubmit, UseFormReset } from 'react-hook-form'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

import { OtpStepData } from '../schemas/ForgetPassword'

export default function OtpVerification({
    setCurrentStep,
    getEmailValues,
    otpControl,
    handleOtpSubmit,
    otpErrors,
    resetOtpForm
}: {
    setCurrentStep: (val: "email" | "otp" | "password") => void,
    getEmailValues: UseFormGetValues<{
        email: string;
    }>,
    otpControl: Control<{
        otp: string;
    }, any, {
        otp: string;
    }>,
    handleOtpSubmit: UseFormHandleSubmit<{
        otp: string;
    }, {
        otp: string;
    }>,
    otpErrors: FieldErrors<{
        otp: string;
    }>,
    resetOtpForm: UseFormReset<{
        otp: string;
    }>
}) {

    const onOtpSubmit = (data: OtpStepData) => {
        console.log('Verifying recovery OTP code:', data.otp);
        setCurrentStep('password');
    };


    return (
        <MotiView
            key="otp-step"
            from={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ type: 'timing', duration: 200 }}
            className="w-full"
        >
            <View className="mb-6">
                <TouchableOpacity
                    onPress={() => setCurrentStep('email')}
                    className="flex-row items-center gap-x-1.5 mb-4"
                >
                    <ArrowLeft size={16} color="#A3A3A3" />
                    <Text className="text-neutral-400 text-xs font-medium">Back</Text>
                </TouchableOpacity>
                <View className="bg-neutral-900 border border-neutral-800 w-12 h-12 rounded-2xl items-center justify-center mb-4">
                    <ShieldAlert size={22} color="#FFFFFF" />
                </View>
                <Text className="text-white text-xl font-bold">Verify Identity</Text>
                <Text className="text-neutral-400 text-xs mt-1">
                    Enter the secure 6-digit code sent to {getEmailValues('email') || 'your email'}.
                </Text>
            </View>

            <View className="gap-y-4">
                <View className="gap-y-2">
                    <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                        Verification Code
                    </Text>
                    <Controller
                        control={otpControl}
                        name="otp"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className={`bg-neutral-900 border ${otpErrors.otp ? 'border-red-500' : 'border-neutral-800'} h-14 px-4 rounded-2xl text-white text-center text-lg font-bold tracking-widest`}
                                placeholder="000000"
                                placeholderTextColor="#525252"
                                keyboardType="number-pad"
                                maxLength={6}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {otpErrors.otp && (
                        <Text className="text-red-500 text-xs font-medium ml-1">{otpErrors.otp.message}</Text>
                    )}
                </View>

                <TouchableOpacity
                    className="bg-primary h-14 items-center justify-center rounded-2xl w-full mt-2 shadow-lg shadow-primary/20"
                    onPress={handleOtpSubmit(onOtpSubmit)}
                >
                    <Text className="text-white font-bold text-base">Verify Code</Text>
                </TouchableOpacity>
            </View>
        </MotiView>
    )
}