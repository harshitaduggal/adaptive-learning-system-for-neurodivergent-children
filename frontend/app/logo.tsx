import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

// ─────────────────────────────────────────────────────────────
//  STAR MASCOT
//  Chunky 5-point star body, little face + satchel bag,
//  exactly like the reference character sheet.
// ─────────────────────────────────────────────────────────────
function StarMascot({ size = 220 }: { size?: number }) {
  // All coordinates designed in a 240×260 viewBox
  return (
    <Svg width={size} height={size * 1.08} viewBox="0 0 240 260">
      <Defs>
        {/* Main star body – warm golden gradient */}
        <LinearGradient id="starBody" x1="0" y1="0" x2="0.3" y2="1">
          <Stop offset="0"   stopColor="#FFE87A" />
          <Stop offset="1"   stopColor="#FFCA28" />
        </LinearGradient>
        {/* Star shading on right side */}
        <LinearGradient id="starShade" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0"   stopColor="#FFD740" stopOpacity="0" />
          <Stop offset="1"   stopColor="#E6A800" stopOpacity="0.28" />
        </LinearGradient>
        {/* Outfit – dusty blue like reference */}
        <LinearGradient id="outfit" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6EB5FF" />
          <Stop offset="1" stopColor="#4A90D9" />
        </LinearGradient>
        {/* Satchel strap */}
        <LinearGradient id="satchel" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#5B9FE0" />
          <Stop offset="1" stopColor="#3A78C9" />
        </LinearGradient>
        {/* Glow behind mascot */}
        <RadialGradient id="mascotGlow" cx="50%" cy="62%" r="48%">
          <Stop offset="0"   stopColor="#FFD740" stopOpacity="0.38" />
          <Stop offset="1"   stopColor="#FFD740" stopOpacity="0"   />
        </RadialGradient>
      </Defs>

      {/* ── soft glow halo ── */}
      <Ellipse cx={120} cy={178} rx={95} ry={68} fill="url(#mascotGlow)" />

      {/* ── drop shadow ── */}
      <Ellipse cx={120} cy={252} rx={52} ry={7} fill="#1E0A4C" opacity={0.18} />

      {/* ══════════════════════════════════════════
          STAR BODY  (chunky 5-point star path)
          Centre: (120, 148), outer r=88, inner r=40
          ══════════════════════════════════════════ */}
      {/* The 5-point star, points at: top, upper-right, lower-right, lower-left, upper-left */}
      <Path
        d={[
          // top point
          "M120,60",
          // → upper-right
          "L137,108",
          // → right point
          "L188,108",
          // → lower-right
          "L148,138",
          // → lower-right point
          "L163,190",
          // → bottom point (slightly raised for cute stubby look)
          "L120,162",
          // → lower-left
          "L77,190",
          // → lower-left point
          "L92,138",
          // → left point
          "L52,108",
          // → upper-left
          "L103,108",
          "Z",
        ].join(" ")}
        fill="url(#starBody)"
      />
      {/* right-side shading overlay */}
      <Path
        d={[
          "M120,60","L137,108","L188,108","L148,138",
          "L163,190","L120,162","L77,190","L92,138",
          "L52,108","L103,108","Z",
        ].join(" ")}
        fill="url(#starShade)"
      />

      {/* ── OUTFIT: little vest/top sitting on the lower body ── */}
      {/* Main vest body */}
      <Path
        d="M88 152 Q88 198 120 202 Q152 198 152 152 Q140 162 120 164 Q100 162 88 152 Z"
        fill="url(#outfit)"
      />
      {/* Left lapel / collar */}
      <Path
        d="M106 152 Q108 172 112 176 Q108 168 106 152 Z"
        fill="#FFFFFF"
        opacity={0.55}
      />
      {/* Right lapel */}
      <Path
        d="M134 152 Q132 172 128 176 Q132 168 134 152 Z"
        fill="#FFFFFF"
        opacity={0.55}
      />
      {/* Vest centre line */}
      <Path
        d="M120 154 L120 200"
        stroke="#3A78C9"
        strokeWidth={1.2}
        opacity={0.35}
        strokeLinecap="round"
      />
      {/* Little button */}
      <Circle cx={120} cy={172} r={3.5} fill="#FFFFFF" opacity={0.7} />
      <Circle cx={120} cy={184} r={3}   fill="#FFFFFF" opacity={0.5} />

      {/* ── SATCHEL BAG on left side ── */}
      {/* Strap going over left point */}
      <Path
        d="M85 148 Q70 158 72 175 Q74 185 82 188"
        stroke="#4A90D9"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
      {/* Bag body */}
      <Path
        d="M68 174 Q65 192 72 196 Q80 202 92 198 Q102 192 100 178 Q98 162 86 162 Q72 162 68 174 Z"
        fill="url(#satchel)"
      />
      {/* Bag flap */}
      <Path
        d="M68 174 Q66 168 76 164 Q88 160 100 168 Q100 178 86 178 Q72 180 68 174 Z"
        fill="#5B9FE0"
      />
      {/* Flap clasp */}
      <Ellipse cx={84} cy={178} rx={5} ry={3.5} fill="#FFE087" />
      {/* Bag detail line */}
      <Path
        d="M72 182 Q84 186 98 182"
        stroke="#3A78C9"
        strokeWidth={1}
        fill="none"
        opacity={0.45}
        strokeLinecap="round"
      />

      {/* ── FACE  ── */}
      {/* Eyes – large, glossy, like the ref */}
      <Ellipse cx={106} cy={124} rx={11} ry={12.5} fill="#1A0A3E" />
      <Ellipse cx={134} cy={124} rx={11} ry={12.5} fill="#1A0A3E" />
      {/* Eye shine – large upper + small lower */}
      <Circle cx={110} cy={119} r={4.5} fill="#FFFFFF" />
      <Circle cx={138} cy={119} r={4.5} fill="#FFFFFF" />
      <Circle cx={103} cy={128} r={2}   fill="#FFFFFF" opacity={0.5} />
      <Circle cx={131} cy={128} r={2}   fill="#FFFFFF" opacity={0.5} />

      {/* Cheeks */}
      <Ellipse cx={93}  cy={134} rx={11} ry={7} fill="#FF9EC4" opacity={0.38} />
      <Ellipse cx={147} cy={134} rx={11} ry={7} fill="#FF9EC4" opacity={0.38} />

      {/* Nose – tiny cute triangle */}
      <Path
        d="M118 133 L122 133 L120 136 Z"
        fill="#E6A800"
        opacity={0.75}
      />

      {/* Mouth – happy W-curve */}
      <Path
        d="M109 141 Q114 148 120 145 Q126 148 131 141"
        stroke="#1A0A3E"
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── FEET  ── */}
      {/* Left foot */}
      <Ellipse cx={100} cy={216} rx={16} ry={9} fill="#FFD740" />
      <Ellipse cx={100} cy={216} rx={16} ry={9} fill="#E6A800" opacity={0.2} />
      {/* Right foot */}
      <Ellipse cx={140} cy={216} rx={16} ry={9} fill="#FFD740" />
      <Ellipse cx={140} cy={216} rx={16} ry={9} fill="#E6A800" opacity={0.2} />
      {/* Toe lines */}
      <Path d="M90 215 Q100 218 110 215" stroke="#E6A800" strokeWidth={1} fill="none" opacity={0.4} strokeLinecap="round" />
      <Path d="M130 215 Q140 218 150 215" stroke="#E6A800" strokeWidth={1} fill="none" opacity={0.4} strokeLinecap="round" />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  Tiny decorative 4-point sparkle star
// ─────────────────────────────────────────────────────────────
function Sparkle({ size = 14, color = "#FFD166" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Path
        d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z"
        fill={color}
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  Crescent moon
// ─────────────────────────────────────────────────────────────
function Crescent({
  size = 28, color = "#C4B5FD", bg = "#1E0A4C",
}: { size?: number; color?: string; bg?: string }) {
  const r = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={r} cy={r} r={r}              fill={color} />
      <Circle cx={r + r * 0.3} cy={r - r * 0.06} r={r * 0.8} fill={bg} />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  Glow ring
// ─────────────────────────────────────────────────────────────
function GlowRing({ size }: { size: number }) {
  return (
    <Svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: "absolute" }}
    >
      <Defs>
        <RadialGradient id="ringG" cx="50%" cy="50%" r="50%">
          <Stop offset="0.5"  stopColor="#FFD740" stopOpacity="0"   />
          <Stop offset="0.72" stopColor="#FFD740" stopOpacity="0.5" />
          <Stop offset="1"    stopColor="#FFD740" stopOpacity="0"   />
        </RadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#ringG)" />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  Word mark
// ─────────────────────────────────────────────────────────────
function WordMark() {
  return (
    <View style={wm.wrap}>
      <View style={wm.row}>
        <Text style={wm.accent}>Bloom</Text>
        <Text style={wm.base}>Kids</Text>
      </View>
      <View style={wm.tagRow}>
        <View style={wm.line} />
        <Text style={wm.tag}>learn · play · grow</Text>
        <View style={wm.line} />
      </View>
    </View>
  );
}
const wm = StyleSheet.create({
  wrap:   { alignItems: "center", marginBottom: 20 },
  row:    { flexDirection: "row", alignItems: "baseline", gap: 3 },
  accent: { fontSize: 54, fontWeight: "900", color: "#FFD166", letterSpacing: -2 },
  base:   { fontSize: 54, fontWeight: "300", color: "#FFFFFF", letterSpacing: -2 },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2 },
  line:   { height: 1, width: 28, backgroundColor: "rgba(255,255,255,0.2)" },
  tag:    {
    fontSize: 10, color: "rgba(255,255,255,0.38)",
    letterSpacing: 3.5, fontWeight: "500", textTransform: "uppercase",
  },
});

// ═══════════════════════════════════════════════════════════════
//  SPLASH SCREEN
// ═══════════════════════════════════════════════════════════════
export default function Splash() {
  const router = useRouter();

  const scaleAnim   = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const bobY        = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlide   = useRef(new Animated.Value(22)).current;
  const glowScale   = useRef(new Animated.Value(0.7)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  // Subtle rotation for life
  const rotateAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 1,   friction: 5, tension: 60, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1,   duration: 420,            useNativeDriver: true }),
        Animated.spring(glowScale,   { toValue: 1,   friction: 6, tension: 50, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 1,   duration: 580,            useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1,   duration: 340, useNativeDriver: true }),
        Animated.timing(textSlide,   { toValue: 0,   duration: 340, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      // Float loop after text appears
      Animated.loop(
        Animated.sequence([
          Animated.timing(bobY,      { toValue: -11, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(bobY,      { toValue: 0,   duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ),
    ]).start();

    // Subtle gentle rock (±3°)
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: 1,  duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: -1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 0,  duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => router.replace("/welcome-screen"), 3400);
    return () => {
      ScreenOrientation.unlockAsync();
      clearTimeout(timer);
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-3deg", "3deg"],
  });

  return (
    <View style={s.container}>

      {/* ── Deep background ── */}
      <View style={s.sky} />

      {/* ── Background orbs ── */}
      <View style={s.orb1} />
      <View style={s.orb2} />
      <View style={s.orb3} />

      {/* ── Sparkle field ── */}
      <View style={{ position: "absolute", top: "7%",  left: "8%"   }}><Sparkle size={19} color="#FFD166" /></View>
      <View style={{ position: "absolute", top: "4%",  left: "28%"  }}><Sparkle size={10} color="#C4B5FD" /></View>
      <View style={{ position: "absolute", top: "8%",  left: "54%"  }}><Sparkle size={13} color="#DDD6FE" /></View>
      <View style={{ position: "absolute", top: "5%",  right: "9%"  }}><Sparkle size={18} color="#FFD166" /></View>
      <View style={{ position: "absolute", top: "13%", right: "27%" }}><Sparkle size={8}  color="#E9D5FF" /></View>
      <View style={{ position: "absolute", top: "21%", left: "5%"   }}><Sparkle size={9}  color="#DDD6FE" /></View>
      <View style={{ position: "absolute", top: "28%", right: "6%"  }}><Sparkle size={12} color="#C4B5FD" /></View>
      <View style={{ position: "absolute", bottom: "19%", left: "7%"  }}><Sparkle size={10} color="#E9D5FF" /></View>
      <View style={{ position: "absolute", bottom: "14%", right: "9%" }}><Sparkle size={14} color="#DDD6FE" /></View>
      <View style={{ position: "absolute", bottom: "27%", left: "36%"}}><Sparkle size={7}  color="#C4B5FD" /></View>

      {/* ── Crescents ── */}
      <View style={{ position: "absolute", top: "9%",    right: "15%", opacity: 0.65 }}><Crescent size={42} color="#C4B5FD" /></View>
      <View style={{ position: "absolute", top: "34%",   left: "4%",   opacity: 0.38 }}><Crescent size={24} color="#DDD6FE" /></View>
      <View style={{ position: "absolute", bottom: "22%",right: "5%",  opacity: 0.32 }}><Crescent size={20} color="#E9D5FF" /></View>

      {/* ── Sparkle dots ── */}
      <View style={[s.dot, { top: "17%",    left: "44%",   width: 5, height: 5 }]} />
      <View style={[s.dot, { top: "24%",    left: "73%",   width: 4, height: 4 }]} />
      <View style={[s.dot, { top: "37%",    right: "11%",  width: 6, height: 6, opacity: 0.42 }]} />
      <View style={[s.dot, { bottom: "23%", left: "22%",   width: 5, height: 5, opacity: 0.38 }]} />

      {/* ── Word mark fades in ── */}
      <Animated.View style={{
        opacity: textOpacity,
        transform: [{ translateY: textSlide }],
        alignItems: "center",
        marginBottom: 16,
      }}>
        <WordMark />
      </Animated.View>

      {/* ── Glow ring + Star mascot ── */}
      <Animated.View style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }, { translateY: bobY }],
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Glow ring behind */}
        <Animated.View style={{
          position: "absolute",
          opacity: glowOpacity,
          transform: [{ scale: glowScale }],
        }}>
          <GlowRing size={300} />
        </Animated.View>

        {/* Star mascot with gentle rock */}
        <Animated.View style={{ transform: [{ rotate }] }}>
          <StarMascot size={215} />
        </Animated.View>
      </Animated.View>

      {/* ── Bottom arc ── */}
      <View style={s.bottomArc} />

    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  sky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#170840",
  },
  orb1: {
    position: "absolute", top: "-14%", left: "-20%",
    width: 330, height: 330, borderRadius: 165,
    backgroundColor: "#5B21B6", opacity: 0.52,
  },
  orb2: {
    position: "absolute", bottom: "-16%", right: "-15%",
    width: 290, height: 290, borderRadius: 145,
    backgroundColor: "#6D28D9", opacity: 0.44,
  },
  orb3: {
    position: "absolute", top: "40%", left: "18%",
    width: 210, height: 210, borderRadius: 105,
    backgroundColor: "#7C3AED", opacity: 0.12,
  },
  dot: {
    position: "absolute",
    borderRadius: 50,
    backgroundColor: "#E9D5FF",
    opacity: 0.52,
  },
  bottomArc: {
    position: "absolute", bottom: -95,
    width: "155%", height: 175, borderRadius: 90,
    backgroundColor: "#0F0530", opacity: 0.6,
  },
});