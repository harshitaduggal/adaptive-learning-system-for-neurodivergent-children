/**
 * IndianFlowersHunt.tsx
 * ───────────────────────────────────────────────────────────────
 * Scavenger Hunt — Indian Flowers Edition
 * Part of the Adaptive Learning Platform for children.
 *
 * Features:
 *  - 12 iconic Indian flowers drawn as vibrant inline SVGs
 *  - Bilingual item names (English + Hindi/botanical)
 *  - Animated square checkbox per item (spring pop-in)
 *  - Card bounce on tap, strikethrough on found items
 *  - Progress bar + win banner with reset
 *  - Fredoka One font via @expo-google-fonts
 *  - Background image with a translucent overlay
 *
 * Dependencies:
 *   npx expo install react-native-svg expo-font
 *   npx expo install @expo-google-fonts/fredoka-one
 * ───────────────────────────────────────────────────────────────
 */
 
import React, { useState, useRef } from 'react';
import { useFonts, FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Animated, SafeAreaView, ImageBackground,
} from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
 
// ─── Constants ───────────────────────────────────────────────
 
const FONT        = 'FredokaOne_400Regular';
const BG_IMAGE    = require('../flowers_3.jpeg');
const DRAWING_SIZE = 110;
 
// ─── Theme ───────────────────────────────────────────────────
 
const THEME = {
  progressTrack: '#ffecb3',
  progressFill:  '#ffb300',
  titleColor:    '#e65100',
  subtitleColor: '#bf360c',
  countColor:    '#bf360c',
  winBg:         '#fff8e1',
  winTitle:      '#e65100',
  resetBtnBg:    '#ff8f00',
};
 
// ─── Helpers ─────────────────────────────────────────────────
 
/**
 * Generates evenly-spaced petal ellipses arranged in a ring.
 * Used by multiple flower drawings to avoid repetition.
 */
function petalRing(
  cx: number, cy: number, r: number,
  prx: number, pry: number,
  fill: string, stroke: string,
  count: number = 8,
) {
  return Array.from({ length: count }).map((_, i) => {
    const angle = (i * Math.PI * 2) / count;
    const px    = cx + r * Math.cos(angle);
    const py    = cy + r * Math.sin(angle);
    const deg   = (angle * 180) / Math.PI;
    return (
      <Ellipse
        key={i}
        cx={px.toFixed(1)} cy={py.toFixed(1)}
        rx={prx} ry={pry}
        fill={fill} stroke={stroke} strokeWidth="2"
        transform={`rotate(${deg.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})`}
      />
    );
  });
}
 
// ─── SVG Drawings ────────────────────────────────────────────
 
const DrawMarigold = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    {petalRing(50, 50, 26, 14, 8, '#FFA000', '#E65100', 12)}
    {petalRing(50, 50, 14, 10, 6, '#FFD54F', '#FF8F00', 10)}
    <Circle cx="50" cy="50" r="10" fill="#FF8F00" stroke="#E65100" strokeWidth="2.5" />
    <Circle cx="50" cy="50" r="6" fill="#FF6F00" />
    <Circle cx="46" cy="48" r="2" fill="#FFF3E0" />
    <Circle cx="54" cy="48" r="2" fill="#FFF3E0" />
    <Path d="M46 53 Q50 57 54 53" fill="none" stroke="#FFF3E0" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);
 
const DrawLotus = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="76" rx="34" ry="12" fill="#C8E6C9" stroke="#388E3C" strokeWidth="2.5" />
    <Ellipse cx="50" cy="76" rx="24" ry="7" fill="#A5D6A7" opacity={0.5} />
    <Path d="M50 72 Q30 62 26 40 Q36 32 44 56Z" fill="#F8BBD0" stroke="#880E4F" strokeWidth="2" />
    <Path d="M50 72 Q70 62 74 40 Q64 32 56 56Z" fill="#F8BBD0" stroke="#880E4F" strokeWidth="2" />
    <Path d="M50 72 Q22 54 18 32 Q30 24 44 50Z" fill="#FCE4EC" stroke="#880E4F" strokeWidth="2" />
    <Path d="M50 72 Q78 54 82 32 Q70 24 56 50Z" fill="#FCE4EC" stroke="#880E4F" strokeWidth="2" />
    <Path d="M50 72 Q36 58 30 44 Q40 36 50 56 Q60 36 70 44 Q64 58 50 72Z"
          fill="#F48FB1" stroke="#880E4F" strokeWidth="2.5" />
    <Path d="M50 68 Q42 58 40 48 Q46 44 50 58 Q54 44 60 48 Q58 58 50 68Z"
          fill="#F06292" stroke="#880E4F" strokeWidth="2" />
    <Circle cx="50" cy="52" r="8" fill="#FFF9C4" stroke="#F9A825" strokeWidth="2" />
    <Circle cx="50" cy="52" r="4" fill="#FFEE58" />
  </Svg>
);
 
