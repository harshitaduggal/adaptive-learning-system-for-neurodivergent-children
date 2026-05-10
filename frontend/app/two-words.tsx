// app/two-word-phrases.tsx

import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const COLORS = {
  bg: "#FFF8EE",

  cream: "#FFF9F2",
  creamDark: "#F5E6CC",

  brown: "#9A5B34",
  brownSoft: "#C27A4B",

  blue: "#456FB5",

  text: "#5E412F",
  subtext: "#9B7B65",

  white: "#FFFFFF",

  yellow: "#F6C968",
};

const phrases = [
  {
    id: 1,
    title: "Come In",
    subtitle: "Entering a room",
    image: require("../assets/phrases/come_in.png"),
    color: "#FFF2C9",
  },

  {
    id: 2,
    title: "Go Out",
    subtitle: "Leaving a room",
    image: require("../assets/phrases/go_out.png"),
    color: "#EEF5FF",
  },

  {
    id: 3,
    title: "Door Open",
    subtitle: "The door is open",
    image: require("../assets/phrases/door_open.png"),
    color: "#FFF0EC",
  },

  {
    id: 4,
    title: "Door Close",
    subtitle: "The door is closed",
    image: require("../assets/phrases/door_close.png"),
    color: "#EAFBF1",
  },

  {
    id: 5,
    title: "Light On",
    subtitle: "The light is on",
    image: require("../assets/phrases/light_on.png"),
    color: "#FFF6D9",
  },

  {
    id: 6,
    title: "Light Off",
    subtitle: "The light is off",
    image: require("../assets/phrases/light_off.png"),
    color: "#EFEAFF",
  },

  {
    id: 7,
    title: "Brush Teeth",
    subtitle: "Cleaning teeth",
    image: require("../assets/phrases/brush_teeth.png"),
    color: "#FFE9E3",
  },

  {
    id: 8,
    title: "Wash Hands",
    subtitle: "Cleaning hands",
    image: require("../assets/phrases/wash_hands.png"),
    color: "#E7F7FF",
  },
];

export default function TwoWordPhrases() {
  const [current, setCurrent] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateCard = () => {
    fadeAnim.setValue(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const nextCard = () => {
    if (current < phrases.length - 1) {
      setCurrent(current + 1);
      animateCard();
    }
  };

  const prevCard = () => {
    if (current > 0) {
      setCurrent(current - 1);
      animateCard();
    }
  };

  const card = phrases[current];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.bg}
      />

      <LinearGradient
        colors={["#FFF8EE", "#FFF4E6", "#FFF9F2"]}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          {/* header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.smallTitle}>
                Two Word Phrases
              </Text>

              <Text style={styles.mainTitle}>
                Daily Actions 🌱
              </Text>
            </View>

            <View style={styles.progressPill}>
              <Text style={styles.progressText}>
                {current + 1}/{phrases.length}
              </Text>
            </View>
          </View>

          {/* card */}
          <Animated.View
            style={[
              styles.cardWrap,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: card.color,
                },
              ]}
            >
              <Image
                source={card.image}
                style={styles.image}
                resizeMode="contain"
              />

              <View style={styles.textWrap}>
                <Text style={styles.cardTitle}>
                  {card.title}
                </Text>

                <Text style={styles.cardSubtitle}>
                  {card.subtitle}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* indicators */}
          <View style={styles.dotsRow}>
            {phrases.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  current === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {/* controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.navButton,
                current === 0 && styles.disabledBtn,
              ]}
              onPress={prevCard}
              disabled={current === 0}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={
                  current === 0
                    ? "#CDBDA3"
                    : COLORS.brown
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.listenButton}
            >
              <Ionicons
                name="volume-high"
                size={22}
                color="white"
              />

              <Text style={styles.listenText}>
                Listen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.navButton,
                current === phrases.length - 1 &&
                  styles.disabledBtn,
              ]}
              onPress={nextCard}
              disabled={current === phrases.length - 1}
            >
              <Ionicons
                name="arrow-forward"
                size={22}
                color={
                  current === phrases.length - 1
                    ? "#CDBDA3"
                    : COLORS.brown
                }
              />
            </TouchableOpacity>
          </View>

          {/* tip */}
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>
              Learning Tip ✨
            </Text>

            <Text style={styles.tipText}>
              Repeat the phrase slowly and encourage the
              child to imitate the action while speaking.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF8EE",
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
  },

  header: {
    marginTop: 10,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallTitle: {
    color: COLORS.brownSoft,
    fontSize: 15,
    fontWeight: "700",
  },

  mainTitle: {
    marginTop: 6,

    color: COLORS.text,

    fontSize: 34,
    fontWeight: "900",
  },

  progressPill: {
    backgroundColor: "#FFF4DD",

    paddingHorizontal: 18,
    paddingVertical: 12,

    borderRadius: 22,

    borderWidth: 2,
    borderColor: "#F7D58A",
  },

  progressText: {
    color: COLORS.brown,

    fontWeight: "900",

    fontSize: 15,
  },

  cardWrap: {
    marginTop: 34,
    alignItems: "center",
  },

  card: {
    width: width - 44,

    borderRadius: 40,

    padding: 18,

    borderWidth: 5,
    borderColor: "#F4C86B",

    shadowColor: "#D79A2B",
    shadowOpacity: 0.12,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 3,
  },

  image: {
    width: "100%",
    height: 320,

    borderRadius: 30,

    backgroundColor: "#FFF8EF",
  },

  textWrap: {
    marginTop: 22,
    alignItems: "center",
  },

  cardTitle: {
    color: "#3E67A8",

    fontSize: 40,

    fontWeight: "900",

    textAlign: "center",
  },

  cardSubtitle: {
    marginTop: 10,

    color: COLORS.subtext,

    fontSize: 16,

    textAlign: "center",

    lineHeight: 24,

    paddingHorizontal: 10,
  },

  dotsRow: {
    marginTop: 28,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: 10,
  },

  dot: {
    width: 12,
    height: 12,

    borderRadius: 6,

    backgroundColor: "#F7DC9A",
  },

  activeDot: {
    width: 30,

    borderRadius: 8,

    backgroundColor: "#3E67A8",
  },

  controls: {
    marginTop: 30,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  navButton: {
    width: 60,
    height: 60,

    borderRadius: 22,

    backgroundColor: "#FFF4DD",

    borderWidth: 2,
    borderColor: "#F4D186",

    alignItems: "center",
    justifyContent: "center",
  },

  disabledBtn: {
    opacity: 0.45,
  },

  listenButton: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#3E67A8",

    paddingHorizontal: 30,

    height: 60,

    borderRadius: 24,

    gap: 10,

    shadowColor: "#3E67A8",
    shadowOpacity: 0.15,
    shadowRadius: 8,

    elevation: 2,
  },

  listenText: {
    color: "white",

    fontSize: 18,

    fontWeight: "900",
  },

  tipCard: {
    marginTop: 34,

    backgroundColor: "#FFF1DF",

    borderRadius: 30,

    padding: 24,

    borderWidth: 2,
    borderColor: "#F6D28B",
  },

  tipTitle: {
    color: COLORS.text,

    fontSize: 22,

    fontWeight: "900",
  },

  tipText: {
    marginTop: 10,

    color: COLORS.subtext,

    fontSize: 15,

    lineHeight: 24,
  },
});