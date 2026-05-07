import { useState, useMemo, useRef } from 'react';
import { Pressable } from 'react-native';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
 
const ALL_PAIRS = [
  { id: '1',  left: 'Apple',   right: 'सेब'    },
  { id: '2',  left: 'Banana',  right: 'केला'   },
  { id: '3',  left: 'Mango',   right: 'आम'     },
  { id: '4',  left: 'Water',   right: 'पानी'   },
  { id: '5',  left: 'Sun',     right: 'सूरज'   },
  { id: '6',  left: 'Moon',    right: 'चाँद'   },
  { id: '7',  left: 'Dog',     right: 'कुत्ता' },
  { id: '8',  left: 'Cat',     right: 'बिल्ली' },
  { id: '9',  left: 'School',  right: 'विद्यालय'  },
  { id: '10', left: 'Book',    right: 'किताब'  },
];
 
// pairs show per round
const PAIRS_PER_ROUND = 5;
 
const CONFETTI_COLORS = [
  '#A78BFA', '#34D399', '#FB923C',
  '#60A5FA', '#F472B6', '#FBBF24',
];
 
type CardState = 'idle' | 'selected' | 'matched' | 'wrong';
 
function pickRandom(count: number) {
  return [...ALL_PAIRS].sort(() => Math.random() - 0.5).slice(0, count);
}
 
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
 
function createState(pairs: typeof ALL_PAIRS): Record<string, CardState> {
  const obj: Record<string, CardState> = {};
  pairs.forEach((p) => { obj[p.id] = 'idle'; });
  return obj;
}
 
