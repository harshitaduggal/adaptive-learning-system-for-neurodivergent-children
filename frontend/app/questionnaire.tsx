import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function QuestionnaireScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    soundSensitive: false,
    prefersDimUI: false,
    clutterSensitive: false,
    animationSensitive: false,
    motionSensitive: false,
    needsLargeText: false,
    needsHighContrast: false,
    hasFavoriteTheme: false,
    favoriteColor: "",
    favoriteTheme: "minimal",

    reduceBrightness: false,
    useWarmColors: false,
    reduceAnimations: false,
    minimalMode: false,
    muteSounds: false,

    brightnessLevel: 1,
    textScale: 1,
  });

  type FormType = typeof form;

  const setValue = (key: keyof FormType, value: any) => {
    setForm({ ...form, [key]: value });
  };

  /* 🔥 LIVE PREVIEW STYLES */
  const dynamicStyles = {
    backgroundColor: form.useWarmColors
      ? "#FFF8E1"
      : `rgba(255,255,255,${form.brightnessLevel})`,
    textScale: form.textScale,
  };

  const handleSave = async () => {
    const user = await AsyncStorage.getItem("currentUser");

    let profiles = JSON.parse(
      (await AsyncStorage.getItem("profiles")) || "{}"
    );

    profiles[user!] = form;

    await AsyncStorage.setItem("profiles", JSON.stringify(profiles));
    await AsyncStorage.setItem(`isFirstTime_${user}`, "false");

    router.replace("/user-selection");
  };

  const QuestionCard = ({
    label,
    valueKey,
  }: {
    label: string;
    valueKey: keyof FormType;
  }) => (
    <View style={styles.card}>
      <Text
        style={[
          styles.label,
          { fontSize: 16 * dynamicStyles.textScale },
        ]}
      >
        {label}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.optionBtn,
            form[valueKey] === true && styles.activeBtn,
          ]}
          onPress={() => setValue(valueKey, true)}
        >
          <Text
            style={[
              styles.optionText,
              { fontSize: 14 * dynamicStyles.textScale },
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionBtn,
            form[valueKey] === false && styles.activeBtn,
          ]}
          onPress={() => setValue(valueKey, false)}
        >
          <Text
            style={[
              styles.optionText,
              { fontSize: 14 * dynamicStyles.textScale },
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

 return (
  <View style={{ flex: 1 }}>

    {/* MAIN UI */}
    <View style={{ flex: 1, backgroundColor: "#F4FDFC" }}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text
          style={[
            styles.title,
            { fontSize: 26 * dynamicStyles.textScale },
          ]}
        >
          Child Preferences
        </Text>

        <Text
          style={[
            styles.subtitle,
            { fontSize: 14 * dynamicStyles.textScale },
          ]}
        >
          Personalize the experience
        </Text>

        {/* QUESTIONS */}
        <QuestionCard label="Disturbed by loud sounds?" valueKey="soundSensitive" />
        <QuestionCard label="Prefers dim/simple UI?" valueKey="prefersDimUI" />
        <QuestionCard label="Distracted by clutter?" valueKey="clutterSensitive" />
        <QuestionCard label="Animations distracting?" valueKey="animationSensitive" />
        <QuestionCard label="Sensitive to motion?" valueKey="motionSensitive" />
        <QuestionCard label="Needs large text?" valueKey="needsLargeText" />
        <QuestionCard label="Needs high contrast?" valueKey="needsHighContrast" />

        <QuestionCard label="Reduce animations?" valueKey="reduceAnimations" />
        <QuestionCard label="Use minimal UI?" valueKey="minimalMode" />
        <QuestionCard label="Mute sounds?" valueKey="muteSounds" />
        <QuestionCard label="Use warm/yellow colors?" valueKey="useWarmColors" />

        {/* SLIDERS */}
        <View style={styles.card}>
          <Text style={[styles.label, { fontSize: 16 * dynamicStyles.textScale }]}>
            Screen Brightness
          </Text>
          <Slider
            minimumValue={0.5}
            maximumValue={1}
            step={0.1}
            value={form.brightnessLevel}
            onValueChange={(val) => setValue("brightnessLevel", val)}
          />
          <Text style={styles.sliderValue}>
            {Math.round(form.brightnessLevel * 100)}%
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.label, { fontSize: 16 * dynamicStyles.textScale }]}>
            Text Size
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={2}
            step={0.1}
            value={form.textScale}
            onValueChange={(val) => setValue("textScale", val)}
          />
          <Text style={styles.sliderValue}>
            {form.textScale.toFixed(1)}x
          </Text>
        </View>

      </ScrollView>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>

    {/* 🔥 OVERLAYS (MUST BE LAST) */}

    {/* Brightness */}
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: `rgba(0,0,0,${1 - form.brightnessLevel})`,
        },
      ]}
    />

    {/* Yellow tint */}
    {form.useWarmColors && (
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(255, 220, 120, 0.25)",
          },
        ]}
      />
    )}

  </View>
);
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },

  title: {
    fontWeight: "700",
    color: "#2BB3B1",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },

  label: {
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  optionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#E0F7F6",
    alignItems: "center",
  },

  activeBtn: {
    backgroundColor: "#2BB3B1",
  },

  optionText: {
    color: "#000",
  },

  sliderValue: {
    textAlign: "center",
    marginTop: 5,
    color: "#555",
  },

  sectionTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "600",
  },

  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },

  selected: {
    borderWidth: 3,
    borderColor: "#000",
  },

  themeBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#E0F7F6",
  },

  activeTheme: {
    backgroundColor: "#2BB3B1",
  },

  themeText: {
    color: "#000",
  },

  saveBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#2BB3B1",
    padding: 16,
    borderRadius: 15,
  },

  saveText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
