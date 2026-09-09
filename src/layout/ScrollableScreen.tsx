import { type ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { layout } from "@/src/theme/layout";
import { spacing } from "@/src/theme/spacing";
import AppScreen from "./AppScreen";

type ScrollableScreenProps = {
  children: ReactNode;
  footer?: ReactNode;
  edges?: ("top" | "right" | "bottom" | "left")[];
  padded?: boolean;
  contentStyle?: ViewStyle;
  backgroundColor?: string;
};

export default function ScrollableScreen({
  children,
  footer,
  edges = ["top"],
  padded = true,
  contentStyle,
  backgroundColor,
}: ScrollableScreenProps) {
  return (
    <AppScreen edges={edges} padded={padded} backgroundColor={backgroundColor}>
      <View style={styles.shell}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: footer ? spacing.md : layout.tabBarContentInset },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: layout.tabBarContentInset,
  },
});
