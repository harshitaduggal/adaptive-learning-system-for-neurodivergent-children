import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
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

const { width: SCREEN_W } = Dimensions.get("window");

/* ─── Design Tokens ──────────────────────────────────────── */
const NIGHT_DEEP    = "#0A0618";
const INDIGO        = "#1E0A4C";
const VIOLET        = "#3D1A8C";
const AMETHYST      = "#7B5CF6";
const AMETHYST_SOFT = "#A78BFA";
const AMETHYST_PALE = "#EDE9FE";
const AMETHYST_FAINT= "#F5F3FF";
const ROSE          = "#F472B6";
const ROSE_DEEP     = "#BE185D";
const ROSE_PALE     = "#FBCFE8";
const GOLD          = "#FCD34D";
const GOLD_WARM     = "#F59E0B";
const CREAM         = "#FFFBF5";
const WHITE         = "#FFFFFF";
const TEXT_NIGHT    = "#1E1154";
const TEXT_DUSK     = "#6D5A9C";
const SHADOW_COLOR  = "#1E0A4C";

/* ─── Types ──────────────────────────────────────────────── */
interface CardData {
  id: string;
  uri: string;
  person: string;
  emotion: string;
  pairKey: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Star shape helper ──────────────────────────────────── */
function StarShape({ x, y, size, color, rotate, opacity = 1 }: {
  x: number; y: number; size: number; color: string; rotate: number; opacity?: number;
}) {
  return (
    <Svg
      width={size} height={size} viewBox="0 0 20 20"
      style={{ position: "absolute", left: x, top: y, transform: [{ rotate: `${rotate}deg` }], opacity }}
    >
      <Path
        d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.9 L16.2 18.5 L10 14.2 L3.8 18.5 L6.1 11.9 L0.5 7.6 L7.6 7.6 Z"
        fill={color}
      />
    </Svg>
  );
}

/* ─── 4-point sparkle ────────────────────────────────────── */
function Sparkle({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10"
      style={{ position: "absolute", left: x, top: y }}>
      <Path d="M5 0 L5.8 4.2 L10 5 L5.8 5.8 L5 10 L4.2 5.8 L0 5 L4.2 4.2 Z" fill={color} />
    </Svg>
  );
}

/* ─── Moon ───────────────────────────────────────────────── */
function Moon({ size = 54 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 54 54">
      <Defs>
        <LinearGradient id="moonGr" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
          <Stop offset="0"   stopColor="#FEF9C3" />
          <Stop offset="0.5" stopColor="#FDE047" />
          <Stop offset="1"   stopColor="#F59E0B" />
        </LinearGradient>
        <RadialGradient id="moonSh" cx="0.35" cy="0.25" r="0.55">
          <Stop offset="0" stopColor={WHITE} stopOpacity="0.55" />
          <Stop offset="1" stopColor={WHITE} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx={27} cy={27} r={25} fill={GOLD_WARM} opacity={0.09} />
      <Path d="M27 6 A21 21 0 1 1 27 48 A14 14 0 1 0 27 6 Z" fill="url(#moonGr)" />
      <Path d="M27 6 A21 21 0 1 1 27 48 A14 14 0 1 0 27 6 Z" fill="url(#moonSh)" />
      <Circle cx={32} cy={22} r={2.8} fill="#78350F" opacity={0.6} />
      <Circle cx={40} cy={26} r={2.2} fill="#78350F" opacity={0.6} />
      <Path d="M30 32 Q36 37 42 32" stroke="#78350F" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.65} />
      <Ellipse cx={28} cy={33} rx={4} ry={2.5} fill={GOLD_WARM} opacity={0.3} />
      <Circle cx={30} cy={14} r={2.5} fill={WHITE} opacity={0.38} />
    </Svg>
  );
}

