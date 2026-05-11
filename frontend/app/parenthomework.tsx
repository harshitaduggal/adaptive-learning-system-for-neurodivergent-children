import React, { useState } from "react";
import {
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
  Rect,
  Stop,
} from "react-native-svg";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";

const { width: SW } = Dimensions.get("window");
const SIDE_PAD = 16;

/* ── Colors (matches app theme) ─────────────────────────────── */
const C = {
  bg:          "#F4F0FF",
  heroBg:      "#1A0A4C",
  heroMid:     "#2D1275",
  purple:      "#7C3AED",
  purpleLight: "#A78BFA",
  purplePale:  "#EDE8FF",
  cardBorder:  "rgba(196,181,253,0.3)",
  white:       "#FFFFFF",
  dark:        "#1E1245",
  mid:         "#6B5A9E",
  muted:       "#A89DC8",
  // Topic accent colors
  emotionBg:   "#FF6B9D",
  emotionPale: "#FFE0EC",
  twoWordBg:   "#7C3AED",
  twoWordPale: "#EDE8FF",
  oppositeBg:  "#2BB3B1",
  oppositePale:"#D8F5F4",
  doneBg:      "#34D399",
};

/* ── Sparkle ─────────────────────────────────────────────────── */
function Sparkle({ size, top, left }: { size: number; top: number; left: number }) {
  const h = size * 0.25;
  const s = size;
  return (
    <View style={{ position: "absolute", top, left, opacity: 0.7 }}>
      <Svg width={s * 2} height={s * 2} viewBox={`0 0 ${s * 2} ${s * 2}`}>
        <Path
          d={`M${s} 0 L${s+h} ${s-h} L${s*2} ${s} L${s+h} ${s+h} L${s} ${s*2} L${s-h} ${s+h} L0 ${s} L${s-h} ${s-h} Z`}
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
}

/* ── Hero background ─────────────────────────────────────────── */
const HERO_H = 160;
function HeroBg() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Svg width="100%" height={HERO_H} viewBox={`0 0 ${SW} ${HERO_H}`} style={StyleSheet.absoluteFill} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="hg" x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor="#1A0A4C" />
            <Stop offset="1" stopColor="#2D1275" />
          </LinearGradient>
        </Defs>
        <Rect width={SW} height={HERO_H + 20} fill="url(#hg)" />
        <Path
          d={`M0 ${HERO_H - 24} Q${SW * 0.25} ${HERO_H - 48} ${SW * 0.5} ${HERO_H - 26} Q${SW * 0.75} ${HERO_H - 6} ${SW} ${HERO_H - 32} L${SW} ${HERO_H + 20} L0 ${HERO_H + 20} Z`}
          fill={C.bg}
        />
      </Svg>
      <View style={{ position:"absolute", width:180, height:180, borderRadius:90, backgroundColor:"#5B21B6", top:-60, left:-50, opacity:0.4 }} />
      <View style={{ position:"absolute", width:130, height:130, borderRadius:65, backgroundColor:"#4C1D95", top:-20, right:-40, opacity:0.35 }} />
      {/* crescent */}
      <View style={{ position:"absolute", top:16, left:"60%", opacity:0.32 }}>
        <View style={{ width:32, height:32, overflow:"hidden" }}>
          <View style={{ position:"absolute", width:32, height:32, borderRadius:16, backgroundColor:"#C4B5FD" }} />
          <View style={{ position:"absolute", width:25, height:25, borderRadius:12.5, backgroundColor:"#1E0A4C", top:-2, left:7 }} />
        </View>
      </View>
      <Sparkle size={4} top={14} left={18} />
      <Sparkle size={6} top={10} left={SW * 0.75} />
      <Sparkle size={4} top={52} left={SW * 0.55} />
      <Sparkle size={5} top={36} left={SW - 22} />
    </View>
  );
}

