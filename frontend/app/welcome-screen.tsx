import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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
  Stop,
} from "react-native-svg";

const { width: SW, height: SH } = Dimensions.get("window");

// ─────────────────────────────────────────────────────────────
//  PEEKING STAR MASCOT (large, torso crops below card edge)
//  Matches the reference: star body, blue vest, satchel bag
// ─────────────────────────────────────────────────────────────
function PeekingStarMascot() {
  // ViewBox 390×400, mascot centred at (195, 260)
  // Lower body crops under the card — same trick as the old bunny
  return (
    <Svg
      width={SW * 0.88}
      height={SH * 0.52}
      viewBox="0 0 390 420"
      style={{ overflow: "visible" }}
    >
      <Defs>
        <LinearGradient id="pStarBody" x1="0.1" y1="0" x2="0.4" y2="1">
          <Stop offset="0"   stopColor="#FFE87A" />
          <Stop offset="0.6" stopColor="#FFCA28" />
          <Stop offset="1"   stopColor="#F5B800" />
        </LinearGradient>
        <LinearGradient id="pStarShade" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0"   stopColor="#FFD740" stopOpacity="0"    />
          <Stop offset="1"   stopColor="#C68A00" stopOpacity="0.22" />
        </LinearGradient>
        <LinearGradient id="pOutfit" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#76BCFF" />
          <Stop offset="1" stopColor="#4A90D9" />
        </LinearGradient>
        <LinearGradient id="pSatchel" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#64ABEC" />
          <Stop offset="1" stopColor="#3A78C9" />
        </LinearGradient>
        <RadialGradient id="pGlow" cx="50%" cy="55%" r="50%">
          <Stop offset="0"   stopColor="#FFD740" stopOpacity="0.22" />
          <Stop offset="1"   stopColor="#FFD740" stopOpacity="0"    />
        </RadialGradient>
      </Defs>

      {/* Soft glow halo */}
      <Ellipse cx={195} cy={290} rx={170} ry={100} fill="url(#pGlow)" />

      {/* ── STAR BODY  (large 5-point star, centre 195,245) ──
          outer r=148, inner r=66, gives chunky proportions       */}
      <Path
        d={star5(195, 245, 148, 66)}
        fill="url(#pStarBody)"
      />
      <Path
        d={star5(195, 245, 148, 66)}
        fill="url(#pStarShade)"
      />

      {/* ── OUTFIT VEST ── */}
      <Path
        d="M148 258 Q148 330 195 338 Q242 330 242 258 Q228 270 195 273 Q162 270 148 258 Z"
        fill="url(#pOutfit)"
      />
      {/* Collar flaps */}
      <Path d="M182 258 Q184 288 188 294 Q184 280 182 258 Z" fill="#FFFFFF" opacity={0.6} />
      <Path d="M208 258 Q206 288 202 294 Q206 280 208 258 Z" fill="#FFFFFF" opacity={0.6} />
      {/* Buttons */}
      <Circle cx={195} cy={278} r={5}   fill="#FFFFFF" opacity={0.75} />
      <Circle cx={195} cy={296} r={4.5} fill="#FFFFFF" opacity={0.55} />
      <Circle cx={195} cy={312} r={4}   fill="#FFFFFF" opacity={0.35} />

      {/* ── SATCHEL BAG on left ── */}
      {/* Strap */}
      <Path
        d="M138 252 Q115 272 118 298 Q120 312 132 318"
        stroke="#4A90D9"
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
      {/* Bag body */}
      <Path
        d="M104 296 Q100 326 112 334 Q125 342 145 336 Q163 328 160 308 Q157 286 140 282 Q118 278 104 296 Z"
        fill="url(#pSatchel)"
      />
      {/* Bag flap */}
      <Path
        d="M104 296 Q102 280 120 272 Q140 264 160 278 Q160 296 140 300 Q118 304 104 296 Z"
        fill="#6DB4F2"
      />
      {/* Clasp */}
      <Ellipse cx={132} cy={300} rx={8} ry={6} fill="#FFE087" />
      <Ellipse cx={132} cy={300} rx={4} ry={3} fill="#FFCA28" />

      {/* ── FACE ── */}
      {/* Eyes – large oval, very expressive */}
      <Ellipse cx={172} cy={228} rx={19} ry={22} fill="#1A0A3E" />
      <Ellipse cx={218} cy={228} rx={19} ry={22} fill="#1A0A3E" />
      {/* Shine spots */}
      <Circle cx={178} cy={221} r={8}   fill="#FFFFFF" />
      <Circle cx={224} cy={221} r={8}   fill="#FFFFFF" />
      <Circle cx={167} cy={233} r={3.5} fill="#FFFFFF" opacity={0.45} />
      <Circle cx={213} cy={233} r={3.5} fill="#FFFFFF" opacity={0.45} />

      {/* Cheeks */}
      <Ellipse cx={150} cy={244} rx={18} ry={12} fill="#FF9EC4" opacity={0.35} />
      <Ellipse cx={240} cy={244} rx={18} ry={12} fill="#FF9EC4" opacity={0.35} />

      {/* Nose */}
      <Path
        d="M192 240 L198 240 L195 244 Z"
        fill="#C68A00"
        opacity={0.65}
      />

      {/* Mouth – gentle happy curve */}
      <Path
        d="M178 252 Q195 266 212 252"
        stroke="#1A0A3E"
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── FEET (just tips visible above card) ── */}
      <Ellipse cx={162} cy={376} rx={26} ry={14} fill="#FFCA28" />
      <Ellipse cx={228} cy={376} rx={26} ry={14} fill="#FFCA28" />
      <Ellipse cx={162} cy={376} rx={26} ry={14} fill="#C68A00" opacity={0.18} />
      <Ellipse cx={228} cy={376} rx={26} ry={14} fill="#C68A00" opacity={0.18} />
    </Svg>
  );
}

