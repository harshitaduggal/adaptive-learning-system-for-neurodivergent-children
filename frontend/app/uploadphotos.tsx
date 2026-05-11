import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  Stop
} from "react-native-svg";

/* ─── Mascot SVG ─────────────────────────────────────────── */
function BunnyMascot() {
  return (
    <Svg width={72} height={80} viewBox="0 0 72 80">
      <Defs>
        <LinearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E8DEFF" />
        </LinearGradient>
      </Defs>
      {/* ears */}
      <Ellipse cx={22} cy={22} rx={8} ry={18} fill="#F0E8FF" />
      <Ellipse cx={22} cy={22} rx={4} ry={12} fill="#C9B0F7" />
      <Ellipse cx={50} cy={22} rx={8} ry={18} fill="#F0E8FF" />
      <Ellipse cx={50} cy={22} rx={4} ry={12} fill="#C9B0F7" />
      {/* body */}
      <Ellipse cx={36} cy={57} rx={22} ry={20} fill="url(#bodyGrad)" />
      {/* head */}
      <Circle cx={36} cy={40} r={20} fill="#FFFFFF" />
      {/* eyes */}
      <Circle cx={28} cy={38} r={4} fill="#5B3EA0" />
      <Circle cx={44} cy={38} r={4} fill="#5B3EA0" />
      <Circle cx={29} cy={37} r={1.5} fill="#FFFFFF" />
      <Circle cx={45} cy={37} r={1.5} fill="#FFFFFF" />
      {/* nose */}
      <Ellipse cx={36} cy={44} rx={3} ry={2} fill="#FFB3C6" />
      {/* cheeks */}
      <Circle cx={23} cy={44} r={5} fill="#FFD6E0" opacity={0.5} />
      <Circle cx={49} cy={44} r={5} fill="#FFD6E0" opacity={0.5} />
      {/* tummy circle */}
      <Ellipse cx={36} cy={58} rx={12} ry={10} fill="#F0E8FF" />
    </Svg>
  );
}

/* ─── Floating orbs decoration ───────────────────────────── */
function FloatingOrbs() {
  return (
    <Svg
      width="100%"
      height={140}
      viewBox="0 0 390 140"
      style={{ position: "absolute", top: 0 }}
    >
      <Defs>
        <LinearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#7C4DFF" />
          <Stop offset="1" stopColor="#9C6FFF" />
        </LinearGradient>
      </Defs>
      <Rect width={390} height={160} fill="url(#heroGrad)" />
      {/* wave bottom */}
      <Path
        d="M0 110 Q100 90 200 115 Q300 140 390 110 L390 160 L0 160 Z"
        fill="#F3EDFF"
      />
      {/* decorative circles */}
      <Circle cx={340} cy={30} r={18} fill="#FFFFFF" opacity={0.12} />
      <Circle cx={360} cy={65} r={9} fill="#FFFFFF" opacity={0.18} />
      <Circle cx={20} cy={60} r={11} fill="#FFFFFF" opacity={0.12} />
      <Circle cx={50} cy={25} r={6} fill="#FFD166" opacity={0.6} />
      <Rect
        x={310}
        y={15}
        width={10}
        height={10}
        rx={2}
        fill="#FF6B9D"
        opacity={0.5}
      />
    </Svg>
  );
}

/* ─── Emotion icons ───────────────────────────────────────── */
const EMOTION_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Happy: { color: "#FF9F1C", bg: "#FFF3DC", icon: "happy" },
  Sad: { color: "#5B9BF5", bg: "#DCE9FF", icon: "sad" },
  Angry: { color: "#F55B5B", bg: "#FFE0E0", icon: "angry" },
  Surprised: { color: "#9B5BF5", bg: "#EEE0FF", icon: "surprised" },
  Calm: { color: "#2BB3B1", bg: "#DAFAFF", icon: "calm" },
};

