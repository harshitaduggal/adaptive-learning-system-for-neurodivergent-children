import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import Svg, { Circle, Ellipse, Path, Polygon, RadialGradient, Stop, Defs } from "react-native-svg";
import * as ScreenOrientation from "expo-screen-orientation";

const { width } = Dimensions.get("window");

// ─── Night-Sky Design Tokens ────────────────────────────────────
const T = {
  bg:          "#1A0A4C",
  bgMid:       "#2D1275",
  orb1:        "#5B21B6",
  orb2:        "#4C1D95",
  purple:      "#7C3AED",
  purpleLight: "#A78BFA",
  card:        "rgba(255,255,255,0.08)",
  cardBorder:  "rgba(196,181,253,0.3)",
  white:       "#FFFFFF",
  textHigh:    "#F3E8FF",
  textMid:     "#DDD6FE",
  textSoft:    "#A78BFA",
  textDim:     "rgba(196,181,253,0.6)",
  error:       "#F87171",
  success:     "#34D399",
  inputBg:     "rgba(255,255,255,0.07)",
  inputBorder: "rgba(196,181,253,0.25)",
};

// ─── Validation helpers ─────────────────────────────────────────
const validators = {
  name:     (v: string) => v.trim().length >= 2 ? null : "Name must be at least 2 characters",
  email:    (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Enter a valid email address",
  password: (v: string) => {
    if (v.length < 8)     return "At least 8 characters required";
    if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter";
    if (!/[0-9]/.test(v)) return "Include at least one number";
    return null;
  },
  confirm: (v: string, pw: string) => v === pw ? null : "Passwords don't match",
};

type FieldErrors = { name?: string | null; email?: string | null; password?: string | null; confirm?: string | null };

// ─── 4-point sparkle decoration ────────────────────────────────
function Sparkle({ size, top, left, delay = 0 }: { size: number; top: number; left: number; delay?: number }) {
  const anim = useRef(new Animated.Value(0.2)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: 0.85, duration: 1300, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.15, duration: 1300, useNativeDriver: true }),
      ])).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);
  const h = size * 0.25;
  const s = size;
  return (
    <Animated.View style={{ position: "absolute", top, left, opacity: anim }}>
      <Svg width={s * 2} height={s * 2} viewBox={`0 0 ${s * 2} ${s * 2}`}>
        <Path
          d={`M${s} 0 L${s + h} ${s - h} L${s * 2} ${s} L${s + h} ${s + h} L${s} ${s * 2} L${s - h} ${s + h} L0 ${s} L${s - h} ${s - h} Z`}
          fill="#FFFFFF"
        />
      </Svg>
    </Animated.View>
  );
}

// ─── Background with orbs, crescent, sparkles ───────────────────
// Wrapped in React.memo so it NEVER re-renders when parent state changes (typing)
const NightBackground = React.memo(function NightBackground() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={{ position: "absolute", width: 340, height: 340, borderRadius: 170, backgroundColor: T.orb1, top: "-10%", left: "-20%", opacity: 0.45 }} />
      <View style={{ position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: T.orb2, bottom: "-15%", right: "-15%", opacity: 0.38 }} />
      <View style={{ position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: "#7C3AED", top: "42%", left: "25%", opacity: 0.14 }} />
      {/* crescent */}
      <View style={{ position: "absolute", top: "4%", left: "58%", opacity: 0.32 }}>
        <View style={{ width: 44, height: 44, overflow: "hidden" }}>
          <View style={{ position: "absolute", width: 44, height: 44, borderRadius: 22, backgroundColor: "#C4B5FD" }} />
          <View style={{ position: "absolute", width: 36, height: 36, borderRadius: 18, backgroundColor: "#1E0A4C", top: -2.6, left: 9.7 }} />
        </View>
      </View>
      <Sparkle size={6} top={55}  left={22}           delay={0}   />
      <Sparkle size={8} top={32}  left={width * 0.78} delay={300} />
      <Sparkle size={5} top={115} left={width * 0.62} delay={600} />
      <Sparkle size={7} top={80}  left={width - 52}   delay={150} />
      <Sparkle size={4} top={170} left={14}            delay={900} />
    </View>
  );
});

