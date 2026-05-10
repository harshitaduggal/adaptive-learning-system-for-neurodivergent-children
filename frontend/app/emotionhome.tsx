import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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

// ── COSMIC CANDY palette ───────────────────────────────────────────
const C = {
  void:         "#06021A",
  deepSpace:    "#0D0828",
  cosmos:       "#150E3A",
  auroraViolet: "#7C3AED",
  auroraPink:   "#EC4899",
  auroraBlue:   "#3B82F6",
  auroraCyan:   "#06B6D4",
  auroraGreen:  "#10B981",
  candyLemon:   "#FDE047",
  candyPeach:   "#FB923C",
  candyRose:    "#F472B6",
  candyMint:    "#34D399",
  candySky:     "#38BDF8",
  candyLilac:   "#A78BFA",
  glowLemon:    "rgba(253,224,71,0.18)",
  glowRose:     "rgba(244,114,182,0.18)",
  glowMint:     "rgba(52,211,153,0.18)",
  glowSky:      "rgba(56,189,248,0.18)",
  glass:        "rgba(255,255,255,0.055)",
  glassBrd:     "rgba(255,255,255,0.13)",
  textWhite:    "#FFFFFF",
  textSilver:   "rgba(255,255,255,0.70)",
  textMuted:    "rgba(255,255,255,0.38)",
};

// ── Twinkling star ─────────────────────────────────────────────────
function TwinkleStar({ x, y, r, delay }: { x: number; y: number; r: number; delay: number }) {
  const op = useRef(new Animated.Value(Math.random() * 0.4 + 0.1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(op, { toValue: 0.9 + Math.random() * 0.1, duration: 700 + Math.random() * 900, delay, useNativeDriver: true }),
      Animated.timing(op, { toValue: 0.1 + Math.random() * 0.1, duration: 700 + Math.random() * 900, useNativeDriver: true }),
    ])).start();
  }, []);
  return (
    <Animated.View style={{ position: "absolute", left: x, top: y, opacity: op }} pointerEvents="none">
      <Svg width={r * 2} height={r * 2} viewBox="0 0 6 6">
        <Circle cx="3" cy="3" r="3" fill="#FFFFFF" />
      </Svg>
    </Animated.View>
  );
}

