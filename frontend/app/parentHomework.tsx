/**
 * ParentHomework — Parent Portal · Homework Screen
 * Shows today's auto-assigned homework for the child.
 * Mix of academic + emotional/social tasks.
 * Aesthetic: Forest Adventure (refined/adult variant of ChildHome).
 *
 * Dependencies:
 *   npx expo install expo-linear-gradient react-native-safe-area-context
 */

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// ─── Design Tokens ─────────────────────────────────────────────────────────────

const T = {
  forest:      "#1A3A2A",
  canopy:      "#2D5A3D",
  leaf:        "#3D7A52",
  sage:        "#6BAE82",
  mist:        "#C8E6D4",
  misLight:    "#EDFAF2",
  honey:       "#F5A623",
  honeyPale:   "#FFF5DC",
  terra:       "#D4633A",
  terraLight:  "#FFF0EB",
  bark:        "#2C1A0E",
  soil:        "#5C3D1E",
  parchment:   "#F5F1EA",
  white:       "#FFFFFF",
  sky:         "#5BA8D4",
  skyPale:     "#EDF5FF",
  berry:       "#C45C8A",
  berryPale:   "#FDEEF5",
  lilac:       "#7F77DD",
  lilacPale:   "#F5F0FF",
  border:      "rgba(26,58,42,0.1)",
  shadow:      "rgba(26,58,42,0.12)",
  muted:       "#8A9E90",
};

// ─── Types ─────────────────────────────────────────────────────────────────────

type TaskStatus = "pending" | "in_progress" | "done";

