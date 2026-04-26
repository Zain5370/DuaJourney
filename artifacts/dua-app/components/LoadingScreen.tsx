import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  message?: string;
  error?: string | null;
  onRetry?: () => void;
}

export function LoadingScreen({ message, error, onRetry }: Props) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.02,
            duration: 1100,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.94,
            duration: 1100,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1100,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 1100,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [scale, opacity]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.pinkSoft, colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.iconHalo,
            { backgroundColor: colors.card, borderColor: colors.border },
            { transform: [{ scale }], opacity },
          ]}
        >
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={[styles.title, { color: colors.navy }]}>
          Dua Learning
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {error ? "Something went wrong" : message ?? "Loading Duas…"}
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
              {error}
            </Text>
            {onRetry ? (
              <Pressable
                onPress={onRetry}
                style={({ pressed }) => [
                  styles.retryBtn,
                  {
                    backgroundColor: colors.navy,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <ActivityIndicator
            color={colors.navy}
            style={{ marginTop: 18 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center" },
  center: { alignItems: "center", paddingHorizontal: 32 },
  iconHalo: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#1B2A4E",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
    marginBottom: 28,
  },
  icon: { width: 84, height: 84, borderRadius: 22 },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    textAlign: "center",
    maxWidth: 260,
  },
  errorBox: { alignItems: "center", marginTop: 18, gap: 14 },
  errorText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    textAlign: "center",
    maxWidth: 280,
  },
  retryBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#FFFFFF",
  },
});
