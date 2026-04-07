import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useRef } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const TILE_WIDTH = 220;
const SPACING = 30;

export default function CategorySelection() {

  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  const categories = [
    "Ask for Help",
    "Make Sentences",
    "Daily Activities",
    "Feelings",
    "Describe Things",
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            What should we learn today?
          </Text>
        </View>


        {/* Carousel */}
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          snapToInterval={TILE_WIDTH + SPACING}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        >

          {categories.map((label, index) => {

            const inputRange = [
              (index - 1) * (TILE_WIDTH + SPACING),
              index * (TILE_WIDTH + SPACING),
              (index + 1) * (TILE_WIDTH + SPACING),
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.85, 1.1, 0.85],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.tile,
                  { transform: [{ scale }] }
                ]}
              >

                <TouchableOpacity
                  style={styles.tileInner}
                  activeOpacity={0.8}
                  onPress={() => router.push("/content")}
                >

                  <Image
                    source={require("../assets/images/child-avatar.png")}
                    style={styles.image}
                  />

                  <Text style={styles.tileText}>
                    {label}
                  </Text>

                </TouchableOpacity>

              </Animated.View>
            );
          })}

        </Animated.ScrollView>

      </View>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F6F7",
    justifyContent: "center",
  },

  header: {
    position: "absolute",
    top: 30,
    left: 40,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 12,
    color: "#333",
  },

  scrollContainer: {
    paddingHorizontal: (width - TILE_WIDTH) / 2,
    alignItems: "center",
    gap: SPACING,
    marginTop: 14,
  },

  tile: {
    width: TILE_WIDTH,
    height: 180,
  },

  tileInner: {
    flex: 1,
    backgroundColor: "#6C9EA6",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },

  tileText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
  },

});