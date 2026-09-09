import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import AppTextInput from "@/src/ui/AppTextInput";

export type AiSearchPrompt = {
  label: string;
  query: string;
};

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  accessibilityLabel?: string;
  prompts?: AiSearchPrompt[];
};

export default function AiSearchBar({ value, onChangeText, placeholder, accessibilityLabel, prompts }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        <Ionicons name="sparkles" size={18} color={colors.accentBlue} />
        <AppTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={accessibilityLabel ?? placeholder}
          returnKeyType="search"
          autoCorrect={false}
          style={styles.input}
        />
        {value.trim() ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => onChangeText("")}
            style={styles.clear}
          >
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {prompts?.length ? (
        <View style={styles.prompts}>
          {prompts.map((prompt) => {
            const active = value.trim().toLowerCase() === prompt.query.toLowerCase();
            return (
              <Pressable
                key={prompt.label}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => onChangeText(active ? "" : prompt.query)}
                style={[styles.prompt, active ? styles.promptOn : null]}
              >
                <Text
                  style={[styles.promptText, active ? styles.promptTextOn : null]}
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.1}
                >
                  {prompt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  bar: {
    minHeight: layout.minTouchTarget + 8,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 0,
  },
  clear: {
    minHeight: layout.minTouchTarget,
    minWidth: layout.minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  prompts: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: spacing.xs,
  },
  prompt: {
    flex: 1,
    minWidth: 0,
    minHeight: layout.minTouchTarget,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  promptOn: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.accentBlue,
  },
  promptText: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: "none",
    letterSpacing: 0,
    textAlign: "center",
  },
  promptTextOn: {
    color: colors.accentBlue,
  },
});
