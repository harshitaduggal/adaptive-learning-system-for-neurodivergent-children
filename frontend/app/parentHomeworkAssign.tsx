/**
 * ParentHomeworkAssign — Parent Portal · Assign Custom Task Screen
 * Lets parents add a one-off task on top of the auto-assigned list.
 * Aesthetic: Forest Adventure (refined/adult variant).
 *
 * Route: /parent/homework/assign
 *
 * Dependencies:
 *   npx expo install expo-linear-gradient react-native-safe-area-context
 */

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Design Tokens ─────────────────────────────────────────────────────────────

const T = {
  forest:     "#1A3A2A",
  canopy:     "#2D5A3D",
  leaf:       "#3D7A52",
  sage:       "#6BAE82",
  mist:       "#C8E6D4",
  mistLight:  "#EDFAF2",
  honey:      "#F5A623",
  honeyPale:  "#FFF5DC",
  terra:      "#D4633A",
  terraLight: "#FFF0EB",
  bark:       "#2C1A0E",
  soil:       "#5C3D1E",
  parchment:  "#F5F1EA",
  white:      "#FFFFFF",
  sky:        "#5BA8D4",
  skyPale:    "#EDF5FF",
  berry:      "#C45C8A",
  berryPale:  "#FDEEF5",
  lilac:      "#7F77DD",
  lilacPale:  "#F5F0FF",
  border:     "rgba(26,58,42,0.12)",
  shadow:     "rgba(26,58,42,0.12)",
  muted:      "#8A9E90",
};

// ─── Types ─────────────────────────────────────────────────────────────────────

type Category = "Academic" | "Emotional" | "Words" | "Art" | "Music" | "Games";
type Duration = "5 min" | "10 min" | "15 min" | "20 min" | "30 min";
type Reward   = "1 Star" | "2 Stars" | "Trophy" | "Surprise";

// ─── Data ──────────────────────────────────────────────────────────────────────

const categories: { id: Category; emoji: string; bg: string; accent: string }[] = [
  { id: "Academic",  emoji: "🔢", bg: T.skyPale,    accent: T.sky    },
  { id: "Emotional", emoji: "😊", bg: T.berryPale,  accent: T.berry  },
  { id: "Words",     emoji: "📖", bg: T.honeyPale,  accent: T.honey  },
  { id: "Art",       emoji: "🎨", bg: T.terraLight, accent: T.terra  },
  { id: "Music",     emoji: "🎵", bg: T.lilacPale,  accent: T.lilac  },
  { id: "Games",     emoji: "🎮", bg: T.mistLight,  accent: T.leaf   },
];

const durations: Duration[] = ["5 min", "10 min", "15 min", "20 min", "30 min"];

const rewards: { id: Reward; emoji: string; xp: number }[] = [
  { id: "1 Star",   emoji: "⭐",    xp: 10 },
  { id: "2 Stars",  emoji: "⭐⭐",  xp: 20 },
  { id: "Trophy",   emoji: "🏆",    xp: 30 },
  { id: "Surprise", emoji: "🎁",    xp: 25 },
];

// ─── Selectable Chip ───────────────────────────────────────────────────────────

