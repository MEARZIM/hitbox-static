import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StepProgressHeaderProps {
  currentStep: number;
  totalSteps?: number;
  onBackPress?: () => void;
}

export default function StepProgressHeader({
  currentStep,
  totalSteps = 5,
  onBackPress,
}: StepProgressHeaderProps) {
  const activeStep = Math.min(Math.max(currentStep, 1), totalSteps);

  return (
    <View className="px-4 py-3 flex-row items-center justify-between">
      {/* Back Button */}
      <TouchableOpacity onPress={onBackPress} className="p-2 -ml-2 active:opacity-60">
        <ChevronLeft size={24} color="#fff" />
      </TouchableOpacity>

      {/* Progress Multi-step Tracker Container */}
      <View className="items-center flex-1 pr-6">
        <View className="flex-row space-x-1.5 items-center mb-1">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isCompletedOrActive = index < activeStep;
            return (
              <View
                key={index}
                className={`h-1 w-6 rounded-full ${isCompletedOrActive ? 'bg-primary' : 'bg-neutral-800'
                  }`}
              />
            );
          })}
        </View>
        <Text className="text-neutral-400 text-xs font-medium">
          Step {activeStep} of {totalSteps}
        </Text>
      </View>
    </View>
  );
}