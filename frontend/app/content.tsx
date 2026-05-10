import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View, BackHandler, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AsyncStorage from '@react-native-async-storage/async-storage';
import content from '../data/content.json';
import { gameRegistry } from "./gameRegistry";
import * as ScreenOrientation from "expo-screen-orientation";

// ─────────────────────────────────────────
//  Decorative background elements
// ─────────────────────────────────────────

/** A 4-point star shape made from two rotated rectangles */
function Star({ size, color, style }: { size: number; color: string; style?: object }) {
  const bar = { position: "absolute" as const, backgroundColor: color, borderRadius: size * 0.15 };
  return (
    <View style={[{ width: size, height: size, alignItems: "center", justifyContent: "center" }, style]}>
      <View style={[bar, { width: size, height: size * 0.28 }]} />
      <View style={[bar, { width: size * 0.28, height: size }]} />
      <View style={[bar, { width: size * 0.7, height: size * 0.18, transform: [{ rotate: "45deg" }] }]} />
      <View style={[bar, { width: size * 0.7, height: size * 0.18, transform: [{ rotate: "-45deg" }] }]} />
    </View>
  );
}

/** Crescent moon built from two overlapping circles */
function Crescent({ size, color, bgColor = "#F5F0FF", style }: { size: number; color: string; bgColor?: string; style?: object }) {
  return (
    <View style={[{ width: size, height: size, overflow: "hidden" }, style]}>
      {/* full disc */}
      <View style={{ position: "absolute", width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
      {/* cutout circle shifted right — creates crescent */}
      <View style={{
        position: "absolute",
        width: size * 0.82,
        height: size * 0.82,
        borderRadius: size * 0.41,
        backgroundColor: bgColor,
        top: -size * 0.06,
        left: size * 0.22,
      }} />
    </View>
  );
}

/** Tiny 3-line sparkle */
function Sparkle({ size, color, style }: { size: number; color: string; style?: object }) {
  const line = { position: "absolute" as const, backgroundColor: color, borderRadius: size };
  return (
    <View style={[{ width: size * 2, height: size * 2, alignItems: "center", justifyContent: "center" }, style]}>
      <View style={[line, { width: size * 1.8, height: size * 0.22 }]} />
      <View style={[line, { width: size * 0.22, height: size * 1.8 }]} />
      <View style={[line, { width: size * 1.3, height: size * 0.18, transform: [{ rotate: "45deg" }] }]} />
      <View style={[line, { width: size * 1.3, height: size * 0.18, transform: [{ rotate: "-45deg" }] }]} />
    </View>
  );
}

function DecorativeLayer() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* ── Top-left cluster ── */}
      <Crescent size={38} color="#C4B5FD" style={{ position: "absolute", top: 52, left: 18, opacity: 0.75 }} />
      <Star size={11} color="#DDD6FE" style={{ position: "absolute", top: 46, left: 62, opacity: 0.9 }} />
      <Star size={7}  color="#A78BFA" style={{ position: "absolute", top: 72, left: 68, opacity: 0.6 }} />

      {/* ── Top-right cluster ── */}
      <Star size={14} color="#C4B5FD" style={{ position: "absolute", top: 38, right: 28, opacity: 0.8 }} />
      <Star size={8}  color="#DDD6FE" style={{ position: "absolute", top: 62, right: 18, opacity: 0.6 }} />
      <Sparkle size={5} color="#E9D5FF" style={{ position: "absolute", top: 58, right: 52, opacity: 0.7 }} />

      {/* ── Mid-left accent ── */}
      <Sparkle size={6} color="#C4B5FD" style={{ position: "absolute", top: "38%", left: 10, opacity: 0.55 }} />
      <Star size={9} color="#DDD6FE"    style={{ position: "absolute", top: "44%", left: 22, opacity: 0.45 }} />

      {/* ── Mid-right accent ── */}
      <Star size={10} color="#E9D5FF"   style={{ position: "absolute", top: "35%", right: 12, opacity: 0.5 }} />

      {/* ── Bottom-right cluster ── */}
      <Star size={13} color="#C4B5FD"   style={{ position: "absolute", bottom: 140, right: 22, opacity: 0.65 }} />
      <Sparkle size={5} color="#A78BFA" style={{ position: "absolute", bottom: 162, right: 48, opacity: 0.55 }} />
      <Star size={7}  color="#DDD6FE"   style={{ position: "absolute", bottom: 120, right: 50, opacity: 0.4 }} />

      {/* ── Bottom-left dot ── */}
      <Sparkle size={6} color="#C4B5FD" style={{ position: "absolute", bottom: 130, left: 20, opacity: 0.5 }} />
    </View>
  );
}

