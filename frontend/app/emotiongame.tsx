import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  SafeAreaView,
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
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

// ─── Tokens ────────────────────────────────────────────────────────
const T = {
  purple:      "#4A2FD4",
  purpleDark:  "#2A1580",
  purpleLight: "#7B5EEA",
  purpleGhost: "rgba(74,47,212,0.08)",
  gold:        "#FFD166",
  goldDeep:    "#F5A623",
  goldSoft:    "#FFF4CC",
  coral:       "#FF5F6D",
  coralDark:   "#D93848",
  coralSoft:   "#FFE8EA",
  teal:        "#06D6A0",
  tealDark:    "#04A87E",
  tealSoft:    "#CFFAEF",
  sky:         "#48CAE4",
  skySoft:     "#D4F3FB",
  lilac:       "#C77DFF",
  lilacSoft:   "#F0DBFF",
  cream:       "#FFFDF6",
  white:       "#FFFFFF",
  text:        "#1A0E4E",
  textMid:     "#5B4A8A",
  textSoft:    "#A89CCE",
  border:      "#EDE0FF",
};

// ─── Emotion families ──────────────────────────────────────────────
const EMOTION_FAMILIES: Record<string, string[]> = {
  positive: ["Happy", "Excited", "Proud", "Grateful"],
  negative: ["Sad", "Angry", "Worried", "Scared"],
  neutral:  ["Surprised", "Confused", "Bored", "Calm"],
};
const ALL_EMOTIONS = Object.values(EMOTION_FAMILIES).flat();

// ─── Emotion → visual config ───────────────────────────────────────
// Each has a strong, vivid color pair so cards are always visible
const EMOTION_STYLE: Record<string, {
  color: string; bg: string; border: string;
  cardBg: string; cardBorder: string; textColor: string;
  mouth: string; brows: string;
}> = {
  Happy:    { color: "#FFB830", bg: "#FFF4CC", border: "#FFD166", cardBg: "#FFF4CC", cardBorder: "#F5A623", textColor: "#7A4800", mouth: "smile",   brows: "up"      },
  Excited:  { color: "#FF5F6D", bg: "#FFE8EA", border: "#FF5F6D", cardBg: "#FFE8EA", cardBorder: "#D93848", textColor: "#8A0010", mouth: "open",    brows: "up"      },
  Proud:    { color: "#7B5EEA", bg: "#EDE4FF", border: "#7B5EEA", cardBg: "#EDE4FF", cardBorder: "#4A2FD4", textColor: "#2A1580", mouth: "smirk",   brows: "neutral" },
  Grateful: { color: "#06D6A0", bg: "#CFFAEF", border: "#06D6A0", cardBg: "#CFFAEF", cardBorder: "#04A87E", textColor: "#005740", mouth: "smile",   brows: "soft"    },
  Sad:      { color: "#48CAE4", bg: "#D4F3FB", border: "#48CAE4", cardBg: "#D4F3FB", cardBorder: "#0099B8", textColor: "#004B5C", mouth: "frown",   brows: "sad"     },
  Angry:    { color: "#FF3D3D", bg: "#FFE0E0", border: "#FF3D3D", cardBg: "#FFE0E0", cardBorder: "#CC0000", textColor: "#700000", mouth: "frown",   brows: "angry"   },
  Worried:  { color: "#C77DFF", bg: "#F0DBFF", border: "#C77DFF", cardBg: "#F0DBFF", cardBorder: "#8B00E8", textColor: "#4B0080", mouth: "wavy",    brows: "worried" },
  Scared:   { color: "#FF9020", bg: "#FFF0D6", border: "#FFB830", cardBg: "#FFF0D6", cardBorder: "#E06800", textColor: "#7A3200", mouth: "open",    brows: "scared"  },
  Surprised:{ color: "#C77DFF", bg: "#F0DBFF", border: "#C77DFF", cardBg: "#F0DBFF", cardBorder: "#8B00E8", textColor: "#4B0080", mouth: "o",       brows: "up"      },
  Confused: { color: "#48CAE4", bg: "#D4F3FB", border: "#48CAE4", cardBg: "#D4F3FB", cardBorder: "#0099B8", textColor: "#004B5C", mouth: "wavy",    brows: "confused"},
  Bored:    { color: "#A89CCE", bg: "#EEEBF8", border: "#A89CCE", cardBg: "#EEEBF8", cardBorder: "#6B5AA0", textColor: "#3A2880", mouth: "flat",    brows: "low"     },
  Calm:     { color: "#06D6A0", bg: "#CFFAEF", border: "#06D6A0", cardBg: "#CFFAEF", cardBorder: "#04A87E", textColor: "#005740", mouth: "smile",   brows: "soft"    },
};

type GameItem = { image: { uri: string }; emotion: string; personName?: string };
type Mood     = "idle" | "happy" | "sad" | "thinking";