/**
 * Generates an SVG path string for a 5-point star.
 * cx, cy = centre; R = outer radius; r = inner radius
 */
function star5(cx: number, cy: number, R: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    // Start at top (-π/2), alternate outer / inner radius
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? R : r;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ") + " Z";
}

// ─────────────────────────────────────────────────────────────
//  Decorative 4-point sparkle
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
//  Floating decoration circle
// ─────────────────────────────────────────────────────────────
function FloatBubble({
  size, color, opacity = 0.18,
}: { size: number; color: string; opacity?: number }) {
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} opacity={opacity} />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  Arrow icon for CTA button
// ─────────────────────────────────────────────────────────────
function ArrowRight() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Path
        d="M3 9 L15 9 M10 4.5 L15 9 L10 13.5"
        stroke="#7C4DFF"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════
//  WELCOME SCREEN
// ═══════════════════════════════════════════════════════════════
export default function Welcome() {
  const router = useRouter();

  const mascotSlide = useRef(new Animated.Value(90)).current;
  const mascotOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide   = useRef(new Animated.Value(70)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const btnScale    = useRef(new Animated.Value(1)).current;
  // Gentle idle float for mascot
  const floatY      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(mascotSlide, {
        toValue: 0, friction: 7, tension: 42, useNativeDriver: true,
      }),
      Animated.timing(mascotOpacity, {
        toValue: 1, duration: 480, useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1, duration: 520, delay: 180,
        easing: Easing.out(Easing.quad), useNativeDriver: true,
      }),
      Animated.timing(cardSlide, {
        toValue: 0, duration: 520, delay: 180,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
    ]).start(() => {
      // After entrance, start idle float
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatY, { toValue: -8,  duration: 1300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(floatY, { toValue: 0,   duration: 1300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const onPressIn  = () => Animated.spring(btnScale, { toValue: 0.93, useNativeDriver: true, friction: 8 }).start();
  const onPressOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true, friction: 6 }).start();

  return (
    <View style={st.root}>

      {/* ── Background ── */}
      <View style={st.bgDeep} />
      {/* Curved mid-ground */}
      <View style={st.bgMid} />

      {/* ── Floating decoration bubbles ── */}
      <View style={[st.abs, { top: 38, left: -22 }]}>
        <FloatBubble size={110} color="#7C4DFF" opacity={0.2} />
      </View>
      <View style={[st.abs, { top: 70, right: -30 }]}>
        <FloatBubble size={85} color="#FFD740" opacity={0.14} />
      </View>
      <View style={[st.abs, { top: 200, left: 30 }]}>
        <FloatBubble size={55} color="#C4B5FD" opacity={0.16} />
      </View>

      {/* ── Sparkles ── */}
      <View style={[st.abs, { top: 64,  right: 48 }]}><Sparkle size={17} color="#FFD166" /></View>
      <View style={[st.abs, { top: 122, left: 36  }]}><Sparkle size={11} color="#FF9EC4" /></View>
      <View style={[st.abs, { top: 88,  right: 92 }]}><Sparkle size={8}  color="#B8A0FF" /></View>
      <View style={[st.abs, { top: 190, right: 30 }]}><Sparkle size={13} color="#3DD6A3" /></View>
      <View style={[st.abs, { top: 155, left: 16  }]}><Sparkle size={7}  color="#FFD166" /></View>

      {/* ── App name ── */}
      <View style={st.nameRow}>
        <Text style={st.nameAccent}>Bloom</Text>
        <Text style={st.nameBase}>Kids</Text>
      </View>

      {/* ── Star mascot slides up, then floats ── */}
      <Animated.View
        style={[
          st.mascotWrap,
          {
            opacity: mascotOpacity,
            transform: [{ translateY: mascotSlide }, { translateY: floatY }],
          },
        ]}
      >
        <PeekingStarMascot />
      </Animated.View>

      {/* ── Bottom card ── */}
      <Animated.View
        style={[
          st.card,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardSlide }],
          },
        ]}
      >
        {/* Drag pill */}
        <View style={st.pill} />

        {/* Heading */}
        <Text style={st.heading}>
          Ready to{"\n"}
          <Text style={st.headingAccent}>Learn & Play?</Text>
        </Text>

        <Text style={st.subtitle}>
          A world of games, stories, and growth — built for curious little minds.
        </Text>

        {/* Page dots */}
        <View style={st.dotsRow}>
          <View style={[st.dot, st.dotActive]} />
          <View style={st.dot} />
          <View style={st.dot} />
        </View>

        {/* CTA button */}
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={st.btn}
            onPress={() => router.replace("/AuthScreen")}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={1}
          >
            <Text style={st.btnText}>Get started</Text>
            <View style={st.btnArrow}>
              <ArrowRight />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Sign-in link */}
        <TouchableOpacity
          style={st.signinRow}
          onPress={() => router.replace("/AuthScreen")}
        >
          <Text style={st.signinText}>Already have an account?  </Text>
          <Text style={st.signinLink}>Sign in</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

// ─────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────
const CARD_HEIGHT = SH * 0.41;

const st = StyleSheet.create({
  root: { flex: 1, overflow: "hidden" },
  abs:  { position: "absolute" },

  bgDeep: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2A1275",
  },
  bgMid: {
    position: "absolute",
    bottom: 0, width: "100%",
    height: SH * 0.56,
    backgroundColor: "#4B2FA0",
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },

  /* App name */
  nameRow: {
    position: "absolute",
    top: 58, alignSelf: "center",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  nameAccent: { fontSize: 34, fontWeight: "900", color: "#FFD166", letterSpacing: -0.8 },
  nameBase:   { fontSize: 34, fontWeight: "300", color: "#FFFFFF", letterSpacing: -0.8 },

  /* Mascot */
  mascotWrap: {
    position: "absolute",
    bottom: CARD_HEIGHT - 12,   // sits right on top of card
    left: 0, right: 0,
    alignItems: "center",
    zIndex: 10,
  },

  /* Card */
  card: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: CARD_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 36,
    shadowColor: "#1A0A4C",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 16,
    zIndex: 5,
  },

  pill: {
    width: 48, height: 5, borderRadius: 3,
    backgroundColor: "#EDE8FF",
    alignSelf: "center",
    marginBottom: 24,
  },

  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A0A4C",
    lineHeight: 38,
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  headingAccent: { color: "#7C4DFF" },

  subtitle: {
    fontSize: 14,
    color: "#7B6E9A",
    lineHeight: 22,
    marginBottom: 18,
    fontWeight: "500",
  },

  dotsRow: { flexDirection: "row", gap: 6, marginBottom: 20 },
  dot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: "#EDE8FF",
  },
  dotActive: { width: 24, backgroundColor: "#7C4DFF" },

  btn: {
    backgroundColor: "#7C4DFF",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#7C4DFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 8,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  btnArrow: {
    width: 32, height: 32, borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  signinRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  signinText: { fontSize: 13, color: "#9B8DC0", fontWeight: "500" },
  signinLink: { fontSize: 13, color: "#7C4DFF", fontWeight: "800" },
});