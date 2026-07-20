import { Eye, EyeOff } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SecuritySection({ triggerSuccess }: { triggerSuccess: (msg: string) => void }) {
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
    const [is2FAEnabled, setIs2FAEnabled] = useState(true);
    const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

    // Form states - Security
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
        // Mock password update
        triggerSuccess('Password successfully updated!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <MotiView
            key="security"
            from={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'timing', duration: 200 }}
            className="gap-5"
        >
            <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-1">
                Password Settings
            </Text>

            <View className="bg-card border border-border/30 rounded-2xl p-4 gap-4">
                {/* Current password */}
                <View className="gap-2">
                    <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Current Password</Text>
                    <View className="flex-row items-center bg-background border border-border/30 rounded-xl px-3">
                        <TextInput
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry={!showPass.current}
                            placeholder="••••••••"
                            placeholderTextColor="#475569"
                            className="flex-1 py-3 text-foreground text-sm font-semibold"
                        />
                        <TouchableOpacity onPress={() => setShowPass(s => ({ ...s, current: !s.current }))}>
                            {showPass.current ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* New password */}
                <View className="gap-2">
                    <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">New Password</Text>
                    <View className="flex-row items-center bg-background border border-border/30 rounded-xl px-3">
                        <TextInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showPass.new}
                            placeholder="••••••••"
                            placeholderTextColor="#475569"
                            className="flex-1 py-3 text-foreground text-sm font-semibold"
                        />
                        <TouchableOpacity onPress={() => setShowPass(s => ({ ...s, new: !s.new }))}>
                            {showPass.new ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm password */}
                <View className="gap-2">
                    <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Confirm New Password</Text>
                    <View className="flex-row items-center bg-background border border-border/30 rounded-xl px-3">
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPass.confirm}
                            placeholder="••••••••"
                            placeholderTextColor="#475569"
                            className="flex-1 py-3 text-foreground text-sm font-semibold"
                        />
                        <TouchableOpacity onPress={() => setShowPass(s => ({ ...s, confirm: !s.confirm }))}>
                            {showPass.confirm ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleUpdatePassword}
                    activeOpacity={0.8}
                    className="bg-primary/20 border border-primary/40 rounded-xl py-3 items-center justify-center mt-2"
                >
                    <Text className="text-primary-foreground text-sm font-bold">Update Password</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mt-2 px-1">
                Security Options
            </Text>

            <View className="bg-card border border-border/30 rounded-2xl overflow-hidden">
                {/* 2FA Toggle */}
                <View className="flex-row items-center justify-between p-4 border-b border-border/30">
                    <View className="flex-1 pr-4">
                        <Text className="text-foreground text-sm font-bold">Two-Factor Authentication</Text>
                        <Text className="text-muted-foreground text-xs">Verify purchases and account access via code</Text>
                    </View>
                    <Switch
                        value={is2FAEnabled}
                        onValueChange={setIs2FAEnabled}
                        trackColor={{ false: "#19171e", true: "#6d28d9" }}
                        thumbColor={is2FAEnabled ? "#ffffff" : "#94a3b8"}
                    />
                </View>

                {/* Biometrics Toggle */}
                <View className="flex-row items-center justify-between p-4">
                    <View className="flex-1 pr-4">
                        <Text className="text-foreground text-sm font-bold">Face ID / Biometric Lock</Text>
                        <Text className="text-muted-foreground text-xs">Require biometrics to access app options</Text>
                    </View>
                    <Switch
                        value={isBiometricsEnabled}
                        onValueChange={setIsBiometricsEnabled}
                        trackColor={{ false: "#19171e", true: "#6d28d9" }}
                        thumbColor={isBiometricsEnabled ? "#ffffff" : "#94a3b8"}
                    />
                </View>
            </View>
        </MotiView>
    )
}