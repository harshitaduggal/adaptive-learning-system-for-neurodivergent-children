import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AsyncStorage from '@react-native-async-storage/async-storage';
import content from '../data/content.json';

export default function ContentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const category = "two_word_phrases";
  const [type, setType] = useState("flashcard");
  const STORAGE_KEY = `pointers_${category}`;

  const [pointers, setPointers] = useState({
    video: 0,
    flashcard: 0,
    audio: 0
  });

  const [videoEnded, setVideoEnded] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState("");

  useEffect(() => {
    const loadPointers = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setPointers(JSON.parse(saved));
        }
      } catch (e) {}
      setLoaded(true);
    };

    loadPointers();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const savePointers = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pointers));
      } catch (e) {}
    };

    savePointers();
  }, [pointers, loaded]);

  const items = content["modules"][category][type] || [];
  const hasContent = items.length > 0;

  const index = hasContent ? pointers[type] % items.length : 0;
  const selected = hasContent ? items[index] : null;

  const fetchNextContent = async () => {
    try {
      console.log("Sending POST request...");

      const res = await fetch("http://10.12.31.87:5000/next-content", {
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

      if (nextType === "audio" || nextType === "game") {
        nextType = "flashcard";
      }

      setType(nextType);

    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchNextContent();
  }, []);

  const sendFeedback = async (action) => {
    try {
      await fetch("http://10.12.31.87:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: "user1",
          module: category,
          modality: type,
          action: action
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

  const prefetchNextImages = () => {
    if (!items || items.length === 0) return;

    const nextImages = [];

    for (let i = 1; i <= 10; i++) {
      const nextIndex = (index + i) % items.length;
      nextImages.push(items[nextIndex].url);
    }

    Image.prefetch(nextImages);
  };

  useEffect(() => {
    if (!loaded || type !== "flashcard" || !hasContent) return;
    setCurrentImageUri(selected?.url || "");
    
    const imagesToPreload = [];
    for (let i = 0; i < Math.min(3, items.length); i++) {
      const idx = (pointers[type] + i) % items.length;
      imagesToPreload.push(items[idx].url);
    }
    Image.prefetch(imagesToPreload);
  }, [loaded, index]);

  const handleReplay = async() => {
    await sendFeedback("replay");
    if (replayCount >= 3 || !selected?.url || type !== "video") return;
    setReplayCount(prev => prev + 1);
    setVideoEnded(false);
    player.replay();
  };

  const handleNext = async () => {
    await sendFeedback("skip");
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
    setVideoEnded(false);
    setReplayCount(0);
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
        ) : null}

        <View style={styles.bottomControls}>
          {videoEnded && replayCount < 3 && hasContent && type === "video" && (
            <TouchableOpacity
              style={[styles.controlButton, styles.leftButton]}
              onPress={handleReplay}
            >
              <Text style={styles.controlText}>Replay</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.controlButton, styles.rightButton]}
            onPress={handleNext}
          >
            <Text style={styles.controlText}>
              {videoEnded && type === "video" ? "Next" : "Skip"}
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