import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Stop
} from "react-native-svg";

const { width: SW, height: SH } = Dimensions.get("window");

/* ─── Large peeking bunny (crops at bottom like the cat ref) */
function PeekingBunny() {
  return (
    <Svg
      width={SW}
      height={SH * 0.48}
      viewBox="0 0 390 380"
      style={{ overflow: "visible" }}
    >
      <Defs>
        <LinearGradient id="wbody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#EDE8FF" />
        </LinearGradient>
        <LinearGradient id="wear" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C9B0F7" />
          <Stop offset="1" stopColor="#9B6FEE" />
        </LinearGradient>
        <RadialGradient id="bgCircle" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#7C4DFF" stopOpacity="0.18" />
          <Stop offset="1" stopColor="#7C4DFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* glow halo behind bunny */}
      <Ellipse cx={195} cy={280} rx={170} ry={110} fill="url(#bgCircle)" />

      {/* ── LEFT EAR ── */}
      <Ellipse cx={128} cy={118} rx={36} ry={88} fill="#EDE8FF" />
      <Ellipse cx={128} cy={118} rx={20} ry={64} fill="url(#wear)" />

      {/* ── RIGHT EAR ── */}
      <Ellipse cx={262} cy={118} rx={36} ry={88} fill="#EDE8FF" />
      <Ellipse cx={262} cy={118} rx={20} ry={64} fill="url(#wear)" />

      {/* ── BODY (large, crops off bottom) ── */}
      <Ellipse cx={195} cy={420} rx={145} ry={130} fill="url(#wbody)" />

      {/* ── HEAD ── */}
      <Circle cx={195} cy={270} r={115} fill="#FFFFFF" />

      {/* cheeks */}
      <Circle cx={143} cy={288} r={28} fill="#FFB3C6" opacity={0.32} />
      <Circle cx={247} cy={288} r={28} fill="#FFB3C6" opacity={0.32} />

      {/* ── EYES ── */}
      <Circle cx={164} cy={258} r={18} fill="#2D1A6E" />
      <Circle cx={226} cy={258} r={18} fill="#2D1A6E" />
      {/* shine */}
      <Circle cx={169} cy={252} r={7}  fill="#FFFFFF" />
      <Circle cx={231} cy={252} r={7}  fill="#FFFFFF" />
      <Circle cx={160} cy={262} r={3.5} fill="#FFFFFF" opacity={0.55} />
      <Circle cx={222} cy={262} r={3.5} fill="#FFFFFF" opacity={0.55} />

      {/* ── NOSE ── */}
      <Ellipse cx={195} cy={278} rx={11} ry={8} fill="#FF9EC4" />

      {/* ── MOUTH ── */}
      <Path
        d="M172 293 Q195 312 218 293"
        stroke="#2D1A6E"
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* tummy */}
      <Ellipse cx={195} cy={420} rx={74} ry={60} fill="#EDE8FF" opacity={0.65} />
    </Svg>
  );
}

/* ─── Clouds ─────────────────────────────────────────────── */
function CloudShape({ w = 120, op = 0.12 }: { w?: number; op?: number }) {
  const h = w * 0.52;
  return (
    <Svg width={w} height={h} viewBox="0 0 120 62">
      <Path
        d="M22 54 Q4 54 4 40 Q4 26 20 24 Q20 8 38 8 Q48 0 62 8 Q74 0 88 10 Q104 8 108 22 Q122 24 120 38 Q118 54 98 54 Z"
        fill="#FFFFFF"
        opacity={op}
      />
    </Svg>
  );
}

