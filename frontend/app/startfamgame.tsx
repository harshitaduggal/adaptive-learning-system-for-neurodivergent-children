import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
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

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* ─── Design Tokens ──────────────────────────────────────── */
const NIGHT_DEEP    = "#0A0618";
const NIGHT_MID     = "#130C2E";
const INDIGO        = "#1E0A4C";
const VIOLET        = "#3D1A8C";
const AMETHYST      = "#7B5CF6";
const AMETHYST_SOFT = "#A78BFA";
const AMETHYST_PALE = "#EDE9FE";
const ROSE          = "#F472B6";
const ROSE_DEEP     = "#BE185D";
const GOLD          = "#FCD34D";
const GOLD_WARM     = "#F59E0B";
const CREAM         = "#FFFBF5";
const WHITE         = "#FFFFFF";
const TEXT_NIGHT    = "#1E1154";
const TEXT_DUSK     = "#6D5A9C";
const BLUSH         = "#FBCFE8";

/* ══════════════════════════════════════════════════════════
   BACKGROUND
══════════════════════════════════════════════════════════ */
function NightBackground() {
  return (
    <Svg
      width="100%"
      height={SCREEN_H}
      viewBox={`0 0 390 ${SCREEN_H}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0.15" y2="1">
          <Stop offset="0"    stopColor="#050210" />
          <Stop offset="0.3"  stopColor="#0E0626" />
          <Stop offset="0.65" stopColor="#1A0840" />
          <Stop offset="1"    stopColor="#2D1060" />
        </LinearGradient>
        <RadialGradient id="moonGlow" cx="0.83" cy="0.13" r="0.35">
          <Stop offset="0"   stopColor="#FDE68A" stopOpacity="0.18" />
          <Stop offset="0.5" stopColor="#F59E0B" stopOpacity="0.07" />
          <Stop offset="1"   stopColor="#F59E0B" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="centerGlow" cx="0.5" cy="0.48" r="0.4">
          <Stop offset="0"   stopColor="#7B5CF6" stopOpacity="0.1" />
          <Stop offset="1"   stopColor="#7B5CF6" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="hill1" x1="0" y1="0" x2="0.1" y2="1">
          <Stop offset="0" stopColor="#1A0840" />
          <Stop offset="1" stopColor="#0A0618" />
        </LinearGradient>
        <LinearGradient id="hill2" x1="0" y1="0" x2="0.1" y2="1">
          <Stop offset="0" stopColor="#220E52" />
          <Stop offset="1" stopColor="#0E0626" />
        </LinearGradient>
        <LinearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#B39DDB" stopOpacity="0.22" />
          <Stop offset="1" stopColor="#B39DDB" stopOpacity="0.04" />
        </LinearGradient>
      </Defs>

      {/* Sky base */}
      <Rect width={390} height={SCREEN_H} fill="url(#sky)" />

      {/* Moon atmospheric glow */}
      <Rect width={390} height={SCREEN_H} fill="url(#moonGlow)" />

      {/* Center scene glow */}
      <Rect width={390} height={SCREEN_H} fill="url(#centerGlow)" />

      {/* Stars — tiered layers for depth */}
      {/* Distant tiny stars */}
      {[
        [18,14],[44,8],[76,22],[108,6],[140,18],[172,4],[204,16],[236,9],[268,21],[300,7],[332,19],[360,12],
        [30,44],[62,36],[94,50],[126,32],[158,46],[190,28],[222,42],[254,34],[286,48],[318,30],[350,44],
        [8,74],[38,66],[70,80],[102,62],[134,76],[166,58],[198,72],[230,64],[262,78],[294,60],[326,74],[358,68],
        [22,104],[52,96],[84,110],[116,92],[148,106],[180,88],[212,102],[244,94],[276,108],[308,90],[340,104],
        [14,134],[46,126],[78,140],[110,122],[142,136],[174,118],[206,132],[238,124],[270,138],[302,120],[334,134],
        [26,164],[58,156],[90,170],[122,152],[154,166],[186,148],[218,162],[250,154],[282,168],[314,150],[346,164],
      ].map(([cx, cy], i) => (
        <Circle
          key={`ds${i}`}
          cx={cx} cy={cy}
          r={i % 7 === 0 ? 1.8 : i % 4 === 0 ? 1.3 : 0.9}
          fill={WHITE}
          opacity={0.2 + (i % 5) * 0.08}
        />
      ))}

      {/* Medium bright stars */}
      {[
        [55,18,2.2,0.9],[148,10,1.8,0.75],[240,28,2,0.85],[320,16,2.2,0.8],
        [80,52,1.6,0.7],[200,40,2,0.85],[350,58,1.8,0.75],
        [36,88,1.8,0.8],[165,78,2.2,0.9],[290,92,1.6,0.7],
      ].map(([cx,cy,r,op], i) => (
        <Circle key={`ms${i}`} cx={cx} cy={cy} r={r} fill={WHITE} opacity={op} />
      ))}

      {/* 4-point sparkle constellations */}
      {[
        { x: 62,  y: 22,  s: 5,  c: WHITE,          op: 0.9 },
        { x: 174, y: 14,  s: 4,  c: GOLD,            op: 0.85 },
        { x: 298, y: 36,  s: 6,  c: WHITE,           op: 0.8 },
        { x: 112, y: 56,  s: 4,  c: AMETHYST_SOFT,   op: 0.7 },
        { x: 336, y: 62,  s: 5,  c: GOLD,            op: 0.75 },
        { x: 42,  y: 98,  s: 4,  c: WHITE,           op: 0.65 },
        { x: 228, y: 82,  s: 5,  c: AMETHYST_SOFT,   op: 0.7 },
        { x: 368, y: 110, s: 4,  c: WHITE,           op: 0.6 },
      ].map(({x,y,s,c,op}, i) => (
        <Path
          key={`sp${i}`}
          d={`M${x} ${y-s} L${x+s*0.3} ${y-s*0.3} L${x+s} ${y} L${x+s*0.3} ${y+s*0.3} L${x} ${y+s} L${x-s*0.3} ${y+s*0.3} L${x-s} ${y} L${x-s*0.3} ${y-s*0.3} Z`}
          fill={c} opacity={op}
        />
      ))}

      {/* Layered hills */}
      <Path
        d={`M0 ${SCREEN_H*0.72} Q60 ${SCREEN_H*0.63} 130 ${SCREEN_H*0.69} Q200 ${SCREEN_H*0.75} 280 ${SCREEN_H*0.65} Q340 ${SCREEN_H*0.58} 390 ${SCREEN_H*0.66} L390 ${SCREEN_H} L0 ${SCREEN_H} Z`}
        fill="url(#hill1)"
      />
      <Path
        d={`M0 ${SCREEN_H*0.79} Q80 ${SCREEN_H*0.72} 160 ${SCREEN_H*0.78} Q240 ${SCREEN_H*0.84} 320 ${SCREEN_H*0.75} Q360 ${SCREEN_H*0.70} 390 ${SCREEN_H*0.76} L390 ${SCREEN_H} L0 ${SCREEN_H} Z`}
        fill="url(#hill2)" opacity={0.8}
      />

      {/* Ground shimmer */}
      <Path
        d={`M0 ${SCREEN_H*0.85} Q195 ${SCREEN_H*0.80} 390 ${SCREEN_H*0.85} L390 ${SCREEN_H} L0 ${SCREEN_H} Z`}
        fill="url(#ground)"
      />

      {/* Horizon glow */}
      <Ellipse
        cx={195} cy={SCREEN_H*0.72}
        rx={180} ry={40}
        fill={AMETHYST} opacity={0.06}
      />

      {/* Ground accent dots */}
      {[50,110,170,230,290,350].map((x, i) => (
        <Circle
          key={`gd${i}`}
          cx={x}
          cy={SCREEN_H*0.81 + (i%2)*14}
          r={i%3===0?3.5:2.5}
          fill={i%2===0 ? ROSE : AMETHYST_SOFT}
          opacity={0.35}
        />
      ))}
    </Svg>
  );
}

/* ══════════════════════════════════════════════════════════
   MOON (refined crescent)
══════════════════════════════════════════════════════════ */
function Moon({ size = 64 }: { size?: number }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 2200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id="moonFill" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
            <Stop offset="0"   stopColor="#FEF9C3" />
            <Stop offset="0.5" stopColor="#FDE047" />
            <Stop offset="1"   stopColor="#F59E0B" />
          </LinearGradient>
          <RadialGradient id="moonShine" cx="0.35" cy="0.25" r="0.5">
            <Stop offset="0" stopColor={WHITE} stopOpacity="0.55" />
            <Stop offset="1" stopColor={WHITE} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {/* Halo */}
        <Circle cx={32} cy={32} r={30} fill={GOLD_WARM} opacity={0.08} />
        <Circle cx={32} cy={32} r={24} fill={GOLD_WARM} opacity={0.05} />
        {/* Crescent body */}
        <Path d="M32 6 A26 26 0 1 1 32 58 A17 17 0 1 0 32 6 Z" fill="url(#moonFill)" />
        <Path d="M32 6 A26 26 0 1 1 32 58 A17 17 0 1 0 32 6 Z" fill="url(#moonShine)" />
        {/* Face */}
        <Circle cx={38} cy={22} r={3.2}  fill="#78350F" opacity={0.6} />
        <Circle cx={46} cy={30} r={2.6}  fill="#78350F" opacity={0.6} />
        <Path d="M35 37 Q41 43 47 37" stroke="#78350F" strokeWidth={2.2}
          fill="none" strokeLinecap="round" opacity={0.6} />
        <Ellipse cx={33} cy={39} rx={5.5} ry={3} fill={GOLD_WARM} opacity={0.3} />
        {/* Shine dot */}
        <Circle cx={34} cy={13} r={3} fill={WHITE} opacity={0.4} />
      </Svg>
    </Animated.View>
  );
}

/* ══════════════════════════════════════════════════════════
   FLOATING SPARKLES
══════════════════════════════════════════════════════════ */
function FloatingSparkle({ x, y, size, color, delay, shape = "star" }: {
  x: number; y: number; size: number; color: string; delay: number; shape?: "star"|"diamond"
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const opac = useRef(new Animated.Value(0.3)).current;
  const rot  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.sequence([
            Animated.timing(anim, { toValue: -14, duration: 1800, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0,   duration: 1800, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(opac, { toValue: 1,   duration: 1800, useNativeDriver: true }),
            Animated.timing(opac, { toValue: 0.2, duration: 1800, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(rot, { toValue: 1,  duration: 3600, useNativeDriver: true }),
          ]),
        ]),
      ])
    ).start();
  }, []);

  const rotate = rot.interpolate({ inputRange: [0,1], outputRange: ["0deg","360deg"] });
  const s = size / 2;

  return (
    <Animated.View style={{
      position: "absolute", left: x, top: y,
      transform: [{ translateY: anim }, { rotate }],
      opacity: opac,
    }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {shape === "star" ? (
          <Path
            d={`M${s} 0 L${s+s*0.22} ${s*0.78} L${size} ${s} L${s+s*0.22} ${s+s*0.22} L${s} ${size} L${s-s*0.22} ${s+s*0.22} L0 ${s} L${s-s*0.22} ${s*0.78} Z`}
            fill={color}
          />
        ) : (
          <Path
            d={`M${s} 0 L${size} ${s} L${s} ${size} L0 ${s} Z`}
            fill={color}
          />
        )}
      </Svg>
    </Animated.View>
  );
}

/* ══════════════════════════════════════════════════════════
   STAR MASCOT — HERO (waving, big)
══════════════════════════════════════════════════════════ */
function StarMascotHero({ size = 130 }: { size?: number }) {
  const bob   = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;
  const wave  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -9, duration: 1100, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0,  duration: 1100, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(wave, { toValue: 1,  duration: 380, useNativeDriver: true }),
        Animated.timing(wave, { toValue: -1, duration: 380, useNativeDriver: true }),
        Animated.timing(wave, { toValue: 1,  duration: 380, useNativeDriver: true }),
        Animated.timing(wave, { toValue: 0,  duration: 380, useNativeDriver: true }),
        Animated.delay(1400),
      ])
    ).start();
    const doBlink = () => {
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.05, duration: 65, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1,    duration: 65, useNativeDriver: true }),
      ]).start(() => setTimeout(doBlink, 2800 + Math.random() * 1200));
    };
    setTimeout(doBlink, 1800);
  }, []);

  const waveRot = wave.interpolate({ inputRange: [-1, 1], outputRange: ["-28deg", "28deg"] });

  return (
    <Animated.View style={{ transform: [{ translateY: bob }], width: size, height: size * 1.3 }}>
      <Svg width={size} height={size * 1.3} viewBox="0 0 130 170">
        <Defs>
          <LinearGradient id="hBody" x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0"   stopColor="#FEF9C3" />
            <Stop offset="0.45" stopColor="#FDE047" />
            <Stop offset="1"   stopColor="#CA8A04" />
          </LinearGradient>
          <LinearGradient id="hShine" x1="0" y1="0" x2="0.9" y2="1">
            <Stop offset="0" stopColor={WHITE} stopOpacity="0.6" />
            <Stop offset="1" stopColor={WHITE} stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="hOutfit" x1="0" y1="0" x2="0.1" y2="1">
            <Stop offset="0" stopColor="#4F46E5" />
            <Stop offset="1" stopColor="#312E81" />
          </LinearGradient>
          <LinearGradient id="hOutfitHL" x1="0" y1="0" x2="0.1" y2="1">
            <Stop offset="0" stopColor="#818CF8" />
            <Stop offset="1" stopColor="#6366F1" />
          </LinearGradient>
          <LinearGradient id="hBlush" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FCA5A5" />
            <Stop offset="1" stopColor={ROSE} />
          </LinearGradient>
        </Defs>

        {/* Ground shadow */}
        <Ellipse cx={65} cy={164} rx={32} ry={5.5} fill="#000" opacity={0.15} />

        {/* Star body */}
        <Path
          d="M65 8 C67 8 72 24 80 27 C88 30 104 24 104 24
             C104 24 94 36 94 46 C94 56 104 70 104 70
             C104 70 88 64 80 70 C72 76 70 96 65 96
             C60 96 58 76 50 70 C42 64 26 70 26 70
             C26 70 36 56 36 46 C36 36 26 24 26 24
             C26 24 42 30 50 27 C58 24 63 8 65 8 Z"
          fill="url(#hBody)"
        />
        {/* Shine */}
        <Path
          d="M65 8 C67 8 72 24 80 27 C88 30 102 25 104 24
             C96 31 88 40 88 48 C78 40 65 8 65 8 Z"
          fill="url(#hShine)"
        />

        {/* Outfit torso */}
        <Path d="M44 88 Q44 78 65 78 Q86 78 86 88 L90 132 Q65 140 40 132 Z" fill="url(#hOutfit)" />
        {/* Collar */}
        <Path d="M55 78 L65 92 L75 78 Q65 73 55 78 Z" fill="url(#hOutfitHL)" />
        {/* Belt */}
        <Rect x={42} y={114} width={46} height={6} rx={3} fill="#312E81" opacity={0.55} />
        <Path d="M65 113 L66.5 117 L70 118 L66.5 119 L65 123 L63.5 119 L60 118 L63.5 117 Z" fill={GOLD} />

        {/* Legs */}
        <Rect x={46} y={132} width={16} height={26} rx={8} fill="url(#hOutfit)" />
        <Rect x={68} y={132} width={16} height={26} rx={8} fill="url(#hOutfit)" />
        {/* Feet */}
        <Ellipse cx={54} cy={160} rx={11} ry={6.5} fill="#312E81" />
        <Ellipse cx={76} cy={160} rx={11} ry={6.5} fill="#312E81" />

        {/* Left arm relaxed */}
        <Path d="M42 94 Q28 102 24 120" stroke="#EAB308" strokeWidth={13} strokeLinecap="round" fill="none" />
        <Ellipse cx={22} cy={123} rx={9} ry={7} fill="#FDE047" />

        {/* Blush */}
        <Ellipse cx={43} cy={58} rx={9} ry={5.5} fill="url(#hBlush)" opacity={0.52} />
        <Ellipse cx={87} cy={58} rx={9} ry={5.5} fill="url(#hBlush)" opacity={0.52} />

        {/* Smile */}
        <Path d="M54 68 Q65 80 76 68" stroke="#92400E" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.75} />
      </Svg>

      {/* Waving right arm */}
      <Animated.View style={{
        position: "absolute",
        right: size * 0.04,
        top: size * 0.47,
        transform: [{ rotate: waveRot }],
      }}>
        <Svg width={size * 0.38} height={size * 0.38} viewBox="0 0 50 50">
          <Path d="M4 46 Q12 32 22 18" stroke="#EAB308" strokeWidth={10} strokeLinecap="round" fill="none" />
          <Ellipse cx={26} cy={14} rx={10} ry={8} fill="#FDE047" />
        </Svg>
      </Animated.View>

      {/* Eyes */}
      <Animated.View style={{
        position: "absolute",
        left: size * 0.31, top: size * 0.37,
        transform: [{ scaleY: blink }],
      }}>
        <Svg width={size * 0.12} height={size * 0.12} viewBox="0 0 16 16">
          <Ellipse cx={8} cy={8} rx={7} ry={7} fill="#713F12" />
          <Circle cx={10.5} cy={5.5} r={2.5} fill={WHITE} opacity={0.8} />
        </Svg>
      </Animated.View>
      <Animated.View style={{
        position: "absolute",
        left: size * 0.54, top: size * 0.37,
        transform: [{ scaleY: blink }],
      }}>
        <Svg width={size * 0.12} height={size * 0.12} viewBox="0 0 16 16">
          <Ellipse cx={8} cy={8} rx={7} ry={7} fill="#713F12" />
          <Circle cx={10.5} cy={5.5} r={2.5} fill={WHITE} opacity={0.8} />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

/* ── Small mascot A ─────────────────────────────────────── */
function StarMascotSmallA({ size = 65 }: { size?: number }) {
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -6, duration: 1150, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0,  duration: 1150, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{ transform: [{ translateY: bob }] }}>
      <Svg width={size} height={size * 1.35} viewBox="0 0 65 88">
        <Defs>
          <LinearGradient id="saBody" x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0" stopColor="#FEF9C3" />
            <Stop offset="0.5" stopColor="#FDE047" />
            <Stop offset="1" stopColor="#CA8A04" />
          </LinearGradient>
          <LinearGradient id="saOut" x1="0" y1="0" x2="0.1" y2="1">
            <Stop offset="0" stopColor="#60A5FA" />
            <Stop offset="1" stopColor="#1D4ED8" />
          </LinearGradient>
          <LinearGradient id="saBlush" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FCA5A5" />
            <Stop offset="1" stopColor={ROSE} />
          </LinearGradient>
        </Defs>
        <Ellipse cx={32} cy={84} rx={18} ry={4} fill="#000" opacity={0.12} />
        <Path
          d="M32 3 C33.5 3 37 14 42 16 C47 18 56 14 56 14 C56 14 50 21 50 27 C50 33 56 41 56 41
             C56 41 47 38 42 41 C37 44 35 55 32 55 C29 55 27 44 22 41 C17 38 8 41 8 41
             C8 41 14 33 14 27 C14 21 8 14 8 14 C8 14 17 18 22 16 C27 14 30.5 3 32 3 Z"
          fill="url(#saBody)"
        />
        <Path
          d="M32 3 C33.5 3 37 14 42 16 C47 18 54 15 56 14 C51 19 46 24 46 28 C40 22 32 3 32 3 Z"
          fill={WHITE} opacity={0.44}
        />
        <Path d="M15 51 Q15 44 32 44 Q49 44 49 51 L51 68 Q32 74 13 68 Z" fill="url(#saOut)" />
        <Path d="M25 44 L32 51 L39 44 Q32 40 25 44 Z" fill="#93C5FD" opacity={0.85} />
        <Rect x={17} y={68} width={10} height={14} rx={5} fill="url(#saOut)" />
        <Rect x={38} y={68} width={10} height={14} rx={5} fill="url(#saOut)" />
        <Ellipse cx={22} cy={82} rx={7} ry={4} fill="#1D4ED8" />
        <Ellipse cx={43} cy={82} rx={7} ry={4} fill="#1D4ED8" />
        {/* Arms up */}
        <Path d="M14 52 Q6 44 4 32"  stroke="#EAB308" strokeWidth={7} strokeLinecap="round" fill="none" />
        <Ellipse cx={3} cy={28} rx={5} ry={4.5} fill="#FDE047" />
        <Path d="M50 52 Q58 44 60 32" stroke="#EAB308" strokeWidth={7} strokeLinecap="round" fill="none" />
        <Ellipse cx={61} cy={28} rx={5} ry={4.5} fill="#FDE047" />
        {/* Face */}
        <Ellipse cx={22} cy={35} rx={5} ry={3.2} fill="url(#saBlush)" opacity={0.52} />
        <Ellipse cx={42} cy={35} rx={5} ry={3.2} fill="url(#saBlush)" opacity={0.52} />
        <Ellipse cx={26} cy={30} rx={4} ry={4} fill="#713F12" />
        <Circle  cx={27.5} cy={28.5} r={1.4} fill={WHITE} opacity={0.75} />
        <Ellipse cx={38} cy={30} rx={4} ry={4} fill="#713F12" />
        <Circle  cx={39.5} cy={28.5} r={1.4} fill={WHITE} opacity={0.75} />
        <Path d="M26 39 Q32 45 38 39" stroke="#92400E" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.8} />
      </Svg>
    </Animated.View>
  );
}

/* ── Small mascot B ─────────────────────────────────────── */
function StarMascotSmallB({ size = 58 }: { size?: number }) {
  const bob  = useRef(new Animated.Value(0)).current;
  const tilt = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob,  { toValue: -5, duration: 1350, useNativeDriver: true }),
        Animated.timing(bob,  { toValue: 0,  duration: 1350, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(tilt, { toValue: 1, duration: 850,  useNativeDriver: true }),
        Animated.delay(1300),
        Animated.timing(tilt, { toValue: 0, duration: 850,  useNativeDriver: true }),
        Animated.delay(900),
      ])
    ).start();
  }, []);
  const tiltRot = tilt.interpolate({ inputRange: [0,1], outputRange: ["0deg","16deg"] });
  return (
    <Animated.View style={{ transform: [{ translateY: bob }] }}>
      <Animated.View style={{ transform: [{ rotate: tiltRot }] }}>
        <Svg width={size} height={size * 1.35} viewBox="0 0 58 78">
          <Defs>
            <LinearGradient id="sbBody" x1="0.2" y1="0" x2="0.8" y2="1">
              <Stop offset="0" stopColor="#FEF9C3" />
              <Stop offset="0.5" stopColor="#FDE047" />
              <Stop offset="1" stopColor="#CA8A04" />
            </LinearGradient>
            <LinearGradient id="sbOut" x1="0" y1="0" x2="0.1" y2="1">
              <Stop offset="0" stopColor={AMETHYST_SOFT} />
              <Stop offset="1" stopColor={VIOLET} />
            </LinearGradient>
            <LinearGradient id="sbBlush" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FCA5A5" />
              <Stop offset="1" stopColor={ROSE} />
            </LinearGradient>
          </Defs>
          <Ellipse cx={29} cy={74} rx={16} ry={4} fill="#000" opacity={0.12} />
          <Path
            d="M29 3 C30.5 3 34 13 39 15 C44 17 53 13 53 13 C53 13 47 20 47 26 C47 32 53 40 53 40
               C53 40 44 37 39 40 C34 43 32 53 29 53 C26 53 24 43 19 40 C14 37 5 40 5 40
               C5 40 11 32 11 26 C11 20 5 13 5 13 C5 13 14 17 19 15 C24 13 27.5 3 29 3 Z"
            fill="url(#sbBody)"
          />
          <Path d="M29 3 C30.5 3 34 13 39 15 C44 17 51 14 53 13 C48 18 43 23 43 28 C37 22 29 3 29 3 Z"
            fill={WHITE} opacity={0.42} />
          <Path d="M17 50 Q17 44 29 44 Q41 44 41 50 L43 66 Q29 71 15 66 Z" fill="url(#sbOut)" />
          <Path d="M24 44 L29 50 L34 44 Q29 41 24 44 Z" fill={AMETHYST_SOFT} opacity={0.85} />
          <Rect x={18} y={66} width={9} height={11} rx={4.5} fill="url(#sbOut)" />
          <Rect x={31} y={66} width={9} height={11} rx={4.5} fill="url(#sbOut)" />
          <Ellipse cx={22.5} cy={78} rx={6} ry={3.5} fill={VIOLET} />
          <Ellipse cx={35.5} cy={78} rx={6} ry={3.5} fill={VIOLET} />
          <Path d="M17 52 Q9 46 7 36" stroke="#EAB308" strokeWidth={7} strokeLinecap="round" fill="none" />
          <Ellipse cx={6} cy={32} rx={5.5} ry={4.5} fill="#FDE047" />
          <Path d="M41 54 Q48 58 50 66" stroke="#EAB308" strokeWidth={7} strokeLinecap="round" fill="none" />
          <Ellipse cx={51} cy={69} rx={5.5} ry={4.5} fill="#FDE047" />
          <Ellipse cx={18} cy={34} rx={4.5} ry={3} fill="url(#sbBlush)" opacity={0.52} />
          <Ellipse cx={40} cy={34} rx={4.5} ry={3} fill="url(#sbBlush)" opacity={0.52} />
          {/* Eyes — one open, one wink */}
          <Ellipse cx={23} cy={29} rx={4} ry={4} fill="#713F12" />
          <Circle  cx={24.5} cy={27.5} r={1.3} fill={WHITE} opacity={0.72} />
          <Path d="M34 27 Q37 25 40 27" stroke="#713F12" strokeWidth={2}   fill="none" strokeLinecap="round" />
          <Path d="M34 31 Q37 29 40 31" stroke="#713F12" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.38} />
          <Path d="M23 38 Q29 44 35 38" stroke="#92400E" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.8} />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

/* ══════════════════════════════════════════════════════════
   TITLE LOGO
══════════════════════════════════════════════════════════ */
function TitleLogo() {
  const glow   = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(18)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const glowScale = glow.interpolate({ inputRange: [0,1], outputRange: [1, 1.022] });

  return (
    <Animated.View style={[
      styles.titleWrapper,
      { opacity: fadeIn, transform: [{ translateY: slideY }, { scale: glowScale }] }
    ]}>
      {/* Decorative line */}
      <View style={styles.titleOrnamentsRow}>
        <View style={styles.ornamentLine} />
        <Svg width={16} height={16} viewBox="0 0 16 16">
          <Path d="M8 0 L9.5 6 L16 8 L9.5 10 L8 16 L6.5 10 L0 8 L6.5 6 Z" fill={GOLD} opacity={0.9} />
        </Svg>
        <View style={styles.ornamentLine} />
      </View>

      <Text style={styles.titleLabel}>MATCH THE</Text>

      <View style={styles.titleMainRow}>
        <Svg width={22} height={22} viewBox="0 0 20 20" style={{ marginRight: 8 }}>
          <Path d="M10 1 L12 8 L19 8 L13.5 12.5 L15.5 19.5 L10 15 L4.5 19.5 L6.5 12.5 L1 8 L8 8 Z" fill={GOLD} />
        </Svg>
        <Text style={styles.titleMain}>Family</Text>
        <Svg width={22} height={22} viewBox="0 0 20 20" style={{ marginLeft: 8 }}>
          <Path d="M10 1 L12 8 L19 8 L13.5 12.5 L15.5 19.5 L10 15 L4.5 19.5 L6.5 12.5 L1 8 L8 8 Z" fill={GOLD} />
        </Svg>
      </View>

      <Text style={styles.titleSub}>A memory game for little ones</Text>
    </Animated.View>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════════════════════════ */
export default function StartGame() {
  const router = useRouter();
  const btnScale   = useRef(new Animated.Value(1)).current;
  const panelSlide = useRef(new Animated.Value(40)).current;
  const panelFade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(panelSlide, { toValue: 0, duration: 600, delay: 300, useNativeDriver: true }),
      Animated.timing(panelFade,  { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePressIn = () =>
    Animated.spring(btnScale, { toValue: 0.94, friction: 5, tension: 220, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(btnScale, { toValue: 1,    friction: 4, tension: 130, useNativeDriver: true }).start();

  return (
    <View style={styles.container}>
      <NightBackground />

      {/* Moon */}
      <View style={styles.moonPos}>
        <Moon size={68} />
      </View>

      {/* Floating accent sparkles */}
      <FloatingSparkle x={18}            y={62}  size={18} color={GOLD}           delay={0}    shape="star"    />
      <FloatingSparkle x={SCREEN_W - 46} y={96}  size={14} color={AMETHYST_SOFT}  delay={350}  shape="diamond" />
      <FloatingSparkle x={SCREEN_W / 2}  y={42}  size={10} color={WHITE}          delay={700}  shape="star"    />
      <FloatingSparkle x={26}            y={380} size={12} color={ROSE}            delay={1000} shape="diamond" />
      <FloatingSparkle x={SCREEN_W - 40} y={400} size={16} color={GOLD}           delay={500}  shape="star"    />
      <FloatingSparkle x={SCREEN_W - 90} y={200} size={8}  color={AMETHYST_SOFT}  delay={250}  shape="star"    />
      <FloatingSparkle x={50}            y={220} size={9}  color={WHITE}           delay={1200} shape="diamond" />

      {/* Title */}
      <View style={styles.titleSection}>
        <TitleLogo />
      </View>

      {/* Mascot trio */}
      <View style={styles.heroMascotRow}>
        <View style={styles.sideMascotWrap}>
          <StarMascotSmallA size={62} />
        </View>
        <View style={styles.heroMascotWrap}>
          <StarMascotHero size={128} />
        </View>
        <View style={styles.sideMascotWrap}>
          <StarMascotSmallB size={56} />
        </View>
      </View>

      {/* Launch panel */}
      <Animated.View style={[
        styles.panel,
        { opacity: panelFade, transform: [{ translateY: panelSlide }] }
      ]}>
        {/* Decorative top line */}
        <View style={styles.panelAccentLine} />

        <Text style={styles.panelHint}>Tap cards to find matching pairs</Text>

        {/* Start button */}
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => router.push("../memoryfam")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            {/* Decorative left star */}
            <Svg width={20} height={20} viewBox="0 0 20 20" style={{ marginRight: 12 }}>
              <Path
                d="M10 1 L12 8 L19 8 L13.5 12.5 L15.5 19.5 L10 15 L4.5 19.5 L6.5 12.5 L1 8 L8 8 Z"
                fill={WHITE} opacity={0.92}
              />
            </Svg>
            <Text style={styles.startBtnText}>Let's Play</Text>
            <Svg width={20} height={20} viewBox="0 0 20 20" style={{ marginLeft: 12 }}>
              <Path
                d="M10 1 L12 8 L19 8 L13.5 12.5 L15.5 19.5 L10 15 L4.5 19.5 L6.5 12.5 L1 8 L8 8 Z"
                fill={WHITE} opacity={0.92}
              />
            </Svg>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/* ══════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NIGHT_DEEP },

  moonPos: {
    position: "absolute", top: 18, right: 22, zIndex: 10,
    shadowColor: GOLD_WARM,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 20,
  },

  /* ── Title ── */
  titleSection: {
    alignItems: "center",
    paddingTop: SCREEN_H * 0.072,
    zIndex: 5,
  },
  titleWrapper: { alignItems: "center" },

  titleOrnamentsRow: {
    flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12,
  },
  ornamentLine: {
    width: 48, height: 1,
    backgroundColor: GOLD, opacity: 0.45,
  },

  titleLabel: {
    fontSize: 11, fontWeight: "800",
    color: AMETHYST_SOFT,
    letterSpacing: 5,
    opacity: 0.9,
    marginBottom: 6,
  },
  titleMainRow: {
    flexDirection: "row", alignItems: "center",
  },
  titleMain: {
    fontSize: 44, fontWeight: "900",
    color: WHITE,
    letterSpacing: -1,
    textShadowColor: AMETHYST,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 18,
  },
  titleSub: {
    fontSize: 13, color: "rgba(255,255,255,0.52)",
    fontWeight: "500", letterSpacing: 0.5,
    marginTop: 10,
  },

  /* ── Mascots ── */
  heroMascotRow: {
    flexDirection: "row", alignItems: "flex-end", justifyContent: "center",
    paddingHorizontal: 10, marginTop: SCREEN_H * 0.018, zIndex: 5,
  },
  heroMascotWrap: { zIndex: 5 },
  sideMascotWrap: { paddingBottom: 12, zIndex: 4 },

  /* ── Panel ── */
  panel: {
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 28,
    paddingTop: 4,
    paddingBottom: 28,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255,251,245,0.96)",
    shadowColor: AMETHYST,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3, shadowRadius: 28, elevation: 18,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.25)",
    zIndex: 5,
    alignItems: "center",
    gap: 20,
  },

  panelAccentLine: {
    width: 44, height: 3.5,
    backgroundColor: AMETHYST,
    borderRadius: 2,
    opacity: 0.35,
    marginTop: 14,
  },

  panelHint: {
    fontSize: 13, color: TEXT_DUSK,
    fontWeight: "600", textAlign: "center",
    letterSpacing: 0.2,
  },

  /* ── Start button ── */
  startBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: AMETHYST,
    borderRadius: 22,
    paddingVertical: 18, paddingHorizontal: 40,
    shadowColor: INDIGO,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55, shadowRadius: 20, elevation: 12,
  },
  startBtnText: {
    color: WHITE, fontSize: 20, fontWeight: "900",
    letterSpacing: 0.6,
  },
});