// ─── Star Mascot ───────────────────────────────────────────────
const StarMascot = React.memo(function StarMascot() {
  const bobY     = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(bobY, { toValue: -8, duration: 1100, useNativeDriver: true }),
      Animated.timing(bobY, { toValue: 0,  duration: 1100, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1,   duration: 900, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
    ])).start();
  }, []);
  const starPath = (() => {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const rad = i % 2 === 0 ? 30 : 13;
      pts.push(`${36 + rad * Math.cos(angle)},${36 + rad * Math.sin(angle)}`);
    }
    return pts.join(" ");
  })();
  return (
    <Animated.View style={{ transform: [{ translateY: bobY }] }}>
      <View style={{ width: 72, height: 72, alignItems: "center", justifyContent: "center" }}>
        <Animated.View style={{
          position: "absolute", width: 72, height: 72, borderRadius: 36, backgroundColor: "#FFD740",
          opacity: glowAnim, transform: [{ scale: glowAnim.interpolate({ inputRange: [0.4, 1], outputRange: [1, 1.4] }) }],
        }} />
        <Svg width={72} height={72} viewBox="0 0 72 72">
          <Defs>
            <RadialGradient id="sG" cx="42%" cy="30%" rx="60%" ry="60%">
              <Stop offset="0%"   stopColor="#FFE877" />
              <Stop offset="55%"  stopColor="#FFD166" />
              <Stop offset="100%" stopColor="#E8A800" />
            </RadialGradient>
          </Defs>
          <Polygon points={starPath} fill="#B87D00" opacity={0.18} transform="translate(1.5,3)" />
          <Polygon points={starPath} fill="url(#sG)" />
          <Ellipse cx={28} cy={24} rx={7} ry={4} fill="rgba(255,255,255,0.5)" transform="rotate(-25,28,24)" />
          <Ellipse cx={29} cy={35} rx={3.2} ry={3.8} fill="#2D1B69" />
          <Ellipse cx={43} cy={35} rx={3.2} ry={3.8} fill="#2D1B69" />
          <Circle cx={30.3} cy={33.5} r={1.1} fill="#fff" />
          <Circle cx={44.3} cy={33.5} r={1.1} fill="#fff" />
          <Path d="M29 42 Q36 48 43 42" stroke="#2D1B69" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Ellipse cx={23} cy={40} rx={4} ry={2.8} fill="#FF9EC4" opacity={0.5} />
          <Ellipse cx={49} cy={40} rx={4} ry={2.8} fill="#FF9EC4" opacity={0.5} />
        </Svg>
      </View>
    </Animated.View>
  );
});

// ─── Speech Bubble ─────────────────────────────────────────────
function SpeechBubble({ text }: { text: string }) {
  return (
    <View style={bub.wrap}>
      <View style={bub.tail} />
      <Text style={bub.text}>{text}</Text>
    </View>
  );
}
const bub = StyleSheet.create({
  wrap: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8, marginLeft: 10, maxWidth: 160, borderWidth: 1, borderColor: "rgba(196,181,253,0.3)" },
  tail: { position: "absolute", left: -7, top: 14, width: 0, height: 0, borderTopWidth: 6, borderBottomWidth: 6, borderRightWidth: 7, borderTopColor: "transparent", borderBottomColor: "transparent", borderRightColor: "rgba(255,255,255,0.1)" },
  text: { fontSize: 12, fontWeight: "700", color: "#F3E8FF", lineHeight: 17 },
});

// ─── Field Error ────────────────────────────────────────────────
function FieldError({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return <Text style={{ fontSize: 11, color: T.error, fontWeight: "600", marginTop: -4, marginLeft: 4, marginBottom: 2 }}>{message}</Text>;
}

// ─── Password Strength ──────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
  const score = checks.filter(Boolean).length;
  const colors = [T.error, "#FCD34D", "#34D399", T.success];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  return (
    <View style={{ marginTop: -2, marginBottom: 2 }}>
      <View style={{ flexDirection: "row", gap: 4, marginBottom: 4 }}>
        {checks.map((_, i) => <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < score ? colors[score - 1] : "rgba(196,181,253,0.2)" }} />)}
      </View>
      <Text style={{ fontSize: 10, color: score > 0 ? colors[score - 1] : T.textSoft, fontWeight: "700" }}>{labels[score - 1] ?? "Weak"}</Text>
    </View>
  );
}