function shuffleArray<A>(arr: A[]): A[] { return [...arr].sort(() => Math.random() - 0.5); }
function familyOf(e: string) {
  for (const [f, list] of Object.entries(EMOTION_FAMILIES)) if (list.includes(e)) return f;
  return "neutral";
}
function buildOptions(correct: string, usedWrong: Set<string>): string[] {
  const fam   = familyOf(correct);
  const other = ALL_EMOTIONS.filter(e => e !== correct && familyOf(e) !== fam && !usedWrong.has(e));
  const sameF = ALL_EMOTIONS.filter(e => e !== correct && familyOf(e) === fam  && !usedWrong.has(e));
  return shuffleArray([correct, ...shuffleArray([...other, ...sameF]).slice(0, 2)]);
}

// ─── SVG Emotion Face ──────────────────────────────────────────────
function EmotionFace({ emotion, size = 48 }: { emotion: string; size?: number }) {
  const cfg = EMOTION_STYLE[emotion] ?? EMOTION_STYLE["Happy"];
  const s = size;
  const cx = s / 2, cy = s / 2, r = s * 0.46;
  const ex1 = cx - s * 0.15, ex2 = cx + s * 0.15, ey = cy - s * 0.07;
  const pr  = s * 0.08;
  const bry = ey - pr - s * 0.055;

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id={`efg_${emotion}`} cx="38%" cy="32%" r="65%">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
          <Stop offset="1" stopColor={cfg.bg} stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={r} fill={`url(#efg_${emotion})`} />
      <Circle cx={cx} cy={cy} r={r} stroke={cfg.color} strokeWidth={s * 0.045} fill="none" />
      {/* Cheeks */}
      <Circle cx={cx - s * 0.26} cy={cy + s * 0.05} r={s * 0.1} fill={cfg.color} opacity={0.22} />
      <Circle cx={cx + s * 0.26} cy={cy + s * 0.05} r={s * 0.1} fill={cfg.color} opacity={0.22} />
      {/* Eyes */}
      <Circle cx={ex1} cy={ey} r={pr * 1.2} fill="#fff" />
      <Circle cx={ex2} cy={ey} r={pr * 1.2} fill="#fff" />
      <Circle cx={ex1} cy={ey} r={pr * 0.75} fill={cfg.color} />
      <Circle cx={ex2} cy={ey} r={pr * 0.75} fill={cfg.color} />
      <Circle cx={ex1 + pr * 0.3} cy={ey - pr * 0.25} r={pr * 0.3} fill="#fff" />
      <Circle cx={ex2 + pr * 0.3} cy={ey - pr * 0.25} r={pr * 0.3} fill="#fff" />
      {/* Brows */}
      {cfg.brows === "neutral" && <>
        <Path d={`M${ex1-pr} ${bry} Q${ex1} ${bry-pr*0.5} ${ex1+pr} ${bry}`} stroke={cfg.color} strokeWidth={s*0.04} fill="none" strokeLinecap="round" />
        <Path d={`M${ex2-pr} ${bry} Q${ex2} ${bry-pr*0.5} ${ex2+pr} ${bry}`} stroke={cfg.color} strokeWidth={s*0.04} fill="none" strokeLinecap="round" />
      </>}
      {cfg.brows === "sad" && <>
        <Path d={`M${ex1-pr} ${bry-pr*0.5} Q${ex1} ${bry+pr*0.5} ${ex1+pr} ${bry-pr*0.2}`} stroke={cfg.color} strokeWidth={s*0.04} fill="none" strokeLinecap="round" />
        <Path d={`M${ex2-pr} ${bry-pr*0.2} Q${ex2} ${bry+pr*0.5} ${ex2+pr} ${bry-pr*0.5}`} stroke={cfg.color} strokeWidth={s*0.04} fill="none" strokeLinecap="round" />
      </>}
      {cfg.brows === "angry" && <>
        <Path d={`M${ex1-pr} ${bry-pr*0.3} L${ex1+pr} ${bry+pr*0.6}`} stroke={cfg.color} strokeWidth={s*0.055} fill="none" strokeLinecap="round" />
        <Path d={`M${ex2-pr} ${bry+pr*0.6} L${ex2+pr} ${bry-pr*0.3}`} stroke={cfg.color} strokeWidth={s*0.055} fill="none" strokeLinecap="round" />
      </>}
      {cfg.brows === "up" && <>
        <Path d={`M${ex1-pr} ${bry-pr*0.6} Q${ex1} ${bry-pr*1.1} ${ex1+pr} ${bry-pr*0.6}`} stroke={cfg.color} strokeWidth={s*0.04} fill="none" strokeLinecap="round" />
        <Path d={`M${ex2-pr} ${bry-pr*0.6} Q${ex2} ${bry-pr*1.1} ${ex2+pr} ${bry-pr*0.6}`} stroke={cfg.color} strokeWidth={s*0.04} fill="none" strokeLinecap="round" />
      </>}
      {cfg.brows === "worried" && <>
        <Path d={`M${ex1-pr} ${bry-pr*0.5} Q${ex1} ${bry+pr*0.2} ${ex1+pr} ${bry-pr*0.5}`} stroke={cfg.color} strokeWidth={s*0.04} fill="none" strokeLinecap="round" />
        <Path d={`M${ex2-pr} ${bry-pr*0.5} Q${ex2} ${bry+pr*0.2} ${ex2+pr} ${bry-pr*0.5}`} stroke={cfg.color} strokeWidth={s*0.04} fill="none" strokeLinecap="round" />
      </>}
      {cfg.brows === "confused" && <>
        <Path d={`M${ex1-pr} ${bry-pr*0.2} L${ex1+pr} ${bry-pr*0.6}`} stroke={cfg.color} strokeWidth={s*0.042} fill="none" strokeLinecap="round" />
        <Path d={`M${ex2-pr} ${bry-pr*0.6} Q${ex2} ${bry+pr*0.3} ${ex2+pr} ${bry-pr*0.3}`} stroke={cfg.color} strokeWidth={s*0.042} fill="none" strokeLinecap="round" />
      </>}
      {cfg.brows === "soft" && <>
        <Path d={`M${ex1-pr} ${bry-pr*0.2} Q${ex1} ${bry-pr*0.65} ${ex1+pr} ${bry-pr*0.2}`} stroke={cfg.color} strokeWidth={s*0.036} fill="none" strokeLinecap="round" />
        <Path d={`M${ex2-pr} ${bry-pr*0.2} Q${ex2} ${bry-pr*0.65} ${ex2+pr} ${bry-pr*0.2}`} stroke={cfg.color} strokeWidth={s*0.036} fill="none" strokeLinecap="round" />
      </>}
      {cfg.brows === "scared" && <>
        <Path d={`M${ex1-pr} ${bry-pr*0.7} Q${ex1} ${bry+pr*0.1} ${ex1+pr} ${bry-pr*0.7}`} stroke={cfg.color} strokeWidth={s*0.042} fill="none" strokeLinecap="round" />
        <Path d={`M${ex2-pr} ${bry-pr*0.7} Q${ex2} ${bry+pr*0.1} ${ex2+pr} ${bry-pr*0.7}`} stroke={cfg.color} strokeWidth={s*0.042} fill="none" strokeLinecap="round" />
      </>}
      {cfg.brows === "low" && <>
        <Path d={`M${ex1-pr} ${bry+pr*0.3} L${ex1+pr} ${bry+pr*0.3}`} stroke={cfg.color} strokeWidth={s*0.036} fill="none" strokeLinecap="round" />
        <Path d={`M${ex2-pr} ${bry+pr*0.3} L${ex2+pr} ${bry+pr*0.3}`} stroke={cfg.color} strokeWidth={s*0.036} fill="none" strokeLinecap="round" />
      </>}
      {/* Mouth */}
      {cfg.mouth === "smile"  && <Path d={`M${cx-s*0.2} ${cy+s*0.15} Q${cx} ${cy+s*0.29} ${cx+s*0.2} ${cy+s*0.15}`} stroke={cfg.color} strokeWidth={s*0.052} fill="none" strokeLinecap="round" />}
      {cfg.mouth === "frown"  && <Path d={`M${cx-s*0.2} ${cy+s*0.25} Q${cx} ${cy+s*0.12} ${cx+s*0.2} ${cy+s*0.25}`} stroke={cfg.color} strokeWidth={s*0.052} fill="none" strokeLinecap="round" />}
      {cfg.mouth === "flat"   && <Path d={`M${cx-s*0.18} ${cy+s*0.2} L${cx+s*0.18} ${cy+s*0.2}`} stroke={cfg.color} strokeWidth={s*0.048} fill="none" strokeLinecap="round" />}
      {cfg.mouth === "wavy"   && <Path d={`M${cx-s*0.2} ${cy+s*0.21} Q${cx-s*0.07} ${cy+s*0.14} ${cx} ${cy+s*0.21} Q${cx+s*0.07} ${cy+s*0.28} ${cx+s*0.2} ${cy+s*0.21}`} stroke={cfg.color} strokeWidth={s*0.048} fill="none" strokeLinecap="round" />}
      {cfg.mouth === "open"   && <Ellipse cx={cx} cy={cy+s*0.2} rx={s*0.1} ry={s*0.085} fill={cfg.color} />}
      {cfg.mouth === "o"      && <Ellipse cx={cx} cy={cy+s*0.19} rx={s*0.07} ry={s*0.1} fill={cfg.color} />}
      {cfg.mouth === "smirk"  && <Path d={`M${cx-s*0.07} ${cy+s*0.19} Q${cx+s*0.1} ${cy+s*0.13} ${cx+s*0.2} ${cy+s*0.19}`} stroke={cfg.color} strokeWidth={s*0.048} fill="none" strokeLinecap="round" />}
    </Svg>
  );
}

