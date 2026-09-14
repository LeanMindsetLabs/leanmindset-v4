import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { useProfile } from "@/src/hooks/useProfile";
import { displayStoredDate } from "@/src/lib/cohortStart";
import {
  approveStarterLab,
  grantOffMondayStart,
  labStatusLabel,
  resetLabMembership,
  startDateLabel,
} from "@/src/services/labMembershipService";
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
  const preparing = membership.lifecycle === "approved_preparing";

  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow="Admin" title="Enrollment requests" />
      <View style={styles.card}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {profile.user.name}
        </Text>
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          {`${membership.labName ?? "No Lab"} · ${labStatusLabel(membership)}`}
          {membership.requestedAt ? ` · Requested ${displayStoredDate(membership.requestedAt)}` : ""}
        </Text>
        {membership.startDate ? (
          <Text style={typography.body} maxFontSizeMultiplier={1.4}>
            {`Day 1 · ${startDateLabel(membership)}`}
          </Text>
        ) : null}
        {pending ? (
          <BlueCta
            label="Approve Starter Lab"
            onPress={() => {
              approveStarterLab();
              router.replace("/(tabs)");
            }}
          />
        ) : null}
        {preparing && !membership.offMondayStartGranted ? (
          <BlueCta
            label="Allow start besides Monday"
            onPress={grantOffMondayStart}
          />
        ) : null}
        {preparing && membership.offMondayStartGranted ? (
          <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
            Off-Monday start is allowed. They can tap Start Starter Lab as soon as prep is done.
          </Text>
        ) : null}
        {!pending && !preparing ? (
          <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
            Approve appears here after a member submits a Starter Lab request. Off-Monday start is a special permission while they are preparing.
          </Text>
        ) : null}
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
