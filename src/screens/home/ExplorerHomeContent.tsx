import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { comingSoonLabs, starterLab } from "@/src/content/labs";
import { useProfile } from "@/src/hooks/useProfile";
import { defaultUser } from "@/src/services/profileService";
import { homeContent } from "@/src/services/homeContent";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import HomeHeroChart from "@/src/ui/HomeHeroChart";
import InsightCard from "@/src/ui/InsightCard";
import LabHeroCard from "@/src/ui/LabHeroCard";

const copy = homeContent.explorer;

function firstName(name: string) {
  const source = name.includes("@") ? name.slice(0, name.indexOf("@")) : name;
  const first = source.trim().split(/\s+/)[0] || "";
  if (!first) return defaultUser.name.split(" ")[0] || "there";
  return first;
}

function greetingFor(name: string) {
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${hello}, ${firstName(name)}!`;
}

export default function ExplorerHomeContent() {
  const { profile } = useProfile();

  return (
    <View style={styles.root}>
      <View style={styles.intro}>
        <Text style={styles.greeting} numberOfLines={1} maxFontSizeMultiplier={1.2}>
          {greetingFor(profile.user.name)}
        </Text>
        <Text style={styles.subgreeting} maxFontSizeMultiplier={1.3}>
          {copy.subgreeting}
        </Text>
      </View>

      <HomeHeroChart />

      <InsightCard
        title={copy.heading}
        body={copy.labBody}
        cta={copy.viewLabs}
        onPress={() => router.push("/labs")}
      />

      <View style={styles.block}>
        <View style={styles.sectionRow}>
          <Text style={typography.caption} maxFontSizeMultiplier={1.3}>
            {copy.recommendedLabel}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.seeAll}
            hitSlop={8}
            onPress={() => router.push("/labs")}
            style={styles.seeAllHit}
          >
            <Text style={styles.seeAll} maxFontSizeMultiplier={1.3}>
              {copy.seeAll}
            </Text>
          </Pressable>
        </View>
        <LabHeroCard
          photo={starterLab.photo}
          title={starterLab.name}
          meta={starterLab.meta}
          pitch={starterLab.pitch}
          badge="Start here"
          badgeAccent
          onPress={() => router.push("/labs/starter")}
        />
      </View>

      <View style={styles.block}>
        <Text style={typography.caption} maxFontSizeMultiplier={1.3}>
          {copy.moreLabel}
        </Text>
        {comingSoonLabs.map((offer) => (
          <LabHeroCard
            key={offer.id}
            photo={offer.photo}
            title={offer.name}
            meta={offer.meta}
            pitch={offer.pitch ?? offer.description}
            badge={offer.badge}
            compact
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.sectionGap,
  },
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
  block: {
    gap: spacing.sm,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: layout.minTouchTarget / 2,
  },
  seeAllHit: {
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
    paddingLeft: spacing.sm,
  },
  seeAll: {
    ...typography.caption,
    color: colors.accentBlue,
  },
});
