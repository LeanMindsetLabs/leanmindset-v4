import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { router } from "expo-router";
import ScrollableScreen from "@/src/layout/ScrollableScreen";
import { useLabMembership } from "@/src/hooks/useLabMembership";
import { useProfile } from "@/src/hooks/useProfile";
import { myLabProfile, openMyLab } from "@/src/content/labs";
import { labStatusLabel } from "@/src/services/labMembershipService";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import BlueCta from "@/src/ui/BlueCta";
import MetricRing from "@/src/ui/MetricRing";
import ProfileIcon from "@/src/ui/profile/ProfileIcon";
import ProfileNavHeader from "@/src/ui/profile/ProfileNavHeader";
import WeightTrendChart from "@/src/ui/profile/WeightTrendChart";
import { pushProfile } from "./nav";

const BG = colors.profileBlack;
const CARD = colors.profileCard;
const PURPLE = colors.profilePurple;
const ORANGE = colors.profileOrange;
const TEAL = colors.profileTeal;
const LABEL = "#8E8E93";

export default function ProfileHubScreen() {
  const { profile } = useProfile();
  const level = Math.round(profile.user.leanLevel);

  return (
    <ScrollableScreen backgroundColor={BG} contentStyle={styles.page}>
      <ProfileNavHeader
        title="Profile"
        right={
          <Pressable
            onPress={() => pushProfile("settings")}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            style={styles.iconBtn}
          >
            <ProfileIcon name="gear" size={22} color={colors.white} strokeWidth={1.65} />
          </Pressable>
        }
      />

      <View style={styles.identity}>
        <Pressable
          onPress={() => pushProfile("information")}
          accessibilityRole="button"
          accessibilityLabel="Change photo"
          style={styles.avatarHit}
        >
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.user.initial}</Text>
            </View>
          </View>
          <View style={styles.editBtn}>
            <ProfileIcon name="pencil" size={11} color={colors.white} strokeWidth={1.7} />
          </View>
        </Pressable>

        <Pressable style={styles.identityCopy} onPress={() => pushProfile("account")} accessibilityRole="button">
          <Text style={styles.name} numberOfLines={1}>
            {profile.user.name.toUpperCase()}
          </Text>
          <Text style={styles.meta}>
            Member since <Text style={styles.metaStrong}>{profile.user.memberSinceLabel}</Text>
          </Text>
          <Text style={styles.levelKicker}>LEAN LEVEL</Text>
          <View style={styles.levelRow}>
            <Text style={styles.levelNum}>{level}</Text>
            <LeanHex />
          </View>
        </Pressable>
      </View>

      <MyLabAccessCard />

      <View style={styles.stats}>
        <Stat kind="flame" value={String(profile.streakDays)} label="DAY STREAK" />
        <Stat kind="target" value={`${profile.consistencyPct}%`} label="CONSISTENCY" />
        <Stat kind="dumbbell" value={String(profile.workoutsCount)} label="WORKOUTS" />
      </View>

      <WeightTrendChart
        history={profile.weightHistory}
        deltaLb={profile.weightDeltaLb}
        units={profile.preferences.units}
      />

      <Pressable style={styles.goal} onPress={() => pushProfile("goals")} accessibilityRole="button">
        <View style={styles.goalCopy}>
          <View style={styles.goalHead}>
            <View style={styles.goalIcon}>
              <ProfileIcon name="target" size={14} color={colors.white} strokeWidth={1.7} />
            </View>
            <Text style={styles.goalKicker}>CURRENT GOAL</Text>
          </View>
          <Text style={styles.goalTitle}>{profile.goalLabel}</Text>
          <Text style={styles.goalMeta}>Target: {profile.targetWeightKg} kg</Text>
        </View>
        <MetricRing
          size={72}
          strokeWidth={7}
          trackWidth={5}
          progress={profile.goalProgress}
          fillColor={PURPLE}
          trackColor="#2A2A30"
        >
          <Text style={styles.goalPct}>{Math.round(profile.goalProgress * 100)}%</Text>
        </MetricRing>
        <ProfileIcon name="chevron" size={16} color={colors.white} strokeWidth={1.7} />
      </Pressable>
    </ScrollableScreen>
  );
}

