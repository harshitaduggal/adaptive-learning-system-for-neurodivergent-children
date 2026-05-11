import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const { width: SW, height: SH } = Dimensions.get("window");

/* ══════════════════════════════════════════════
   COLORS
══════════════════════════════════════════════ */
const C = {
  // Night-sky hero (matching AuthScreen)
  heroBg:      "#1A0A4C",
  heroMid:     "#2D1275",
  heroOrb1:    "#5B21B6",
  heroOrb2:    "#4C1D95",
  purple:      "#7C3AED",
  purpleLight: "#A78BFA",
  cardBorder:  "rgba(196,181,253,0.3)",
  textHigh:    "#F3E8FF",
  textDim:     "rgba(196,181,253,0.6)",
  // Body / card colors
  teal:        "#2BB3B1",
  tealPale:    "#D8F5F4",
  peach:       "#FF8C69",
  peachPale:   "#FFE8DF",
  yellow:      "#FFB830",
  yellowPale:  "#FFF3D0",
  pink:        "#FF6B9D",
  pinkPale:    "#FFE0EC",
  bg:          "#F4F0FF",
  white:       "#FFFFFF",
  dark:        "#1E1245",
  mid:         "#6B5A9E",
  muted:       "#A89DC8",
  purplePale:  "#EDE8FF",
};

/* ══════════════════════════════════════════════
   SPARKLE — night-sky decoration (from AuthScreen)
══════════════════════════════════════════════ */
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
    <Animated.View style={{ position: "absolute", top, left, opacity: anim, zIndex: 2 }}>
      <Svg width={s * 2} height={s * 2} viewBox={`0 0 ${s * 2} ${s * 2}`}>
        <Path
          d={`M${s} 0 L${s + h} ${s - h} L${s * 2} ${s} L${s + h} ${s + h} L${s} ${s * 2} L${s - h} ${s + h} L0 ${s} L${s - h} ${s - h} Z`}
          fill="#FFFFFF"
        />
      </Svg>
    </Animated.View>
  );
}

/* ══════════════════════════════════════════════
   HERO BACKGROUND — starry night theme
══════════════════════════════════════════════ */
function HeroBg() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Deep purple gradient base via SVG */}
      <Svg
        width="100%"
        height={HERO_H}
        viewBox={`0 0 ${SW} ${HERO_H}`}
        style={StyleSheet.absoluteFill}
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="heroNightG" x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor="#1A0A4C" />
            <Stop offset="1" stopColor="#2D1275" />
          </LinearGradient>
        </Defs>
        <Rect width={SW} height={HERO_H + 20} fill="url(#heroNightG)" />
        {/* Wave bottom */}
        <Path
          d={`M0 ${HERO_H - 28} Q${SW * 0.25} ${HERO_H - 52} ${SW * 0.5} ${HERO_H - 30} Q${SW * 0.75} ${HERO_H - 8} ${SW} ${HERO_H - 36} L${SW} ${HERO_H + 20} L0 ${HERO_H + 20} Z`}
          fill={C.bg}
        />
      </Svg>

      {/* Orbs */}
      <View style={{ position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: C.heroOrb1, top: -60, left: -60, opacity: 0.45 }} />
      <View style={{ position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: C.heroOrb2, top: -30, right: -50, opacity: 0.38 }} />
      <View style={{ position: "absolute", width: 90, height: 90, borderRadius: 45, backgroundColor: C.purple, top: "45%", left: "20%", opacity: 0.14 }} />

      {/* Crescent moon */}
      <View style={{ position: "absolute", top: 14, left: "58%", opacity: 0.35 }}>
        <View style={{ width: 36, height: 36, overflow: "hidden" }}>
          <View style={{ position: "absolute", width: 36, height: 36, borderRadius: 18, backgroundColor: "#C4B5FD" }} />
          <View style={{ position: "absolute", width: 28, height: 28, borderRadius: 14, backgroundColor: "#1E0A4C", top: -2, left: 8 }} />
        </View>
      </View>

      {/* Sparkles */}
      <Sparkle size={5} top={18}  left={18}           delay={0}   />
      <Sparkle size={7} top={12}  left={SW * 0.76}    delay={300} />
      <Sparkle size={4} top={60}  left={SW * 0.58}    delay={600} />
      <Sparkle size={6} top={44}  left={SW - 26}      delay={150} />
      <Sparkle size={3} top={90}  left={12}            delay={900} />
      <Sparkle size={5} top={32}  left={SW * 0.38}    delay={450} />
      <Sparkle size={4} top={72}  left={SW * 0.82}    delay={700} />
    </View>
  );
}

