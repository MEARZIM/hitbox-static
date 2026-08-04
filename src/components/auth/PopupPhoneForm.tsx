import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import {
    OtpFormData,
    otpSchema,
    PhoneFormData,
    phoneSchema,
} from '@/features/auth/login/schemas/LoginSchema';
import { getClerkErrorMessage, isAccountNotFound } from '@/features/auth/utils/clerk';

const COUNTRIES = [
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
];

/**
 * Phone SMS one-time-code sign-in inside `SignInPopup`. An unknown number is
 * signed **up** instead (same behaviour as the login screen). Reports success
 * through `onSuccess` rather than navigating.
 */
export default function PopupPhoneForm({ onSuccess }: { onSuccess: () => void }) {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
    // Whether the OTP belongs to a sign-in (existing account) or sign-up (new account)
    const [otpMode, setOtpMode] = useState<'signIn' | 'signUp'>('signIn');
    const [apiError, setApiError] = useState<string | null>(null);

    const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
    const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

    const {
        control: phoneControl,
        handleSubmit: handlePhoneSubmit,
        formState: { errors: phoneErrors, isSubmitting: isPhoneSubmitting },
        getValues: getPhoneValues,
    } = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phoneNumber: '' },
    });

    const {
        control: otpControl,
        handleSubmit: handleOtpSubmit,
        formState: { errors: otpErrors, isSubmitting: isOtpSubmitting },
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' },
    });

    const onPhoneSubmit = async (data: PhoneFormData) => {
        if (!isSignInLoaded || !isSignUpLoaded) return;
        setApiError(null);
        const fullNumber = `${selectedCountry.code}${data.phoneNumber}`;

        try {
            // Existing account → SMS code sign-in
            const { supportedFirstFactors } = await signIn.create({ identifier: fullNumber });
            const phoneCodeFactor = supportedFirstFactors?.find(
                (factor) => factor.strategy === 'phone_code'
            );

            if (!phoneCodeFactor || !('phoneNumberId' in phoneCodeFactor)) {
                setApiError('SMS sign-in is not available for this account.');
                return;
            }

            await signIn.prepareFirstFactor({
                strategy: 'phone_code',
                phoneNumberId: phoneCodeFactor.phoneNumberId,
            });
            setOtpMode('signIn');
            setStep('otp');
        } catch (err) {
            if (isAccountNotFound(err)) {
                // No account for this number → create one via phone sign-up
                try {
                    await signUp.create({ phoneNumber: fullNumber });
                    await signUp.preparePhoneNumberVerification();
                    setOtpMode('signUp');
                    setStep('otp');
                } catch (signUpErr) {
                    setApiError(getClerkErrorMessage(signUpErr));
                }
            } else {
                setApiError(getClerkErrorMessage(err));
            }
        }
    };

    const onOtpSubmit = async (data: OtpFormData) => {
        if (!isSignInLoaded || !isSignUpLoaded) return;
        setApiError(null);

        try {
            const attempt = otpMode === 'signIn'
                ? await signIn.attemptFirstFactor({ strategy: 'phone_code', code: data.otp })
                : await signUp.attemptPhoneNumberVerification({ code: data.otp });

            if (attempt.status === 'complete') {
                await setActive({ session: attempt.createdSessionId });
                onSuccess();
            } else {
                setApiError('Verification is incomplete. Please try again.');
            }
        } catch (err) {
            setApiError(getClerkErrorMessage(err));
        }
    };

    if (step === 'phone') {
        return (
            <View className="gap-y-4">
                <View className="gap-y-2 relative">
                    <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                        Phone Number
                    </Text>

                    <View className="flex-row gap-x-2 z-10">
                        {/* Country Code Trigger Selector Button */}
                        <TouchableOpacity
                            onPress={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
                            className="bg-neutral-900 border border-neutral-800 h-14 px-3 rounded-2xl flex-row items-center justify-center gap-x-1"
                        >
                            <Text className="text-base">{selectedCountry.flag}</Text>
                            <Text className="text-white font-medium text-base">{selectedCountry.code}</Text>
                            <ChevronDown size={14} color="#A3A3A3" />
                        </TouchableOpacity>

                        {/* Main Phone Input Field */}
                        <View className="flex-1">
                            <Controller
                                control={phoneControl}
                                name="phoneNumber"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className={`bg-neutral-900 border ${phoneErrors.phoneNumber ? 'border-red-500' : 'border-neutral-800'} h-14 px-4 rounded-2xl text-white text-base`}
                                        placeholder="555 000-0000"
                                        placeholderTextColor="#525252"
                                        keyboardType="phone-pad"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                        </View>
                    </View>

                    {/* Dropdown Menu Container */}
                    <AnimatePresence>
                        {isCountryPickerOpen && (
                            <MotiView
                                from={{ opacity: 0, translateY: -10 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                exit={{ opacity: 0, translateY: -10 }}
                                transition={{ type: 'timing', duration: 150 }}
                                className="absolute z-[1000] opacity-100 left-0 right-0 top-[85px] bg-neutral-900 border border-neutral-800 rounded-2xl max-h-44 overflow-hidden shadow-2xl"
                            >
                                <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                                    {COUNTRIES.map((country, index) => (
                                        <TouchableOpacity
                                            key={`${country.code}-${index}`}
                                            onPress={() => {
                                                setSelectedCountry(country);
                                                setIsCountryPickerOpen(false);
                                            }}
                                            className="flex-row items-center justify-between p-3 border-b border-neutral-800/50 last:border-b-0 active:bg-neutral-800"
                                        >
                                            <View className="flex-row items-center gap-x-2">
                                                <Text className="text-base">{country.flag}</Text>
                                                <Text className="text-white text-sm font-medium">{country.name}</Text>
                                            </View>
                                            <Text className="text-neutral-400 text-sm">{country.code}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </MotiView>
                        )}
                    </AnimatePresence>

                    {phoneErrors.phoneNumber && (
                        <Text className="text-red-500 text-xs font-medium ml-1">{phoneErrors.phoneNumber.message}</Text>
                    )}
                </View>

                {apiError && (
                    <Text className="text-red-500 text-xs font-medium text-center">{apiError}</Text>
                )}

                <TouchableOpacity
                    className="bg-primary h-14 items-center justify-center rounded-2xl w-full mt-2 shadow-lg shadow-primary/20"
                    disabled={isPhoneSubmitting}
                    onPress={handlePhoneSubmit(onPhoneSubmit)}
                >
                    {isPhoneSubmitting
                        ? <ActivityIndicator size="small" color="#FFFFFF" />
                        : <Text className="text-white font-bold text-base">Send Code</Text>}
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="gap-y-4">
            <View className="gap-y-2">
                <View className="flex-row justify-between items-center">
                    <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                        Verification Code
                    </Text>
                    <TouchableOpacity onPress={() => setStep('phone')}>
                        <Text className="text-primary text-xs font-semibold">Change Number</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-neutral-500 text-xs">
                    Sent to {selectedCountry.code} {getPhoneValues('phoneNumber')}
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

            {apiError && (
                <Text className="text-red-500 text-xs font-medium text-center">{apiError}</Text>
            )}

            <TouchableOpacity
                className="bg-primary h-14 items-center justify-center rounded-2xl w-full mt-2 shadow-lg shadow-primary/20"
                disabled={isOtpSubmitting}
                onPress={handleOtpSubmit(onOtpSubmit)}
            >
                {isOtpSubmitting
                    ? <ActivityIndicator size="small" color="#FFFFFF" />
                    : <Text className="text-white font-bold text-base">Submit OTP</Text>}
            </TouchableOpacity>
        </View>
    );
}