/* ─── Star Mascot ────────────────────────────────────────── */
function StarMascot({ size = 80 }: { size?: number }) {
  const bob   = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -5, duration: 950, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0,  duration: 950, useNativeDriver: true }),
      ])
    ).start();
    const doBlink = () => {
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.05, duration: 70, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1,    duration: 70, useNativeDriver: true }),
      ]).start(() => setTimeout(doBlink, 2800 + Math.random() * 1200));
    };
    const t = setTimeout(doBlink, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ translateY: bob }] }}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <LinearGradient id="sbody" x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0"   stopColor="#FEF9C3" />
            <Stop offset="0.5" stopColor="#FDE047" />
            <Stop offset="1"   stopColor="#EAB308" />
          </LinearGradient>
          <LinearGradient id="sshine" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={WHITE} stopOpacity="0.6" />
            <Stop offset="1" stopColor={WHITE} stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="sblush" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FCA5A5" />
            <Stop offset="1" stopColor={ROSE} />
          </LinearGradient>
        </Defs>
        <Ellipse cx={40} cy={76} rx={16} ry={3.5} fill="#000" opacity={0.1} />
        <Path
          d="M40 5 C41.5 5 45 17 51 19 C57 21 69 17 69 17
             C69 17 61 27 61 34 C61 41 69 53 69 53
             C69 53 57 49 51 53 C45 57 43 71 40 71
             C37 71 35 57 29 53 C23 49 11 53 11 53
             C11 53 19 41 19 34 C19 27 11 17 11 17
             C11 17 23 21 29 19 C35 17 38.5 5 40 5 Z"
          fill="url(#sbody)"
        />
        <Path
          d="M40 5 C41.5 5 45 17 51 19 C57 21 66 18 69 17
             C62 23 56 30 56 36 C48 29 40 5 40 5 Z"
          fill="url(#sshine)"
        />
        <Ellipse cx={27} cy={46} rx={6.5} ry={4} fill="url(#sblush)" opacity={0.5} />
        <Ellipse cx={53} cy={46} rx={6.5} ry={4} fill="url(#sblush)" opacity={0.5} />
        <Path d="M33 52 Q40 59 47 52" stroke="#92400E" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.78} />
        <Path d="M16 33 Q9 27 8 18"   stroke="#EAB308" strokeWidth={5.5} strokeLinecap="round" fill="none" />
        <Path d="M64 33 Q71 27 72 18"  stroke="#EAB308" strokeWidth={5.5} strokeLinecap="round" fill="none" />
      </Svg>
      <Animated.View style={[styles.mascotEye, { left: size*0.305, top: size*0.4, transform: [{ scaleY: blink }] }]}>
        <Svg width={10} height={10} viewBox="0 0 10 10">
          <Ellipse cx={5} cy={5} rx={4.5} ry={4.5} fill="#713F12" />
          <Circle  cx={7} cy={3}  r={1.5}  fill={WHITE} opacity={0.78} />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.mascotEye, { left: size*0.565, top: size*0.4, transform: [{ scaleY: blink }] }]}>
        <Svg width={10} height={10} viewBox="0 0 10 10">
          <Ellipse cx={5} cy={5} rx={4.5} ry={4.5} fill="#713F12" />
          <Circle  cx={7} cy={3}  r={1.5}  fill={WHITE} opacity={0.78} />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

/* ─── Hero banner ────────────────────────────────────────── */
function HeroBanner() {
  return (
    <Svg width="100%" height={215} viewBox="0 0 390 215" style={{ position: "absolute", top: 0 }}>
      <Defs>
        <LinearGradient id="heroGr" x1="0.1" y1="0" x2="0.6" y2="1">
          <Stop offset="0"    stopColor="#050210" />
          <Stop offset="0.35" stopColor="#130C2E" />
          <Stop offset="0.72" stopColor="#2D1060" />
          <Stop offset="1"    stopColor={AMETHYST} />
        </LinearGradient>
        <RadialGradient id="heroOrb1" cx="0.84" cy="0.18" r="0.35">
          <Stop offset="0"   stopColor={GOLD_WARM} stopOpacity="0.12" />
          <Stop offset="1"   stopColor={GOLD_WARM} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="heroOrb2" cx="0.1" cy="0.55" r="0.3">
          <Stop offset="0"   stopColor={AMETHYST_SOFT} stopOpacity="0.1" />
          <Stop offset="1"   stopColor={AMETHYST_SOFT} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Sky */}
      <Rect width={390} height={215} fill="url(#heroGr)" />
      <Rect width={390} height={215} fill="url(#heroOrb1)" />
      <Rect width={390} height={215} fill="url(#heroOrb2)" />

      {/* Stars */}
      {[
        [28,14,1.8,0.85],[72,8,1.4,0.65],[115,22,1.6,0.75],[158,7,1.5,0.8],
        [200,18,1.8,0.7],[244,5,1.4,0.75],[282,22,1.6,0.65],[328,12,1.8,0.8],[366,26,1.4,0.7],
        [45,48,1.5,0.6],[90,38,1.8,0.75],[138,52,1.4,0.65],[182,40,1.8,0.7],
        [225,34,1.5,0.65],[265,50,1.6,0.7],[310,42,1.4,0.6],[354,56,1.8,0.65],
        [20,82,1.4,0.55],[65,72,1.6,0.6],[108,86,1.4,0.55],[152,68,1.8,0.65],
        [196,82,1.5,0.6],[238,70,1.6,0.55],[280,84,1.4,0.6],[335,78,1.8,0.65],
      ].map(([cx,cy,r,op], i) => (
        <Circle key={i} cx={cx} cy={cy} r={r} fill={WHITE} opacity={op} />
      ))}

      {/* 4-pt sparkles in sky */}
      <Path d="M58 20 L59.2 23.5 L63 24.5 L59.2 25.5 L58 29 L56.8 25.5 L53 24.5 L56.8 23.5 Z" fill={WHITE}          opacity={0.85} />
      <Path d="M200 36 L201.5 40 L205 41 L201.5 42 L200 46 L198.5 42 L195 41 L198.5 40 Z"      fill={AMETHYST_SOFT} opacity={0.8} />
      <Path d="M342 18 L343 21 L346 22 L343 23 L342 26 L341 23 L338 22 L341 21 Z"               fill={GOLD}          opacity={0.88} />
      <Path d="M108 52 L109 55 L112 56 L109 57 L108 60 L107 57 L104 56 L107 55 Z"               fill={WHITE}          opacity={0.7} />

      {/* Wave into content */}
      <Path d="M0 158 Q42 140 96 156 Q148 172 206 152 Q262 132 324 158 Q358 172 390 150 L390 215 L0 215 Z"
        fill={AMETHYST_FAINT} />
      <Path d="M0 170 Q62 156 124 170 Q186 184 246 164 Q306 146 364 172 L390 180 L390 215 L0 215 Z"
        fill={AMETHYST_FAINT} opacity={0.55} />
    </Svg>
  );
}