const DrawJasmine = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Line x1="50" y1="90" x2="50" y2="62" stroke="#66BB6A" strokeWidth="4" strokeLinecap="round" />
    <Path d="M50 78 Q32 68 28 56 Q42 50 50 68Z" fill="#C8E6C9" stroke="#388E3C" strokeWidth="2" />
    <Path d="M50 68 Q68 58 72 46 Q58 40 50 58Z" fill="#A5D6A7" stroke="#388E3C" strokeWidth="2" />
    {petalRing(50, 46, 18, 7, 12, '#FFFDE7', '#E8EAF6', 6)}
    <Circle cx="50" cy="46" r="7" fill="#FFF176" stroke="#F9A825" strokeWidth="2" />
    <Circle cx="50" cy="46" r="4" fill="#FFEE58" />
    <Circle cx="34" cy="32" r="2.5" fill="#FFF9C4" opacity={0.8} />
    <Circle cx="66" cy="30" r="2" fill="#FFF9C4" opacity={0.8} />
    <Circle cx="50" cy="26" r="2" fill="#FFF9C4" opacity={0.8} />
  </Svg>
);
 
const DrawHibiscus = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Path d="M50 50 Q34 34 30 16 Q44 12 50 36Z" fill="#E53935" stroke="#B71C1C" strokeWidth="2.5" />
    <Path d="M50 50 Q66 34 70 16 Q56 12 50 36Z" fill="#EF5350" stroke="#B71C1C" strokeWidth="2.5" />
    <Path d="M50 50 Q26 52 16 44 Q16 30 42 40Z" fill="#E53935" stroke="#B71C1C" strokeWidth="2.5" />
    <Path d="M50 50 Q74 52 84 44 Q84 30 58 40Z" fill="#EF5350" stroke="#B71C1C" strokeWidth="2.5" />
    <Path d="M50 50 Q46 70 38 76 Q28 70 36 60Z" fill="#E53935" stroke="#B71C1C" strokeWidth="2.5" />
    <Path d="M50 36 Q42 28 34 20" fill="none" stroke="#C62828" strokeWidth="1.5" opacity={0.6} strokeLinecap="round" />
    <Path d="M50 36 Q58 28 66 20" fill="none" stroke="#C62828" strokeWidth="1.5" opacity={0.6} strokeLinecap="round" />
    <Line x1="50" y1="50" x2="50" y2="26" stroke="#AD1457" strokeWidth="3.5" />
    <Circle cx="50" cy="22" r="6" fill="#FF80AB" stroke="#AD1457" strokeWidth="2" />
    <Circle cx="46" cy="30" r="2" fill="#FF80AB" />
    <Circle cx="54" cy="30" r="2" fill="#FF80AB" />
    <Circle cx="48" cy="26" r="1.5" fill="#FF80AB" />
  </Svg>
);
 
const DrawChampa = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    {petalRing(50, 50, 20, 12, 20, '#FFF9C4', '#F9A825', 5)}
    {Array.from({ length: 5 }).map((_, i) => {
      const angle = (i * Math.PI * 2) / 5;
      const px    = 50 + 20 * Math.cos(angle);
      const py    = 50 + 20 * Math.sin(angle);
      return (
        <Line key={i}
          x1="50" y1="50"
          x2={px.toFixed(1)} y2={py.toFixed(1)}
          stroke="#F9A825" strokeWidth="1.5" opacity={0.5}
          strokeLinecap="round"
        />
      );
    })}
    <Circle cx="50" cy="50" r="10" fill="#FF8F00" stroke="#E65100" strokeWidth="2.5" />
    <Circle cx="50" cy="50" r="6" fill="#FFA000" />
    <Circle cx="47" cy="47" r="2.5" fill="#FFF3E0" opacity={0.8} />
  </Svg>
);
 
