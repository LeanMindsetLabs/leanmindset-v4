import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { completeOtpLogin, getProfile, getPendingEmail, MOCK_OTP_CODE, verifyOtpCode } from "@/src/services/profileService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import AuthHeroBackground from "@/src/ui/auth/AuthHeroBackground";
import OtpKeypad from "@/src/ui/auth/OtpKeypad";

const GOLD = "#F5C400";
const RESEND_SECONDS = 28;

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string; firstTime?: string }>();
  const email = params.email || getPendingEmail() || "your email";
  const firstTime = params.firstTime === "1";
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const submitted = useRef(false);

  const code = useMemo(() => digits.join(""), [digits]);
  const activeIndex = digits.findIndex((digit) => digit === "");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (submitted.current || code.length !== 6 || !verifyOtpCode(code)) return;
    submitted.current = true;
    completeOtpLogin(email, { firstTime });
    const profile = getProfile();
    if (!profile.onboardingComplete) router.replace("/onboarding");
    else router.replace("/(tabs)");
  }, [code, email, firstTime]);

  function pushDigit(digit: string) {
    const index = digits.findIndex((value) => value === "");
    if (index === -1) return;
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
  }

  function backspace() {
    const index = [...digits].reverse().findIndex((value) => value !== "");
    if (index === -1) return;
    const removeAt = digits.length - 1 - index;
    const next = [...digits];
    next[removeAt] = "";
    setDigits(next);
  }

  function fillFromAutofill() {
    setDigits(MOCK_OTP_CODE.split(""));
  }

  function resend() {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setDigits(["", "", "", "", "", ""]);
    submitted.current = false;
    Alert.alert("Preview code", `Nothing is emailed. Use ${MOCK_OTP_CODE}, or tap the code above.`);
  }

  const timerLabel = `00:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <View style={styles.page}>
      <AuthHeroBackground />

      <View style={[styles.shell, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title}>Enter the OTP</Text>
          <Text style={styles.subtitle}>
            Nothing is emailed in this preview.{"\n"}
            Use this code for {email}
          </Text>

          <Pressable
            onPress={fillFromAutofill}
            accessibilityRole="button"
            accessibilityLabel={`Use preview code ${MOCK_OTP_CODE}`}
            style={({ pressed }) => [styles.previewCode, pressed && styles.pressed]}
          >
            <Text style={styles.previewKicker}>Preview code</Text>
            <Text style={styles.previewDigits}>{MOCK_OTP_CODE}</Text>
            <Text style={styles.previewHint}>Tap to fill</Text>
          </Pressable>

          <View style={styles.otpRow}>
            {digits.map((digit, index) => {
              const current = index === (activeIndex === -1 ? 5 : activeIndex);
              return (
                <View key={index} style={[styles.otpCell, current && styles.otpCellCurrent]}>
                  {digit ? (
                    <Text style={styles.otpDigit}>{digit}</Text>
                  ) : current ? (
                    <View style={styles.cursor} />
                  ) : (
                    <Text style={styles.otpPlaceholder}>-</Text>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.resendRow}>
            <Text style={styles.resendNote}>Didn&apos;t get a code? Nothing is emailed yet.</Text>
            <Text style={styles.resendTimer}>Resend in {timerLabel}</Text>
            <Pressable onPress={resend} disabled={secondsLeft > 0} accessibilityRole="button">
              <Text style={[styles.resendLink, secondsLeft > 0 && styles.resendLinkOff]}>Resend</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
        <OtpKeypad
          onDigit={pushDigit}
          onBackspace={backspace}
          autofillCode={MOCK_OTP_CODE}
          onAutofill={fillFromAutofill}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#05070b" },
  shell: { flex: 1, zIndex: 1 },
  backBtn: {
    width: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
    marginLeft: 22,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.white,
    textAlign: "center",
  },
  previewCode: {
    alignItems: "center",
    gap: 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: GOLD,
    backgroundColor: "rgba(10,12,14,0.72)",
    minWidth: 220,
  },
  pressed: { opacity: 0.9 },
  previewKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: GOLD,
  },
  previewDigits: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: 6,
    color: colors.white,
  },
  previewHint: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  otpCell: {
    width: 44,
    height: 52,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: GOLD,
    backgroundColor: "rgba(10,12,14,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  otpCellCurrent: {
    borderColor: colors.accentBlue,
  },
  otpDigit: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.white,
  },
  otpPlaceholder: {
    fontSize: 18,
    color: colors.textMuted,
  },
  cursor: {
    width: 2,
    height: 22,
    borderRadius: 1,
    backgroundColor: colors.accentBlue,
  },
  resendRow: {
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  resendNote: { fontSize: 13, color: colors.white },
  resendTimer: { fontSize: 13, color: colors.white },
  resendLink: { fontSize: 14, color: GOLD, fontWeight: "600" },
  resendLinkOff: { opacity: 0.45 },
});
