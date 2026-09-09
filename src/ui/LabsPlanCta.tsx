import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import BlueCta from "@/src/ui/BlueCta";

type Props = {
  title: string;
  body: string;
  cta: string;
  onPress?: () => void;
};

export default function LabsPlanCta({ title, body, cta, onPress }: Props) {
  return (
    <View style={styles.card}>
      <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
        {title}
      </Text>
      <Text style={typography.bodySmall} maxFontSizeMultiplier={1.4}>
        {body}
      </Text>
      <BlueCta label={cta} onPress={onPress ?? (() => router.push("/labs"))} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
});