function EmotionFaceIcon({ type, size = 28 }: { type: string; size?: number }) {
  const cfg = EMOTION_CONFIG[type] || EMOTION_CONFIG["Happy"];
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28">
      <Circle cx={14} cy={14} r={13} fill={cfg.bg} />
      <Circle cx={14} cy={14} r={13} stroke={cfg.color} strokeWidth={1.5} fill="none" />
      {/* eyes */}
      {type === "Angry" ? (
        <>
          <Path d="M8 10 L12 12" stroke={cfg.color} strokeWidth={2} strokeLinecap="round" />
          <Path d="M20 10 L16 12" stroke={cfg.color} strokeWidth={2} strokeLinecap="round" />
          <Circle cx={10} cy={13} r={1.5} fill={cfg.color} />
          <Circle cx={18} cy={13} r={1.5} fill={cfg.color} />
        </>
      ) : type === "Sad" ? (
        <>
          <Circle cx={10} cy={12} r={1.5} fill={cfg.color} />
          <Circle cx={18} cy={12} r={1.5} fill={cfg.color} />
        </>
      ) : type === "Surprised" ? (
        <>
          <Circle cx={10} cy={12} r={2} fill={cfg.color} />
          <Circle cx={18} cy={12} r={2} fill={cfg.color} />
        </>
      ) : (
        <>
          <Circle cx={10} cy={12} r={1.5} fill={cfg.color} />
          <Circle cx={18} cy={12} r={1.5} fill={cfg.color} />
        </>
      )}
      {/* mouth */}
      {type === "Happy" && (
        <Path d="M9 18 Q14 23 19 18" stroke={cfg.color} strokeWidth={2} fill="none" strokeLinecap="round" />
      )}
      {type === "Sad" && (
        <Path d="M9 21 Q14 17 19 21" stroke={cfg.color} strokeWidth={2} fill="none" strokeLinecap="round" />
      )}
      {type === "Angry" && (
        <Path d="M9 21 Q14 17 19 21" stroke={cfg.color} strokeWidth={2} fill="none" strokeLinecap="round" />
      )}
      {type === "Surprised" && (
        <Ellipse cx={14} cy={20} rx={3} ry={3.5} fill={cfg.color} />
      )}
      {type === "Calm" && (
        <Path d="M10 19 L18 19" stroke={cfg.color} strokeWidth={2} strokeLinecap="round" />
      )}
    </Svg>
  );
}

/* ─── Add Photo placeholder ───────────────────────────────── */
function AddPhotoIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32">
      <Circle cx={16} cy={16} r={15} fill="#EDE8FF" stroke="#7C4DFF" strokeWidth={1.5} strokeDasharray="4 2" />
      <Path d="M16 10 L16 22" stroke="#7C4DFF" strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M10 16 L22 16" stroke="#7C4DFF" strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

/* ─── Trash icon ──────────────────────────────────────────── */
function TrashIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Path d="M3 4 L13 4" stroke="#F55B5B" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M6 4 L6 2 L10 2 L10 4" stroke="#F55B5B" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 4 L4.5 13 L11.5 13 L12 4" stroke="#F55B5B" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 6 L8 11" stroke="#F55B5B" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

/* ─── Check icon ─────────────────────────────────────────── */
function CheckIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14">
      <Circle cx={7} cy={7} r={6.5} fill="#2BB3B1" />
      <Path d="M3.5 7 L6 9.5 L10.5 4.5" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/* ─── Person card ─────────────────────────────────────────── */
