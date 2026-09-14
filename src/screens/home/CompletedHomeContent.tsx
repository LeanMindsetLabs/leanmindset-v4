import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { completedHome, homeLabStatus } from "@/src/content/labs";
import { layout } from "@/src/theme/layout";
import { typography } from "@/src/theme/typography";
import InsightCard from "@/src/ui/InsightCard";
import HomeGreeting from "./HomeGreeting";
import LabCard from "./LabCard";

export default function CompletedHomeContent() {
  return (
    <View style={styles.root}>
      <HomeGreeting subgreeting={homeLabStatus.completed.subgreeting} />
      <InsightCard
        title={homeLabStatus.completed.title}
        body={`${completedHome.resultsMeta}. ${completedHome.resultsWeight}. Your history stays in My Lab.`}
        cta={homeLabStatus.completed.cta}
        ctaLayout="stack"
        onPress={() => router.push("/labs/results")}
      />
      <LabCard>
        <Text style={typography.heading3} maxFontSizeMultiplier={1.3}>
          {completedHome.nextTitle}
        </Text>
        <Text style={typography.body} maxFontSizeMultiplier={1.4}>
          {completedHome.nextBody}
        </Text>
      </LabCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.sectionGap,
  },
});