/* ── Bunny mascot (from parenthome) ─────────────────────────── */
function BunnyMascot({ size = 44 }: { size?: number }) {
  return (
    <Svg width={size} height={(size * 80) / 72} viewBox="0 0 72 80">
      <Defs>
        <LinearGradient id="bG" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E8DEFF" />
        </LinearGradient>
      </Defs>
      <Ellipse cx={22} cy={22} rx={8} ry={18} fill="#F0E8FF" />
      <Ellipse cx={22} cy={22} rx={4} ry={12} fill="#C9B0F7" />
      <Ellipse cx={50} cy={22} rx={8} ry={18} fill="#F0E8FF" />
      <Ellipse cx={50} cy={22} rx={4} ry={12} fill="#C9B0F7" />
      <Ellipse cx={36} cy={57} rx={22} ry={20} fill="url(#bG)" />
      <Circle cx={36} cy={40} r={20} fill="#FFFFFF" />
      <Circle cx={28} cy={38} r={4} fill="#5B3EA0" />
      <Circle cx={44} cy={38} r={4} fill="#5B3EA0" />
      <Circle cx={29} cy={37} r={1.5} fill="#FFFFFF" />
      <Circle cx={45} cy={37} r={1.5} fill="#FFFFFF" />
      <Ellipse cx={36} cy={44} rx={3} ry={2} fill="#FFB3C6" />
      <Circle cx={23} cy={44} r={5} fill="#FFD6E0" opacity={0.5} />
      <Circle cx={49} cy={44} r={5} fill="#FFD6E0" opacity={0.5} />
      <Ellipse cx={36} cy={58} rx={12} ry={10} fill="#F0E8FF" />
    </Svg>
  );
}

/* ── Data ────────────────────────────────────────────────────── */
const TOPICS = [
  {
    id: "emotions",
    label: "Emotions",
    color: C.emotionBg,
    pale: C.emotionPale,
    emoji: "😊",
    instruction: "Look at each face. Say the feeling out loud, then act it out!",
    items: [
      { word: "Happy",   emoji: "😄", prompt: "Make a happy face! What makes YOU happy?" },
      { word: "Sad",     emoji: "😢", prompt: "Make a sad face. When do you feel sad?" },
      { word: "Angry",   emoji: "😠", prompt: "Stomp your feet like you're angry!" },
      { word: "Scared",  emoji: "😨", prompt: "What are you scared of? It's ok to say!" },
      { word: "Excited", emoji: "🤩", prompt: "Jump up and down — you're SO excited!" },
      { word: "Tired",   emoji: "😴", prompt: "Yawn and stretch like you're sleepy." },
      { word: "Surprised", emoji: "😮", prompt: "Open your eyes wide — surprise!" },
      { word: "Proud",   emoji: "😎", prompt: "Stand tall! What are you proud of?" },
    ],
  },
  {
    id: "twowords",
    label: "Two-Word Phrases",
    color: C.twoWordBg,
    pale: C.twoWordPale,
    emoji: "💬",
    instruction: "Read each phrase together. Then use it in a sentence!",
    items: [
      { word: "Big Dog",    emoji: "🐕", prompt: "Can you think of another BIG animal?" },
      { word: "Red Ball",   emoji: "🔴", prompt: "Find something red in the room!" },
      { word: "Hot Sun",    emoji: "☀️",  prompt: "What do you do when the sun is hot?" },
      { word: "Fast Car",   emoji: "🚗", prompt: "Make a car sound — VROOOOM!" },
      { word: "Cold Ice",   emoji: "🧊", prompt: "Brrr! Touch something cold today." },
      { word: "Tall Tree",  emoji: "🌳", prompt: "Stretch up high like a tall tree!" },
      { word: "Blue Sky",   emoji: "🌤️", prompt: "Look outside — is the sky blue?" },
      { word: "Soft Bunny", emoji: "🐰", prompt: "What else is soft and fluffy?" },
    ],
  },
  {
    id: "opposites",
    label: "Opposites",
    color: C.oppositeBg,
    pale: C.oppositePale,
    emoji: "↔️",
    instruction: "Say both words. Then show them with your body or find them around you!",
    items: [
      { word: "Big / Small",   emoji: "🐘🐭", prompt: "Make yourself BIG, then SMALL!" },
      { word: "Hot / Cold",    emoji: "🔥❄️",  prompt: "Name something hot and something cold." },
      { word: "Fast / Slow",   emoji: "🐆🐢", prompt: "Walk fast, then walk slow." },
      { word: "Up / Down",     emoji: "⬆️⬇️", prompt: "Point up! Now point down!" },
      { word: "Day / Night",   emoji: "☀️🌙", prompt: "What do you do in the day? At night?" },
      { word: "Loud / Quiet",  emoji: "📢🤫", prompt: "Say something LOUD, then whisper." },
      { word: "Happy / Sad",   emoji: "😄😢", prompt: "Make a happy face, then a sad face." },
      { word: "Open / Closed", emoji: "🚪🔒", prompt: "Open your hands, then close them!" },
    ],
  },
];