/* ─── Sparkle ─────────────────────────────────────────────── */
function Star({ size = 14, color = "#FFD166" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path
        d="M7 0 L8.3 5.4 L14 7 L8.3 8.6 L7 14 L5.7 8.6 L0 7 L5.7 5.4 Z"
        fill={color}
      />
    </Svg>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Welcome() {
  const router = useRouter();

  const bunnyAnim  = useRef(new Animated.Value(80)).current;
  const cardAnim   = useRef(new Animated.Value(60)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const btnScale   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(bunnyAnim, {
        toValue: 0,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 500,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(btnScale, { toValue: 0.94, useNativeDriver: true, friction: 8 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, friction: 6 }).start();
  };

  return (
    <View style={styles.root}>

      {/* ── Background layers ── */}
      <View style={styles.bgDeep} />
      <View style={styles.bgMid} />

      {/* ── Clouds ── */}
      <View style={[styles.abs, { top: 55,  left: -18 }]}>
        <CloudShape w={140} op={0.13} />
      </View>
      <View style={[styles.abs, { top: 110, right: -12, transform: [{ scaleX: -1 }] }]}>
        <CloudShape w={110} op={0.09} />
      </View>
      <View style={[styles.abs, { top: 180, left: 55 }]}>
        <CloudShape w={80} op={0.07} />
      </View>

      {/* ── Stars ── */}
      <View style={[styles.abs, { top: 68,  right: 52 }]}>
        <Star size={16} color="#FFD166" />
      </View>
      <View style={[styles.abs, { top: 130, left: 40 }]}>
        <Star size={10} color="#FF9EC4" />
      </View>
      <View style={[styles.abs, { top: 90,  right: 96 }]}>
        <Star size={8}  color="#B8A0FF" />
      </View>
      <View style={[styles.abs, { top: 195, right: 34 }]}>
        <Star size={12} color="#3DD6A3" />
      </View>

      {/* ── App name ── */}
      <View style={styles.nameRow}>
        <Text style={styles.nameAccent}>Bloom</Text>
        <Text style={styles.nameBase}>Kids</Text>
      </View>

      {/* ── Bunny slides up ── */}
      <Animated.View
        style={[
          styles.bunnyWrap,
          { transform: [{ translateY: bunnyAnim }] },
        ]}
      >
        <PeekingBunny />
      </Animated.View>

      {/* ── Bottom card ── */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardAnim }],
          },
        ]}
      >
        {/* card pill accent */}
        <View style={styles.cardPill} />

        <Text style={styles.cardTitle}>
          Ready to{"\n"}
          <Text style={styles.cardTitleAccent}>Learn and Play?</Text>
        </Text>

        <Text style={styles.cardSubtitle}>
          A world of games, stories and growth — built for curious little minds.
        </Text>

        {/* dots indicator */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* CTA */}
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.replace("/AuthScreen")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Text style={styles.btnText}>Get started</Text>
            <View style={styles.btnArrow}>
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
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* sign in link */}
        <TouchableOpacity
          onPress={() => router.replace("/AuthScreen")}
          style={styles.signinRow}
        >
          <Text style={styles.signinText}>Already have an account? </Text>
          <Text style={styles.signinLink}>Sign in</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: "hidden",
  },

  abs: {
    position: "absolute",
  },

  /* backgrounds */
  bgDeep: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#3A1A8C",
  },
  bgMid: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SH * 0.52,
    backgroundColor: "#5B3EA0",
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
  },

  /* app name top */
  nameRow: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  nameAccent: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFD166",
    letterSpacing: -0.5,
  },
  nameBase: {
    fontSize: 32,
    fontWeight: "300",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },

  /* bunny */
  bunnyWrap: {
    position: "absolute",
    bottom: SH * 0.28,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  /* bottom card */
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
    shadowColor: "#3A1A8C",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 14,
  },

  cardPill: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#EDE8FF",
    alignSelf: "center",
    marginBottom: 22,
  },

  cardTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1E1245",
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  cardTitleAccent: {
    color: "#7C4DFF",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#7B6E9A",
    lineHeight: 21,
    marginBottom: 20,
  },

  dots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 22,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#EDE8FF",
  },
  dotActive: {
    width: 22,
    backgroundColor: "#7C4DFF",
  },

  /* button */
  btn: {
    backgroundColor: "#7C4DFF",
    borderRadius: 18,
    paddingVertical: 17,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  btnArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  /* sign in */
  signinRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signinText: {
    fontSize: 13,
    color: "#9B8DC0",
  },
  signinLink: {
    fontSize: 13,
    color: "#7C4DFF",
    fontWeight: "700",
  },
});
