import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

// ─── Design Tokens ─────────────────────────────────────────────
const T = {
  purple:      "#7B61FF",
  purpleLight: "#EDE8FF",
  purpleMid:   "#C4B8FF",
  yellow:      "#FFD166",
  yellowLight: "#FFF6D6",
  coral:       "#FF6B6B",
  coralLight:  "#FFE8E8",
  mint:        "#A8EDEA",
  teal:        "#06D6A0",
  orange:      "#FF8C42",
  bg:          "#F5F0FF",
  white:       "#FFFFFF",
  text:        "#1A1A3E",
  textMid:     "#5A5A8A",
  textSoft:    "#B0A8D8",
  border:      "#EAE4FF",
};

// ─── Section groups ─────────────────────────────────────────────
const SECTIONS = [
  {
    title: "Senses & Comfort", emoji: "🌿",
    color: "#E0FBF4", accent: T.teal,
    questions: [
      { label: "Bothered by loud sounds?",      valueKey: "soundSensitive",     icon: "🔊" },
      { label: "Prefers dim or simple screens?", valueKey: "prefersDimUI",       icon: "🌙" },
      { label: "Distracted by visual clutter?",  valueKey: "clutterSensitive",   icon: "🧩" },
      { label: "Sensitive to animations?",       valueKey: "animationSensitive", icon: "🎬" },
      { label: "Bothered by motion effects?",    valueKey: "motionSensitive",    icon: "🌀" },
    ],
  },
  {
    title: "Reading & Display", emoji: "📚",
    color: T.purpleLight, accent: T.purple,
    questions: [
      { label: "Needs bigger text?",        valueKey: "needsLargeText",    icon: "🔡" },
      { label: "Needs high contrast?",      valueKey: "needsHighContrast", icon: "🎨" },
      { label: "Prefer warm/yellow tones?", valueKey: "useWarmColors",     icon: "🌅" },
    ],
  },
  {
    title: "App Experience", emoji: "⚙️",
    color: T.yellowLight, accent: "#C68A00",
    questions: [
      { label: "Reduce animations?", valueKey: "reduceAnimations", icon: "✋" },
      { label: "Minimal UI layout?", valueKey: "minimalMode",      icon: "🪴" },
      { label: "Mute all sounds?",   valueKey: "muteSounds",       icon: "🔇" },
    ],
  },
];

// ─── Twinkling dot ─────────────────────────────────────────────
function TwinkleDot({ top, left, color, size = 8, diamond = false }: {
  top: number; left: number; color: string; size?: number; diamond?: boolean;
}) {
  const op = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(op, { toValue: 1,   duration: 900, useNativeDriver: true }),
        Animated.timing(op, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{
      position: "absolute", top, left, width: size, height: size,
      borderRadius: diamond ? 2 : size / 2, backgroundColor: color, opacity: op,
      transform: diamond ? [{ rotate: "45deg" }] : [],
    }} />
  );
}