/* ─── Card back ──────────────────────────────────────────── */
function CardBackPattern() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 90 90">
      <Defs>
        <LinearGradient id="cbk" x1="0.1" y1="0" x2="0.9" y2="1">
          <Stop offset="0"   stopColor="#2D1060" />
          <Stop offset="0.5" stopColor={AMETHYST} />
          <Stop offset="1"   stopColor={AMETHYST_SOFT} />
        </LinearGradient>
        <RadialGradient id="cbkGlow" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0"   stopColor={WHITE} stopOpacity="0.08" />
          <Stop offset="1"   stopColor={WHITE} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={90} height={90} rx={0} fill="url(#cbk)" />
      <Rect width={90} height={90} fill="url(#cbkGlow)" />
      {/* Dot grid */}
      {[1,2,3,4,5].map((row) =>
        [1,2,3,4,5].map((col) => (
          <Circle key={`${row}-${col}`} cx={col*15} cy={row*15} r={1.8} fill={WHITE} opacity={0.15} />
        ))
      )}
      {/* Inner dashed frame */}
      <Rect x={5} y={5} width={80} height={80} rx={12}
        stroke={WHITE} strokeWidth={1.2} strokeDasharray="4,3" fill="none" opacity={0.22} />
      {/* Central heart */}
      <Path
        d="M45 60 C45 60 31 51 31 42 C31 36.8 35 33 39 35.5 C41.5 37 43 39 45 41 C47 39 48.5 37 51 35.5 C55 33 59 36.8 59 42 C59 51 45 60 45 60 Z"
        fill={WHITE} opacity={0.18}
      />
      {/* Corner sparkles */}
      <Path d="M12 12 L13 15 L16 16 L13 17 L12 20 L11 17 L8 16 L11 15 Z"  fill={WHITE} opacity={0.3} />
      <Path d="M78 12 L79 15 L82 16 L79 17 L78 20 L77 17 L74 16 L77 15 Z" fill={WHITE} opacity={0.3} />
    </Svg>
  );
}

/* ─── Flip card ──────────────────────────────────────────── */
interface FlipCardProps {
  card: CardData;
  isFlipped: boolean;
  isMatched: boolean;
  onPress: () => void;
}