// ── Floating glow orb ──────────────────────────────────────────────
function GlowOrb({ x, y, sz, color, delay }: { x: number; y: number; sz: number; color: string; delay: number }) {
  const floatY = useRef(new Animated.Value(0)).current;
  const scale  = useRef(new Animated.Value(0.9)).current;
  useEffect(() => {
    setTimeout(() => {
      Animated.loop(Animated.sequence([
        Animated.parallel([
          Animated.timing(floatY, { toValue: -16, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(scale,  { toValue: 1.08, duration: 1700, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(floatY, { toValue: 0, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(scale,  { toValue: 0.9, duration: 1700, useNativeDriver: true }),
        ]),
      ])).start();
    }, delay);
  }, []);
  const id = `go${Math.round(x)}${Math.round(y)}`;
  return (
    <Animated.View style={{ position: "absolute", left: x, top: y, transform: [{ translateY: floatY }, { scale }] }} pointerEvents="none">
      <Svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
        <Defs>
          <RadialGradient id={id} cx="36%" cy="30%" r="65%">
            <Stop offset="0"   stopColor="#FFFFFF" stopOpacity="0.55" />
            <Stop offset="0.5" stopColor={color}   stopOpacity="0.5"  />
            <Stop offset="1"   stopColor={color}   stopOpacity="0"    />
          </RadialGradient>
        </Defs>
        <Circle cx={sz/2} cy={sz/2} r={sz/2}     fill={color} opacity={0.10} />
        <Circle cx={sz/2} cy={sz/2} r={sz*0.38}  fill={`url(#${id})`} />
        <Ellipse cx={sz*0.36} cy={sz*0.28} rx={sz*0.11} ry={sz*0.065} fill="#FFFFFF" opacity="0.38" />
      </Svg>
    </Animated.View>
  );
}

// ── Star field data ────────────────────────────────────────────────
const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: Math.random() * width,
  y: Math.random() * height * 0.58,
  r: 0.5 + Math.random() * 1.4,
  delay: i * 75,
}));

// ── Jewel emotion face ─────────────────────────────────────────────
type ChipDef = { label: string; color: string; glow: string; mouth: string };
const CHIP_EMOTIONS: ChipDef[] = [
  { label: "Happy",   color: C.candyLemon, glow: C.glowLemon, mouth: "smile" },
  { label: "Sad",     color: C.candySky,   glow: C.glowSky,   mouth: "frown" },
  { label: "Excited", color: C.candyRose,  glow: C.glowRose,  mouth: "open"  },
  { label: "Calm",    color: C.candyMint,  glow: C.glowMint,  mouth: "flat"  },
];

function JewelFace({ color, mouth, glow, size = 46 }: { color: string; mouth: string; glow: string; size?: number }) {
  const s = size, cx = s/2, cy = s/2, r = s*0.44;
  const ex1 = cx - s*0.155, ex2 = cx + s*0.155, ey = cy - s*0.07;
  const pr  = s*0.078;
  const id  = `jf${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id={id} cx="36%" cy="28%" r="68%">
          <Stop offset="0"   stopColor="#FFFFFF" stopOpacity="0.40" />
          <Stop offset="0.55" stopColor={color}   stopOpacity="0.15" />
          <Stop offset="1"   stopColor={color}   stopOpacity="0.03" />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={r+5} fill={glow} />
      <Circle cx={cx} cy={cy} r={r}   fill={`url(#${id})`} />
      <Circle cx={cx} cy={cy} r={r}   stroke={color} strokeWidth={s*0.06} fill="none" />
      <Circle cx={cx-s*0.26} cy={cy+s*0.07} r={s*0.09} fill={color} opacity={0.32} />
      <Circle cx={cx+s*0.26} cy={cy+s*0.07} r={s*0.09} fill={color} opacity={0.32} />
      <Circle cx={ex1} cy={ey} r={pr*1.15} fill="rgba(255,255,255,0.88)" />
      <Circle cx={ex2} cy={ey} r={pr*1.15} fill="rgba(255,255,255,0.88)" />
      <Circle cx={ex1} cy={ey} r={pr*0.72} fill={color} />
      <Circle cx={ex2} cy={ey} r={pr*0.72} fill={color} />
      <Circle cx={ex1+pr*0.28} cy={ey-pr*0.26} r={pr*0.29} fill="#FFFFFF" />
      <Circle cx={ex2+pr*0.28} cy={ey-pr*0.26} r={pr*0.29} fill="#FFFFFF" />
      {mouth === "smile" && <Path d={`M${cx-s*0.19} ${cy+s*0.13} Q${cx} ${cy+s*0.28} ${cx+s*0.19} ${cy+s*0.13}`} stroke={color} strokeWidth={s*0.058} fill="none" strokeLinecap="round" />}
      {mouth === "frown" && <Path d={`M${cx-s*0.19} ${cy+s*0.26} Q${cx} ${cy+s*0.12} ${cx+s*0.19} ${cy+s*0.26}`} stroke={color} strokeWidth={s*0.058} fill="none" strokeLinecap="round" />}
      {mouth === "flat"  && <Path d={`M${cx-s*0.17} ${cy+s*0.19} L${cx+s*0.17} ${cy+s*0.19}`} stroke={color} strokeWidth={s*0.052} fill="none" strokeLinecap="round" />}
      {mouth === "open"  && <Ellipse cx={cx} cy={cy+s*0.19} rx={s*0.09} ry={s*0.085} fill={color} />}
    </Svg>
  );
}

// ── Stunning owl mascot ────────────────────────────────────────────
function OwlHero({ size = 168 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 168 168">
      <Defs>
        <RadialGradient id="hHalo" cx="50%" cy="48%" r="50%">
          <Stop offset="0"   stopColor={C.candyLemon} stopOpacity="0.40" />
          <Stop offset="0.65" stopColor={C.candyLemon} stopOpacity="0.08" />
          <Stop offset="1"   stopColor={C.candyLemon} stopOpacity="0"    />
        </RadialGradient>
        <LinearGradient id="hBody" x1="0.15" y1="0" x2="0.85" y2="1">
          <Stop offset="0"   stopColor="#FFE97C" />
          <Stop offset="0.45" stopColor="#FFCC28" />
          <Stop offset="1"   stopColor="#FF9800" />
        </LinearGradient>
        <LinearGradient id="hBelly" x1="0.1" y1="0" x2="0.9" y2="1">
          <Stop offset="0" stopColor="#FFFDE6" />
          <Stop offset="1" stopColor="#FFF0B0" />
        </LinearGradient>
        <LinearGradient id="hCap" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.candyLilac} />
          <Stop offset="1" stopColor={C.auroraViolet} />
        </LinearGradient>
        <RadialGradient id="hEye" cx="32%" cy="26%" r="70%">
          <Stop offset="0"   stopColor="#FFFFFF" />
          <Stop offset="0.7" stopColor="#EBF4FF" stopOpacity="0.7" />
          <Stop offset="1"   stopColor="#FFFFFF" stopOpacity="0.3" />
        </RadialGradient>
        <RadialGradient id="hPupil" cx="28%" cy="22%" r="72%">
          <Stop offset="0"   stopColor="#3B1FA8" />
          <Stop offset="1"   stopColor="#06021A" />
        </RadialGradient>
        <RadialGradient id="hWing" cx="60%" cy="35%" r="65%">
          <Stop offset="0"   stopColor="#FFD860" />
          <Stop offset="1"   stopColor="#FF9000" />
        </RadialGradient>
      </Defs>

      {/* Outer halo glow */}
      <Circle cx="84" cy="84" r="82" fill="url(#hHalo)" />
      {/* Ground shadow */}
      <Ellipse cx="84" cy="161" rx="36" ry="6" fill="#000" opacity="0.20" />

      {/* Body */}
      <Ellipse cx="84" cy="118" rx="48" ry="46" fill="url(#hBody)" />
      {/* Body highlight */}
      <Ellipse cx="74" cy="100" rx="22" ry="12" fill="#FFFFFF" opacity="0.12" />

      {/* Head */}
      <Circle cx="84" cy="70" r="44" fill="url(#hBody)" />
      {/* Head highlight */}
      <Ellipse cx="72" cy="54" rx="16" ry="10" fill="#FFFFFF" opacity="0.14" />

      {/* Ear tufts */}
      <Path d="M51 34 Q41  8 57 20 Q54 30 51 34Z" fill="#FFA820" />
      <Path d="M51 34 Q53 14 60 23 Q57 31 51 34Z" fill="#FFE060" opacity="0.55" />
      <Path d="M117 34 Q127  8 111 20 Q114 30 117 34Z" fill="#FFA820" />
      <Path d="M117 34 Q115 14 108 23 Q111 31 117 34Z" fill="#FFE060" opacity="0.55" />

      {/* Face plate */}
      <Ellipse cx="84" cy="76" rx="30" ry="28" fill="url(#hBelly)" />
      {/* Face plate inner glow */}
      <Ellipse cx="80" cy="70" rx="16" ry="10" fill="#FFFFFF" opacity="0.20" />

      {/* Eye whites */}
      <Circle cx="71" cy="68" r="14" fill="url(#hEye)" />
      <Circle cx="97" cy="68" r="14" fill="url(#hEye)" />
      {/* Eye rings */}
      <Circle cx="71" cy="68" r="14" stroke={C.candyLilac} strokeWidth="2"   fill="none" opacity="0.45" />
      <Circle cx="97" cy="68" r="14" stroke={C.candyLilac} strokeWidth="2"   fill="none" opacity="0.45" />

      {/* Pupils */}
      <Circle cx="72" cy="69" r="9" fill="url(#hPupil)" />
      <Circle cx="98" cy="69" r="9" fill="url(#hPupil)" />

      {/* Pupil shimmer */}
      <Circle cx="75"   cy="64.5" r="3.5" fill="#FFFFFF" />
      <Circle cx="101"  cy="64.5" r="3.5" fill="#FFFFFF" />
      <Circle cx="70"   cy="72.5" r="1.4" fill="#FFFFFF" opacity="0.55" />
      <Circle cx="96"   cy="72.5" r="1.4" fill="#FFFFFF" opacity="0.55" />

      {/* Brows */}
      <Path d="M58 51 Q70 44 80 50" stroke="#FFA020" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <Path d="M88 50 Q98 44 110 51" stroke="#FFA020" strokeWidth="3.2" fill="none" strokeLinecap="round" />

      {/* Beak */}
      <Path d="M81 83 L84 93 L87 83Z" fill="#FF8C00" />
      <Path d="M81 83 L84 88 L87 83Z" fill="#FFC040" />

      {/* Cheeks */}
      <Circle cx="56"  cy="78" r="10" fill="#FF7080" opacity="0.36" />
      <Circle cx="112" cy="78" r="10" fill="#FF7080" opacity="0.36" />

      {/* Smile */}
      <Path d="M72 96 Q84 105 96 96" stroke="#FFA020" strokeWidth="3.2" fill="none" strokeLinecap="round" />

      {/* Wings */}
      <Path d="M36 112 Q16 102 26 128 Q38 136 54 122Z" fill="url(#hWing)" />
      <Path d="M36 112 Q22 108 30 122 Q40 128 50 118Z" fill="#FFE060" opacity="0.48" />
      <Path d="M132 112 Q152 102 142 128 Q130 136 114 122Z" fill="url(#hWing)" />
      <Path d="M132 112 Q146 108 138 122 Q128 128 118 118Z" fill="#FFE060" opacity="0.48" />

      {/* Belly */}
      <Ellipse cx="84" cy="124" rx="24" ry="26" fill="url(#hBelly)" opacity="0.92" />
      <Circle  cx="76" cy="118" r="3.2" fill={C.candyLilac} opacity="0.28" />
      <Circle  cx="84" cy="126" r="3.2" fill={C.candyLilac} opacity="0.28" />
      <Circle  cx="92" cy="118" r="3.2" fill={C.candyLilac} opacity="0.28" />

      {/* Cap brim */}
      <Rect x="62" y="30" width="44" height="10" rx="5" fill="url(#hCap)" />
      {/* Cap top */}
      <Path d="M84 14 L62 30 L106 30Z" fill="url(#hCap)" />
      {/* Cap shine */}
      <Path d="M68 23 L86 16 L96 21" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.32" />
      {/* Tassel */}
      <Rect  x="103" y="30" width="3.5" height="16" fill={C.candyLilac} opacity="0.82" />
      <Circle cx="104.5" cy="48"  r="7"   fill={C.candyRose} />
      <Circle cx="104.5" cy="48"  r="3.5" fill="#FFFFFF" opacity="0.38" />
      {/* Cap stars */}
      <Circle cx="70" cy="21" r="2"  fill="#FFFFFF" opacity="0.65" />
      <Circle cx="84" cy="17" r="2"  fill="#FFFFFF" opacity="0.48" />
      <Circle cx="96" cy="21" r="2"  fill="#FFFFFF" opacity="0.65" />
    </Svg>
  );
}

// ── Main Screen ────────────────────────────────────────────────────
export default function EmotionHome() {
  const router = useRouter();

  const mascotOp  = useRef(new Animated.Value(0)).current;
  const mascotY   = useRef(new Animated.Value(28)).current;
  const mascotBob = useRef(new Animated.Value(0)).current;
  const titleOp   = useRef(new Animated.Value(0)).current;
  const titleY    = useRef(new Animated.Value(22)).current;
  const panelOp   = useRef(new Animated.Value(0)).current;
  const panelY    = useRef(new Animated.Value(48)).current;
  const chipOp    = useRef(new Animated.Value(0)).current;
  const chipY     = useRef(new Animated.Value(20)).current;
  const btnSc     = useRef(new Animated.Value(0.84)).current;
  const btnOp     = useRef(new Animated.Value(0)).current;
  const shimmer   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);
    const seq = (anim: Animated.CompositeAnimation, t: number) =>
      setTimeout(() => anim.start(), t);

    Animated.parallel([
      Animated.timing(mascotOp, { toValue: 1, duration: 620, useNativeDriver: true }),
      Animated.timing(mascotY,  { toValue: 0, duration: 700, easing: ease, useNativeDriver: true }),
    ]).start();

    seq(Animated.parallel([
      Animated.timing(titleOp, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(titleY,  { toValue: 0, duration: 560, easing: ease, useNativeDriver: true }),
    ]), 190);

    seq(Animated.parallel([
      Animated.timing(panelOp, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(panelY,  { toValue: 0, duration: 570, easing: ease, useNativeDriver: true }),
    ]), 310);

    seq(Animated.parallel([
      Animated.timing(chipOp, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(chipY,  { toValue: 0, duration: 520, easing: ease, useNativeDriver: true }),
    ]), 460);

    seq(Animated.parallel([
      Animated.timing(btnOp, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.spring(btnSc,  { toValue: 1, friction: 5, tension: 90, useNativeDriver: true } as any),
    ]), 590);

    setTimeout(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(mascotBob, { toValue: -11, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(mascotBob, { toValue: 0,   duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
    }, 700);

    Animated.loop(Animated.sequence([
      Animated.timing(shimmer, { toValue: 1, duration: 2000, useNativeDriver: false }),
      Animated.timing(shimmer, { toValue: 0, duration: 2000, useNativeDriver: false }),
    ])).start();
  }, []);

  const borderColor = shimmer.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: [C.candyLilac, C.candyLemon, C.candyRose, C.candyLilac],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.void} />

      {/* COSMIC BACKGROUND */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="bgG" x1="0" y1="0" x2="0.15" y2="1">
              <Stop offset="0"   stopColor={C.void}      />
              <Stop offset="0.38" stopColor={C.deepSpace}  />
              <Stop offset="1"   stopColor={C.cosmos}     />
            </LinearGradient>
            <LinearGradient id="aur1" x1="0" y1="0" x2="1" y2="0.7">
              <Stop offset="0"   stopColor={C.auroraViolet} stopOpacity="0"    />
              <Stop offset="0.45" stopColor={C.auroraViolet} stopOpacity="0.36" />
              <Stop offset="0.75" stopColor={C.auroraPink}   stopOpacity="0.20" />
              <Stop offset="1"   stopColor={C.auroraPink}   stopOpacity="0"    />
            </LinearGradient>
            <LinearGradient id="aur2" x1="1" y1="0" x2="0" y2="0.6">
              <Stop offset="0"   stopColor={C.auroraBlue}  stopOpacity="0"    />
              <Stop offset="0.4" stopColor={C.auroraCyan}  stopOpacity="0.25" />
              <Stop offset="1"   stopColor={C.auroraGreen} stopOpacity="0"    />
            </LinearGradient>
            <RadialGradient id="warmG" cx="50%" cy="95%" r="55%">
              <Stop offset="0"   stopColor={C.auroraPink}   stopOpacity="0.20" />
              <Stop offset="1"   stopColor={C.auroraViolet} stopOpacity="0"    />
            </RadialGradient>
          </Defs>
          <Rect width={width} height={height} fill="url(#bgG)"   />
          <Rect width={width} height={height} fill="url(#aur1)"  />
          <Rect width={width} height={height} fill="url(#aur2)"  />
          <Rect width={width} height={height} fill="url(#warmG)" />
          <Circle cx={width*0.07} cy={height*0.07} r={88}  fill={C.auroraViolet} opacity={0.16} />
          <Circle cx={width*0.93} cy={height*0.18} r={68}  fill={C.auroroPink}   opacity={0.12} />
          <Circle cx={width*0.48} cy={height*0.32} r={128} fill={C.auroraViolet} opacity={0.09} />
          <Circle cx={width*0.18} cy={height*0.52} r={78}  fill={C.auroraCyan}   opacity={0.09} />
          <Circle cx={width*0.84} cy={height*0.50} r={62}  fill={C.auroraGreen}  opacity={0.09} />
        </Svg>
        {STARS.map((s, i) => <TwinkleStar key={i} {...s} />)}
      </View>

      {/* Floating orbs */}
      <GlowOrb x={-22}        y={height*0.06} sz={104} color={C.auroraViolet} delay={0}    />
      <GlowOrb x={width-78}   y={height*0.11} sz={88}  color={C.auroraPink}   delay={700}  />
      <GlowOrb x={width*0.28} y={height*0.40} sz={64}  color={C.auroraCyan}   delay={1300} />
      <GlowOrb x={width*0.74} y={height*0.37} sz={54}  color={C.candyLemon}   delay={400}  />

      {/* ── HERO ── */}
      <View style={styles.hero}>
        <Animated.View style={{ opacity: mascotOp, transform: [{ translateY: mascotY }] }}>
          <Animated.View style={[styles.owlGlow, { transform: [{ translateY: mascotBob }] }]}>
            <OwlHero size={168} />
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.titleBlock, { opacity: titleOp, transform: [{ translateY: titleY }] }]}>
          <Text style={styles.eyebrow}>✦  FEEL THE GAME  ✦</Text>
          <Text style={styles.t1}>Emotion</Text>
          <Text style={styles.t2}>Match!</Text>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>Can you read feelings?</Text>
          </View>
        </Animated.View>
      </View>

      {/* ── GLASS PANEL ── */}
      <Animated.View style={[styles.panel, { opacity: panelOp, transform: [{ translateY: panelY }] }]}>

        {/* Jewel chips row */}
        <Animated.View style={[styles.chipRow, { opacity: chipOp, transform: [{ translateY: chipY }] }]}>
          {CHIP_EMOTIONS.map((e, i) => (
            <View key={i} style={[styles.chip, { borderColor: e.color + "5A", shadowColor: e.color }]}>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: e.glow, borderRadius: 18 }]} />
              <JewelFace color={e.color} mouth={e.mouth} glow={e.glow} size={44} />
              <Text style={[styles.chipLabel, { color: e.color }]}>{e.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* How-to card */}
        <View style={styles.howCard}>
          <Text style={styles.howTitle}>HOW TO PLAY</Text>
          <View style={styles.howRow}>
            <View style={[styles.howBadge, { backgroundColor: C.candyLemon + "20", borderColor: C.candyLemon + "55" }]}>
              <Text style={[styles.howNum, { color: C.candyLemon }]}>1</Text>
            </View>
            <Text style={styles.howText}>Look at the photo and spot the emotion 📸</Text>
          </View>
          <View style={styles.howLine} />
          <View style={styles.howRow}>
            <View style={[styles.howBadge, { backgroundColor: C.candyMint + "20", borderColor: C.candyMint + "55" }]}>
              <Text style={[styles.howNum, { color: C.candyMint }]}>2</Text>
            </View>
            <Text style={styles.howText}>Tap the right answer to earn a ⭐ star!</Text>
          </View>
        </View>

        {/* CTA — gradient button with shimmer border */}
        <Animated.View style={{ opacity: btnOp, transform: [{ scale: btnSc }] }}>
          <Animated.View style={[styles.btnRing, { borderColor: borderColor }]}>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/emotiongame")} activeOpacity={0.86}>
              <Svg width={width - 60} height={62} viewBox={`0 0 ${width - 60} 62`} style={StyleSheet.absoluteFill}>
                <Defs>
                  <LinearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0"    stopColor={C.candyRose}  />
                    <Stop offset="0.45" stopColor={C.candyLilac} />
                    <Stop offset="1"    stopColor={C.candySky}   />
                  </LinearGradient>
                </Defs>
                <Rect width={width-60} height={62} rx={21} fill="url(#btnGrad)" />
                <Rect x={0} y={0} width={(width-60)*0.52} height={31} rx={21} fill="#FFFFFF" opacity={0.13} />
              </Svg>
              <View style={styles.btnInner}>
                <View style={styles.btnIcon}>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path d="M8 5v14l11-7z" fill={C.void} />
                  </Svg>
                </View>
                <Text style={styles.btnText}>Start Playing!</Text>
                <Text style={styles.btnArrow}>›</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <TouchableOpacity onPress={() => router.push("/setupgames")} activeOpacity={0.6} style={styles.setupRow}>
          <Text style={styles.setupText}>⚙  Set up family photos</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

// ── STYLES ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.void },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    height: height * 0.43,
    gap: 12,
  },
  owlGlow: {
    shadowColor: C.candyLemon,
    shadowOpacity: 0.72,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 10 },
    elevation: 20,
  },
  titleBlock: { flex: 1, gap: 1 },
  eyebrow: {
    fontSize: 9, fontWeight: "900",
    color: C.candyLilac, letterSpacing: 2.5,
    textTransform: "uppercase", marginBottom: 7,
  },
  t1: {
    fontSize: 50, fontWeight: "900",
    color: C.textWhite,
    letterSpacing: -2.5, lineHeight: 52,
    textShadowColor: C.auroraViolet,
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  t2: {
    fontSize: 50, fontWeight: "900",
    color: C.candyLemon,
    letterSpacing: -2.5, lineHeight: 52,
    marginBottom: 12,
    textShadowColor: C.candyLemon,
    textShadowRadius: 24,
    textShadowOffset: { width: 0, height: 0 },
  },
  tagPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(253,224,71,0.12)",
    borderWidth: 1.5, borderColor: "rgba(253,224,71,0.38)",
    borderRadius: 22, paddingHorizontal: 13, paddingVertical: 6,
  },
  tagText: { color: C.candyLemon, fontSize: 11, fontWeight: "800", letterSpacing: 0.35 },

  panel: {
    flex: 1,
    backgroundColor: "rgba(13,8,40,0.86)",
    borderTopLeftRadius: 36, borderTopRightRadius: 36,
    borderTopWidth: 1.5, borderLeftWidth: 1, borderRightWidth: 1,
    borderColor: "rgba(255,255,255,0.11)",
    paddingHorizontal: 18, paddingTop: 22, paddingBottom: 12,
    gap: 13,
    shadowColor: C.auroraViolet,
    shadowOpacity: 0.40, shadowRadius: 32,
    shadowOffset: { width: 0, height: -8 }, elevation: 24,
  },

  chipRow: { flexDirection: "row", gap: 8 },
  chip: {
    flex: 1, alignItems: "center",
    paddingVertical: 10, paddingHorizontal: 2,
    borderRadius: 18, borderWidth: 1.8,
    backgroundColor: "rgba(255,255,255,0.035)",
    overflow: "hidden", gap: 5,
    shadowOpacity: 0.45, shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 }, elevation: 7,
  },
  chipLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 0.3 },

  howCard: {
    backgroundColor: C.glass, borderRadius: 22,
    borderWidth: 1.5, borderColor: C.glassBrd,
    padding: 16, gap: 11,
  },
  howTitle: { fontSize: 10, fontWeight: "900", color: C.textMuted, letterSpacing: 3, marginBottom: 1 },
  howRow:   { flexDirection: "row", alignItems: "center", gap: 12 },
  howBadge: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  howNum:   { fontSize: 16, fontWeight: "900" },
  howText:  { flex: 1, fontSize: 13, color: C.textSilver, fontWeight: "600", lineHeight: 19 },
  howLine:  { height: 1, backgroundColor: "rgba(255,255,255,0.075)" },

  btnRing: {
    borderRadius: 23, borderWidth: 2.5, overflow: "hidden",
    shadowColor: C.candyRose, shadowOpacity: 0.70,
    shadowRadius: 24, shadowOffset: { width: 0, height: 6 }, elevation: 18,
  },
  btn: {
    height: 62, borderRadius: 21, overflow: "hidden",
    alignItems: "center", justifyContent: "center",
  },
  btnInner: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 22 },
  btnIcon:  { width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.28)", alignItems: "center", justifyContent: "center" },
  btnText:  { color: C.void, fontSize: 20, fontWeight: "900", letterSpacing: 0.3 },
  btnArrow: { color: C.void, fontSize: 28, fontWeight: "900", lineHeight: 30, marginLeft: 2 },

  setupRow: { alignItems: "center", paddingVertical: 2 },
  setupText: { color: C.textMuted, fontSize: 13, fontWeight: "700" },
});