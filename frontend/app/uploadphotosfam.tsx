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
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop
} from "react-native-svg";

/* ─── Colors ──────────────────────────────────────────────── */
const TEAL = "#2BB3B1";
const TEAL_LIGHT = "#4ECFCD";
const BG = "#EAF4F4";
const CARD_BG = "#FFFFFF";
const TEXT_DARK = "#0D3D3C";
const TEXT_MID = "#4A8A89";

/* ─── Mascot SVG ─────────────────────────────────────────── */
function StarMascot() {
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      <Defs>
        <LinearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFD166" />
          <Stop offset="1" stopColor="#FFA94D" />
        </LinearGradient>
      </Defs>
      {/* star body */}
      <Path
        d="M36 8 L41 28 L62 28 L46 41 L52 62 L36 50 L20 62 L26 41 L10 28 L31 28 Z"
        fill="url(#starGrad)"
      />
      {/* eyes */}
      <Circle cx={30} cy={33} r={3} fill={TEXT_DARK} />
      <Circle cx={42} cy={33} r={3} fill={TEXT_DARK} />
      <Circle cx={31} cy={32} r={1.2} fill="#FFFFFF" />
      <Circle cx={43} cy={32} r={1.2} fill="#FFFFFF" />
      {/* smile */}
      <Path
        d="M29 40 Q36 46 43 40"
        stroke={TEXT_DARK}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* ─── Hero banner ─────────────────────────────────────────── */
function HeroBanner() {
  return (
    <Svg
      width="100%"
      height={140}
      viewBox="0 0 390 140"
      style={{ position: "absolute", top: 0 }}
    >
      <Defs>
        <LinearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#2BB3B1" />
          <Stop offset="1" stopColor="#4ECFCD" />
        </LinearGradient>
      </Defs>
      <Rect width={390} height={160} fill="url(#heroGrad)" />
      <Path
        d="M0 110 Q100 90 200 115 Q300 140 390 110 L390 160 L0 160 Z"
        fill={BG}
      />
      <Circle cx={340} cy={30} r={18} fill="#FFFFFF" opacity={0.12} />
      <Circle cx={360} cy={65} r={9} fill="#FFFFFF" opacity={0.18} />
      <Circle cx={20} cy={60} r={11} fill="#FFFFFF" opacity={0.12} />
      <Circle cx={50} cy={25} r={6} fill="#FFD166" opacity={0.6} />
      <Rect x={310} y={15} width={10} height={10} rx={2} fill="#FF6B9D" opacity={0.5} />
    </Svg>
  );
}

/* ─── Add Photo icon ──────────────────────────────────────── */
function AddPhotoIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32">
      <Circle
        cx={16} cy={16} r={15}
        fill="#DFF5F5"
        stroke={TEAL}
        strokeWidth={1.5}
        strokeDasharray="4 2"
      />
      <Path d="M16 10 L16 22" stroke={TEAL} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M10 16 L22 16" stroke={TEAL} strokeWidth={2.5} strokeLinecap="round" />
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
      <Circle cx={7} cy={7} r={6.5} fill={TEAL} />
      <Path
        d="M3.5 7 L6 9.5 L10.5 4.5"
        stroke="white"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/* ─── Member card (in saved list) ────────────────────────── */
function MemberCard({ member }: { member: FamilyMember }) {
  return (
    <View style={styles.memberCard}>
      <View style={styles.memberCardLeft}>
        <View style={styles.avatarCluster}>
          {member.photos.map((uri, i) => (
            <Image
              key={i}
              source={{ uri }}
              style={[styles.miniAvatar, { marginLeft: i > 0 ? -12 : 0, zIndex: 2 - i }]}
            />
          ))}
        </View>
        <View>
          <Text style={styles.memberCardName}>{member.title}</Text>
          <Text style={styles.memberCardSub}>{member.photos.length} photo{member.photos.length !== 1 ? "s" : ""} added</Text>
        </View>
      </View>
      <CheckIcon />
    </View>
  );
}

/* ─── Types ───────────────────────────────────────────────── */
interface FamilyMember {
  title: string;      // e.g. "Mom", "Grandpa"
  photos: string[];   // exactly 2 URIs of the same person
}

/* ═══════════════════════════════════════════════════════════ */
export default function UploadPhotosFam() {
  const [title, setTitle] = useState("");
  const [tempPhotos, setTempPhotos] = useState<string[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [step, setStep] = useState<"form" | "success">("form");
  const router = useRouter();

  const canAddPhoto = tempPhotos.length < 2;

  /* ── Pick a photo from library ── */
  const pickPhoto = async () => {
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
      setTempPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  /* ── Remove a staged photo ── */
  const removePhoto = (index: number) => {
    setTempPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  /* ── Add member to local list ── */
  const addMember = () => {
    if (!title.trim()) {
      Alert.alert("Title required", "Enter a name or title for this family member.");
      return;
    }
    if (tempPhotos.length !== 2) {
      Alert.alert("Two photos needed", "Add exactly 2 photos of the same family member.");
      return;
    }
    const duplicate = members.find(
      (m) => m.title.toLowerCase() === title.trim().toLowerCase()
    );
    if (duplicate) {
      Alert.alert("Title taken", "A member with this title already exists.");
      return;
    }

    setMembers((prev) => [...prev, { title: title.trim(), photos: tempPhotos }]);
    setTitle("");
    setTempPhotos([]);
  };

  /* ── Save all to AsyncStorage ── */
  const handleSave = async () => {
    if (members.length < 1) {
      Alert.alert("No members added", "Add at least one family member first.");
      return;
    }
    try {
      await AsyncStorage.setItem("familyMemoryData", JSON.stringify(members));
      setStep("success");
      setTimeout(() => router.replace("/parenthome"), 2000);
    } catch {
      Alert.alert("Save failed", "Could not save data. Please try again.");
    }
  };

  /* ── Success screen ── */
  if (step === "success") {
    return (
      <View style={styles.successContainer}>
        <Svg width={100} height={100} viewBox="0 0 100 100">
          <Circle cx={50} cy={50} r={48} fill="#E0FAFA" stroke={TEAL} strokeWidth={2} />
          <Path
            d="M28 50 L44 66 L72 36"
            stroke={TEAL}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
        <Text style={styles.successTitle}>All set! 🎉</Text>
        <Text style={styles.successSub}>
          {members.length} family member{members.length > 1 ? "s" : ""} saved. Heading back...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Hero banner ── */}
      <View style={styles.hero}>
        <HeroBanner />
        <View style={styles.heroContent}>
          <StarMascot />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.heroTitle}>Memory Game</Text>
            <Text style={styles.heroSub}>Add 2 photos per family member</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Add member card ── */}
        <View style={styles.card}>
          {/* Member title input */}
          <Text style={styles.sectionLabel}>Member title</Text>
          <TextInput
            placeholder="e.g. Mom, Dad, Grandma..."
            placeholderTextColor="#7ABAB9"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          {/* Photo slots */}
          <Text style={styles.sectionLabel}>
            Photos of this person
            <Text style={styles.counterText}>  ({tempPhotos.length}/2 added)</Text>
          </Text>

          <Text style={styles.hintText}>
            Upload 2 different photos of the same person — they will be used as matching pairs in the memory game.
          </Text>

          <View style={styles.imageRow}>
            {tempPhotos.map((uri, i) => (
              <View key={i} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <View style={styles.photoLabel}>
                  <Text style={styles.photoLabelText}>Photo {i + 1}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removePhoto(i)}
                >
                  <TrashIcon />
                </TouchableOpacity>
              </View>
            ))}

            {canAddPhoto && (
              <TouchableOpacity
                style={styles.addSlot}
                onPress={pickPhoto}
                activeOpacity={0.7}
              >
                <AddPhotoIcon />
                <Text style={styles.addSlotText}>
                  {tempPhotos.length === 0 ? "Add photo 1" : "Add photo 2"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.addMemberBtn,
              (!title.trim() || tempPhotos.length !== 2) && styles.btnDisabled,
            ]}
            onPress={addMember}
            activeOpacity={0.8}
          >
            <Text style={styles.addMemberBtnText}>Add to family</Text>
          </TouchableOpacity>
        </View>

        {/* ── Members list ── */}
        {members.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>
              Family members added ({members.length})
            </Text>
            {members.map((m, i) => (
              <MemberCard key={i} member={m} />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Bottom action bar ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveBtn, members.length < 1 && styles.btnDisabled]}
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
    color: "rgba(255,255,255,0.85)",
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
    shadowColor: TEAL,
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
    backgroundColor: "#DFF5F5",
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    color: TEXT_DARK,
    marginBottom: 18,
    fontWeight: "500",
  },

  hintText: {
    fontSize: 12,
    color: TEXT_MID,
    marginBottom: 14,
    lineHeight: 18,
  },

  /* image row */
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
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#C8ECEC",
  },

  photoLabel: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: TEAL,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  photoLabelText: {
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
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#DFF5F5",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: TEAL_LIGHT,
    borderStyle: "dashed",
  },

  addSlotText: {
    fontSize: 11,
    fontWeight: "600",
    color: TEAL,
    textAlign: "center",
    paddingHorizontal: 4,
  },

  addMemberBtn: {
    backgroundColor: TEAL,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  addMemberBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  btnDisabled: {
    opacity: 0.35,
  },

  /* member card (saved list) */
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DFF5F5",
  },

  memberCardLeft: {
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

  memberCardName: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 2,
  },

  memberCardSub: {
    fontSize: 12,
    color: TEXT_MID,
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
    backgroundColor: TEAL,
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
