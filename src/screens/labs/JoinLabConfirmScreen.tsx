import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { joinLabConfirm, joinLabConfirmAuto } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { isAutoLabApproval, notifyAdminOfLabRequest } from "@/src/lib/labApproval";
import { getProfile } from "@/src/services/profileService";
import { submitStarterLabRequest } from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import LabFlowHeader from "./LabFlowHeader";

export default function JoinLabConfirmScreen() {
  const copy = isAutoLabApproval() ? joinLabConfirmAuto : joinLabConfirm;
  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow={copy.eyebrow} title={copy.title} />
      <View style={styles.card}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {copy.cardTitle}
        </Text>
        {copy.steps.map((step, index) => (
          <Text key={step} style={styles.step} maxFontSizeMultiplier={1.4}>
            {`${index + 1}.  ${step}`}
          </Text>
        ))}
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          {copy.note}
        </Text>
        <BlueCta
          label={copy.submitCta}
          onPress={() => {
            const result = submitStarterLabRequest();
            if (result === "requested") {
              const user = getProfile().user;
              notifyAdminOfLabRequest({ name: user.name, email: user.email });
              router.replace("/labs/submitted");
              return;
            }
            router.replace("/(tabs)");
          }}
        />
      </View>
    </ScrollableScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  step: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
