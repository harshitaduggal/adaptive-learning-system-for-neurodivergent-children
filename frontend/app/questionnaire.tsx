import AsyncStorage from "@react-native-async-storage/async-storage";
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
import Svg, { Circle, Defs, Ellipse, Path, Polygon, RadialGradient, Stop } from "react-native-svg";
import * as ScreenOrientation from "expo-screen-orientation";

const { width } = Dimensions.get("window");

// ─── Night-Sky Design Tokens (matching AuthScreen) ─────────────
const T = {
  // Night sky (header) palette
  bg:          "#1A0A4C",
  bgMid:       "#2D1275",
  orb1:        "#5B21B6",
  orb2:        "#4C1D95",
  purple:      "#7C3AED",
  purpleLight: "#A78BFA",
  cardBorder:  "rgba(196,181,253,0.3)",
  white:       "#FFFFFF",
  textHigh:    "#F3E8FF",
  textMid:     "#DDD6FE",
  textSoft:    "#A78BFA",
  textDim:     "rgba(196,181,253,0.6)",
  error:       "#F87171",
  success:     "#34D399",
  // Body palette
  bodyBg:      "#F5F0FF",
  text:        "#1A1A3E",
  textBody:    "#5A5A8A",
  border:      "#EAE4FF",
  optionBg:    "#EDE8FF",
  optionBorder:"#C4B8FF",
  // Section accents
  teal:        "#06D6A0",
  coral:       "#FF6B6B",
  yellow:      "#FFD166",
  yellowAccent:"#C68A00",
};

// ─── Section groups ─────────────────────────────────────────────
const SECTIONS = [
  {
    title: "Senses & Comfort", emoji: "🌿",
    color: "#E0FBF4", accent: T.teal,
    questions: [
      { label: "Bothered by loud sounds?",      valueKey: "soundSensitive",     icon: "" },
      { label: "Distracted by visual clutter?",  valueKey: "clutterSensitive",   icon: "" },
      { label: "Sensitive to animations?",       valueKey: "animationSensitive", icon: "" },
      { label: "Bothered by motion effects?",    valueKey: "motionSensitive",    icon: "" },
    ],
  },
  {
    title: "Communication", emoji: "",
    color: "#EDE8FF", accent: T.purple,
    questions: [
      { label: "Prefers pictures over words?",        valueKey: "prefersPictures",      icon: "" },
      { label: "Needs extra time to respond?",         valueKey: "needsResponseTime",    icon: "" },
      { label: "Repeats words or phrases often?",      valueKey: "hasEcholalia",         icon: "" },
      { label: "Struggles with back-and-forth chat?",  valueKey: "socialChatDifficulty", icon: "" },
    ],
  },
  {
    title: "Routine & Focus", emoji: "",
    color: "#FFF6D6", accent: T.yellowAccent,
    questions: [
      { label: "Gets upset when routines change?",     valueKey: "routineDependent",     icon: "" },
      { label: "Has strong special interests?",         valueKey: "specialInterests",     icon: "" },
      { label: "Difficulty switching between tasks?",   valueKey: "taskSwitchDifficulty", icon: "" },
      { label: "Benefits from visual schedules?",       valueKey: "usesVisualSchedule",   icon: "" },
    ],
  },
  {
    title: "App Experience", emoji: "",
    color: "#FFF0EF", accent: T.coral,
    questions: [
      { label: "Reduce animations?",   valueKey: "reduceAnimations",   icon: "" },
      { label: "Minimal UI layout?",   valueKey: "minimalMode",        icon: "" },
      { label: "Mute all sounds?",     valueKey: "muteSounds",         icon: "" },
      { label: "Needs high contrast?", valueKey: "needsHighContrast",  icon: "" },
    ],
  },
];

// ─── Sparkle (from AuthScreen) ──────────────────────────────────
function Sparkle({ size, top, left, delay = 0 }: { size: number; top: number; left: number; delay?: number }) {
  const anim = useRef(new Animated.Value(0.2)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: 0.85, duration: 1300, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.15, duration: 1300, useNativeDriver: true }),
      ])).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);
  const h = size * 0.25;
  const s = size;
  return (
    <Animated.View style={{ position: "absolute", top, left, opacity: anim }}>
      <Svg width={s * 2} height={s * 2} viewBox={`0 0 ${s * 2} ${s * 2}`}>
        <Path
          d={`M${s} 0 L${s + h} ${s - h} L${s * 2} ${s} L${s + h} ${s + h} L${s} ${s * 2} L${s - h} ${s + h} L0 ${s} L${s - h} ${s - h} Z`}
          fill="#FFFFFF"
        />
      </Svg>
    </Animated.View>
  );
}

