import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
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
  coral:       "#FF6B6B",
  mint:        "#A8EDEA",
  teal:        "#06D6A0",
  orange:      "#FF8C42",
  bg:          "#F5F0FF",
  white:       "#FFFFFF",
  text:        "#3D2FA8",
  textMid:     "#5A5A8A",
  textSoft:    "#B0A8D8",
  border:      "#EAE4FF",
};

const CODE_LENGTH = 4;

// ─── Floating Confetti Piece ───────────────────────────────────
function ConfettiPiece({
  color, size = 7, top, left, delay = 0, circle = false,
}: {
  color: string; size?: number; top: number; left: number; delay?: number; circle?: boolean;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate     = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, { toValue: -12, duration: 1500, useNativeDriver: true }),
          Animated.timing(rotate,     { toValue: 1,   duration: 1500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0,   duration: 1500, useNativeDriver: true }),
          Animated.timing(rotate,     { toValue: 0,   duration: 1500, useNativeDriver: true }),
        ]),
      ])
    );
    setTimeout(() => anim.start(), delay);
    return () => anim.stop();
  }, []);
  const rotDeg = rotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  return (
    <Animated.View style={{
      position: "absolute", top, left,
      width: size, height: size,
      borderRadius: circle ? size / 2 : 2,
      backgroundColor: color,
      transform: [{ translateY }, { rotate: rotDeg }],
    }} />
  );
}

