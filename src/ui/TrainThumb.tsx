import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { trainPhoto } from "@/src/lib/media";

type Props = {
  illustration: string;
  height: number;
  width?: number;
  radius?: number;
};

export default function TrainThumb({ illustration, height, width, radius = 0 }: Props) {
  const source = trainPhoto(illustration);
  return (
    <View style={[styles.wrap, { height, width, alignSelf: width ? "auto" : "stretch", borderRadius: radius }]}>
      {source ? (
        <Image source={source} style={styles.image} contentFit="contain" />
      ) : (
        <View style={styles.fallback}>
          <Ionicons name="barbell-outline" size={height > 80 ? 28 : 18} color="rgba(255,255,255,0.4)" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "#2D3136",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
