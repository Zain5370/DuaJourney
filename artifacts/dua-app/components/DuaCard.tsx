import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { Dua } from "@/constants/duas";

interface Props {
  dua: Dua;
  learned?: boolean;
  locked?: boolean;
  variant?: "compact" | "feature";
}

export function DuaCard({ dua, learned, locked, variant = "compact" }: Props) {
  const colors = useColors();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(dua.id);

  const isFeature = variant === "feature";

  const handlePress = () => {
    if (locked) return;
    router.push(`/dua/${dua.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.wrapper,
        {
          opacity: locked ? 0.55 : pressed ? 0.92 : 1,
          transform: [{ scale: pressed && !locked ? 0.985 : 1 }],
        },
      ]}
    >
      {isFeature ? (
        <LinearGradient
          colors={[colors.cream, colors.pinkSoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            styles.feature,
            { borderColor: colors.border },
          ]}
        >
          <FeatureContent dua={dua} learned={learned} locked={locked} />
          <FavoriteButton
            active={fav}
            onPress={() => toggleFavorite(dua.id)}
          />
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.card,
            styles.compact,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <CompactContent
            dua={dua}
            learned={learned}
            locked={locked}
            isFavorite={fav}
            onToggleFavorite={() => toggleFavorite(dua.id)}
          />
        </View>
      )}
    </Pressable>
  );
}

function FavoriteButton({
  active,
  onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.favFloating,
        {
          backgroundColor: active ? colors.pink : colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Feather
        name="heart"
        size={14}
        color={active ? colors.navy : colors.mutedForeground}
      />
    </Pressable>
  );
}

function FeatureContent({
  dua,
  learned,
  locked,
}: {
  dua: Dua;
  learned?: boolean;
  locked?: boolean;
}) {
  const colors = useColors();
  return (
    <>
      <View style={styles.featureHeader}>
        <View
          style={[
            styles.tag,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.tagText, { color: colors.navySoft }]}>
            {dua.category}
          </Text>
        </View>
        {locked ? (
          <View style={[styles.statusDot, { backgroundColor: colors.muted }]}>
            <Feather name="lock" size={12} color={colors.mutedForeground} />
          </View>
        ) : learned ? (
          <View style={[styles.statusDot, { backgroundColor: colors.success }]}>
            <Feather name="check" size={12} color={colors.successForeground} />
          </View>
        ) : null}
      </View>

      <Text style={[styles.featureTitle, { color: colors.navy }]}>
        {dua.title}
      </Text>

      <Text
        style={[styles.arabic, { color: colors.navy }]}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        {dua.arabic}
      </Text>

      <Text style={[styles.urdu, { color: colors.navySoft }]} numberOfLines={2}>
        {dua.urdu}
      </Text>

      <View style={styles.featureFooter}>
        <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
          {dua.source}
        </Text>
        <View style={styles.cta}>
          <Text style={[styles.ctaText, { color: colors.navy }]}>
            {locked ? "Locked" : "Open"}
          </Text>
          {!locked && (
            <Feather name="arrow-right" size={16} color={colors.navy} />
          )}
        </View>
      </View>
    </>
  );
}

function CompactContent({
  dua,
  learned,
  locked,
  isFavorite,
  onToggleFavorite,
}: {
  dua: Dua;
  learned?: boolean;
  locked?: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const colors = useColors();
  return (
    <>
      <View style={styles.compactRow}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text
            style={[styles.compactTitle, { color: colors.navy }]}
            numberOfLines={1}
          >
            {dua.title}
          </Text>
          <Text
            style={[styles.arabicSmall, { color: colors.navy }]}
            numberOfLines={1}
          >
            {dua.arabic}
          </Text>
          <View style={styles.compactMeta}>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {dua.source}
            </Text>
            <View
              style={[styles.dot, { backgroundColor: colors.mutedForeground }]}
            />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {dua.difficulty}
            </Text>
          </View>
        </View>

        <View style={styles.compactRight}>
          <Pressable
            onPress={onToggleFavorite}
            hitSlop={10}
            style={({ pressed }) => [
              styles.favInline,
              {
                backgroundColor: isFavorite ? colors.pink : "transparent",
                borderColor: isFavorite ? colors.pink : colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather
              name="heart"
              size={13}
              color={isFavorite ? colors.navy : colors.mutedForeground}
            />
          </Pressable>

          {locked ? (
            <View style={[styles.statusDot, { backgroundColor: colors.muted }]}>
              <Feather name="lock" size={12} color={colors.mutedForeground} />
            </View>
          ) : learned ? (
            <View
              style={[styles.statusDot, { backgroundColor: colors.success }]}
            >
              <Feather
                name="check"
                size={12}
                color={colors.successForeground}
              />
            </View>
          ) : (
            <Feather
              name="chevron-right"
              size={20}
              color={colors.mutedForeground}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
  },
  feature: {
    padding: 22,
    minHeight: 220,
    shadowColor: "#1B2A4E",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  compact: {
    padding: 16,
    shadowColor: "#1B2A4E",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    letterSpacing: 0.4,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    marginBottom: 14,
  },
  arabic: {
    fontFamily: "NotoNaskhArabic_500Medium",
    fontSize: 28,
    lineHeight: 46,
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 10,
  },
  arabicSmall: {
    fontFamily: "NotoNaskhArabic_400Regular",
    fontSize: 18,
    lineHeight: 30,
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 2,
    marginBottom: 6,
  },
  urdu: {
    fontFamily: "NotoNastaliqUrdu_400Regular",
    fontSize: 14,
    lineHeight: 28,
    textAlign: "right",
    writingDirection: "rtl",
  },
  featureFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  metaText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ctaText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
  },
  compactRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favInline: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  favFloating: {
    position: "absolute",
    top: 14,
    right: 60,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  compactTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    marginBottom: 4,
  },
  compactMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    opacity: 0.6,
  },
});
