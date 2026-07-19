import { Copy, ExternalLink, ShieldCheck } from "lucide-react-native";
import React, { useState } from "react";
import { Text, Clipboard, TouchableOpacity, View } from "react-native";

const PURPLE = "#a855f7";

interface OwnershipProofProps {
  txHash: string;
  displayHash: string;
  verifiedDate: string;
}

export default function OwnershipProof({ txHash, displayHash, verifiedDate }: OwnershipProofProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="mt-6 rounded-[24px] border border-white/5 bg-[#110e16]/30 p-4 pb-5">
      {/* Top Header Row */}
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center flex-1 pr-3">
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#a855f7]/10 border border-[#a855f7]/20">
            <ShieldCheck size={22} color={PURPLE} />
          </View>
          <View className="ml-3 flex-1 gap-0.5">
            <Text className="text-[13px] font-bold text-white">
              Ownership Proof
            </Text>
            <Text className="text-[11px] leading-4 text-zinc-400">
              This item's ownership is recorded on the blockchain and cannot be altered.
            </Text>
          </View>
        </View>

        {/* View on Explorer Button */}
        <TouchableOpacity 
          className="bg-[#181226] border border-[#a855f7]/20 rounded-full px-3 py-1.5 flex-row items-center gap-1.5"
          onPress={() => console.log("View explorer clicked")}
        >
          <Text className="text-[10px] font-bold text-[#a855f7]">
            View on Explorer
          </Text>
          <ExternalLink size={10} color={PURPLE} />
        </TouchableOpacity>
      </View>

      {/* Details Row (Separated by border) */}
      <View className="mt-4 pt-4 border-t border-white/5 flex-row items-center justify-between">
        {/* Verification ID column */}
        <View className="gap-1 flex-[1]">
          <Text className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
            Verification ID
          </Text>
          <TouchableOpacity 
            className="flex-row items-center gap-1.5"
            onPress={handleCopy}
          >
            <Text className="text-[11px] font-bold text-zinc-300">
              {displayHash}
            </Text>
            <Copy size={12} color={copied ? "#10b981" : "#71717a"} />
          </TouchableOpacity>
        </View>

        {/* Verified On column */}
        <View className="gap-1 flex-[1.2] px-2">
          <Text className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
            Verified on
          </Text>
          <Text className="text-[11px] font-bold text-white">
            {verifiedDate}
          </Text>
        </View>

        {/* Verified Badge column */}
        <View className="items-end justify-center">
          <View className="border border-emerald-500/20 bg-[#0B1512] rounded-full px-2.5 py-1">
            <Text className="text-[9px] font-black text-emerald-400 uppercase tracking-wide">
              Verified
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
