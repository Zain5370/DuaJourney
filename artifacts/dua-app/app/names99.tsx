import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NAMES_99 } from "@/constants/names99";
import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";

export default function Names99Screen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { t } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: (isWeb ? 20 : insets.top) + 12,
            paddingBottom: (isWeb ? 24 : insets.bottom) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.iconBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name="arrow-left" size={20} color={colors.navy} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.eyebrow, { color: colors.mutedForeground }]}
            >
              ASMA UL HUSNA
            </Text>
            <Text style={[styles.title, { color: colors.navy }]}>
              {t("names_99")}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={[colors.pink, colors.pinkSoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { borderColor: colors.border }]}
        >
          <Text style={[styles.heroArabic, { color: colors.navy }]}>
            وَلِلَّهِ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ فَٱدْعُوهُ بِهَا
          </Text>
          <Text style={[styles.heroEn, { color: colors.navySoft }]}>
            And to Allah belong the most beautiful names, so call upon Him by
            them.
          </Text>
          <Text style={[styles.heroRef, { color: colors.mutedForeground }]}>
            Surah Al-A&apos;raf 7:180
          </Text>
        </LinearGradient>

        <View style={styles.grid}>
          {NAMES_99.map((n) => (
            <View
              key={n.number}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.numBubble,
                  { backgroundColor: colors.pinkSoft },
                ]}
              >
                <Text style={[styles.numText, { color: colors.navy }]}>
                  {n.number}
                </Text>
              </View>
              <Text style={[styles.arabic, { color: colors.navy }]}>
                {n.arabic}
              </Text>
              <Text
                style={[styles.translit, { color: colors.navy }]}
              >
                {n.transliteration}
              </Text>
              <Text
                style={[styles.meaning, { color: colors.mutedForeground }]}
              >
                {n.meaning}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    gap: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    letterSpacing: 0.6,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
  },
  hero: {
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
  },
  heroArabic: {
    fontFamily: "NotoNaskhArabic_700Bold",
    fontSize: 22,
    lineHeight: 38,
    textAlign: "right",
    writingDirection: "rtl",
  },
  heroEn: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    lineHeight: 20,
  },
  heroRef: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "48.5%",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
    minHeight: 150,
  },
  numBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  numText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 12,
  },
  arabic: {
    fontFamily: "NotoNaskhArabic_700Bold",
    fontSize: 22,
    lineHeight: 36,
    textAlign: "center",
    writingDirection: "rtl",
  },
  translit: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    textAlign: "center",
  },
  meaning: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});
