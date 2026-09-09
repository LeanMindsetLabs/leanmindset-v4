import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Keyboard, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUiVariant } from "@/src/context/UiVariantContext";
import { LeanMindsetIcon } from "@/src/ui/LeanMindsetBrand";
import { colors } from "@/src/theme/colors";

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home-outline",
  today: "calendar-outline",
  meals: "restaurant-outline",
  checkin: "checkbox-outline",
  coach: "chatbubble-ellipses-outline",
  train: "barbell-outline",
  profile: "person-outline",
};

const labels: Record<string, string> = {
  today: "Today",
  meals: "Meals",
  checkin: "Check-in",
  coach: "Coach",
  train: "Train",
  profile: "Profile",
};

const a11yLabels: Record<string, string> = {
  index: "Home",
  ...labels,
};

const TAB_ICON_SIZE = 24;
const TAB_LABEL_LINE = 13.2;
const TAB_ICON_GAP = 3;
/** Matches icon top → label baseline on other tabs (24 + 3 + 13.2). */
const HOME_LOGO_SIZE = TAB_ICON_SIZE + TAB_ICON_GAP + TAB_LABEL_LINE;

const orbIdleWeb = {
  boxShadow: "0 0 10px 2px rgba(61, 123, 255, 0.28)",
} as const;

const orbActiveWeb = {
  boxShadow: "0 0 16px 4px rgba(61, 123, 255, 0.5), 0 0 28px 8px rgba(61, 123, 255, 0.22)",
} as const;

function CoachBubbleIcon({ color, size = 26 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="9" cy="12" r="1.15" fill={color} />
      <Circle cx="15" cy="12" r="1.15" fill={color} />
    </Svg>
  );
}

/** Web fallback: Ionicons is a font and can render empty until @font-face loads. */
function TabSvgIcon({ routeName, color, size = TAB_ICON_SIZE }: { routeName: string; color: string; size?: number }) {
  const stroke = { stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {routeName === "meals" ? (
        <>
          <Path d="M7 3.5v6.2a2 2 0 0 0 4 0V3.5" {...stroke} />
          <Path d="M9 3.5v17" {...stroke} />
          <Path d="M16.5 3.5c0 3.2 2.4 3.6 2.4 7.2V20.5" {...stroke} />
          <Path d="M16.5 3.5V20.5" {...stroke} />
        </>
      ) : null}
      {routeName === "train" ? (
        <>
          <Path d="M3 10.2v3.6M21 10.2v3.6" {...stroke} />
          <Path d="M6.2 8v8M17.8 8v8" {...stroke} />
          <Path d="M6.2 12h11.6" {...stroke} />
        </>
      ) : null}
      {routeName === "profile" ? (
        <>
          <Circle cx="12" cy="8" r="3.3" {...stroke} />
          <Path d="M5.4 19.4c1.3-3.4 3.7-5.1 6.6-5.1s5.3 1.7 6.6 5.1" {...stroke} />
        </>
      ) : null}
    </Svg>
  );
}

function TabGlyph({
  routeName,
  color,
  active,
}: {
  routeName: string;
  color: string;
  active: boolean;
}) {
  const iconName =
    routeName === "profile" && active ? "person" : (icons[routeName] ?? "ellipse-outline");

  if (Platform.OS === "web") {
    return <TabSvgIcon routeName={routeName} color={color} />;
  }

  return <Ionicons name={iconName} size={TAB_ICON_SIZE} color={color} />;
}

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string, params?: { screen: string }) => void };
};

const tabWebFocus =
  Platform.OS === "web"
    ? ({
        outlineWidth: 0,
        outlineStyle: "solid" as const,
        outlineColor: "transparent",
        boxShadow: "none",
      } as const)
    : null;

export default function AppTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { setPreviewRoute, composerOpen } = useUiVariant();
  const activeName = state.routes[state.index]?.name ?? "index";
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    setPreviewRoute(activeName);
  }, [activeName, setPreviewRoute]);

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow", () => {
      setKeyboardOpen(true);
    });
    const hide = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide", () => {
      setKeyboardOpen(false);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (keyboardOpen || composerOpen) return null;

  const homeInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: homeInset + 4,
          backgroundColor: activeName === "profile" ? colors.profileBlack : colors.background,
          borderTopWidth: activeName === "profile" ? 0 : 1,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        if (route.name === "today" || route.name === "checkin") return null;
        const active = state.index === index;
        const isCoach = route.name === "coach";
        const isHome = route.name === "index";
        const tabColor = active ? colors.accentBlue : colors.tabInactive;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityLabel={a11yLabels[route.name] ?? route.name}
            onPress={() =>
              route.name === "profile"
                ? navigation.navigate("profile", { screen: "index" })
                : navigation.navigate(route.name)
            }
            style={[styles.item, isCoach && styles.coachItem, isHome && styles.homeItem, tabWebFocus]}
          >
            {isCoach ? (
              <View
                style={[
                  styles.orb,
                  active && styles.orbActive,
                  Platform.OS === "web" ? (active ? orbActiveWeb : orbIdleWeb) : null,
                ]}
              >
                <CoachBubbleIcon color={active ? colors.metricBlueSoft : colors.accentBlue} />
              </View>
            ) : isHome ? (
              <LeanMindsetIcon size={HOME_LOGO_SIZE} textScale={1.15} dimmed={!active} />
            ) : (
              <TabGlyph routeName={route.name} color={tabColor} active={active} />
            )}
            {isHome ? null : (
              <View style={styles.labelWrap}>
                <Text numberOfLines={1} style={[styles.label, active && styles.labelActive]}>
                  {labels[route.name] ?? route.name}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: 6,
    paddingHorizontal: 4,
    minHeight: 52,
    overflow: "visible",
    zIndex: 2,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 3,
    minHeight: 44,
    padding: 0,
    outlineWidth: 0,
  },
  coachItem: {
    gap: 5,
    zIndex: 3,
    overflow: "visible",
  },
  homeItem: {
    gap: 0,
    justifyContent: "flex-end",
  },
  label: {
    fontSize: 12.6,
    lineHeight: 13.2,
    fontWeight: "600",
    color: colors.tabInactive,
    letterSpacing: 0,
  },
  labelActive: { color: colors.accentBlue },
  labelWrap: {
    alignItems: "center",
    gap: 3,
  },
  orb: {
    width: 52,
    height: 52,
    marginTop: -28,
    borderRadius: 26,
    backgroundColor: "rgba(34, 37, 41, 0.92)",
    borderWidth: 2.5,
    borderColor: colors.accentBlue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accentBlue,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  orbActive: {
    borderColor: colors.metricBlue,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
});
