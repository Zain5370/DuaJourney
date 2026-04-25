import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DuaCard } from "@/components/DuaCard";
import { ProgressRing } from "@/components/ProgressRing";
import { MenuButton } from "@/components/Sidebar";
import { DUAS, type Difficulty } from "@/constants/duas";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProgress } from "@/contexts/ProgressContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useArabicText } from "@/hooks/useArabicText";
import { useColors } from "@/hooks/useColors";

function pickDuaOfDay(): (typeof DUAS)[number] {
  const d = new Date();
  const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let seed = 0;
  for (let i = 0; i < key.length; i++) {
    seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
  }
  return DUAS[seed % DUAS.length]!;
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const { t } = useSettings();
  const {
    ready,
    todaysDuaIds,
    completedToday,
    dailyGoal,
    isCompletedToday,
    isLearned,
    streak,
  } = useProgress();
  const { favorites } = useFavorites();
  const arabic = useArabicText();

  const [query, setQuery] = useState("");

  const todaysDuas = todaysDuaIds
    .map((id) => DUAS.find((d) => d.id === id))
    .filter((d): d is (typeof DUAS)[number] => Boolean(d));

  const completedCount = completedToday.length;
  const allDoneToday = completedCount >= dailyGoal;

  const totalLearned = DUAS.filter((d) => isLearned(d.id)).length;

  const duaOfDay = useMemo(() => pickDuaOfDay(), []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return DUAS.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.english.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [query]);

  const favoriteList = DUAS.filter((d) => favorites.has(d.id)).slice(0, 3);

  const difficulties: {
    key: Difficulty;
    label: string;
    desc: string;
    icon: React.ComponentProps<typeof Feather>["name"];
  }[] = [
    {
      key: "Short",
      label: t("difficulty_short"),
      desc: t("short_desc"),
      icon: "feather",
    },
    {
      key: "Medium",
      label: t("difficulty_medium"),
      desc: t("medium_desc"),
      icon: "book-open",
    },
    {
      key: "Long",
      label: t("difficulty_long"),
      desc: t("long_desc"),
      icon: "layers",
    },
  ];

  const countByDifficulty = (d: Difficulty) =>
    DUAS.filter((x) => x.difficulty === d).length;

  if (!ready) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <MenuButton />
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              {t("greeting")}
            </Text>
            <Text style={[styles.title, { color: colors.navy }]}>
              {t("todays_lesson")}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.search,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            placeholder={t("search_placeholder")}
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { color: colors.navy }]}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={10}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {query.trim().length > 0 ? (
          <View style={{ gap: 10 }}>
            <Text style={[styles.sectionTitle, { color: colors.navy }]}>
              {searchResults.length} result
              {searchResults.length === 1 ? "" : "s"}
            </Text>
            {searchResults.length === 0 ? (
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
                  name="search"
                  size={20}
                  color={colors.mutedForeground}
                />
                <Text
                  style={[styles.emptyText, { color: colors.mutedForeground }]}
                >
                  {t("no_results")}
                </Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {searchResults.map((d) => (
                  <DuaCard key={d.id} dua={d} learned={isLearned(d.id)} />
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            <LinearGradient
              colors={[colors.pink, colors.pinkSoft]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.summary, { borderColor: colors.border }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.summaryLabel, { color: colors.navy }]}>
                  {allDoneToday ? t("beautifully_done") : t("daily_goal")}
                </Text>
                <Text style={[styles.summaryValue, { color: colors.navy }]}>
                  {completedCount} of {dailyGoal} {t("duas_count")}
                </Text>
                <Text style={[styles.summaryHint, { color: colors.navySoft }]}>
                  {allDoneToday ? t("come_back") : t("unlock_hint")}
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
                label={t("duas_in_library")}
              />
              <StatCard
                icon="award"
                value={String(totalLearned)}
                label={t("memorized")}
              />
              <StatCard
                icon="zap"
                value={String(streak.current)}
                label={t("days")}
              />
            </View>

            <Pressable
              onPress={() => router.push(`/dua/${duaOfDay.id}` as never)}
              style={({ pressed }) => [
                { transform: [{ scale: pressed ? 0.99 : 1 }] },
              ]}
            >
              <LinearGradient
                colors={["#1B2A4E", "#3B4A6F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dotdHero}
              >
                <View style={styles.dotdHeader}>
                  <View style={styles.dotdBadge}>
                    <Feather name="sun" size={12} color="#1B2A4E" />
                    <Text style={styles.dotdBadgeText}>
                      {t("dua_of_the_day")}
                    </Text>
                  </View>
                  <Feather name="arrow-right" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.dotdTitle}>{duaOfDay.title}</Text>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.dotdArabic,
                    arabic.style(22, "medium"),
                  ]}
                >
                  {duaOfDay.arabic}
                </Text>
                <Text style={styles.dotdMeta}>
                  {duaOfDay.source} · {duaOfDay.difficulty}
                </Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.navy }]}>
                {t("your_two_duas")}
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                {t("complete_in_order")}
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

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.navy }]}>
                {t("by_difficulty")}
              </Text>
            </View>
            <View style={styles.diffRow}>
              {difficulties.map((d) => (
                <Pressable
                  key={d.key}
                  onPress={() =>
                    router.push(
                      `/(tabs)/library?difficulty=${d.key}` as never,
                    )
                  }
                  style={({ pressed }) => [
                    styles.diffCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.diffIcon,
                      { backgroundColor: colors.pinkSoft },
                    ]}
                  >
                    <Feather name={d.icon} size={16} color={colors.navy} />
                  </View>
                  <Text style={[styles.diffLabel, { color: colors.navy }]}>
                    {d.label}
                  </Text>
                  <Text
                    style={[
                      styles.diffSub,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {countByDifficulty(d.key)} · {d.desc}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.navy }]}>
                {t("favorites")}
              </Text>
              <Pressable
                onPress={() =>
                  router.push("/(tabs)/favorites" as never)
                }
              >
                <Text style={[styles.linkText, { color: colors.navy }]}>
                  {t("open")}
                </Text>
              </Pressable>
            </View>
            {favoriteList.length === 0 ? (
              <View
                style={[
                  styles.empty,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.emptyIcon,
                    { backgroundColor: colors.pinkSoft },
                  ]}
                >
                  <Feather name="heart" size={20} color={colors.navy} />
                </View>
                <Text
                  style={[styles.emptyText, { color: colors.mutedForeground }]}
                >
                  {t("favorites_empty")}
                </Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {favoriteList.map((d) => (
                  <DuaCard key={d.id} dua={d} learned={isLearned(d.id)} />
                ))}
              </View>
            )}
          </>
        )}
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
      <View style={[styles.statIcon, { backgroundColor: colors.pinkSoft }]}>
        <Feather name={icon} size={14} color={colors.navy} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.statValue, { color: colors.navy }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
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
    gap: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  greeting: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    lineHeight: 34,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    paddingVertical: 0,
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
    gap: 8,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
  statLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
  },
  dotdHero: {
    padding: 22,
    borderRadius: 26,
    gap: 8,
    shadowColor: "#1B2A4E",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  dotdHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dotdBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 999,
  },
  dotdBadgeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
    color: "#1B2A4E",
    letterSpacing: 0.4,
  },
  dotdTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  dotdArabic: {
    fontFamily: "NotoNaskhArabic_500Medium",
    fontSize: 22,
    lineHeight: 36,
    textAlign: "right",
    writingDirection: "rtl",
    color: "#FFFFFF",
  },
  dotdMeta: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  sectionHeader: { gap: 4, marginTop: 4 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  sectionSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
  },
  linkText: {
    fontFamily: "Poppins_600SemiBold",
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
  diffRow: {
    flexDirection: "row",
    gap: 10,
  },
  diffCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    minHeight: 110,
  },
  diffIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  diffLabel: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
  },
  diffSub: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    lineHeight: 14,
  },
  empty: {
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    gap: 10,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    textAlign: "center",
  },
});
