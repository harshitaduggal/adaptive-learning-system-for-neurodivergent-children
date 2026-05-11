import { useRouter, Stack } from "expo-router";
import { useState, useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/theme";
import usersData from "../data/users.json";
import experimentLog from "../data/experiment_log.json";

type UserId = string;
type Modality = "flashcard" | "video" | "game";
type Action = "next" | "skip";

interface HistoryEntry {
  module: string;
  modality: Modality;
  action: Action;
  reward: number;
}

interface UserData {
  global: {
    attempts: number;
    Q: Record<Modality, number>;
    history: HistoryEntry[];
  };
  modules: Record<string, { score: number }>;
}

interface ExperimentEntry {
  user_id: string;
  attempt: number;
  algorithm: string;
  Q_values: Record<Modality, number>;
  selected: Modality;
}

const allUserIds = Array.from(
  new Set([
    ...Object.keys(usersData as Record<string, unknown>),
    ...(experimentLog as ExperimentEntry[]).map((e) => e.user_id),
  ])
).sort();

const MODALITY_LABELS: Record<Modality, string> = {
  flashcard: "Flashcard",
  video: "Video",
  game: "Game",
};

const MODALITY_COLORS: Record<Modality, string> = {
  flashcard: "#4A90D9",
  video: "#E8526B",
  game: "#34B78F",
};

function Bar({ value, color, label }: { value: number; color: string; label?: string }) {
  return (
    <View style={barStyles.row}>
      {label ? <Text style={barStyles.label}>{label}</Text> : null}
      <View style={barStyles.track}>
        <View style={[barStyles.fill, { width: `${Math.round(value * 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={barStyles.value}>{Math.round(value * 100)}%</Text>
    </View>
  );
}

const barStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  label: { width: 90, fontSize: 13, color: "#444" },
  track: {
    flex: 1,
    height: 18,
    backgroundColor: "#E8E8E8",
    borderRadius: 9,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  fill: { height: "100%", borderRadius: 9 },
  value: { width: 40, textAlign: "right", fontSize: 13, fontWeight: "600", color: "#333" },
});

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={cardStyles.wrapper}>
      <Text style={cardStyles.title}>{title}</Text>
      {children}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
});

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<UserId>("user1");

  const userData = (usersData as Record<UserId, UserData>)[selectedUser];

  const modalityCounts = useMemo(() => {
    if (!userData) return {} as Record<Modality, number>;
    const counts: Record<string, number> = { flashcard: 0, video: 0, game: 0 };
    for (const h of userData.global.history) {
      counts[h.modality] = (counts[h.modality] || 0) + 1;
    }
    return counts as Record<Modality, number>;
  }, [userData]);

  const preferredModality = useMemo(() => {
    return (Object.entries(modalityCounts) as [Modality, number][]).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? null;
  }, [modalityCounts]);

  const actionCounts = useMemo(() => {
    if (!userData) return { next: 0, skip: 0 };
    const counts = { next: 0, skip: 0 };
    for (const h of userData.global.history) {
      if (h.action === "next") counts.next++;
      else counts.skip++;
    }
    return counts;
  }, [userData]);

  const totalActions = actionCounts.next + actionCounts.skip;
  const engagementPct = totalActions > 0 ? (actionCounts.next / totalActions) * 100 : 0;
  const totalReward = useMemo(() => {
    if (!userData) return 0;
    return userData.global.history.reduce((sum, h) => sum + h.reward, 0);
  }, [userData]);

  const recentHistory = useMemo(() => {
    if (!userData) return [];
    return [...userData.global.history].reverse().slice(0, 10);
  }, [userData]);

  return (
    <>
      <Stack.Screen options={{ title: "Dashboard", headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* User Picker */}
          <View style={styles.userPicker}>
            <Text style={styles.sectionLabel}>Select User</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.userRow}>
              {allUserIds.map((uid) => (
                <TouchableOpacity
                  key={uid}
                  style={[styles.userChip, uid === selectedUser && styles.userChipActive]}
                  onPress={() => setSelectedUser(uid)}
                >
                  <Text style={[styles.userChipText, uid === selectedUser && styles.userChipTextActive]}>
                    {uid}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {!userData ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No user data found for "{selectedUser}"</Text>
            </View>
          ) : (
            <>
              {/* Module Score */}
              <SectionCard title="Module Score">
                {Object.entries(userData.modules).length === 0 ? (
                  <Text style={styles.emptySmall}>No modules completed yet.</Text>
                ) : (
                  Object.entries(userData.modules).map(([mod, data]) => (
                    <Bar key={mod} label={mod.replace(/_/g, " ")} value={data.score} color="#7B61FF" />
                  ))
                )}
              </SectionCard>

              {/* Preferred Modality */}
              <SectionCard title="Preferred Modality">
                {totalActions === 0 ? (
                  <Text style={styles.emptySmall}>No engagement data yet.</Text>
                ) : (
                  <>
                    <Text style={styles.preferredLabel}>
                      Most engaged:{" "}
                      <Text style={{ fontWeight: "800", color: MODALITY_COLORS[preferredModality!] }}>
                        {preferredModality ? MODALITY_LABELS[preferredModality] : "—"}
                      </Text>
                    </Text>
                    {(Object.entries(modalityCounts) as [Modality, number][]).map(([mod, count]) => (
                      <Bar
                        key={mod}
                        label={MODALITY_LABELS[mod]}
                        value={totalActions > 0 ? count / totalActions : 0}
                        color={MODALITY_COLORS[mod]}
                      />
                    ))}
                    <Text style={styles.totalLabel}>
                      {totalActions} total action{totalActions !== 1 ? "s" : ""}
                    </Text>
                  </>
                )}
              </SectionCard>

              {/* Engagement Quality */}
              <SectionCard title="Engagement Quality">
                {totalActions === 0 ? (
                  <Text style={styles.emptySmall}>No actions recorded yet.</Text>
                ) : (
                  <>
                    <Bar label="Next (positive)" value={engagementPct / 100} color="#34B78F" />
                    <Bar
                      label="Skip (negative)"
                      value={(100 - engagementPct) / 100}
                      color="#E8526B"
                    />
                    <Text style={styles.totalLabel}>
                      {actionCounts.next} next · {actionCounts.skip} skip · {Math.round(engagementPct)}% positive
                    </Text>
                  </>
                )}
              </SectionCard>

              {/* Quick Stats */}
              <SectionCard title="Quick Stats">
                <View style={styles.statRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{userData.global.attempts}</Text>
                    <Text style={styles.statLabel}>Attempts</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{Object.keys(userData.modules).length}</Text>
                    <Text style={styles.statLabel}>Modules</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{totalReward.toFixed(1)}</Text>
                    <Text style={styles.statLabel}>Total Reward</Text>
                  </View>
                </View>
              </SectionCard>

              {/* Recent Activity Feed */}
              <SectionCard title="Recent Activity">
                {recentHistory.length === 0 ? (
                  <Text style={styles.emptySmall}>No activity yet.</Text>
                ) : (
                  recentHistory.map((entry, i) => (
                    <View key={i} style={styles.feedRow}>
                      <View
                        style={[
                          styles.feedDot,
                          { backgroundColor: entry.action === "next" ? "#34B78F" : "#E8526B" },
                        ]}
                      />
                      <View style={styles.feedContent}>
                        <Text style={styles.feedAction}>
                          {entry.action === "next" ? "✅ Completed" : "⏭ Skipped"}{" "}
                          <Text style={styles.feedModality}>{MODALITY_LABELS[entry.modality]}</Text>
                        </Text>
                        <Text style={styles.feedMeta}>
                          {entry.module.replace(/_/g, " ")} · reward: {entry.reward > 0 ? "+" : ""}
                          {entry.reward}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </SectionCard>

              {/* Experiment Log Summary */}
              <SectionCard title="Experiment Log">
                {(() => {
                  const userExperiments = (experimentLog as ExperimentEntry[]).filter(
                    (e) => e.user_id === selectedUser
                  );
                  if (userExperiments.length === 0) {
                    return <Text style={styles.emptySmall}>No experiment entries for this user.</Text>;
                  }
                  return (
                    <>
                      <Text style={styles.totalLabel}>
                        {userExperiments.length} experiment{userExperiments.length > 1 ? "s" : ""} logged
                      </Text>
                      {userExperiments.slice(0, 5).reverse().map((entry, i) => (
                        <View key={i} style={styles.feedRow}>
                          <View style={[styles.feedDot, { backgroundColor: "#7B61FF" }]} />
                          <View style={styles.feedContent}>
                            <Text style={styles.feedAction}>
                              Attempt #{entry.attempt} —{" "}
                              <Text style={styles.feedModality}>{MODALITY_LABELS[entry.selected]}</Text>{" "}
                              via {entry.algorithm}
                            </Text>
                            <Text style={styles.feedMeta}>
                              Q: flashcard={Math.round(entry.Q_values.flashcard * 100)}% · video=
                              {Math.round(entry.Q_values.video * 100)}% · game=
                              {Math.round(entry.Q_values.game * 100)}%
                            </Text>
                          </View>
                        </View>
                      ))}
                    </>
                  );
                })()}
              </SectionCard>
            </>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backBtn: {
    width: 60,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 15,
    color: "#0a7ea4",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  scroll: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  userPicker: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  userRow: {
    flexDirection: "row",
    gap: 8,
  },
  userChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E8E8ED",
  },
  userChipActive: {
    backgroundColor: "#0a7ea4",
  },
  userChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  userChipTextActive: {
    color: "#fff",
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: "#8E8E93",
  },
  emptySmall: {
    fontSize: 13,
    color: "#8E8E93",
    fontStyle: "italic",
  },
  preferredLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 6,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  feedRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  feedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 12,
  },
  feedContent: {
    flex: 1,
  },
  feedAction: {
    fontSize: 14,
    color: "#333",
  },
  feedModality: {
    fontWeight: "700",
    color: "#1a1a1a",
  },
  feedMeta: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
});