// ─── Owl mascot ────────────────────────────────────────────────────
function OwlMascot({ size = 72, mood = "idle" }: { size?: number; mood?: Mood }) {
  const happy = mood === "happy";
  const sad   = mood === "sad";
  const think = mood === "thinking";
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <Defs>
        <LinearGradient id="owlB2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFE27A" /><Stop offset="1" stopColor="#FFB830" />
        </LinearGradient>
        <LinearGradient id="owlC2" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7B5EEA" /><Stop offset="1" stopColor="#4A2FD4" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="40" cy="76" rx="22" ry="4.5" fill="rgba(42,21,128,0.15)" />
      <Ellipse cx="40" cy="58" rx="22" ry="20" fill="url(#owlB2)" />
      <Circle cx="40" cy="34" r="20" fill="url(#owlB2)" />
      <Path d="M24 18 Q18 6 26 12 Q24 18 24 18Z" fill="#FFA020" />
      <Path d="M56 18 Q62 6 54 12 Q56 18 56 18Z" fill="#FFA020" />
      <Ellipse cx="40" cy="37" rx="14" ry="13" fill="#FFF9E0" />
      <Circle cx="33" cy="32" r="7" fill="#fff" />
      <Circle cx="47" cy="32" r="7" fill="#fff" />
      <Circle cx={happy ? "33.5" : sad ? "33" : think ? "35" : "33.5"} cy={happy ? "32" : sad ? "34" : "33"} r="4" fill={T.purple} />
      <Circle cx={happy ? "47.5" : sad ? "47" : think ? "49" : "47.5"} cy={happy ? "32" : sad ? "34" : "33"} r="4" fill={T.purple} />
      <Circle cx="35" cy="30" r="1.5" fill="#fff" />
      <Circle cx="49" cy="30" r="1.5" fill="#fff" />
      {happy && <>
        <Path d="M34 43 Q40 48 46 43" stroke="#FFA020" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <Path d="M27 25 Q33 22 36 25" stroke="#FFA020" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <Path d="M44 25 Q47 22 53 25" stroke="#FFA020" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </>}
      {sad && <>
        <Path d="M34 46 Q40 42 46 46" stroke="#FFA020" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <Path d="M27 27 Q33 31 36 26" stroke="#FFA020" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <Path d="M44 26 Q47 31 53 27" stroke="#FFA020" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </>}
      {!happy && !sad && <Path d="M36 44 L44 44" stroke="#FFA020" strokeWidth="2" strokeLinecap="round" />}
      <Path d="M38 39 L40 43 L42 39Z" fill="#FFA020" />
      <Circle cx="28" cy="39" r="4" fill="#FFB8AA" opacity={0.5} />
      <Circle cx="52" cy="39" r="4" fill="#FFB8AA" opacity={0.5} />
      <Path d="M18 54 Q8 48 14 64 Q22 68 28 60Z" fill="#FFA020" />
      <Path d="M62 54 Q72 48 66 64 Q58 68 52 60Z" fill="#FFA020" />
      <Ellipse cx="40" cy="62" rx="10" ry="12" fill="#FFF9E0" opacity={0.8} />
      <Rect x="28" y="16" width="24" height="5.5" rx="2.5" fill="url(#owlC2)" />
      <Path d="M40 8 L28 16 L52 16Z" fill="url(#owlC2)" />
      <Circle cx="51" cy="22.5" r="3" fill={T.coral} />
      {think && <>
        <Circle cx="60" cy="16" r="2.5" fill={T.purpleLight} opacity={0.5} />
        <Circle cx="67" cy="10"  r="3.5" fill={T.purpleLight} opacity={0.65} />
        <Circle cx="75" cy="3"   r="5" fill={T.purpleLight} opacity={0.75} />
      </>}
    </Svg>
  );
}