// ─── InputRow ──────────────────────────────────────────────────
const InputRow = React.memo(function InputRow({ fieldKey, placeholder, value, onChangeText, focused, setFocused, icon, secureText = false, showPass = false, onToggleShow, keyboardType = "default", autoCapitalize = "none", hasError = false }: {
  fieldKey: string; placeholder: string; value: string; onChangeText: (v: string) => void;
  focused: string | null; setFocused: (v: string | null) => void; icon: string;
  secureText?: boolean; showPass?: boolean; onToggleShow?: () => void;
  keyboardType?: any; autoCapitalize?: any; hasError?: boolean;
}) {
  const isFocused = focused === fieldKey;
  return (
    <View style={[st.inputWrapper, isFocused && st.inputFocused, hasError && st.inputError]}>
      <Text style={st.inputIcon} importantForAccessibility="no">{icon}</Text>
      <TextInput style={st.input} placeholder={placeholder} placeholderTextColor={T.textSoft} value={value}
        onChangeText={onChangeText} onFocus={() => setFocused(fieldKey)} onBlur={() => setFocused(null)}
        secureTextEntry={secureText && !showPass} keyboardType={keyboardType} autoCapitalize={autoCapitalize} autoCorrect={false} autoComplete="off" />
      {secureText && (
        <TouchableOpacity onPress={onToggleShow} style={st.eyeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={{ fontSize: 12, color: T.textSoft, fontWeight: "600" }}>{showPass ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

// ─── Pure validation (no setState) — always reads latest values ─
function computeErrors(
  mode: "login" | "signup",
  name: string, email: string, password: string, confirmPassword: string
): FieldErrors {
  const fields: FieldErrors = {};
  if (mode === "signup") fields.name = validators.name(name);
  fields.email    = validators.email(email);
  fields.password = validators.password(password);
  if (mode === "signup") fields.confirm = validators.confirm(confirmPassword, password);
  return fields;
}

// ─── Main Screen ───────────────────────────────────────────────
export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ── Use a ref so showError reads the latest value synchronously
  //    without waiting for a re-render from setState.
  const submitAttemptedRef = useRef(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Keep latest field values in refs so validation closures never go stale
  const nameRef            = useRef(name);
  const emailRef           = useRef(email);
  const passwordRef        = useRef(password);
  const confirmPasswordRef = useRef(confirmPassword);
  const modeRef            = useRef(mode);
  useEffect(() => { nameRef.current            = name;            }, [name]);
  useEffect(() => { emailRef.current           = email;           }, [email]);
  useEffect(() => { passwordRef.current        = password;        }, [password]);
  useEffect(() => { confirmPasswordRef.current = confirmPassword; }, [confirmPassword]);
  useEffect(() => { modeRef.current            = mode;            }, [mode]);

  const fadeAnim     = useRef(new Animated.Value(0)).current;
  const slideAnim    = useRef(new Animated.Value(30)).current;
  const tabIndicator = useRef(new Animated.Value(0)).current;
  const formSlide    = useRef(new Animated.Value(0)).current;
  const shakeAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    return () => { ScreenOrientation.unlockAsync(); };
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7,   useNativeDriver: true }),
    ]).start();
  }, []);

  // Validate a single field using ref values so the closure is never stale.
  const validateField = (field: string, value: string) => {
    let error: string | null = null;
    if (field === "name")     error = validators.name(value);
    if (field === "email")    error = validators.email(value);
    if (field === "password") error = validators.password(value);
    // Always read confirmPassword / password from refs to avoid stale closure
    if (field === "confirm")  error = validators.confirm(value, passwordRef.current);
    if (field === "password" && touchedRef.current["confirm"]) {
      // Re-validate confirm whenever password changes
      const confirmErr = validators.confirm(confirmPasswordRef.current, value);
      setErrors(prev => ({ ...prev, password: error, confirm: confirmErr }));
      return error;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  // Keep touched in a ref too so validateField can read it synchronously
  const touchedRef = useRef<Record<string, boolean>>({});
  const markTouched = (field: string) => {
    touchedRef.current = { ...touchedRef.current, [field]: true };
    setTouched({ ...touchedRef.current });
  };

  const shake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const switchMode = (next: "login" | "signup") => {
    if (next === mode) return;
    setMode(next);
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    setShowPass(false); setShowConfirm(false);
    setErrors({}); 
    touchedRef.current = {};
    setTouched({});
    submitAttemptedRef.current = false;
    setSubmitAttempted(false);
    Animated.parallel([
      Animated.spring(tabIndicator, { toValue: next === "login" ? 0 : 1, friction: 6, useNativeDriver: false }),
      Animated.sequence([
        Animated.timing(formSlide, { toValue: next === "signup" ? -20 : 20, duration: 90, useNativeDriver: true }),
        Animated.spring(formSlide, { toValue: 0, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const handleSubmit = () => {
    // 1. Compute errors synchronously from latest ref values
    const currentMode = modeRef.current;
    const errs = computeErrors(
      currentMode,
      nameRef.current, emailRef.current, passwordRef.current, confirmPasswordRef.current
    );

    // 2. Mark all fields touched synchronously via ref
    const allTouched: Record<string, boolean> = { email: true, password: true };
    if (currentMode === "signup") { allTouched.name = true; allTouched.confirm = true; }
    touchedRef.current = allTouched;

    // 3. Flip the ref flag BEFORE setState so showError sees it in the same render
    submitAttemptedRef.current = true;

    // 4. Batch the state updates together
    setErrors(errs);
    setTouched({ ...allTouched });
    setSubmitAttempted(true);

    // 5. Check validity from the synchronously-computed errors object
    const isValid = Object.values(errs).every(e => e === null);
    if (!isValid) { shake(); return; }

    // 6. Navigate
    if (currentMode === "signup") router.replace({ pathname: "/questionnaire", params: { email: emailRef.current.trim() } });
    else router.replace("/parenthome");
  };

  // showError reads the ref so it's always current even before re-render
  const showError = (field: string): string | null | undefined => {
    if (!touched[field] && !submitAttemptedRef.current) return null;
    return errors[field as keyof FieldErrors];
  };

  const tabLeft    = tabIndicator.interpolate({ inputRange: [0, 1], outputRange: ["3%", "50%"] });
  const isFormDirty = email.length > 0 || password.length > 0;

  // ── Stable callbacks so InputRow memoization is effective ──────
  const onChangeName = useCallback((v: string) => {
    setName(v); nameRef.current = v;
    if (touchedRef.current.name) validateField("name", v);
  }, []);
  const onChangeEmail = useCallback((v: string) => {
    setEmail(v); emailRef.current = v;
    if (touchedRef.current.email) validateField("email", v);
  }, []);
  const onChangePassword = useCallback((v: string) => {
    setPassword(v); passwordRef.current = v;
    if (touchedRef.current.password) validateField("password", v);
  }, []);
  const onChangeConfirm = useCallback((v: string) => {
    setConfirmPassword(v); confirmPasswordRef.current = v;
    if (touchedRef.current.confirm) validateField("confirm", v);
  }, []);

  const setFocusedName = useCallback((f: string | null) => {
    setFocusedField(f);
    if (!f) { markTouched("name"); validateField("name", nameRef.current); }
  }, []);
  const setFocusedEmail = useCallback((f: string | null) => {
    setFocusedField(f);
    if (!f) { markTouched("email"); validateField("email", emailRef.current); }
  }, []);
  const setFocusedPassword = useCallback((f: string | null) => {
    setFocusedField(f);
    if (!f) { markTouched("password"); validateField("password", passwordRef.current); }
  }, []);
  const toggleShowPass    = useCallback(() => setShowPass(v => !v), []);
  const toggleShowConfirm = useCallback(() => setShowConfirm(v => !v), []);

  return (
    <SafeAreaView style={st.safe}>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />
      <NightBackground />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Header */}
          <Animated.View style={[st.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={st.mascotRow}>
              <StarMascot />
              <SpeechBubble text={mode === "login" ? "Hey there,\nready to learn?" : "Join the fun!\nLet's go!"} />
            </View>
            <Text style={st.headerTitle}>{mode === "login" ? "Welcome back!" : "Create account"}</Text>
            <Text style={st.headerSub}>{mode === "login" ? "Sign in to continue your adventure" : "Start your learning journey today"}</Text>
          </Animated.View>

          {/* Body */}
          <View style={st.body}>
            {/* Tab */}
            <Animated.View style={[st.tabShell, { opacity: fadeAnim }]}>
              <Animated.View style={[st.tabIndicator, { left: tabLeft }]} />
              {(["login", "signup"] as const).map((m) => (
                <TouchableOpacity key={m} style={st.tabBtn} onPress={() => switchMode(m)} activeOpacity={0.8}>
                  <Text style={[st.tabText, mode === m && st.tabTextActive]}>{m === "login" ? "Sign in" : "Sign up"}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>

            {/* Form — fixed: replaced bare fragment wrappers with View wrappers */}
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: formSlide }, { translateX: shakeAnim }] }}>
              <View style={st.form}>

                {mode === "signup" && (
                  <View>
                    <InputRow fieldKey="name" placeholder="Your name" icon="@N" value={name}
                      onChangeText={onChangeName}
                      focused={focusedField}
                      setFocused={setFocusedName}
                      autoCapitalize="words" hasError={!!showError("name")} />
                    <FieldError message={showError("name")} />
                  </View>
                )}

                <View>
                  <InputRow fieldKey="email" placeholder="Email address" icon="@" value={email}
                    onChangeText={onChangeEmail}
                    focused={focusedField}
                    setFocused={setFocusedEmail}
                    keyboardType="email-address" hasError={!!showError("email")} />
                  <FieldError message={showError("email")} />
                </View>

                <View>
                  <InputRow fieldKey="password" placeholder="Password" icon="**" value={password}
                    onChangeText={onChangePassword}
                    focused={focusedField}
                    setFocused={setFocusedPassword}
                    secureText showPass={showPass} onToggleShow={toggleShowPass} hasError={!!showError("password")} />
                  {mode === "signup" && <PasswordStrength password={password} />}
                  <FieldError message={showError("password")} />
                </View>

                {mode === "signup" && (
                  <View>
                    <View style={[
                      st.inputWrapper,
                      focusedField === "confirm" && st.inputFocused,
                      !!showError("confirm") && st.inputError,
                      confirmPassword.length > 0 && confirmPassword === password && { borderColor: T.success },
                    ]}>
                      <Text style={st.inputIcon}>**</Text>
                      <TextInput
                        style={st.input}
                        placeholder="Confirm password"
                        placeholderTextColor={T.textSoft}
                        value={confirmPassword}
                        onChangeText={onChangeConfirm}
                        onFocus={() => setFocusedField("confirm")}
                        onBlur={() => {
                          setFocusedField(null);
                          markTouched("confirm");
                          validateField("confirm", confirmPasswordRef.current);
                        }}
                        secureTextEntry={!showConfirm}
                      />
                      {confirmPassword.length > 0 && (
                        <Text style={{ fontSize: 11, marginLeft: 4, color: confirmPassword === password ? T.success : T.error, fontWeight: "700" }}>
                          {confirmPassword === password ? "OK" : "X"}
                        </Text>
                      )}
                      <TouchableOpacity onPress={toggleShowConfirm} style={st.eyeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Text style={{ fontSize: 12, color: T.textSoft, fontWeight: "600" }}>{showConfirm ? "Hide" : "Show"}</Text>
                      </TouchableOpacity>
                    </View>
                    <FieldError message={showError("confirm")} />
                  </View>
                )}

                {mode === "login" && (
                  <TouchableOpacity style={st.forgotBtn} activeOpacity={0.7}>
                    <Text style={st.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={[st.submitBtn, !isFormDirty && { opacity: 0.7 }]} onPress={handleSubmit} activeOpacity={0.85}>
                  <Text style={st.submitText}>{mode === "login" ? "Sign In" : "Create Account"}</Text>
                </TouchableOpacity>

                <View style={st.divider}>
                  <View style={st.dividerLine} />
                  <Text style={st.dividerText}>or continue with</Text>
                  <View style={st.dividerLine} />
                </View>

                <View style={st.socialRow}>
                  {[{ label: "Google", icon: "G" }, { label: "Apple", icon: "A" }].map((s) => (
                    <TouchableOpacity key={s.label} style={st.socialBtn} activeOpacity={0.8}>
                      <Text style={st.socialIcon}>{s.icon}</Text>
                      <Text style={st.socialText}>{s.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

              </View>

              <View style={st.footer}>
                <Text style={st.footerText}>{mode === "login" ? "New here? " : "Already a buddy? "}</Text>
                <TouchableOpacity onPress={() => switchMode(mode === "login" ? "signup" : "login")} activeOpacity={0.7}>
                  <Text style={st.footerLink}>{mode === "login" ? "Create account" : "Sign in"}</Text>
                </TouchableOpacity>
              </View>
              <View style={st.homeInd} />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const st = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: T.bg },
  header:      { paddingTop: 36, paddingHorizontal: 22, paddingBottom: 4 },
  mascotRow:   { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: T.textHigh, lineHeight: 30 },
  headerSub:   { fontSize: 13, color: T.textDim, marginTop: 4, marginBottom: 4 },
  body:        { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },

  tabShell: {
    flexDirection: "row", marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 4,
    borderWidth: 1, borderColor: T.cardBorder, position: "relative", zIndex: 10,
  },
  tabIndicator: { position: "absolute", width: "47%", height: "100%", backgroundColor: T.purple, borderRadius: 12, shadowColor: T.purple, shadowOpacity: 0.55, shadowRadius: 8, elevation: 4 },
  tabBtn:        { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 11, zIndex: 1 },
  tabText:       { fontSize: 13, fontWeight: "700", color: T.textDim },
  tabTextActive: { color: T.textHigh },

  form: { gap: 10, marginBottom: 14 },

  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: T.inputBg, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 2, borderWidth: 1.5, borderColor: "rgba(196,181,253,0.25)" },
  inputFocused: { borderColor: T.purpleLight, backgroundColor: "rgba(167,139,250,0.1)" },
  inputError:   { borderColor: T.error, backgroundColor: "rgba(248,113,113,0.08)" },
  inputIcon:    { fontSize: 12, marginRight: 9, color: T.textSoft, fontWeight: "700", minWidth: 18 },
  input:        { flex: 1, fontSize: 14, color: T.textHigh, fontWeight: "500", paddingVertical: 13 },
  eyeBtn:       { padding: 6 },

  forgotBtn:  { alignSelf: "flex-end", marginTop: -2 },
  forgotText: { color: T.purpleLight, fontWeight: "700", fontSize: 12 },

  submitBtn:  { backgroundColor: T.purple, borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 4, shadowColor: T.purple, shadowOpacity: 0.55, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 8 },
  submitText: { color: T.white, fontWeight: "800", fontSize: 15, letterSpacing: 0.4 },

  divider:     { flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(196,181,253,0.18)" },
  dividerText: { color: T.textSoft, fontWeight: "600", fontSize: 11 },

  socialRow: { flexDirection: "row", gap: 10 },
  socialBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: T.cardBorder, flexDirection: "row", justifyContent: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.06)" },
  socialIcon: { fontSize: 14, color: T.textHigh, fontWeight: "800" },
  socialText: { fontSize: 13, fontWeight: "700", color: T.textMid },

  footer:     { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 18 },
  footerText: { fontSize: 13, color: T.textDim, fontWeight: "500" },
  footerLink: { fontSize: 13, color: T.purpleLight, fontWeight: "800" },

  homeInd: { width: 80, height: 4, borderRadius: 2, backgroundColor: "rgba(196,181,253,0.22)", alignSelf: "center", marginTop: 16 },
});
