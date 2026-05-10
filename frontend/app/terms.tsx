import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";

const { width } = Dimensions.get("window");

// Friendly owl mascot SVG
function OwlMascot() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Body */}
      <Ellipse cx="50" cy="62" rx="28" ry="30" fill="#7C6FCD" />
      {/* Head */}
      <Circle cx="50" cy="36" r="24" fill="#7C6FCD" />
      {/* Ear tufts */}
      <Path d="M32 18 L28 8 L38 15 Z" fill="#6358B8" />
      <Path d="M68 18 L72 8 L62 15 Z" fill="#6358B8" />
      {/* Face plate */}
      <Ellipse cx="50" cy="38" rx="16" ry="14" fill="#F0E6C8" />
      {/* Eyes */}
      <Circle cx="43" cy="34" r="7" fill="white" />
      <Circle cx="57" cy="34" r="7" fill="white" />
      <Circle cx="43" cy="34" r="4" fill="#3D2B8E" />
      <Circle cx="57" cy="34" r="4" fill="#3D2B8E" />
      <Circle cx="44.5" cy="32.5" r="1.5" fill="white" />
      <Circle cx="58.5" cy="32.5" r="1.5" fill="white" />
      {/* Beak */}
      <Path d="M47 41 L50 46 L53 41 Z" fill="#F5A623" />
      {/* Wings */}
      <Path d="M22 58 Q10 65 18 78 Q28 70 30 60 Z" fill="#6358B8" />
      <Path d="M78 58 Q90 65 82 78 Q72 70 70 60 Z" fill="#6358B8" />
      {/* Belly pattern */}
      <Ellipse cx="50" cy="68" rx="14" ry="16" fill="#9B8FE0" opacity="0.5" />
      {/* Feet */}
      <Path d="M40 90 Q36 94 32 92 Q36 88 40 88 Z" fill="#F5A623" />
      <Path d="M60 90 Q64 94 68 92 Q64 88 60 88 Z" fill="#F5A623" />
      <Rect x="38" y="87" width="6" height="5" rx="2" fill="#F5A623" />
      <Rect x="56" y="87" width="6" height="5" rx="2" fill="#F5A623" />
    </Svg>
  );
}

export default function TermsScreen() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!accepted) return;
    await AsyncStorage.setItem("acceptedTerms", "true");
    router.replace("/AuthScreen");
  };

  return (
    <View style={styles.container}>
      {/* Decorative blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* Mascot */}
      <View style={styles.mascotWrapper}>
        <OwlMascot />
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>Read carefully before we begin!</Text>
        </View>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Terms of Use</Text>

        <ScrollView
          style={styles.scrollBox}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>What this app does</Text>
          <Text style={styles.bodyText}>
            This app supports learning for children in a safe, structured, and
            enjoyable environment designed to build real skills.
          </Text>

          <Text style={styles.sectionLabel}>Your data</Text>
          <Text style={styles.bodyText}>
            All data is stored locally on your device. Uploaded images or audio
            are used only for in-app learning and are never shared.
          </Text>

          <Text style={styles.sectionLabel}>Parent responsibility</Text>
          <Text style={styles.bodyText}>
            Parents are responsible for the content their child interacts with.
            Adult supervision is strongly recommended during use.
          </Text>

          <Text style={styles.bodyText}>
            By continuing, you agree to use this app responsibly and in the
            best interest of the child.
          </Text>
        </ScrollView>

        {/* Checkbox row */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAccepted(!accepted)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted && (
              <Svg width={14} height={14} viewBox="0 0 14 14">
                <Path
                  d="M2 7 L5.5 10.5 L12 3"
                  stroke="white"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
            )}
          </View>
          <Text style={styles.checkboxLabel}>I agree to the terms of use</Text>
        </TouchableOpacity>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.button, !accepted && styles.buttonDisabled]}
          disabled={!accepted}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF0FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    overflow: "hidden",
  },

  blobTopRight: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#C5BFFF",
    opacity: 0.5,
  },

  blobBottomLeft: {
    position: "absolute",
    bottom: -80,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#A8F0E8",
    opacity: 0.4,
  },

  mascotWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  speechBubble: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 12,
    maxWidth: 180,
    shadowColor: "#7C6FCD",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },

  speechText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5046A8",
    lineHeight: 18,
  },

  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#7C6FCD",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4A3DB5",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  scrollBox: {
    backgroundColor: "#F3F0FF",
    borderRadius: 18,
    padding: 16,
    maxHeight: 220,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7C6FCD",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 10,
    marginBottom: 4,
  },

  bodyText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 21,
    marginBottom: 8,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 10,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#C5BFFF",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: "#7C6FCD",
    borderColor: "#7C6FCD",
  },

  checkboxLabel: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },

  button: {
    marginTop: 18,
    backgroundColor: "#7C6FCD",
    paddingVertical: 15,
    borderRadius: 22,
    alignItems: "center",
    shadowColor: "#7C6FCD",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },

  buttonDisabled: {
    backgroundColor: "#C5BFFF",
    shadowOpacity: 0,
    elevation: 0,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.3,
  },
});