function FlipCard({ card, isFlipped, isMatched, onPress }: FlipCardProps) {
  const anim  = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isFlipped || isMatched ? 1 : 0,
      friction: 8, tension: 62, useNativeDriver: true,
    }).start();
  }, [isFlipped, isMatched]);

  useEffect(() => {
    if (isMatched) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.13, friction: 4, tension: 160, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1,    friction: 5, tension: 80,  useNativeDriver: true }),
      ]).start();
    }
  }, [isMatched]);

  const frontRot = anim.interpolate({ inputRange: [0,1], outputRange: ["180deg","360deg"] });
  const backRot  = anim.interpolate({ inputRange: [0,1], outputRange: ["0deg","180deg"] });
  const frontOp  = anim.interpolate({ inputRange: [0.49,0.5], outputRange: [0,1] });
  const backOp   = anim.interpolate({ inputRange: [0.49,0.5], outputRange: [1,0] });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} disabled={isFlipped || isMatched}>
      <Animated.View style={[styles.cardOuter, { transform: [{ scale }] }]}>
        {/* Back face */}
        <Animated.View style={[
          styles.cardFace, styles.cardBack,
          { transform: [{ rotateY: backRot }], opacity: backOp }
        ]}>
          <CardBackPattern />
        </Animated.View>
        {/* Front face */}
        <Animated.View style={[
          styles.cardFace, styles.cardFront,
          isMatched && styles.cardMatched,
          { transform: [{ rotateY: frontRot }], opacity: frontOp }
        ]}>
          <Image source={{ uri: card.uri }} style={styles.cardImage} resizeMode="cover" />
          {/* Match badge */}
          {isMatched && (
            <View style={styles.matchOverlay}>
              <View style={styles.matchBadge}>
                <Svg width={14} height={14} viewBox="0 0 14 14">
                  <Path d="M2 7 L6 11 L12 3" stroke={WHITE} strokeWidth={2.4}
                    strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </Svg>
              </View>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ─── Match modal ────────────────────────────────────────── */
function MatchModal({ visible, personName, onDismiss }: {
  visible: boolean; personName: string; onDismiss: () => void;
}) {
  const scale  = useRef(new Animated.Value(0.3)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.3);
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounce, { toValue: -8, duration: 330, useNativeDriver: true }),
          Animated.timing(bounce, { toValue: 0,  duration: 330, useNativeDriver: true }),
        ])
      ).start();
      const t = setTimeout(onDismiss, 1800);
      return () => clearTimeout(t);
    } else {
      scale.setValue(0.3);
      bounce.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.matchCard, { transform: [{ scale }] }]}>
          {/* Confetti sparkles */}
          <StarShape x={-16} y={-16} size={20} color={AMETHYST_SOFT} rotate={15}  opacity={0.9} />
          <StarShape x={100} y={-18} size={16} color={ROSE}           rotate={-20} opacity={0.85} />
          <StarShape x={-10} y={74}  size={14} color={AMETHYST_SOFT}  rotate={30}  opacity={0.8} />
          <StarShape x={104} y={70}  size={18} color={GOLD}           rotate={-10} opacity={0.88} />
          <Sparkle   x={78}  y={-6}  size={12} color={GOLD} />
          <Sparkle   x={-6}  y={44}  size={10} color={ROSE_PALE} />

          <Animated.View style={{ transform: [{ translateY: bounce }] }}>
            <StarMascot size={76} />
          </Animated.View>

          {/* "Match!" pill */}
          <View style={styles.matchPill}>
            <Text style={styles.matchPillText}>Match Found</Text>
          </View>

          <Text style={styles.matchName}>{personName}</Text>
          <Text style={styles.matchSub}>Wonderful memory</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ─── Win modal ──────────────────────────────────────────── */
const CONFETTI_COLORS = [AMETHYST_SOFT, AMETHYST, AMETHYST_PALE, ROSE, GOLD, "#C4B5FD"];