/* ── Checkbox item ───────────────────────────────────────────── */
function CheckItem({
  word, emoji, prompt, color, checked, onToggle,
}: {
  word: string; emoji: string; prompt: string; color: string;
  checked: boolean; onToggle: () => void;
}) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.75} style={itemSt.row}>
      {/* checkbox */}
      <View style={[itemSt.check, checked && { backgroundColor: C.doneBg, borderColor: C.doneBg }]}>
        {checked && (
          <Svg width={14} height={14} viewBox="0 0 14 14">
            <Path d="M2 7 L5.5 10.5 L12 3.5" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        )}
      </View>
      <View style={itemSt.content}>
        <View style={itemSt.wordRow}>
          <Text style={itemSt.emoji}>{emoji}</Text>
          <Text style={[itemSt.word, checked && itemSt.wordDone]}>{word}</Text>
        </View>
        <Text style={itemSt.prompt}>{prompt}</Text>
      </View>
    </TouchableOpacity>
  );
}

const itemSt = StyleSheet.create({
  row:     { flexDirection:"row", alignItems:"flex-start", paddingVertical:10, paddingHorizontal:14, borderBottomWidth:1, borderBottomColor:"rgba(0,0,0,0.05)" },
  check:   { width:22, height:22, borderRadius:7, borderWidth:2, borderColor:"rgba(0,0,0,0.18)", alignItems:"center", justifyContent:"center", marginTop:2, marginRight:12, flexShrink:0 },
  content: { flex:1 },
  wordRow: { flexDirection:"row", alignItems:"center", gap:6, marginBottom:3 },
  emoji:   { fontSize:18 },
  word:    { fontSize:15, fontWeight:"700", color:C.dark },
  wordDone:{ textDecorationLine:"line-through", opacity:0.45 },
  prompt:  { fontSize:12, color:C.mid, lineHeight:17 },
});

/* ── Topic section card ──────────────────────────────────────── */
function TopicCard({ topic, checks, onToggle }: {
  topic: typeof TOPICS[0];
  checks: boolean[];
  onToggle: (i: number) => void;
}) {
  const done  = checks.filter(Boolean).length;
  const total = topic.items.length;
  const pct   = Math.round((done / total) * 100);
  const allDone = done === total;

  return (
    <View style={cardSt.wrap}>
      {/* Header */}
      <View style={[cardSt.header, { backgroundColor: topic.color }]}>
        <View style={cardSt.headerLeft}>
          <Text style={cardSt.headerEmoji}>{topic.emoji}</Text>
          <View>
            <Text style={cardSt.headerLabel}>Topic</Text>
            <Text style={cardSt.headerTitle}>{topic.label}</Text>
          </View>
        </View>
        <View style={cardSt.badge}>
          <Text style={cardSt.badgeText}>{done}/{total}</Text>
        </View>
      </View>

      {/* Instruction strip */}
      <View style={[cardSt.instruction, { backgroundColor: topic.pale }]}>
        <Text style={[cardSt.instructionText, { color: topic.color }]}>
          📋 {topic.instruction}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={cardSt.progressTrack}>
        <View style={[cardSt.progressFill, { width: `${pct}%` as any, backgroundColor: allDone ? C.doneBg : topic.color }]} />
      </View>

      {/* Items */}
      {topic.items.map((item, i) => (
        <CheckItem
          key={i}
          word={item.word}
          emoji={item.emoji}
          prompt={item.prompt}
          color={topic.color}
          checked={checks[i]}
          onToggle={() => onToggle(i)}
        />
      ))}

      {/* All done celebration */}
      {allDone && (
        <View style={[cardSt.celebrate, { backgroundColor: topic.pale }]}>
          <Text style={[cardSt.celebrateText, { color: topic.color }]}>
            🎉 Amazing! All done with {topic.label}!
          </Text>
        </View>
      )}
    </View>
  );
}

