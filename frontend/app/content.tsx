import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AsyncStorage from '@react-native-async-storage/async-storage';
import content from '../data/content.json';
import { gameRegistry } from "./gameRegistry";
import * as ScreenOrientation from "expo-screen-orientation";

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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View
          style={[
            styles.header,
            Platform.OS === "web"
              ? styles.webHeader
              : { marginTop: insets.top, marginLeft: insets.left + 65 }
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>

          <Text style={styles.moduleTitle}>
            {selected ? selected.id.replaceAll("_", " ") : "No content"}
          </Text>
        </View>

        {!hasContent ? (
          <View style={styles.video}>
            <Text>No content available</Text>
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
            const GameComponent = gameRegistry[currentGameId as keyof typeof gameRegistry];
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

        <View style={styles.bottomControls}>
          {/* Video: Replay button (left) - shown only after video ends, max 2 replays */}
          {videoEnded && replayCount < 2 && hasContent && type === "video" && (
            <TouchableOpacity
              style={[styles.controlButton, styles.leftButton]}
              onPress={handleReplay}
            >
              <Text style={styles.controlText}>Replay</Text>
            </TouchableOpacity>
          )}

          {/* Game: Replay button (left) - shown after game finishes, max 1 replay */}
          {gameFinished && gameReplayCount < 1 && hasContent && type === "game" && (
            <TouchableOpacity
              style={[styles.controlButton, styles.leftButton]}
              onPress={handleReplay}
            >
              <Text style={styles.controlText}>Replay</Text>
            </TouchableOpacity>
          )}

          {/* Right button: Skip/Next based on modality and state */}
          <TouchableOpacity
            style={[styles.controlButton, styles.rightButton]}
            onPress={handleNext}
          >
            <Text style={styles.controlText}>
              {type === "video" ? (!videoEnded ? "Skip" : "Next") :
               type === "flashcard" ? (!flashcardTimerDone ? "Skip" : "Next") :
               type === "game" ? (!gameFinished ? "Skip" : "Next") :
               "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  video: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },

  webHeader: {
    top: 20,
    left: 60,
  },

  backButton: {
    marginRight: 10,
  },

  moduleTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },

  bottomControls: {
    position: "absolute",
    bottom: 60,
    width: "100%",
  },

  controlButton: {
    position: "absolute",
    backgroundColor: "#6C9EA6",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },

  leftButton: {
    left: 30,
  },

  rightButton: {
    right: 30,
  },

  controlText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});