function MyLabAccessCard() {
  const { membership } = useLabMembership();
  const status = labStatusLabel(membership);
  const inLab = membership.lifecycle !== "explorer";
  const day = membership.progress?.day ?? membership.day;
  const total = membership.progress?.totalDays ?? 30;
  const meta = !inLab
    ? "Not in a Lab yet"
    : membership.lifecycle === "requested"
      ? `${membership.labName ?? "Starter Lab"} · Pending`
      : membership.lifecycle === "approved_preparing"
        ? `${membership.labName ?? "Starter Lab"} · Preparing`
        : `${membership.labName ?? "Starter Lab"}${day != null ? ` · Day ${day} of ${total}` : ""}`;

  return (
    <View style={styles.labCard}>
      <Text style={styles.labTitle}>{myLabProfile.title}</Text>
      <Text style={styles.labMeta}>{meta}</Text>
      <Text style={styles.labStatus}>{`Status: ${status}`}</Text>
      <BlueCta
        label={inLab ? myLabProfile.openCta : myLabProfile.exploreCta}
        onPress={() => openMyLab(membership.lifecycle)}
      />
    </View>
  );
}

function Stat({ kind, value, label }: { kind: "flame" | "target" | "dumbbell"; value: string; label: string }) {
  return (
    <View style={styles.stat}>
      {kind === "flame" ? <FlameIcon /> : kind === "target" ? <TargetIcon /> : <DumbbellIcon />}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function FlameIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M12 2c1.4 3.2 2 5.4 1.2 7.2C12.6 10.6 11.3 11.4 11.3 13c0 1.7 1.3 2.8 2.7 2.8 2.4 0 4.4-2.2 4.4-5.4 0-4.6-3.2-7.4-6.4-8.4C15.8 6.2 18 10 18 13.4 18 17.6 15.1 21 12 21s-6-3.4-6-7.6C6 8.8 9.2 4.4 12 2z"
        fill={ORANGE}
      />
    </Svg>
  );
}

function TargetIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={TEAL} strokeWidth={1.8} />
      <Circle cx="12" cy="12" r="3" fill={TEAL} />
    </Svg>
  );
}

function DumbbellIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth={1.8} strokeLinecap="round">
      <Path d="M6.5 7.5v9" />
      <Path d="M17.5 7.5v9" />
      <Path d="M4.5 9v6" />
      <Path d="M3 10v4" />
      <Path d="M19.5 9v6" />
      <Path d="M21 10v4" />
      <Path d="M6.5 12h11" />
    </Svg>
  );
}

function LeanHex() {
  return (
    <Svg width={22} height={24} viewBox="0 0 22 24" fill="none">
      <Path d="M11 1.4 L20.3 6.8 v10.4 L11 22.6 1.7 17.2 V6.8 Z" stroke={PURPLE} strokeWidth={1.4} />
      <Path d="M11 7.4 L14.1 9.2 v3.6 L11 14.6 7.9 12.8 V9.2 Z" fill="#C9A227" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: 14,
    paddingBottom: layout.tabBarContentInset + 12,
  },
  iconBtn: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  labCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  labTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  labMeta: {
    color: LABEL,
    fontSize: 13,
  },
  labStatus: {
    color: PURPLE,
    fontSize: 12,
    fontWeight: "600",
  },
  avatarHit: {
    width: 104,
    height: 104,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: PURPLE,
    padding: 3,
  },
  avatar: {
    flex: 1,
    borderRadius: 45,
    backgroundColor: "#2A2A30",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "700",
  },
  editBtn: {
    position: "absolute",
    right: 4,
    bottom: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  identityCopy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    color: LABEL,
  },
  metaStrong: {
    color: colors.white,
  },
  levelKicker: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: LABEL,
  },
  levelRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  levelNum: {
    color: PURPLE,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "700",
  },
  stats: {
    flexDirection: "row",
    gap: 8,
  },
  stat: {
    flex: 1,
    minWidth: 0,
    backgroundColor: CARD,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: LABEL,
    textAlign: "center",
  },
  goal: {
    backgroundColor: CARD,
    borderRadius: 16,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  goalHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  goalKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    color: colors.white,
  },
  goalTitle: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "700",
  },
  goalMeta: {
    fontSize: 13,
    color: LABEL,
  },
  goalPct: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