function SelectChip({
  label,
  selected,
  onPress,
  color,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.selectChip,
        selected && { borderColor: color ?? T.leaf, backgroundColor: (color ?? T.leaf) + "14" },
      ]}
    >
      <Text style={[styles.selectChipText, selected && { color: color ?? T.leaf }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Category Grid ─────────────────────────────────────────────────────────────

function CategoryGrid({
  selected,
  onSelect,
}: {
  selected: Category | null;
  onSelect: (c: Category) => void;
}) {
  return (
    <View style={styles.catGrid}>
      {categories.map(cat => {
        const isSel = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.75}
            style={[
              styles.catOption,
              isSel && { borderColor: cat.accent, backgroundColor: cat.bg },
            ]}
          >
            <View style={[styles.catOptionIcon, { backgroundColor: isSel ? T.white : T.parchment }]}>
              <Text style={styles.catOptionEmoji}>{cat.emoji}</Text>
            </View>
            <Text style={[styles.catOptionLabel, isSel && { color: T.bark }]}>
              {cat.id}
            </Text>
            {isSel && <View style={[styles.catCheckDot, { backgroundColor: cat.accent }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Reward Row ────────────────────────────────────────────────────────────────

function RewardRow({
  selected,
  onSelect,
}: {
  selected: Reward | null;
  onSelect: (r: Reward) => void;
}) {
  return (
    <View style={styles.rewardRow}>
      {rewards.map(r => {
        const isSel = selected === r.id;
        return (
          <TouchableOpacity
            key={r.id}
            onPress={() => onSelect(r.id)}
            activeOpacity={0.75}
            style={[
              styles.rewardOption,
              isSel && { borderColor: T.honey, backgroundColor: T.honeyPale },
            ]}
          >
            <Text style={styles.rewardEmoji}>{r.emoji}</Text>
            <Text style={[styles.rewardLabel, isSel && { color: "#854F0B" }]}>{r.id}</Text>
            <Text style={[styles.rewardXP, isSel && { color: T.honey }]}>+{r.xp} XP</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Section Label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

// ─── Submit Button ─────────────────────────────────────────────────────────────

function SubmitButton({
  onPress,
  loading,
}: {
  onPress: () => void;
  loading: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const tap = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity onPress={tap} activeOpacity={1} style={styles.submitBtn}>
        <LinearGradient
          colors={[T.canopy, T.forest]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.submitGrad}
        >
          <Text style={styles.submitText}>
            {loading ? "Assigning…" : "Assign to Aryan ✓"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function ParentHomeworkAssign() {
  const insets = useSafeAreaInsets();
  const [taskName, setTaskName]   = useState("");
  const [taskNote, setTaskNote]   = useState("");
  const [category, setCategory]   = useState<Category | null>(null);
  const [duration, setDuration]   = useState<Duration | null>("10 min");
  const [reward,   setReward]     = useState<Reward | null>("1 Star");
  const [loading,  setLoading]    = useState(false);
  const [success,  setSuccess]    = useState(false);

  const canSubmit = taskName.trim().length > 0 && category !== null;

  const handleSubmit = () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.back(), 1200);
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <LinearGradient
        colors={[T.forest, T.canopy, "#3D6B50"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 14 }]}
      >
        <View style={[styles.blob, { width: 130, height: 130, top: -45, right: -35, backgroundColor: "rgba(61,122,82,0.35)" }]} />

        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.75}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>✏️ Assign task</Text>
          <View style={{ width: 34 }} />
        </View>
        <Text style={styles.headerSub}>For Aryan · today</Text>

        <View style={styles.waveClip}>
          <View style={styles.waveShape} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Task Name ── */}
        <View style={styles.formCard}>
          <SectionLabel>Task name *</SectionLabel>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Write 5 sentences about summer"
            placeholderTextColor={T.muted}
            value={taskName}
            onChangeText={setTaskName}
            maxLength={80}
          />

          <View style={styles.divider} />

          <SectionLabel>Note for Aryan (optional)</SectionLabel>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Any extra instructions or encouragement…"
            placeholderTextColor={T.muted}
            value={taskNote}
            onChangeText={setTaskNote}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            maxLength={200}
          />
        </View>

        {/* ── Category ── */}
        <View style={styles.formCard}>
          <SectionLabel>Category *</SectionLabel>
          <CategoryGrid selected={category} onSelect={setCategory} />
        </View>

        {/* ── Duration ── */}
        <View style={styles.formCard}>
          <SectionLabel>Estimated time</SectionLabel>
          <View style={styles.chipRow}>
            {durations.map(d => (
              <SelectChip
                key={d}
                label={d}
                selected={duration === d}
                onPress={() => setDuration(d)}
                color={T.leaf}
              />
            ))}
          </View>
        </View>

        {/* ── Reward ── */}
        <View style={styles.formCard}>
          <SectionLabel>Reward on completion</SectionLabel>
          <RewardRow selected={reward} onSelect={setReward} />
        </View>

        {/* ── Submit ── */}
        <View style={styles.submitWrap}>
          {success ? (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>🌿 Task assigned! Redirecting…</Text>
            </View>
          ) : (
            <SubmitButton onPress={handleSubmit} loading={loading} />
          )}
          {!canSubmit && !success && (
            <Text style={styles.validationHint}>
              * Add a task name and pick a category to continue
            </Text>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const CARD_RADIUS = 20;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.parchment },

  // Header
  header:      { paddingHorizontal: 20, paddingBottom: 0, overflow: "hidden" },
  blob:        { position: "absolute", borderRadius: 999 },
  navRow:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6, position: "relative", zIndex: 1 },
  backBtn:     { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },
  backBtnText: { fontSize: 22, color: T.white, lineHeight: 28, marginTop: -2 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: T.white, letterSpacing: -0.3, position: "relative", zIndex: 1 },
  headerSub:   { fontSize: 12, color: "rgba(200,230,212,0.65)", marginBottom: 18, position: "relative", zIndex: 1 },

  waveClip:  { height: 30, overflow: "hidden", marginHorizontal: -20 },
  waveShape: { position: "absolute", bottom: 0, left: 0, right: 0, height: 46, backgroundColor: T.parchment, borderTopLeftRadius: 999, borderTopRightRadius: 999 },

  // Scroll
  scroll:        { flex: 1 },
  scrollContent: { paddingTop: 10, paddingHorizontal: 18, gap: 12 },

  // Form card
  formCard: {
    backgroundColor: T.white,
    borderRadius: CARD_RADIUS,
    padding: 16,
    shadowColor: T.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  sectionLabel: { fontSize: 11, fontWeight: "700", color: T.soil, letterSpacing: 0.3, textTransform: "uppercase", marginBottom: 10 },

  divider: { height: 1, backgroundColor: T.border, marginVertical: 14 },

  textInput: {
    backgroundColor: T.parchment,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14,
    color: T.bark,
    borderWidth: 1,
    borderColor: T.border,
  },
  textArea: { minHeight: 72, paddingTop: 11 },

  // Category grid
  catGrid:        { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  catOption:      { width: (width - 36 - 32 - 9) / 2, borderRadius: 14, borderWidth: 1.5, borderColor: T.border, backgroundColor: T.parchment, flexDirection: "row", alignItems: "center", gap: 9, padding: 11 },
  catOptionIcon:  { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  catOptionEmoji: { fontSize: 18 },
  catOptionLabel: { fontSize: 13, fontWeight: "600", color: T.muted, flex: 1 },
  catCheckDot:    { width: 8, height: 8, borderRadius: 4 },

  // Duration chips
  chipRow:    { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  selectChip: { borderRadius: 10, borderWidth: 1.5, borderColor: T.border, backgroundColor: T.parchment, paddingHorizontal: 14, paddingVertical: 8 },
  selectChipText: { fontSize: 13, fontWeight: "600", color: T.muted },

  // Reward row
  rewardRow:    { flexDirection: "row", gap: 8 },
  rewardOption: { flex: 1, borderRadius: 13, borderWidth: 1.5, borderColor: T.border, backgroundColor: T.parchment, alignItems: "center", paddingVertical: 11, gap: 3 },
  rewardEmoji:  { fontSize: 20 },
  rewardLabel:  { fontSize: 10, fontWeight: "700", color: T.soil },
  rewardXP:     { fontSize: 10, fontWeight: "600", color: T.muted },

  // Submit
  submitWrap:    { marginTop: 4, gap: 10 },
  submitBtn:     { borderRadius: 17, overflow: "hidden" },
  submitGrad:    { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  submitText:    { fontSize: 15, fontWeight: "800", color: T.white, letterSpacing: -0.2 },

  successBanner: { backgroundColor: T.mistLight, borderRadius: 17, paddingVertical: 16, alignItems: "center", borderWidth: 1, borderColor: T.mist },
  successText:   { fontSize: 14, fontWeight: "700", color: T.canopy },

  validationHint: { fontSize: 12, color: T.muted, textAlign: "center", fontWeight: "500" },
});