// ─── Night Header Background (orbs + crescent from AuthScreen) ──
function NightHeaderBg() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={{ position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: T.orb1, top: -60, left: -60, opacity: 0.5 }} />
      <View style={{ position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: T.orb2, top: -40, right: -50, opacity: 0.4 }} />
      <View style={{ position: "absolute", width: 100, height: 100, borderRadius: 50, backgroundColor: T.purple, bottom: 10, left: "35%", opacity: 0.15 }} />
      {/* crescent */}
      <View style={{ position: "absolute", top: 12, left: "60%", opacity: 0.35 }}>
        <View style={{ width: 36, height: 36, overflow: "hidden" }}>
          <View style={{ position: "absolute", width: 36, height: 36, borderRadius: 18, backgroundColor: "#C4B5FD" }} />
          <View style={{ position: "absolute", width: 28, height: 28, borderRadius: 14, backgroundColor: "#1E0A4C", top: -2, left: 8 }} />
        </View>
      </View>
      {/* Sparkles */}
      <Sparkle size={5} top={18}  left={20}           delay={0}   />
      <Sparkle size={7} top={10}  left={width * 0.72} delay={300} />
      <Sparkle size={4} top={55}  left={width * 0.55} delay={600} />
      <Sparkle size={6} top={40}  left={width - 28}   delay={150} />
      <Sparkle size={3} top={80}  left={10}            delay={900} />
      <Sparkle size={5} top={30}  left={width * 0.38} delay={450} />
    </View>
  );
}

// ─── Star Mascot (from AuthScreen) ─────────────────────────────
function StarMascot() {
  const bobY     = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(bobY, { toValue: -7, duration: 1100, useNativeDriver: true }),
      Animated.timing(bobY, { toValue: 0,  duration: 1100, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1,   duration: 900, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
    ])).start();
  }, []);
  const starPath = (() => {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const rad = i % 2 === 0 ? 28 : 12;
      pts.push(`${34 + rad * Math.cos(angle)},${34 + rad * Math.sin(angle)}`);
    }
    return pts.join(" ");
  })();
  return (
    <Animated.View style={{ transform: [{ translateY: bobY }] }}>
      <View style={{ width: 68, height: 68, alignItems: "center", justifyContent: "center" }}>
        <Animated.View style={{
          position: "absolute", width: 68, height: 68, borderRadius: 34, backgroundColor: "#FFD740",
          opacity: glowAnim,
          transform: [{ scale: glowAnim.interpolate({ inputRange: [0.4, 1], outputRange: [1, 1.35] }) }],
        }} />
        <Svg width={68} height={68} viewBox="0 0 68 68">
          <Defs>
            <RadialGradient id="qsG" cx="42%" cy="30%" rx="60%" ry="60%">
              <Stop offset="0%"   stopColor="#FFE877" />
              <Stop offset="55%"  stopColor="#FFD166" />
              <Stop offset="100%" stopColor="#E8A800" />
            </RadialGradient>
          </Defs>
          <Polygon points={starPath} fill="#B87D00" opacity={0.18} transform="translate(1.5,3)" />
          <Polygon points={starPath} fill="url(#qsG)" />
          <Ellipse cx={26} cy={23} rx={6} ry={3.5} fill="rgba(255,255,255,0.5)" transform="rotate(-25,26,23)" />
          <Ellipse cx={27} cy={33} rx={3} ry={3.5} fill="#2D1B69" />
          <Ellipse cx={41} cy={33} rx={3} ry={3.5} fill="#2D1B69" />
          <Circle cx={28.3} cy={31.5} r={1} fill="#fff" />
          <Circle cx={42.3} cy={31.5} r={1} fill="#fff" />
          <Path d="M27 40 Q34 46 41 40" stroke="#2D1B69" strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <Ellipse cx={21} cy={38} rx={3.5} ry={2.5} fill="#FF9EC4" opacity={0.5} />
          <Ellipse cx={47} cy={38} rx={3.5} ry={2.5} fill="#FF9EC4" opacity={0.5} />
        </Svg>
      </View>
    </Animated.View>
  );
}

// ─── Speech Bubble ──────────────────────────────────────────────
function SpeechBubble({ text }: { text: string }) {
  return (
    <View style={bub.wrap}>
      <View style={bub.tail} />
      <Text style={bub.text}>{text}</Text>
    </View>
  );
}
const bub = StyleSheet.create({
  wrap: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, marginLeft: 10, maxWidth: 160, borderWidth: 1, borderColor: "rgba(196,181,253,0.3)" },
  tail: { position: "absolute", left: -7, top: 14, width: 0, height: 0, borderTopWidth: 6, borderBottomWidth: 6, borderRightWidth: 7, borderTopColor: "transparent", borderBottomColor: "transparent", borderRightColor: "rgba(255,255,255,0.1)" },
  text: { fontSize: 12, fontWeight: "700", color: "#F3E8FF", lineHeight: 17 },
});

