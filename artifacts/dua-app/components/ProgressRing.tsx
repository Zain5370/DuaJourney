import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useColors } from "@/hooks/useColors";

interface Props {
  size?: number;
  stroke?: number;
  completed: number;
  total: number;
  label?: string;
}

export function ProgressRing({
  size = 120,
  stroke = 10,
  completed,
  total,
  label,
}: Props) {
  const colors = useColors();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? Math.min(completed / total, 1) : 0;
  const dashOffset = circumference * (1 - ratio);

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.muted}
          strokeWidth={stroke}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.pink}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.value, { color: colors.navy }]}>
          {completed}
          <Text style={[styles.divider, { color: colors.mutedForeground }]}>
            /{total}
          </Text>
        </Text>
        {label && (
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            {label}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
  },
  divider: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  label: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.4,
  },
});
