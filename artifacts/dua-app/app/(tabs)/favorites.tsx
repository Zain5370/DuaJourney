import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DuaCard } from "@/components/DuaCard";
import { MenuButton } from "@/components/Sidebar";
import { useDuas } from "@/contexts/DuasContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProgress } from "@/contexts/ProgressContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { favorites } = useFavorites();
  const { isLearned } = useProgress();
  const { t } = useSettings();
  const { duas } = useDuas();

  const items = duas.filter((d) => favorites.has(d.id));

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
              {t("favorites").toUpperCase()}
            </Text>
            <Text style={[styles.title, { color: colors.navy }]}>
              {t("favorites")}
            </Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View
            style={[
              styles.empty,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.emptyIcon,
                { backgroundColor: colors.pinkSoft },
              ]}
            >
              <Feather name="heart" size={28} color={colors.navy} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.navy }]}>
              {t("favorites")}
            </Text>
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              {t("favorites_empty")}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {items.map((d) => (
              <DuaCard key={d.id} dua={d} learned={isLearned(d.id)} />
            ))}
          </View>
        )}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  list: { gap: 10 },
  empty: {
    padding: 28,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    gap: 10,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
  },
  emptyText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