// ─────────────────────────────────────────
//  Time's Up — gorgeous full-screen overlay
// ─────────────────────────────────────────
function TimeUpScreen() {
  const fadeAnim   = useState(new Animated.Value(0))[0];
  const floatAnim  = useState(new Animated.Value(0))[0];
  const scaleCard  = useState(new Animated.Value(0.88))[0];
  const glowAnim   = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleCard, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
    ]).start();

    // Gentle floating loop for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,   duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    // Soft glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleEndSession = () => {
    BackHandler.exitApp();
  };

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View style={[tuStyles.overlay, { opacity: fadeAnim }]}>

      {/* ── Deep purple sky background ── */}
      <View style={tuStyles.sky} />

      {/* ── Large soft orbs for depth ── */}
      <View style={tuStyles.orb1} />
      <View style={tuStyles.orb2} />
      <View style={tuStyles.orb3} />

      {/* ── Scattered stars all over ── */}
      {/* Top zone */}
      <Star size={16} color="#E9D5FF" style={{ position:"absolute", top:"6%",  left:"8%",  opacity:0.9 }} />
      <Star size={9}  color="#C4B5FD" style={{ position:"absolute", top:"4%",  left:"22%", opacity:0.7 }} />
      <Star size={13} color="#DDD6FE" style={{ position:"absolute", top:"8%",  left:"46%", opacity:0.8 }} />
      <Star size={7}  color="#F3E8FF" style={{ position:"absolute", top:"3%",  left:"65%", opacity:0.6 }} />
      <Star size={15} color="#E9D5FF" style={{ position:"absolute", top:"7%",  right:"8%", opacity:0.85 }} />
      <Star size={8}  color="#C4B5FD" style={{ position:"absolute", top:"12%", right:"22%",opacity:0.6 }} />

      {/* Mid zone */}
      <Star size={10} color="#DDD6FE" style={{ position:"absolute", top:"28%", left:"5%",  opacity:0.55 }} />
      <Star size={7}  color="#E9D5FF" style={{ position:"absolute", top:"32%", left:"18%", opacity:0.4 }} />
      <Star size={12} color="#C4B5FD" style={{ position:"absolute", top:"25%", right:"6%", opacity:0.6 }} />
      <Star size={7}  color="#DDD6FE" style={{ position:"absolute", top:"38%", right:"16%",opacity:0.45 }} />

      {/* Bottom zone */}
      <Star size={11} color="#C4B5FD" style={{ position:"absolute", bottom:"18%",left:"7%",  opacity:0.6 }} />
      <Star size={7}  color="#E9D5FF" style={{ position:"absolute", bottom:"14%",left:"24%", opacity:0.45 }} />
      <Star size={9}  color="#DDD6FE" style={{ position:"absolute", bottom:"20%",right:"9%", opacity:0.55 }} />
      <Star size={6}  color="#C4B5FD" style={{ position:"absolute", bottom:"12%",right:"28%",opacity:0.4 }} />

      {/* Sparkles */}
      <Sparkle size={6} color="#E9D5FF" style={{ position:"absolute", top:"15%", left:"38%",  opacity:0.7 }} />
      <Sparkle size={5} color="#DDD6FE" style={{ position:"absolute", top:"20%", left:"60%",  opacity:0.55 }} />
      <Sparkle size={7} color="#C4B5FD" style={{ position:"absolute", bottom:"30%",left:"12%",opacity:0.6 }} />
      <Sparkle size={5} color="#E9D5FF" style={{ position:"absolute", bottom:"25%",right:"14%",opacity:0.5 }} />

      {/* Crescent moons */}
      <Crescent size={44} color="#C4B5FD" bgColor="#1E0A4C" style={{ position:"absolute", top:"5%",  left:"55%", opacity:0.35 }} />
      <Crescent size={26} color="#DDD6FE" bgColor="#1E0A4C" style={{ position:"absolute", bottom:"16%",left:"42%",opacity:0.3 }} />

      {/* ── Floating icon with glow halo ── */}
      <Animated.View style={[tuStyles.iconWrapper, { transform: [{ translateY: floatAnim }] }]}>
        <Animated.View style={[tuStyles.glowRing, { opacity: glowOpacity }]} />
        <View style={tuStyles.iconCircle}>
          <Text style={tuStyles.iconEmoji}>⏳</Text>
        </View>
      </Animated.View>

      {/* ── Card ── */}
      <Animated.View style={[tuStyles.card, { transform: [{ scale: scaleCard }] }]}>

        {/* Soft inner top glow strip */}
        <View style={tuStyles.cardTopGlow} />

        <Text style={tuStyles.title}>Time's up!</Text>

        {/* Star row */}
        <View style={tuStyles.starRow}>
          <Text style={tuStyles.starEmoji}>⭐</Text>
          <Text style={tuStyles.starEmoji}>✨</Text>
          <Text style={tuStyles.starEmoji}>⭐</Text>
        </View>

        <Text style={tuStyles.subtitle}>You did amazing today!</Text>
        <Text style={tuStyles.body}>
          Rest your eyes and come back{"\n"}when you're ready to learn more 💜
        </Text>

        {/* End session button */}
        <TouchableOpacity style={tuStyles.endBtn} onPress={handleEndSession} activeOpacity={0.88}>
          <View style={tuStyles.endBtnInner}>
            <Ionicons name="moon-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={tuStyles.endBtnText}>End Session</Text>
          </View>
        </TouchableOpacity>

        {/* Tiny bottom note */}
        <Text style={tuStyles.note}>See you next time! 🌙</Text>
      </Animated.View>

    </Animated.View>
  );
}

