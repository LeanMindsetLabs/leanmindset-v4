import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { useProfile } from "@/src/hooks/useProfile";
import { LAB_ADMIN_EMAIL, isAutoLabApproval } from "@/src/lib/labApproval";
import { approveStarterLab, labStatusLabel } from "@/src/services/labMembershipService";
import LabFlowHeader from "@/src/screens/labs/LabFlowHeader";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import SecondaryButton from "@/src/ui/SecondaryButton";

export default function AdminApproveScreen() {
  const { profile } = useProfile();
  const { membership } = useLabMembership();
  const pending = membership.lifecycle === "requested";
  const alreadyIn = membership.lifecycle === "approved_preparing" || membership.lifecycle === "active";

  return (
    <ScrollableScreen>
      <LabFlowHeader eyebrow="Admin" title="Approve Starter Lab" />
      <View style={styles.card}>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {profile.user.name}
        </Text>
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          {`${profile.user.email} · ${labStatusLabel(membership)}`}
        </Text>
        {isAutoLabApproval() ? (
          <Text style={typography.body} maxFontSizeMultiplier={1.4}>
            Test joins are approved on the member’s phone as soon as they submit. Email review to{" "}
            {LAB_ADMIN_EMAIL} stays off until the final version.
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
        {alreadyIn ? (
          <Text style={typography.body} maxFontSizeMultiplier={1.4}>
            This member is already approved. Prep or the program is open on Home.
          </Text>
        ) : null}
        {!pending && !alreadyIn ? (
          <Text style={typography.body} maxFontSizeMultiplier={1.4}>
            There is no pending Starter Lab request on this device.
          </Text>
        ) : null}
        <SecondaryButton label="Back to Home" onPress={() => router.replace("/(tabs)")} />
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