function WinModal({ visible, moves, onReplay }: {
  visible: boolean; moves: number; onReplay: () => void;
}) {
  const scale  = useRef(new Animated.Value(0.3)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const shine  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.3);
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounce, { toValue: -12, duration: 520, useNativeDriver: true }),
          Animated.timing(bounce, { toValue: 0,   duration: 520, useNativeDriver: true }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(shine, { toValue: 1, duration: 1100, useNativeDriver: true }),
          Animated.timing(shine, { toValue: 0, duration: 1100, useNativeDriver: true }),
        ])
      ).start();
    } else {
      scale.setValue(0.3);
      bounce.setValue(0);
      shine.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const glowOp = shine.interpolate({ inputRange: [0,1], outputRange: [0.78, 1] });
  const stars  = moves <= 8 ? 3 : moves <= 14 ? 2 : 1;

  const confettiPos = [
    { x: 8,   y: 6,   s: 20, r: 10,  c: 0 },
    { x: 195, y: 2,   s: 16, r: -15, c: 1 },
    { x: 235, y: 28,  s: 12, r: 25,  c: 2 },
    { x: -8,  y: 78,  s: 14, r: -20, c: 3 },
    { x: 178, y: 82,  s: 18, r: 5,   c: 4 },
    { x: 58,  y: -10, s: 11, r: 30,  c: 5 },
    { x: 128, y: -14, s: 20, r: -5,  c: 0 },
    { x: 218, y: 102, s: 13, r: 15,  c: 1 },
    { x: 3,   y: 142, s: 15, r: -30, c: 2 },
    { x: 225, y: 158, s: 11, r: 20,  c: 3 },
    { x: 105, y: -8,  s: 9,  r: 45,  c: 4 },
    { x: 165, y: 168, s: 10, r: -12, c: 5 },
  ];

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.winCard, { transform: [{ scale }] }]}>
          {confettiPos.map((s, i) => (
            <StarShape key={i} x={s.x} y={s.y} size={s.s}
              color={CONFETTI_COLORS[s.c]} rotate={s.r} opacity={0.88} />
          ))}

          <Animated.View style={{ transform: [{ translateY: bounce }], zIndex: 2 }}>
            <StarMascot size={96} />
          </Animated.View>

          <Animated.Text style={[styles.winTitle, { opacity: glowOp }]}>
            You did it!
          </Animated.Text>
          <Text style={styles.winSub}>All family pairs found</Text>

          {/* Star rating */}
          <View style={styles.starRow}>
            {[1,2,3].map((s) => (
              <Svg key={s} width={32} height={32} viewBox="0 0 20 20"
                style={{ opacity: s <= stars ? 1 : 0.18 }}>
                <Path
                  d="M10 1 L12 8 L19 8 L13.5 12.5 L15.5 19.5 L10 15 L4.5 19.5 L6.5 12.5 L1 8 L8 8 Z"
                  fill={GOLD}
                />
              </Svg>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.winStatsRow}>
            <View style={styles.winStatChip}>
              <Svg width={22} height={22} viewBox="0 0 22 22" style={{ marginBottom: 4 }}>
                <Circle cx={11} cy={11} r={8} stroke={AMETHYST} strokeWidth={2} fill="none" />
                <Circle cx={11} cy={11} r={2.8} fill={AMETHYST} />
                <Path d="M11 3.5 L11 6" stroke={AMETHYST} strokeWidth={2.2} strokeLinecap="round" />
                <Path d="M11 16 L11 18.5" stroke={AMETHYST} strokeWidth={2.2} strokeLinecap="round" />
                <Path d="M3.5 11 L6 11"   stroke={AMETHYST} strokeWidth={2.2} strokeLinecap="round" />
                <Path d="M16 11 L18.5 11" stroke={AMETHYST} strokeWidth={2.2} strokeLinecap="round" />
              </Svg>
              <Text style={styles.winStatValue}>{moves}</Text>
              <Text style={styles.winStatLabel}>MOVES</Text>
            </View>
            <View style={[styles.winStatChip, { backgroundColor: ROSE_PALE }]}>
              <Svg width={22} height={22} viewBox="0 0 20 20" style={{ marginBottom: 4 }}>
                <Path
                  d="M10 1 L12 8 L19 8 L13.5 12.5 L15.5 19.5 L10 15 L4.5 19.5 L6.5 12.5 L1 8 L8 8 Z"
                  fill={ROSE}
                />
              </Svg>
              <Text style={[styles.winStatValue, { color: ROSE_DEEP }]}>{stars}</Text>
              <Text style={[styles.winStatLabel, { color: ROSE_DEEP }]}>STARS</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.replayBtn} onPress={onReplay} activeOpacity={0.85}>
            <Svg width={18} height={18} viewBox="0 0 20 20" style={{ marginRight: 10 }}>
              <Path d="M3 10 A7 7 0 1 0 10 3" stroke={WHITE} strokeWidth={2.4} fill="none" strokeLinecap="round" />
              <Path d="M10 3 L7 0 L7 6 Z" fill={WHITE} />
            </Svg>
            <Text style={styles.replayBtnText}>Play Again</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN GAME SCREEN
══════════════════════════════════════════════════════════ */
export default function MemoryGame({ onComplete }: { onComplete?: () => void }) {
  const [cards,      setCards]      = useState<CardData[]>([]);
  const [flipped,    setFlipped]    = useState<number[]>([]);
  const [matched,    setMatched]    = useState<number[]>([]);
  const [isLocked,   setIsLocked]   = useState(false);
  const [moves,      setMoves]      = useState(0);
  const [matchModal, setMatchModal] = useState<{ visible: boolean; name: string }>({ visible: false, name: "" });
  const [winModal,   setWinModal]   = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("familyMemoryData");
      if (!data) return;
      const parsed: { title: string; photos: string[] }[] = JSON.parse(data);
      const temp: CardData[] = [];
      parsed.forEach((member) => {
        member.photos.forEach((uri, imgIndex) => {
          temp.push({
            id: `${member.title}-${imgIndex}-${Math.random()}`,
            uri,
            person: member.title,
            emotion: "",
            pairKey: member.title,
          });
        });
      });
      setCards(shuffle(temp));
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setWinModal(false);
    } catch (e) {
      console.error("Failed to load game data", e);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      const t1 = setTimeout(() => setWinModal(true), 650);
      const t2 = setTimeout(() => onComplete?.(), 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [matched, cards]);

  const handleFlip = (index: number) => {
    if (isLocked || flipped.includes(index) || matched.includes(index) || flipped.length >= 2) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].pairKey === cards[b].pairKey) {
        const newMatched = [...matched, a, b];
        setTimeout(() => {
          setMatched(newMatched);
          setFlipped([]);
          setIsLocked(false);
          setMatchModal({ visible: true, name: cards[a].person });
        }, 420);
      } else {
        setTimeout(() => { setFlipped([]); setIsLocked(false); }, 950);
      }
    }
  };

  const pairsLeft = (cards.length - matched.length) / 2;
  const cardSize  = cards.length <= 8 ? 90 : 78;
  const cols      = cards.length <= 6 ? 3 : 4;

  return (
    <View style={styles.container}>

      {/* Hero banner */}
      <View style={styles.hero}>
        <HeroBanner />

        {/* Moon */}
        <View style={styles.moonWrapper}>
          <Moon size={56} />
        </View>

        {/* Sky sparkles */}
        <Sparkle x={SCREEN_W - 82} y={88}  size={14} color={GOLD} />
        <Sparkle x={28}             y={58}  size={10} color={AMETHYST_SOFT} />
        <Sparkle x={SCREEN_W / 2}   y={18}  size={8}  color={WHITE} />

        {/* Hero content */}
        <View style={styles.heroContent}>
          <View style={styles.bunnyWrapper}>
            <StarMascot size={84} />
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroLabel}>MATCH THE</Text>
            <Text style={styles.heroTitle}>Family</Text>
            <View style={styles.heroSubRow}>
              <View style={styles.heroSubDash} />
              <Text style={styles.heroSub}>Find all the pairs</Text>
              <View style={styles.heroSubDash} />
            </View>
          </View>
        </View>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        {/* Moves */}
        <View style={styles.statChip}>
          <View style={[styles.statIconCircle, { backgroundColor: AMETHYST_PALE }]}>
            <Svg width={20} height={20} viewBox="0 0 20 20">
              <Circle cx={10} cy={10} r={7} stroke={AMETHYST} strokeWidth={2} fill="none" />
              <Circle cx={10} cy={10} r={2.5} fill={AMETHYST} />
              <Path d="M10 3 L10 5.5"   stroke={AMETHYST} strokeWidth={2} strokeLinecap="round" />
              <Path d="M10 14.5 L10 17" stroke={AMETHYST} strokeWidth={2} strokeLinecap="round" />
              <Path d="M3 10 L5.5 10"   stroke={AMETHYST} strokeWidth={2} strokeLinecap="round" />
              <Path d="M14.5 10 L17 10" stroke={AMETHYST} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </View>
          <Text style={styles.statValue}>{moves}</Text>
          <Text style={styles.statLabel}>MOVES</Text>
        </View>

        <View style={styles.statDivider} />

        {/* Pairs left */}
        <View style={styles.statChip}>
          <View style={[styles.statIconCircle, {
            backgroundColor: pairsLeft > 0 ? ROSE_PALE : "#D1FAE5"
          }]}>
            <Svg width={20} height={20} viewBox="0 0 20 20">
              {pairsLeft > 0 ? (
                <Path
                  d="M10 15 C10 15 4 11 4 7 C4 4.5 6 3 8 4.2 C9 4.8 9.5 5.5 10 6.2 C10.5 5.5 11 4.8 12 4.2 C14 3 16 4.5 16 7 C16 11 10 15 10 15 Z"
                  fill={ROSE}
                />
              ) : (
                <Path d="M4 10 L8 14 L16 6" stroke="#059669" strokeWidth={2.5}
                  strokeLinecap="round" strokeLinejoin="round" fill="none" />
              )}
            </Svg>
          </View>
          <Text style={[styles.statValue, pairsLeft === 0 && { color: "#059669" }]}>
            {pairsLeft > 0 ? pairsLeft : "Done"}
          </Text>
          <Text style={[styles.statLabel, pairsLeft === 0 && { color: "#059669" }]}>
            {pairsLeft > 0 ? "PAIRS LEFT" : "ALL DONE"}
          </Text>
        </View>

        {/* Restart */}
        <TouchableOpacity style={styles.refreshBtn} onPress={loadData} activeOpacity={0.75}>
          <Svg width={22} height={22} viewBox="0 0 22 22">
            <Path d="M4 11 A7 7 0 1 0 11 4" stroke={AMETHYST} strokeWidth={2.4}
              fill="none" strokeLinecap="round" />
            <Path d="M11 4 L8 1 L8 7 Z" fill={AMETHYST} />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Card grid */}
      {cards.length === 0 ? (
        <View style={styles.emptyState}>
          <StarMascot size={100} />
          <Text style={styles.emptyTitle}>No photos yet</Text>
          <Text style={styles.emptySub}>Ask a parent to add family photos first.</Text>
        </View>
      ) : (
        <View style={styles.gridWrapper}>
          <View style={[styles.grid, { width: cols * (cardSize + 12) }]}>
            {cards.map((card, index) => (
              <View key={card.id} style={{ width: cardSize, height: cardSize, margin: 6 }}>
                <FlipCard
                  card={card}
                  isFlipped={flipped.includes(index)}
                  isMatched={matched.includes(index)}
                  onPress={() => handleFlip(index)}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Modals */}
      <MatchModal
        visible={matchModal.visible}
        personName={matchModal.name}
        onDismiss={() => setMatchModal({ visible: false, name: "" })}
      />
      <WinModal visible={winModal} moves={moves} onReplay={loadData} />
    </View>
  );
}

/* ══════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AMETHYST_FAINT },

  /* ── Hero ── */
  hero: {
    height: 215, overflow: "visible", position: "relative", zIndex: 1,
  },
  moonWrapper: {
    position: "absolute", top: 16, right: 20, zIndex: 5,
    shadowColor: GOLD_WARM,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55, shadowRadius: 16,
  },
  heroContent: {
    position: "absolute", bottom: 62, left: 18,
    flexDirection: "row", alignItems: "flex-end",
  },
  bunnyWrapper: {
    width: 84, height: 84,
    shadowColor: INDIGO,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 10,
  },
  heroTextBlock: { marginLeft: 14, marginBottom: 4 },
  heroLabel: {
    fontSize: 10, fontWeight: "800",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 3.5, marginBottom: 3,
  },
  heroTitle: {
    fontSize: 32, fontWeight: "900", color: WHITE,
    letterSpacing: -0.8,
    textShadowColor: INDIGO, textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 10,
  },
  heroSubRow: {
    flexDirection: "row", alignItems: "center", gap: 8, marginTop: 7,
  },
  heroSubDash: {
    width: 20, height: 1.5,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 1,
  },
  heroSub: {
    fontSize: 12.5, color: WHITE, fontWeight: "700", letterSpacing: 0.4,
    opacity: 0.88,
  },

  /* ── Stats bar ── */
  statsBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: WHITE,
    marginHorizontal: 18, marginTop: 10,
    borderRadius: 26, paddingVertical: 14, paddingHorizontal: 18,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12, shadowRadius: 22, elevation: 10,
    borderWidth: 1.5, borderColor: AMETHYST_PALE,
    zIndex: 10,
  },
  statChip:       { flex: 1, alignItems: "center", gap: 5 },
  statIconCircle: {
    width: 40, height: 40, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  statValue: { fontSize: 24, fontWeight: "900", color: TEXT_NIGHT },
  statLabel: {
    fontSize: 9, color: TEXT_DUSK, fontWeight: "800",
    letterSpacing: 0.8,
  },
  statDivider: {
    width: 1.5, height: 44,
    backgroundColor: AMETHYST_PALE,
    marginHorizontal: 8,
  },
  refreshBtn: {
    width: 46, height: 46, borderRadius: 18,
    backgroundColor: AMETHYST_PALE,
    alignItems: "center", justifyContent: "center",
    marginLeft: 6,
    shadowColor: AMETHYST,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18, shadowRadius: 6, elevation: 3,
  },

  /* ── Grid ── */
  gridWrapper: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingTop: 18, paddingBottom: 8,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },

  /* ── Cards ── */
  cardOuter: { width: "100%", height: "100%" },
  cardFace: {
    position: "absolute", width: "100%", height: "100%",
    borderRadius: 20, overflow: "hidden", backfaceVisibility: "hidden",
  },
  cardBack:  { backgroundColor: AMETHYST },
  cardFront: {
    backgroundColor: WHITE,
    shadowColor: INDIGO,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  cardMatched: {
    borderWidth: 3, borderColor: AMETHYST_SOFT,
    shadowColor: AMETHYST_SOFT, shadowOpacity: 0.55,
  },
  cardImage:  { width: "100%", height: "100%", borderRadius: 17 },

  /* Name ribbon */
  cardRibbon: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingVertical: 5, paddingHorizontal: 6,
    alignItems: "center",
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  cardRibbonText: {
    fontSize: 10, fontWeight: "800", color: TEXT_NIGHT,
    letterSpacing: 0.2,
  },

  matchOverlay: { position: "absolute", top: 7, right: 7 },
  matchBadge: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: AMETHYST, alignItems: "center", justifyContent: "center",
    shadowColor: INDIGO,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.35, shadowRadius: 4,
  },

  /* ── Empty ── */
  emptyState: {
    flex: 1, alignItems: "center", justifyContent: "center",
    gap: 14, paddingBottom: 40,
  },
  emptyTitle: { fontSize: 22, fontWeight: "900", color: TEXT_NIGHT },
  emptySub:   {
    fontSize: 14, color: TEXT_DUSK, textAlign: "center",
    paddingHorizontal: 48, lineHeight: 22,
  },

  /* ── Modal overlay ── */
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(10,6,24,0.55)",
    alignItems: "center", justifyContent: "center",
  },

  /* ── Match modal ── */
  matchCard: {
    backgroundColor: WHITE, borderRadius: 32,
    paddingHorizontal: 38, paddingVertical: 32,
    alignItems: "center", gap: 9,
    shadowColor: AMETHYST,
    shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.3, shadowRadius: 30, elevation: 18,
    borderWidth: 1.5, borderColor: AMETHYST_PALE,
  },
  matchPill: {
    backgroundColor: AMETHYST_PALE, borderRadius: 20,
    paddingHorizontal: 22, paddingVertical: 7, marginTop: 4,
  },
  matchPillText: { fontSize: 14, fontWeight: "800", color: AMETHYST, letterSpacing: 0.3 },
  matchName:     { fontSize: 26, fontWeight: "900", color: TEXT_NIGHT },
  matchSub:      { fontSize: 13, color: TEXT_DUSK, fontWeight: "600" },

  /* ── Win modal ── */
  winCard: {
    backgroundColor: WHITE, borderRadius: 36,
    paddingHorizontal: 32, paddingVertical: 36,
    alignItems: "center", gap: 10, width: SCREEN_W * 0.85,
    shadowColor: AMETHYST,
    shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.32, shadowRadius: 34, elevation: 20,
    borderWidth: 1.5, borderColor: AMETHYST_PALE,
  },
  winTitle: {
    fontSize: 30, fontWeight: "900", color: TEXT_NIGHT, letterSpacing: -0.3,
  },
  winSub: {
    fontSize: 14, color: TEXT_DUSK, textAlign: "center", lineHeight: 20, fontWeight: "500",
  },
  starRow:  { flexDirection: "row", gap: 6, marginTop: 2 },
  winStatsRow: { flexDirection: "row", gap: 14, marginTop: 6 },
  winStatChip: {
    backgroundColor: AMETHYST_PALE, borderRadius: 20,
    paddingVertical: 14, paddingHorizontal: 24,
    alignItems: "center", gap: 2,
  },
  winStatValue: { fontSize: 24, fontWeight: "900", color: AMETHYST },
  winStatLabel: {
    fontSize: 9.5, color: TEXT_DUSK, fontWeight: "800",
    textTransform: "uppercase", letterSpacing: 0.6,
  },

  replayBtn: {
    marginTop: 12,
    flexDirection: "row", alignItems: "center",
    backgroundColor: AMETHYST, borderRadius: 22,
    paddingVertical: 16, paddingHorizontal: 36,
    shadowColor: INDIGO,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 16, elevation: 10,
  },
  replayBtnText: { color: WHITE, fontWeight: "900", fontSize: 16, letterSpacing: 0.5 },

  /* ── Mascot ── */
  mascotEye: { position: "absolute", width: 10, height: 10 },
});