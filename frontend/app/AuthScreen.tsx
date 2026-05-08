import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

// ─── Design Tokens ─────────────────────────────────────────────
const T = {
  purple:      "#7B61FF",
  purpleLight: "#EDE8FF",
  purpleMid:   "#C4B8FF",
  yellow:      "#FFD166",
  yellowLight: "#FFF3CD",
  coral:       "#FF6B6B",
  coralLight:  "#FFF0EF",
  mint:        "#A8EDEA",
  teal:        "#06D6A0",
  bg:          "#F5F0FF",
  white:       "#FFFFFF",
  text:        "#1A1A3E",
  textMid:     "#5A5A8A",
  textSoft:    "#B0A8D8",
  border:      "#EAE4FF",
};

// ─── Twinkling Star ────────────────────────────────────────────
function TwinkleStar({
  size, top, left, color, delay = 0, diamond = false,
}: {
  size: number; top: number; left: number; color: string; delay?: number; diamond?: boolean;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const scale   = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1,   duration: 900, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 1.2, duration: 900, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.3, duration: 900, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 0.8, duration: 900, useNativeDriver: true }),
        ]),
      ])
    );
    setTimeout(() => anim.start(), delay);
    return () => anim.stop();
  }, []);
  return (
    <Animated.View style={{
      position: "absolute", top, left,
      width: size, height: size,
      borderRadius: diamond ? 2 : size / 2,
      backgroundColor: color,
      transform: [{ rotate: diamond ? "45deg" : "0deg" }, { scale }],
      opacity,
    }} />
  );
}

// ─── Fox Mascot (built purely with Views) ─────────────────────
function FoxMascot() {
  const bobY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobY, { toValue: -7, duration: 1000, useNativeDriver: true }),
        Animated.timing(bobY, { toValue: 0,  duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: bobY }] }}>
      <View style={fox.outer}>
        {/* Tail */}
        <View style={fox.tail}>
          <View style={fox.tailTip} />
        </View>
        {/* Body */}
        <View style={fox.body}>
          <View style={fox.belly} />
        </View>
        {/* Head */}
        <View style={fox.head}>
          {/* Ears */}
          <View style={[fox.earBase, fox.earLeft]}>
            <View style={[fox.earInner, fox.earInnerLeft]} />
          </View>
          <View style={[fox.earBase, fox.earRight]}>
            <View style={[fox.earInner, fox.earInnerRight]} />
          </View>
          {/* Eyes */}
          <View style={[fox.eye, fox.eyeLeft]}>
            <View style={fox.eyeShine} />
          </View>
          <View style={[fox.eye, fox.eyeRight]}>
            <View style={fox.eyeShine} />
          </View>
          {/* Nose */}
          <View style={fox.nose} />
          {/* Cheeks */}
          <View style={[fox.cheek, fox.cheekLeft]}  />
          <View style={[fox.cheek, fox.cheekRight]} />
        </View>
      </View>
    </Animated.View>
  );
}

