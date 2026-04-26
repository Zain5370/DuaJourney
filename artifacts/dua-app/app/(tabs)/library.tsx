import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DuaCard } from "@/components/DuaCard";
import { FilterPills } from "@/components/FilterPills";
import { MenuButton } from "@/components/Sidebar";
import {
  CATEGORIES,
  LENGTHS,
  type Category,
  type Length,
} from "@/constants/duas";
import { useDuas } from "@/contexts/DuasContext";
import { useColors } from "@/hooks/useColors";
import { useProgress } from "@/contexts/ProgressContext";

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { isLearned } = useProgress();
  const { duas } = useDuas();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [length, setLength] = useState<Length | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return duas.filter((d) => {
      if (category !== "All" && d.category !== category) return false;
      if (length !== "All" && d.length !== length) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.english.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q) ||
        d.bookReference.toLowerCase().includes(q) ||
        d.hadithNumber.toLowerCase().includes(q)
      );
    });
  }, [query, category, length, duas]);

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
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
              Dua Library
            </Text>
            <Text style={[styles.title, { color: colors.navy }]}>
              Browse all Duas
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
            placeholder="Search by title, source, or meaning"
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { color: colors.navy }]}
          />
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>
            CATEGORY
          </Text>
          <FilterPills
            options={CATEGORIES}
            selected={category}
            onSelect={setCategory}
          />
        </View>

        <View style={{ gap: 10 }}>
          <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>
            LENGTH
          </Text>
          <FilterPills
            options={LENGTHS}
            selected={length}
            onSelect={setLength}
          />
        </View>

        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsCount, { color: colors.navy }]}>
            {filtered.length} {filtered.length === 1 ? "Dua" : "Duas"}
          </Text>
        </View>

        <View style={styles.list}>
          {filtered.length === 0 ? (
            <View
              style={[
                styles.empty,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather
                name="inbox"
                size={28}
                color={colors.mutedForeground}
              />
              <Text style={[styles.emptyTitle, { color: colors.navy }]}>
                No Duas found
              </Text>
              <Text
                style={[
                  styles.emptyText,
                  { color: colors.mutedForeground },
                ]}
              >
                Try a different search or filter combination.
              </Text>
            </View>
          ) : (
            filtered.map((dua) => (
              <DuaCard key={dua.id} dua={dua} learned={isLearned(dua.id)} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    gap: 18,
  },
  header: { gap: 4 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  filterLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    letterSpacing: 0.8,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  resultsCount: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  list: { gap: 12 },
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
});
