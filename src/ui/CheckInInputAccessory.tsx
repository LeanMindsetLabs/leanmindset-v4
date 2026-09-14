import { InputAccessoryView, Keyboard, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/theme/colors";

export const DECIMAL_PAD_ACCESSORY = "lm-decimal-pad-accessory";
/** @deprecated Use DECIMAL_PAD_ACCESSORY */
export const CHECKIN_INPUT_ACCESSORY = DECIMAL_PAD_ACCESSORY;

/** iOS number pads have no Return key. This blue Enter sits on top of the keyboard. */
export function CheckInInputAccessory({
  nativeID = DECIMAL_PAD_ACCESSORY,
  label = "Enter",
  disabled,
  onPress,
}: {
  nativeID?: string;
  label?: string;
  disabled?: boolean;
  onPress?: () => void;
}) {
  if (Platform.OS !== "ios") return null;

  return (
    <InputAccessoryView nativeID={nativeID}>
      <View style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          disabled={disabled}
          onPress={() => {
            if (onPress) {
              onPress();
              return;
            }
            Keyboard.dismiss();
          }}
          style={[styles.btn, disabled && styles.btnOff]}
        >
          <Text style={styles.label}>{label}</Text>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#12161C",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "flex-end",
  },
  btn: {
    backgroundColor: colors.accentBlue,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 76,
    alignItems: "center",
  },
  btnOff: {
    opacity: 0.4,
  },
  label: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