function PersonCard({ person, index }: { person: any; index: number }) {
  return (
    <View style={styles.personCard}>
      <View style={styles.personCardLeft}>
        <View style={styles.avatarCluster}>
          {person.images.slice(0, 2).map((img: any, i: number) => (
            <Image
              key={i}
              source={{ uri: img.uri }}
              style={[styles.miniAvatar, { marginLeft: i > 0 ? -12 : 0, zIndex: 2 - i }]}
            />
          ))}
        </View>
        <View>
          <Text style={styles.personCardName}>{person.name}</Text>
          <View style={styles.emotionTags}>
            {person.images.map((img: any, i: number) => {
              const cfg = EMOTION_CONFIG[img.emotion] || EMOTION_CONFIG["Happy"];
              return (
                <View key={i} style={[styles.emotionTag, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.emotionTagText, { color: cfg.color }]}>{img.emotion}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <CheckIcon />
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function UploadPhotos() {
  const [name, setName] = useState("");
  const [tempImages, setTempImages] = useState<{ uri: string; emotion: string }[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [people, setPeople] = useState<any[]>([]);
  const [step, setStep] = useState<"form" | "success">("form");
  const router = useRouter();

  const emotions = Object.keys(EMOTION_CONFIG);
  const canAddImage = selectedEmotion !== "" && tempImages.length < 2;

  const pickImage = async () => {
    if (!selectedEmotion) {
      Alert.alert("Pick an emotion first", "Choose how this person looks in the photo.");
      return;
    }
    if (tempImages.some((img) => img.emotion === selectedEmotion)) {
      Alert.alert("Emotion already used", `You already added a ${selectedEmotion} photo. Pick a different emotion.`);
      return;
    }
    if (tempImages.length >= 2) {
      Alert.alert("Two photos added", "Save this person and start a new one.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo access to continue.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setTempImages((prev) => [
        ...prev,
        { uri: result.assets[0].uri, emotion: selectedEmotion },
      ]);
      setSelectedEmotion("");
    }
  };

  const removeImage = (index: number) => {
    setTempImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addPerson = () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Enter a name for this family member.");
      return;
    }
    if (tempImages.length !== 2) {
      Alert.alert("Two photos needed", "Add exactly 2 photos with different emotions.");
      return;
    }
    const duplicate = people.find(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) {
      Alert.alert("Name taken", "A person with this name already exists.");
      return;
    }

    setPeople((prev) => [...prev, { name: name.trim(), images: tempImages }]);
    setName("");
    setTempImages([]);
    setSelectedEmotion("");
  };

  const handleSave = async () => {
    if (people.length < 1) {
      Alert.alert("No people added", "Add at least one family member first.");
      return;
    }
    try {
      await AsyncStorage.setItem("gameData", JSON.stringify(people));
      setStep("success");
      setTimeout(() => router.replace("/parenthome"), 2000);
    } catch {
      Alert.alert("Save failed", "Could not save data. Please try again.");
    }
  };

  if (step === "success") {
    return (
      <View style={styles.successContainer}>
        <Svg width={100} height={100} viewBox="0 0 100 100">
          <Circle cx={50} cy={50} r={48} fill="#E8FFEE" stroke="#2BB3B1" strokeWidth={2} />
          <Path d="M28 50 L44 66 L72 36" stroke="#2BB3B1" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
        <Text style={styles.successTitle}>All set!</Text>
        <Text style={styles.successSub}>
          {people.length} family member{people.length > 1 ? "s" : ""} saved. Heading back...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Hero banner ── */}
      <View style={styles.hero}>
        <FloatingOrbs />
        <View style={styles.heroContent}>
          <BunnyMascot />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.heroTitle}>Family Setup</Text>
            <Text style={styles.heroSub}>Add photos for the memory game</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Add person card ── */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Family member name</Text>
          <TextInput
            placeholder="e.g. Mom, Dad, Grandma..."
            placeholderTextColor="#B0A8C8"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Text style={styles.sectionLabel}>
            Choose emotion for next photo
            {tempImages.length > 0 && (
              <Text style={styles.counterText}>  ({tempImages.length}/2 photos added)</Text>
            )}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <View style={styles.emotionRow}>
              {emotions.map((emo) => {
                const cfg = EMOTION_CONFIG[emo];
                const used = tempImages.some((img) => img.emotion === emo);
                const active = selectedEmotion === emo;
                return (
                  <TouchableOpacity
                    key={emo}
                    style={[
                      styles.emoButton,
                      active && { backgroundColor: cfg.color, borderColor: cfg.color },
                      used && styles.emoUsed,
                    ]}
                    onPress={() => !used && setSelectedEmotion(emo)}
                    disabled={used}
                    activeOpacity={0.75}
                  >
                    <EmotionFaceIcon type={emo} size={24} />
                    <Text
                      style={[
                        styles.emoLabel,
                        active && { color: "#FFFFFF" },
                        used && { color: "#C8C0DA" },
                      ]}
                    >
                      {emo}
                    </Text>
                    {used && (
                      <View style={styles.usedDot} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Photo previews */}
          <View style={styles.imageRow}>
            {tempImages.map((img, i) => {
              const cfg = EMOTION_CONFIG[img.emotion] || EMOTION_CONFIG["Happy"];
              return (
                <View key={i} style={styles.imageWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.image} />
                  <View style={[styles.emotionBadge, { backgroundColor: cfg.color }]}>
                    <Text style={styles.emotionBadgeText}>{img.emotion}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeImage(i)}
                  >
                    <TrashIcon />
                  </TouchableOpacity>
                </View>
              );
            })}

            {tempImages.length < 2 && (
              <TouchableOpacity
                style={[styles.addSlot, !canAddImage && styles.addSlotDisabled]}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <AddPhotoIcon />
                <Text style={styles.addSlotText}>
                  {selectedEmotion ? `Add ${selectedEmotion}` : "Pick emotion first"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.addPersonBtn,
              (!name || tempImages.length !== 2) && styles.btnDisabled,
            ]}
            onPress={addPerson}
            activeOpacity={0.8}
          >
            <Text style={styles.addPersonBtnText}>Add to family</Text>
          </TouchableOpacity>
        </View>

        {/* ── People list ── */}
        {people.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>
              Family members added ({people.length})
            </Text>
            {people.map((p, i) => (
              <PersonCard key={i} person={p} index={i} />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Bottom action ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveBtn, people.length < 1 && styles.btnDisabled]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Save and continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const PURPLE = "#7C4DFF";
const PURPLE_LIGHT = "#9C6FFF";
const TEAL = "#2BB3B1";
const BG = "#F3EDFF";
const CARD_BG = "#FFFFFF";
const TEXT_DARK = "#2D1A6E";
const TEXT_MID = "#6B5A9E";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  /* hero */
  hero: {
    height: 140,
    overflow: "hidden",
    position: "relative",
  },
  heroContent: {
    position: "absolute",
    bottom: 24,
    left: 24,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingTop: 12,
  },

  /* card */
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT_MID,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },

  counterText: {
    fontWeight: "400",
    textTransform: "none",
    letterSpacing: 0,
  },

  input: {
    backgroundColor: "#F7F4FF",
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    color: TEXT_DARK,
    marginBottom: 18,
    fontWeight: "500",
  },

  /* emotions */
  emotionRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 2,
  },

  emoButton: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#F7F4FF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
    gap: 4,
    minWidth: 72,
  },

  emoUsed: {
    opacity: 0.4,
  },

  emoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: TEXT_MID,
  },

  usedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TEAL,
    position: "absolute",
    top: 6,
    right: 8,
  },

  /* images */
  imageRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    flexWrap: "wrap",
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: "#EEE8FF",
  },

  emotionBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  emotionBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  addSlot: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: "#F0EBFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#C5B4F0",
    borderStyle: "dashed",
  },

  addSlotDisabled: {
    opacity: 0.45,
  },

  addSlotText: {
    fontSize: 10,
    fontWeight: "600",
    color: PURPLE,
    textAlign: "center",
    paddingHorizontal: 4,
  },

  addPersonBtn: {
    backgroundColor: PURPLE,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  addPersonBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  btnDisabled: {
    opacity: 0.35,
  },

  /* person card */
  personCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EBFF",
  },

  personCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatarCluster: {
    flexDirection: "row",
    width: 52,
  },

  miniAvatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  personCardName: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 4,
  },

  emotionTags: {
    flexDirection: "row",
    gap: 4,
  },

  emotionTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  emotionTagText: {
    fontSize: 10,
    fontWeight: "600",
  },

  /* bottom bar */
  bottomBar: {
    backgroundColor: CARD_BG,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },

  saveBtn: {
    backgroundColor: PURPLE,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
  },

  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.2,
  },

  /* success */
  successContainer: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: TEXT_DARK,
  },

  successSub: {
    fontSize: 14,
    color: TEXT_MID,
  },
});