// ─── Score pop ─────────────────────────────────────────────────────
function ScorePop({ trigger }: { trigger: number }) {
  const y  = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    if (!trigger) return;
    y.setValue(0); op.setValue(1); sc.setValue(0.8);
    Animated.parallel([
      Animated.timing(y,  { toValue: -60, duration: 750, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(op, { toValue: 0, duration: 750, delay: 200, useNativeDriver: true }),
      Animated.spring(sc, { toValue: 1.3, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [trigger]);
  return (
    <Animated.Text style={[styles.scorePop, { opacity: op, transform: [{ translateY: y }, { scale: sc }] }]}>
      +1 ⭐
    </Animated.Text>
  );
}

// ─── Confetti ──────────────────────────────────────────────────────
function ConfettiPiece({ x, color, delay, circle }: { x: number; color: string; delay: number; circle: boolean }) {
  const y = useRef(new Animated.Value(0)).current;
  const r = useRef(new Animated.Value(0)).current;
  const o = useRef(new Animated.Value(0)).current;
  const sz = 5 + Math.random() * 8;
  useEffect(() => {
    setTimeout(() => {
      o.setValue(1);
      Animated.parallel([
        Animated.timing(y, { toValue: 300, duration: 2000, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(r, { toValue: 10, duration: 2000, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0, duration: 2000, delay: 350, useNativeDriver: true }),
      ]).start();
    }, delay);
  }, []);
  const rotate = r.interpolate({ inputRange: [0, 10], outputRange: ["0deg", "1080deg"] });
  return (
    <Animated.View style={{
      position: "absolute", left: x, top: 0, width: sz, height: sz,
      borderRadius: circle ? sz / 2 : 2,
      backgroundColor: color, opacity: o,
      transform: [{ translateY: y }, { rotate }],
    }} />
  );
}

const CONFETTI_DATA = Array.from({ length: 28 }, (_, i) => ({
  x: (i / 28) * (width * 0.84) + width * 0.08,
  color: [T.gold, T.coral, T.teal, T.purple, "#FF9020", T.lilac, T.sky][i % 7],
  delay: i * 55,
  circle: i % 2 === 0,
}));

const CORRECT_PHRASES = ["Great job! 🎉", "You got it! ✨", "Brilliant! 💫", "Spot on! 🎯", "Amazing! 🌟", "Super! 🦉"];

// ─── Option button — VIVID, high-contrast cards ────────────────────
function OptionButton({
  emotion, state, onPress, disabled, idx,
}: {
  emotion: string;
  state: "default" | "correct" | "wrong" | "dimmed";
  onPress: () => void;
  disabled: boolean;
  idx: number;
}) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    fadeAnim.setValue(0); slideAnim.setValue(18); scaleAnim.setValue(0.9);
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 240, delay: idx * 80 + 100, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 240, delay: idx * 80 + 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 100, delay: idx * 80 + 100, useNativeDriver: true } as any),
    ]).start();
  }, [emotion]);

  const cfg = EMOTION_STYLE[emotion] ?? EMOTION_STYLE["Happy"];

  const isCorrect = state === "correct";
  const isWrong   = state === "wrong";
  const isDimmed  = state === "dimmed";

  // Strong, vivid backgrounds
  const btnBg     = isCorrect ? T.teal     : isWrong ? T.coral    : cfg.cardBg;
  const btnBorder = isCorrect ? T.tealDark : isWrong ? T.coralDark : cfg.cardBorder;
  const labelCol  = isCorrect ? "#003828"  : isWrong ? "#5A0000"  : cfg.textColor;

  return (
    <Animated.View style={{
      width: (width - 52) / 2,
      opacity: isDimmed ? 0.35 : fadeAnim,
      transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
    }}>
      <TouchableOpacity
        style={[
          styles.optBtn,
          {
            backgroundColor: btnBg,
            borderColor: btnBorder,
            shadowColor: btnBorder,
          },
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.72}
      >
        {/* Colored face background blob */}
        <View style={[styles.optFaceWrap, {
          backgroundColor: isCorrect || isWrong
            ? "rgba(255,255,255,0.28)"
            : cfg.bg,
          borderColor: cfg.border + "80",
        }]}>
          <EmotionFace emotion={emotion} size={44} />
        </View>

        {/* Label — always dark + bold against its colored bg */}
        <Text style={[styles.optText, { color: labelCol }]} numberOfLines={1}>
          {emotion}
        </Text>

        {/* Status badge */}
        {isCorrect && (
          <View style={[styles.statusBadge, { backgroundColor: T.tealDark }]}>
            <Svg width={13} height={13} viewBox="0 0 24 24">
              <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#fff" />
            </Svg>
          </View>
        )}
        {isWrong && (
          <View style={[styles.statusBadge, { backgroundColor: T.coralDark }]}>
            <Svg width={13} height={13} viewBox="0 0 24 24">
              <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#fff" />
            </Svg>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Star icon ─────────────────────────────────────────────────────
function Star({ size = 34, filled = true }: { size?: number; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? T.gold : "none"} stroke={T.gold} strokeWidth={filled ? 0 : 1.8}
      />
    </Svg>
  );
}

// ─── Pulsing ring animation around photo ──────────────────────────
function PulsingRing({ color, size }: { color: string; size: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const op    = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    Animated.loop(Animated.parallel([
      Animated.timing(scale, { toValue: 1.12, duration: 900, useNativeDriver: true }),
      Animated.timing(op,    { toValue: 0, duration: 900, useNativeDriver: true }),
    ])).start();
  }, []);
  return (
    <Animated.View style={{
      position: "absolute",
      width: size, height: size,
      borderRadius: size / 2,
      borderWidth: 3,
      borderColor: color,
      opacity: op,
      transform: [{ scale }],
    }} pointerEvents="none" />
  );
}

// ─── Main component ────────────────────────────────────────────────
export default function EmotionGame() {
  const router = useRouter();

  const [data,       setData]       = useState<GameItem[]>([]);
  const [index,      setIndex]      = useState(0);
  const [selected,   setSelected]   = useState<string | null>(null);
  const [score,      setScore]      = useState(0);
  const [gameOver,   setGameOver]   = useState(false);
  const [streak,     setStreak]     = useState(0);
  const [maxStreak,  setMaxStreak]  = useState(0);
  const [popTrigger, setPopTrigger] = useState(0);

  const usedWrong  = useRef(new Set<string>());
  const cardFade   = useRef(new Animated.Value(0)).current;
  const cardScale  = useRef(new Animated.Value(0.88)).current;
  const shakeX     = useRef(new Animated.Value(0)).current;
  const pillBounce = useRef(new Animated.Value(1)).current;
  const mascotBob  = useRef(new Animated.Value(0)).current;
  const mascotPop  = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(mascotBob, { toValue: -6, duration: 1300, useNativeDriver: true }),
      Animated.timing(mascotBob, { toValue: 0,  duration: 1300, useNativeDriver: true }),
    ])).start();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem("gameData");
      if (!stored) return;
      const parsed: any[] = JSON.parse(stored);
      const temp: GameItem[] = [];
      parsed.forEach(entry => {
        if (entry.images) {
          (entry.images as any[]).forEach(img => {
            if (img.uri && img.emotion) temp.push({ image: { uri: img.uri }, emotion: img.emotion, personName: entry.name });
          });
        } else if (entry.uri && entry.emotion) {
          temp.push({ image: { uri: entry.uri }, emotion: entry.emotion });
        }
      });
      setData(shuffleArray(temp));
    } catch (e) { console.error(e); }
  };

  const options = useMemo(() => {
    if (!data[index]) return [];
    return buildOptions(data[index].emotion, usedWrong.current);
  }, [index, data]);

  const animateCardIn = useCallback(() => {
    cardFade.setValue(0); cardScale.setValue(0.88); shakeX.setValue(0); mascotPop.setValue(1);
    Animated.parallel([
      Animated.timing(cardFade,  { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => { animateCardIn(); }, [index]);

  useEffect(() => {
    if (!data.length) return;
    Animated.timing(progressAnim, {
      toValue: (index + 1) / data.length,
      duration: 400, useNativeDriver: false,
    }).start();
  }, [index, data.length]);

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === data[index].emotion;

    if (correct) {
      const ns = streak + 1;
      setStreak(ns); setMaxStreak(m => Math.max(m, ns));
      setScore(s => s + 1); setPopTrigger(t => t + 1);
      Animated.sequence([
        Animated.timing(pillBounce, { toValue: 1.45, duration: 120, useNativeDriver: true }),
        Animated.spring(pillBounce, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    } else {
      setStreak(0); usedWrong.current.add(option);
      Animated.sequence([
        Animated.timing(shakeX, { toValue: 16,  duration: 55, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -16, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 9,   duration: 55, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -5,  duration: 55, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 0,   duration: 55, useNativeDriver: true }),
      ]).start();
    }

    mascotPop.setValue(0);
    Animated.spring(mascotPop, { toValue: 1, friction: 5, tension: 130, useNativeDriver: true }).start();

    setTimeout(() => {
      setSelected(null);
      if (index + 1 >= data.length) setGameOver(true);
      else setIndex(i => i + 1);
    }, 1150);
  };

  const restart = () => {
    usedWrong.current.clear();
    setData(d => shuffleArray(d));
    setIndex(0); setScore(0); setStreak(0); setMaxStreak(0);
    setGameOver(false); setSelected(null);
    progressAnim.setValue(0);
  };

  // ─── Empty state ─────────────────────────────────────────────
  if (data.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={T.purpleDark} />
        <View style={styles.emptyWrap}>
          <Animated.View style={{ transform: [{ translateY: mascotBob }], marginBottom: 24 }}>
            <OwlMascot size={110} mood="thinking" />
          </Animated.View>
          <Text style={styles.emptyTitle}>No photos yet!</Text>
          <Text style={styles.emptySub}>Ask a grown-up to add family photos from the parent portal.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.back()} activeOpacity={0.85}>
            <Text style={styles.emptyBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const current   = data[index];
  const total     = data.length;
  const isCorrect = selected === current?.emotion;
  const mood: Mood = !selected ? "idle" : isCorrect ? "happy" : "sad";
  const PHOTO_SIZE = Math.min(width * 0.46, 190);
  const HEADER_H  = 118;

  const optState = (opt: string): "default" | "correct" | "wrong" | "dimmed" => {
    if (!selected) return "default";
    if (opt === current.emotion) return "correct";
    if (opt === selected)        return "wrong";
    return "dimmed";
  };

  const reactionPhrase = isCorrect
    ? CORRECT_PHRASES[score % CORRECT_PHRASES.length]
    : `It was: ${current.emotion}`;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={T.purpleDark} />

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <View style={{ height: HEADER_H, position: "relative" }}>
        <Svg width={width} height={HEADER_H} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="hdrG" x1="0.2" y1="0" x2="0.8" y2="1">
              <Stop offset="0" stopColor="#1A0E50" />
              <Stop offset="1" stopColor="#4A2FD4" />
            </LinearGradient>
          </Defs>
          <Rect width={width} height={HEADER_H} fill="url(#hdrG)" />
          {/* Decorative circles */}
          <Circle cx={width * 0.9} cy={20} r={52} fill="rgba(123,94,234,0.25)" />
          <Circle cx={width * 0.1} cy={HEADER_H} r={60} fill="rgba(123,94,234,0.18)" />
          <Circle cx={width * 0.5} cy={-16} r={40} fill="rgba(255,209,102,0.1)" />
          {/* Wave bottom */}
          <Path
            d={`M0 ${HEADER_H} Q${width*0.2} ${HEADER_H-20} ${width*0.5} ${HEADER_H-9} Q${width*0.8} ${HEADER_H+2} ${width} ${HEADER_H-18} L${width} ${HEADER_H} Z`}
            fill={T.cream}
          />
        </Svg>

        {/* Top row */}
        <View style={[styles.hdrRow, { marginTop: 50 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#fff" />
            </Svg>
          </TouchableOpacity>

          <Text style={styles.hdrQuestion}>How does this person feel?</Text>

          <Animated.View style={[styles.scorePill, { transform: [{ scale: pillBounce }] }]}>
            <Text style={styles.scoreEmoji}>⭐</Text>
            <Text style={styles.scoreNum}>{score}</Text>
            {streak >= 2 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>{streak}x🔥</Text>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>{index + 1}/{total}</Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, {
              width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
            }]} />
          </View>
          <Text style={styles.progressLabel}>{Math.round(((index + 1) / total) * 100)}%</Text>
        </View>
      </View>

      {/* ── BODY ───────────────────────────────────────────────── */}
      <View style={styles.body}>

        {/* PHOTO + MASCOT ROW */}
        <View style={styles.midRow}>

          {/* Photo card */}
          <Animated.View style={[
            styles.photoCard,
            { width: PHOTO_SIZE, height: PHOTO_SIZE },
            { opacity: cardFade, transform: [{ scale: cardScale }, { translateX: shakeX }] },
          ]}>
            {/* Pulsing ring when answered */}
            {selected && (
              <PulsingRing
                color={isCorrect ? T.teal : T.coral}
                size={PHOTO_SIZE + 10}
              />
            )}
            <Image source={current.image} style={styles.photo} resizeMode="cover" />
            {selected && (
              <View style={[styles.photoOverlay, {
                backgroundColor: isCorrect ? "rgba(6,214,160,0.32)" : "rgba(255,95,109,0.32)",
              }]}>
                <View style={[styles.overlayCircle, { backgroundColor: isCorrect ? T.teal : T.coral }]}>
                  <Svg width={26} height={26} viewBox="0 0 24 24">
                    {isCorrect
                      ? <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#fff" />
                      : <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#fff" />
                    }
                  </Svg>
                </View>
              </View>
            )}
            <ScorePop trigger={popTrigger} />
          </Animated.View>

          {/* Mascot + speech bubble */}
          <View style={styles.mascotCol}>
            <Animated.View style={{ transform: [{ scale: mascotPop }, { translateY: mascotBob }] }}>
              <OwlMascot size={72} mood={mood} />
            </Animated.View>

            <View style={[styles.speechBubble, {
              backgroundColor: !selected ? T.purpleLight : isCorrect ? T.teal : T.coral,
            }]}>
              <View style={[styles.bubbleTail, {
                borderRightColor: !selected ? T.purpleLight : isCorrect ? T.teal : T.coral,
              }]} />
              <Text style={styles.bubbleText} numberOfLines={2}>
                {!selected ? "Pick one!" : reactionPhrase}
              </Text>
            </View>

            {current.personName && (
              <Text style={styles.personLabel}>{current.personName}</Text>
            )}
          </View>
        </View>

        {/* ANSWER BUTTONS — vivid 2-column grid */}
        <View style={styles.optionsGrid}>
          {options.map((opt, i) => (
            <OptionButton
              key={`${index}-${opt}`}
              emotion={opt}
              state={optState(opt)}
              onPress={() => handleAnswer(opt)}
              disabled={!!selected}
              idx={i}
            />
          ))}
        </View>

      </View>

      {/* ── GAME OVER MODAL ────────────────────────────────────── */}
      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            {score / total >= 0.6 && CONFETTI_DATA.map((c, i) => <ConfettiPiece key={i} {...c} />)}

            <Animated.View style={{ transform: [{ translateY: mascotBob }], marginBottom: 8 }}>
              <OwlMascot size={100} mood={score / total >= 0.5 ? "happy" : "sad"} />
            </Animated.View>

            <Text style={styles.modalTitle}>
              {score / total >= 0.8 ? "Amazing! 🎉" : score / total >= 0.5 ? "Good job! ✨" : "Keep going! 💪"}
            </Text>
            <Text style={styles.modalSub}>
              {score / total >= 0.8 ? "You read feelings really well!"
                : score / total >= 0.5 ? "You're getting better every time!"
                : "Practice makes perfect — try again!"}
            </Text>

            <View style={styles.starsRow}>
              {[0.4, 0.65, 0.85].map((t, i) => <Star key={i} size={36} filled={score / total >= t} />)}
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: T.teal }]}>{score}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: T.coral }]}>{total - score}</Text>
                <Text style={styles.statLabel}>Missed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: T.gold }]}>{maxStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.playAgainBtn} onPress={restart} activeOpacity={0.85}>
              <Text style={styles.playAgainText}>Play Again 🎮</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace("/childhome")} activeOpacity={0.85}>
              <Text style={styles.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.purpleDark },

  emptyWrap: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 36, backgroundColor: T.cream,
  },
  emptyTitle:   { fontSize: 24, fontWeight: "900", color: T.text, marginBottom: 10, textAlign: "center" },
  emptySub:     { fontSize: 14, color: T.textMid, fontWeight: "600", textAlign: "center", lineHeight: 22, marginBottom: 30 },
  emptyBtn:     { backgroundColor: T.purple, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 22, shadowColor: T.purple, shadowOpacity: 0.4, shadowRadius: 14, elevation: 8 },
  emptyBtnText: { color: T.white, fontWeight: "900", fontSize: 16 },

  // Header
  hdrRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, marginBottom: 8, gap: 8,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
  },
  hdrQuestion: {
    flex: 1, fontSize: 14, fontWeight: "800",
    color: "rgba(255,255,255,0.92)", textAlign: "center",
  },
  scorePill: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: T.gold, borderRadius: 18,
    paddingHorizontal: 10, paddingVertical: 5,
    shadowColor: T.gold, shadowOpacity: 0.55, shadowRadius: 10, elevation: 5,
  },
  scoreEmoji:  { fontSize: 12 },
  scoreNum:    { color: T.purpleDark, fontWeight: "900", fontSize: 15 },
  streakBadge: { backgroundColor: T.coral, borderRadius: 9, paddingHorizontal: 5, paddingVertical: 1 },
  streakText:  { fontSize: 9, fontWeight: "900", color: T.white },

  progressRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, gap: 8,
  },
  progressLabel: { fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: "800", minWidth: 30, textAlign: "center" },
  progressTrack: {
    flex: 1, height: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 4, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: T.gold, borderRadius: 4 },

  // Body
  body: {
    flex: 1,
    backgroundColor: T.cream,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 14,
  },

  // Photo + mascot
  midRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  photoCard: {
    borderRadius: 24, overflow: "visible",
    alignItems: "center", justifyContent: "center",
    shadowColor: "rgba(74,47,212,0.28)",
    shadowOpacity: 1, shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 }, elevation: 12,
    borderWidth: 3, borderColor: T.border,
    backgroundColor: T.white,
    position: "relative",
  },
  photo: { width: "100%", height: "100%", borderRadius: 21 },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 21,
    alignItems: "center", justifyContent: "center",
  },
  overlayCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  scorePop: {
    position: "absolute", alignSelf: "center", top: "22%",
    fontSize: 22, fontWeight: "900", color: T.gold,
    textShadowColor: "rgba(0,0,0,0.15)", textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },

  mascotCol: { flex: 1, alignItems: "flex-start", gap: 9 },
  speechBubble: {
    borderRadius: 16, paddingHorizontal: 12, paddingVertical: 9,
    position: "relative", maxWidth: "100%",
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, elevation: 3,
  },
  bubbleTail: {
    position: "absolute", left: -8, top: 13,
    width: 0, height: 0,
    borderTopWidth: 7, borderBottomWidth: 7, borderRightWidth: 9,
    borderTopColor: "transparent", borderBottomColor: "transparent",
  },
  bubbleText: { color: T.white, fontWeight: "900", fontSize: 13, lineHeight: 18 },
  personLabel: { fontSize: 11, fontWeight: "700", color: T.textSoft },

  // Options grid — vivid 2×2 cards
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optBtn: {
    // width is set inline from (width-52)/2
    height: 84,
    borderRadius: 20,
    borderWidth: 3,         // thick border = more visible
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 8,
    gap: 5,
    shadowOpacity: 0.32,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    position: "relative",
    overflow: "hidden",
  },
  optFaceWrap: {
    width: 50, height: 50, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5,
  },
  optText: {
    fontSize: 13, fontWeight: "900", textAlign: "center",
    letterSpacing: 0.2,
  },
  statusBadge: {
    position: "absolute", top: 7, right: 7,
    width: 22, height: 22, borderRadius: 7,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },

  // Modal
  overlay: {
    flex: 1, backgroundColor: "rgba(26,14,78,0.75)",
    justifyContent: "center", alignItems: "center",
  },
  modalBox: {
    backgroundColor: T.white, padding: 24, borderRadius: 30,
    alignItems: "center", width: "88%",
    shadowColor: T.purple, shadowOpacity: 0.3, shadowRadius: 32,
    shadowOffset: { width: 0, height: 14 }, elevation: 22,
    borderWidth: 2, borderColor: T.border, overflow: "hidden",
  },
  modalTitle: { fontSize: 26, color: T.text, fontWeight: "900", marginBottom: 5 },
  modalSub:   { fontSize: 13, color: T.textMid, fontWeight: "700", textAlign: "center", marginBottom: 14, lineHeight: 20 },

  starsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },

  statsRow: {
    flexDirection: "row",
    backgroundColor: T.purpleGhost,
    borderRadius: 18, borderWidth: 2, borderColor: T.border,
    paddingVertical: 14, width: "100%",
    justifyContent: "space-around", marginBottom: 18,
  },
  statItem:    { alignItems: "center" },
  statNum:     { fontSize: 26, fontWeight: "900" },
  statLabel:   { fontSize: 10, fontWeight: "800", color: T.textSoft, marginTop: 3 },
  statDivider: { width: 2, backgroundColor: T.border, marginVertical: 4 },

  playAgainBtn: {
    backgroundColor: T.purple,
    paddingVertical: 15, borderRadius: 20,
    width: "100%", alignItems: "center",
    marginBottom: 9,
    shadowColor: T.purple, shadowOpacity: 0.42, shadowRadius: 14, elevation: 9,
  },
  playAgainText: { color: T.white, fontWeight: "900", fontSize: 16 },
  homeBtn: {
    backgroundColor: T.purpleGhost,
    paddingVertical: 14, borderRadius: 20,
    width: "100%", alignItems: "center",
    borderWidth: 2, borderColor: T.border,
  },
  homeBtnText: { color: T.purple, fontWeight: "800", fontSize: 15 },
});