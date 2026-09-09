import { type Href, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { pendingHome } from "@/src/content/labs";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";
import SecondaryButton from "@/src/ui/SecondaryButton";
import LabCard from "./LabCard";

export default function PendingHomeContent() {
  const { membership } = useLabMembership();

  return (
    <View style={styles.root}>
      <Text style={styles.eyebrow} maxFontSizeMultiplier={1.3}>
        {pendingHome.eyebrow}
      </Text>
      <Text style={typography.heading1} maxFontSizeMultiplier={1.3}>
        {pendingHome.title}
      </Text>
      <LabCard>
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {membership.requestedAt
            ? `${pendingHome.body} Submitted ${membership.requestedAt}.`
            : pendingHome.body}
        </Text>
        <BlueCta label={pendingHome.statusCta} onPress={() => router.push("/labs/submitted")} />
        <SecondaryButton label="Coach review (local)" onPress={() => router.push("/admin" as Href)} />
      </LabCard>
      <LabCard>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {pendingHome.keepGoing}
        </Text>
        <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
          {pendingHome.keepGoingBody}
        </Text>
      </LabCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.accentBlue,
  },
});