export default function ContentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const category = "two_word_phrases";
  const [type, setType] = useState<"flashcard" | "video" | "game">("flashcard");
  const STORAGE_KEY = `pointers_${category}`;

  const [pointers, setPointers] = useState({
    video: 0,
    flashcard: 0,
    game: 0
  });

const [videoEnded, setVideoEnded] = useState(false);
const [replayCount, setReplayCount] = useState(0);
const [loaded, setLoaded] = useState(false);
const [currentImageUri, setCurrentImageUri] = useState("");
const [flashcardTimerDone, setFlashcardTimerDone] = useState(false);
const [gameFinished, setGameFinished] = useState(false);
const [gameReplayCount, setGameReplayCount] = useState(0);
const [gameKey, setGameKey] = useState(0);

// ── 5-minute session timer ──
const SESSION_SECONDS = 1 * 60;
const [sessionSecondsLeft, setSessionSecondsLeft] = useState(SESSION_SECONDS);
const [sessionExpired, setSessionExpired] = useState(false);

useEffect(() => {
  if (sessionExpired) return;
  const interval = setInterval(() => {
    setSessionSecondsLeft(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        setSessionExpired(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(interval);
}, [sessionExpired]);

const sessionMins = Math.floor(sessionSecondsLeft / 60);
const sessionSecs = sessionSecondsLeft % 60;
const sessionLabel = `${sessionMins}:${String(sessionSecs).padStart(2, "0")}`;

  useEffect(() => {
    const loadPointers = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setPointers(JSON.parse(saved));
        }
      } catch (_e) {}
      setLoaded(true);
    };

    loadPointers();
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (!loaded) return;

    const savePointers = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pointers));
      } catch (_e) {}
    };

    savePointers();
  }, [pointers, loaded, STORAGE_KEY]);

