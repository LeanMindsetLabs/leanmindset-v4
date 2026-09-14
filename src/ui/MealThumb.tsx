import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { mealPhoto } from "@/src/lib/media";
import type { MealRecommendation } from "@/src/services/mealsService";

type Props = {
  meal: MealRecommendation;
  height: number;
  width?: number;
  radius?: number;
  contentFit?: "cover" | "contain";
};

export default function MealThumb({ meal, height, width, radius = 0, contentFit = "cover" }: Props) {
  const source = mealPhoto(meal.id);
  return (
    <View style={[styles.wrap, { height, width, alignSelf: width ? "auto" : "stretch", borderRadius: radius }]}>
      {source ? (
        <Image source={source} style={styles.image} contentFit={contentFit} />
      ) : (
        <View style={[styles.fallback, { backgroundColor: "#2D3136" }]}>
          <Ionicons name="restaurant" size={height > 80 ? 28 : 18} color="rgba(255,255,255,0.4)" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "#2D3136",
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