const cardSt = StyleSheet.create({
  wrap:            { backgroundColor:C.white, borderRadius:20, overflow:"hidden", marginBottom:14, shadowColor:"#000", shadowOffset:{width:0,height:3}, shadowOpacity:0.08, shadowRadius:10, elevation:4 },
  header:          { flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingHorizontal:14, paddingVertical:12 },
  headerLeft:      { flexDirection:"row", alignItems:"center", gap:10 },
  headerEmoji:     { fontSize:26 },
  headerLabel:     { fontSize:9, color:"rgba(255,255,255,0.75)", fontWeight:"600", textTransform:"uppercase", letterSpacing:0.5 },
  headerTitle:     { fontSize:17, fontWeight:"800", color:"#FFFFFF" },
  badge:           { backgroundColor:"rgba(255,255,255,0.25)", borderRadius:10, paddingHorizontal:10, paddingVertical:4 },
  badgeText:       { fontSize:13, fontWeight:"800", color:"#FFFFFF" },
  instruction:     { paddingHorizontal:14, paddingVertical:9 },
  instructionText: { fontSize:12, fontWeight:"600", lineHeight:17 },
  progressTrack:   { height:4, backgroundColor:"rgba(0,0,0,0.07)", overflow:"hidden" },
  progressFill:    { height:4, borderRadius:2 },
  celebrate:       { paddingVertical:12, alignItems:"center" },
  celebrateText:   { fontSize:13, fontWeight:"700" },
});

