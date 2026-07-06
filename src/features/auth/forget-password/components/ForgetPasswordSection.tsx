import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'moti';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import LoginFooter from '../../login/components/LoginFooter';
import { EmailStepData, emailStepSchema, OtpStepData, otpStepSchema } from '../schemas/ForgetPassword';
import ChangePasswordSection from './ChangePasswordSection';
import OtpVerification from './OtpVerification';
import VerifyEmail from './VerifyEmail.';

export default function ForgetPasswordSection() {
    const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'password'>('email');

    const {
        control: emailControl,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors },
        getValues: getEmailValues,
    } = useForm<EmailStepData>({
        resolver: zodResolver(emailStepSchema),
        defaultValues: { email: '' },
    });

    const {
        control: otpControl,
        handleSubmit: handleOtpSubmit,
        formState: { errors: otpErrors },
        reset: resetOtpForm,
    } = useForm<OtpStepData>({
        resolver: zodResolver(otpStepSchema),
        defaultValues: { otp: '' },
    });


    return (
        <View className="bg-neutral-950 border w-[350px] border-neutral-900 p-6 rounded-3xl max-w-lg mx-auto overflow-hidden">
            {/* Logo Section */}
            <Text className="text-white text-3xl text-center font-black tracking-widest uppercase">
                HIT<Text className="text-primary">B★X</Text>
            </Text>

            {/* Content  */}
            <AnimatePresence exitBeforeEnter>

                <View className='py-2'>
                    {/* STEP 1: ENTER EMAIL */}
                    {currentStep === 'email' && (
                        <VerifyEmail
                            setCurrentStep={setCurrentStep}
                            emailControl={emailControl}
                            handleEmailSubmit={handleEmailSubmit}
                            emailErrors={emailErrors}
                        />
                    )}

                    {/* STEP 2: ENTER OTP */}
                    {currentStep === 'otp' && (
                        <OtpVerification
                            setCurrentStep={setCurrentStep}
                            getEmailValues={getEmailValues}
                            otpControl={otpControl}
                            handleOtpSubmit={handleOtpSubmit}
                            otpErrors={otpErrors}
                            resetOtpForm={resetOtpForm}
                        />
                    )}

                    {/* STEP 3: CREATE NEW PASSWORD */}
                    {currentStep === 'password' && (
                        <ChangePasswordSection
                            getEmailValues={getEmailValues}
                            setCurrentStep={setCurrentStep}
                            resetOtpForm={resetOtpForm}
                        />
                    )}
                </View>

            </AnimatePresence>

            <LoginFooter />
        </View>
    )
}