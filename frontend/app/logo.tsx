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
  Stop
} from "react-native-svg";

/* ─── Full SVG Bunny ─────────────────────────────────────── */
function SplashBunny({ size = 220 }: { size?: number }) {
  const s = size / 220;
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 220 240">
      <Defs>
        <LinearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#EDE8FF" />
        </LinearGradient>
        <LinearGradient id="earInner" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C9B0F7" />
          <Stop offset="1" stopColor="#A07AF0" />
        </LinearGradient>
      </Defs>

      {/* shadow */}
      <Ellipse cx={110} cy={234} rx={60} ry={8} fill="#5B3EA0" opacity={0.18} />

      {/* left ear */}
      <Ellipse cx={68}  cy={72} rx={22} ry={52} fill="#EDE8FF" />
      <Ellipse cx={68}  cy={72} rx={12} ry={38} fill="url(#earInner)" />

      {/* right ear */}
      <Ellipse cx={152} cy={72} rx={22} ry={52} fill="#EDE8FF" />
      <Ellipse cx={152} cy={72} rx={12} ry={38} fill="url(#earInner)" />

      {/* body */}
      <Ellipse cx={110} cy={200} rx={65} ry={52} fill="url(#bodyG)" />

      {/* head */}
      <Circle cx={110} cy={145} r={62} fill="#FFFFFF" />

      {/* cheeks */}
      <Circle cx={80}  cy={158} r={16} fill="#FFB3C6" opacity={0.35} />
      <Circle cx={140} cy={158} r={16} fill="#FFB3C6" opacity={0.35} />

      {/* eyes */}
      <Circle cx={92}  cy={140} r={10} fill="#2D1A6E" />
      <Circle cx={128} cy={140} r={10} fill="#2D1A6E" />
      {/* eye shine */}
      <Circle cx={95}  cy={137} r={4}  fill="#FFFFFF" />
      <Circle cx={131} cy={137} r={4}  fill="#FFFFFF" />
      <Circle cx={89}  cy={143} r={2}  fill="#FFFFFF" opacity={0.6} />
      <Circle cx={125} cy={143} r={2}  fill="#FFFFFF" opacity={0.6} />

      {/* nose */}
      <Ellipse cx={110} cy={154} rx={7} ry={5} fill="#FF9EC4" />

      {/* mouth */}
      <Path
        d="M96 163 Q110 174 124 163"
        stroke="#2D1A6E"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* tummy oval */}
      <Ellipse cx={110} cy={205} rx={34} ry={28} fill="#EDE8FF" opacity={0.7} />

      {/* paws */}
      <Ellipse cx={72}  cy={228} rx={18} ry={10} fill="#FFFFFF" />
      <Ellipse cx={148} cy={228} rx={18} ry={10} fill="#FFFFFF" />
      <Ellipse cx={72}  cy={228} rx={18} ry={10} fill="#C9B0F7" opacity={0.3} />
      <Ellipse cx={148} cy={228} rx={18} ry={10} fill="#C9B0F7" opacity={0.3} />
    </Svg>
  );
}

/* ─── Cloud SVG ──────────────────────────────────────────── */
function Cloud({ width = 110, opacity = 0.18 }: { width?: number; opacity?: number }) {
  const h = width * 0.55;
  return (
    <Svg width={width} height={h} viewBox="0 0 110 60">
      <Path
        d="M20 50 Q5 50 5 38 Q5 26 18 24 Q18 10 34 10 Q42 2 54 8 Q64 0 76 8 Q90 6 94 18 Q106 20 106 32 Q106 50 88 50 Z"
        fill="#FFFFFF"
        opacity={opacity}
      />
    </Svg>
  );
}

/* ─── Star sparkle ───────────────────────────────────────── */
function Sparkle({ size = 14, color = "#FFD166" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path
        d="M7 0 L8 5.5 L13.5 7 L8 8.5 L7 14 L6 8.5 L0.5 7 L6 5.5 Z"
        fill={color}
      />
    </Svg>
  );
}

/* ─── App name word mark ─────────────────────────────────── */
function LogoWordMark() {
  return (
    <View style={wm.wrap}>
      <Text style={wm.word}>
        <Text style={wm.accent}>Bloom</Text>
        <Text style={wm.base}>Kids</Text>
      </Text>
      <View style={wm.tagLine}>
        <View style={wm.line} />
        <Text style={wm.tag}>learn  play  grow</Text>
        <View style={wm.line} />
      </View>
    </View>
  );
}

const wm = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  word: {
    fontSize: 46,
    letterSpacing: -1,
    lineHeight: 52,
  },
  accent: {
    color: "#FFD166",
    fontWeight: "900",
  },
  base: {
    color: "#FFFFFF",
    fontWeight: "300",
  },
  tagLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  line: {
    height: 1,
    width: 28,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  tag: {
    fontSize: 10,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2.5,
    fontWeight: "500",
    textTransform: "uppercase",
  },
});

/* ══════════════════════════════════════════════════════════ */
export default function Splash() {
  const router = useRouter();

  const scaleAnim   = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const bobY        = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlide   = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    Animated.sequence([
      // bunny pops in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // text fades in
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // idle bob loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(bobY, { toValue: -12, duration: 950, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(bobY, { toValue: 0,   duration: 950, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ),
    ]).start();

    const timer = setTimeout(() => router.replace("/welcome-screen"), 3000);
    return () => {
      ScreenOrientation.unlockAsync();
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>

      {/* deep purple bg */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.bgTop} />
        <View style={styles.bgBottom} />
      </View>

      {/* clouds */}
      <View style={[styles.cloud, { top: 80,  left: -18,  transform: [{ scaleX: -1 }] }]}>
        <Cloud width={130} opacity={0.14} />
      </View>
      <View style={[styles.cloud, { top: 130, right: -10 }]}>
        <Cloud width={100} opacity={0.1} />
      </View>
      <View style={[styles.cloud, { top: 200, left: 40 }]}>
        <Cloud width={80} opacity={0.08} />
      </View>

      {/* sparkles */}
      <View style={{ position: "absolute", top: 160, right: 52 }}>
        <Sparkle size={16} color="#FFD166" />
      </View>
      <View style={{ position: "absolute", top: 210, left: 48 }}>
        <Sparkle size={10} color="#FF9EC4" />
      </View>
      <View style={{ position: "absolute", top: 100, right: 80 }}>
        <Sparkle size={8} color="#A07AF0" />
      </View>
      <View style={{ position: "absolute", top: 300, left: 28 }}>
        <Sparkle size={12} color="#3DD6A3" />
      </View>

      {/* word mark */}
      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: textSlide }],
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <LogoWordMark />
      </Animated.View>

      {/* bunny */}
      <Animated.View
        style={{
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }, { translateY: bobY }],
        }}
      >
        <SplashBunny size={210} />
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bgTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#3A1A8C",
  },
  bgBottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "38%",
    backgroundColor: "#5B3EA0",
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  cloud: {
    position: "absolute",
  },
});
