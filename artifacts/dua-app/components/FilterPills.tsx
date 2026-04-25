import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props<T extends string> {
  options: readonly T[];
  selected: T | "All";
  onSelect: (value: T | "All") => void;
  includeAll?: boolean;
}

export function FilterPills<T extends string>({
  options,
  selected,
  onSelect,
  includeAll = true,
}: Props<T>) {
  const colors = useColors();
  const allOptions: (T | "All")[] = includeAll
    ? (["All", ...options] as (T | "All")[])
    : (options as (T | "All")[]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {allOptions.map((opt) => {
        const isActive = opt === selected;
        return (
          <Pressable
            key={opt}
            onPress={() => onSelect(opt)}
            style={({ pressed }) => [
              styles.pill,
              {
                backgroundColor: isActive ? colors.navy : colors.card,
                borderColor: isActive ? colors.navy : colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? colors.primaryForeground : colors.navy,
                  fontFamily: isActive
                    ? "Poppins_600SemiBold"
                    : "Poppins_500Medium",
                },
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
  },
});
