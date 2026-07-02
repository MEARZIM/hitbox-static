import { ChevronRight, ShieldCheck } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function OwnershipWidget() {
  return (
    <View 
      className="mx-5 mt-5 p-4 flex-row items-center justify-between rounded-[20px] border border-emerald-500/20 bg-[#0A1612]"
      style={{
        shadowColor: "#10b981",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      {/* Icon and Text Left */}
      <View className="flex-row items-center flex-1 pr-3">
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck size={22} color="#10b981" />
        </View>
        <View className="ml-3 flex-1 gap-0.5">
          <Text className="text-[13px] font-bold text-white">
            You Own This Item
          </Text>
          <Text className="text-[11px] leading-4 text-zinc-400">
            This item is securely stored in your collection on the blockchain.
          </Text>
        </View>
      </View>

      {/* Button Right */}
      <TouchableOpacity 
        className="bg-[#12231E] border border-emerald-500/20 rounded-full px-3 py-1.5 flex-row items-center gap-1"
        onPress={() => console.log("View ownership pressed")}
      >
        <Text className="text-[10px] font-bold text-emerald-400">
          View Ownership
        </Text>
        <ChevronRight size={10} color="#10b981" />
      </TouchableOpacity>
    </View>
  );
}
