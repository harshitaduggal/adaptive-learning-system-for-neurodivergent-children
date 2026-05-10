/**
 * OutdoorHunt.tsx
 * ───────────────────────────────────────────────────────────────
 * Scavenger Hunt — Outdoor Edition
 * Part of the Adaptive Learning Platform for children.
 *
 * Features:
 *  - 12 outdoor items drawn as vibrant inline SVGs
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
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  SafeAreaView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
 
// ─── Constants ───────────────────────────────────────────────
 
const FONT        = 'FredokaOne_400Regular';
const BG_IMAGE    = require('../assets/o6.jpeg');
const DRAWING_SIZE = 110;
 
// ─── Theme ───────────────────────────────────────────────────
 
const THEME = {
  progressTrack: '#c8e6c9',
  progressFill:  '#4caf50',
  titleColor:    '#1b5e20',
  subtitleColor: '#388e3c',
  countColor:    '#2e7d32',
  winBg:         '#e8f5e9',
  winTitle:      '#1b5e20',
  resetBtnBg:    '#43a047',
};
 
// ─── SVG Drawings ────────────────────────────────────────────
 
const DrawSun = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="22" fill="#FFD600" stroke="#FF8F00" strokeWidth="3" />
    <Circle cx="50" cy="50" r="16" fill="#FFEE58" />
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 10;
      return (
        <Line key={i}
          x1={(50 + 27 * Math.cos(a)).toFixed(1)} y1={(50 + 27 * Math.sin(a)).toFixed(1)}
          x2={(50 + 38 * Math.cos(a)).toFixed(1)} y2={(50 + 38 * Math.sin(a)).toFixed(1)}
          stroke="#FFA000" strokeWidth="4" strokeLinecap="round"
        />
      );
    })}
    <Circle cx="44" cy="47" r="3" fill="#FF8F00" />
    <Circle cx="56" cy="47" r="3" fill="#FF8F00" />
    <Path d="M44 56 Q50 62 56 56" fill="none" stroke="#FF8F00" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);
 
const DrawCloud = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="62" rx="34" ry="20" fill="#B3E5FC" stroke="#81D4FA" strokeWidth="2" />
    <Ellipse cx="38" cy="56" rx="20" ry="16" fill="#E1F5FE" stroke="#B3E5FC" strokeWidth="2" />
    <Ellipse cx="60" cy="54" rx="18" ry="14" fill="#E1F5FE" stroke="#B3E5FC" strokeWidth="2" />
    <Ellipse cx="50" cy="48" rx="16" ry="14" fill="#FFFFFF" stroke="#B3E5FC" strokeWidth="2" />
    <Ellipse cx="43" cy="44" rx="5" ry="3" fill="#FFFFFF" opacity={0.7} />
  </Svg>
);
 
const DrawBird = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="52" cy="58" rx="20" ry="14" fill="#5C6BC0" stroke="#3949AB" strokeWidth="2" />
    <Path d="M35 55 Q20 40 30 30 Q45 42 52 52Z" fill="#7986CB" stroke="#3949AB" strokeWidth="1.5" />
    <Circle cx="70" cy="50" r="13" fill="#5C6BC0" stroke="#3949AB" strokeWidth="2" />
    <Circle cx="74" cy="47" r="4" fill="#fff" />
    <Circle cx="75" cy="47" r="2.2" fill="#1A237E" />
    <Circle cx="76" cy="46" r="0.8" fill="#fff" />
    <Path d="M81 52 L90 54 L81 57 Z" fill="#FFB74D" stroke="#E65100" strokeWidth="1" />
    <Path d="M34 60 Q20 58 18 68 Q28 64 35 66Z" fill="#3949AB" />
    <Line x1="48" y1="72" x2="44" y2="82" stroke="#FF8A65" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="44" y1="82" x2="40" y2="85" stroke="#FF8A65" strokeWidth="2" strokeLinecap="round" />
    <Line x1="44" y1="82" x2="44" y2="86" stroke="#FF8A65" strokeWidth="2" strokeLinecap="round" />
    <Line x1="44" y1="82" x2="48" y2="85" stroke="#FF8A65" strokeWidth="2" strokeLinecap="round" />
    <Line x1="58" y1="72" x2="54" y2="82" stroke="#FF8A65" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="54" y1="82" x2="50" y2="85" stroke="#FF8A65" strokeWidth="2" strokeLinecap="round" />
    <Line x1="54" y1="82" x2="54" y2="86" stroke="#FF8A65" strokeWidth="2" strokeLinecap="round" />
    <Line x1="54" y1="82" x2="58" y2="85" stroke="#FF8A65" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
 
const DrawFlower = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Line x1="50" y1="90" x2="50" y2="58" stroke="#388E3C" strokeWidth="5" strokeLinecap="round" />
    <Path d="M50 75 Q35 65 30 72 Q38 78 50 75Z" fill="#66BB6A" stroke="#388E3C" strokeWidth="1.5" />
    <Path d="M50 68 Q65 58 70 65 Q62 71 50 68Z" fill="#66BB6A" stroke="#388E3C" strokeWidth="1.5" />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 8;
      const cx = (50 + 20 * Math.cos(a)).toFixed(1);
      const cy = (42 + 20 * Math.sin(a)).toFixed(1);
      return <Ellipse key={i} cx={cx} cy={cy} rx="9" ry="13"
        fill={i % 2 === 0 ? '#EF5350' : '#FF8A80'}
        stroke="#C62828" strokeWidth="1"
        transform={`rotate(${(i * 360) / 8}, ${cx}, ${cy})`} />;
    })}
    <Circle cx="50" cy="42" r="13" fill="#FDD835" stroke="#F9A825" strokeWidth="2" />
    <Circle cx="47" cy="39" r="2.5" fill="#FF8F00" />
    <Circle cx="53" cy="39" r="2.5" fill="#FF8F00" />
    <Path d="M46 46 Q50 50 54 46" fill="none" stroke="#FF8F00" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
 
const DrawButterfly = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Path d="M50 50 Q30 22 12 28 Q8 44 22 54 Q36 60 50 52Z" fill="#9C27B0" stroke="#6A1B9A" strokeWidth="2" />
    <Path d="M50 50 Q70 22 88 28 Q92 44 78 54 Q64 60 50 52Z" fill="#E91E63" stroke="#880E4F" strokeWidth="2" />
    <Ellipse cx="30" cy="40" rx="9" ry="6" fill="#CE93D8" opacity={0.7} />
    <Ellipse cx="70" cy="40" rx="9" ry="6" fill="#F48FB1" opacity={0.7} />
    <Circle cx="24" cy="32" r="4" fill="#FFEB3B" opacity={0.8} />
    <Circle cx="76" cy="32" r="4" fill="#FFEB3B" opacity={0.8} />
    <Path d="M50 52 Q32 64 20 58 Q16 72 30 76 Q44 76 50 60Z" fill="#FF9800" stroke="#E65100" strokeWidth="2" />
    <Path d="M50 52 Q68 64 80 58 Q84 72 70 76 Q56 76 50 60Z" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2" />
    <Ellipse cx="50" cy="52" rx="4" ry="14" fill="#4A148C" stroke="#311B92" strokeWidth="1.5" />
    <Path d="M48 38 Q40 22 34 16" fill="none" stroke="#4A148C" strokeWidth="2" strokeLinecap="round" />
    <Path d="M52 38 Q60 22 66 16" fill="none" stroke="#4A148C" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="34" cy="15" r="3.5" fill="#9C27B0" />
    <Circle cx="66" cy="15" r="3.5" fill="#9C27B0" />
  </Svg>
);
 
const DrawTree = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Rect x="40" y="68" width="20" height="24" rx="4" fill="#795548" stroke="#4E342E" strokeWidth="2" />
    <Line x1="48" y1="72" x2="46" y2="88" stroke="#6D4C41" strokeWidth="2" strokeLinecap="round" />
    <Ellipse cx="50" cy="62" rx="36" ry="26" fill="#388E3C" stroke="#2E7D32" strokeWidth="2" />
    <Ellipse cx="50" cy="50" rx="28" ry="22" fill="#43A047" stroke="#2E7D32" strokeWidth="2" />
    <Ellipse cx="50" cy="38" rx="20" ry="18" fill="#66BB6A" stroke="#388E3C" strokeWidth="1.5" />
    <Ellipse cx="42" cy="32" rx="7" ry="5" fill="#A5D6A7" opacity={0.6} />
    <Circle cx="44" cy="50" r="3" fill="#2E7D32" />
    <Circle cx="56" cy="50" r="3" fill="#2E7D32" />
    <Path d="M44 57 Q50 63 56 57" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);
 
const DrawAnt = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="72" rx="14" ry="12" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2" />
    <Ellipse cx="50" cy="54" rx="10" ry="9" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
    <Circle cx="50" cy="38" r="11" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2" />
    <Circle cx="45" cy="35" r="3.5" fill="#fff" />
    <Circle cx="55" cy="35" r="3.5" fill="#fff" />
    <Circle cx="46" cy="35" r="2" fill="#111" />
    <Circle cx="56" cy="35" r="2" fill="#111" />
    <Path d="M46 28 Q38 18 30 14" fill="none" stroke="#B71C1C" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M54 28 Q62 18 70 14" fill="none" stroke="#B71C1C" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="30" cy="13" r="3" fill="#B71C1C" />
    <Circle cx="70" cy="13" r="3" fill="#B71C1C" />
    <Line x1="42" y1="54" x2="22" y2="46" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="42" y1="56" x2="20" y2="57" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="42" y1="58" x2="24" y2="68" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="58" y1="54" x2="78" y2="46" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="58" y1="56" x2="80" y2="57" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="58" y1="58" x2="76" y2="68" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M45 42 Q50 46 55 42" fill="none" stroke="#B71C1C" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
 
const DrawRock = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="70" rx="40" ry="18" fill="#9E9E9E" stroke="#616161" strokeWidth="2" />
    <Path d="M15 68 Q20 38 40 30 Q65 24 80 38 Q90 52 85 68Z" fill="#BDBDBD" stroke="#9E9E9E" strokeWidth="2" />
    <Path d="M20 62 Q28 40 45 34" fill="none" stroke="#E0E0E0" strokeWidth="3" strokeLinecap="round" />
    <Path d="M55 30 Q70 34 78 48" fill="none" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" />
    <Ellipse cx="38" cy="40" rx="10" ry="6" fill="#E0E0E0" opacity={0.6} transform="rotate(-20,38,40)" />
  </Svg>
);
 
const DrawStick = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Path d="M20 85 Q40 62 55 45 Q70 28 80 15"
          fill="none" stroke="#795548" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20 85 Q40 62 55 45 Q70 28 80 15"
          fill="none" stroke="#A1887F" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M35 68 Q42 60 50 55" fill="none" stroke="#6D4C41" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
    <Path d="M50 50 Q57 42 64 36" fill="none" stroke="#6D4C41" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
    <Path d="M72 22 Q82 16 80 15" fill="none" stroke="#8D6E63" strokeWidth="6" strokeLinecap="round" />
  </Svg>
);
 
const DrawPuddle = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="72" rx="40" ry="18" fill="#81D4FA" stroke="#29B6F6" strokeWidth="2" />
    <Ellipse cx="50" cy="72" rx="28" ry="10" fill="#B3E5FC" />
    <Ellipse cx="42" cy="68" rx="10" ry="5" fill="#E1F5FE" opacity={0.7} />
    <Path d="M30 30 Q27 22 30 16 Q33 22 30 30Z" fill="#29B6F6" />
    <Path d="M50 22 Q47 14 50 8 Q53 14 50 22Z" fill="#4FC3F7" />
    <Path d="M70 32 Q67 24 70 18 Q73 24 70 32Z" fill="#29B6F6" />
    <Ellipse cx="50" cy="72" rx="20" ry="7" fill="none" stroke="#0288D1" strokeWidth="1.5" opacity={0.5} />
    <Ellipse cx="50" cy="72" rx="35" ry="15" fill="none" stroke="#0288D1" strokeWidth="1" opacity={0.3} />
  </Svg>
);
 
const DrawSnail = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="62" cy="58" rx="26" ry="22" fill="#BCAAA4" stroke="#795548" strokeWidth="2.5" />
    <Path d="M62 58 Q58 44 66 40 Q76 38 78 48 Q80 58 72 62 Q64 66 60 60 Q56 52 64 50 Q70 50 70 56"
          fill="none" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" />
    <Ellipse cx="56" cy="52" rx="8" ry="6" fill="#D7CCC8" opacity={0.5} />
    <Path d="M38 68 Q24 64 20 72 Q24 78 38 76 Q52 76 62 70"
          fill="#A5D6A7" stroke="#66BB6A" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="30" cy="58" r="12" fill="#81C784" stroke="#66BB6A" strokeWidth="2" />
    <Line x1="27" y1="48" x2="23" y2="36" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="33" y1="47" x2="37" y2="35" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="23" cy="34" r="4.5" fill="#fff" stroke="#388E3C" strokeWidth="1.5" />
    <Circle cx="37" cy="33" r="4.5" fill="#fff" stroke="#388E3C" strokeWidth="1.5" />
    <Circle cx="24" cy="33" r="2.5" fill="#111" />
    <Circle cx="38" cy="32" r="2.5" fill="#111" />
    <Path d="M26 64 Q30 68 34 64" fill="none" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
 
const DrawBee = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="35" cy="36" rx="18" ry="10" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1.5" opacity={0.85} />
    <Ellipse cx="65" cy="36" rx="18" ry="10" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1.5" opacity={0.85} />
    <Ellipse cx="32" cy="46" rx="12" ry="7" fill="#E1F5FE" stroke="#B3E5FC" strokeWidth="1.5" opacity={0.7} />
    <Ellipse cx="68" cy="46" rx="12" ry="7" fill="#E1F5FE" stroke="#B3E5FC" strokeWidth="1.5" opacity={0.7} />
    <Ellipse cx="50" cy="64" rx="18" ry="22" fill="#FDD835" stroke="#F57F17" strokeWidth="2.5" />
    <Path d="M33 58 Q50 55 67 58" fill="none" stroke="#212121" strokeWidth="5" strokeLinecap="round" />
    <Path d="M32 66 Q50 63 68 66" fill="none" stroke="#212121" strokeWidth="5" strokeLinecap="round" />
    <Path d="M34 74 Q50 71 66 74" fill="none" stroke="#212121" strokeWidth="4" strokeLinecap="round" />
    <Circle cx="50" cy="42" r="14" fill="#FDD835" stroke="#F57F17" strokeWidth="2" />
    <Circle cx="44" cy="39" r="4" fill="#fff" />
    <Circle cx="56" cy="39" r="4" fill="#fff" />
    <Circle cx="45" cy="39" r="2.2" fill="#111" />
    <Circle cx="57" cy="39" r="2.2" fill="#111" />
    <Circle cx="45.5" cy="38" r="0.8" fill="#fff" />
    <Circle cx="57.5" cy="38" r="0.8" fill="#fff" />
    <Path d="M44 46 Q50 51 56 46" fill="none" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M45 29 Q38 20 32 16" fill="none" stroke="#F57F17" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M55 29 Q62 20 68 16" fill="none" stroke="#F57F17" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="31" cy="15" r="4" fill="#FDD835" stroke="#F57F17" strokeWidth="1.5" />
    <Circle cx="69" cy="15" r="4" fill="#FDD835" stroke="#F57F17" strokeWidth="1.5" />
    <Path d="M50 86 L50 94" stroke="#F57F17" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);
 
// ─── Item Registry ───────────────────────────────────────────
 
const HUNT_ITEMS = [
  { id: 'sun',       name: 'Sun',       Drawing: DrawSun },
  { id: 'cloud',     name: 'Cloud',     Drawing: DrawCloud },
  { id: 'bird',      name: 'Bird',      Drawing: DrawBird },
  { id: 'flower',    name: 'Flower',    Drawing: DrawFlower },
  { id: 'butterfly', name: 'Butterfly', Drawing: DrawButterfly },
  { id: 'tree',      name: 'Tree',      Drawing: DrawTree },
  { id: 'ant',       name: 'Ant',       Drawing: DrawAnt },
  { id: 'rock',      name: 'Rock',      Drawing: DrawRock },
  { id: 'stick',     name: 'Stick',     Drawing: DrawStick },
  { id: 'puddle',    name: 'Puddle',    Drawing: DrawPuddle },
  { id: 'snail',     name: 'Snail',     Drawing: DrawSnail },
  { id: 'bee',       name: 'Bee',       Drawing: DrawBee },
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
 
export default function OutdoorHunt({ onComplete }: { onComplete?: () => void }) {
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
      setTimeout(() => onComplete?.(), 3000);
    } else if (showWin) {
      setShowWin(false);
      winAnim.setValue(0);
    }
  };
 
  return (
    <ImageBackground source={BG_IMAGE} style={styles.bgImage} resizeMode="cover">
      <View style={styles.bgOverlay} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
 
          <Text style={[styles.title, { color: THEME.titleColor }]}>Outdoor Hunt</Text>
          <Text style={[styles.subtitle, { color: THEME.subtitleColor }]}>Find the items around you!</Text>
 
          <Text style={[styles.countText, { color: THEME.countColor }]}>
            {foundCount} / {totalCount} found
          </Text>
          <View style={[styles.track, { backgroundColor: THEME.progressTrack }]}>
            <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: THEME.progressFill }]} />
          </View>
 
          {showWin && (
            <Animated.View style={[styles.winBox, { opacity: winAnim, backgroundColor: THEME.winBg }]}>
              <Text style={[styles.winTitle, { color: THEME.winTitle }]}>Amazing job!</Text>
              <Text style={styles.winSub}>You found everything outside! ⭐</Text>
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
 
  cardList: { width: '100%', gap: 12 },
 
  card: {
    width: '100%',
    backgroundColor: '#ffffffee',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  cardFound: {
    backgroundColor: '#f1f8e9cc',
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
    backgroundColor: '#e8f5e9',
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
    fontSize: 22,
    fontFamily: FONT,
    color: '#2e7d32',
    letterSpacing: 0.3,
  },
  cardLabelFound: {
    color: '#a5d6a7',
    textDecorationLine: 'line-through',
  },
 
  checkbox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#5a8a3c',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  },
});