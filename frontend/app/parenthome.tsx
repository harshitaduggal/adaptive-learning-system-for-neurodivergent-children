import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
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
  Rect,
  Stop
} from "react-native-svg";

const { width: SW } = Dimensions.get("window");

/* ══════════════════════════════════════════════
   COLORS
══════════════════════════════════════════════ */
const C = {
  purple:      "#7C4DFF",
  purpleLight: "#9C6FFF",
  purplePale:  "#EDE8FF",
  teal:        "#2BB3B1",
  tealPale:    "#D8F5F4",
  peach:       "#FF8C69",
  peachPale:   "#FFE8DF",
  mint:        "#3DD6A3",
  mintPale:    "#D6F7EE",
  yellow:      "#FFB830",
  yellowPale:  "#FFF3D0",
  pink:        "#FF6B9D",
  pinkPale:    "#FFE0EC",
  bg:          "#F4F0FF",
  white:       "#FFFFFF",
  dark:        "#1E1245",
  mid:         "#6B5A9E",
  muted:       "#A89DC8",
};

/* ══════════════════════════════════════════════
   SVG DECORATIONS
══════════════════════════════════════════════ */
function HeroBg() {
  return (
    <Svg
      width="100%"
      height={220}
      viewBox="0 0 390 220"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <LinearGradient id="heroG" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7C4DFF" />
          <Stop offset="1" stopColor="#5C2ECC" />
        </LinearGradient>
      </Defs>
      <Rect width={390} height={240} fill="url(#heroG)" />
      {/* wave bottom */}
      <Path
        d="M0 175 Q100 148 200 175 Q300 202 390 170 L390 240 L0 240 Z"
        fill={C.bg}
      />
      {/* orbs */}
      <Circle cx={350} cy={40} r={52} fill="#FFFFFF" opacity={0.06} />
      <Circle cx={320} cy={90} r={28} fill="#FFFFFF" opacity={0.08} />
      <Circle cx={18} cy={70} r={36} fill="#FFFFFF" opacity={0.05} />
      <Circle cx={52} cy={30} r={12} fill="#FFB830" opacity={0.45} />
      <Circle cx={360} cy={140} r={8}  fill="#FF6B9D" opacity={0.4} />
      <Rect x={300} y={18} width={11} height={11} rx={3} fill="#3DD6A3" opacity={0.55} />
      <Rect x={55}  y={110} width={8} height={8} rx={2} fill="#FF8C69" opacity={0.45} />
    </Svg>
  );
}

function BunnyMascot({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={(size * 80) / 72} viewBox="0 0 72 80">
      <Defs>
        <LinearGradient id="bG" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E8DEFF" />
        </LinearGradient>
      </Defs>
      <Ellipse cx={22} cy={22} rx={8}  ry={18} fill="#F0E8FF" />
      <Ellipse cx={22} cy={22} rx={4}  ry={12} fill="#C9B0F7" />
      <Ellipse cx={50} cy={22} rx={8}  ry={18} fill="#F0E8FF" />
      <Ellipse cx={50} cy={22} rx={4}  ry={12} fill="#C9B0F7" />
      <Ellipse cx={36} cy={57} rx={22} ry={20} fill="url(#bG)" />
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
    <Svg width={28} height={28} viewBox="0 0 28 28">
      <Rect x={2} y={8} width={24} height={14} rx={6} stroke={color} strokeWidth={2} fill="none" />
      <Path d="M9 13 L9 17 M7 15 L11 15" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={18} cy={13} r={1.5} fill={color} />
      <Circle cx={21} cy={16} r={1.5} fill={color} />
    </Svg>
  );
}

function IconChart({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28">
      <Rect x={4} y={16} width={5} height={8}  rx={2} fill={color} opacity={0.7} />
      <Rect x={11} y={10} width={5} height={14} rx={2} fill={color} />
      <Rect x={18} y={4}  width={5} height={20} rx={2} fill={color} opacity={0.7} />
    </Svg>
  );
}

function IconProgress({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28">
      <Circle cx={14} cy={14} r={11} stroke={color} strokeWidth={2} fill="none" opacity={0.3} />
      <Path
        d="M14 3 A11 11 0 0 1 25 14"
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx={14} cy={14} r={3} fill={color} />
    </Svg>
  );
}

function IconBook({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28">
      <Path
        d="M6 5 L6 23 Q14 20 22 23 L22 5 Q14 8 6 5 Z"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinejoin="round"
      />
      <Path d="M14 8 L14 20" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M9 10 Q14 8.5 19 10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M9 13 Q14 11.5 19 13" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function IconChild({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28">
      <Circle cx={14} cy={9} r={5.5} stroke={color} strokeWidth={2} fill="none" />
      <Path
        d="M5 24 C5 18.5 9 15.5 14 15.5 C19 15.5 23 18.5 23 24"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx={14} cy={9} r={2} fill={color} opacity={0.4} />
    </Svg>
  );
}

