import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { labPhotos, type LabPhotoKey } from "@/src/lib/media";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";

type LabHeroCardProps = {
  photo: LabPhotoKey;
  title: string;
  meta: string;
  pitch?: string;
  badge?: string;
  badgeAccent?: boolean;
  compact?: boolean;
  onPress?: () => void;
};

export default function LabHeroCard({
  photo,
  title,
  meta,
  pitch,
  badge,
  badgeAccent,
  compact,
  onPress,
}: LabHeroCardProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={title}
      accessibilityState={onPress ? undefined : { disabled: true }}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact ? styles.compact : null,
        onPress && pressed ? styles.pressed : null,
      ]}
    >
      <Image source={labPhotos[photo]} style={styles.photo} contentFit="cover" />
      <LinearGradient
        colors={["rgba(15,17,18,0.08)", "rgba(15,17,18,0.22)", "rgba(15,17,18,0.82)"]}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFill}
      />
      {badge ? (
        <View style={[styles.badge, badgeAccent ? styles.badgeAccent : styles.badgeMuted]}>
          <Text
            style={[styles.badgeText, badgeAccent ? styles.badgeTextAccent : styles.badgeTextMuted]}
            maxFontSizeMultiplier={1.2}
          >
            {badge}
          </Text>
        </View>
      ) : null}
      <View style={styles.copy}>
        <Text style={styles.title} maxFontSizeMultiplier={1.3}>
          {title}
        </Text>
        <Text style={styles.meta} maxFontSizeMultiplier={1.3}>
          {meta}
        </Text>
        {pitch ? (
          <Text style={styles.pitch} maxFontSizeMultiplier={1.4}>
            {pitch}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1.45,
    minHeight: 168,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    justifyContent: "flex-end",
  },
  compact: {
    aspectRatio: 1.85,
    minHeight: 132,
  },
  photo: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  pressed: {
    opacity: 0.92,
  },
  badge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeAccent: {
    backgroundColor: colors.accentBlue,
  },
  badgeMuted: {
    backgroundColor: "rgba(15,17,18,0.72)",
  },
  badgeText: {
    ...typography.caption,
    letterSpacing: 0.8,
  },
  badgeTextAccent: {
    color: colors.white,
  },
  badgeTextMuted: {
    color: colors.textSecondary,
  },
  copy: {
    padding: spacing.lg,
    gap: 4,
  },
  title: {
    ...typography.heading2,
    color: colors.white,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  pitch: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