// ─── Fox Mascot ────────────────────────────────────────────────
function FoxMascot() {
  return (
    <View style={fox.outer}>
      <View style={fox.tail}><View style={fox.tailTip} /></View>
      <View style={fox.body}><View style={fox.belly} /></View>
      <View style={fox.head}>
        <View style={[fox.ear, fox.earL]}><View style={[fox.earIn]} /></View>
        <View style={[fox.ear, fox.earR]}><View style={[fox.earIn]} /></View>
        <View style={[fox.eye, fox.eyeL]}><View style={fox.shine} /></View>
        <View style={[fox.eye, fox.eyeR]}><View style={fox.shine} /></View>
        <View style={fox.nose} />
        <View style={[fox.cheek, fox.cheekL]} />
        <View style={[fox.cheek, fox.cheekR]} />
      </View>
    </View>
  );
}
const fox = StyleSheet.create({
  outer:   { width: 62, height: 62, position: "relative" },
  tail:    { position: "absolute", bottom: 6, right: -13, width: 20, height: 20, backgroundColor: "#FF8C42", borderRadius: 10, borderBottomLeftRadius: 2, transform: [{ rotate: "30deg" }] },
  tailTip: { position: "absolute", top: 3, right: 3, width: 7, height: 7, borderRadius: 4, backgroundColor: "#FFD4A8" },
  body:    { position: "absolute", bottom: 0, left: 8, width: 46, height: 36, backgroundColor: "#FF8C42", borderRadius: 22 },
  belly:   { position: "absolute", bottom: 2, left: 13, width: 18, height: 18, borderRadius: 9, backgroundColor: "#FFD4A8" },
  head:    { position: "absolute", top: 0, left: 6, width: 50, height: 40, backgroundColor: "#FF8C42", borderTopLeftRadius: 25, borderTopRightRadius: 25, borderBottomLeftRadius: 19, borderBottomRightRadius: 19 },
  ear:     { position: "absolute", top: -9, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 18, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#FF8C42" },
  earL:    { left: 7 },
  earR:    { right: 7 },
  earIn:   { position: "absolute", top: 5, left: -5, width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 12, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#FFD4A8" },
  eye:     { position: "absolute", top: 13, width: 8, height: 8, borderRadius: 4, backgroundColor: "#2D2D2D" },
  eyeL:    { left: 10 },
  eyeR:    { right: 10 },
  shine:   { position: "absolute", top: 2, right: 1, width: 3, height: 3, borderRadius: 2, backgroundColor: "#fff" },
  nose:    { position: "absolute", top: 22, left: 21, width: 6, height: 5, borderRadius: 3, backgroundColor: "#2D2D2D" },
  cheek:   { position: "absolute", top: 20, width: 9, height: 6, borderRadius: 4, backgroundColor: "#FF6B6B", opacity: 0.5 },
  cheekL:  { left: 5 },
  cheekR:  { right: 5 },
});

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

  const headerFade   = useRef(new Animated.Value(0)).current;
  const headerSlide  = useRef(new Animated.Value(-20)).current;
  const mascotBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, friction: 7,   useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(mascotBounce, { toValue: -7, duration: 1100, useNativeDriver: true }),
        Animated.timing(mascotBounce, { toValue: 0,  duration: 1100, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const setValue = (key: keyof FormType, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    const user     = await AsyncStorage.getItem("currentUser");
    let profiles   = JSON.parse((await AsyncStorage.getItem("profiles")) || "{}");
    profiles[user!] = form;
    await AsyncStorage.setItem("profiles", JSON.stringify(profiles));
    await AsyncStorage.setItem(`isFirstTime_${user}`, "false");
    router.replace("/user-selection");
  };

  const yesCount = Object.entries(form).filter(
    ([k, v]) => v === true && k !== "hasFavoriteTheme"
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={T.purple} />

      {/* ── Purple Header ── */}
      <Animated.View style={[styles.header, {
        opacity: headerFade,
        transform: [{ translateY: headerSlide }],
      }]}>
        {/* Scatter decorations */}
        <TwinkleDot top={14} left={14}          color={T.yellow} size={10} diamond />
        <TwinkleDot top={40} left={38}          color={T.coral}  size={7} />
        <TwinkleDot top={18} left={width - 40}  color={T.mint}   size={8} />
        <TwinkleDot top={46} left={width - 66}  color={T.teal}   size={6} />
        <TwinkleDot top={8}  left={width * 0.4} color={T.yellow} size={5} />

        {/* Fox + bubble */}
        <View style={styles.mascotRow}>
          <Animated.View style={{ transform: [{ translateY: mascotBounce }] }}>
            <FoxMascot />
          </Animated.View>
          <View style={styles.bubble}>
            <View style={styles.bubbleTail} />
            <Text style={styles.bubbleText}>{"Let's set\nthings up!"}</Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>Set Up for Your Child 💜</Text>
        <Text style={styles.headerSub}>Help us personalise their experience</Text>

        {/* Progress pill */}
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>
            {yesCount} preference{yesCount !== 1 ? "s" : ""} selected ✨
          </Text>
        </View>

        {/* Wave */}
        <Svg width={width} height={28} viewBox={`0 0 ${width} 28`} preserveAspectRatio="none" style={{ marginTop: 10 }}>
          <Path d={`M0 28 Q${width * 0.25} 0 ${width * 0.5} 14 Q${width * 0.75} 28 ${width} 8 L${width} 28Z`} fill={T.bg} />
        </Svg>
      </Animated.View>

      {/* ── Scroll body ── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section) => (
          <View key={section.title} style={[styles.sectionWrap, { borderColor: section.accent + "44" }]}>
            <View style={[styles.sectionHeader, { backgroundColor: section.color }]}>
              <Text style={styles.sectionEmoji}>{section.emoji}</Text>
              <Text style={[styles.sectionTitle, { color: section.accent }]}>{section.title}</Text>
            </View>

            {section.questions.map((q) => (
              <QuestionCard
                key={q.valueKey}
                label={q.label}
                icon={q.icon}
                value={form[q.valueKey as keyof FormType] as boolean}
                onYes={() => setValue(q.valueKey as keyof FormType, true)}
                onNo={() => setValue(q.valueKey as keyof FormType, false)}
                accentColor={section.accent}
              />
            ))}
          </View>
        ))}

        {/* Fine Tuning sliders */}
        <View style={[styles.sectionWrap, { borderColor: T.coral + "44" }]}>
          <View style={[styles.sectionHeader, { backgroundColor: T.coralLight }]}>
            <Text style={styles.sectionEmoji}>🎛️</Text>
            <Text style={[styles.sectionTitle, { color: T.coral }]}>Fine Tuning</Text>
          </View>

          {/* Brightness */}
          <View style={styles.sliderCard}>
            <View style={styles.sliderLabelRow}>
              <Text style={styles.sliderIcon}>☀️</Text>
              <Text style={styles.sliderLabel}>Screen Brightness</Text>
              <View style={[styles.sliderBadge, { backgroundColor: T.yellowLight }]}>
                <Text style={[styles.sliderBadgeText, { color: "#7A5200" }]}>
                  {Math.round(form.brightnessLevel * 100)}%
                </Text>
              </View>
            </View>
            <Slider
              minimumValue={0.5}
              maximumValue={1}
              step={0.05}
              value={form.brightnessLevel}
              onValueChange={(val) => setValue("brightnessLevel", val)}
              minimumTrackTintColor={T.yellow}
              maximumTrackTintColor={T.purpleLight}
              thumbTintColor={T.yellow}
              style={{ height: 40 }}
            />
            <View style={styles.sliderEndRow}>
              <Text style={styles.sliderEndText}>🌙 Dim</Text>
              <Text style={styles.sliderEndText}>☀️ Bright</Text>
            </View>
          </View>

          {/* Text Scale */}
          <View style={styles.sliderCard}>
            <View style={styles.sliderLabelRow}>
              <Text style={styles.sliderIcon}>🔡</Text>
              <Text style={styles.sliderLabel}>Text Size</Text>
              <View style={[styles.sliderBadge, { backgroundColor: T.purpleLight }]}>
                <Text style={[styles.sliderBadgeText, { color: T.purple }]}>
                  {form.textScale.toFixed(1)}×
                </Text>
              </View>
            </View>
            <Slider
              minimumValue={1}
              maximumValue={2}
              step={0.1}
              value={form.textScale}
              onValueChange={(val) => setValue("textScale", val)}
              minimumTrackTintColor={T.purple}
              maximumTrackTintColor={T.purpleLight}
              thumbTintColor={T.purple}
              style={{ height: 40 }}
            />
            <Text style={[styles.previewText, { fontSize: 14 * form.textScale, color: T.text }]}>
              The quick brown fox 🦊
            </Text>
            <View style={styles.sliderEndRow}>
              <Text style={styles.sliderEndText}>A Normal</Text>
              <Text style={styles.sliderEndText}>A Large</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Overlays */}
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(0,0,0,${(1 - form.brightnessLevel) * 0.5})` }]}
      />
      {form.useWarmColors && (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,220,120,0.22)" }]} />
      )}

      {/* Save button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.88}>
          <Text style={styles.saveText}>Save & Continue 🚀</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Question Card ─────────────────────────────────────────────
function QuestionCard({ label, icon, value, onYes, onNo, accentColor }: {
  label: string; icon: string; value: boolean;
  onYes: () => void; onNo: () => void; accentColor: string;
}) {
  return (
    <View style={styles.questionCard}>
      <View style={styles.questionRow}>
        <Text style={styles.questionIcon}>{icon}</Text>
        <Text style={styles.questionLabel}>{label}</Text>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.optionBtn, value === true && { backgroundColor: accentColor, borderColor: accentColor }]}
          onPress={onYes} activeOpacity={0.8}
        >
          <Text style={[styles.optionIcon, value === true && { transform: [{ scale: 1.3 }] }]}>
            {value === true ? "✅" : "👍"}
          </Text>
          <Text style={[styles.optionText, value === true && styles.optionTextActive]}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionBtn, value === false && { backgroundColor: T.coral, borderColor: T.coral }]}
          onPress={onNo} activeOpacity={0.8}
        >
          <Text style={[styles.optionIcon, value === false && { transform: [{ scale: 1.3 }] }]}>
            {value === false ? "❌" : "👎"}
          </Text>
          <Text style={[styles.optionText, value === false && styles.optionTextActive]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  // Header
  header: {
    backgroundColor: T.purple,
    paddingTop: 48, paddingHorizontal: 20, paddingBottom: 0,
  },
  mascotRow:   { flexDirection: "row", alignItems: "flex-end", marginBottom: 10 },
  bubble: {
    backgroundColor: T.white, borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 8,
    marginLeft: 10, position: "relative",
  },
  bubbleTail: {
    position: "absolute", left: -7, top: 12,
    width: 0, height: 0,
    borderTopWidth: 6, borderBottomWidth: 6, borderRightWidth: 7,
    borderTopColor: "transparent", borderBottomColor: "transparent",
    borderRightColor: T.white,
  },
  bubbleText:   { fontSize: 12, fontWeight: "700", color: "#5B3FCC", lineHeight: 17 },
  headerTitle:  { fontSize: 22, fontWeight: "900", color: T.white, lineHeight: 28 },
  headerSub:    { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4, marginBottom: 10 },

  progressPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.3)",
  },
  progressText: { fontSize: 12, fontWeight: "800", color: T.white },

  // Scroll body
  scrollContent: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 20 },

  // Section
  sectionWrap: {
    borderRadius: 20, borderWidth: 1.5,
    backgroundColor: T.white, marginBottom: 14,
    overflow: "hidden",
    shadowColor: T.purple, shadowOpacity: 0.07,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  sectionEmoji: { fontSize: 20 },
  sectionTitle: { fontSize: 15, fontWeight: "900", letterSpacing: 0.2 },

  // Question card
  questionCard: {
    paddingHorizontal: 14, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: T.border,
  },
  questionRow:  { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  questionIcon: { fontSize: 18 },
  questionLabel:{ flex: 1, fontSize: 14, fontWeight: "700", color: T.text, lineHeight: 20 },

  optionRow: { flexDirection: "row", gap: 10 },
  optionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: 10, borderRadius: 14,
    backgroundColor: T.purpleLight, borderWidth: 2, borderColor: T.purpleMid,
  },
  optionIcon:       { fontSize: 16 },
  optionText:       { fontSize: 14, fontWeight: "800", color: T.textMid },
  optionTextActive: { color: T.white },

  // Slider
  sliderCard: {
    paddingHorizontal: 14, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: T.border,
  },
  sliderLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  sliderIcon:     { fontSize: 18 },
  sliderLabel:    { flex: 1, fontSize: 14, fontWeight: "800", color: T.text },
  sliderBadge:    { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  sliderBadgeText:{ fontSize: 12, fontWeight: "900" },
  sliderEndRow:   { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  sliderEndText:  { fontSize: 11, color: T.textSoft, fontWeight: "700" },
  previewText:    { textAlign: "center", fontWeight: "700", marginVertical: 8 },

  // Save
  saveContainer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingBottom: 28, paddingTop: 12,
    backgroundColor: "rgba(245,240,255,0.96)",
    borderTopWidth: 1, borderTopColor: T.border,
  },
  saveBtn: {
    backgroundColor: T.purple, borderRadius: 22, paddingVertical: 16,
    alignItems: "center",
    shadowColor: T.purple, shadowOpacity: 0.45, shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 }, elevation: 10,
  },
  saveText: { color: T.white, fontWeight: "900", fontSize: 17, letterSpacing: 0.3 },
});