const DrawSunflower = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    {petalRing(50, 50, 28, 14, 6, '#FDD835', '#F9A825', 14)}
    {petalRing(50, 50, 20, 10, 5, '#FFEE58', '#FBC02D', 14)}
    <Circle cx="50" cy="50" r="16" fill="#5D4037" stroke="#3E2723" strokeWidth="2.5" />
    <Circle cx="50" cy="50" r="11" fill="#6D4C41" />
    <Circle cx="50" cy="50" r="7" fill="#795548" />
    <Circle cx="45" cy="48" r="2.5" fill="#FFCCBC" />
    <Circle cx="55" cy="48" r="2.5" fill="#FFCCBC" />
    <Path d="M45 54 Q50 58 55 54" fill="none" stroke="#FFCCBC" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
 
const DrawTulsi = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Line x1="50" y1="90" x2="50" y2="28" stroke="#388E3C" strokeWidth="5" strokeLinecap="round" />
    <Path d="M50 76 Q32 64 28 48 Q42 44 50 66Z" fill="#81C784" stroke="#2E7D32" strokeWidth="2" />
    <Path d="M50 66 Q68 54 72 38 Q58 34 50 56Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2" />
    <Path d="M50 54 Q34 44 30 30 Q44 26 50 46Z" fill="#A5D6A7" stroke="#2E7D32" strokeWidth="2" />
    <Path d="M50 66 Q38 58 32 52" fill="none" stroke="#2E7D32" strokeWidth="1.5" opacity={0.6} strokeLinecap="round" />
    <Path d="M50 56 Q62 48 66 42" fill="none" stroke="#2E7D32" strokeWidth="1.5" opacity={0.6} strokeLinecap="round" />
    <Ellipse cx="50" cy="24" rx="6" ry="12" fill="#A5D6A7" stroke="#388E3C" strokeWidth="2" />
    <Circle cx="50" cy="16" r="4" fill="#CE93D8" stroke="#6A1B9A" strokeWidth="1.5" />
    <Circle cx="46" cy="22" r="3" fill="#BA68C8" stroke="#6A1B9A" strokeWidth="1.5" />
    <Circle cx="54" cy="22" r="3" fill="#CE93D8" stroke="#6A1B9A" strokeWidth="1.5" />
  </Svg>
);
 
const DrawRose = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Line x1="50" y1="90" x2="50" y2="60" stroke="#388E3C" strokeWidth="4" strokeLinecap="round" />
    <Path d="M38 76 L44 66" fill="none" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" />
    <Path d="M62 72 L56 62" fill="none" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" />
    <Path d="M50 60 Q38 56 34 48 Q44 44 50 56Z" fill="#66BB6A" stroke="#388E3C" strokeWidth="1.5" />
    <Path d="M50 60 Q62 56 66 48 Q56 44 50 56Z" fill="#81C784" stroke="#388E3C" strokeWidth="1.5" />
    <Path d="M50 58 Q30 52 26 38 Q38 28 50 48Z" fill="#EF9A9A" stroke="#B71C1C" strokeWidth="2" />
    <Path d="M50 58 Q70 52 74 38 Q62 28 50 48Z" fill="#EF5350" stroke="#B71C1C" strokeWidth="2" />
    <Path d="M50 56 Q34 48 32 34 Q42 26 50 44 Q58 26 68 34 Q66 48 50 56Z"
          fill="#EF5350" stroke="#B71C1C" strokeWidth="2" />
    <Path d="M50 52 Q38 44 38 32 Q44 28 50 42 Q56 28 62 32 Q62 44 50 52Z"
          fill="#E53935" stroke="#C62828" strokeWidth="2" />
    <Ellipse cx="50" cy="34" rx="6" ry="8" fill="#FFCDD2" stroke="#E57373" strokeWidth="1.5" />
    <Ellipse cx="47" cy="32" rx="3" ry="4" fill="#fff" opacity={0.4} />
  </Svg>
);
 
