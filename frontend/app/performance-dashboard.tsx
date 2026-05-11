/**
 * PerformanceDashboard.tsx
 * Parent-facing screen showing the child's learning performance.
 *
 * Data shape expected from your /users endpoint (user_model.py):
 * {
 *   global: {
 *     attempts: number,
 *     Q: { flashcard: number, video: number, game: number },
 *     history: Array<{ modality: string, action: string }>
 *   },
 *   modules: {
 *     [moduleName: string]: { score: number }   // 0–1
 *   }
 * }
 *
 * Drop the API_BASE constant to your local IP / prod URL.
 * The screen works with mock data out of the box (no backend needed).
 */

import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Config ──────────────────────────────────────────────────
const API_BASE   = "http://192.168.1.1:5000";
const USER_ID    = "user1";
const USE_MOCK   = true; // flip to false when backend is ready

// ─── Types ───────────────────────────────────────────────────
type Modality = "flashcard" | "video" | "game";
type Action   = "next" | "skip" | "replay";

interface HistoryEvent {
  modality: Modality;
  action:   Action;
}

interface UserData {
  global: {
    attempts: number;
    Q:        Record<Modality, number>;
    history:  HistoryEvent[];
  };
  modules: Record<string, { score: number }>;
}

// ─── Mock data ───────────────────────────────────────────────
const MOCK: UserData = {
  global: {
    attempts: 42,
    Q: { flashcard: 0.72, video: 0.58, game: 0.85 },
    history: [
      ...Array(12).fill({ modality: "game",      action: "next"   }),
      ...Array(8) .fill({ modality: "flashcard", action: "next"   }),
      ...Array(5) .fill({ modality: "video",     action: "replay" }),
      ...Array(6) .fill({ modality: "flashcard", action: "skip"   }),
      ...Array(4) .fill({ modality: "game",      action: "replay" }),
      ...Array(7) .fill({ modality: "video",     action: "next"   }),
    ],
  },
  modules: {
    "two word phrases": { score: 0.76 },
    "colours":          { score: 0.55 },
    "animals":          { score: 0.91 },
  },
};

// ─── Palette ─────────────────────────────────────────────────
const C = {
  bg:          "#F5F0FF",
  card:        "#FFFFFF",
  purple:      "#7C3AED",
  purpleMid:   "#A78BFA",
  purpleLight: "#EDE9FE",
  purplePale:  "#F3EEFF",
  green:       "#16A34A",
  greenLight:  "#DCFCE7",
  amber:       "#D97706",
  amberLight:  "#FEF3C7",
  red:         "#DC2626",
  redLight:    "#FEE2E2",
  blue:        "#2563EB",
  blueLight:   "#DBEAFE",
  text:        "#1E1B4B",
  textMuted:   "#6B7280",
  textLight:   "#9CA3AF",
  border:      "#E9E3FF",
};

const { width: SW } = Dimensions.get("window");

// ─── Small helpers ────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── Metric pill ──────────────────────────────────────────────
function MetricPill({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon:   keyof typeof Ionicons.glyphMap;
  label:  string;
  value:  string;
  sub?:   string;
  accent?: string;
}) {
  return (
    <View style={styles.metricPill}>
      <View style={[styles.metricIconCircle, { backgroundColor: accent ?? C.purpleLight }]}>
        <Ionicons name={icon} size={18} color={accent ? "#fff" : C.purple} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      {sub ? <Text style={styles.metricSub}>{sub}</Text> : null}
    </View>
  );
}

// ─── Horizontal bar ──────────────────────────────────────────
function HBar({
  label,
  icon,
  value,      // 0–1
  color,
  count,
}: {
  label: string;
  icon:  keyof typeof Ionicons.glyphMap;
  value: number;
  color: string;
  count: number;
}) {
  const pct = Math.round(value * 100);
  return (
    <View style={styles.hbarRow}>
      <View style={styles.hbarLabelWrap}>
        <Ionicons name={icon} size={14} color={color} style={{ marginRight: 5 }} />
        <Text style={styles.hbarLabel}>{label}</Text>
      </View>
      <View style={styles.hbarTrack}>
        <View style={[styles.hbarFill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[styles.hbarNum, { color }]}>{count}</Text>
    </View>
  );
}

// ─── Score badge ─────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const { bg, fg, label } =
    pct >= 70 ? { bg: C.greenLight, fg: C.green,  label: "Great"      } :
    pct >= 45 ? { bg: C.purpleLight,fg: C.purple, label: "Learning"   } :
                { bg: C.redLight,   fg: C.red,    label: "Needs help" };
  return (
    <View style={[styles.scoreBadge, { backgroundColor: bg }]}>
      <Text style={[styles.scoreBadgeText, { color: fg }]}>{label} · {pct}%</Text>
    </View>
  );
}