// ─── Envelope Mascot (built with Views) ───────────────────────
function EnvelopeMascot() {
  const bobY   = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bobY,   { toValue: -8,   duration: 1000, useNativeDriver: true }),
          Animated.timing(rotate, { toValue: 1,    duration: 1000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(bobY,   { toValue: 0,   duration: 1000, useNativeDriver: true }),
          Animated.timing(rotate, { toValue: -1,  duration: 1000, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);
  const rotDeg = rotate.interpolate({ inputRange: [-1, 1], outputRange: ["-2deg", "2deg"] });

  return (
    <View style={{ position: "relative" }}>
      <Animated.View style={{ transform: [{ translateY: bobY }, { rotate: rotDeg }] }}>
        {/* Envelope body */}
        <View style={env.body}>
          {/* Flap */}
          <View style={env.flapWrap}>
            <View style={env.flap} />
          </View>
          {/* Heart */}
          <View style={env.heartWrap}>
            <View style={[env.heartHalf, env.heartLeft]}  />
            <View style={[env.heartHalf, env.heartRight]} />
            <View style={env.heartBottom} />
          </View>
          {/* Eyes / face */}
          <View style={env.faceRow}>
            <View style={env.eye} />
            <View style={env.eye} />
          </View>
        </View>
      </Animated.View>

      {/* Badge */}
      <View style={env.badge}>
        <Text style={env.badgeStar}>✦</Text>
      </View>
    </View>
  );
}

const ENV_W = 70, ENV_H = 50;
const env = StyleSheet.create({
  body: {
    width: ENV_W, height: ENV_H,
    backgroundColor: T.yellow,
    borderRadius: 10, overflow: "hidden",
    position: "relative",
  },
  flapWrap: { position: "absolute", top: 0, left: 0, width: ENV_W, height: 30, overflow: "hidden" },
  flap: {
    width: 0, height: 0,
    borderLeftWidth: ENV_W / 2, borderRightWidth: ENV_W / 2, borderTopWidth: 26,
    borderLeftColor: "transparent", borderRightColor: "transparent",
    borderTopColor: "#FFB703",
    position: "absolute", top: 0, left: 0,
  },
  heartWrap: {
    position: "absolute", top: 15, left: ENV_W / 2 - 7,
    width: 14, height: 14,
  },
  heartHalf: {
    position: "absolute", top: 0,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: T.coral,
  },
  heartLeft:   { left: 0 },
  heartRight:  { right: 0 },
  heartBottom: {
    position: "absolute", bottom: 0, left: 0,
    width: 0, height: 0,
    borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 9,
    borderLeftColor: "transparent", borderRightColor: "transparent",
    borderTopColor: T.coral,
  },
  faceRow: {
    position: "absolute", bottom: 8, left: ENV_W / 2 - 14,
    flexDirection: "row", gap: 14,
  },
  eye: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#2D2D2D" },
  badge: {
    position: "absolute", top: -6, right: -8,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: T.teal,
    borderWidth: 2.5, borderColor: T.purple,
    alignItems: "center", justifyContent: "center",
  },
  badgeStar: { fontSize: 10, color: T.white, fontWeight: "900" },
});

export default function VerifyScreen() {
  const router = useRouter();
  const [code, setCode]           = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [verified, setVerified]   = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError]         = useState(false);

  const inputRefs    = useRef<(TextInput | null)[]>([]);
  const cardAnim     = useRef(new Animated.Value(0)).current;
  const headerAnim   = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const shakeAnim    = useRef(new Animated.Value(0)).current;

  const cellAnim0 = useRef(new Animated.Value(0)).current;
  const cellAnim1 = useRef(new Animated.Value(0)).current;
  const cellAnim2 = useRef(new Animated.Value(0)).current;
  const cellAnim3 = useRef(new Animated.Value(0)).current;
  const cellAnims = [cellAnim0, cellAnim1, cellAnim2, cellAnim3];

  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnim, { toValue: 1, friction: 7, useNativeDriver: true }),
      Animated.spring(cardAnim,   { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();
    Animated.stagger(80, cellAnims.map((a) =>
      Animated.spring(a, { toValue: 1, friction: 6, useNativeDriver: true })
    )).start();
  }, []);

  const handleInput = (val: string, idx: number) => {
    if (val.length > 1) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);
    setError(false);
    if (val && idx < CODE_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
    if (val && idx === CODE_LENGTH - 1) setTimeout(() => verify([...next].join("")), 200);
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
      const next = [...code]; next[idx - 1] = "";
      setCode(next);
    }
  };

  const verify = (full?: string) => {
    const entered = full ?? code.join("");
    if (entered.length < CODE_LENGTH) return;
    if (entered === "1234") {
      setVerified(true);
      Animated.spring(successScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
      setTimeout(() => router.replace("/parenthome"), 2000);
    } else {
      setError(true);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 14,  duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -14, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8,   duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
      ]).start();
      setCode(Array(CODE_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const resend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setCode(Array(CODE_LENGTH).fill(""));
    setError(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const CELL_SIZE = Math.min((width - 32 - 28 - 48 - 24) / CODE_LENGTH, 58);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={T.purple} />

      {/* ── Purple Header ── */}
      <Animated.View style={[styles.header, {
        opacity: headerAnim,
        transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
      }]}>
        {/* Confetti */}
        <ConfettiPiece color={T.yellow}  top={18} left={18}           delay={200} />
        <ConfettiPiece color={T.coral}   top={42} left={42}           delay={800} circle />
        <ConfettiPiece color={T.teal}    top={24} left={width - 44}   delay={400} />
        <ConfettiPiece color={T.mint}    top={14} left={width - 68}   delay={1100} circle />
        <ConfettiPiece color={T.orange}  top={8}  left={width * 0.38} delay={600} size={5} />

        {/* Envelope mascot — centered */}
        <View style={styles.mascotCenter}>
          <EnvelopeMascot />
        </View>

        <Text style={styles.headerTitle}>Check your inbox!</Text>
        <Text style={styles.headerSub}>
          We sent a code to{"\n"}
          <Text style={styles.headerEm}>your@email.com</Text>
        </Text>

        {/* Wave */}
        <View style={{ marginTop: 16 }}>
          <Svg width={width} height={28} viewBox={`0 0 ${width} 28`} preserveAspectRatio="none">
            <Path
              d={`M0 28 Q${width * 0.25} 0 ${width * 0.5} 16 Q${width * 0.75} 28 ${width} 6 L${width} 28Z`}
              fill={T.bg}
            />
          </Svg>
        </View>
      </Animated.View>

      {/* ── OTP Card ── */}
      <View style={styles.body}>
        <Animated.View style={[styles.otpCard, {
          opacity: cardAnim,
          transform: [
            { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
            { translateX: shakeAnim },
          ],
        }]}>
          {verified ? (
            /* ── Success ── */
            <Animated.View style={[styles.successWrap, { transform: [{ scale: successScale }] }]}>
              <View style={styles.successCircle}>
                <Text style={styles.successEmoji}>🎉</Text>
              </View>
              <Text style={styles.successTitle}>Youre in!</Text>
              <Text style={styles.successSub}>Lets start learning! 🚀</Text>
              <View style={styles.confettiRow}>
                {["🌟", "🎈", "✨", "🎊", "⭐"].map((e, i) => (
                  <Text key={i} style={styles.confettiEmoji}>{e}</Text>
                ))}
              </View>
            </Animated.View>
          ) : (
            <>
              <Text style={styles.otpHint}>Enter your 4-digit secret code</Text>

              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>😬 Oops! Thats not right. Try again!</Text>
                </View>
              )}

              {/* OTP Cells */}
              <View style={styles.cellsRow}>
                {code.map((digit, idx) => {
                  const isCurrent = !digit && code.slice(0, idx).every(Boolean);
                  return (
                    <Animated.View key={idx} style={{
                      opacity: cellAnims[idx],
                      transform: [{
                        scale: cellAnims[idx].interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
                      }],
                    }}>
                      <View style={[
                        styles.cell,
                        { width: CELL_SIZE, height: CELL_SIZE + 4 },
                        digit     ? styles.cellFilled  : {},
                        isCurrent ? styles.cellCurrent : {},
                        error     ? styles.cellError   : {},
                      ]}>
                        <TextInput
                          ref={(r) => { inputRefs.current[idx] = r; }}
                          style={[styles.cellInput, { width: CELL_SIZE, height: CELL_SIZE + 4, fontSize: 24 }]}
                          maxLength={1}
                          keyboardType="numeric"
                          value={digit}
                          onChangeText={(v) => handleInput(v, idx)}
                          onKeyPress={(e) => handleKeyPress(e, idx)}
                          selectTextOnFocus
                        />
                      </View>
                    </Animated.View>
                  );
                })}
              </View>

              {/* Verify button */}
              <TouchableOpacity
                style={[styles.verifyBtn, code.join("").length < CODE_LENGTH && styles.verifyBtnDisabled]}
                onPress={() => verify()}
                activeOpacity={0.88}
                disabled={code.join("").length < CODE_LENGTH}
              >
                <Text style={styles.verifyText}>Verify my code</Text>
              </TouchableOpacity>

              {/* Resend */}
              <View style={styles.resendRow}>
                <Text style={styles.resendLabel}>Didnt get it? </Text>
                <TouchableOpacity onPress={resend} disabled={resendTimer > 0}>
                  <Text style={[styles.resendLink, resendTimer > 0 && styles.resendDisabled]}>
                    Resend
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Timer pill */}
              {resendTimer > 0 && (
                <View style={styles.timerPill}>
                  <Text style={styles.timerIcon}>🕐</Text>
                  <Text style={styles.timerText}>Resend in {resendTimer} seconds</Text>
                </View>
              )}

              {/* Progress dots */}
              <View style={styles.dotsRow}>
                <View style={styles.dot} />
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
              </View>
            </>
          )}
        </Animated.View>

        {/* Home indicator */}
        <View style={styles.homeInd} />
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },

  // Header
  header: {
    backgroundColor: T.purple,
    paddingTop: 24, paddingHorizontal: 20, paddingBottom: 0,
    alignItems: "center",
  },
  mascotCenter: { marginBottom: 10 },
  headerTitle:  { fontSize: 21, fontWeight: "800", color: T.white, textAlign: "center" },
  headerSub:    { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4, textAlign: "center", lineHeight: 18 },
  headerEm:     { color: T.yellow, fontWeight: "700" },

  // Body
  body: { flex: 1, backgroundColor: T.bg, paddingHorizontal: 14, paddingTop: 0, paddingBottom: 20 },

  // OTP Card
  otpCard: {
    backgroundColor: T.white, borderRadius: 20,
    padding: 20, marginTop: -22,
    borderWidth: 1.5, borderColor: T.border,
    shadowColor: T.purple, shadowOpacity: 0.1, shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
    alignItems: "center",
  },
  otpHint: { fontSize: 12, color: T.textSoft, fontWeight: "600", marginBottom: 16, textAlign: "center" },

  // Error
  errorBanner: {
    backgroundColor: "#FFF0EF", borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 7,
    marginBottom: 10, borderWidth: 1.5, borderColor: "#FFBCB8",
  },
  errorText: { fontSize: 13, color: "#C0392B", fontWeight: "800", textAlign: "center" },

  // Cells
  cellsRow: { flexDirection: "row", gap: 8, marginBottom: 18 },
  cell: {
    borderRadius: 14, borderWidth: 2, borderColor: T.border,
    backgroundColor: "#F5F0FF",
    alignItems: "center", justifyContent: "center",
  },
  cellFilled:  { borderColor: T.purple, backgroundColor: "#EEEDFE" },
  cellCurrent: {
    borderColor: T.purple, backgroundColor: T.white,
    shadowColor: T.purple, shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  cellError:   { borderColor: T.coral, backgroundColor: "#FFF0EF" },
  cellInput: {
    textAlign: "center", fontWeight: "800",
    color: T.text,
  },

  // Verify CTA
  verifyBtn: {
    backgroundColor: T.purple, borderRadius: 14, width: "100%",
    paddingVertical: 13, alignItems: "center", marginBottom: 14,
    shadowColor: T.purple, shadowOpacity: 0.35, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  verifyBtnDisabled: { backgroundColor: "#C4B8FF", shadowOpacity: 0, elevation: 0 },
  verifyText: { color: T.white, fontSize: 14, fontWeight: "800", letterSpacing: 0.3 },

  // Resend
  resendRow:     { flexDirection: "row", alignItems: "center", marginBottom: 11 },
  resendLabel:   { fontSize: 12, color: T.textSoft, fontWeight: "600" },
  resendLink:    { fontSize: 12, color: T.purple, fontWeight: "700" },
  resendDisabled:{ color: T.textSoft },

  // Timer pill
  timerPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#F5F0FF", borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
    alignSelf: "center",
  },
  timerIcon: { fontSize: 13 },
  timerText: { fontSize: 11, color: "#8A84C0", fontWeight: "600" },

  // Progress dots
  dotsRow: { flexDirection: "row", gap: 5, marginTop: 14, alignItems: "center" },
  dot:      { width: 7, height: 7, borderRadius: 4, backgroundColor: T.border },
  dotActive:{ width: 20, borderRadius: 4, backgroundColor: T.purple },

  // Success
  successWrap:   { alignItems: "center", paddingVertical: 20 },
  successCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: T.yellow, alignItems: "center", justifyContent: "center",
    marginBottom: 16, borderWidth: 4, borderColor: T.white,
    shadowColor: "#E6A800", shadowOpacity: 0.4, shadowRadius: 18, elevation: 8,
  },
  successEmoji: { fontSize: 46 },
  successTitle: { fontSize: 26, fontWeight: "900", color: T.text, marginBottom: 6 },
  successSub:   { fontSize: 15, color: T.textMid, fontWeight: "700" },
  confettiRow:  { flexDirection: "row", gap: 8, marginTop: 16 },
  confettiEmoji:{ fontSize: 20 },

  homeInd: {
    width: 80, height: 4, borderRadius: 2,
    backgroundColor: "#D6CDFF", alignSelf: "center", marginTop: 16,
  },
});
