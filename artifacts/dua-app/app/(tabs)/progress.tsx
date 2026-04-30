import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

import { DuaCard } from "@/components/DuaCard";
import { ProgressRing } from "@/components/ProgressRing";
import { MenuButton } from "@/components/Sidebar";
import { CATEGORIES } from "@/constants/duas";
import { useDuas } from "@/contexts/DuasContext";
import { useColors } from "@/hooks/useColors";
import { useProgress } from "@/contexts/ProgressContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function ProgressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { learnedIds, resetProgress, streak } = useProgress();
  const { t } = useSettings();
  const { duas } = useDuas();

  const total = duas.length;
  const learned = duas.filter((d) => learnedIds.has(d.id));
  const remaining = total - learned.length;

  const byCategory = CATEGORIES.map((cat) => {
    const inCat = duas.filter((d) => d.category === cat);
    const learnedInCat = inCat.filter((d) => learnedIds.has(d.id)).length;
    return { category: cat, learned: learnedInCat, total: inCat.length };
  }).filter((c) => c.total > 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: (isWeb ? 67 : insets.top) + 12,
            paddingBottom: (isWeb ? 84 : insets.bottom) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <MenuButton />
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
              Your Journey
            </Text>
            <Text style={[styles.title, { color: colors.navy }]}>
              {t("progress_tab")}
            </Text>
          </View>
        </View>

        <View style={styles.streakRow}>
          <View
            style={[
              styles.streakCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[styles.streakIcon, { backgroundColor: colors.pinkSoft }]}
            >
              <Feather name="zap" size={16} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.streakValue, { color: colors.navy }]}>
                {streak.current}
              </Text>
              <Text
                style={[styles.streakLabel, { color: colors.mutedForeground }]}
              >
                {t("current_streak")}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.streakCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[styles.streakIcon, { backgroundColor: colors.pinkSoft }]}
            >
              <Feather name="award" size={16} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.streakValue, { color: colors.navy }]}>
                {streak.best}
              </Text>
              <Text
                style={[styles.streakLabel, { color: colors.mutedForeground }]}
              >
                {t("best_streak")}
              </Text>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={["#1B2A4E", "#3B4A6F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.heroLabel}>Memorized so far</Text>
            <Text style={styles.heroValue}>
              {learned.length}{" "}
              <Text style={styles.heroValueLight}>of {total}</Text>
            </Text>
            <Text style={styles.heroHint}>
              {remaining === 0
                ? "MashaAllah — you have completed every Dua in the library."
                : `${remaining} more to go on your journey.`}
            </Text>
          </View>
          <ProgressRing
            size={104}
            stroke={10}
            completed={learned.length}
            total={total}
            label="OVERALL"
            trackColor="rgba(255,255,255,0.18)"
            fillColor="#F8C1CC"
            valueColor="#FFFFFF"
            subColor="#FCE7EE"
          />
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>
            By Category
          </Text>
          <View style={{ gap: 10 }}>
            {byCategory.map((row) => {
              const ratio = row.learned / row.total;
              return (
                <View
                  key={row.category}
                  style={[
                    styles.categoryRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.categoryRowTop}>
                    <Text
                      style={[
                        styles.categoryName,
                        { color: colors.navy },
                      ]}
                    >
                      {row.category}
                    </Text>
                    <Text
                      style={[
                        styles.categoryCount,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {row.learned}/{row.total}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.barTrack,
                      { backgroundColor: colors.muted },
                    ]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        {
                          backgroundColor: colors.pink,
                          width: `${ratio * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>
            {learned.length === 0
              ? "Start your collection"
              : "Recently memorized"}
          </Text>

          {learned.length === 0 ? (
            <View
              style={[
                styles.empty,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather
                name="bookmark"
                size={28}
                color={colors.mutedForeground}
              />
              <Text style={[styles.emptyTitle, { color: colors.navy }]}>
                No Duas memorized yet
              </Text>
              <Text
                style={[
                  styles.emptyText,
                  { color: colors.mutedForeground },
                ]}
              >
                Tick the remember checkbox on today&apos;s Duas to begin.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {learned.slice(0, 6).map((dua) => (
                <DuaCard key={dua.id} dua={dua} learned />
              ))}
            </View>
          )}
        </View>

        {learned.length > 0 && (
          <Pressable
            onPress={resetProgress}
            style={({ pressed }) => [
              styles.resetButton,
              {
                borderColor: colors.border,
                backgroundColor: colors.card,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather
              name="rotate-ccw"
              size={14}
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.resetText, { color: colors.mutedForeground }]}
            >
              Reset progress
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    gap: 22,
  },
  header: { gap: 4 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  streakRow: {
    flexDirection: "row",
    gap: 12,
  },
  streakCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  streakIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  streakValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
  },
  streakLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
  },
  eyebrow: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
    borderRadius: 28,
    gap: 16,
    shadowColor: "#1B2A4E",
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  heroLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#FCE7EE",
  },
  heroValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 32,
    color: "#FFFFFF",
  },
  heroValueLight: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    color: "#FCE7EE",
  },
  heroHint: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#F8C1CC",
    maxWidth: 220,
  },
  section: { gap: 12 },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  categoryRow: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  categoryRowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryName: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  categoryCount: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  barTrack: {
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  empty: {
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  emptyText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    textAlign: "center",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  resetText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
  },
});
