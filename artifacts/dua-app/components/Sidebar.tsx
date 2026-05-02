import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import { useSettings } from "@/contexts/SettingsContext";

const MAX_WIDTH = 320;

export function Sidebar() {
  const router = useRouter();
  const colors = useColors();
  const {
    sidebarOpen,
    setSidebarOpen,
    themeMode,
    setThemeMode,
    t,
    accent,
  } = useSettings();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(MAX_WIDTH, width * 0.82);

  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: sidebarOpen ? 0 : -drawerWidth,
        duration: 220,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(opacity, {
        toValue: sidebarOpen ? 1 : 0,
        duration: 220,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [sidebarOpen, drawerWidth, translateX, opacity]);

  const close = () => setSidebarOpen(false);

  const navigate = (path: string) => {
    close();
    setTimeout(() => router.push(path as never), 60);
  };

  if (!sidebarOpen && (translateX as any)._value === -drawerWidth) {
    return null;
  }

  const isLight = themeMode === "light";

  return (
    <View
      style={StyleSheet.absoluteFillObject}
      pointerEvents={sidebarOpen ? "auto" : "none"}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(0,0,0,0.45)", opacity },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={close} />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          {
            width: drawerWidth,
            backgroundColor: colors.background,
            borderRightColor: colors.border,
            transform: [{ translateX }],
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View
              style={[
                styles.logoBubble,
                { backgroundColor: colors.pinkSoft },
              ]}
            >
              <Feather name="moon" size={22} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.appName, { color: colors.navy }]}>
                Dua
              </Text>
              <Text style={[styles.appTag, { color: colors.mutedForeground }]}>
                {t("greeting")}
              </Text>
            </View>
            <Pressable onPress={close} hitSlop={10} style={styles.closeBtn}>
              <Feather name="x" size={22} color={colors.navy} />
            </Pressable>
          </View>

          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            {t("appearance")}
          </Text>

          <View style={styles.modeRow}>
            <Pressable
              onPress={() => setThemeMode("light")}
              style={[
                styles.lightBig,
                {
                  backgroundColor: isLight ? colors.pink : colors.card,
                  borderColor: isLight ? colors.pink : colors.border,
                },
              ]}
            >
              <Feather
                name="sun"
                size={26}
                color={isLight ? colors.navy : colors.navySoft}
              />
              <Text
                style={[
                  styles.modeLabelBig,
                  { color: isLight ? colors.navy : colors.navySoft },
                ]}
              >
                {t("light_mode")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setThemeMode("dark")}
              style={[
                styles.darkSmall,
                {
                  backgroundColor: !isLight ? colors.navy : colors.card,
                  borderColor: !isLight ? colors.navy : colors.border,
                },
              ]}
            >
              <Feather
                name="moon"
                size={18}
                color={!isLight ? colors.background : colors.navy}
              />
              <Text
                style={[
                  styles.modeLabelSmall,
                  { color: !isLight ? colors.background : colors.navy },
                ]}
              >
                {t("dark_mode")}
              </Text>
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <NavItem
            icon="home"
            label={t("today_tab")}
            onPress={() => navigate("/(tabs)")}
          />
          <NavItem
            icon="book"
            label={t("library_tab")}
            onPress={() => navigate("/(tabs)/library")}
          />
          <NavItem
            icon="heart"
            label={t("favorites_tab")}
            onPress={() => navigate("/(tabs)/favorites")}
          />
          <NavItem
            icon="pie-chart"
            label={t("progress_tab")}
            onPress={() => navigate("/(tabs)/progress")}
          />

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <NavItem
            icon="star"
            label={t("names_99")}
            onPress={() => navigate("/names99")}
            highlight
          />
          <NavItem
            icon="settings"
            label={t("settings")}
            onPress={() => navigate("/settings")}
          />

          <View style={{ flex: 1 }} />

          <Text
            style={[styles.footer, { color: colors.mutedForeground }]}
          >
            Dua Learning · {accent}
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function NavItem({
  icon,
  label,
  onPress,
  highlight,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
  highlight?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }: any) => [
        styles.navItem,
        {
          backgroundColor:
            hovered || pressed
              ? colors.pinkSoft
              : highlight
                ? colors.pinkSoft
                : "transparent",
        },
      ]}
    >
      <Feather name={icon} size={18} color={colors.navy} />
      <Text style={[styles.navLabel, { color: colors.navy }]}>{label}</Text>
      <Feather
        name="chevron-right"
        size={16}
        color={colors.mutedForeground}
      />
    </Pressable>
  );
}

export function MenuButton() {
  const colors = useColors();
  const { setSidebarOpen } = useSettings();
  return (
    <Pressable
      onPress={() => setSidebarOpen(true)}
      hitSlop={10}
      style={[
        styles.menuBtn,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Feather name="menu" size={20} color={colors.navy} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderRightWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 6, height: 0 },
    elevation: 14,
  },
  scroll: {
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  logoBubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },
  appTag: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
  },
  closeBtn: {
    padding: 6,
  },
  sectionLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  lightBig: {
    flex: 1.6,
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 96,
    gap: 10,
  },
  darkSmall: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 96,
    gap: 8,
  },
  modeLabelBig: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
  modeLabelSmall: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 14,
    opacity: 0.6,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  navLabel: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    flex: 1,
  },
  footer: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    textAlign: "center",
    marginTop: 24,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
