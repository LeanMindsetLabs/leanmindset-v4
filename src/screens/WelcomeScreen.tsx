import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setFirstTimeFlow } from "@/src/services/profileService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import AuthBrandHeader from "@/src/ui/auth/AuthBrandHeader";
import AuthHeroBackground from "@/src/ui/auth/AuthHeroBackground";
import AuthLegalFooter from "@/src/ui/auth/AuthLegalFooter";
import { authWelcomeCenterSpacerHeight } from "@/src/ui/auth/authLayout";
import { ONBOARDING_FOOTER_LIFT } from "@/src/ui/onboarding/OnboardingChrome";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const centerSpacerHeight = authWelcomeCenterSpacerHeight(screenHeight, insets.top, insets.bottom);

  function start() {
    setFirstTimeFlow(true);
    router.push("/login?firstTime=1");
  }

  return (
    <View style={styles.page}>
      <AuthHeroBackground />

      <View style={[styles.shell, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.nav}>
          <View style={styles.navSide} />
        </View>

        <View style={styles.center}>
          <AuthBrandHeader />
          <Text style={styles.title}>
            Start your <Text style={styles.leanEra}>Lean Era.</Text>
          </Text>
          <Text style={styles.subtitle}>{"A 6-week lab for fat loss, training,\nand habits that stick."}</Text>
          <View style={{ height: centerSpacerHeight }} />
        </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) + ONBOARDING_FOOTER_LIFT }]}>
          <Pressable onPress={start} accessibilityRole="button" style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
            <Text style={styles.ctaLabel}>Create account</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </Pressable>
          <Pressable
            onPress={() => router.push("/login")}
            accessibilityRole="button"
            style={({ pressed }) => [styles.loginLink, pressed && styles.pressed]}
          >
            <Text style={styles.loginLinkText}>I already have an account</Text>
          </Pressable>
          <AuthLegalFooter />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#05070b" },
  shell: { flex: 1, zIndex: 1 },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    minHeight: layout.minTouchTarget,
  },
  navSide: { width: 44 },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    gap: 16,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: colors.white,
    textAlign: "center",
  },
  leanEra: { color: "#F5C400" },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.white,
    textAlign: "center",
    alignSelf: "center",
    maxWidth: 280,
  },
  footer: {
    paddingHorizontal: 22,
    gap: 14,
  },
  cta: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.accentBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pressed: { opacity: 0.9 },
  ctaLabel: { fontSize: 16, fontWeight: "700", color: colors.white },
  loginLink: {
    minHeight: layout.minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  loginLinkText: { fontSize: 14, fontWeight: "600", color: colors.white },
});
