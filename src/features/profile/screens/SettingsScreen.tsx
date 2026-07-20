import { useClerk } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  User
} from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsScreenProps {
  initialTab?: 'menu' | 'personal' | 'security' | 'notifications';
}

export default function SettingsScreen({ initialTab = 'menu' }: SettingsScreenProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();

  // Navigation states: 'menu', 'personal', 'security', 'notifications'
  const [activeTab, setActiveTab] = useState<'menu' | 'personal' | 'security' | 'notifications'>(initialTab);

  // Success states
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Form states - Personal Info
  const [displayName, setDisplayName] = useState('Jane Doe');
  const [username, setUsername] = useState('janedoe');
  const [email, setEmail] = useState('jane.doe@example.com');
  const [bio, setBio] = useState('Digital collector & music enthusiast.');

  // Form states - Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

  // Form states - Notifications
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [dropsNotif, setDropsNotif] = useState(true);
  const [activityNotif, setActivityNotif] = useState(true);

  const triggerSuccess = (message: string) => {
    setSaveSuccess(message);
    setTimeout(() => {
      setSaveSuccess(null);
    }, 3000);
  };

  const handleSaveProfile = () => {
    // Mock save profile
    triggerSuccess('Personal information updated!');
  };

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear(); // drop cached user data for the next account
    router.replace('/');
  };

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

  const goBack = () => {
    if (activeTab === 'menu') {
      router.back();
    } else {
      setActiveTab('menu');
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'personal': return 'Personal Information';
      case 'security': return 'Security Settings';
      case 'notifications': return 'Notification Prefs';
      default: return 'Settings';
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background"
    >
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-border/20">
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-muted justify-center items-center"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>

        <Text className="text-foreground text-lg font-bold text-center flex-1">
          {getHeaderTitle()}
        </Text>

        {/* Spacer for alignment */}
        <View className="w-10" />
      </View>

      {/* Success banner */}
      {saveSuccess && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -20 }}
          className="mx-4 mt-4 bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-xl flex-row items-center gap-2"
        >
          <CheckCircle2 size={18} color="#10b981" />
          <Text className="text-emerald-400 font-semibold text-sm">{saveSuccess}</Text>
        </MotiView>
      )}

      <ScrollView
        className="flex-1 px-4 mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <AnimatePresence exitBeforeEnter>

          {/* MAIN MENU */}
          {activeTab === 'menu' && (
            <MotiView
              key="menu"
              from={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: 'timing', duration: 200 }}
              className="gap-4"
            >
              <Text className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-1 px-1">
                Account Settings
              </Text>

              <View className="bg-card border border-border/30 rounded-2xl overflow-hidden">
                <TouchableOpacity
                  onPress={() => setActiveTab('personal')}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between p-4 border-b border-border/30"
                >
                  <View className="flex-row items-center gap-4 flex-1">
                    <View className="w-9 h-9 rounded-xl bg-violet-600/10 items-center justify-center border border-violet-500/20">
                      <User size={18} color="#8b5cf6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground text-sm font-bold">Personal Information</Text>
                      <Text className="text-muted-foreground text-xs">Update username, bio, and email info</Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#94a3b8" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab('security')}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between p-4 border-b border-border/30"
                >
                  <View className="flex-row items-center gap-4 flex-1">
                    <View className="w-9 h-9 rounded-xl bg-violet-600/10 items-center justify-center border border-violet-500/20">
                      <Lock size={18} color="#8b5cf6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground text-sm font-bold">Security & Password</Text>
                      <Text className="text-muted-foreground text-xs">Manage passwords, Face ID and 2FA</Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#94a3b8" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab('notifications')}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between p-4"
                >
                  <View className="flex-row items-center gap-4 flex-1">
                    <View className="w-9 h-9 rounded-xl bg-violet-600/10 items-center justify-center border border-violet-500/20">
                      <Bell size={18} color="#8b5cf6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground text-sm font-bold">Notifications</Text>
                      <Text className="text-muted-foreground text-xs">Toggle push notifications and emails</Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#94a3b8" />
                </TouchableOpacity>

                {/* Sign Out */}
                 <TouchableOpacity
                  onPress={handleSignOut}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between p-4"
                >
                  <View className="flex-row items-center gap-4 flex-1">
                    <View className="w-9 h-9 rounded-xl bg-destructive-80/30 items-center justify-center border border-violet-500/20">
                      <LogOut size={20} color="red" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground text-sm font-bold">Sign Out</Text>
                      <Text className="text-muted-foreground text-xs">Log out of your HitBox account</Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </MotiView>
          )}

          {/* PERSONAL INFORMATION SCREEN */}
          {activeTab === 'personal' && (
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
          )}

          {/* SECURITY SCREEN */}
          {activeTab === 'security' && (
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
          )}

          {/* NOTIFICATIONS SCREEN */}
          {activeTab === 'notifications' && (
            <MotiView
              key="notifications"
              from={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: 'timing', duration: 200 }}
              className="gap-4"
            >
              <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider px-1">
                Notification Channels
              </Text>

              <View className="bg-card border border-border/30 rounded-2xl overflow-hidden">
                {/* Push notification */}
                <View className="flex-row items-center justify-between p-4 border-b border-border/30">
                  <View className="flex-1 pr-4">
                    <Text className="text-foreground text-sm font-bold">Push Notifications</Text>
                    <Text className="text-muted-foreground text-xs">Receive instant updates on your mobile screen</Text>
                  </View>
                  <Switch
                    value={pushNotif}
                    onValueChange={(val) => {
                      setPushNotif(val);
                      triggerSuccess(`Push notifications ${val ? 'enabled' : 'disabled'}`);
                    }}
                    trackColor={{ false: "#19171e", true: "#6d28d9" }}
                    thumbColor={pushNotif ? "#ffffff" : "#94a3b8"}
                  />
                </View>

                {/* Email notification */}
                <View className="flex-row items-center justify-between p-4 border-b border-border/30">
                  <View className="flex-1 pr-4">
                    <Text className="text-foreground text-sm font-bold">Email Notifications</Text>
                    <Text className="text-muted-foreground text-xs">Receive summaries and transactional emails</Text>
                  </View>
                  <Switch
                    value={emailNotif}
                    onValueChange={(val) => {
                      setEmailNotif(val);
                      triggerSuccess(`Email notifications ${val ? 'enabled' : 'disabled'}`);
                    }}
                    trackColor={{ false: "#19171e", true: "#6d28d9" }}
                    thumbColor={emailNotif ? "#ffffff" : "#94a3b8"}
                  />
                </View>

                {/* Drops notification */}
                <View className="flex-row items-center justify-between p-4 border-b border-border/30">
                  <View className="flex-1 pr-4">
                    <Text className="text-foreground text-sm font-bold">Exclusive Drops & Offers</Text>
                    <Text className="text-muted-foreground text-xs">Be the first to know about new album releases</Text>
                  </View>
                  <Switch
                    value={dropsNotif}
                    onValueChange={(val) => {
                      setDropsNotif(val);
                      triggerSuccess(`Drop alerts ${val ? 'enabled' : 'disabled'}`);
                    }}
                    trackColor={{ false: "#19171e", true: "#6d28d9" }}
                    thumbColor={dropsNotif ? "#ffffff" : "#94a3b8"}
                  />
                </View>

                {/* Activity notification */}
                <View className="flex-row items-center justify-between p-4">
                  <View className="flex-1 pr-4">
                    <Text className="text-foreground text-sm font-bold">Account Activity</Text>
                    <Text className="text-muted-foreground text-xs">Security alerts, login checks and details</Text>
                  </View>
                  <Switch
                    value={activityNotif}
                    onValueChange={(val) => {
                      setActivityNotif(val);
                      triggerSuccess(`Activity alerts ${val ? 'enabled' : 'disabled'}`);
                    }}
                    trackColor={{ false: "#19171e", true: "#6d28d9" }}
                    thumbColor={activityNotif ? "#ffffff" : "#94a3b8"}
                  />
                </View>
              </View>
            </MotiView>
          )}



        </AnimatePresence>
      </ScrollView>
    </SafeAreaView>
  );
}
