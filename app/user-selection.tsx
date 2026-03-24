import { Stack, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserSelectionScreen() {

  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>

        <Text style={styles.title}>Select Profile</Text>

        <View style={styles.tilesContainer}>

          {/* Child */}
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push("/category-selection")}
          >
            <View style={styles.avatarCircle}>
              <Image
                source={require("../assets/images/child-avatar.png")}
                style={styles.avatar}
              />
            </View>

            <Text style={styles.profileText}>Child</Text>
          </TouchableOpacity>


          {/* Parent */}
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push("/modal")}
          >
            <View style={styles.avatarCircle}>
              <Image
                source={require("../assets/images/parent-avatar.png")}
                style={styles.avatar}
              />
            </View>

            <Text style={styles.profileText}>Parent</Text>
          </TouchableOpacity>

        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F7",
  },

  title: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 50,
  },

  tilesContainer: {
    flexDirection: "row",
    gap: 80,
  },

  profileContainer: {
    alignItems: "center",
  },

  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#6C9EA6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },

  avatar: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    borderRadius: 80,
  },

  profileText: {
    fontSize: 20,
    fontWeight: "500",
  },

});