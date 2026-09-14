import { Ionicons } from "@expo/vector-icons";
import { type Href, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "@/src/hooks/useProfile";
import ExplorerHomeContent from "@/src/screens/home/ExplorerHomeContent";
import { colors } from "@/src/theme/colors";
import { layout } from "@/src/theme/layout";
import { LeanMindsetWordmark } from "@/src/ui/LeanMindsetBrand";

export default function HomeScreen() {
  const { profile } = useProfile();

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View style={styles.atmosphere} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetTop}>
          <Pressable
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            accessibilityHint="Opens notification settings"
            onPress={() => router.push("/(tabs)/profile/app-settings" as Href)}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
          </Pressable>
          <LeanMindsetWordmark size={20} style={styles.greetBrand} />
          <Avatar initial={profile.user?.initial || "S"} />
        </View>
        <ExplorerHomeContent />
      </ScrollView>
    </SafeAreaView>
  );
}

function Avatar({ initial }: { initial: string }) {
  return (
    <Pressable
      style={styles.avatar}
      accessibilityRole="button"
      accessibilityLabel="Profile"
      onPress={() => router.push("/(tabs)/profile/" as Href)}
    >
      <Text style={styles.avatarText}>{initial}</Text>
      <View style={styles.online} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  atmosphere: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#121314",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: layout.tabBarContentInset },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#2c2c2e",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: colors.white, fontSize: 18, fontWeight: "700" },
  online: {
    position: "absolute", right: 0, bottom: 0, width: 11, height: 11, borderRadius: 6,
    backgroundColor: "#19e68c", borderWidth: 2, borderColor: "#0f1112",
  },
  greetTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  greetBrand: {
    flex: 1,
    textAlign: "center",
  },
});
