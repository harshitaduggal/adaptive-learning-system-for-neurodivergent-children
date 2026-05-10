/**
 * IndoorHunt.tsx
 * ───────────────────────────────────────────────────────────────
 * Scavenger Hunt — Indoor Edition
 * Part of the Adaptive Learning Platform for children.
 *
 * Features:
 *  - 12 household items drawn as vibrant inline SVGs
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
  ImageBackground,
} from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
 
// ─── Constants ───────────────────────────────────────────────
 
const FONT        = 'FredokaOne_400Regular';
const BG_IMAGE    = require('../assets/in_1.jpeg');
const DRAWING_SIZE = 110;
 
// ─── Theme ───────────────────────────────────────────────────
 
const THEME = {
  progressTrack: '#f8bbd0',
  progressFill:  '#f06292',
  titleColor:    '#880e4f',
  subtitleColor: '#ad1457',
  countColor:    '#880e4f',
  winBg:         '#fce4ec',
  winTitle:      '#880e4f',
  resetBtnBg:    '#e91e63',
};
 
// ─── SVG Drawings ────────────────────────────────────────────
 
const DrawBook = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="88" rx="28" ry="5" fill="#E57373" opacity={0.2} />
    <Rect x="18" y="18" width="60" height="68" rx="6" fill="#EF5350" stroke="#C62828" strokeWidth="2.5" />
    <Rect x="18" y="18" width="12" height="68" rx="4" fill="#C62828" />
    <Rect x="30" y="20" width="46" height="64" rx="3" fill="#FFEBEE" stroke="#FFCDD2" strokeWidth="1" />
    <Line x1="36" y1="34" x2="54" y2="34" stroke="#EF9A9A" strokeWidth="2" strokeLinecap="round" />
    <Line x1="36" y1="42" x2="54" y2="42" stroke="#EF9A9A" strokeWidth="2" strokeLinecap="round" />
    <Line x1="36" y1="50" x2="54" y2="50" stroke="#EF9A9A" strokeWidth="2" strokeLinecap="round" />
    <Line x1="36" y1="58" x2="54" y2="58" stroke="#EF9A9A" strokeWidth="2" strokeLinecap="round" />
    <Line x1="36" y1="66" x2="48" y2="66" stroke="#EF9A9A" strokeWidth="2" strokeLinecap="round" />
    <Path d="M65 40 L67 46 L73 46 L68 50 L70 56 L65 52 L60 56 L62 50 L57 46 L63 46 Z"
          fill="#FDD835" stroke="#F9A825" strokeWidth="1" />
    <Path d="M70 18 L70 36 L66 32 L62 36 L62 18 Z" fill="#FF8A80" stroke="#FF5252" strokeWidth="1" />
    <Rect x="30" y="20" width="46" height="10" rx="2" fill="#FFCDD2" />
    <Line x1="36" y1="26" x2="64" y2="26" stroke="#EF9A9A" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
 
const DrawSpoon = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="92" rx="16" ry="4" fill="#9E9E9E" opacity={0.2} />
    <Path d="M42 48 Q44 70 46 86 Q50 90 54 86 Q56 70 58 48 Q52 44 42 48Z"
          fill="#E0E0E0" stroke="#9E9E9E" strokeWidth="2" />
    <Line x1="50" y1="54" x2="50" y2="82" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" />
    <Ellipse cx="50" cy="34" rx="16" ry="18" fill="#F5F5F5" stroke="#BDBDBD" strokeWidth="2.5" />
    <Ellipse cx="44" cy="28" rx="5" ry="7" fill="#FFFFFF" opacity={0.7} />
    <Path d="M42 48 Q44 52 50 52 Q56 52 58 48 Q54 46 46 46Z" fill="#BDBDBD" stroke="#9E9E9E" strokeWidth="1.5" />
    <Ellipse cx="50" cy="20" rx="14" ry="5" fill="none" stroke="#E0E0E0" strokeWidth="2" />
  </Svg>
);
 
const DrawPillow = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="84" rx="36" ry="7" fill="#AB47BC" opacity={0.15} />
    <Rect x="10" y="28" width="80" height="52" rx="20" fill="#CE93D8" stroke="#8E24AA" strokeWidth="2.5" />
    <Ellipse cx="50" cy="54" rx="28" ry="16" fill="#E1BEE7" opacity={0.8} />
    <Ellipse cx="38" cy="44" rx="12" ry="8" fill="#F3E5F5" opacity={0.6} />
    <Circle cx="22" cy="38" r="5" fill="#BA68C8" stroke="#7B1FA2" strokeWidth="1.5" />
    <Circle cx="78" cy="38" r="5" fill="#BA68C8" stroke="#7B1FA2" strokeWidth="1.5" />
    <Circle cx="22" cy="70" r="5" fill="#BA68C8" stroke="#7B1FA2" strokeWidth="1.5" />
    <Circle cx="78" cy="70" r="5" fill="#BA68C8" stroke="#7B1FA2" strokeWidth="1.5" />
    <Path d="M10 48 Q50 36 90 48" fill="none" stroke="#AB47BC" strokeWidth="2" strokeLinecap="round" opacity={0.5} />
  </Svg>
);
 
const DrawCup = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="48" cy="90" rx="22" ry="5" fill="#00838F" opacity={0.15} />
    <Path d="M28 28 L32 82 Q48 88 64 82 L68 28 Z" fill="#80DEEA" stroke="#00838F" strokeWidth="2.5" />
    <Path d="M34 34 L37 78 Q48 82 59 78 L62 34 Z" fill="#B2EBF2" opacity={0.5} />
    <Path d="M68 40 Q84 40 84 54 Q84 68 68 66" fill="none" stroke="#00838F" strokeWidth="4" strokeLinecap="round" />
    <Ellipse cx="48" cy="28" rx="20" ry="7" fill="#B2EBF2" stroke="#00838F" strokeWidth="2" />
    <Path d="M36 18 Q33 10 36 4" fill="none" stroke="#B2EBF2" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M48 16 Q45 8 48 2" fill="none" stroke="#B2EBF2" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M60 18 Q57 10 60 4" fill="none" stroke="#B2EBF2" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M30 52 Q48 48 66 52" fill="none" stroke="#00838F" strokeWidth="3" strokeLinecap="round" opacity={0.4} />
    <Ellipse cx="38" cy="42" rx="5" ry="10" fill="#FFFFFF" opacity={0.3} />
  </Svg>
);
 
const DrawShoe = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="52" cy="84" rx="36" ry="6" fill="#BF360C" opacity={0.15} />
    <Path d="M12 68 Q16 56 28 52 L62 52 Q76 52 84 60 L84 70 Q70 78 50 78 Q28 78 12 68Z"
          fill="#FF8A65" stroke="#BF360C" strokeWidth="2.5" />
    <Path d="M14 70 Q50 80 84 70 L84 74 Q50 84 14 74Z" fill="#E64A19" opacity={0.5} />
    <Path d="M28 52 Q26 38 34 32 Q42 26 50 30 Q56 34 58 44 L62 52"
          fill="#FFAB91" stroke="#BF360C" strokeWidth="2" />
    <Path d="M38 36 Q44 30 52 34 L54 48 Q44 50 38 46 Z" fill="#FF7043" opacity={0.6} />
    <Circle cx="42" cy="38" r="2" fill="#BF360C" />
    <Circle cx="50" cy="36" r="2" fill="#BF360C" />
    <Path d="M42 38 Q46 34 50 36" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <Path d="M40 44 Q46 40 52 42" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <Path d="M18 66 Q50 62 80 66" fill="none" stroke="#BF360C" strokeWidth="2" strokeLinecap="round" opacity={0.4} />
  </Svg>
);
 
const DrawClock = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="90" rx="26" ry="5" fill="#F57F17" opacity={0.15} />
    <Circle cx="50" cy="50" r="36" fill="#F57F17" stroke="#E65100" strokeWidth="2" />
    <Circle cx="50" cy="50" r="30" fill="#FFF9C4" stroke="#F9A825" strokeWidth="2.5" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a    = (i * Math.PI * 2) / 12 - Math.PI / 2;
      const long = i % 3 === 0;
      return (
        <Line key={i}
          x1={(50 + 22 * Math.cos(a)).toFixed(1)} y1={(50 + 22 * Math.sin(a)).toFixed(1)}
          x2={(50 + (long ? 28 : 25) * Math.cos(a)).toFixed(1)} y2={(50 + (long ? 28 : 25) * Math.sin(a)).toFixed(1)}
          stroke="#F57F17" strokeWidth={long ? 3 : 1.5} strokeLinecap="round"
        />
      );
    })}
    <Circle cx="50" cy="50" r="4" fill="#E65100" />
    <Line x1="50" y1="50" x2="50" y2="28" stroke="#E65100" strokeWidth="4" strokeLinecap="round" />
    <Line x1="50" y1="50" x2="66" y2="56" stroke="#BF360C" strokeWidth="3" strokeLinecap="round" />
    <Line x1="50" y1="50" x2="34" y2="34" stroke="#FF1744" strokeWidth="1.5" strokeLinecap="round" />
    <Rect x="45" y="14" width="10" height="6" rx="3" fill="#E65100" />
  </Svg>
);
 
const DrawBall = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="90" rx="30" ry="6" fill="#C62828" opacity={0.2} />
    <Circle cx="50" cy="52" r="34" fill="#EF5350" stroke="#C62828" strokeWidth="2.5" />
    <Path d="M18 38 Q34 28 66 36 Q80 44 78 62" fill="none" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M22 66 Q40 76 66 68" fill="none" stroke="#C62828" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M50 18 Q56 38 50 86" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" />
    <Ellipse cx="36" cy="36" rx="10" ry="7" fill="#FFFFFF" opacity={0.35} transform="rotate(-30,36,36)" />
    <Circle cx="32" cy="32" r="4" fill="#FFFFFF" opacity={0.25} />
  </Svg>
);
 
const DrawKey = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="52" cy="88" rx="30" ry="5" fill="#F9A825" opacity={0.2} />
    <Circle cx="30" cy="36" r="20" fill="none" stroke="#FDD835" strokeWidth="6" />
    <Circle cx="30" cy="36" r="10" fill="#FDD835" stroke="#F9A825" strokeWidth="3" />
    <Circle cx="30" cy="36" r="4" fill="#F9A825" />
    <Path d="M48 40 L82 56 L80 62 L46 46 Z" fill="#FDD835" stroke="#F9A825" strokeWidth="2" />
    <Path d="M72 54 L74 64 L68 62 Z" fill="#F9A825" stroke="#F57F17" strokeWidth="1.5" />
    <Path d="M62 50 L64 60 L58 58 Z" fill="#F9A825" stroke="#F57F17" strokeWidth="1.5" />
    <Path d="M18 28 Q24 18 34 20" fill="none" stroke="#FFF9C4" strokeWidth="3" strokeLinecap="round" opacity={0.7} />
  </Svg>
);
 
const DrawPlant = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Path d="M34 70 L30 90 Q50 96 70 90 L66 70 Z" fill="#A1887F" stroke="#6D4C41" strokeWidth="2.5" />
    <Rect x="28" y="64" width="44" height="10" rx="4" fill="#8D6E63" stroke="#6D4C41" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="20" ry="5" fill="#5D4037" />
    <Path d="M50 64 Q48 52 50 36" stroke="#388E3C" strokeWidth="5" fill="none" strokeLinecap="round" />
    <Path d="M50 54 Q30 46 22 32 Q36 28 50 44Z" fill="#66BB6A" stroke="#388E3C" strokeWidth="2" />
    <Path d="M50 44 Q70 36 78 22 Q64 18 50 36Z" fill="#81C784" stroke="#388E3C" strokeWidth="2" />
    <Path d="M50 36 Q44 24 50 16 Q56 24 50 36Z" fill="#A5D6A7" stroke="#388E3C" strokeWidth="1.5" />
    <Circle cx="50" cy="14" r="8" fill="#FDD835" stroke="#F9A825" strokeWidth="2" />
    {Array.from({ length: 6 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 6;
      return <Circle key={i}
        cx={(50 + 12 * Math.cos(a)).toFixed(1)}
        cy={(14 + 12 * Math.sin(a)).toFixed(1)}
        r="5" fill="#FF8A80" stroke="#FF5252" strokeWidth="1" />;
    })}
    <Circle cx="50" cy="14" r="5" fill="#FDD835" />
    <Path d="M36 40 Q40 46 50 48" fill="none" stroke="#388E3C" strokeWidth="1" strokeLinecap="round" opacity={0.5} />
    <Path d="M64 28 Q60 36 50 38" fill="none" stroke="#388E3C" strokeWidth="1" strokeLinecap="round" opacity={0.5} />
  </Svg>
);
 
const DrawPencil = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="92" rx="18" ry="4" fill="#F9A825" opacity={0.2} />
    <Rect x="38" y="16" width="24" height="62" rx="4" fill="#FDD835" stroke="#F9A825" strokeWidth="2.5" />
    <Rect x="38" y="16" width="8" height="62" rx="4" fill="#FFEE58" />
    <Line x1="58" y1="18" x2="58" y2="76" stroke="#F9A825" strokeWidth="1.5" opacity={0.4} />
    <Rect x="38" y="16" width="24" height="12" rx="4" fill="#F48FB1" stroke="#E91E63" strokeWidth="2" />
    <Rect x="38" y="26" width="24" height="5" fill="#BDBDBD" stroke="#9E9E9E" strokeWidth="1" />
    <Path d="M38 78 L62 78 L50 94 Z" fill="#FFCC80" stroke="#E65100" strokeWidth="2" />
    <Path d="M44 88 L50 94 L56 88 Z" fill="#424242" />
    <Line x1="50" y1="30" x2="50" y2="76" stroke="#F9A825" strokeWidth="1" strokeLinecap="round" opacity={0.3} />
  </Svg>
);
 
const DrawMirror = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="92" rx="14" ry="4" fill="#0277BD" opacity={0.15} />
    <Rect x="42" y="76" width="16" height="18" rx="6" fill="#0277BD" stroke="#01579B" strokeWidth="2" />
    <Line x1="50" y1="78" x2="50" y2="90" stroke="#01579B" strokeWidth="2" strokeLinecap="round" opacity={0.4} />
    <Ellipse cx="50" cy="44" rx="30" ry="36" fill="#0277BD" stroke="#01579B" strokeWidth="2.5" />
    <Ellipse cx="50" cy="44" rx="24" ry="30" fill="#B3E5FC" />
    <Ellipse cx="50" cy="42" rx="14" ry="18" fill="#E1F5FE" opacity={0.7} />
    <Circle cx="44" cy="38" r="3" fill="#4FC3F7" opacity={0.6} />
    <Circle cx="56" cy="38" r="3" fill="#4FC3F7" opacity={0.6} />
    <Path d="M44 50 Q50 55 56 50" fill="none" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
    <Ellipse cx="38" cy="30" rx="6" ry="9" fill="#FFFFFF" opacity={0.45} transform="rotate(-15,38,30)" />
    <Circle cx="34" cy="26" r="3" fill="#FFFFFF" opacity={0.35} />
    {([[-26, 0], [26, 0], [0, -32], [0, 32]] as [number, number][]).map(([dx, dy], i) => (
      <Circle key={i} cx={50 + dx} cy={44 + dy} r="4" fill="#80D8FF" stroke="#0288D1" strokeWidth="1" />
    ))}
  </Svg>
);
 
const DrawToyCar = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="86" rx="38" ry="6" fill="#C62828" opacity={0.15} />
    <Rect x="8" y="52" width="84" height="26" rx="8" fill="#EF5350" stroke="#C62828" strokeWidth="2.5" />
    <Path d="M20 52 Q26 30 40 28 L64 28 Q76 30 80 52"
          fill="#EF9A9A" stroke="#C62828" strokeWidth="2.5" />
    <Rect x="28" y="32" width="20" height="16" rx="4" fill="#80DEEA" stroke="#00838F" strokeWidth="1.5" />
    <Rect x="52" y="32" width="20" height="16" rx="4" fill="#80DEEA" stroke="#00838F" strokeWidth="1.5" />
    <Line x1="31" y1="35" x2="31" y2="45" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity={0.5} />
    <Line x1="55" y1="35" x2="55" y2="45" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity={0.5} />
    <Line x1="50" y1="52" x2="50" y2="78" stroke="#C62828" strokeWidth="2" strokeLinecap="round" opacity={0.4} />
    <Rect x="54" y="62" width="8" height="3" rx="1.5" fill="#FFCDD2" />
    <Circle cx="22" cy="78" r="12" fill="#212121" stroke="#424242" strokeWidth="2.5" />
    <Circle cx="22" cy="78" r="7" fill="#616161" />
    <Circle cx="22" cy="78" r="3" fill="#9E9E9E" />
    <Circle cx="78" cy="78" r="12" fill="#212121" stroke="#424242" strokeWidth="2.5" />
    <Circle cx="78" cy="78" r="7" fill="#616161" />
    <Circle cx="78" cy="78" r="3" fill="#9E9E9E" />
    <Ellipse cx="90" cy="60" rx="5" ry="6" fill="#FFF9C4" stroke="#F9A825" strokeWidth="1.5" />
    <Ellipse cx="10" cy="60" rx="4" ry="5" fill="#FF8A80" stroke="#FF5252" strokeWidth="1.5" />
    <Path d="M10 72 Q50 70 90 72" fill="none" stroke="#B71C1C" strokeWidth="2" strokeLinecap="round" opacity={0.4} />
  </Svg>
);
 
// ─── Item Registry ───────────────────────────────────────────
 
const HUNT_ITEMS = [
  { id: 'book',   name: 'Book',    Drawing: DrawBook },
  { id: 'spoon',  name: 'Spoon',   Drawing: DrawSpoon },
  { id: 'pillow', name: 'Pillow',  Drawing: DrawPillow },
  { id: 'cup',    name: 'Cup',     Drawing: DrawCup },
  { id: 'shoe',   name: 'Shoe',    Drawing: DrawShoe },
  { id: 'clock',  name: 'Clock',   Drawing: DrawClock },
  { id: 'ball',   name: 'Ball',    Drawing: DrawBall },
  { id: 'key',    name: 'Key',     Drawing: DrawKey },
  { id: 'plant',  name: 'Plant',   Drawing: DrawPlant },
  { id: 'pencil', name: 'Pencil',  Drawing: DrawPencil },
  { id: 'mirror', name: 'Mirror',  Drawing: DrawMirror },
  { id: 'toycar', name: 'Toy Car', Drawing: DrawToyCar },
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
 
export default function IndoorHunt({ onComplete }: { onComplete?: () => void }) {
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
 
          <Text style={[styles.title, { color: THEME.titleColor }]}>Indoor Hunt</Text>
          <Text style={[styles.subtitle, { color: THEME.subtitleColor }]}>Look inside your home!</Text>
 
          <Text style={[styles.countText, { color: THEME.countColor }]}>
            {foundCount} / {totalCount} found
          </Text>
          <View style={[styles.track, { backgroundColor: THEME.progressTrack }]}>
            <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: THEME.progressFill }]} />
          </View>
 
          {showWin && (
            <Animated.View style={[styles.winBox, { opacity: winAnim, backgroundColor: THEME.winBg }]}>
              <Text style={[styles.winTitle, { color: THEME.winTitle }]}>Super finder!</Text>
              <Text style={styles.winSub}>You spotted everything at home! ⭐</Text>
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
    shadowColor: '#880e4f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  cardFound: {
    backgroundColor: '#fce4eccc',
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
    backgroundColor: '#fce4ec',
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
    color: '#880e4f',
    letterSpacing: 0.3,
  },
  cardLabelFound: {
    color: '#f48fb1',
    textDecorationLine: 'line-through',
  },
 
  checkbox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#c2185b',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#e91e63',
    borderColor: '#e91e63',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  },
});