export default function App({ onComplete }: { onComplete?: () => void }) {
  const [currentPairs, setCurrentPairs] = useState(() => pickRandom(PAIRS_PER_ROUND));
  const shuffledRight = useMemo(() => shuffle(currentPairs), [currentPairs]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [leftStates,  setLeftStates]  = useState<Record<string, CardState>>(() => createState(currentPairs));
  const [rightStates, setRightStates] = useState<Record<string, CardState>>(() => createState(currentPairs));
  const [showConfetti, setShowConfetti] = useState(false);

  const score = Object.values(leftStates).filter((s) => s === 'matched').length;

  // ── Win trigger (confetti only)
  function triggerWin() {
    setShowConfetti(true);
  }
 
  // tap left
  function tapLeft(id: string) {
    if (leftStates[id] === 'matched') return;
    if (selectedLeft === id) {
      setSelectedLeft(null);
      setLeftStates((p) => ({ ...p, [id]: 'idle' }));
      return;
    }
    if (selectedLeft) {
      setLeftStates((p) => ({ ...p, [selectedLeft]: 'idle' }));
    }
    setSelectedLeft(id);
    setLeftStates((p) => ({ ...p, [id]: 'selected' }));
  }
 
  // tap right
  function tapRight(id: string) {
    if (rightStates[id] === 'matched') return;
    if (!selectedLeft) return;
 
    if (selectedLeft === id) {
      const newLeft  = { ...leftStates,  [selectedLeft]: 'matched' as CardState };
      const newRight = { ...rightStates, [id]: 'matched' as CardState };
      setLeftStates(newLeft);
      setRightStates(newRight);
      setSelectedLeft(null);
      const newScore = Object.values(newLeft).filter((s) => s === 'matched').length;
      if (newScore === currentPairs.length) triggerWin();
    } else {
      setLeftStates((p)  => ({ ...p, [selectedLeft]: 'wrong' }));
      setRightStates((p) => ({ ...p, [id]: 'wrong' }));
      setTimeout(() => {
        setLeftStates((p)  => ({ ...p, [selectedLeft]: 'idle' }));
        setRightStates((p) => ({ ...p, [id]: 'idle' }));
        setSelectedLeft(null);
      }, 700);
    }
  }
 
// Navigate to next window 
  function goToNextWindow() {
    if (onComplete) {
      onComplete();
    }
  }
 
  // rendering stuff here
  return (
    <ImageBackground
      source={require('./assets/wood_bg7.jpeg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/*  Overlay for darken background */}
      <View style={styles.overlay} />
 
      {/* Confetti */}
      {showConfetti && (
        <ConfettiCannon
          count={180}
          origin={{ x: 200, y: -10 }}
          colors={CONFETTI_COLORS}
          fadeOut={true}
          fallSpeed={3000}
          explosionSpeed={350}
          autoStart={true}
        />
      )}
 
      <SafeAreaView style={styles.safe}>
 
        {/* TITLE */}
        <View style={styles.titleWrapper}>
          {/* ✏️ Change title text here — change BOTH lines */}
          <Text style={styles.titleShadow}>English ↔ हिन्दी</Text>
          <Text style={styles.title}>English ↔ हिन्दी</Text>
        </View>
 
        {/* SCORE BUBBLE */}
        <View style={styles.scoreBubble}>
          <Text style={styles.scoreText}>{score} / {currentPairs.length}</Text>
        </View>
 
        {/* GAME BOARD */}
        <View style={styles.board}>
 
          {/* LEFT column */}
          <View style={styles.column}>
            {/* ✏️ left label text */}
            <View style={styles.labelBubble}>
              <Text style={styles.columnLabel}>English</Text>
            </View>
 
            {currentPairs.map((pair) => {
              const state = leftStates[pair.id];
              return (
                <Pressable
                  key={pair.id}
                  style={({ pressed }) => [
                    styles.card,
                    styles.leftCard,
                    stateStyle(state, 'left'),
                    pressed && state !== 'matched' && styles.cardPressed,
                  ]}
                  onPress={() => tapLeft(pair.id)}
                >
                  <View style={styles.shineDot} />
                  <Text style={[
                    styles.cardText,
                    state === 'matched' && styles.cardTextMatched,
                  ]}>
                    {pair.left}
                  </Text>
                  {state === 'matched' && (
                    <Text style={styles.matchTick}>✓</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
 
          {/* MIDDLE gap */}
          <View style={{ width: 16 }} />
 
          {/* RIGHT column */}
          <View style={styles.column}>
            {/*right label */}
            <View style={[styles.labelBubble, styles.labelBubbleRight]}>
              <Text style={styles.columnLabel}>हिंदी</Text>
            </View>
 
            {shuffledRight.map((pair) => {
              const state = rightStates[pair.id];
              return (
                <Pressable
                  key={pair.id}
                  style={({ pressed }) => [
                    styles.card,
                    styles.rightCard,
                    stateStyle(state, 'right'),
                    pressed && state !== 'matched' && styles.cardPressed,
                  ]}
                  onPress={() => tapRight(pair.id)}
                >
                  <View style={[styles.shineDot, styles.shineDotRight]} />
                  <Text style={[
                    styles.cardText,
                    state === 'matched' && styles.cardTextMatched,
                  ]}>
                    {pair.right}
                  </Text>
                  {state === 'matched' && (
                    <Text style={styles.matchTick}>✓</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
 
        </View>
      </SafeAreaView>
  
     </ImageBackground>
   );
 }
 
// style
function stateStyle(state: CardState, side: 'left' | 'right') {
  switch (state) {
    case 'selected': return side === 'left' ? styles.leftSelected : styles.rightSelected;
    case 'matched':  return styles.stateMatched;
    case 'wrong':    return styles.stateWrong;
    default:         return {};
  }
}
 
const styles = StyleSheet.create({
 
  // Overlay darkness 
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
 
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
 
  // title
  titleWrapper: {
    alignItems: 'center',
    marginTop: 120,     
    marginBottom: 30,
  },
  titleShadow: {
    position: 'absolute',
    fontSize: 34,         
    fontWeight: '900',
    color: '#c58b4d',     
    letterSpacing: 1.5,
    top: 5,
    textAlign: 'center',
  },
  title: {
    fontSize: 34,         
    fontWeight: '900',
    color: '#FFFFFF',     
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
 
  // Score pill 
  scoreBubble: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF', 
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6D63E8',     
  },
 
  // Board 
  board: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 12,              
  },
 
  //Column label pills 
  labelBubble: {
    backgroundColor: '#9bd0ec', 
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 5,
    elevation: 3,
    marginBottom: 2,
  },
  labelBubbleRight: {
    backgroundColor: '#34D399',  
  },
  columnLabel: {
    fontSize: 14,         
    fontWeight: '800',
    color: '#FFFFFF',     
    letterSpacing: 0.5,
  },
 
  // Cards 
  card: {
    width: 140,           
    height: 58,         
    borderRadius: 999,   
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    overflow: 'hidden',
  },
 
  shineDot: {
    position: 'absolute',
    top: 8,
    left: 18,
    width: 14,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.7)',
    transform: [{ rotate: '-30deg' }],
  },
  shineDotRight: {
    left: undefined,
    right: 18,
  },
 
  cardPressed: {
    transform: [{ scale: 0.94 }],
    elevation: 2,
  },
 
  leftCard: {
    borderColor: '#C4B5FD',  
    shadowColor: '#7C3AED',
  },
  rightCard: {
    borderColor: '#6EE7B7',  
    shadowColor: '#059669',
  },
 
  cardText: {
    fontSize: 16,       
    fontWeight: '800',
    color: '#2D2D2D',   
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  cardTextMatched: {
    color: '#059669',     
  },
 
  matchTick: {
    position: 'absolute',
    right: 14,
    fontSize: 14,
    color: '#34D399',    
    fontWeight: '900',
  },
 
  // Card states 
  leftSelected: {
    borderColor: '#7C3AED',     
    backgroundColor: '#EDE9FE',  
    elevation: 12,
  },
  rightSelected: {
    borderColor: '#059669',     
    backgroundColor: '#D1FAE5',  
    elevation: 12,
  },
  stateMatched: {
    borderColor: '#34D399',      
    backgroundColor: '#ECFDF5',  
  },
  stateWrong: {
    borderColor: '#F87171',      
    backgroundColor: '#FEF2F2',  
  },
});