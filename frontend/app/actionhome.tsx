import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const MODULES = [
  {
    id: "actions",
    icon: "🏃",
    iconBg: "#EDE9FE",
    title: "Actions",
    desc: "Sit, stand, come, go, hands up",
    href: "/actioncards/actions", // placeholder
  },
  {
    id: "hygiene",
    icon: "🧼",
    iconBg: "#FCE7F3",
    title: "Hygiene",
    desc: "Brush teeth, wash hands, clean/dirty",
    href: "/actioncards/hygiene", // placeholder
  },
  {
    id: "objects",
    icon: "🏠",
    iconBg: "#FEF3C7",
    title: "Home objects",
    desc: "Door, light, fan — open/close/on/off",
    href: "/actioncards/objects", // placeholder
  },
  {
    id: "face",
    icon: "😊",
    iconBg: "#E0F2FE",
    title: "Face & expression",
    desc: "Eyes open/close, mouth open/close",
    href: "/actioncards/face", // placeholder
  },
];

export default function ActionHome() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* back button */}
        <View style={s.topBar}>
          <Pressable style={s.backBtn} onPress={() => router.back()} accessibilityLabel="Back">
            <Text style={s.backArrow}>←</Text>
          </Pressable>
        </View>

        {/* title */}
        <View style={s.titleRow}>
          <Text style={s.titleEmoji}>🗂️</Text>
          <View>
            <Text style={s.title}>Action Cards</Text>
            <Text style={s.sub}>Choose a topic to explore</Text>
          </View>
        </View>

        {/* module list */}
        <View style={s.list}>
          {MODULES.map((mod) => (
            <Pressable
              key={mod.id}
              style={({ pressed }) => [s.row, pressed && s.pressed]}
              onPress={() => router.push(mod.href as any)}
              accessibilityRole="button"
              accessibilityLabel={mod.title}
            >
              <View style={[s.iconBox, { backgroundColor: mod.iconBg }]}>
                <Text style={s.iconText}>{mod.icon}</Text>
              </View>
              <View style={s.rowBody}>
                <Text style={s.rowTitle}>{mod.title}</Text>
                <Text style={s.rowDesc}>{mod.desc}</Text>
              </View>
              <Text style={s.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  titleEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 2,
  },
  sub: {
    fontSize: 14,
    color: "#6B7280",
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 26,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 3,
  },
  rowDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  chevron: {
    fontSize: 24,
    color: "#C4B5FD",
    fontWeight: "300",
  },
});