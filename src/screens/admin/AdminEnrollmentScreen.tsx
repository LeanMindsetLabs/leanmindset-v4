import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { useProfile } from "@/src/hooks/useProfile";
import { approveStarterLab, labStatusLabel, resetLabMembership } from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import SecondaryButton from "@/src/ui/SecondaryButton";
import LabFlowHeader from "@/src/screens/labs/LabFlowHeader";

export default function AdminEnrollmentScreen() {
  const { profile } = useProfile();
  const { membership } = useLabMembership();
  const pending = membership.lifecycle === "requested";

  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow="Admin" title="Enrollment requests" />
      <View style={styles.card}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {profile.user.name}
        </Text>
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          {`${membership.labName ?? "No Lab"} · ${labStatusLabel(membership)}`}
          {membership.requestedAt ? ` · Requested ${membership.requestedAt}` : ""}
        </Text>
        {pending ? (
          <BlueCta
            label="Approve Starter Lab"
            onPress={() => {
              approveStarterLab();
              router.replace("/(tabs)");
            }}
          />
        ) : (
          <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
            Approve appears here after a member submits a Starter Lab request.
          </Text>
        )}
        {membership.lifecycle !== "explorer" ? (
          <SecondaryButton label="Reset to explorer" onPress={resetLabMembership} />
        ) : null}
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
});
