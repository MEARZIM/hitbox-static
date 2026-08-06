import React, { useState } from 'react';
import { Text, View } from 'react-native';

import AlternativeSignInOptionSection from './AlternativeSignInOptionSection';
import EmailLogin from './EmailLogin';
import PhoneNumberLogin from './PhoneNumberLogin';



export default function AuthActionCtx() {
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);


    return (
        <View className="w-full my-6 gap-y-3">

            {/* --- ALTERNATIVE SOCIAL SIGN INS --- */}
            <AlternativeSignInOptionSection />

            {/* --- DIVIDER --- */}
            <View className="flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-neutral-800" />
                <Text className="text-neutral-500 text-xs px-3 font-semibold">OR CONTINUE WITH</Text>
                <View className="flex-1 h-[1px] bg-neutral-800" />
            </View>


            {/* CONTINUE WITH EMAIL DIALOG SECTION */}

            <EmailLogin isEmailDialogOpen={isEmailDialogOpen} setIsEmailDialogOpen={setIsEmailDialogOpen} />


            {/* CONTINUE WITH PHONE NUMBER DIALOG SECTION */}

            <PhoneNumberLogin isPhoneDialogOpen={isPhoneDialogOpen} setIsPhoneDialogOpen={setIsPhoneDialogOpen} />


        </View>
    );
}