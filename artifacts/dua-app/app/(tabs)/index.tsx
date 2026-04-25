import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DuaCard } from "@/components/DuaCard";
import { ProgressRing } from "@/components/ProgressRing";
import { DUAS } from "@/constants/duas";
import { useColors } from "@/hooks/useColors";
import { useProgress } from "@/contexts/ProgressContext";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const {
    ready,
    todaysDuaIds,
    completedToday,
    dailyGoal,
    isCompletedToday,
    isLearned,
  } = useProgress();

  const todaysDuas = todaysDuaIds
    .map((id) => DUAS.find((d) => d.id === id))
    .filter((d): d is (typeof DUAS)[number] => Boolean(d));

  const completedCount = completedToday.length;
  const allDoneToday = completedCount >= dailyGoal;

  const totalLearned = DUAS.filter((d) => isLearned(d.id)).length;

  if (!ready) {
    return (
      <View
        style={[
          styles.loading,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

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
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            Assalamu Alaikum
          </Text>
          <Text style={[styles.title, { color: colors.navy }]}>
            Today&apos;s Lesson
          </Text>
        </View>

        <LinearGradient
          colors={[colors.pink, colors.pinkSoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.summary, { borderColor: colors.border }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.summaryLabel, { color: colors.navy }]}>
              {allDoneToday ? "Beautifully done" : "Daily goal"}
            </Text>
            <Text style={[styles.summaryValue, { color: colors.navy }]}>
              {completedCount} of {dailyGoal} Duas
            </Text>
            <Text style={[styles.summaryHint, { color: colors.navySoft }]}>
              {allDoneToday
                ? "Come back tomorrow for two new Duas."
                : "Tick the remember checkbox to unlock the next Dua."}
            </Text>
          </View>
          <ProgressRing
            size={92}
            stroke={9}
            completed={completedCount}
            total={dailyGoal}
            label="TODAY"
          />
        </LinearGradient>

        <View style={styles.statsRow}>
          <StatCard
            icon="book-open"
            value={String(DUAS.length)}
            label="Duas in library"
          />
          <StatCard
            icon="award"
            value={String(totalLearned)}
            label="Memorized"
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>
            Your two Duas for today
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}
          >
            Complete them in order — one unlocks the next.
          </Text>
        </View>

        <View style={styles.lessonList}>
          {todaysDuas.map((dua, index) => {
            const previousId = todaysDuas[index - 1]?.id;
            const previousDone = previousId
              ? isCompletedToday(previousId)
              : true;
            const locked = !previousDone;
            const completed = isCompletedToday(dua.id);

            return (
              <View key={dua.id} style={styles.lessonItem}>
                <View
                  style={[
                    styles.indexBadge,
                    {
                      backgroundColor: completed
                        ? colors.success
                        : locked
                          ? colors.muted
                          : colors.navy,
                    },
                  ]}
                >
                  {completed ? (
                    <Feather
                      name="check"
                      size={14}
                      color={colors.successForeground}
                    />
                  ) : locked ? (
                    <Feather
                      name="lock"
                      size={12}
                      color={colors.mutedForeground}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.indexBadgeText,
                        { color: colors.primaryForeground },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <DuaCard
                    dua={dua}
                    learned={completed}
                    locked={locked}
                    variant="feature"
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  value: string;
  label: string;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View
        style={[styles.statIcon, { backgroundColor: colors.pinkSoft }]}
      >
        <Feather name={icon} size={16} color={colors.navy} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.statValue, { color: colors.navy }]}>{value}</Text>
        <Text
          style={[styles.statLabel, { color: colors.mutedForeground }]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: {
    paddingHorizontal: 20,
    gap: 22,
  },
  header: { gap: 4 },
  greeting: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 30,
    lineHeight: 36,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 22,
    borderRadius: 28,
    borderWidth: 1,
    shadowColor: "#1B2A4E",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  summaryLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  summaryValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    marginBottom: 6,
  },
  summaryHint: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 220,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
  },
  statLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
  },
  sectionHeader: { gap: 4, marginTop: 4 },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  sectionSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
  },
  lessonList: {
    gap: 14,
  },
  lessonItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  indexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  indexBadgeText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 12,
  },
});