/* ══════════════════════════════════════════════
   BUNNY MASCOT
══════════════════════════════════════════════ */
function BunnyMascot({ size = 52 }: { size?: number }) {
  return (
    <Svg width={size} height={(size * 80) / 72} viewBox="0 0 72 80">
      <Defs>
        <LinearGradient id="bG2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E8DEFF" />
        </LinearGradient>
      </Defs>
      <Ellipse cx={22} cy={22} rx={8}  ry={18} fill="#F0E8FF" />
      <Ellipse cx={22} cy={22} rx={4}  ry={12} fill="#C9B0F7" />
      <Ellipse cx={50} cy={22} rx={8}  ry={18} fill="#F0E8FF" />
      <Ellipse cx={50} cy={22} rx={4}  ry={12} fill="#C9B0F7" />
      <Ellipse cx={36} cy={57} rx={22} ry={20} fill="url(#bG2)" />
      <Circle cx={36} cy={40} r={20}   fill="#FFFFFF" />
      <Circle cx={28} cy={38} r={4}    fill="#5B3EA0" />
      <Circle cx={44} cy={38} r={4}    fill="#5B3EA0" />
      <Circle cx={29} cy={37} r={1.5}  fill="#FFFFFF" />
      <Circle cx={45} cy={37} r={1.5}  fill="#FFFFFF" />
      <Ellipse cx={36} cy={44} rx={3}  ry={2}  fill="#FFB3C6" />
      <Circle cx={23} cy={44} r={5}    fill="#FFD6E0" opacity={0.5} />
      <Circle cx={49} cy={44} r={5}    fill="#FFD6E0" opacity={0.5} />
      <Ellipse cx={36} cy={58} rx={12} ry={10} fill="#F0E8FF" />
    </Svg>
  );
}

/* ─── Card icon SVGs ─────────────────────────────────────── */
function IconGamepad({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 28 28">
      <Rect x={2} y={8} width={24} height={14} rx={6} stroke={color} strokeWidth={2} fill="none" />
      <Path d="M9 13 L9 17 M7 15 L11 15" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={18} cy={13} r={1.5} fill={color} />
      <Circle cx={21} cy={16} r={1.5} fill={color} />
    </Svg>
  );
}

function IconChart({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 28 28">
      <Rect x={4} y={16} width={5} height={8}  rx={2} fill={color} opacity={0.7} />
      <Rect x={11} y={10} width={5} height={14} rx={2} fill={color} />
      <Rect x={18} y={4}  width={5} height={20} rx={2} fill={color} opacity={0.7} />
    </Svg>
  );
}

function IconBook({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 28 28">
      <Path d="M6 5 L6 23 Q14 20 22 23 L22 5 Q14 8 6 5 Z" stroke={color} strokeWidth={2} fill="none" strokeLinejoin="round" />
      <Path d="M14 8 L14 20" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M9 10 Q14 8.5 19 10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M9 13 Q14 11.5 19 13" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function IconChild({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 28 28">
      <Circle cx={14} cy={9} r={5.5} stroke={color} strokeWidth={2} fill="none" />
      <Path d="M5 24 C5 18.5 9 15.5 14 15.5 C19 15.5 23 18.5 23 24" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Circle cx={14} cy={9} r={2} fill={color} opacity={0.4} />
    </Svg>
  );
}

function IconSettings({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 28 28">
      <Circle cx={14} cy={14} r={4} stroke={color} strokeWidth={2} fill="none" />
      <Path d="M14 2 L14 5 M14 23 L14 26 M2 14 L5 14 M23 14 L26 14 M5.7 5.7 L7.8 7.8 M20.2 20.2 L22.3 22.3 M22.3 5.7 L20.2 7.8 M7.8 20.2 L5.7 22.3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ArrowRight({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16">
      <Path d="M3 8 L13 8 M9 4 L13 8 L9 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/* ══════════════════════════════════════════════
   ANIMATED CARD
══════════════════════════════════════════════ */
function AnimCard({ children, style, onPress, delay = 0 }: {
  children: React.ReactNode; style?: any; onPress?: () => void; delay?: number;
}) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 420, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 420, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePressIn  = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, friction: 8 }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, friction: 6 }).start();

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }, style]}>
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}
        activeOpacity={1} disabled={!onPress} style={{ flex: 1 }}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ══════════════════════════════════════════════
   TASK ROW
