import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { Ionicons } from "@expo/vector-icons";

/* 🐰🐶 Mascots */
const rabbitImg = "https://cdn-icons-png.flaticon.com/512/1998/1998610.png?v=2";
const dogImg = "https://cdn-icons-png.flaticon.com/512/616/616430.png";

export default function AuthScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  /* 🐾 Animation */
  const scale = React.useRef(new Animated.Value(1)).current;
//replace
useEffect(() => {
  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  };

  lockOrientation();
//replace
 
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    return () => {
  ScreenOrientation.unlockAsync();
};
  }, []);

  /* ✅ Validation */
  const validate = () => {
    if (!email || !password) return "Fill all fields";
    if (!email.includes("@")) return "Invalid email";
    if (password.length < 6) return "Password must be 6+ chars";
    if (mode === "signup" && password !== confirm)
      return "Passwords do not match";
    return "";
  };

  /* 🚀 Submit */
  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const usersData = await AsyncStorage.getItem("users");
      let users = usersData ? JSON.parse(usersData) : {};

      if (mode === "signup") {
        if (users[email]) {
          setError("Account already exists");
          return;
        }
        users[email] = password;
        await AsyncStorage.setItem("users", JSON.stringify(users));
      }

      if (mode === "login") {
        if (!users[email] || users[email] !== password) {
          setError("Invalid credentials");
          return;
        }
      }

      await AsyncStorage.setItem("currentUser", email);

      const isFirstTime = await AsyncStorage.getItem(`isFirstTime_${email}`);

      if (mode === "signup" || isFirstTime === "true") {
        await AsyncStorage.setItem(`isFirstTime_${email}`, "true");
        router.replace("/questionnaire");
      } else {
        router.replace("/user-selection");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 🌊 TOP WAVE */}
      <View style={styles.topShape} />

      <View style={styles.card}>
        
        {/* 🐾 Mascot */}
        <Animated.Image
          source={{ uri: mode === "signup" ? rabbitImg : dogImg }}
          style={[styles.mascot, { transform: [{ scale }] }]}
        />

        {/* 📝 Title */}
        <Text style={styles.title}>
          {mode === "signup"
            ? "Let's get started 🐰"
            : "Welcome back 🐶"}
        </Text>

        {/* EMAIL */}
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        {/* PASSWORD */}
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            style={styles.inputFlex}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} />
          </TouchableOpacity>
        </View>

        {/* CONFIRM */}
        {mode === "signup" && (
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
          />
        )}

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === "login" ? "Login" : "Sign Up"}
            </Text>
          )}
        </TouchableOpacity>

        {/* SWITCH */}
        <TouchableOpacity onPress={() => setMode(mode === "login" ? "signup" : "login")}>
          <Text style={styles.switch}>
            {mode === "login"
              ? "New here? Sign up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </View>
  );
}

/* 🎨 STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF4F4",
    alignItems: "center",
    justifyContent: "center",
  },

  topShape: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 250,
    backgroundColor: "#2BB3B1",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },

  card: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    elevation: 10,
  },

  mascot: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    color: "#2BB3B1",
    marginBottom: 15,
    fontWeight: "600",
  },

  input: {
    width: "100%",
    backgroundColor: "#F5FDFD",
    padding: 12,
    borderRadius: 25,
    marginVertical: 6,
    paddingHorizontal: 15,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5FDFD",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 6,
    width: "100%",
  },

  inputFlex: {
    flex: 1,
    padding: 12,
  },

  button: {
    width: "100%",
    padding: 14,
    borderRadius: 25,
    backgroundColor: "#2BB3B1",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },

  switch: {
    marginTop: 12,
    color: "#2BB3B1",
    fontSize: 13,
  },

  error: {
    marginTop: 10,
    color: "red",
  },
});