// ─── Week heatmap ─────────────────────────────────────────────
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const HEAT_COLORS = ["#EDE9FE", "#C4B5FD", "#A78BFA", "#7C3AED", "#5B21B6"];

function WeekHeatmap({ activity }: { activity: number[] }) {
  return (
    <View>
      <View style={styles.heatRow}>
        {DAY_LABELS.map((d, i) => (
          <View key={i} style={styles.heatCol}>
            <Text style={styles.heatDayLabel}>{d}</Text>
            <View
              style={[
                styles.heatCell,
                { backgroundColor: HEAT_COLORS[Math.min(activity[i] ?? 0, 4)] },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.heatLegend}>
        <Text style={styles.heatLegendText}>Less</Text>
        {HEAT_COLORS.map((c, i) => (
          <View key={i} style={[styles.heatLegendDot, { backgroundColor: c }]} />
        ))}
        <Text style={styles.heatLegendText}>More</Text>
      </View>
    </View>
  );
}

// ─── Segmented engagement bar ─────────────────────────────────
function EngagementBar({
  completed,
  replayed,
  skipped,
}: {
  completed: number;
  replayed:  number;
  skipped:   number;
}) {
  const total = completed + replayed + skipped;
  if (total === 0) return <Text style={styles.emptyNote}>No data yet</Text>;
  const cp = Math.round((completed / total) * 100);
  const rp = Math.round((replayed  / total) * 100);
  const sp = 100 - cp - rp;
  const segments = [
    { pct: cp, color: C.purple,    label: "Completed" },
    { pct: rp, color: C.purpleMid, label: "Replayed"  },
    { pct: sp, color: "#F9A8D4",   label: "Skipped"   },
  ];
  return (
    <View>
      <View style={styles.engBar}>
        {segments.map((seg, i) =>
          seg.pct > 0 ? (
            <View
              key={i}
              style={[
                styles.engSeg,
                {
                  flex: seg.pct,
                  backgroundColor: seg.color,
                  borderTopLeftRadius:    i === 0 ? 8 : 0,
                  borderBottomLeftRadius: i === 0 ? 8 : 0,
                  borderTopRightRadius:    i === segments.length - 1 || (i === 1 && sp === 0) ? 8 : 0,
                  borderBottomRightRadius: i === segments.length - 1 || (i === 1 && sp === 0) ? 8 : 0,
                },
              ]}
            >
              {seg.pct > 12 && (
                <Text style={styles.engSegLabel}>{seg.pct}%</Text>
              )}
            </View>
          ) : null
        )}
      </View>
      <View style={styles.engLegend}>
        {segments.map((seg, i) => (
          <View key={i} style={styles.engLegItem}>
            <View style={[styles.engLegDot, { backgroundColor: seg.color }]} />
            <Text style={styles.engLegText}>{seg.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Insight row ─────────────────────────────────────────────
function InsightRow({
  icon,
  color,
  text,
}: {
  icon:  keyof typeof Ionicons.glyphMap;
  color: string;
  text:  string;
}) {
  return (
    <View style={styles.insightRow}>
      <View style={[styles.insightIcon, { backgroundColor: color + "22" }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.insightText}>{text}</Text>
    </View>
  );
}

// ─── Derive insights from data ────────────────────────────────
function deriveInsights(data: UserData) {
  const history  = data.global.history;
  const total    = history.length;
  const skips    = history.filter((h) => h.action === "skip").length;
  const replays  = history.filter((h) => h.action === "replay").length;
  const skipRate = total > 0 ? skips / total : 0;

  const modCounts = { flashcard: 0, video: 0, game: 0 } as Record<Modality, number>;
  history.forEach((h) => { modCounts[h.modality]++; });
  const fav = (Object.entries(modCounts) as [Modality, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  const avgScore =
    Object.values(data.modules).length > 0
      ? Object.values(data.modules).reduce((s, m) => s + m.score, 0) /
        Object.values(data.modules).length
      : null;

  const insights: { icon: keyof typeof Ionicons.glyphMap; color: string; text: string }[] = [];

  if (total === 0) {
    insights.push({
      icon: "information-circle-outline",
      color: C.purple,
      text: "No sessions recorded yet. Complete a session to see personalised insights.",
    });
    return insights;
  }

  if (skipRate > 0.4) {
    insights.push({
      icon: "warning-outline",
      color: C.amber,
      text: "High skip rate detected. The content may be too hard or sessions too long — consider shorter sessions.",
    });
  } else if (skipRate < 0.1) {
    insights.push({
      icon: "star-outline",
      color: C.green,
      text: "Excellent focus! Almost everything is being completed without skipping.",
    });
  }

  if (replays >= 3) {
    insights.push({
      icon: "refresh-outline",
      color: C.blue,
      text: `Content was replayed ${replays} times — great sign of curiosity and desire to understand.`,
    });
  }

  if (fav) {
    const emojis: Record<Modality, string> = { flashcard: "🃏", video: "🎬", game: "🎮" };
    insights.push({
      icon: "heart-outline",
      color: C.purple,
      text: `Favourite content type is ${emojis[fav]} ${fav}. Mixing in more ${fav}s may boost motivation.`,
    });
  }

  if (avgScore !== null && avgScore >= 0.75) {
    insights.push({
      icon: "trophy-outline",
      color: C.green,
      text: `Module scores are strong (avg ${Math.round(avgScore * 100)}%). Consider introducing new topics.`,
    });
  } else if (avgScore !== null && avgScore < 0.45) {
    insights.push({
      icon: "sad-outline",
      color: C.amber,
      text: `Module scores are low (avg ${Math.round(avgScore * 100)}%). More flashcard and video practice may help before games.`,
    });
  }

  return insights;
}

// ─────────────────────────────────────────────────────────────
//  Main screen
// ─────────────────────────────────────────────────────────────
export default function PerformanceDashboard() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK) {
      setUserData(MOCK);
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/user/${USER_ID}`)
      .then((r) => r.json())
      .then((d: UserData) => { setUserData(d); setLoading(false); })
      .catch(() => { setError("Couldn't load data. Check your connection."); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.purple} />
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cloud-offline-outline" size={48} color={C.purpleMid} />
        <Text style={[styles.emptyNote, { marginTop: 12 }]}>{error ?? "No data"}</Text>
      </View>
    );
  }

  // ── Derived stats ─────────────────────────────────────────
  const history  = userData.global.history;
  const total    = history.length;
  const skipped   = history.filter((h) => h.action === "skip").length;
  const replayed  = history.filter((h) => h.action === "replay").length;
  const completed = history.filter((h) => h.action === "next").length;

  const modCounts = { flashcard: 0, video: 0, game: 0 } as Record<Modality, number>;
  history.forEach((h) => { modCounts[h.modality]++; });
  const modMax = Math.max(...Object.values(modCounts), 1);

  const compRate    = total > 0 ? Math.round((completed / total) * 100) : 0;
  const skipRatePct = total > 0 ? Math.round((skipped  / total) * 100) : 0;

  const avgModScore =
    Object.values(userData.modules).length > 0
      ? Math.round(
          (Object.values(userData.modules).reduce((s, m) => s + m.score, 0) /
            Object.values(userData.modules).length) *
            100
        )
      : null;

  // Fake week activity seeded from attempts (replace with real daily data when available)
  const weekActivity = [1, 2, 3, 1, 4, 2, 3];

  const insights = deriveInsights(userData);

  // Favourite modality emoji
  const favMod = (
    Object.entries(modCounts) as [Modality, number][]
  ).sort((a, b) => b[1] - a[1])[0]?.[0];
  const favEmoji: Record<Modality, string> = { flashcard: "🃏", video: "🎬", game: "🎮" };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Background */}
      <View style={styles.bgFill} />
      <View style={styles.blobTR} />
      <View style={styles.blobBL} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <View style={styles.backCircle}>
              <Ionicons name="arrow-back" size={20} color={C.purple} />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle}>Learning report</Text>
            <Text style={styles.screenSub}>Two word phrases · user1</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🌟</Text>
          </View>
        </View>

        {/* ── Hero streak banner ── */}
        <View style={styles.heroBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Arya's doing great!</Text>
            <Text style={styles.heroSub}>
              {userData.global.attempts} total interactions
              {favMod ? `  ·  Loves ${favEmoji[favMod]} ${favMod}s` : ""}
            </Text>
          </View>
          <View style={styles.streakBox}>
            <Text style={styles.streakNum}>🔥 5</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
        </View>

        {/* ── Top metrics ── */}
        <SectionLabel>Overview</SectionLabel>
        <View style={styles.metricRow}>
          <MetricPill
            icon="checkmark-circle-outline"
            label="Completed"
            value={`${compRate}%`}
            sub="of content"
            accent={compRate >= 70 ? C.green : undefined}
          />
          <MetricPill
            icon="play-skip-forward-outline"
            label="Skip rate"
            value={`${skipRatePct}%`}
            sub="of content"
            accent={skipRatePct > 40 ? C.amber : undefined}
          />
          <MetricPill
            icon="refresh-outline"
            label="Replays"
            value={String(replayed)}
            sub="total"
          />
          {avgModScore !== null && (
            <MetricPill
              icon="ribbon-outline"
              label="Avg score"
              value={`${avgModScore}%`}
              sub="modules"
              accent={avgModScore >= 70 ? C.green : avgModScore < 45 ? C.red : undefined}
            />
          )}
        </View>

        {/* ── Engagement breakdown ── */}
        <SectionLabel>Engagement</SectionLabel>
        <Card>
          <Text style={styles.cardTitle}>How Arya interacts with content</Text>
          <EngagementBar
            completed={completed}
            replayed={replayed}
            skipped={skipped}
          />
        </Card>

        {/* ── Content preferences ── */}
        <SectionLabel>Content preferences</SectionLabel>
        <Card>
          <Text style={styles.cardTitle}>Interactions per type</Text>
          <HBar
            label="Flashcard"
            icon="images-outline"
            value={modCounts.flashcard / modMax}
            color={C.purple}
            count={modCounts.flashcard}
          />
          <HBar
            label="Video"
            icon="play-circle-outline"
            value={modCounts.video / modMax}
            color={C.blue}
            count={modCounts.video}
          />
          <HBar
            label="Game"
            icon="game-controller-outline"
            value={modCounts.game / modMax}
            color={C.green}
            count={modCounts.game}
          />
        </Card>

        {/* ── Q-values (simplified for parents) ── */}
        <SectionLabel>Skill confidence</SectionLabel>
        <Card>
          <Text style={styles.cardTitle}>How well each type is going</Text>
          <Text style={styles.cardHint}>
            Based on how Arya responds to each content type
          </Text>
          {(["flashcard", "video", "game"] as Modality[]).map((mod) => {
            const q   = userData.global.Q[mod];
            const pct = Math.round(q * 100);
            const color =
              pct >= 65 ? C.green : pct >= 45 ? C.purple : C.amber;
            const icon: Record<Modality, keyof typeof Ionicons.glyphMap> = {
              flashcard: "images-outline",
              video:     "play-circle-outline",
              game:      "game-controller-outline",
            };
            return (
              <View key={mod} style={styles.qRow}>
                <View style={styles.qLabelWrap}>
                  <Ionicons name={icon[mod]} size={14} color={color} style={{ marginRight: 5 }} />
                  <Text style={styles.qLabel}>{mod.charAt(0).toUpperCase() + mod.slice(1)}</Text>
                </View>
                <View style={styles.qTrack}>
                  <View
                    style={[styles.qFill, { width: `${pct}%` as any, backgroundColor: color }]}
                  />
                </View>
                <Text style={[styles.qNum, { color }]}>{pct}%</Text>
              </View>
            );
          })}
        </Card>

        {/* ── Module scores ── */}
        {Object.keys(userData.modules).length > 0 && (
          <>
            <SectionLabel>Module scores</SectionLabel>
            <Card>
              {Object.entries(userData.modules).map(([mod, { score }]) => (
                <View key={mod} style={styles.moduleRow}>
                  <Text style={styles.moduleName}>
                    {mod.charAt(0).toUpperCase() + mod.slice(1)}
                  </Text>
                  <ScoreBadge score={score} />
                </View>
              ))}
            </Card>
          </>
        )}

        {/* ── Weekly activity ── */}
        <SectionLabel>This week</SectionLabel>
        <Card>
          <Text style={styles.cardTitle}>Activity heatmap</Text>
          <WeekHeatmap activity={weekActivity} />
        </Card>

        {/* ── Parent insights ── */}
        <SectionLabel>Parent insights</SectionLabel>
        <Card>
          {insights.map((ins, i) => (
            <InsightRow key={i} {...ins} />
          ))}
        </Card>
      </ScrollView>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bgFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.bg,
  },
  blobTR: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#DDD6FE",
    opacity: 0.5,
  },
  blobBL: {
    position: "absolute",
    bottom: -70,
    left: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#FDE8FF",
    opacity: 0.55,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.bg,
  },
  scroll: {
    paddingHorizontal: 18,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  backBtn: { marginRight: 2 },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.text,
    letterSpacing: 0.2,
  },
  screenSub: {
    fontSize: 12,
    color: C.textMuted,
    marginTop: 1,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.purpleLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 22 },

  // Hero banner
  heroBanner: {
    backgroundColor: C.purple,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: C.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  heroSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },
  streakBox: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  streakNum: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  streakLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textLight,
    letterSpacing: 0.1,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 4,
  },

  // Card
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: C.purple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
    marginBottom: 4,
  },
  cardHint: {
    fontSize: 12,
    color: C.textMuted,
    marginBottom: 12,
  },

  // Metric pills
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  metricPill: {
    flex: 1,
    minWidth: (SW - 18 * 2 - 10 * 3) / 4,
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: C.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: C.text,
  },
  metricLabel: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
  metricSub: {
    fontSize: 10,
    color: C.textLight,
    marginTop: 1,
  },

  // Horizontal bar
  hbarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  hbarLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    width: 86,
  },
  hbarLabel: {
    fontSize: 13,
    color: C.textMuted,
  },
  hbarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: C.purplePale,
    borderRadius: 6,
    overflow: "hidden",
  },
  hbarFill: {
    height: "100%",
    borderRadius: 6,
  },
  hbarNum: {
    fontSize: 12,
    fontWeight: "600",
    width: 26,
    textAlign: "right",
  },

  // Score badge
  scoreBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Module row
  moduleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  moduleName: {
    fontSize: 14,
    color: C.text,
    textTransform: "capitalize",
  },

  // Q-value rows
  qRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  qLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    width: 86,
  },
  qLabel: {
    fontSize: 13,
    color: C.textMuted,
  },
  qTrack: {
    flex: 1,
    height: 10,
    backgroundColor: C.purplePale,
    borderRadius: 5,
    overflow: "hidden",
  },
  qFill: {
    height: "100%",
    borderRadius: 5,
  },
  qNum: {
    fontSize: 12,
    fontWeight: "600",
    width: 34,
    textAlign: "right",
  },

  // Engagement bar
  engBar: {
    flexDirection: "row",
    height: 22,
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 10,
  },
  engSeg: {
    alignItems: "center",
    justifyContent: "center",
  },
  engSegLabel: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  engLegend: {
    flexDirection: "row",
    gap: 14,
    marginTop: 4,
  },
  engLegItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  engLegDot: {
    width: 9,
    height: 9,
    borderRadius: 2,
  },
  engLegText: {
    fontSize: 12,
    color: C.textMuted,
  },

  // Week heatmap
  heatRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  heatCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  heatDayLabel: {
    fontSize: 10,
    color: C.textLight,
  },
  heatCell: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 6,
  },
  heatLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  heatLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  heatLegendText: {
    fontSize: 11,
    color: C.textLight,
  },

  // Insights
  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  insightIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: C.textMuted,
    lineHeight: 19,
  },

  emptyNote: {
    fontSize: 13,
    color: C.textLight,
    textAlign: "center",
  },
});