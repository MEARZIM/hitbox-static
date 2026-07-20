import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PersonalInfoSection({ triggerSuccess }: { triggerSuccess: (msg: string) => void }) {

    const [displayName, setDisplayName] = useState('Jane Doe');
    const [username, setUsername] = useState('janedoe');
    const [email, setEmail] = useState('jane.doe@example.com');
    const [bio, setBio] = useState('Digital collector & music enthusiast.');
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);


    const handleSaveProfile = () => {
        // Mock save profile
        triggerSuccess('Personal information updated!');
    };

    return (
        <MotiView
            key="personal"
            from={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'timing', duration: 200 }}
            className="gap-5"
        >
            <View className="gap-2">
                <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-1">
                    Display Name
                </Text>
                <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter full name"
                    placeholderTextColor="#475569"
                    className="bg-card border border-border/30 rounded-xl px-4 py-3 text-foreground text-sm font-semibold"
                />
            </View>

            <View className="gap-2">
                <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-1">
                    Username
                </Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholder="Enter username"
                    placeholderTextColor="#475569"
                    className="bg-card border border-border/30 rounded-xl px-4 py-3 text-foreground text-sm font-semibold"
                />
            </View>

            <View className="gap-2">
                <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-1">
                    Email Address
                </Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Enter email address"
                    placeholderTextColor="#475569"
                    className="bg-card border border-border/30 rounded-xl px-4 py-3 text-foreground text-sm font-semibold"
                />
            </View>

            <View className="gap-2">
                <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-1">
                    Bio Description
                </Text>
                <TextInput
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={3}
                    placeholder="Tell us about yourself"
                    placeholderTextColor="#475569"
                    className="bg-card border border-border/30 rounded-xl px-4 py-3 text-foreground text-sm font-semibold min-h-[80px] textAlignVertical-top"
                    style={{ textAlignVertical: 'top' }}
                />
            </View>

            <TouchableOpacity
                onPress={handleSaveProfile}
                activeOpacity={0.8}
                className="bg-primary rounded-xl py-3.5 mt-2 items-center justify-center border border-primary-foreground/10"
            >
                <Text className="text-foreground text-sm font-bold">Save Changes</Text>
            </TouchableOpacity>
        </MotiView>
    )
}