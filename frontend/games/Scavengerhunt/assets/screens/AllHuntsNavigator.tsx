import React, { useRef, useState, useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
 
import OutdoorHunt       from './OutdoorHunt';
import IndoorHunt        from './IndoorHunt';
import IndianFlowersHunt from './IndianFlowersHunt';
import NatureHunt        from './NatureHunt';
 
//  Hunt registry — add or remove hunts here
const HUNTS = [
  { label: 'Outdoor Hunt', emoji: '🌳', color: '#2e7d32', screen: OutdoorHunt },
  { label: 'Indoor Hunt',  emoji: '🏠', color: '#880e4f', screen: IndoorHunt  },
  { label: 'Flowers Hunt', emoji: '🌺', color: '#e65100', screen: IndianFlowersHunt },
  { label: 'Nature Hunt',  emoji: '🌿', color: '#1b5e20', screen: NatureHunt  },
] as const;
 
const DAILY_HUNT = HUNTS[Math.floor(Math.random() * HUNTS.length)];
 
//  Splash — fades out after 1.8 s, reveals the hunt screen
function SplashOverlay({ onDone }: { onDone: () => void }) {
  const opacity   = useRef(new Animated.Value(1)).current;
  const slideUp   = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(0.4)).current;
 
  useEffect(() => {
    // Emoji pop-in
    Animated.spring(emojiScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
 
    // Fade + slide out after delay
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity,  { toValue: 0, duration: 700, useNativeDriver: true }),
        Animated.timing(slideUp,  { toValue: -40, duration: 700, useNativeDriver: true }),
      ]).start(onDone);
    }, 1600);
 
    return () => clearTimeout(timer);
  }, []);
 
  return (
    <Animated.View style={[
      styles.splash,
      { opacity, transform: [{ translateY: slideUp }] },
    ]}>
      <Animated.Text style={[
        styles.splashEmoji,
        { transform: [{ scale: emojiScale }] },
      ]}>
        {DAILY_HUNT.emoji}
      </Animated.Text>
      <Text style={styles.splashEyebrow}>Today's Hunt</Text>
      <Text style={[styles.splashLabel, { color: DAILY_HUNT.color }]}>
        {DAILY_HUNT.label}
      </Text>
      <Text style={styles.splashSub}>Let's go find things! 🔍</Text>
    </Animated.View>
  );
}

//  Root — renders splash then the randomly chosen hunt screen
export default function AllHuntsNavigator() {
  const [splashDone, setSplashDone] = useState(false);
  const HuntScreen = DAILY_HUNT.screen;
 
  return (
    <>
      <HuntScreen />
      {!splashDone && <SplashOverlay onDone={() => setSplashDone(true)} />}
    </>
  );
}

//  Styles
const styles = StyleSheet.create({
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fffde7',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    gap: 8,
  },
  splashEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  splashEyebrow: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  splashLabel: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  splashSub: {
    fontSize: 17,
    color: '#aaa',
    fontWeight: '600',
    marginTop: 4,
  },
});
 