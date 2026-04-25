import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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

import { RememberCheckbox } from "@/components/RememberCheckbox";
import { DUAS } from "@/constants/duas";
import { useColors } from "@/hooks/useColors";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProgress } from "@/contexts/ProgressContext";

export default function DuaDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    todaysDuaIds,
    isCompletedToday,
    isLearned,
    markCompleted,
    unmarkCompleted,
  } = useProgress();
  const { isFavorite, toggleFavorite } = useFavorites();

  const dua = DUAS.find((d) => d.id === id);

  if (!dua) {
    return (
      <View
        style={[
          styles.notFound,
          { backgroundColor: colors.background },
        ]}
      >
        <Stack.Screen options={{ title: "Not found" }} />
        <Text style={[styles.notFoundText, { color: colors.navy }]}>
          Dua not found
        </Text>
      </View>
    );
  }

  const isToday = todaysDuaIds.includes(dua.id);
  const todayDone = isCompletedToday(dua.id);
  const learned = isLearned(dua.id);

  const handleToggle = async () => {
    if (todayDone) {
      await unmarkCompleted(dua.id);
    } else {
      await markCompleted(dua.id);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View
        style={[
          styles.topBar,
          { paddingTop: (isWeb ? 67 : insets.top) + 8 },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.iconBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="arrow-left" size={18} color={colors.navy} />
        </Pressable>
        <View
          style={[
            styles.tag,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.tagText, { color: colors.navy }]}>
            {dua.category}
          </Text>
        </View>
        <Pressable
          onPress={() => toggleFavorite(dua.id)}
          style={({ pressed }) => [
            styles.iconBtn,
            {
              backgroundColor: isFavorite(dua.id)
                ? colors.pink
                : colors.card,
              borderColor: isFavorite(dua.id) ? colors.pink : colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather
            name="heart"
            size={18}
            color={colors.navy}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: (isWeb ? 84 : insets.bottom) + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 6, paddingHorizontal: 20 }}>
          <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
            {dua.source}  ·  {dua.difficulty}
          </Text>
          <Text style={[styles.title, { color: colors.navy }]}>
            {dua.title}
          </Text>
        </View>

        <LinearGradient
          colors={[colors.cream, colors.pinkSoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.arabicCard, { borderColor: colors.border }]}
        >
          <Text
            style={[styles.arabic, { color: colors.navy }]}
            adjustsFontSizeToFit
          >
            {dua.arabic}
          </Text>
        </LinearGradient>

        <View style={[styles.block, { paddingHorizontal: 20 }]}>
          <Text style={[styles.blockLabel, { color: colors.mutedForeground }]}>
            TRANSLITERATION
          </Text>
          <Text style={[styles.transliteration, { color: colors.navy }]}>
            {dua.transliteration}
          </Text>
        </View>

        <View
          style={[
            styles.translationCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              marginHorizontal: 20,
            },
          ]}
        >
          <View style={styles.translationHeader}>
            <View
              style={[
                styles.flag,
                { backgroundColor: colors.pinkSoft },
              ]}
            >
              <Text style={[styles.flagText, { color: colors.navy }]}>UR</Text>
            </View>
            <Text
              style={[styles.translationTitle, { color: colors.navy }]}
            >
              Urdu
            </Text>
          </View>
          <Text style={[styles.urdu, { color: colors.navy }]}>{dua.urdu}</Text>
        </View>

        <View
          style={[
            styles.translationCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              marginHorizontal: 20,
            },
          ]}
        >
          <View style={styles.translationHeader}>
            <View
              style={[
                styles.flag,
                { backgroundColor: colors.pinkSoft },
              ]}
            >
              <Text style={[styles.flagText, { color: colors.navy }]}>EN</Text>
            </View>
            <Text
              style={[styles.translationTitle, { color: colors.navy }]}
            >
              English
            </Text>
          </View>
          <Text style={[styles.english, { color: colors.navy }]}>
            {dua.english}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
          {isToday ? (
            <RememberCheckbox
              checked={todayDone}
              onToggle={handleToggle}
              label={
                todayDone
                  ? "Memorized — beautifully done"
                  : "I have memorized this Dua"
              }
            />
          ) : (
            <View
              style={[
                styles.infoNote,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather
                name={learned ? "check-circle" : "info"}
                size={16}
                color={learned ? colors.success : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.infoNoteText,
                  { color: colors.mutedForeground },
                ]}
              >
                {learned
                  ? "You have already memorized this Dua."
                  : "This Dua is not part of today's lesson, but feel free to read it."}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnPlaceholder: { width: 40, height: 40 },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  content: {
    gap: 20,
    paddingTop: 8,
  },
  eyebrow: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
  },
  arabicCard: {
    marginHorizontal: 20,
    padding: 26,
    borderRadius: 28,
    borderWidth: 1,
    minHeight: 180,
    justifyContent: "center",
    shadowColor: "#1B2A4E",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  arabic: {
    fontFamily: "NotoNaskhArabic_500Medium",
    fontSize: 30,
    lineHeight: 56,
    textAlign: "right",
    writingDirection: "rtl",
  },
  block: { gap: 8 },
  blockLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    letterSpacing: 0.8,
  },
  transliteration: {
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    lineHeight: 24,
    fontStyle: "italic",
  },
  translationCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
  },
  translationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  flag: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  flagText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 11,
  },
  translationTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  urdu: {
    fontFamily: "NotoNastaliqUrdu_400Regular",
    fontSize: 18,
    lineHeight: 38,
    textAlign: "right",
    writingDirection: "rtl",
  },
  english: {
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
    lineHeight: 24,
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoNoteText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
});