const items =
  type === "game"
    ? content.games || []
    : content["modules"][category][type] || [];  const hasContent = items.length > 0;

  const index = hasContent ? pointers[type] % items.length : 0;
  const selected = hasContent ? items[index] : null;

  const fetchNextContent = async () => {
    try {
      console.log("Sending POST request...");

      // const res = await fetch("http://10.12.31.87:5000/next-content", {
      const res = await fetch("http://172.20.10.5:5000/next-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "user1",
          module: category,
        }),
      });

      console.log("Status:", res.status);

      const data = await res.json();
      console.log("DATA:", data);

      let nextType = data.recommended_content;

      setType(nextType);

    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchNextContent();
  }, []);

  const sendFeedback = async (action: string) => {
    try {
      // Determine action based on modality and state
      let finalAction = action;
      if (type === "flashcard") {
        // Flashcard: skip within 4s, next after 4s
        finalAction = flashcardTimerDone ? "next" : "skip";
      } else if (type === "video") {
        // Video: skip while playing, next after video ends
        finalAction = videoEnded ? "next" : "skip";
      } else if (type === "game") {
        // Game: skip anytime, next after game finishes
        finalAction = gameFinished ? "next" : "skip";
      }
      
      // await fetch("http://10.12.31.87:5000/feedback", {
      await fetch("http://172.20.10.5:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: "user1",
          module: category,
          modality: type,
          action: finalAction
        })
      });
    } catch (err) {
      console.log("Feedback error:", err);
    }
  };

  const player = useVideoPlayer(
    { uri: selected?.url || "" },
    (player) => {
      player.loop = false;
      if (selected?.url && type === "video") {
        player.play();
      }
    }
  );

  useEffect(() => {
    const sub = player.addListener("playToEnd", () => {
      setVideoEnded(true);
    });
    return () => sub.remove();
  }, [player]);

  useEffect(() => {
    const updateOrientation = async () => {
      if (type === "game") {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      } else {
        await ScreenOrientation.unlockAsync();
      }
    };

    updateOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [type]);

  useEffect(() => {
    if (!loaded || type !== "flashcard" || !hasContent) return;
    setCurrentImageUri(selected?.url || "");
    setFlashcardTimerDone(false);
    
    const imagesToPreload = [];
    for (let i = 0; i < Math.min(3, items.length); i++) {
      const idx = (pointers[type] + i) % items.length;
      imagesToPreload.push(items[idx].url);
    }
    Image.prefetch(imagesToPreload);
    
    // 4-second timer
    const timer = setTimeout(() => {
      setFlashcardTimerDone(true);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [loaded, type, hasContent, items, pointers, index]);

  const handleReplay = async() => {
    await sendFeedback("replay");
    
    if (type === "video") {
      // Video: max 3 views = 2 replays allowed
      if (replayCount >= 2 || !selected?.url) return;
      setReplayCount(prev => prev + 1);
      setVideoEnded(false);
      player.replay();
    } else if (type === "game") {
      // Game: max 2 plays = 1 replay allowed
      if (gameReplayCount >= 1) return;
      setGameReplayCount(prev => prev + 1);
      setGameFinished(false);
      setGameKey(prev => prev + 1); // Force re-render of game component
    }
  };

  const handleNext = async () => {
    await sendFeedback("skip");
    
    if (type === "game") {
      setPointers(prev => ({
        ...prev,
        game: prev.game + 1
      }));
      setGameFinished(false);
      setGameReplayCount(0);
    } else {
      const nextIdx = (pointers[type] + 1) % items.length;
      const nextUrl = items[nextIdx]?.url;
      
      if (nextUrl) {
        setCurrentImageUri(nextUrl);
        Image.prefetch(nextUrl);
      }
      
      setPointers(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }));
    }
    
    setVideoEnded(false);
    setReplayCount(0);
    setFlashcardTimerDone(false);
    await fetchNextContent();
  };

  // Map type to a friendly badge label + icon
  const typeBadge = {
    flashcard: { label: "Flashcard", icon: "images-outline" as const },
    video: { label: "Video", icon: "play-circle-outline" as const },
    game: { label: "Game", icon: "game-controller-outline" as const },
  };

  const isNextReady =
    (type === "video" && videoEnded) ||
    (type === "flashcard" && flashcardTimerDone) ||
    (type === "game" && gameFinished);

  const showReplay =
    (type === "video" && videoEnded && replayCount < 2 && hasContent) ||
    (type === "game" && gameFinished && gameReplayCount < 1 && hasContent);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Soft purple gradient background */}
      <View style={styles.background}>
        {/* Decorative blobs */}
        <View style={styles.blobTopRight} />
        <View style={styles.blobBottomLeft} />
      </View>

      <View style={styles.container}>
        {/* ── Header ── */}
        <View
          style={[
            styles.header,
            Platform.OS === "web"
              ? styles.webHeader
              : { marginTop: insets.top + 6, marginLeft: insets.left + 12 }
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <View style={styles.backCircle}>
              <Ionicons name="arrow-back" size={22} color="#7C3AED" />
            </View>
          </TouchableOpacity>

          <View style={styles.titleRow}>
            <Text style={styles.moduleTitle}>
              {selected ? selected.id.replaceAll("_", " ") : "No content"}
            </Text>
            {/* Type badge */}
            <View style={styles.typeBadge}>
              <Ionicons
                name={typeBadge[type].icon}
                size={13}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.typeBadgeText}>{typeBadge[type].label}</Text>
            </View>
            {/* Session timer pill */}
            <View style={[styles.typeBadge, { backgroundColor: "#C4B5FD" }]}>
              <Ionicons name="time-outline" size={12} color="#fff" style={{ marginRight: 3 }} />
              <Text style={styles.typeBadgeText}>{sessionLabel}</Text>
            </View>
          </View>
        </View>

        {/* ── Content area ── */}
        <View style={styles.contentCard}>
          {!hasContent ? (
            <View style={styles.emptyState}>
              <Ionicons name="sad-outline" size={56} color="#C4B5FD" />
              <Text style={styles.emptyText}>No content available</Text>
            </View>
          ) : type === "video" ? (
            <VideoView
              style={styles.video}
              player={player}
              contentFit="contain"
              nativeControls={false}
            />
          ) : type === "flashcard" ? (
            <Image
              source={currentImageUri ? { uri: currentImageUri } : { uri: selected?.url || "" }}
              style={styles.video}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          ) : type === "game" ? (
            (() => {
              const gameIds = Object.keys(gameRegistry);
              const currentGameId = gameIds[pointers.game % gameIds.length];
              const GameComponent = gameRegistry[currentGameId];
              return GameComponent ? (
                <GameComponent
                  key={gameKey}
                  onComplete={() => {
                    setGameFinished(true);
                  }}
                />
              ) : null;
            })()
          ) : null}

          {/* Progress dots */}
          {hasContent && (
            <View style={styles.dotsRow}>
              {items.slice(0, Math.min(items.length, 7)).map((_: unknown, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === index % Math.min(items.length, 7) && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* ── Decorative stars, moon & sparkles ── */}
        <DecorativeLayer />

        {/* ── Bottom controls ── */}
        <View style={styles.bottomControls}>
          {showReplay && (
            <TouchableOpacity
              style={[styles.controlButton, styles.replayButton]}
              onPress={handleReplay}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh" size={18} color="#7C3AED" style={{ marginRight: 6 }} />
              <Text style={styles.replayText}>Replay</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.nextButton,
              isNextReady ? styles.nextButtonReady : styles.nextButtonSkip,
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextText}>
              {type === "video"
                ? !videoEnded ? "Skip ›" : "Next ›"
                : type === "flashcard"
                ? !flashcardTimerDone ? "Skip ›" : "Next ›"
                : type === "game"
                ? !gameFinished ? "Skip ›" : "Next ›"
                : "Next ›"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* ── Time's Up overlay ── */}
        {sessionExpired && (
          <TimeUpScreen />
        )}
      </View>
    </>
  );
}

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";
const PURPLE_MID = "#A78BFA";
const YELLOW = "#FCD34D";
const PINK = "#F9A8D4";
const WHITE = "#FFFFFF";

const styles = StyleSheet.create({
  /* ── Background ── */
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F5F0FF",
  },
  blobTopRight: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#DDD6FE",
    opacity: 0.55,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -80,
    left: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#FDE8FF",
    opacity: 0.6,
  },

  /* ── Root ── */
  container: {
    flex: 1,
  },

  /* ── Header ── */
  header: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    right: 16,
  },
  webHeader: {
    top: 20,
    left: 20,
    right: 20,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  backButton: {
    marginRight: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3B1D7E",
    textTransform: "capitalize",
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PURPLE,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  typeBadgeText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  /* ── Content card ── */
  contentCard: {
    flex: 1,
    marginTop: 90,
    marginBottom: 130,
    marginHorizontal: 16,
    borderRadius: 28,
    backgroundColor: WHITE,
    overflow: "hidden",
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  video: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: PURPLE_MID,
    fontWeight: "600",
  },

  /* ── Progress dots ── */
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PURPLE_LIGHT,
  },
  dotActive: {
    width: 20,
    backgroundColor: PURPLE,
  },

  /* ── Bottom controls ── */
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  replayButton: {
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: PURPLE_MID,
    shadowColor: PURPLE,
  },
  replayText: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: "700",
  },
  nextButton: {
    marginLeft: "auto",
    shadowColor: PURPLE,
  },
  nextButtonSkip: {
    backgroundColor: PINK,
  },
  nextButtonReady: {
    backgroundColor: YELLOW,
  },
  nextText: {
    color: "#3B1D7E",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

// ── Time's Up screen styles ────────────────────────────────────
const tuStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  /* Deep night-sky background */
  sky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1E0A4C",   // very deep indigo-purple
  },

  /* Large soft glowing orbs */
  orb1: {
    position: "absolute",
    top: "-15%",
    left: "-20%",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "#5B21B6",
    opacity: 0.45,
  },
  orb2: {
    position: "absolute",
    bottom: "-18%",
    right: "-15%",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#6D28D9",
    opacity: 0.38,
  },
  orb3: {
    position: "absolute",
    top: "40%",
    left: "25%",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#7C3AED",
    opacity: 0.18,
  },

  /* Floating icon */
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  glowRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#A78BFA",
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(196,181,253,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconEmoji: {
    fontSize: 42,
  },

  /* Card */
  card: {
    width: "84%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 36,
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.3)",
    overflow: "hidden",
  },
  cardTopGlow: {
    position: "absolute",
    top: 0,
    left: "15%",
    width: "70%",
    height: 2,
    borderRadius: 1,
    backgroundColor: "#A78BFA",
    opacity: 0.7,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#F3E8FF",
    letterSpacing: 0.5,
    marginBottom: 12,
    textShadowColor: "rgba(167,139,250,0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  starRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  starEmoji: {
    fontSize: 20,
  },

  subtitle: {
    fontSize: 17,
    color: "#DDD6FE",
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    color: "#C4B5FD",
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 28,
    opacity: 0.9,
  },

  /* End session button */
  endBtn: {
    width: "100%",
    borderRadius: 50,
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 8,
    marginBottom: 20,
  },
  endBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#7C3AED",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.4)",
  },
  endBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  note: {
    fontSize: 13,
    color: "#A78BFA",
    opacity: 0.8,
    fontWeight: "500",
  },
});
