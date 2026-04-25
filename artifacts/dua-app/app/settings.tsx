import { Feather } from "@expo/vector-icons";
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

import { ACCENTS, AccentName } from "@/constants/colors";
import { LANGUAGES, LanguageCode } from "@/constants/translations";
import {
  FontSize,
  FontStyle,
  ThemeMode,
  useSettings,
} from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const {
    themeMode,
    setThemeMode,
    accent,
    setAccent,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    fontStyle,
    setFontStyle,
    t,
  } = useSettings();

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
          <Text style={[styles.title, { color: colors.navy }]}>
            {t("settings")}
          </Text>
        </View>

        <Section title={t("appearance")}>
          <SegmentedRow
            options={[
              { value: "light", label: t("light_mode"), icon: "sun" },
              { value: "dark", label: t("dark_mode"), icon: "moon" },
              { value: "system", label: t("system_mode"), icon: "smartphone" },
            ]}
            value={themeMode}
            onChange={(v) => setThemeMode(v as ThemeMode)}
          />
        </Section>

        <Section title={t("accent_color")}>
          <View style={styles.accentRow}>
            {(Object.keys(ACCENTS) as AccentName[]).map((name) => {
              const def = ACCENTS[name];
              const selected = accent === name;
              return (
                <Pressable
                  key={name}
                  onPress={() => setAccent(name)}
                  style={[
                    styles.swatchWrap,
                    {
                      borderColor: selected ? colors.navy : colors.border,
                    },
                  ]}
                >
                  <View
                    style={[styles.swatch, { backgroundColor: def.primary }]}
                  />
                  <Text
                    style={[styles.swatchLabel, { color: colors.navy }]}
                  >
                    {def.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title={t("language")}>
          <View style={styles.list}>
            {LANGUAGES.map((lang) => {
              const selected = language === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => setLanguage(lang.code as LanguageCode)}
                  style={[
                    styles.row,
                    {
                      backgroundColor: selected ? colors.pinkSoft : colors.card,
                      borderColor: selected ? colors.pink : colors.border,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowTitle, { color: colors.navy }]}>
                      {lang.label}
                    </Text>
                    <Text
                      style={[
                        styles.rowSub,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {lang.nativeLabel}
                    </Text>
                  </View>
                  {selected && (
                    <Feather name="check" size={18} color={colors.navy} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title={t("font_size")}>
          <SegmentedRow
            options={[
              { value: "small", label: "A", iconText: "S" },
              { value: "medium", label: "A", iconText: "M" },
              { value: "large", label: "A", iconText: "L" },
              { value: "xlarge", label: "A", iconText: "XL" },
            ]}
            value={fontSize}
            onChange={(v) => setFontSize(v as FontSize)}
            renderText={(opt, selected) => (
              <View style={{ alignItems: "center", gap: 2 }}>
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    fontSize:
                      opt.value === "small"
                        ? 12
                        : opt.value === "medium"
                          ? 16
                          : opt.value === "large"
                            ? 20
                            : 24,
                    color: selected ? colors.navy : colors.mutedForeground,
                  }}
                >
                  Aa
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 10,
                    color: selected ? colors.navy : colors.mutedForeground,
                  }}
                >
                  {opt.iconText}
                </Text>
              </View>
            )}
          />
        </Section>

        <Section title={t("font_style")}>
          <View style={styles.list}>
            {(["poppins", "system", "serif"] as FontStyle[]).map((style) => {
              const selected = fontStyle === style;
              const label =
                style === "poppins"
                  ? "Poppins (default)"
                  : style === "system"
                    ? "System"
                    : "Serif";
              const sample =
                style === "poppins"
                  ? "Poppins_400Regular"
                  : style === "system"
                    ? "System"
                    : "Georgia";
              return (
                <Pressable
                  key={style}
                  onPress={() => setFontStyle(style)}
                  style={[
                    styles.row,
                    {
                      backgroundColor: selected ? colors.pinkSoft : colors.card,
                      borderColor: selected ? colors.pink : colors.border,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowTitle, { color: colors.navy }]}>
                      {label}
                    </Text>
                    <Text
                      style={[
                        styles.rowSub,
                        { color: colors.mutedForeground, fontFamily: sample },
                      ]}
                    >
                      The quick brown fox.
                    </Text>
                  </View>
                  {selected && (
                    <Feather name="check" size={18} color={colors.navy} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function SegmentedRow({
  options,
  value,
  onChange,
  renderText,
}: {
  options: Array<{
    value: string;
    label: string;
    icon?: React.ComponentProps<typeof Feather>["name"];
    iconText?: string;
  }>;
  value: string;
  onChange: (v: string) => void;
  renderText?: (
    opt: {
      value: string;
      label: string;
      icon?: React.ComponentProps<typeof Feather>["name"];
      iconText?: string;
    },
    selected: boolean,
  ) => React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.segment,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segmentBtn,
              {
                backgroundColor: selected ? colors.pinkSoft : "transparent",
                borderColor: selected ? colors.pink : "transparent",
              },
            ]}
          >
            {renderText ? (
              renderText(opt, selected)
            ) : (
              <>
                {opt.icon && (
                  <Feather
                    name={opt.icon}
                    size={16}
                    color={selected ? colors.navy : colors.mutedForeground}
                  />
                )}
                <Text
                  style={[
                    styles.segmentLabel,
                    {
                      color: selected ? colors.navy : colors.mutedForeground,
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    gap: 22,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    letterSpacing: 0.6,
  },
  segment: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  segmentLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
  },
  accentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  swatchWrap: {
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 14,
    borderWidth: 2,
    minWidth: 70,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  swatchLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  rowTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  rowSub: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
});