const fox = StyleSheet.create({
  outer: { width: 64, height: 64, position: "relative" },
  tail: {
    position: "absolute", bottom: 6, right: -14,
    width: 22, height: 22,
    backgroundColor: "#FF8C42",
    borderRadius: 11, borderBottomLeftRadius: 2,
    transform: [{ rotate: "30deg" }],
  },
  tailTip: {
    position: "absolute", top: 4, right: 4,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "#FFD4A8",
  },
  body: {
    position: "absolute", bottom: 0, left: 8,
    width: 48, height: 38,
    backgroundColor: "#FF8C42",
    borderRadius: 24,
    borderBottomLeftRadius: 22, borderBottomRightRadius: 22,
  },
  belly: {
    position: "absolute", bottom: 2, left: 14,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: "#FFD4A8",
  },
  head: {
    position: "absolute", top: 0, left: 6,
    width: 52, height: 42,
    backgroundColor: "#FF8C42",
    borderTopLeftRadius: 26, borderTopRightRadius: 26,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  earBase: {
    position: "absolute", top: -10,
    width: 0, height: 0,
    borderLeftWidth: 9, borderRightWidth: 9, borderBottomWidth: 20,
    borderLeftColor: "transparent", borderRightColor: "transparent",
    borderBottomColor: "#FF8C42",
  },
  earLeft:  { left: 8 },
  earRight: { right: 8 },
  earInner: {
    position: "absolute", top: 6, left: -5,
    width: 0, height: 0,
    borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 13,
    borderLeftColor: "transparent", borderRightColor: "transparent",
    borderBottomColor: "#FFD4A8",
  },
  earInnerLeft:  {},
  earInnerRight: {},
  eye: {
    position: "absolute", top: 14,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: "#2D2D2D",
  },
  eyeLeft:  { left: 12 },
  eyeRight: { right: 12 },
  eyeShine: {
    position: "absolute", top: 2, right: 2,
    width: 3, height: 3, borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  nose: {
    position: "absolute", top: 24,
    alignSelf: "center", left: 22,
    width: 7, height: 5, borderRadius: 3,
    backgroundColor: "#2D2D2D",
  },
  cheek: {
    position: "absolute", top: 22,
    width: 10, height: 7, borderRadius: 5,
    backgroundColor: "#FF6B6B", opacity: 0.5,
  },
  cheekLeft:  { left: 6 },
  cheekRight: { right: 6 },
});

// ─── Speech Bubble ─────────────────────────────────────────────
function SpeechBubble({ text }: { text: string }) {
  return (
    <View style={bubble.wrap}>
      <View style={bubble.tail} />
      <Text style={bubble.text}>{text}</Text>
    </View>
  );
}
const bubble = StyleSheet.create({
  wrap: {
    backgroundColor: T.white,
    borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8,
    marginLeft: 10, maxWidth: 160,
  },
  tail: {
    position: "absolute", left: -7, top: 14,
    width: 0, height: 0,
    borderTopWidth: 6, borderBottomWidth: 6, borderRightWidth: 7,
    borderTopColor: "transparent", borderBottomColor: "transparent",
    borderRightColor: T.white,
  },
  text: { fontSize: 12, fontWeight: "700", color: "#5B3FCC", lineHeight: 17 },
});

type RootStackParamList = { Auth: undefined; Verify: { email: string }; Home: undefined };
type AuthScreenProps = { navigation: NativeStackNavigationProp<RootStackParamList, "Auth"> };

export default function AuthScreen({ navigation }: AuthScreenProps) {
  const [mode, setMode]                       = useState<"login" | "signup">("login");
  const [name, setName]                       = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass]               = useState(false);
  const [focusedField, setFocusedField]       = useState<string | null>(null);

  const fadeAnim     = useRef(new Animated.Value(0)).current;
  const slideAnim    = useRef(new Animated.Value(30)).current;
  const tabIndicator = useRef(new Animated.Value(0)).current;
  const formSlide    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7,   useNativeDriver: true }),
    ]).start();
  }, []);

  const switchMode = (next: "login" | "signup") => {
    if (next === mode) return;
    setMode(next);
    Animated.parallel([
      Animated.spring(tabIndicator, { toValue: next === "login" ? 0 : 1, friction: 6, useNativeDriver: false }),
      Animated.sequence([
        Animated.timing(formSlide, { toValue: next === "signup" ? -16 : 16, duration: 90, useNativeDriver: true }),
        Animated.spring(formSlide, { toValue: 0, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const handleSubmit = () => {
    if (mode === "signup") navigation.navigate("Verify", { email: email || "user@example.com" });
    else navigation.navigate("Home" as any);
  };

  const tabLeft = tabIndicator.interpolate({ inputRange: [0, 1], outputRange: ["3%", "50%"] });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={T.purple} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Purple Header ── */}
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Scattered stars */}
            <TwinkleStar size={8}  top={14} left={width * 0.72} color={T.yellow}  diamond delay={200} />
            <TwinkleStar size={5}  top={38} left={width * 0.85} color={T.yellow}  diamond delay={700} />
            <TwinkleStar size={6}  top={12} left={28}           color={T.mint}    delay={400} />
            <TwinkleStar size={5}  top={44} left={width - 22}   color={T.mint}    delay={0} />

            {/* Fox + Bubble row */}
            <View style={styles.foxRow}>
              <FoxMascot />
              <SpeechBubble text={mode === "login" ? "Hey there,\nready to learn?" : "Join the fun!\nLet's go! 🎉"} />
            </View>

            <Text style={styles.headerTitle}>
              {mode === "login" ? "Welcome back!" : "Create account"}
            </Text>
            <Text style={styles.headerSub}>
              {mode === "login" ? "Sign in to continue your adventure" : "Start your learning journey today"}
            </Text>

            {/* Wave */}
            <View style={styles.waveWrap}>
              <Svg width={width} height={28} viewBox={`0 0 ${width} 28`} preserveAspectRatio="none">
                <Path d={`M0 28 Q${width * 0.25} 0 ${width * 0.5} 14 Q${width * 0.75} 28 ${width} 8 L${width} 28Z`} fill={T.bg} />
              </Svg>
            </View>
          </Animated.View>

          {/* ── Body ── */}
          <View style={styles.body}>
            {/* Tab switcher — overlaps header */}
            <Animated.View style={[styles.tabShell, { opacity: fadeAnim, transform: [{ translateX: formSlide }] }]}>
              <Animated.View style={[styles.tabIndicator, { left: tabLeft }]} />
              {(["login", "signup"] as const).map((m) => (
                <TouchableOpacity key={m} style={styles.tabBtn} onPress={() => switchMode(m)} activeOpacity={0.8}>
                  <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                    {m === "login" ? "Sign in" : "Sign up"}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>

            {/* Form */}
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: formSlide }] }}>
              <View style={styles.form}>
                {mode === "signup" && (
                  <InputRow
                    fieldKey="name" placeholder="Your Name" icon="🧒"
                    value={name} onChangeText={setName}
                    focused={focusedField} setFocused={setFocusedField}
                    accentColor={T.teal} autoCapitalize="words"
                  />
                )}
                <InputRow
                  fieldKey="email" placeholder="Email address" icon="✉️"
                  value={email} onChangeText={setEmail}
                  focused={focusedField} setFocused={setFocusedField}
                  accentColor={T.purple} keyboardType="email-address"
                />
                <InputRow
                  fieldKey="password" placeholder="Password" icon="🔒"
                  value={password} onChangeText={setPassword}
                  focused={focusedField} setFocused={setFocusedField}
                  accentColor={T.coral} secureText showPass={showPass}
                  onToggleShow={() => setShowPass((v) => !v)}
                />
                {mode === "signup" && (
                  <View style={[
                    styles.inputWrapper,
                    focusedField === "confirm" && { ...styles.inputFocused, borderColor: T.purple },
                    confirmPassword && confirmPassword !== password ? styles.inputError : undefined,
                  ]}>
                    <Text style={styles.inputIcon}>✅</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor={T.textSoft}
                      value={confirmPassword}
                      onChangeText={(v) => setConfirmPassword(v)}
                      onFocus={() => setFocusedField("confirm")}
                      onBlur={() => setFocusedField(null)}
                      secureTextEntry
                    />
                    {confirmPassword.length > 0 && (
                      <Text style={{ fontSize: 16 }}>{confirmPassword === password ? "✅" : "❌"}</Text>
                    )}
                  </View>
                )}

                {mode === "login" && (
                  <TouchableOpacity style={styles.forgotBtn}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.88}>
                  <Text style={styles.submitText}>
                    {mode === "login" ? "Let's go!" : "Start Learning! 🎓"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or sign in with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialRow}>
                  {[
                    { label: "Google", icon: "🌐" },
                    { label: "Apple",  icon: "🍎" },
                  ].map((s) => (
                    <TouchableOpacity key={s.label} style={styles.socialBtn} activeOpacity={0.8}>
                      <Text style={styles.socialIcon}>{s.icon}</Text>
                      <Text style={styles.socialText}>{s.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {mode === "login" ? "New here? " : "Already a buddy? "}
                </Text>
                <TouchableOpacity onPress={() => switchMode(mode === "login" ? "signup" : "login")}>
                  <Text style={styles.footerLink}>
                    {mode === "login" ? "Create account" : "Sign in"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Home indicator */}
              <View style={styles.homeInd} />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Input Row ─────────────────────────────────────────────────
function InputRow({
  fieldKey, placeholder, value, onChangeText, focused, setFocused,
  accentColor, icon, secureText = false, showPass = false, onToggleShow,
  keyboardType = "default", autoCapitalize = "none",
}: any) {
  const isFocused = focused === fieldKey;
  return (
    <View style={[
      styles.inputWrapper,
      isFocused && { ...styles.inputFocused, borderColor: accentColor },
    ]}>
      <Text style={styles.inputIcon}>{icon}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={T.textSoft}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(fieldKey)}
        onBlur={() => setFocused(null)}
        secureTextEntry={secureText && !showPass}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {secureText && (
        <TouchableOpacity onPress={onToggleShow} style={styles.eyeBtn}>
          <Text style={{ fontSize: 18 }}>{showPass ? "🙈" : "👁"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  // Header (purple zone)
  header: {
    backgroundColor: T.purple,
    paddingTop: 24, paddingHorizontal: 20, paddingBottom: 0,
    position: "relative", overflow: "hidden",
  },
  foxRow:    { flexDirection: "row", alignItems: "flex-end", marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: "800", color: T.white, lineHeight: 28 },
  headerSub:   { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4, marginBottom: 16 },
  waveWrap:    { marginTop: 0 },

  // Body (bg zone)
  body: { backgroundColor: T.bg, paddingHorizontal: 16, paddingTop: 0, paddingBottom: 32 },

  // Tab Shell — sits at top of body, visually overlapping wave
  tabShell: {
    flexDirection: "row",
    marginTop: -20,
    marginBottom: 16,
    backgroundColor: T.white,
    borderRadius: 16, padding: 4,
    borderWidth: 1.5, borderColor: T.border,
    position: "relative", zIndex: 10,
    shadowColor: T.purple, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  tabIndicator: {
    position: "absolute", width: "47%", height: "100%",
    backgroundColor: T.purple, borderRadius: 12,
    shadowColor: T.purple, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  tabBtn:        { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 9, zIndex: 1 },
  tabText:       { fontSize: 12, fontWeight: "700", color: T.textSoft },
  tabTextActive: { color: T.white },

  // Form
  form: { gap: 10, marginBottom: 14 },
  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F5F0FF", borderRadius: 14,
    paddingHorizontal: 13, paddingVertical: 2,
    borderWidth: 1.5, borderColor: T.border,
    marginBottom: 0,
  },
  inputFocused: {
    backgroundColor: T.white,
    shadowColor: T.purple, shadowOpacity: 0.15, shadowRadius: 8, elevation: 2,
  },
  inputError: { borderColor: T.coral, backgroundColor: "#FFF0EF" },
  inputIcon:  { fontSize: 16, marginRight: 9 },
  input: { flex: 1, fontSize: 13, color: T.text, fontWeight: "700", paddingVertical: 12 },
  eyeBtn: { padding: 6 },

  forgotBtn:  { alignSelf: "flex-end", marginTop: -2 },
  forgotText: { color: T.purple, fontWeight: "700", fontSize: 11 },

  submitBtn: {
    backgroundColor: T.purple, borderRadius: 14, paddingVertical: 13,
    alignItems: "center", marginTop: 4,
    shadowColor: T.purple, shadowOpacity: 0.4, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 7,
  },
  submitText: { color: T.white, fontWeight: "800", fontSize: 14, letterSpacing: 0.3 },

  divider:     { flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: T.border },
  dividerText: { color: T.textSoft, fontWeight: "700", fontSize: 11 },

  socialRow: { flexDirection: "row", gap: 10 },
  socialBtn: {
    flex: 1, borderRadius: 12, paddingVertical: 9,
    alignItems: "center", borderWidth: 1.5, borderColor: T.border,
    flexDirection: "row", justifyContent: "center", gap: 6,
    backgroundColor: T.white,
  },
  socialIcon: { fontSize: 16 },
  socialText: { fontSize: 12, fontWeight: "700", color: T.textMid },

  footer:     { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 8 },
  footerText: { fontSize: 12, color: T.textSoft, fontWeight: "600" },
  footerLink: { fontSize: 12, color: T.purple,   fontWeight: "700" },

  homeInd: {
    width: 80, height: 4, borderRadius: 2,
    backgroundColor: "#D6CDFF", alignSelf: "center", marginTop: 16,
  },
});