/* ── Reset confirm button ────────────────────────────────────── */
function ResetButton({ onReset }: { onReset: () => void }) {
  const [confirm, setConfirm] = useState(false);
  if (confirm) {
    return (
      <View style={resetSt.row}>
        <Text style={resetSt.confirmText}>Reset all progress?</Text>
        <TouchableOpacity style={[resetSt.btn, resetSt.yes]} onPress={() => { onReset(); setConfirm(false); }}>
          <Text style={resetSt.yesText}>Yes, reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[resetSt.btn, resetSt.no]} onPress={() => setConfirm(false)}>
          <Text style={resetSt.noText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <TouchableOpacity style={resetSt.pill} onPress={() => setConfirm(true)} activeOpacity={0.75}>
      <Text style={resetSt.pillText}>↺  Start Over</Text>
    </TouchableOpacity>
  );
}

const resetSt = StyleSheet.create({
  pill:        { alignSelf:"center", marginTop:4, marginBottom:8, backgroundColor:"rgba(124,58,237,0.1)", borderRadius:20, paddingHorizontal:18, paddingVertical:8 },
  pillText:    { fontSize:13, fontWeight:"700", color:C.purple },
  row:         { flexDirection:"row", alignItems:"center", justifyContent:"center", gap:8, marginVertical:8 },
  confirmText: { fontSize:12, color:C.mid },
  btn:         { borderRadius:14, paddingHorizontal:12, paddingVertical:6 },
  yes:         { backgroundColor:"#FEE2E2" },
  no:          { backgroundColor:C.purplePale },
  yesText:     { fontSize:12, fontWeight:"700", color:"#DC2626" },
  noText:      { fontSize:12, fontWeight:"700", color:C.purple },
});

/* ── Main screen ─────────────────────────────────────────────── */
export default function ParentHomework() {
  // One boolean[] per topic
  const [checks, setChecks] = useState<boolean[][]>(
    TOPICS.map(t => Array(t.items.length).fill(false))
  );

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    return () => { ScreenOrientation.unlockAsync(); };
  }, []);

  const toggle = (topicIdx: number, itemIdx: number) => {
    setChecks(prev => {
      const next = prev.map(arr => [...arr]);
      next[topicIdx][itemIdx] = !next[topicIdx][itemIdx];
      return next;
    });
  };

  const reset = () => setChecks(TOPICS.map(t => Array(t.items.length).fill(false)));

  const totalItems = TOPICS.reduce((s, t) => s + t.items.length, 0);
  const totalDone  = checks.reduce((s, arr) => s + arr.filter(Boolean).length, 0);
  const allDone    = totalDone === totalItems;

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.heroBg} />

      {/* Hero */}
      <View style={st.hero}>
        <HeroBg />
        <View style={st.heroInner}>
          <View style={{ flex: 1 }}>
            <Text style={st.heroSub}>Today's Practice</Text>
            <Text style={st.heroTitle}>Homework Sheet</Text>
            <Text style={st.heroHint}>Tap each activity when done ✓</Text>
          </View>
          <BunnyMascot size={48} />
        </View>
      </View>

      <ScrollView
        style={st.scroll}
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall progress pill */}
        <View style={st.overallPill}>
          <View style={[st.overallFill, { width: `${Math.round((totalDone / totalItems) * 100)}%` as any }]} />
          <Text style={st.overallText}>
            {allDone ? "🎉 All done! Great job!" : `${totalDone} of ${totalItems} activities completed`}
          </Text>
        </View>

        {/* Parent tip */}
        <View style={st.tipBox}>
          <Text style={st.tipTitle}>👨‍👩‍👧 Parent Guide</Text>
          <Text style={st.tipBody}>
            Sit together and go through each section. Read the prompts aloud, let your child respond, and tick off each one as you go. No pressure — just fun!
          </Text>
        </View>

        {/* Topic cards */}
        {TOPICS.map((topic, ti) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            checks={checks[ti]}
            onToggle={(ii) => toggle(ti, ii)}
          />
        ))}

        <ResetButton onReset={reset} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

/* ── Root styles ─────────────────────────────────────────────── */
const st = StyleSheet.create({
  root:         { flex:1, backgroundColor:C.bg },
  hero:         { height:HERO_H, position:"relative", overflow:"hidden" },
  heroInner:    { position:"absolute", bottom:38, left:SIDE_PAD, right:SIDE_PAD, flexDirection:"row", alignItems:"flex-end", justifyContent:"space-between" },
  heroSub:      { fontSize:11, color:"rgba(255,255,255,0.6)", fontWeight:"600", letterSpacing:0.5, marginBottom:2 },
  heroTitle:    { fontSize:26, fontWeight:"900", color:"#FFFFFF", letterSpacing:-0.5 },
  heroHint:     { fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:3 },

  scroll:        { flex:1, marginTop:-8 },
  scrollContent: { paddingHorizontal:SIDE_PAD, paddingTop:16, paddingBottom:20 },

  overallPill: {
    height:36, backgroundColor:C.white, borderRadius:18, overflow:"hidden",
    justifyContent:"center", marginBottom:12,
    shadowColor:C.purple, shadowOffset:{width:0,height:2}, shadowOpacity:0.08, shadowRadius:6, elevation:2,
  },
  overallFill: { position:"absolute", left:0, top:0, bottom:0, backgroundColor:C.doneBg, opacity:0.25 },
  overallText: { textAlign:"center", fontSize:12, fontWeight:"700", color:C.dark },

  tipBox:   { backgroundColor:"rgba(124,58,237,0.07)", borderRadius:14, padding:13, marginBottom:14, borderLeftWidth:3, borderLeftColor:C.purple },
  tipTitle: { fontSize:12, fontWeight:"800", color:C.purple, marginBottom:4 },
  tipBody:  { fontSize:12, color:C.mid, lineHeight:18 },
});