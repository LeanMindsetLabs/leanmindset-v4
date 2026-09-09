import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { joinLabConfirm } from "@/src/content/labs";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { getLabMembership, requestStarterLab } from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import LabFlowHeader from "./LabFlowHeader";

export default function JoinLabConfirmScreen() {
  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow={joinLabConfirm.eyebrow} title={joinLabConfirm.title} />
      <View style={styles.card}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {joinLabConfirm.cardTitle}
        </Text>
        {joinLabConfirm.steps.map((step, index) => (
          <Text key={step} style={styles.step} maxFontSizeMultiplier={1.4}>
            {`${index + 1}.  ${step}`}
          </Text>
        ))}
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          {joinLabConfirm.note}
        </Text>
        <BlueCta
          label={joinLabConfirm.submitCta}
          onPress={() => {
            const lifecycle = getLabMembership().lifecycle;
            if (lifecycle === "explorer") {
              requestStarterLab();
              router.replace("/labs/submitted");
              return;
            }
            if (lifecycle === "requested") {
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
