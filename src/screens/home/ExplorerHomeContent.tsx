import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { comingSoonLabs, homeLabStatus, openLab, starterLab, activeHome, isInStarterLab } from "@/src/content/labs";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { formatCohortCountdown } from "@/src/lib/cohortStart";
import { homeContent } from "@/src/services/homeContent";
import {
  canStartStarterLab,
  dismissPrepWelcome,
  prepIsComplete,
  startDateLabel,
  startStarterLab,
} from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import HomeHeroChart from "@/src/ui/HomeHeroChart";
import InsightCard from "@/src/ui/InsightCard";
import LabHeroCard from "@/src/ui/LabHeroCard";
import HomeGreeting from "./HomeGreeting";
import PrepHero from "./PrepHero";
import CompletedHero from "./CompletedHero";

const copy = homeContent.explorer;

export default function ExplorerHomeContent() {
  const { membership } = useLabMembership();
  const pending = membership.lifecycle === "requested";
  const preparing = membership.lifecycle === "approved_preparing";
  const active = membership.lifecycle === "active";
  const completed = membership.lifecycle === "completed";
  const enrolled = isInStarterLab(membership.lifecycle);
  const allDone = prepIsComplete(membership);
  const canStart = canStartStarterLab(membership);
  const startLabel = startDateLabel(membership);
  const countdown = formatCohortCountdown(membership.startDate);
  const prepDone = membership.preparationTasks.filter((task) => task.complete).length;
  const prepTotal = membership.preparationTasks.length || 7;
  const dailyDone = membership.dailyTasks.filter((task) => task.complete).length;
  const dailyTotal = membership.dailyTasks.length || 5;
  const nextTask = membership.dailyTasks.find((task) => !task.complete);
  const day = membership.progress?.day ?? membership.day ?? 1;
  const totalDays = membership.progress?.totalDays ?? 30;

  function openPrep() {
    dismissPrepWelcome();
    router.push("/labs/prep");
  }

  const subgreeting = active
    ? homeLabStatus.active.subgreeting
    : completed
      ? homeLabStatus.completed.subgreeting
      : pending
        ? homeLabStatus.pending.subgreeting
        : preparing
          ? homeLabStatus.approved.subgreeting
          : homeLabStatus.explorer.subgreeting;

  const insight = active
    ? {
        title: `${homeLabStatus.active.title} — ${membership.labName ?? starterLab.name}`,
        body: `Day ${day} of ${totalDays}. ${
          nextTask ? `Next up: ${nextTask.title}.` : "Today’s plan is complete."
        }`,
        cta: `${activeHome.todayTitle} — ${dailyDone}/${dailyTotal}`,
        onPress: () => router.push("/labs/progress"),
      }
    : completed
      ? {
          title: homeLabStatus.completed.title,
          body: homeLabStatus.completed.body,
          cta: homeLabStatus.completed.cta,
          onPress: () => router.push("/labs/results"),
        }
      : pending
        ? {
            title: homeLabStatus.pending.title,
            body: homeLabStatus.pending.body,
            cta: homeLabStatus.pending.cta,
            onPress: () => router.push("/labs/submitted"),
          }
        : preparing
          ? allDone
            ? {
                title: homeLabStatus.approved.readyTitle,
                body: `${countdown} ${homeLabStatus.approved.readyBody}`,
                cta: canStart ? "Start Starter Lab" : `Starts ${startLabel || "Monday"}`,
                onPress: () => {
                  if (canStart) startStarterLab();
                },
              }
            : {
                title: homeLabStatus.approved.title,
                body: `${countdown} Open My Lab to check items off over time.`,
                cta: prepDone > 0 ? homeLabStatus.approved.continueCta : homeLabStatus.approved.cta,
                onPress: openPrep,
              }
          : {
              title: homeLabStatus.explorer.title,
              body: homeLabStatus.explorer.body,
              cta: homeLabStatus.explorer.cta,
              onPress: () => router.push("/labs"),
            };

  return (
    <View style={styles.root}>
      <HomeGreeting subgreeting={subgreeting} />

      {pending ? (
        <PrepHero variant="pending" onPress={() => router.push("/labs/submitted")} />
      ) : preparing ? (
        <PrepHero
          done={prepDone}
          total={prepTotal}
          startIso={membership.startDate}
          ready={allDone}
          onPress={openPrep}
        />
      ) : completed ? (
        <CompletedHero onPress={() => router.push("/labs/results")} />
      ) : (
        <HomeHeroChart mode={active ? "lab" : "baseline"} />
      )}

      <InsightCard
        title={insight.title}
        body={insight.body}
        cta={insight.cta}
        ctaLayout="stack"
        onPress={insight.onPress}
      />

      <View style={styles.block}>
        <View style={styles.sectionRow}>
          <Text style={typography.caption} maxFontSizeMultiplier={1.3}>
            {copy.recommendedLabel}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.seeAll}
            hitSlop={12}
            onPress={() => router.push("/labs")}
            style={styles.seeAllHit}
          >
            <Text style={styles.seeAll} maxFontSizeMultiplier={1.3}>
              {copy.seeAll}
            </Text>
          </Pressable>
        </View>
        {enrolled
          ? comingSoonLabs.map((offer) => (
              <LabHeroCard
                key={offer.id}
                photo={offer.photo}
                title={offer.name}
                meta={offer.meta}
                pitch={offer.pitch ?? offer.description}
                badge={offer.badge}
                compact
                onPress={() => openLab(offer.id)}
              />
            ))
          : (
              <LabHeroCard
                photo={starterLab.photo}
                title={starterLab.name}
                meta={starterLab.meta}
                pitch={pending ? homeLabStatus.pending.pitch : starterLab.pitch}
                badge={pending ? homeLabStatus.pending.badge : "Start here"}
                badgeAccent={!pending}
                compact
                outlined
                onPress={() => (pending ? router.push("/labs/submitted") : openLab(starterLab.id))}
              />
            )}
      </View>

      {enrolled ? null : (
        <View style={styles.block}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.moreLabel}
            hitSlop={8}
            onPress={() => router.push("/labs")}
          >
            <Text style={typography.caption} maxFontSizeMultiplier={1.3}>
              {copy.moreLabel}
            </Text>
          </Pressable>
          {comingSoonLabs.map((offer) => (
            <LabHeroCard
              key={offer.id}
              photo={offer.photo}
              title={offer.name}
              meta={offer.meta}
              pitch={offer.pitch ?? offer.description}
              badge={offer.badge}
              compact
              onPress={() => openLab(offer.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.sectionGap,
  },
  block: {
    gap: spacing.sm,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAllHit: {
    paddingLeft: spacing.sm,
  },
  seeAll: {
    ...typography.caption,
    color: colors.accentBlue,
  },
});
