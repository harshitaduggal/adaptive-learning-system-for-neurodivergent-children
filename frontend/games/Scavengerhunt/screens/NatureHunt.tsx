/**
 * NatureHunt.tsx
 * ───────────────────────────────────────────────────────────────
 * Scavenger Hunt — Nature Edition
 * Part of the Adaptive Learning Platform for children.
 *
 * Features:
 *  - 12 nature items drawn as vibrant inline SVGs
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
 
const FONT         = 'FredokaOne_400Regular';
const BG_IMAGE     = require('../assets/nature.jpeg');
const DRAWING_SIZE = 110;
 
// ─── Theme ───────────────────────────────────────────────────
 
const THEME = {
  progressTrack: '#c5e1a5',
  progressFill:  '#558b2f',
  titleColor:    '#1b5e20',
  subtitleColor: '#2e7d32',
  countColor:    '#33691e',
  winBg:         '#dcedc8ee',
  winTitle:      '#1b5e20',
  resetBtnBg:    '#2e7d32',
};
 
// ─── SVG Drawings ────────────────────────────────────────────
 
const DrawPineCone = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="22" rx="7" ry="6" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
    <Ellipse cx="50" cy="58" rx="18" ry="28" fill="#A1887F" stroke="#5D4037" strokeWidth="2.5" />
    <Ellipse cx="44" cy="38" rx="7" ry="5" fill="#D7CCC8" opacity={0.6} />
    <Path d="M34 40 Q40 32 50 38 Q60 32 66 40" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <Path d="M33 52 Q40 44 50 50 Q60 44 67 52" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <Path d="M34 64 Q41 56 50 62 Q59 56 66 64" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <Path d="M36 74 Q42 66 50 72 Q58 66 64 74" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="44" cy="56" r="3.5" fill="#6D4C41" />
    <Circle cx="56" cy="56" r="3.5" fill="#6D4C41" />
    <Path d="M44 64 Q50 70 56 64" fill="none" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);
 
const DrawSpiderWeb = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Line x1="50" y1="12" x2="50" y2="88" stroke="#90A4AE" strokeWidth="1.5" />
    <Line x1="12" y1="50" x2="88" y2="50" stroke="#90A4AE" strokeWidth="1.5" />
    <Line x1="22" y1="22" x2="78" y2="78" stroke="#90A4AE" strokeWidth="1.5" />
    <Line x1="78" y1="22" x2="22" y2="78" stroke="#90A4AE" strokeWidth="1.5" />
    <Ellipse cx="50" cy="50" rx="10" ry="10" fill="none" stroke="#B0BEC5" strokeWidth="1.5" />
    <Ellipse cx="50" cy="50" rx="20" ry="20" fill="none" stroke="#B0BEC5" strokeWidth="1.5" />
    <Ellipse cx="50" cy="50" rx="30" ry="30" fill="none" stroke="#B0BEC5" strokeWidth="1.5" />
    <Ellipse cx="50" cy="50" rx="38" ry="38" fill="none" stroke="#B0BEC5" strokeWidth="1" />
    <Circle cx="50" cy="50" r="5" fill="#5D4037" stroke="#3E2723" strokeWidth="1.5" />
    <Line x1="44" y1="46" x2="36" y2="38" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="56" y1="46" x2="64" y2="38" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="44" y1="54" x2="36" y2="62" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="56" y1="54" x2="64" y2="62" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
    <Circle cx="48" cy="48" r="2" fill="#FF5252" />
    <Circle cx="52" cy="48" r="2" fill="#FF5252" />
  </Svg>
);
 
const DrawMushroom = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Rect x="36" y="58" width="28" height="28" rx="6" fill="#FFFDE7" stroke="#F9A825" strokeWidth="2" />
    <Line x1="48" y1="64" x2="44" y2="82" stroke="#FFF9C4" strokeWidth="2" strokeLinecap="round" />
    <Path d="M18 58 Q18 22 50 18 Q82 22 82 58 Z" fill="#EF5350" stroke="#C62828" strokeWidth="2.5" />
    <Ellipse cx="36" cy="36" rx="10" ry="6" fill="#FFCDD2" opacity={0.6} transform="rotate(-20,36,36)" />
    <Circle cx="32" cy="44" r="7" fill="white" stroke="#C62828" strokeWidth="1.5" />
    <Circle cx="54" cy="34" r="6" fill="white" stroke="#C62828" strokeWidth="1.5" />
    <Circle cx="64" cy="50" r="5" fill="white" stroke="#C62828" strokeWidth="1.5" />
    <Circle cx="44" cy="70" r="2.5" fill="#F9A825" />
    <Circle cx="56" cy="70" r="2.5" fill="#F9A825" />
    <Path d="M44 76 Q50 80 56 76" fill="none" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
 
const DrawFeather = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="52" cy="50" rx="30" ry="36" fill="#E3F2FD" opacity={0.4} />
    <Path d="M28 88 Q50 64 68 22" fill="none" stroke="#546E7A" strokeWidth="3.5" strokeLinecap="round" />
    <Path d="M68 22 Q58 38 50 54" fill="none" stroke="#78909C" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M64 34 Q54 48 46 64" fill="none" stroke="#78909C" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M58 48 Q48 60 40 74" fill="none" stroke="#90A4AE" strokeWidth="2" strokeLinecap="round" />
    <Path d="M68 22 Q78 38 76 54" fill="none" stroke="#78909C" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M64 34 Q74 48 72 64" fill="none" stroke="#78909C" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M58 48 Q66 60 64 74" fill="none" stroke="#90A4AE" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="68" cy="21" r="3" fill="#E1F5FE" />
  </Svg>
);
 
const DrawLeaf = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Path d="M50 88 Q18 70 18 42 Q22 14 50 12 Q78 14 82 42 Q82 70 50 88Z"
          fill="#81C784" stroke="#388E3C" strokeWidth="2.5" />
    <Ellipse cx="38" cy="38" rx="10" ry="7" fill="#A5D6A7" opacity={0.6} transform="rotate(-20,38,38)" />
    <Line x1="50" y1="12" x2="50" y2="88" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M50 28 Q36 32 28 42" fill="none" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M50 46 Q36 50 28 60" fill="none" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M50 62 Q38 66 32 74" fill="none" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M50 28 Q64 32 72 42" fill="none" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M50 46 Q64 50 72 60" fill="none" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M50 62 Q62 66 68 74" fill="none" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" />
    <Circle cx="44" cy="54" r="3" fill="#2E7D32" />
    <Circle cx="56" cy="54" r="3" fill="#2E7D32" />
    <Path d="M44 62 Q50 67 56 62" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
 
const DrawWorm = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Path d="M20 72 Q28 56 38 64 Q48 72 58 58 Q68 44 78 52"
          fill="none" stroke="#EF9A9A" strokeWidth="14" strokeLinecap="round" />
    <Path d="M20 72 Q28 56 38 64 Q48 72 58 58 Q68 44 78 52"
          fill="none" stroke="#E57373" strokeWidth="8" strokeLinecap="round" />
    <Path d="M20 72 Q28 56 38 64 Q48 72 58 58 Q68 44 78 52"
          fill="none" stroke="#EF9A9A" strokeWidth="3" strokeLinecap="round" strokeDasharray="10,8" />
    <Circle cx="20" cy="72" r="10" fill="#E57373" stroke="#C62828" strokeWidth="2.5" />
    <Circle cx="16" cy="68" r="3" fill="#fff" />
    <Circle cx="24" cy="68" r="3" fill="#fff" />
    <Circle cx="16.5" cy="68" r="1.5" fill="#333" />
    <Circle cx="24.5" cy="68" r="1.5" fill="#333" />
    <Path d="M15 74 Q20 78 25 74" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" />
    <Line x1="18" y1="80" x2="14" y2="88" stroke="#E57373" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="22" y1="80" x2="26" y2="88" stroke="#E57373" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);
 
const DrawSpider = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="62" rx="16" ry="14" fill="#5D4037" stroke="#3E2723" strokeWidth="2.5" />
    <Ellipse cx="50" cy="60" rx="8" ry="5" fill="#795548" opacity={0.6} />
    <Circle cx="50" cy="42" r="13" fill="#4E342E" stroke="#3E2723" strokeWidth="2.5" />
    <Circle cx="44" cy="39" r="3" fill="#FF5252" />
    <Circle cx="50" cy="37" r="2.5" fill="#FF5252" />
    <Circle cx="56" cy="39" r="3" fill="#FF5252" />
    <Circle cx="50" cy="42" r="2" fill="#FF8A80" />
    <Line x1="38" y1="38" x2="18" y2="28" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
    <Line x1="36" y1="44" x2="14" y2="40" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
    <Line x1="36" y1="50" x2="14" y2="52" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
    <Line x1="38" y1="56" x2="18" y2="66" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
    <Line x1="62" y1="38" x2="82" y2="28" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
    <Line x1="64" y1="44" x2="86" y2="40" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
    <Line x1="64" y1="50" x2="86" y2="52" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
    <Line x1="62" y1="56" x2="82" y2="66" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
    <Path d="M46 52 L42 58" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M54 52 L58 58" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);
 
const DrawBeetle = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="60" rx="22" ry="20" fill="#F9A825" stroke="#E65100" strokeWidth="2.5" />
    <Ellipse cx="42" cy="50" rx="7" ry="4" fill="#FFF9C4" opacity={0.6} transform="rotate(-20,42,50)" />
    <Line x1="50" y1="40" x2="50" y2="80" stroke="#E65100" strokeWidth="2" />
    <Path d="M28 56 Q38 50 50 54" fill="none" stroke="#E65100" strokeWidth="1.5" />
    <Path d="M28 64 Q38 60 50 62" fill="none" stroke="#E65100" strokeWidth="1.5" />
    <Path d="M72 56 Q62 50 50 54" fill="none" stroke="#E65100" strokeWidth="1.5" />
    <Path d="M72 64 Q62 60 50 62" fill="none" stroke="#E65100" strokeWidth="1.5" />
    <Ellipse cx="50" cy="36" rx="12" ry="10" fill="#F57F17" stroke="#E65100" strokeWidth="2" />
    <Circle cx="46" cy="33" r="2.5" fill="#fff" />
    <Circle cx="54" cy="33" r="2.5" fill="#fff" />
    <Circle cx="46.5" cy="33" r="1.2" fill="#333" />
    <Circle cx="54.5" cy="33" r="1.2" fill="#333" />
    <Path d="M44 26 Q38 18 32 14" fill="none" stroke="#E65100" strokeWidth="2" strokeLinecap="round" />
    <Path d="M56 26 Q62 18 68 14" fill="none" stroke="#E65100" strokeWidth="2" strokeLinecap="round" />
    <Line x1="34" y1="48" x2="16" y2="38" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="32" y1="56" x2="12" y2="52" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="34" y1="66" x2="16" y2="76" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="66" y1="48" x2="84" y2="38" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="68" y1="56" x2="88" y2="52" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="66" y1="66" x2="84" y2="76" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);
 
const DrawCaterpillar = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Circle cx="84" cy="58" r="12" fill="#A5D6A7" stroke="#388E3C" strokeWidth="2" />
    <Circle cx="66" cy="54" r="12" fill="#81C784" stroke="#388E3C" strokeWidth="2" />
    <Circle cx="48" cy="54" r="12" fill="#A5D6A7" stroke="#388E3C" strokeWidth="2" />
    <Circle cx="30" cy="58" r="12" fill="#81C784" stroke="#388E3C" strokeWidth="2" />
    <Circle cx="14" cy="50" r="14" fill="#66BB6A" stroke="#388E3C" strokeWidth="2.5" />
    <Circle cx="10" cy="47" r="4" fill="#fff" />
    <Circle cx="18" cy="47" r="4" fill="#fff" />
    <Circle cx="10.5" cy="47" r="2" fill="#333" />
    <Circle cx="18.5" cy="47" r="2" fill="#333" />
    <Circle cx="11" cy="46" r="0.8" fill="#fff" />
    <Circle cx="19" cy="46" r="0.8" fill="#fff" />
    <Path d="M9 54 Q14 58 19 54" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
    <Line x1="10" y1="37" x2="6"  y2="26" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
    <Line x1="18" y1="37" x2="22" y2="26" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="6" cy="24" r="3.5" fill="#A5D6A7" stroke="#388E3C" strokeWidth="1.5" />
    <Circle cx="22" cy="24" r="3.5" fill="#A5D6A7" stroke="#388E3C" strokeWidth="1.5" />
    <Line x1="78" y1="68" x2="74" y2="78" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
    <Line x1="60" y1="64" x2="56" y2="74" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
    <Line x1="42" y1="64" x2="38" y2="74" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
    <Line x1="26" y1="68" x2="22" y2="78" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
 
const DrawLadybird = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Path d="M24 50 Q24 82 50 82 Q76 82 76 50 Z" fill="#EF5350" stroke="#B71C1C" strokeWidth="2.5" />
    <Path d="M24 50 Q24 18 50 18 Q76 18 76 50" fill="#EF5350" stroke="#B71C1C" strokeWidth="2.5" />
    <Ellipse cx="38" cy="34" rx="10" ry="6" fill="#FFCDD2" opacity={0.6} transform="rotate(-20,38,34)" />
    <Ellipse cx="50" cy="22" rx="14" ry="10" fill="#212121" stroke="#000" strokeWidth="2" />
    <Line x1="50" y1="18" x2="50" y2="82" stroke="#B71C1C" strokeWidth="2" />
    <Circle cx="36" cy="46" r="7" fill="#212121" />
    <Circle cx="64" cy="46" r="7" fill="#212121" />
    <Circle cx="34" cy="64" r="7" fill="#212121" />
    <Circle cx="66" cy="64" r="7" fill="#212121" />
    <Circle cx="44" cy="20" r="3" fill="#fff" />
    <Circle cx="56" cy="20" r="3" fill="#fff" />
    <Circle cx="44.5" cy="20" r="1.5" fill="#333" />
    <Circle cx="56.5" cy="20" r="1.5" fill="#333" />
    <Path d="M44 26 Q50 30 56 26" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);
 
const DrawGrasshopper = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="58" cy="56" rx="24" ry="14" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" />
    <Path d="M46 48 Q60 36 78 44 Q70 54 46 50Z" fill="#A5D6A7" stroke="#388E3C" strokeWidth="1.5" opacity={0.8} />
    <Circle cx="30" cy="50" r="12" fill="#81C784" stroke="#2E7D32" strokeWidth="2.5" />
    <Circle cx="26" cy="47" r="3" fill="#fff" />
    <Circle cx="26.5" cy="47" r="1.5" fill="#333" />
    <Path d="M26 54 Q30 58 34 54" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
    <Path d="M70 44 Q82 32 86 18" fill="none" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M70 48 Q84 40 90 32" fill="none" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M58 68 Q52 82 42 88" fill="none" stroke="#2E7D32" strokeWidth="3.5" strokeLinecap="round" />
    <Path d="M58 68 Q66 80 74 86 L62 86" fill="none" stroke="#2E7D32" strokeWidth="3.5" strokeLinecap="round" />
    <Path d="M36 44 L28 32" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M40 44 L34 30" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);
 
const DrawDragonfly = () => (
  <Svg width={DRAWING_SIZE} height={DRAWING_SIZE} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="56" rx="5" ry="30" fill="#4FC3F7" stroke="#0277BD" strokeWidth="2.5" />
    <Line x1="44" y1="46" x2="56" y2="46" stroke="#0277BD" strokeWidth="1.5" />
    <Line x1="44" y1="54" x2="56" y2="54" stroke="#0277BD" strokeWidth="1.5" />
    <Line x1="44" y1="62" x2="56" y2="62" stroke="#0277BD" strokeWidth="1.5" />
    <Line x1="44" y1="70" x2="56" y2="70" stroke="#0277BD" strokeWidth="1.5" />
    <Path d="M50 38 Q26 20 14 30 Q18 46 50 42Z" fill="#B3E5FC" stroke="#0277BD" strokeWidth="2" opacity={0.9} />
    <Path d="M50 38 Q74 20 86 30 Q82 46 50 42Z" fill="#B3E5FC" stroke="#0277BD" strokeWidth="2" opacity={0.9} />
    <Path d="M50 46 Q26 34 14 44 Q18 60 50 56Z" fill="#E1F5FE" stroke="#0288D1" strokeWidth="2" opacity={0.8} />
    <Path d="M50 46 Q74 34 86 44 Q82 60 50 56Z" fill="#E1F5FE" stroke="#0288D1" strokeWidth="2" opacity={0.8} />
    <Line x1="50" y1="40" x2="22" y2="30" stroke="#81D4FA" strokeWidth="1" opacity={0.7} />
    <Line x1="50" y1="40" x2="78" y2="30" stroke="#81D4FA" strokeWidth="1" opacity={0.7} />
    <Circle cx="50" cy="22" r="8" fill="#4FC3F7" stroke="#0277BD" strokeWidth="2" />
    <Circle cx="44" cy="20" r="4" fill="#0277BD" />
    <Circle cx="56" cy="20" r="4" fill="#0277BD" />
    <Circle cx="43" cy="19" r="1.5" fill="#E3F2FD" />
    <Circle cx="55" cy="19" r="1.5" fill="#E3F2FD" />
  </Svg>
);
 
// ─── Hunt Items ──────────────────────────────────────────────
 
const HUNT_ITEMS = [
  { id: 'pinecone',    name: 'Pine Cone',   Drawing: DrawPineCone },
  { id: 'spiderweb',  name: 'Spider Web',  Drawing: DrawSpiderWeb },
  { id: 'mushroom',   name: 'Mushroom',    Drawing: DrawMushroom },
  { id: 'feather',    name: 'Feather',     Drawing: DrawFeather },
  { id: 'leaf',       name: 'Leaf',        Drawing: DrawLeaf },
  { id: 'worm',       name: 'Worm',        Drawing: DrawWorm },
  { id: 'spider',     name: 'Spider',      Drawing: DrawSpider },
  { id: 'beetle',     name: 'Beetle',      Drawing: DrawBeetle },
  { id: 'caterpillar',name: 'Caterpillar', Drawing: DrawCaterpillar },
  { id: 'ladybird',   name: 'Ladybird',    Drawing: DrawLadybird },
  { id: 'grasshopper',name: 'Grasshopper', Drawing: DrawGrasshopper },
  { id: 'dragonfly',  name: 'Dragonfly',   Drawing: DrawDragonfly },
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
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 120, useNativeDriver: true }),
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
  const bounceAnim = useRef(new Animated.Value(1)).current;
 
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 0.92, duration: 70, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
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
 
export default function NatureHunt({ onComplete }: { onComplete?: () => void }) {
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
      {/* Semi-transparent overlay so text stays readable over the background */}
      <View style={styles.bgOverlay} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
 
          <Text style={[styles.title, { color: THEME.titleColor }]}>🌿 Nature Hunt 🌿</Text>
          <Text style={[styles.subtitle, { color: THEME.subtitleColor }]}>Explore the great outdoors!</Text>
 
          <Text style={[styles.countText, { color: THEME.countColor }]}>
            {foundCount} / {totalCount} found
          </Text>
          <View style={[styles.track, { backgroundColor: THEME.progressTrack }]}>
            <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: THEME.progressFill }]} />
          </View>
 
          {/* Win banner — fades in when all items are found */}
          {showWin && (
            <Animated.View style={[styles.winBox, { opacity: winAnim, backgroundColor: THEME.winBg }]}>
              <Text style={[styles.winTitle, { color: THEME.winTitle }]}>Nature Explorer!</Text>
              <Text style={styles.winSub}>You found ALL the nature things! 🌿</Text>
            </Animated.View>
          )}
 
          {/* Item cards */}
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
 
  title:     { fontSize: 28, fontFamily: FONT, marginTop: 60, marginBottom: 4, textAlign: 'center', letterSpacing: 0.5 },
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
    backgroundColor: '#dcedc8',
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
    color: '#33691e',
    letterSpacing: 0.3,
  },
  cardLabelFound: {
    color: '#aed581',
    textDecorationLine: 'line-through',
  },
 
  checkbox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#558b2f',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#558b2f',
    borderColor: '#558b2f',
    shadowColor: '#558b2f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  },
});