══════════════════════════════════════════════ */
function TaskRow({ label, done, color }: { label: string; done: boolean; color: string }) {
  return (
    <View style={trStyles.row}>
      <View style={[trStyles.dot, { backgroundColor: done ? color : "rgba(255,255,255,0.3)" }]}>
        {done && (
          <Svg width={10} height={10} viewBox="0 0 10 10">
            <Path d="M2 5 L4 7 L8 3" stroke="#FFF" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        )}
      </View>
      <Text style={[trStyles.label, done && trStyles.done]}>{label}</Text>
    </View>
  );
}
const trStyles = StyleSheet.create({
  row:   { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 7 },
  dot:   { width: 16, height: 16, borderRadius: 5, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.35)" },
  label: { fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: "500", flex: 1 },
  done:  { textDecorationLine: "line-through", opacity: 0.6 },
});

/* ══════════════════════════════════════════════
   LAYOUT CONSTANTS — fit everything on screen
══════════════════════════════════════════════ */
const SIDE_PAD   = 14;
const CARD_GAP   = 9;
const HERO_H     = 190;

// Cards must fit within SW minus padding
const TOTAL_W    = SW - SIDE_PAD * 2 - CARD_GAP;
const CARD_W_LG  = TOTAL_W * 0.62;
const CARD_W_SM  = TOTAL_W * 0.38;
const CARD_W_MD  = TOTAL_W / 2;

// Card heights — compact to prevent overflow on small screens
const CARD_H_ROW1 = Math.min(150, SH * 0.18);
const CARD_H_ROW2 = Math.min(160, SH * 0.19);
const CARD_H_ROW3 = Math.min(140, SH * 0.17);