type Task = {
  id: string;
  title: string;
  description: string;
  category: "Academic" | "Emotional" | "Words" | "Art" | "Music" | "Games";
  emoji: string;
  duration: string;
  xp: number;
  status: TaskStatus;
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const todayTasks: Task[] = [
  {
    id: "t1",
    title: "Read 2 pages of a storybook",
    description: "Pick any book from the shelf. Read aloud if possible.",
    category: "Words",
    emoji: "📖",
    duration: "10 min",
    xp: 20,
    status: "done",
  },
  {
    id: "t2",
    title: "Count objects around the house",
    description: "Find and count at least 3 groups of things (e.g. spoons, pillows).",
    category: "Academic",
    emoji: "🔢",
    duration: "15 min",
    xp: 15,
    status: "in_progress",
  },
  {
    id: "t3",
    title: "Name 3 feelings from today",
    description: "Ask Aryan to describe 3 emotions they felt today and why.",
    category: "Emotional",
    emoji: "😊",
    duration: "5 min",
    xp: 10,
    status: "pending",
  },
  {
    id: "t4",
    title: "Draw your favourite animal",
    description: "Use crayons or pencil. No rules — just have fun!",
    category: "Art",
    emoji: "🎨",
    duration: "15 min",
    xp: 15,
    status: "pending",
  },
];

// ─── Category styles ───────────────────────────────────────────────────────────

const catStyle: Record<Task["category"], { bg: string; text: string; dot: string }> = {
  Academic:  { bg: T.skyPale,    text: "#185FA5", dot: T.sky    },
  Emotional: { bg: T.berryPale,  text: "#72243E", dot: T.berry  },
  Words:     { bg: T.honeyPale,  text: "#854F0B", dot: T.honey  },
  Art:       { bg: T.terraLight, text: "#712B13", dot: T.terra  },
  Music:     { bg: T.lilacPale,  text: "#3C3489", dot: T.lilac  },
  Games:     { bg: T.misLight,   text: "#27500A", dot: T.leaf   },
};

const statusConfig: Record<TaskStatus, { label: string; bg: string; text: string; icon: string }> = {
  done:        { label: "Done",        bg: T.misLight,   text: T.leaf,   icon: "✓" },
  in_progress: { label: "In progress", bg: T.honeyPale,  text: "#854F0B", icon: "●" },
  pending:     { label: "Not started", bg: T.parchment,  text: T.muted,  icon: "○" },
};

// ─── Task Card ─────────────────────────────────────────────────────────────────

function TaskCard({ task, index }: { task: Task; index: number }) {
  const cat  = catStyle[task.category];
  const stat = statusConfig[task.status];
  const isDone = task.status === "done";

  return (
    <View style={[styles.taskCard, isDone && styles.taskCardDone]}>
      {/* Left color bar */}
      <View style={[styles.taskBar, { backgroundColor: cat.dot }]} />

      <View style={styles.taskInner}>
        {/* Top row */}
        <View style={styles.taskTopRow}>
          <View style={[styles.taskIconWrap, { backgroundColor: cat.bg }]}>
            <Text style={styles.taskEmoji}>{task.emoji}</Text>
          </View>

          <View style={styles.taskMeta}>
            <View style={styles.taskPillRow}>
              <View style={[styles.pill, { backgroundColor: cat.bg }]}>
                <Text style={[styles.pillText, { color: cat.text }]}>{task.category}</Text>
              </View>
              <View style={[styles.pill, { backgroundColor: stat.bg }]}>
                <Text style={[styles.pillText, { color: stat.text }]}>
                  {stat.icon} {stat.label}
                </Text>
              </View>
            </View>

            <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]}>
              {task.title}
            </Text>
            <Text style={styles.taskDesc} numberOfLines={2}>
              {task.description}
            </Text>
          </View>
        </View>

        {/* Bottom row */}
        <View style={styles.taskFooter}>
          <View style={styles.taskFooterLeft}>
            <View style={styles.footerChip}>
              <Text style={styles.footerChipText}>⏱ {task.duration}</Text>
            </View>
            <View style={styles.footerChip}>
              <Text style={styles.footerChipText}>⭐ +{task.xp} XP</Text>
            </View>
          </View>
          {isDone && (
            <View style={styles.doneStamp}>
              <Text style={styles.doneStampText}>Completed ✓</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Summary Bar ───────────────────────────────────────────────────────────────

function SummaryBar({ tasks }: { tasks: Task[] }) {
  const done  = tasks.filter(t => t.status === "done").length;
  const total = tasks.length;
  const pct   = Math.round((done / total) * 100);
  const xpEarned = tasks.filter(t => t.status === "done").reduce((s, t) => s + t.xp, 0);
  const xpTotal  = tasks.reduce((s, t) => s + t.xp, 0);

  return (
    <View style={styles.summaryBar}>
      {/* Progress ring stand-in */}
      <View style={styles.summaryRingWrap}>
        <View style={[styles.summaryRing, { borderColor: pct === 100 ? T.leaf : T.honey }]}>
          <Text style={[styles.summaryPct, { color: pct === 100 ? T.leaf : T.honey }]}>
            {pct}%
          </Text>
        </View>
      </View>

      <View style={styles.summaryTextBlock}>
        <Text style={styles.summaryHeading}>
          {done}/{total} tasks completed
        </Text>
        <Text style={styles.summarySub}>
          {xpEarned} of {xpTotal} XP earned today
        </Text>

        {/* Mini progress bar */}
        <View style={styles.summaryTrack}>
          <View style={[styles.summaryFill, { width: `${pct}%` as any }]} />
        </View>
      </View>
    </View>
  );
}

// ─── Child Chip ────────────────────────────────────────────────────────────────

function ChildChip() {
  return (
    <View style={styles.childChip}>
      <View style={styles.childAvatar}>
        <Text style={styles.childAvatarText}>A</Text>
      </View>
      <View>
        <Text style={styles.childName}>Aryan</Text>
        <Text style={styles.childGrade}>Class 2B · Age 7</Text>
      </View>
      <View style={styles.childChipArrow}>
        <Text style={styles.childChipArrowText}>›</Text>
      </View>
    </View>
  );
}

// ─── Filter Tabs ───────────────────────────────────────────────────────────────

type Filter = "All" | "Pending" | "Done";

function FilterTabs({
  active,
  onChange,
}: {
  active: Filter;
  onChange: (f: Filter) => void;
}) {
  const tabs: Filter[] = ["All", "Pending", "Done"];
  return (
    <View style={styles.filterRow}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          onPress={() => onChange(tab)}
          style={[styles.filterTab, active === tab && styles.filterTabActive]}
          activeOpacity={0.75}
        >
          <Text style={[styles.filterTabText, active === tab && styles.filterTabTextActive]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function ParentHomework() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>("All");

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const filtered = todayTasks.filter(t => {
    if (filter === "All")     return true;
    if (filter === "Done")    return t.status === "done";
    if (filter === "Pending") return t.status !== "done";
    return true;
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <LinearGradient
        colors={[T.forest, T.canopy, "#3D6B50"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 14 }]}
      >
        {/* Decorative blobs */}
        <View style={[styles.blob, { width: 160, height: 160, top: -55, right: -40, backgroundColor: "rgba(61,122,82,0.38)" }]} />
        <View style={[styles.blob, { width: 70, height: 70, top: 20, left: -20, backgroundColor: "rgba(245,166,35,0.12)" }]} />

        {/* Nav row */}
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.75}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📚 Homework</Text>
          <TouchableOpacity
            onPress={() => router.push("/parentHomeworkAssign")}
            style={styles.assignBtn}
            activeOpacity={0.75}
          >
            <Text style={styles.assignBtnText}>+ Assign</Text>
          </TouchableOpacity>
        </View>

        {/* Date */}
        <View style={styles.dateChip}>
          <Text style={styles.dateChipText}>📅 {today}</Text>
        </View>

        {/* Wave */}
        <View style={styles.waveClip}>
          <View style={styles.waveShape} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Child chip */}
        <View style={styles.section}>
          <ChildChip />
        </View>

        {/* Summary bar */}
        <View style={styles.section}>
          <SummaryBar tasks={todayTasks} />
        </View>

        {/* Filter + task list */}
        <View style={styles.section}>
          <FilterTabs active={filter} onChange={setFilter} />

          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🌿</Text>
              <Text style={styles.emptyText}>No tasks here</Text>
            </View>
          ) : (
            filtered.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))
          )}
        </View>

        {/* Note */}
        <View style={[styles.section, { marginTop: 4 }]}>
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>
              🦉 Tasks are auto-assigned based on Aryan`s progress and learning goals. Tap" + Assign" to add your own.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.parchment },

  // Header
  header:   { paddingHorizontal: 20, paddingBottom: 0, overflow: "hidden" },
  blob:     { position: "absolute", borderRadius: 999 },
  navRow:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14, position: "relative", zIndex: 1 },
  backBtn:  { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },
  backBtnText: { fontSize: 22, color: T.white, lineHeight: 28, marginTop: -2 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: T.white, letterSpacing: -0.3 },
  assignBtn:   { backgroundColor: "rgba(245,166,35,0.2)", borderRadius: 99, paddingHorizontal: 13, paddingVertical: 7, borderWidth: 1, borderColor: "rgba(245,166,35,0.3)" },
  assignBtnText: { fontSize: 12, fontWeight: "700", color: T.honeyPale },

  dateChip: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 18, position: "relative", zIndex: 1 },
  dateChipText: { fontSize: 12, color: "rgba(200,230,212,0.85)", fontWeight: "500" },

  waveClip:  { height: 32, overflow: "hidden", marginHorizontal: -20 },
  waveShape: { position: "absolute", bottom: 0, left: 0, right: 0, height: 50, backgroundColor: T.parchment, borderTopLeftRadius: 999, borderTopRightRadius: 999 },

  // Scroll
  scroll:        { flex: 1 },
  scrollContent: { paddingTop: 8 },
  section:       { paddingHorizontal: 18, marginBottom: 14 },

  // Child chip
  childChip: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: T.white, borderRadius: 18, padding: 14, shadowColor: T.shadow, shadowOpacity: 1, shadowRadius: 12, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  childAvatar: { width: 42, height: 42, borderRadius: 14, backgroundColor: T.misLight, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: T.mist },
  childAvatarText: { fontSize: 20, fontWeight: "700", color: T.leaf },
  childName:  { fontSize: 15, fontWeight: "700", color: T.bark },
  childGrade: { fontSize: 12, color: T.muted, marginTop: 1 },
  childChipArrow:     { marginLeft: "auto" as any, width: 28, height: 28, borderRadius: 9, backgroundColor: T.parchment, alignItems: "center", justifyContent: "center" },
  childChipArrowText: { fontSize: 20, color: T.muted, lineHeight: 24 },

  // Summary bar
  summaryBar:      { backgroundColor: T.white, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 16, shadowColor: T.shadow, shadowOpacity: 1, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  summaryRingWrap: { alignItems: "center", justifyContent: "center" },
  summaryRing:     { width: 64, height: 64, borderRadius: 32, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  summaryPct:      { fontSize: 18, fontWeight: "800" },
  summaryTextBlock:{ flex: 1 },
  summaryHeading:  { fontSize: 15, fontWeight: "700", color: T.bark, marginBottom: 2 },
  summarySub:      { fontSize: 12, color: T.muted, marginBottom: 9 },
  summaryTrack:    { height: 6, backgroundColor: T.border, borderRadius: 99, overflow: "hidden" },
  summaryFill:     { height: "100%", backgroundColor: T.leaf, borderRadius: 99 },

  // Filter tabs
  filterRow: { flexDirection: "row", backgroundColor: T.white, borderRadius: 14, padding: 4, marginBottom: 12, shadowColor: T.shadow, shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  filterTab:          { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 11 },
  filterTabActive:    { backgroundColor: T.forest },
  filterTabText:      { fontSize: 13, fontWeight: "600", color: T.muted },
  filterTabTextActive:{ color: T.white },

  // Task card
  taskCard: {
    backgroundColor: T.white,
    borderRadius: 20,
    marginBottom: 10,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: T.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  taskCardDone: { opacity: 0.72 },
  taskBar:   { width: 4 },
  taskInner: { flex: 1, padding: 14 },
  taskTopRow:{ flexDirection: "row", gap: 12, alignItems: "flex-start" },
  taskIconWrap: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  taskEmoji: { fontSize: 24 },
  taskMeta:  { flex: 1 },
  taskPillRow: { flexDirection: "row", gap: 6, marginBottom: 5, flexWrap: "wrap" },
  pill:     { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: "700" },
  taskTitle:     { fontSize: 14, fontWeight: "700", color: T.bark, lineHeight: 19, marginBottom: 3 },
  taskTitleDone: { textDecorationLine: "line-through", color: T.muted },
  taskDesc: { fontSize: 12, color: T.muted, lineHeight: 17 },

  taskFooter:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 },
  taskFooterLeft: { flexDirection: "row", gap: 8 },
  footerChip:     { backgroundColor: T.parchment, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  footerChipText: { fontSize: 11, fontWeight: "600", color: T.soil },

  doneStamp: { backgroundColor: T.misLight, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  doneStampText: { fontSize: 11, fontWeight: "700", color: T.leaf },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyIcon:  { fontSize: 36, marginBottom: 10 },
  emptyText:  { fontSize: 14, color: T.muted, fontWeight: "600" },

  // Note
  noteCard: { backgroundColor: T.misLight, borderRadius: 16, padding: 14, borderLeftWidth: 3, borderLeftColor: T.sage },
  noteText: { fontSize: 12, color: T.canopy, lineHeight: 18, fontWeight: "500" },
});