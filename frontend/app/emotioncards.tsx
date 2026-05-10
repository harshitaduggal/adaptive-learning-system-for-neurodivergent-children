// app/emotion-flashcards.tsx

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
  peach: "#FFD7BE",
};

const flashcards = [
  {
    id: 1,
    title: "Happy",
    subtitle: "A smiling happy feeling",
    image: require("../assets/emotions/happy.png"),
    color: "#FFF2C9",
  },

  {
    id: 2,
    title: "Sad",
    subtitle: "Feeling upset or unhappy",
    image: require("../assets/emotions/sad.png"),
    color: "#EEF5FF",
  },

  {
    id: 3,
    title: "Angry",
    subtitle: "A strong frustrated feeling",
    image: require("../assets/emotions/angry.png"),
    color: "#FFF0EC",
  },
];

export default function EmotionFlashcards() {
  const [current, setCurrent] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateCard = () => {
    fadeAnim.setValue(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const nextCard = () => {
    if (current < flashcards.length - 1) {
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

  const card = flashcards[current];

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
                Emotion Flashcards
              </Text>

              <Text style={styles.mainTitle}>
                Learn Feelings 🌱
              </Text>
            </View>

            <View style={styles.progressPill}>
              <Text style={styles.progressText}>
                {current + 1}/{flashcards.length}
              </Text>
            </View>
          </View>

          {/* flashcard */}
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

          {/* dots */}
          <View style={styles.dotsRow}>
            {flashcards.map((_, index) => (
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
                current === flashcards.length - 1 &&
                  styles.disabledBtn,
              ]}
              onPress={nextCard}
              disabled={
                current === flashcards.length - 1
              }
            >
              <Ionicons
                name="arrow-forward"
                size={22}
                color={
                  current === flashcards.length - 1
                    ? "#CDBDA3"
                    : COLORS.brown
                }
              />
            </TouchableOpacity>
          </View>

          {/* tip card */}
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>
              Practice Tip ✨
            </Text>

            <Text style={styles.tipText}>
              Encourage the child to copy the facial
              expression while saying the emotion aloud.
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

    fontSize: 42,

    fontWeight: "900",

    letterSpacing: 0.3,
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