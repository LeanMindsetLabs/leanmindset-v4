import { StyleSheet, Text, View } from "react-native";
import { useProfile } from "@/src/hooks/useProfile";
import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";

function firstName(name: string) {
  const source = name.includes("@") ? name.slice(0, name.indexOf("@")) : name;
  const first = source.trim().split(/\s+/)[0] || "";
  if (!first) return "there";
  return first;
}

function greetingFor(name: string) {
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${hello}, ${firstName(name)}!`;
}

export default function HomeGreeting({ subgreeting }: { subgreeting: string }) {
  const { profile } = useProfile();

  return (
    <View style={styles.intro}>
      <Text style={styles.greeting} numberOfLines={1} maxFontSizeMultiplier={1.2}>
        {greetingFor(profile.user?.name || "")}
      </Text>
      <Text style={styles.subgreeting} maxFontSizeMultiplier={1.3}>
        {subgreeting}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    marginBottom: -spacing.sm,
  },
  greeting: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: -0.3,
  },
  subgreeting: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 20,
    color: "#AEAEB2",
  },
});
