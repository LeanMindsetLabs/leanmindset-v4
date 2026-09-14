import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "@/src/theme/colors";
import AuthBrandHeader from "@/src/ui/auth/AuthBrandHeader";

/** Shown while storage/profile hydrates — app background + logo, not a black void. */
export default function AppBootScreen() {
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <AuthBrandHeader />
        <ActivityIndicator color={colors.accentBlue} style={styles.spinner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  spinner: {
    marginTop: 28,
  },
});
