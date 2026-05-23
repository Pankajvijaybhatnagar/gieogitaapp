import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Video }                      from "expo-av";
import { useSelector }                from "react-redux";

const { width, height } = Dimensions.get("window");

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const C = {
  deepBrown:   "#2C1A0A",
  warmBrown:   "#4A2C0D",
  gold:        "#C9A227",
  goldLight:   "#E8C55A",
  goldDark:    "#8B6914",
  cream:       "#FDF6E3",
  saffron:     "#E8721C",
  saffronLight:"#F4A44A",
  white:       "#FFFFFF",
};

// ─── PULSING RING COMPONENT ───────────────────────────────────────────────────
function PulsingRing({ delay = 0, size }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scale   = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 0.2, 0] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size, height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: C.gold,
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

// ─── FLOATING PARTICLE ────────────────────────────────────────────────────────
function FloatingParticle({ x, delay, duration }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [height + 20, -40] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 1, 1, 0] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        bottom: 0,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: C.goldLight,
        transform: [{ translateY }],
        opacity,
      }}
    />
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Index() {
  // ── All original state/refs ───────────────────────────────────────────────
  const fadeAnim      = useRef(new Animated.Value(0)).current;
  const [showContent, setShowContent] = useState(false);
  const router        = useRouter();
  const videoRef      = useRef(null);
  const isLoggedIn    = useSelector((state) => state.auth.isLoggedIn);

  // ── New animation values ───────────────────────────────────────────────────
  const logoScale     = useRef(new Animated.Value(0.5)).current;
  const logoTranslate = useRef(new Animated.Value(40)).current;
  const titleSlide    = useRef(new Animated.Value(30)).current;
  const subtitleSlide = useRef(new Animated.Value(30)).current;
  const btnScale      = useRef(new Animated.Value(0.85)).current;
  const dividerWidth  = useRef(new Animated.Value(0)).current;
  const btnPulse      = useRef(new Animated.Value(1)).current;

  // ── Original useFocusEffect — untouched logic ─────────────────────────────
  
  
  
  
  useFocusEffect(
    React.useCallback(() => {
      const resetAndPlayVideo = async () => {
        if (videoRef.current) {
          try {
            await videoRef.current.setPositionAsync(0);
            await videoRef.current.playAsync();
          } catch (error) {
            console.error("Error resetting or playing video:", error);
          }
        }
      };

      resetAndPlayVideo();

      const timer = setTimeout(() => {
        setShowContent(true);
        fadeIn();
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }, [])
  );

  // ── Original fade-in + new staggered animations ───────────────────────────
  const fadeIn = () => {
    // Original fade
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Staggered entrance animations
    Animated.stagger(120, [
      Animated.parallel([
        Animated.spring(logoScale,     { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(logoTranslate, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      Animated.timing(dividerWidth, { toValue: 140, duration: 600, useNativeDriver: false }),
      Animated.timing(titleSlide,   { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(subtitleSlide,{ toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.spring(btnScale,     { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => {
      // Gentle pulse on button after entrance
      Animated.loop(
        Animated.sequence([
          Animated.timing(btnPulse, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
          Animated.timing(btnPulse, { toValue: 1,    duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    });
  };

  // ── Original handleGetStarted — untouched logic ───────────────────────────
  const handleGetStarted = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.pauseAsync();
      } catch (error) {
        console.error("Error pausing the video:", error);
      }
    }
    if (isLoggedIn) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  // ── Floating particles data ────────────────────────────────────────────────
  const particles = [
    { x: width * 0.1,  delay: 0,    duration: 4000 },
    { x: width * 0.25, delay: 800,  duration: 5200 },
    { x: width * 0.4,  delay: 1600, duration: 3800 },
    { x: width * 0.6,  delay: 400,  duration: 4600 },
    { x: width * 0.75, delay: 1200, duration: 5000 },
    { x: width * 0.88, delay: 2000, duration: 4200 },
  ];

  return (
    <View style={S.root}>

      {/* ── BACKGROUND VIDEO (original — untouched) ── */}
      <Video
        ref={videoRef}
        source={require("../assets/intro.mp4")}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        style={S.video}
        onPlaybackStatusUpdate={async (status) => {
          if (status.didJustFinish) {
            try {
              await videoRef.current.replayAsync();
            } catch (error) {
              console.error("Error replaying video:", error);
            }
          }
        }}
      />

      {/* ── DARK OVERLAY ── */}
      <View style={S.overlay} />

      {/* ── GOLDEN GRADIENT OVERLAY (bottom) ── */}
      <View style={S.bottomGlow} />

      {/* ── FLOATING GOLD PARTICLES ── */}
      {showContent && particles.map((p, i) => (
        <FloatingParticle key={i} x={p.x} delay={p.delay} duration={p.duration} />
      ))}

      {/* ── FADE-IN CONTENT (original condition preserved) ── */}
      {showContent && (
        <Animated.View style={[S.contentWrap, { opacity: fadeAnim }]}>

          {/* Top Om symbol */}
          <Text style={S.topOm}>ॐ</Text>

          {/* Decorative top line */}
          <View style={S.topLineRow}>
            <View style={S.topLineLeft} />
            <Text style={S.topLineDiamond}>◆</Text>
            <View style={S.topLineRight} />
          </View>

          {/* ── LOGO + PULSING RINGS ── */}
          <Animated.View
            style={[
              S.logoWrap,
              {
                transform: [
                  { scale: logoScale },
                  { translateY: logoTranslate },
                ],
              },
            ]}
          >
            <PulsingRing size={140} delay={0}    />
            <PulsingRing size={140} delay={700}  />
            <PulsingRing size={140} delay={1400} />
            <View style={S.logoOuterRing}>
              <View style={S.logoInnerRing}>
                {/* Original Image — path unchanged */}
                <Image
                  style={S.logoImage}
                  source={require("../assets/logo.png")}
                />
              </View>
            </View>
          </Animated.View>

          {/* ── ANIMATED GOLD DIVIDER ── */}
          <Animated.View style={[S.divider, { width: dividerWidth }]} />

          {/* ── APP NAME ── */}
          <Animated.Text
            style={[
              S.appName,
              { transform: [{ translateY: titleSlide }] },
            ]}
          >
            GIEO GITA 
          </Animated.Text>

          {/* ── SUBTITLE ── */}
          <Animated.Text
            style={[
              S.subtitle,
              { transform: [{ translateY: subtitleSlide }] },
            ]}
          >
            ॥ कृष्ण कृपा ॥
          </Animated.Text>

          {/* Tagline */}
          <Animated.Text
            style={[
              S.tagline,
              { transform: [{ translateY: subtitleSlide }] },
            ]}
          >
            Spreading the timeless wisdom of Bhagavad Gita
          </Animated.Text>

          {/* ── FEATURE PILLS ── */}
          <View style={S.pillsRow}>
            {['📖 Gita Paath', '📿 Daily Chants', '🪷 Gita Seva'].map((p) => (
              <View key={p} style={S.featurePill}>
                <Text style={S.featurePillText}>{p}</Text>
              </View>
            ))}
          </View>

          {/* ── GET STARTED BUTTON (original onPress preserved) ── */}
          <Animated.View style={{ transform: [{ scale: btnPulse }, { scale: btnScale }] }}>
            <Pressable
              onPress={handleGetStarted}
              style={({ pressed }) => [
                S.getStartedBtn,
                pressed && S.getStartedBtnPressed,
              ]}
            >
              <View style={S.getStartedBtnInner}>
                <Text style={S.getStartedBtnText}>Get Started</Text>
                <Text style={S.getStartedBtnArrow}> ›</Text>
              </View>
            </Pressable>
          </Animated.View>

          {/* Bottom tagline */}
          <Text style={S.bottomTagline}>
            🕉️  Jai Shri Krishna  🕉️
          </Text>

        </Animated.View>
      )}
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({

  // ── ROOT & VIDEO ──────────────────────────────────────────────────────────
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -1,
  },

  // ── OVERLAYS ──────────────────────────────────────────────────────────────
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20, 8, 0, 0.65)",
    zIndex: 0,
  },
  bottomGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    backgroundColor: "rgba(44, 26, 10, 0.7)",
    zIndex: 0,
  },

  // ── CONTENT WRAPPER ───────────────────────────────────────────────────────
  contentWrap: {
    alignItems: "center",
    zIndex: 2,
    paddingHorizontal: 30,
    width: "100%",
  },

  // ── TOP DECORATION ────────────────────────────────────────────────────────
  topOm: {
    fontSize: 28,
    color: C.gold,
    opacity: 0.8,
    marginBottom: 8,
    letterSpacing: 2,
  },
  topLineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    width: 180,
  },
  topLineLeft:    { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.6 },
  topLineRight:   { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.6 },
  topLineDiamond: { fontSize: 8, color: C.gold, marginHorizontal: 6 },

  // ── LOGO ──────────────────────────────────────────────────────────────────
  logoWrap: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  logoOuterRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: C.gold,
    padding: 5,
    backgroundColor: "rgba(201,162,39,0.1)",
  },
  logoInnerRing: {
    flex: 1,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: "rgba(201,162,39,0.4)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(44,26,10,0.5)",
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  // ── DIVIDER ───────────────────────────────────────────────────────────────
  divider: {
    height: 2,
    backgroundColor: C.gold,
    borderRadius: 1,
    marginBottom: 16,
    opacity: 0.8,
  },

  // ── TEXT ──────────────────────────────────────────────────────────────────
  appName: {
    fontSize: 38,
    fontWeight: "800",
    color: C.goldLight,
    letterSpacing: 6,
    textShadowColor: "rgba(201,162,39,0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: C.gold,
    letterSpacing: 2,
    marginBottom: 8,
    fontStyle: "italic",
  },
  tagline: {
    fontSize: 12,
    color: "rgba(253,246,227,0.65)",
    letterSpacing: 0.5,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 18,
  },

  // ── FEATURE PILLS ─────────────────────────────────────────────────────────
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 32,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  featurePill: {
    backgroundColor: "rgba(201,162,39,0.12)",
    borderWidth: 1,
    borderColor: "rgba(201,162,39,0.35)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featurePillText: {
    fontSize: 11,
    color: C.goldLight,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ── GET STARTED BUTTON ────────────────────────────────────────────────────
  getStartedBtn: {
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: C.gold,
    backgroundColor: C.gold,
    shadowColor: C.gold,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 8,
  },
  getStartedBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  getStartedBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  getStartedBtnText: {
    fontSize: 18,
    fontWeight: "800",
    color: C.deepBrown,
    letterSpacing: 1,
  },
  getStartedBtnArrow: {
    fontSize: 22,
    fontWeight: "800",
    color: C.deepBrown,
  },

  // ── BOTTOM TAGLINE ────────────────────────────────────────────────────────
  bottomTagline: {
    fontSize: 12,
    color: "rgba(201,162,39,0.55)",
    letterSpacing: 2,
    fontStyle: "italic",
  },
});