/* ══════════════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════════════ */
export default function ParentHome() {
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "short", day: "numeric",
  });

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    return () => { ScreenOrientation.unlockAsync(); };
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.heroBg} />

      {/* ── Hero — starry night theme ── */}
      <View style={styles.hero}>
        <HeroBg />
        <View style={styles.heroInner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.heroTitle}>Parent Portal</Text>
            <Text style={styles.heroDate}>{today}</Text>
          </View>
          <BunnyMascot size={52} />
        </View>
      </View>

      {/* ── Scroll body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Row 1: Child Portal (full width) */}
        <View style={styles.bentoRow}>

          <AnimCard delay={60}
            style={[styles.bentoCard, { width: TOTAL_W, height: CARD_H_ROW1, backgroundColor: C.purple }]}
            onPress={() => router.push("/content")}
          >
            <View style={styles.cardInner}>
              <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
                <IconChild color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardLabel} numberOfLines={1}>Child Portal</Text>
                <Text style={styles.cardTitle} numberOfLines={1}>Open now</Text>
              </View>
              <View style={styles.arrowCircle}>
                <ArrowRight color={C.purple} />
              </View>
            </View>
            <View style={styles.cardOrb1} />
            <View style={styles.cardOrb2} />
          </AnimCard>

        </View>

        {/* Row 2: Game Setup (small) + Homework (large) */}
        <View style={styles.bentoRow}>

          <AnimCard delay={180}
            style={[styles.bentoCard, { width: CARD_W_SM, height: CARD_H_ROW2, backgroundColor: C.peach }]}
            onPress={() => router.push("/setupgames")}
          >
            <View style={styles.cardInnerCol}>
              <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                <IconGamepad color="#FFFFFF" />
              </View>
              <Text style={styles.cardLabel} numberOfLines={1}>Games</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>Setup</Text>
              <View style={styles.cardChip}>
                <Text style={styles.cardChipText}>Tap to edit</Text>
              </View>
            </View>
          </AnimCard>

          <AnimCard delay={240}
            style={[styles.bentoCard, { width: CARD_W_LG, height: CARD_H_ROW2, backgroundColor: C.pink }]}
            onPress={() => router.push("/parenthomework")}
          >
            <View style={styles.cardInnerCol}>
              <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <IconBook color="#FFFFFF" />
              </View>
              <Text style={styles.cardLabel} numberOfLines={1}>Assignments</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>Homework</Text>
            </View>
            <View style={styles.taskList}>
              <TaskRow label="Counting 1–20" done={true}  color="#FFFFFF" />
              <TaskRow label="Color shapes"   done={true}  color="#FFFFFF" />
              <TaskRow label="Story time"     done={false} color="#FFFFFF" />
            </View>
          </AnimCard>

        </View>

        {/* Row 3: Visualization + Child Settings */}
        <View style={styles.bentoRow}>

          <AnimCard delay={300}
            style={[styles.bentoCard, { width: CARD_W_MD, height: CARD_H_ROW3, backgroundColor: C.teal }]}
            onPress={() => router.push("/dashboard")}
          >
            <View style={styles.cardInnerCol}>
              <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
                <IconChart color="#FFFFFF" />
              </View>
              <Text style={styles.cardLabel} numberOfLines={1}>Boards</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>Visualization</Text>
              {/* mini bar chart */}
              <View style={vizStyles.bars}>
                {[40, 70, 55, 90, 65, 80].map((h, i) => (
                  <View key={i} style={[vizStyles.bar, { height: h * 0.3, opacity: 0.6 + i * 0.07 }]} />
                ))}
              </View>
            </View>
          </AnimCard>

          <AnimCard delay={360}
            style={[styles.bentoCard, { width: CARD_W_MD, height: CARD_H_ROW3, backgroundColor: C.yellow }]}
            onPress={() => router.push("/questionnaire")}
          >
            <View style={styles.cardInnerCol}>
              <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.28)" }]}>
                <IconSettings color="#FFFFFF" />
              </View>
              <Text style={styles.cardLabel} numberOfLines={1}>Child</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>Settings</Text>
              <View style={{ marginTop: 6, gap: 3 }}>
                {["Profile", "Difficulty", "Sound"].map((s) => (
                  <View key={s} style={settingStyles.row}>
                    <View style={settingStyles.dot} />
                    <Text style={settingStyles.label}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          </AnimCard>

        </View>


        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

/* ─── Viz bars ─────────────────── */
const vizStyles = StyleSheet.create({
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 4, marginTop: 8, height: 30 },
  bar:  { width: 11, backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 3 },
});

const settingStyles = StyleSheet.create({
  row:   { flexDirection: "row", alignItems: "center", gap: 5 },
  dot:   { width: 4, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.65)" },
  label: { fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: "500" },
});

/* ─── Main styles ──────────────── */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Hero — compact to leave room for cards
  hero: {
    height: HERO_H,
    position: "relative",
    overflow: "hidden",
  },
  heroInner: {
    position: "absolute",
    bottom: 42,
    left: SIDE_PAD,
    right: SIDE_PAD,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  greeting: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: "500", letterSpacing: 0.4, marginBottom: 2 },
  heroTitle: { fontSize: 24, fontWeight: "900", color: "#FFFFFF", letterSpacing: -0.5 },
  heroDate:  { fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 },

  // Scroll
  scroll:        { flex: 1, marginTop: -8 },
  scrollContent: { paddingHorizontal: SIDE_PAD, paddingTop: 14, paddingBottom: 20 },

  // Bento row
  bentoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: CARD_GAP },

  // Card base
  bentoCard: {
    borderRadius: 22,
    overflow: "hidden",
    padding: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 4,
  },

  // Card internals
  cardInner: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 8 },
  cardInnerCol: { flex: 1 },

  iconBubble: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: "center", justifyContent: "center", marginBottom: 7,
  },

  cardLabel: {
    fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: "600",
    textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 1, flexShrink: 1,
  },
  cardTitle: {
    fontSize: 16, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.2, flexShrink: 1,
  },

  cardChip: {
    marginTop: 8, backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 3, alignSelf: "flex-start",
  },
  cardChipText: { fontSize: 9, color: "#FFFFFF", fontWeight: "600" },

  arrowCircle: {
    width: 28, height: 28, borderRadius: 10, backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center", alignSelf: "flex-end",
  },

  // Decorative orbs inside child portal
  cardOrb1: {
    position: "absolute", width: 70, height: 70, borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.07)", bottom: -18, right: -18,
  },
  cardOrb2: {
    position: "absolute", width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.07)", bottom: 16, right: 22,
  },

  // Task list
  taskList: {
    marginTop: 8, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.2)",
  },

});