function IconSettings({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28">
      <Circle cx={14} cy={14} r={4}  stroke={color} strokeWidth={2} fill="none" />
      <Path
        d="M14 2 L14 5 M14 23 L14 26 M2 14 L5 14 M23 14 L26 14 M5.7 5.7 L7.8 7.8 M20.2 20.2 L22.3 22.3 M22.3 5.7 L20.2 7.8 M7.8 20.2 L5.7 22.3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* ─── Arrow icon ─────────────────────────────────────────── */
function ArrowRight({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Path
        d="M3 8 L13 8 M9 4 L13 8 L9 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/* ══════════════════════════════════════════════
   ANIMATED CARD
══════════════════════════════════════════════ */
function AnimCard({
  children,
  style,
  onPress,
  delay = 0,
}: {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  delay?: number;
}) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 420,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 420,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={!onPress}
        style={{ flex: 1 }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ══════════════════════════════════════════════
   MINI PROGRESS BAR
══════════════════════════════════════════════ */
function ProgressBar({ value, color }: { value: number; color: string }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value,
      duration: 900,
      delay: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={pbStyles.track}>
      <Animated.View
        style={[
          pbStyles.fill,
          {
            backgroundColor: color,
            width: anim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
}

const pbStyles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 10,
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});

/* ══════════════════════════════════════════════
   TASK ROW
══════════════════════════════════════════════ */
function TaskRow({
  label,
  done,
  color,
}: {
  label: string;
  done: boolean;
  color: string;
}) {
  return (
    <View style={trStyles.row}>
      <View style={[trStyles.dot, { backgroundColor: done ? color : "rgba(255,255,255,0.3)" }]}>
        {done && (
          <Svg width={10} height={10} viewBox="0 0 10 10">
            <Path
              d="M2 5 L4 7 L8 3"
              stroke="#FFF"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        )}
      </View>
      <Text style={[trStyles.label, done && trStyles.done]}>{label}</Text>
    </View>
  );
}

const trStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 8,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
  },
  label: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    flex: 1,
  },
  done: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
});

/* ══════════════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════════════ */
export default function ParentHome() {
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Hero ── */}
      <View style={styles.hero}>
        <HeroBg />
        <View style={styles.heroInner}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.heroTitle}>Parent Portal</Text>
            <Text style={styles.heroDate}>{today}</Text>
          </View>
          <BunnyMascot size={62} />
        </View>
      </View>

      {/* ── Scroll body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── BENTO GRID ── */}
        <View style={styles.bentoRow}>

          {/* Large: Open Child Portal */}
          <AnimCard
            delay={60}
            style={[styles.bentoCard, styles.cardLarge, { backgroundColor: C.purple }]}
            onPress={() => router.push("/childhome")}
          >
            <View style={styles.cardInner}>
              <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
                <IconChild color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardLabel}>Child Portal</Text>
                <Text style={styles.cardTitle}>Open now</Text>
              </View>
              <View style={styles.arrowCircle}>
                <ArrowRight color={C.purple} />
              </View>
            </View>
            {/* decorative */}
            <View style={styles.cardOrb1} />
            <View style={styles.cardOrb2} />
          </AnimCard>

          {/* Small: Today's Progress */}
          <AnimCard
            delay={120}
            style={[styles.bentoCard, styles.cardSmall, { backgroundColor: C.mint }]}
            onPress={() => {}}
          >
            <View style={styles.cardInnerCol}>
              <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                <IconProgress color="#FFFFFF" />
              </View>
              <Text style={styles.cardLabel}>Today</Text>
              <Text style={styles.cardTitle}>Progress</Text>
              <ProgressBar value={68} color="rgba(255,255,255,0.9)" />
              <Text style={styles.progressPct}>68%</Text>
            </View>
          </AnimCard>

        </View>

        <View style={styles.bentoRow}>

          {/* Small: Game Setup */}
          <AnimCard
            delay={180}
            style={[styles.bentoCard, styles.cardSmall, { backgroundColor: C.peach }]}
            onPress={() => router.push("/setupgames")}
          >
            <View style={styles.cardInnerCol}>
              <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                <IconGamepad color="#FFFFFF" />
              </View>
              <Text style={styles.cardLabel}>Games</Text>
              <Text style={styles.cardTitle}>Setup</Text>
              <View style={styles.cardChip}>
                <Text style={styles.cardChipText}>Tap to edit</Text>
              </View>
            </View>
          </AnimCard>

          {/* Large: Homework */}
          <AnimCard
            delay={240}
            style={[styles.bentoCard, styles.cardLarge, { backgroundColor: C.pink }]}
            onPress={() => {}}
          >
            <View style={styles.cardInner}>
              <View>
                <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                  <IconBook color="#FFFFFF" />
                </View>
                <Text style={styles.cardLabel}>Assignments</Text>
                <Text style={styles.cardTitle}>Homework</Text>
              </View>
            </View>
            <View style={styles.taskList}>
              <TaskRow label="Counting 1–20" done={true}  color="#FFFFFF" />
              <TaskRow label="Color shapes"   done={true}  color="#FFFFFF" />
              <TaskRow label="Story time"     done={false} color="#FFFFFF" />
            </View>
          </AnimCard>

        </View>

        <View style={styles.bentoRow}>

          {/* Medium: Visualization */}
          <AnimCard
            delay={300}
            style={[styles.bentoCard, styles.cardMedium, { backgroundColor: C.teal }]}
            onPress={() => {}}
          >
            <View style={styles.cardInnerCol}>
              <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.22)" }]}>
                <IconChart color="#FFFFFF" />
              </View>
              <Text style={styles.cardLabel}>Boards</Text>
              <Text style={styles.cardTitle}>Visualization</Text>
              {/* mini bar chart */}
              <View style={vizStyles.bars}>
                {[40, 70, 55, 90, 65, 80].map((h, i) => (
                  <View key={i} style={[vizStyles.bar, { height: h * 0.4, opacity: 0.6 + i * 0.07 }]} />
                ))}
              </View>
            </View>
          </AnimCard>

          {/* Medium: Child Settings */}
          <AnimCard
            delay={360}
            style={[styles.bentoCard, styles.cardMedium, { backgroundColor: C.yellow }]}
            onPress={() => {}}
          >
            <View style={styles.cardInnerCol}>
              <View style={[styles.iconBubble, { backgroundColor: "rgba(255,255,255,0.28)" }]}>
                <IconSettings color="#FFFFFF" />
              </View>
              <Text style={styles.cardLabel}>Child</Text>
              <Text style={styles.cardTitle}>Settings</Text>
              <View style={{ marginTop: 8, gap: 4 }}>
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

        {/* ── Quick summary strip ── */}
        <AnimCard delay={420} style={styles.summaryCard} onPress={() => {}}>
          <View style={styles.summaryInner}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>3</Text>
              <Text style={styles.summarySub}>Games played</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>12m</Text>
              <Text style={styles.summarySub}>Screen time</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>2/3</Text>
              <Text style={styles.summarySub}>Tasks done</Text>
            </View>
          </View>
        </AnimCard>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