// ─── Main Screen ────────────────────────────────────────────────
export default function QuestionnaireScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    soundSensitive: false,
    clutterSensitive: false,
    animationSensitive: false,
    motionSensitive: false,
    prefersPictures: false,
    needsResponseTime: false,
    hasEcholalia: false,
    socialChatDifficulty: false,
    routineDependent: false,
    specialInterests: false,
    taskSwitchDifficulty: false,
    usesVisualSchedule: false,
    reduceAnimations: false,
    minimalMode: false,
    muteSounds: false,
    needsHighContrast: false,
  });

  type FormType = typeof form;

  const headerFade   = useRef(new Animated.Value(0)).current;
  const headerSlide  = useRef(new Animated.Value(-20)).current;
  const mascotBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    return () => { ScreenOrientation.unlockAsync(); };
  }, []);

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
    router.replace("/parenthome");
  };

  const yesCount = Object.entries(form).filter(
    ([k, v]) => v === true && k !== "hasFavoriteTheme"
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />

      {/* ── Night-Sky Header (matching AuthScreen) ── */}
      <Animated.View style={[styles.header, {
        opacity: headerFade,
        transform: [{ translateY: headerSlide }],
      }]}>
        {/* Night sky background with orbs + sparkles */}
        <NightHeaderBg />

        {/* Star mascot + bubble */}
        <View style={styles.mascotRow}>
          <Animated.View style={{ transform: [{ translateY: mascotBounce }] }}>
            <StarMascot />
          </Animated.View>
          <SpeechBubble text={"Let's set\nthings up!"} />
        </View>

        <Text style={styles.headerTitle}>Set Up for Your Child</Text>
        <Text style={styles.headerSub}>Help us personalise their experience</Text>

        {/* Progress pill */}
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>
            {yesCount} preference{yesCount !== 1 ? "s" : ""} selected
          </Text>
        </View>

        {/* Wave transition to body */}
        <Svg width={width} height={28} viewBox={`0 0 ${width} 28`} preserveAspectRatio="none" style={{ marginTop: 10 }}>
          <Path d={`M0 28 Q${width * 0.25} 0 ${width * 0.5} 14 Q${width * 0.75} 28 ${width} 8 L${width} 28Z`} fill={T.bodyBg} />
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

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Save button ── */}
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.88}>
          <Text style={styles.saveText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Question Card ──────────────────────────────────────────────
function QuestionCard({ label, icon, value, onYes, onNo, accentColor }: {
  label: string; icon: string; value: boolean;
  onYes: () => void; onNo: () => void; accentColor: string;
}) {
  return (
    <View style={styles.questionCard}>
      <View style={styles.questionRow}>
        <Text style={styles.questionLabel}>{label}</Text>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.optionBtn, value === true && { backgroundColor: accentColor, borderColor: accentColor }]}
          onPress={onYes} activeOpacity={0.8}
        >
          <Text style={[styles.optionText, value === true && styles.optionTextActive]}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionBtn, value === false && { backgroundColor: T.coral, borderColor: T.coral }]}
          onPress={onNo} activeOpacity={0.8}
        >
          <Text style={[styles.optionText, value === false && styles.optionTextActive]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bodyBg },

  // Header — night-sky purple matching AuthScreen
  header: {
    backgroundColor: T.bg,
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 0,
    overflow: "hidden",
  },
  mascotRow:  { flexDirection: "row", alignItems: "flex-end", marginBottom: 10 },
  headerTitle:{ fontSize: 22, fontWeight: "900", color: T.textHigh, lineHeight: 28 },
  headerSub:  { fontSize: 12, color: T.textDim, marginTop: 4, marginBottom: 10 },

  progressPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(167,139,250,0.18)",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1.5, borderColor: T.cardBorder,
  },
  progressText: { fontSize: 12, fontWeight: "800", color: T.textHigh },

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
  sectionTitle: { fontSize: 15, fontWeight: "900", letterSpacing: 0.2 },

  // Question card
  questionCard: {
    paddingHorizontal: 14, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: T.border,
  },
  questionRow:   { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  questionLabel: { flex: 1, fontSize: 14, fontWeight: "700", color: T.text, lineHeight: 20 },

  optionRow: { flexDirection: "row", gap: 10 },
  optionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: 10, borderRadius: 14,
    backgroundColor: T.optionBg, borderWidth: 2, borderColor: T.optionBorder,
  },
  optionText:       { fontSize: 14, fontWeight: "800", color: T.textBody },
  optionTextActive: { color: T.white },

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
    shadowColor: T.purple, shadowOpacity: 0.55, shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 }, elevation: 10,
  },
  saveText: { color: T.white, fontWeight: "900", fontSize: 17, letterSpacing: 0.3 },
});
