import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

const COLORS = {
  bg: '#F7F4FF',
  purple: '#8B6EF6',
  purpleDark: '#5742C3',
  lavender: '#EEE7FF',
  pink: '#FFD8EC',
  blue: '#DDEBFF',
  yellow: '#FFE7A3',
  mint: '#D8F5E8',
  text: '#352B5E',
  subtext: '#6D6495',
  white: '#FFFFFF',
};

function OwlMascot({ size = 150 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 150 150">
      <Ellipse
        cx="75"
        cy="136"
        rx="34"
        ry="8"
        fill="rgba(0,0,0,0.08)"
      />

      {/* wings */}
      <Ellipse cx="28" cy="86" rx="16" ry="28" fill="#FFC94D" />
      <Ellipse cx="122" cy="86" rx="16" ry="28" fill="#FFC94D" />

      {/* body */}
      <Ellipse cx="75" cy="82" rx="44" ry="44" fill="#FFD76A" />

      {/* belly */}
      <Ellipse cx="75" cy="94" rx="26" ry="28" fill="#FFF8EB" />

      {/* head */}
      <Circle cx="75" cy="48" r="36" fill="#FFD76A" />

      {/* ears */}
      <Path d="M44 22 L56 4 L66 24Z" fill="#FFC94D" />
      <Path d="M84 24 L96 4 L106 22Z" fill="#FFC94D" />

      {/* eyes */}
      <Circle cx="60" cy="48" r="13" fill="white" />
      <Circle cx="90" cy="48" r="13" fill="white" />

      <Circle cx="62" cy="50" r="6" fill="#352B5E" />
      <Circle cx="92" cy="50" r="6" fill="#352B5E" />

      {/* shine */}
      <Circle cx="64" cy="47" r="2" fill="white" />
      <Circle cx="94" cy="47" r="2" fill="white" />

      {/* cheeks */}
      <Circle cx="45" cy="63" r="7" fill="#FFB9B9" opacity="0.7" />
      <Circle cx="105" cy="63" r="7" fill="#FFB9B9" opacity="0.7" />

      {/* beak */}
      <Path d="M69 60 L75 68 L81 60Z" fill="#F59E0B" />

      {/* smile */}
      <Path
        d="M62 72 Q75 84 88 72"
        stroke="#F59E0B"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function EmotionCard({
  emoji,
  title,
  subtitle,
  color,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.emotionCard, { backgroundColor: color }]}
    >
      <View style={styles.emojiBubble}>
        <Text style={styles.emotionEmoji}>{emoji}</Text>
      </View>

      <Text style={styles.emotionTitle}>{title}</Text>

      <Text style={styles.emotionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

export default function EmotionHomePremium() {
  const router = useRouter();

  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={['#F7F4FF', '#F0EAFF']}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {/* floating decorations */}
          <View style={[styles.cloud, { top: 70, left: 24 }]} />
          <View style={[styles.cloudSmall, { top: 120, right: 30 }]} />

          <View style={[styles.sparkle, { top: 180, left: 50 }]}>
            <Text>⭐</Text>
          </View>

          <View style={[styles.sparkle, { top: 240, right: 60 }]}>
            <Text>🌈</Text>
          </View>

          {/* header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerMini}>Today's Calm Activity</Text>
              <Text style={styles.headerTitle}>Emotion World</Text>
            </View>

            <View style={styles.starPill}>
              <Text style={styles.starText}>⭐ 12</Text>
            </View>
          </View>

          {/* mascot section */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#EEE7FF', '#FFFFFF']}
              style={styles.mascotGlow}
            >
              <Animated.View
                style={{
                  transform: [{ translateY: floatAnim }],
                }}
              >
                <OwlMascot />
              </Animated.View>
            </LinearGradient>

            <Text style={styles.heroTitle}>Let's Learn Feelings 🌱</Text>

            <Text style={styles.heroSubtitle}>
              Match emotions, explore expressions, and learn gently.
            </Text>
          </View>

          {/* emotion cards */}
          <View style={styles.cardGrid}>
            <EmotionCard
              emoji="😊"
              title="Happy"
              subtitle="Bright smiles"
              color={COLORS.yellow}
            />

            <EmotionCard
              emoji="😌"
              title="Calm"
              subtitle="Peaceful feelings"
              color={COLORS.mint}
            />

            <EmotionCard
              emoji="😢"
              title="Sad"
              subtitle="Gentle emotions"
              color={COLORS.blue}
            />

            <EmotionCard
              emoji="🤩"
              title="Excited"
              subtitle="Big energy"
              color={COLORS.pink}
            />
          </View>

          {/* game card */}
          <LinearGradient
            colors={['#8B6EF6', '#7358E8']}
            style={styles.gameCard}
          >
            <View style={styles.gameTop}>
              <View style={styles.playCircle}>
                <Ionicons name="play" size={26} color="#8B6EF6" />
              </View>

              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={styles.gameTitle}>Emotion Match Game</Text>

                <Text style={styles.gameSubtitle}>
                  Choose the feeling that matches the picture.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.startButton}
              onPress={() => router.push('/emotiongame')}
            >
              <Text style={styles.startButtonText}>Start Playing</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* practice card */}
          <View style={styles.practiceCard}>
            <View style={styles.practiceIconWrap}>
              <Ionicons name="book-outline" size={28} color="#8B6EF6" />
            </View>

            <Text style={styles.practiceTitle}>Practice Corner</Text>

            <Text style={styles.practiceText}>
              Watch calm videos and explore flashcards before the game.
            </Text>

            <TouchableOpacity style={styles.practiceButton}>
              <Text style={styles.practiceButtonText}>Open Practice</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
  },

  header: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerMini: {
    color: COLORS.subtext,
    fontSize: 15,
    fontWeight: '600',
  },

  headerTitle: {
    marginTop: 4,
    color: COLORS.text,
    fontSize: 36,
    fontWeight: '800',
  },

  starPill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  starText: {
    color: COLORS.purpleDark,
    fontWeight: '800',
    fontSize: 15,
  },

  heroSection: {
    alignItems: 'center',
    marginTop: 30,
  },

  mascotGlow: {
    width: 230,
    height: 230,
    borderRadius: 115,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroTitle: {
    marginTop: 18,
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },

  heroSubtitle: {
    marginTop: 12,
    color: COLORS.subtext,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    paddingHorizontal: 22,
  },

  cardGrid: {
    marginTop: 36,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },

  emotionCard: {
    width: '47%',
    borderRadius: 30,
    paddingVertical: 24,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  emojiBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emotionEmoji: {
    fontSize: 38,
  },

  emotionTitle: {
    marginTop: 14,
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
  },

  emotionSubtitle: {
    marginTop: 6,
    color: COLORS.subtext,
    fontSize: 13,
  },

  gameCard: {
    marginTop: 36,
    borderRadius: 34,
    padding: 24,
  },

  gameTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gameTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
  },

  gameSubtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 22,
    fontSize: 14,
  },

  startButton: {
    marginTop: 24,
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
  },

  startButtonText: {
    color: COLORS.purpleDark,
    fontWeight: '800',
    fontSize: 18,
  },

  practiceCard: {
    marginTop: 22,
    backgroundColor: COLORS.white,
    borderRadius: 32,
    padding: 24,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  practiceIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: COLORS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },

  practiceTitle: {
    marginTop: 18,
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
  },

  practiceText: {
    marginTop: 10,
    color: COLORS.subtext,
    lineHeight: 24,
    fontSize: 15,
  },

  practiceButton: {
    marginTop: 22,
    backgroundColor: COLORS.lavender,
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
  },

  practiceButtonText: {
    color: COLORS.purpleDark,
    fontWeight: '700',
    fontSize: 17,
  },

  cloud: {
    position: 'absolute',
    width: 95,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },

  cloudSmall: {
    position: 'absolute',
    width: 62,
    height: 28,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  sparkle: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