/* ─── Viz bars ─────────────────── */
const vizStyles = StyleSheet.create({
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    marginTop: 10,
    height: 38,
  },
  bar: {
    width: 12,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 4,
  },
});

const settingStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  label: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
});

/* ─── Main styles ──────────────── */
const CARD_GAP   = 10;
const SIDE_PAD   = 18;
const TOTAL_WIDTH = SW - SIDE_PAD * 2 - CARD_GAP;

const CARD_W_SM = TOTAL_WIDTH * 0.36;
const CARD_W_LG = TOTAL_WIDTH * 0.64 - 2;
const CARD_W_MD = TOTAL_WIDTH / 2 - 2;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  /* hero */
  hero: {
    height: 220,
    position: "relative",
    overflow: "hidden",
  },
  heroInner: {
  position: "absolute",
  bottom: 56,
  left: SIDE_PAD,
  right: SIDE_PAD,
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "space-between",
},
  greeting: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  heroDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 3,
  },

  /* scroll */
  scroll: {
    flex: 1,
    marginTop: -10,
  },
  scrollContent: {
  paddingHorizontal: SIDE_PAD,
  paddingTop: 18,
  paddingBottom: 40,
},

  /* bento row */
  bentoRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: CARD_GAP,
},

  /* card base */
  bentoCard: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },

  cardSmall: {
    width: CARD_W_SM,
    minHeight: 170,
  },
  cardLarge: {
    width: CARD_W_LG,
    minHeight: 170,
  },
  cardMedium: {
    width: CARD_W_MD,
    minHeight: 160,
  },

  /* card internals */
  cardInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  cardInnerCol: {
    flex: 1,
  },

  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  cardLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
    flexShrink: 1
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    flexShrink: 1
  },

  cardChip: {
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  cardChipText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },

  /* decorative orbs inside child portal card */
  cardOrb1: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.07)",
    bottom: -20,
    right: -20,
  },
  cardOrb2: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.07)",
    bottom: 20,
    right: 30,
  },

  /* homework tasks */
  taskList: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },

  progressPct: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "700",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  /* summary strip */
  summaryCard: {
    backgroundColor: C.white,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: C.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryInner: {
    flexDirection: "row",
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNum: {
    fontSize: 22,
    fontWeight: "900",
    color: C.dark,
  },
  summarySub: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "500",
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: C.purplePale,
    marginVertical: 4,
  },
});