const DrawBougainvillea = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Line x1="50" y1="90" x2="50" y2="60" stroke="#795548" strokeWidth="4" strokeLinecap="round" />
    <Line x1="50" y1="68" x2="32" y2="52" stroke="#795548" strokeWidth="3" strokeLinecap="round" />
    <Line x1="50" y1="62" x2="68" y2="46" stroke="#795548" strokeWidth="3" strokeLinecap="round" />
    <Path d="M32 52 Q18 44 16 30 Q28 24 34 44Z" fill="#CE93D8" stroke="#6A1B9A" strokeWidth="2" />
    <Path d="M32 52 Q30 36 38 26 Q46 28 38 46Z" fill="#AB47BC" stroke="#6A1B9A" strokeWidth="2" />
    <Path d="M32 52 Q16 56 12 66 Q20 72 30 60Z" fill="#BA68C8" stroke="#6A1B9A" strokeWidth="2" />
    <Path d="M68 46 Q82 38 84 24 Q72 18 66 38Z" fill="#E040FB" stroke="#6A1B9A" strokeWidth="2" />
    <Path d="M68 46 Q70 30 62 20 Q54 22 62 40Z" fill="#CE93D8" stroke="#6A1B9A" strokeWidth="2" />
    <Path d="M68 46 Q84 50 88 60 Q80 66 70 54Z" fill="#AB47BC" stroke="#6A1B9A" strokeWidth="2" />
    <Circle cx="30" cy="42" r="5" fill="#FFF176" stroke="#F9A825" strokeWidth="1.5" />
    <Circle cx="70" cy="36" r="5" fill="#FFF176" stroke="#F9A825" strokeWidth="1.5" />
    <Path d="M50 72 Q40 68 36 60 Q44 56 50 66Z" fill="#66BB6A" stroke="#388E3C" strokeWidth="1.5" />
  </Svg>
);
 
const DrawParijaat = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Line x1="50" y1="90" x2="50" y2="60" stroke="#FF8F00" strokeWidth="6" strokeLinecap="round" />
    <Line x1="50" y1="72" x2="36" y2="60" stroke="#FFA000" strokeWidth="4" strokeLinecap="round" />
    <Line x1="50" y1="66" x2="64" y2="54" stroke="#FFA000" strokeWidth="4" strokeLinecap="round" />
    <Path d="M36 68 Q24 60 22 48 Q34 44 38 60Z" fill="#C8E6C9" stroke="#388E3C" strokeWidth="2" />
    <Path d="M64 62 Q76 54 78 42 Q66 38 62 54Z" fill="#A5D6A7" stroke="#388E3C" strokeWidth="2" />
    {petalRing(50, 46, 20, 7, 14, '#ffffff', '#FFCCBC', 5)}
    <Circle cx="50" cy="46" r="8" fill="#FF8F00" stroke="#E65100" strokeWidth="2.5" />
    <Circle cx="50" cy="46" r="4" fill="#FF6F00" />
    {petalRing(36, 56, 12, 5, 9, '#ffffff', '#FFCCBC', 5)}
    <Circle cx="36" cy="56" r="5" fill="#FF8F00" stroke="#E65100" strokeWidth="2" />
  </Svg>
);
 
const DrawMogra = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Line x1="50" y1="90" x2="50" y2="62" stroke="#66BB6A" strokeWidth="4" strokeLinecap="round" />
    <Line x1="50" y1="74" x2="32" y2="62" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
    <Line x1="50" y1="68" x2="68" y2="56" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
    <Path d="M50 80 Q36 72 32 60 Q44 56 50 72Z" fill="#A5D6A7" stroke="#388E3C" strokeWidth="2" />
    {petalRing(50, 46, 18, 5, 12, '#FFFFFF', '#E8EAF6', 8)}
    <Circle cx="50" cy="46" r="7" fill="#FFF9C4" stroke="#F9A825" strokeWidth="2" />
    <Circle cx="50" cy="46" r="4" fill="#FFF176" />
    {petalRing(32, 58, 12, 4, 8, '#FFFFFF', '#E8EAF6', 8)}
    <Circle cx="32" cy="58" r="5" fill="#FFF9C4" stroke="#F9A825" strokeWidth="1.5" />
    <Ellipse cx="68" cy="52" rx="5" ry="8" fill="#E8F5E9" stroke="#388E3C" strokeWidth="2" />
    <Ellipse cx="68" cy="50" rx="3" ry="5" fill="#FFFFFF" />
    <Path d="M54 32 Q60 26 56 20" fill="none" stroke="#FFF9C4" strokeWidth="2" strokeLinecap="round" opacity={0.8} />
    <Path d="M46 30 Q40 24 44 18" fill="none" stroke="#FFF9C4" strokeWidth="2" strokeLinecap="round" opacity={0.8} />
  </Svg>
);
 
