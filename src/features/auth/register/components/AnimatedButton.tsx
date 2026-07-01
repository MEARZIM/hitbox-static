import { MotiView, useAnimationState } from "moti";
import React from "react";
import { Pressable } from "react-native";

export const AnimatedButton = ({
  children,
  onPress,
  className = ""
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}) => {
  const animationState = useAnimationState({
    from: { scale: 1 },
    pressed: { scale: 0.97 },
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animationState.transitionTo('pressed')}
      onPressOut={() => animationState.transitionTo('from')}
    >
      <MotiView
        state={animationState}
        transition={{ type: 'timing', duration: 100 }}
        className={className}
      >
        {children}
      </MotiView>
    </Pressable>
  );
};