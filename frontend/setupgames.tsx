import { useRouter } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function SetupGames() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Curved purple header blob */}
      <View style={styles.headerBlob}>

        {/* Decorative dots */}
        <View style={[styles.dot, { top: 28, left: 24, backgroundColor: "#FF6B6B", width: 10, height: 10 }]} />
        <View style={[styles.dot, { top: 18, left: width * 0.45, backgroundColor: "#FFD93D", width: 8, height: 8 }]} />
        <View style={[styles.dot, { top: 34, right: 28, backgroundColor: "#6BCB77", width: 12, height: 12 }]} />
        <View style={[styles.dot, { top: 70, right: 55, backgroundColor: "#4D96FF", width: 7, height: 7 }]} />

        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <View style={styles.mascotBody}>
            {/* Hat brim */}
            <View style={styles.hatBrim} />
            {/* Hat top */}
            <View style={styles.hatTop} />
            {/* Face */}
            <View style={styles.face}>
              <View style={styles.eyeRow}>
                <View style={styles.eye} />
                <View style={styles.eye} />
              </View>
            </View>
            {/* Cheek dot */}
            <View style={[styles.cheekDot, { left: "18%", backgroundColor: "#FF6B6B" }]} />
            <View style={[styles.cheekDot, { right: "18%", backgroundColor: "#FF6B6B" }]} />
          </View>
          {/* Green notification dot */}
          <View style={styles.notifDot} />
        </View>

        <Text style={styles.headerTitle}>Set Up Games!</Text>
        <Text style={styles.headerSub}>Choose a game to get started 🎉</Text>
      </View>

      {/* Card area */}
      <View style={styles.cardArea}>

        {/* Memory Game Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#fff" }]}
          onPress={() => router.push("/uploadphotosfam")}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#EDE7FF" }]}>
            <Text style={styles.cardIcon}>🧠</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Memory Game</Text>
            <Text style={styles.cardSubtitle}>Add family photos for matching</Text>
          </View>
          <View style={[styles.arrow, { backgroundColor: "#7C3AED" }]}>
            <Text style={styles.arrowText}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Emotion Game Card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#fff" }]}
          onPress={() => router.push("/uploadphotos")}
          activeOpacity={0.85}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#FFF3E0" }]}>
            <Text style={styles.cardIcon}>😊</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Emotion Game</Text>
            <Text style={styles.cardSubtitle}>Add emotions to photos</Text>
          </View>
          <View style={[styles.arrow, { backgroundColor: "#F59E0B" }]}>
            <Text style={styles.arrowText}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Pagination dots */}
        <View style={styles.pagination}>
          <View style={[styles.pageDot, { backgroundColor: "#C4B5FD", width: 8, height: 8 }]} />
          <View style={[styles.pageDot, { backgroundColor: "#7C3AED", width: 22, height: 8 }]} />
          <View style={[styles.pageDot, { backgroundColor: "#C4B5FD", width: 8, height: 8 }]} />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3EEFF",
    alignItems: "center",
  },

  /* ── Header blob ── */
  headerBlob: {
    width: "100%",
    backgroundColor: "#7C3AED",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingTop: 56,
    paddingBottom: 40,
    alignItems: "center",
  },

  dot: {
    position: "absolute",
    borderRadius: 999,
  },

  /* ── Mascot ── */
  mascotContainer: {
    marginBottom: 16,
    alignItems: "center",
    position: "relative",
  },
  mascotBody: {
    width: 80,
    height: 80,
    backgroundColor: "#FFD93D",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 10,
    overflow: "visible",
  },
  hatBrim: {
    position: "absolute",
    top: -10,
    width: 86,
    height: 14,
    backgroundColor: "#FF9F1C",
    borderRadius: 8,
  },
  hatTop: {
    position: "absolute",
    top: -34,
    width: 44,
    height: 30,
    backgroundColor: "#FF9F1C",
    borderRadius: 8,
  },
  face: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 4,
  },
  eyeRow: {
    flexDirection: "row",
    gap: 14,
  },
  eye: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3D2C00",
  },
  cheekDot: {
    position: "absolute",
    bottom: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.6,
  },
  notifDot: {
    position: "absolute",
    top: -8,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#6BCB77",
    borderWidth: 2,
    borderColor: "#7C3AED",
  },

  /* ── Header text ── */
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },
  headerSub: {
    marginTop: 4,
    fontSize: 14,
    color: "#DDD6FE",
    fontWeight: "500",
  },

  /* ── Cards ── */
  cardArea: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 30,
    alignItems: "center",
  },

  card: {
    width: "100%",
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    fontSize: 28,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E0050",
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#7C6F9A",
    fontWeight: "500",
  },

  arrow: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
  },

  /* ── Pagination ── */
  pagination: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
    alignItems: "center",
  },
  pageDot: {
    borderRadius: 999,
  },
});