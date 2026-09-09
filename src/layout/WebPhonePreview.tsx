import { type ReactNode } from "react";
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { router, usePathname, type Href } from "expo-router";
import { colors } from "@/src/theme/colors";
import PreviewToggles from "@/src/ui/PreviewToggles";
import WebPhoneKeyboard from "@/src/ui/WebPhoneKeyboard";

/** Visual-reference preview only. Native phones never use this frame. */
export const IPHONE_15 = {
  width: 393,
  height: 852,
  status: 59,
  home: 34,
} as const;

export default function WebPhonePreview({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (Platform.OS !== "web") return children;

  if (typeof window !== "undefined" && window.location.search.includes("storeShot=1")) {
    return <>{children}</>;
  }

  const scale = Math.min(1, (width - 48) / 430, (height - 72) / 920);

  return (
    <View style={styles.stage}>
      <View style={[styles.slot, { width: IPHONE_15.width * scale, height: IPHONE_15.height * scale }]}>
        <View style={[styles.phone, { transform: [{ scale }] }]}>
          <View style={styles.status}>
            <Text style={styles.time}>9:41</Text>
            <View style={styles.island} pointerEvents="none" />
            <View style={styles.statusRight}>
              <PreviewToggles />
            </View>
          </View>
          <View style={styles.body}>
            {children}
            <WebPhoneKeyboard />
          </View>
          <View style={styles.homeIndicator} pointerEvents="none" />
        </View>
      </View>
      {__DEV__ ? (
        <Pressable
          accessibilityRole="link"
          onPress={() => (isAdmin ? router.replace("/(tabs)") : router.push("/admin" as Href))}
        >
          <Text style={styles.caption}>
            {isAdmin ? "Back to app" : "iPhone 15 · 393 × 852 · Admin enrollments"}
          </Text>
        </Pressable>
      ) : (
        <Text style={styles.caption}>LeanMindset</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: "#07090c",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  slot: {
    alignItems: "center",
    justifyContent: "center",
  },
  phone: {
    width: IPHONE_15.width,
    height: IPHONE_15.height,
    backgroundColor: colors.background,
    borderRadius: 47,
    overflow: "hidden",
    borderWidth: 11,
    borderColor: "#1b1b1f",
  },
  status: {
    height: IPHONE_15.status,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 22,
    paddingRight: 10,
    zIndex: 2,
  },
  statusRight: {
    minWidth: 168,
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 3,
    gap: 3,
  },
  time: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  island: {
    position: "absolute",
    left: 134,
    top: 12,
    width: 125,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#000",
    zIndex: 1,
  },
  body: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
  },
  homeIndicator: {
    position: "absolute",
    left: "50%",
    marginLeft: -67,
    bottom: 8,
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: "#F4F4F5",
    zIndex: 20,
  },
  caption: {
    color: "#7d8b9c",
    fontSize: 12,
  },
});
