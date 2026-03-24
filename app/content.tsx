import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ContentScreen() {

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [videoEnded, setVideoEnded] = useState(false);
  const [replayCount, setReplayCount] = useState(0);

  const player = useVideoPlayer(
    require("../assets/videos/Calm_Classroom_Help_Animation_Request.mp4"),
    (player) => {
      player.loop = false;
      player.play();
    }
  );

  useEffect(() => {
    const sub = player.addListener("playToEnd", () => {
      setVideoEnded(true);
    });

    return () => sub.remove();
  }, [player]);

  const handleReplay = () => {
    if (replayCount >= 3) return;

    setReplayCount(prev => prev + 1);
    setVideoEnded(false);
    player.replay();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>

        {/* Header */}
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
            Module: I Need Help
          </Text>
        </View>

        {/* Video */}
        <VideoView
          style={styles.video}
          player={player}
          contentFit="contain"
          nativeControls={false}
        />

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>

          {/* Replay appears only after video ends */}
          {videoEnded && replayCount < 3 && (
            <TouchableOpacity
              style={[styles.controlButton, styles.leftButton]}
              onPress={handleReplay}
            >
              <Text style={styles.controlText}>Replay</Text>
            </TouchableOpacity>
          )}

          {/* Skip / Next */}
          <TouchableOpacity
            style={[styles.controlButton, styles.rightButton]}
          >
            <Text style={styles.controlText}>
              {videoEnded ? "Next" : "Skip"}
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