const DrawPalash = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Line x1="50" y1="90" x2="50" y2="60" stroke="#795548" strokeWidth="5" strokeLinecap="round" />
    <Line x1="50" y1="68" x2="30" y2="50" stroke="#795548" strokeWidth="4" strokeLinecap="round" />
    <Line x1="50" y1="62" x2="70" y2="44" stroke="#795548" strokeWidth="4" strokeLinecap="round" />
    <Path d="M50 72 Q26 60 18 38 Q32 26 44 56Z" fill="#FF5722" stroke="#BF360C" strokeWidth="2.5" />
    <Path d="M50 72 Q74 60 82 38 Q68 26 56 56Z" fill="#FF7043" stroke="#BF360C" strokeWidth="2.5" />
    <Path d="M50 72 Q44 50 50 26 Q56 48 50 72Z" fill="#FF8A65" stroke="#BF360C" strokeWidth="2.5" />
    <Path d="M44 56 Q34 46 26 38" fill="none" stroke="#BF360C" strokeWidth="1.5" opacity={0.6} strokeLinecap="round" />
    <Path d="M56 56 Q66 46 74 38" fill="none" stroke="#BF360C" strokeWidth="1.5" opacity={0.6} strokeLinecap="round" />
    <Circle cx="50" cy="30" r="8" fill="#FDD835" stroke="#F9A825" strokeWidth="2" />
    <Circle cx="50" cy="30" r="5" fill="#FFD600" />
    <Circle cx="46" cy="28" r="2" fill="#FFF9C4" />
    <Ellipse cx="34" cy="52" rx="7" ry="4" fill="#FFAB91" opacity={0.5} transform="rotate(-40,34,52)" />
    <Ellipse cx="66" cy="52" rx="7" ry="4" fill="#FFAB91" opacity={0.5} transform="rotate(40,66,52)" />
  </Svg>
);
 
// ─── Item Registry ───────────────────────────────────────────
 
const HUNT_ITEMS = [
  { id: 'marigold',      name: 'Marigold\n(Genda)',    Drawing: DrawMarigold },
  { id: 'lotus',         name: 'Lotus\n(Kamal)',        Drawing: DrawLotus },
  { id: 'jasmine',       name: 'Jasmine\n(Chameli)',    Drawing: DrawJasmine },
  { id: 'hibiscus',      name: 'Hibiscus\n(Gudhal)',    Drawing: DrawHibiscus },
  { id: 'champa',        name: 'Champa\n(Plumeria)',    Drawing: DrawChampa },
  { id: 'sunflower',     name: 'Sunflower\n(Suraj)',    Drawing: DrawSunflower },
  { id: 'tulsi',         name: 'Tulsi\n(Holy Basil)',   Drawing: DrawTulsi },
  { id: 'rose',          name: 'Rose\n(Gulab)',          Drawing: DrawRose },
  { id: 'bougainvillea', name: 'Bougainvillea',          Drawing: DrawBougainvillea },
  { id: 'parijaat',      name: 'Parijaat',               Drawing: DrawParijaat },
  { id: 'mogra',         name: 'Mogra',                  Drawing: DrawMogra },
  { id: 'palash',        name: 'Palash\n(Flame)',        Drawing: DrawPalash },
];
 
// ─── Checkbox ────────────────────────────────────────────────
 
function SquareCheckbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  const scaleAnim   = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const opacityAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const prevChecked = useRef(checked);
 
  if (prevChecked.current !== checked) {
    prevChecked.current = checked;
    if (checked) {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim,   { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim,   { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }
 
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[styles.checkbox, checked && styles.checkboxChecked]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Path d="M5 12 L10 17 L19 7" fill="none" stroke="#ffffff"
                strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  );
}
 
// ─── Hunt Card ───────────────────────────────────────────────
 
function HuntCard({
  item, isFound, onToggle,
}: {
  item: (typeof HUNT_ITEMS)[number];
  isFound: boolean;
  onToggle: () => void;
}) {
  const { Drawing } = item;
  const bounceAnim  = useRef(new Animated.Value(1)).current;
 
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onToggle();
  };
 
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View style={[
        styles.card,
        isFound && styles.cardFound,
        { transform: [{ scale: bounceAnim }] },
      ]}>
        <View style={styles.illustrationWrap}>
          <Drawing />
        </View>
        <View style={styles.cardDivider} />
        <View style={styles.cardRight}>
          <SquareCheckbox checked={isFound} onToggle={onToggle} />
          <Text style={[styles.cardLabel, isFound && styles.cardLabelFound]}>
            {item.name}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
 
// ─── Screen ──────────────────────────────────────────────────
 
export default function IndianFlowersHunt() {
  const [fontsLoaded] = useFonts({ FredokaOne_400Regular });
  const [found, setFound]     = useState<Record<string, boolean>>({});
  const [showWin, setShowWin] = useState(false);
  const winAnim               = useRef(new Animated.Value(0)).current;
 
  if (!fontsLoaded) return null;
 
  const foundCount = Object.values(found).filter(Boolean).length;
  const totalCount = HUNT_ITEMS.length;
  const pct        = totalCount > 0 ? (foundCount / totalCount) * 100 : 0;
 
  const handleToggle = (id: string) => {
    const next = { ...found, [id]: !found[id] };
    setFound(next);
    if (HUNT_ITEMS.every(it => next[it.id])) {
      setShowWin(true);
      Animated.timing(winAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } else if (showWin) {
      setShowWin(false);
      winAnim.setValue(0);
    }
  };
 
  const handleReset = () => {
    setFound({});
    setShowWin(false);
    winAnim.setValue(0);
  };
 
  return (
    <ImageBackground source={BG_IMAGE} style={styles.bgImage} resizeMode="cover">
      <View style={styles.bgOverlay} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
 
          <Text style={[styles.title, { color: THEME.titleColor }]}>Indian Flowers</Text>
          <Text style={[styles.subtitle, { color: THEME.subtitleColor }]}>Find these flowers near you!</Text>
 
          <Text style={[styles.countText, { color: THEME.countColor }]}>
            {foundCount} / {totalCount} found
          </Text>
          <View style={[styles.track, { backgroundColor: THEME.progressTrack }]}>
            <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: THEME.progressFill }]} />
          </View>
 
          {showWin && (
            <Animated.View style={[styles.winBox, { opacity: winAnim, backgroundColor: THEME.winBg }]}>
              <Text style={[styles.winTitle, { color: THEME.winTitle }]}>Wonderful!</Text>
              <Text style={styles.winSub}>You found all the flowers! 🌸</Text>
              <TouchableOpacity style={[styles.resetBtn, { backgroundColor: THEME.resetBtnBg }]} onPress={handleReset}>
                <Text style={styles.resetTxt}>Play again!</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
 
          <View style={styles.cardList}>
            {HUNT_ITEMS.map(item => (
              <HuntCard
                key={item.id}
                item={item}
                isFound={!!found[item.id]}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </View>
 
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
 
// ─── Styles ──────────────────────────────────────────────────
 
const styles = StyleSheet.create({
  bgImage:   { flex: 1 },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.30)' },
  safe:      { flex: 1 },
  scroll:    { paddingHorizontal: 16, paddingBottom: 48, alignItems: 'center' },
 
  title:     { fontSize: 38, fontFamily: FONT, marginTop: 60, marginBottom: 4, textAlign: 'center', letterSpacing: 0.5 },
  subtitle:  { fontSize: 15, fontFamily: FONT, marginBottom: 10, textAlign: 'center' },
  countText: { fontSize: 17, fontFamily: FONT, marginBottom: 8, textAlign: 'center' },
 
  track: { width: '88%', height: 16, borderRadius: 99, overflow: 'hidden', marginBottom: 20 },
  fill:  { height: '100%', borderRadius: 99 },
 
  winBox:   { width: '94%', borderRadius: 20, padding: 22, alignItems: 'center', marginBottom: 18 },
  winTitle: { fontSize: 24, fontFamily: FONT, marginBottom: 4 },
  winSub:   { fontSize: 14, color: '#555', marginBottom: 12 },
  resetBtn: { paddingHorizontal: 28, paddingVertical: 11, borderRadius: 99 },
  resetTxt: { color: '#fff', fontSize: 17, fontFamily: FONT },
 
  cardList: { width: '100%', gap: 12 },
 
  card: {
    width: '100%',
    backgroundColor: '#ffffffee',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#e65100',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  cardFound: {
    backgroundColor: '#fff8e1cc',
    shadowOpacity: 0.05,
  },
 
  illustrationWrap: {
    width: 130,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
 
  cardDivider: {
    width: 1,
    height: 80,
    backgroundColor: '#ffecb3',
    marginHorizontal: 4,
  },
 
  cardRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
  },
 
  cardLabel: {
    fontSize: 20,
    fontFamily: FONT,
    color: '#bf360c',
    letterSpacing: 0.3,
    lineHeight: 26,
  },
  cardLabelFound: {
    color: '#ffcc02',
    textDecorationLine: 'line-through',
  },
 
  checkbox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#ff8f00',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#ffb300',
    borderColor: '#ffb300',
    shadowColor: '#ffb300',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  },
});
 