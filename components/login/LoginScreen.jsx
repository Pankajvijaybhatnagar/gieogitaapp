import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  verifyOtpSuccess,
} from '../redux/authSlice';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// ─── ORIGINAL CONSTANTS (unchanged) ──────────────────────────────────────────
const FALL_DURATION = 6000;
const NUM_LEAVES    = 10;

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const C = {
  deepBrown:   '#2C1A0A',
  warmBrown:   '#4A2C0D',
  richBrown:   '#3D2010',
  gold:        '#C9A227',
  goldLight:   '#E8C55A',
  goldDark:    '#8B6914',
  goldBorder:  'rgba(201,162,39,0.30)',
  cream:       '#FDF6E3',
  creamDark:   '#F5E6C8',
  saffron:     '#E8721C',
  saffronLight:'#F4A44A',
  white:       '#FFFFFF',
  black:       '#000000',
  error:       '#E74C3C',
  googleRed:   '#DB4437',
  appleBlack:  '#1C1C1E',
};

// ─────────────────────────────────────────────────────────────────────────────
// FALLING LEAF — original component (logic unchanged, spin + fade added)
// ─────────────────────────────────────────────────────────────────────────────
const FallingLeaf = ({ source, startX, startY, delay }) => {
  const translateY = useRef(new Animated.Value(startY)).current;
  const translateX = useRef(new Animated.Value(startX)).current;
  const rotate     = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startFallingAnimation = () => {
      // ── original logic (untouched) ────────────────────────────────────────
      translateY.setValue(-100);
      translateX.setValue(startX);
      rotate.setValue(0);
      opacity.setValue(0.7);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height + 100,
            duration: FALL_DURATION,
            easing: Easing.radial,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: startX + Math.random() * 100 - 50,
            duration: FALL_DURATION,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 1,
            duration: FALL_DURATION,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(FALL_DURATION * 0.7),
            Animated.timing(opacity, {
              toValue: 0,
              duration: FALL_DURATION * 0.3,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => startFallingAnimation());
    };

    startFallingAnimation();
  }, [translateX, translateY, delay]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={source}
      style={[
        S.leaf,
        { transform: [{ translateY }, { translateX }, { rotate: spin }], opacity },
      ]}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const LoginScreen = () => {

  // ── original state ────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const auth     = useSelector((state) => state.auth);

  // ── changed: email + password instead of phone ────────────────────────────
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // ── animation values ──────────────────────────────────────────────────────
  const cardSlide    = useRef(new Animated.Value(60)).current;
  const cardFade     = useRef(new Animated.Value(0)).current;
  const logoScale    = useRef(new Animated.Value(0.7)).current;
  const logoFade     = useRef(new Animated.Value(0)).current;
  const btnPulse     = useRef(new Animated.Value(1)).current;
  const emailFocus   = useRef(new Animated.Value(0)).current;
  const passFocus    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(logoFade,  { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(cardFade,  { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(btnPulse, { toValue: 1.03, duration: 1400, useNativeDriver: true }),
          Animated.timing(btnPulse, { toValue: 1,    duration: 1400, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const focusAnim = (anim) =>
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  const blurAnim = (anim) =>
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();

  const emailBorder = emailFocus.interpolate({ inputRange: [0, 1], outputRange: [C.goldBorder, C.gold] });
  const passBorder  = passFocus.interpolate({  inputRange: [0, 1], outputRange: [C.goldBorder, C.gold] });

  // ── email login handler (original dispatch logic preserved) ───────────────
  const handleLogin = async () => {
    if (email.trim() === '') {
      dispatch(loginFailure('Email cannot be empty'));
      return;
    }
    if (password.trim() === '') {
      dispatch(loginFailure('Password cannot be empty'));
      return;
    }

    dispatch(loginRequest());
    setLoading(true);

    try {
      dispatch(
        loginSuccess({
          name:    'Guest',
          email:   email,
          dob:     '',
          address: '',
        })
      );
      dispatch(verifyOtpSuccess({ email }));
      setLoading(false);
      router.replace('/home');
    } catch (error) {
      dispatch(loginFailure(error.message));
      setLoading(false);
    }
  };

  // ── social button handlers (no functionality — to be added later) ─────────
  const handleGoogleLogin = () => {
    // TODO: Add Google login functionality
  };

  const handleAppleLogin = () => {
    // TODO: Add Apple login functionality
  };

  // ── original leaves array (unchanged) ────────────────────────────────────
  const leaves = Array.from({ length: NUM_LEAVES }).map((_, index) => (
    <FallingLeaf
      key={index}
      source={require('../../assets/leaf.png')}
      startX={Math.random() * width}
      startY={-Math.random() * height}
      delay={index * 500}
    />
  ));

  return (
    <View style={S.root}>

      {/* ── BACKGROUND ── */}
      <View style={S.bgBlob1} />
      <View style={S.bgBlob2} />
      <View style={S.bgBlob3} />

      {/* ── FALLING LEAVES (original — unchanged) ── */}
      <View style={StyleSheet.absoluteFill}>{leaves}</View>

      {/* ── KEYBOARD AWARE ── */}
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={S.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── TOP DECORATION ── */}
          <View style={S.topDeco}>
            <View style={S.topDecoLine} />
            <Text style={S.topDecoOm}>ॐ</Text>
            <View style={S.topDecoLine} />
          </View>

          {/* ── LOGO ── */}
          <Animated.View
            style={[S.logoWrap, { opacity: logoFade, transform: [{ scale: logoScale }] }]}
          >
            <View style={S.logoOuterRing}>
              <View style={S.logoInnerRing}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={S.logo}
                />
              </View>
            </View>
          </Animated.View>

          {/* ── APP NAME ── */}
          <Animated.View style={{ opacity: logoFade, alignItems: 'center' }}>
            <Text style={S.appName}>GIEO GITA</Text>
            <Text style={S.appSub}>॥ कृष्ण कृपा ॥</Text>
            <View style={S.nameDivider} />
          </Animated.View>

          {/* ══════════════════════════════════════
              LOGIN CARD
          ══════════════════════════════════════ */}
          <Animated.View
            style={[S.card, { opacity: cardFade, transform: [{ translateY: cardSlide }] }]}
          >
            {/* Card top strip */}
            <View style={S.cardTopStrip}>
              <Text style={S.cardTopStripText}>✦ LOGIN TO YOUR ACCOUNT ✦</Text>
            </View>

            <View style={S.cardBlob} />

            <View style={S.cardBody}>

              <Text style={S.cardGreeting}>Namaskaram 🙏</Text>
              <Text style={S.cardDesc}>
                Sign in to continue your spiritual journey with GIEO GITA
              </Text>

              {/* ─── SOCIAL LOGIN BUTTONS ─────────────────────────────── */}
              <View style={S.socialRow}>

                {/* Google */}
                <TouchableOpacity
                  style={S.googleBtn}
                  onPress={handleGoogleLogin}
                  activeOpacity={0.85}
                >
                  <AntDesign name="google" size={18} color={C.white} />
                  <Text style={S.googleBtnText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Apple */}
                <TouchableOpacity
                  style={S.appleBtn}
                  onPress={handleAppleLogin}
                  activeOpacity={0.85}
                >
                  <AntDesign name="apple1" size={18} color={C.white} />
                  <Text style={S.appleBtnText}>Continue with Apple</Text>
                </TouchableOpacity>

              </View>

              {/* ─── OR DIVIDER ───────────────────────────────────────── */}
              <View style={S.orRow}>
                <View style={S.orLine} />
                <View style={S.orPill}>
                  <Text style={S.orText}>OR</Text>
                </View>
                <View style={S.orLine} />
              </View>

              {/* ─── EMAIL INPUT ──────────────────────────────────────── */}
              <Text style={S.inputLabel}>Email Address</Text>
              <Animated.View style={[S.inputWrap, { borderColor: emailBorder }]}>
                <View style={S.inputIconBox}>
                  <FontAwesome name="envelope-o" size={14} color={C.goldDark} />
                </View>
                <TextInput
                  style={S.input}
                  placeholder="Enter your email"
                  placeholderTextColor={C.goldDark}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => focusAnim(emailFocus)}
                  onBlur={()  => blurAnim(emailFocus)}
                />
              </Animated.View>

              {/* ─── PASSWORD INPUT ───────────────────────────────────── */}
              <Text style={S.inputLabel}>Password</Text>
              <Animated.View style={[S.inputWrap, { borderColor: passBorder }]}>
                <View style={S.inputIconBox}>
                  <FontAwesome name="lock" size={15} color={C.goldDark} />
                </View>
                <TextInput
                  style={S.input}
                  placeholder="Enter your password"
                  placeholderTextColor={C.goldDark}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => focusAnim(passFocus)}
                  onBlur={()  => blurAnim(passFocus)}
                />
                <TouchableOpacity
                  style={S.eyeBtn}
                  onPress={() => setShowPass((p) => !p)}
                  activeOpacity={0.7}
                >
                  <FontAwesome
                    name={showPass ? 'eye' : 'eye-slash'}
                    size={15}
                    color={C.goldDark}
                  />
                </TouchableOpacity>
              </Animated.View>

              {/* Forgot password */}
              <TouchableOpacity style={S.forgotRow} activeOpacity={0.7}>
                <Text style={S.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* ─── LOGIN BUTTON ─────────────────────────────────────── */}
              <Animated.View style={{ transform: [{ scale: btnPulse }] }}>
                <TouchableOpacity
                  style={[S.loginBtn, loading && S.loginBtnDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={C.deepBrown} />
                  ) : (
                    <View style={S.loginBtnInner}>
                      <FontAwesome
                        name="sign-in"
                        size={16}
                        color={C.deepBrown}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={S.loginBtnText}>Login with Email</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>

              {/* ── ERROR MESSAGE (original — unchanged) ── */}
              {auth.error && (
                <View style={S.errorBox}>
                  <FontAwesome name="exclamation-circle" size={13} color={C.error} />
                  <Text style={S.errorText}>{auth.error}</Text>
                </View>
              )}

              {/* ── WELCOME MESSAGE (original — unchanged) ── */}
              {auth.isLoggedIn && (
                <View style={S.welcomeBox}>
                  <Text style={S.welcomeText}>🪷  Welcome, {auth.user?.name}!</Text>
                </View>
              )}

            </View>

            {/* Card bottom strip */}
            <View style={S.cardBottomStrip}>
              <Text style={S.cardBottomText}>
                🕉️  Jai Shri Krishna  •  GIEO GITA  🕉️
              </Text>
            </View>
          </Animated.View>

          {/* ── BOTTOM VERSE ── */}
          <Animated.View style={[S.verseBox, { opacity: cardFade }]}>
            <Text style={S.verseText}>
              {"\"अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥\""}
            </Text>
            <Text style={S.verseRef}>— Bhagavad Gita 9.22</Text>
          </Animated.View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({

  // ── ROOT ───────────────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: C.deepBrown,
  },
  bgBlob1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(201,162,39,0.06)', top: -80, right: -80,
  },
  bgBlob2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(74,44,13,0.3)', bottom: 100, left: -60,
  },
  bgBlob3: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(232,114,28,0.05)', top: height * 0.4, right: 20,
  },

  // ── SCROLL ─────────────────────────────────────────────────────────────────
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  // ── TOP DECORATION ─────────────────────────────────────────────────────────
  topDeco: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 28, width: 200,
  },
  topDecoLine: { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.5 },
  topDecoOm:   { fontSize: 20, color: C.gold, marginHorizontal: 12, opacity: 0.9 },

  // ── LOGO ───────────────────────────────────────────────────────────────────
  logoWrap: {
    marginBottom: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  logoOuterRing: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 2, borderColor: C.gold,
    padding: 5, backgroundColor: 'rgba(201,162,39,0.1)',
  },
  logoInnerRing: {
    flex: 1, borderRadius: 50,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', backgroundColor: 'rgba(44,26,10,0.5)',
  },
  logo: { width: 72, height: 72, resizeMode: 'contain' },

  // ── APP NAME ───────────────────────────────────────────────────────────────
  appName: {
    fontSize: 30, fontWeight: '800',
    color: C.goldLight, letterSpacing: 5,
    textShadowColor: 'rgba(201,162,39,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
    marginBottom: 4,
  },
  appSub: {
    fontSize: 14, color: C.gold,
    letterSpacing: 2, fontStyle: 'italic', marginBottom: 12,
  },
  nameDivider: {
    width: 80, height: 1.5,
    backgroundColor: C.gold, borderRadius: 1,
    opacity: 0.6, marginBottom: 20,
  },

  // ── CARD ───────────────────────────────────────────────────────────────────
  card: {
    width: '100%',
    backgroundColor: C.cream,
    borderRadius: 24, overflow: 'hidden',
    borderWidth: 1.5, borderColor: C.gold,
    shadowColor: C.gold, shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20, elevation: 10,
    position: 'relative',
  },
  cardTopStrip: {
    backgroundColor: C.deepBrown,
    paddingVertical: 10, alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: C.gold,
  },
  cardTopStripText: {
    fontSize: 9, fontWeight: '800',
    color: C.goldLight, letterSpacing: 2.5,
  },
  cardBlob: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(201,162,39,0.04)', top: -60, right: -40,
  },
  cardBody:     { padding: 22 },
  cardGreeting: { fontSize: 20, fontWeight: '800', color: C.deepBrown, marginBottom: 4 },
  cardDesc: {
    fontSize: 12, color: C.warmBrown,
    lineHeight: 18, fontStyle: 'italic', marginBottom: 20,
  },

  // ── SOCIAL BUTTONS ─────────────────────────────────────────────────────────
  socialRow:  { gap: 11, marginBottom: 20 },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    backgroundColor: C.googleRed,
    borderRadius: 14, paddingVertical: 14,
    shadowColor: C.googleRed,
    shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8, elevation: 4,
  },
  googleBtnText: {
    fontSize: 14, fontWeight: '800',
    color: C.white, letterSpacing: 0.3,
  },

  appleBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    backgroundColor: C.appleBlack,
    borderRadius: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: C.black,
    shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8, elevation: 4,
  },
  appleBtnText: {
    fontSize: 14, fontWeight: '800',
    color: C.white, letterSpacing: 0.3,
  },

  // ── OR DIVIDER ─────────────────────────────────────────────────────────────
  orRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 18,
  },
  orLine: { flex: 1, height: 1, backgroundColor: C.goldBorder },
  orPill: {
    backgroundColor: C.creamDark,
    borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4,
    marginHorizontal: 10,
  },
  orText: {
    fontSize: 10, fontWeight: '800',
    color: C.goldDark, letterSpacing: 1.5,
  },

  // ── INPUTS ─────────────────────────────────────────────────────────────────
  inputLabel: {
    fontSize: 11, fontWeight: '700',
    color: C.goldDark, letterSpacing: 0.5,
    marginBottom: 7,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 14,
    overflow: 'hidden', marginBottom: 14,
    backgroundColor: C.white,
  },
  inputIconBox: {
    width: 44, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(201,162,39,0.07)',
    borderRightWidth: 1, borderRightColor: C.goldBorder,
  },
  input: {
    flex: 1, height: 50,
    paddingHorizontal: 14,
    fontSize: 14, color: C.deepBrown, fontWeight: '600',
  },
  eyeBtn: {
    paddingHorizontal: 14,
    height: 50, alignItems: 'center', justifyContent: 'center',
  },

  // ── FORGOT PASSWORD ────────────────────────────────────────────────────────
  forgotRow: { alignItems: 'flex-end', marginBottom: 18, marginTop: -6 },
  forgotText: {
    fontSize: 11, color: C.saffron,
    fontWeight: '700', fontStyle: 'italic',
  },

  // ── LOGIN BUTTON ───────────────────────────────────────────────────────────
  loginBtn: {
    backgroundColor: C.gold, borderRadius: 14,
    height: 52, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.gold, shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 12, elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnInner: { flexDirection: 'row', alignItems: 'center' },
  loginBtnText: {
    fontSize: 16, fontWeight: '800',
    color: C.deepBrown, letterSpacing: 0.5,
  },

  // ── ERROR & WELCOME ────────────────────────────────────────────────────────
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(231,76,60,0.08)',
    borderWidth: 1, borderColor: 'rgba(231,76,60,0.25)',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9,
    marginTop: 12,
  },
  errorText:  { color: C.error, fontSize: 12, fontWeight: '600', flex: 1 },
  welcomeBox: {
    backgroundColor: 'rgba(39,174,96,0.1)',
    borderWidth: 1, borderColor: 'rgba(39,174,96,0.3)',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    marginTop: 12, alignItems: 'center',
  },
  welcomeText: { fontSize: 14, fontWeight: '700', color: '#27AE60' },

  // ── CARD BOTTOM STRIP ─────────────────────────────────────────────────────
  cardBottomStrip: {
    backgroundColor: C.warmBrown,
    paddingVertical: 9, alignItems: 'center',
    borderTopWidth: 1, borderTopColor: C.goldBorder,
  },
  cardBottomText: {
    fontSize: 9, color: C.goldDark,
    letterSpacing: 1.5, fontStyle: 'italic',
  },

  // ── VERSE BOX ──────────────────────────────────────────────────────────────
  verseBox: {
    width: '100%', backgroundColor: C.warmBrown,
    borderRadius: 16, padding: 16, marginTop: 18,
    borderWidth: 1, borderColor: C.goldBorder,
    borderLeftWidth: 3, borderLeftColor: C.gold,
  },
  verseText: {
    fontSize: 11, color: C.creamDark,
    lineHeight: 18, fontStyle: 'italic', marginBottom: 6,
  },
  verseRef: {
    fontSize: 10, color: C.goldDark,
    fontWeight: '700', letterSpacing: 0.5, textAlign: 'right',
  },

  // ── LEAF (original) ────────────────────────────────────────────────────────
  leaf: {
    position: 'absolute',
    width: 80, height: 80,
    resizeMode: 'contain',
  },
});

// ─── ORIGINAL CONFIG (unchanged) ─────────────────────────────────────────────
export const config = {
  options: {
    headerShown: false,
  },
};

export default LoginScreen;