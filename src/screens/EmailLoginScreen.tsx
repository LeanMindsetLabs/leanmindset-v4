import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { requestEmailOtp, setFirstTimeFlow } from "@/src/services/profileService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import AppTextInput from "@/src/ui/AppTextInput";
import AuthBrandHeader from "@/src/ui/auth/AuthBrandHeader";
import AuthHeroBackground from "@/src/ui/auth/AuthHeroBackground";
import AuthLegalFooter from "@/src/ui/auth/AuthLegalFooter";
import GoogleLogo from "@/src/ui/auth/GoogleLogo";
import { ONBOARDING_FOOTER_LIFT } from "@/src/ui/onboarding/OnboardingChrome";

const GOLD = "#F5C400";

export default function EmailLoginScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ firstTime?: string }>();
  const firstTime = params.firstTime === "1";
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);

  function submit() {
    const trimmed = requestEmailOtp(email);
    if (!trimmed) return;
    if (firstTime) setFirstTimeFlow(true);
    router.push({ pathname: "/otp", params: { email: trimmed, firstTime: firstTime ? "1" : "0" } });
  }

  return (
    <View style={styles.page}>
      <AuthHeroBackground />

      <View style={[styles.shell, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.nav}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" style={styles.navSide}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.helpBtn}>
            <Text style={styles.helpText}>Help (?)</Text>
          </Pressable>
        </View>

        <View style={styles.center}>
          <AuthBrandHeader />
          <Text style={styles.title}>{firstTime ? "Create your account" : "Welcome back"}</Text>
          <Text style={styles.subtitle}>
            {firstTime ? "Enter your email to get started." : "Log in to continue your lean journey."}
          </Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Email address</Text>
            <View style={[styles.inputWrap, (focused || email.length > 0) && styles.inputWrapOn]}>
              <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
              <AppTextInput
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="youremail@example.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
          </View>

          <Pressable onPress={submit} accessibilityRole="button" style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
            <Text style={styles.ctaLabel}>{firstTime ? "Continue" : "Log in"}</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialBtn} accessibilityRole="button" accessibilityLabel="Continue with Apple">
              <Ionicons name="logo-apple" size={22} color={colors.white} />
            </Pressable>
            <Pressable style={styles.socialBtn} accessibilityRole="button" accessibilityLabel="Continue with Google">
              <GoogleLogo size={22} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) + ONBOARDING_FOOTER_LIFT }]}>
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
    justifyContent: "space-between",
    paddingHorizontal: 22,
    minHeight: layout.minTouchTarget,
  },
  navSide: {
    width: 44,
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
  },
  helpBtn: { minHeight: layout.minTouchTarget, justifyContent: "center" },
  helpText: { fontSize: 14, color: colors.textSecondary, fontWeight: "500" },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    gap: 16,
  },
  footer: {
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.white,
    textAlign: "center",
    marginTop: -6,
    marginBottom: 4,
  },
  fieldBlock: { gap: 8 },
  label: { fontSize: 13, color: colors.white, fontWeight: "500" },
  inputWrap: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(10,12,14,0.72)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  inputWrapOn: { borderColor: GOLD },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: colors.white,
    paddingVertical: 0,
    marginVertical: 0,
    textAlignVertical: "center",
  },
  cta: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.accentBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  pressed: { opacity: 0.9 },
  ctaLabel: { fontSize: 16, fontWeight: "700", color: colors.white },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dividerText: { fontSize: 14, lineHeight: 20, color: colors.white, fontWeight: "400" },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  socialBtn: {
    flex: 1,
    minHeight: 52,
    maxWidth: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(8,10,12,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
});
