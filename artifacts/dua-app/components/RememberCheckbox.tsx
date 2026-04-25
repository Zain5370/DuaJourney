import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  checked: boolean;
  onToggle: () => void;
  label?: string;
}

export function RememberCheckbox({ checked, onToggle, label }: Props) {
  const colors = useColors();

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(
        checked
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium,
      );
    }
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.wrapper,
        {
          backgroundColor: "#386845",
          borderColor: "#386845",
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: checked ? "#ffffff" : "transparent",
            borderColor: "#ffffff",
          },
        ]}
      >
        {checked && <Feather name="check" size={16} color="#386845" />}
      </View>
      <Text style={[styles.label, { color: "#ffffff" }]}>
        {label ?? "I have memorized this Dua"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    flex: 1,
  },
});
