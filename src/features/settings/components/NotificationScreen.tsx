import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Switch, Text, View } from 'react-native';

export default function NotificationScreen({ triggerSuccess }: { triggerSuccess: (msg: string) => void }) {

  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [dropsNotif, setDropsNotif] = useState(true);
  const [activityNotif, setActivityNotif] = useState(true);

  return (
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
  )
}
