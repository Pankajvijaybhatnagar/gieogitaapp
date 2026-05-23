import { View, Text, Pressable, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import { EditUserDetails } from "@/components";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const C = {
  deepBrown:   "#2C1A0A",
  warmBrown:   "#4A2C0D",
  richBrown:   "#3D2010",
  gold:        "#C9A227",
  goldLight:   "#E8C55A",
  goldDark:    "#8B6914",
  goldPale:    "rgba(201,162,39,0.10)",
  goldBorder:  "rgba(201,162,39,0.30)",
  cream:       "#FDF6E3",
  creamDark:   "#F5E6C8",
  saffron:     "#E8721C",
  saffronLight:"#F4A44A",
  white:       "#FFFFFF",
};

// ─── PULSING RING ─────────────────────────────────────────────────────────────
function PulsingRing({ size, delay = 0, color = C.gold }) {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value   = withDelay(delay, withRepeat(withTiming(1.25, { duration: 1600 }), -1, true));
    opacity.value = withDelay(delay, withRepeat(withTiming(0.1,  { duration: 1600 }), -1, true));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity:   opacity.value,
  }));

  return (
    <Animated.View
      style={[{
        position: "absolute",
        width: size, height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
      }, animStyle]}
    />
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label }) {
  return (
    <Animated.View entering={FadeInDown.delay(300)} style={S.statCard}>
      <Text style={S.statCardIcon}>{icon}</Text>
      <Text style={S.statCardValue}>{value}</Text>
      <Text style={S.statCardLabel}>{label}</Text>
    </Animated.View>
  );
}

// ─── INFO ROW ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <View style={S.infoRow}>
      <View style={S.infoIconBox}>
        <FontAwesome name={icon} size={14} color={C.goldDark} />
      </View>
      <View style={S.infoTextCol}>
        <Text style={S.infoLabel}>{label}</Text>
        <Text style={S.infoValue}>{value || "—"}</Text>
      </View>
    </View>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ProfileModal() {
  const user   = useSelector((state) => state.auth.user);
  const router = useRouter();

  const getInitials = () => {
    if (!user?.name) return "🙏";
    const parts = user.name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Animated.View entering={FadeIn} style={S.root}>
      <ScrollView
        style={S.scroll}
        showsVerticalScrollIndicator={false}
        bounces
      >

        {/* ══════════════════════════════════════════════
            HERO SECTION — full width deep brown banner
        ══════════════════════════════════════════════ */}
        <View style={S.hero}>

          {/* Decorative background elements */}
          <View style={S.heroBlob1} />
          <View style={S.heroBlob2} />
          <View style={S.heroArc} />
          <Text style={S.heroOm}>ॐ</Text>

          {/* Top bar — back button + title */}
          <View style={S.topBar}>
            <Link href="../" asChild>
              <TouchableOpacity style={S.backBtn} activeOpacity={0.8}>
                <FontAwesome name="chevron-left" size={14} color={C.goldLight} />
              </TouchableOpacity>
            </Link>
            <View style={S.topBarTitle}>
              <Text style={S.topBarTitleText}>MY PROFILE</Text>
            </View>
            {/* Spacer to balance the back button */}
            <View style={{ width: 38 }} />
          </View>

          {/* ── AVATAR ── */}
          <View style={S.avatarWrap}>
            <PulsingRing size={110} delay={0}   color={C.gold}      />
            <PulsingRing size={110} delay={800}  color={C.goldLight} />
            <View style={S.avatarOuterRing}>
              <View style={S.avatarInnerRing}>
                <View style={S.avatarCircle}>
                  <Text style={S.avatarText}>{getInitials()}</Text>
                </View>
              </View>
            </View>
            <View style={S.onlineDot} />
          </View>

          {/* Name */}
          <Animated.Text entering={FadeInDown.delay(100)} style={S.heroName}>
            {user?.name || "Gita Devotee"}
          </Animated.Text>

          {/* Email */}
          {user?.email && (
            <Animated.View entering={FadeInDown.delay(150)} style={S.emailRow}>
              <FontAwesome name="envelope-o" size={12} color={C.goldDark} />
              <Text style={S.heroEmail}>{user.email}</Text>
            </Animated.View>
          )}

          {/* Devotee badge */}
          <Animated.View entering={FadeInDown.delay(200)} style={S.devoteeBadge}>
            <Text style={S.devoteeBadgeText}>🕉️  Gita Devotee  •  GIEO GITA</Text>
          </Animated.View>

          {/* ── STATS ROW ── */}
          <View style={S.statsRow}>
            <StatCard icon="📿" value="8,556" label="Chants"  />
            <View style={S.statsVertDivider} />
            <StatCard icon="📖" value="142"   label="Paath"   />
            <View style={S.statsVertDivider} />
            <StatCard icon="🔥" value="21"    label="Day Streak" />
          </View>

        </View>

        {/* ══════════════════════════════════════════════
            INFO SECTION — user details display
        ══════════════════════════════════════════════ */}
        <Animated.View entering={FadeInDown.delay(250)} style={S.infoSection}>

          <View style={S.sectionHeader}>
            <View style={S.sectionHeaderLine} />
            <View style={S.sectionHeaderPill}>
              <FontAwesome name="user" size={10} color={C.goldDark} />
              <Text style={S.sectionHeaderText}>ACCOUNT INFO</Text>
            </View>
            <View style={S.sectionHeaderLine} />
          </View>

          <View style={S.infoCard}>
            <InfoRow icon="user"       label="Full Name"     value={user?.name}    />
            <View style={S.infoCardDivider} />
            <InfoRow icon="envelope"   label="Email Address" value={user?.email}   />
            <View style={S.infoCardDivider} />
            <InfoRow icon="phone"      label="Phone"         value={user?.phone}   />
            <View style={S.infoCardDivider} />
            <InfoRow icon="map-marker" label="City"          value={user?.city}    />
          </View>
        </Animated.View>

        {/* ══════════════════════════════════════════════
            EDIT SECTION — EditUserDetails component
        ══════════════════════════════════════════════ */}
        <Animated.View entering={FadeInDown.delay(320)} style={S.editSection}>

          <View style={S.sectionHeader}>
            <View style={S.sectionHeaderLine} />
            <View style={S.sectionHeaderPill}>
              <FontAwesome name="edit" size={10} color={C.goldDark} />
              <Text style={S.sectionHeaderText}>EDIT DETAILS</Text>
            </View>
            <View style={S.sectionHeaderLine} />
          </View>

          <View style={S.editCard}>
            <EditUserDetails />
          </View>

        </Animated.View>

        {/* ══════════════════════════════════════════════
            SPIRITUAL FOOTER
        ══════════════════════════════════════════════ */}
        <Animated.View entering={FadeInDown.delay(400)} style={S.footerVerse}>
          <Text style={S.footerVerseText}>
            {"\"मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे॥\""}
          </Text>
          <Text style={S.footerVerseRef}>— Bhagavad Gita 18.65</Text>
        </Animated.View>

        <View style={{ height: 40 }} />

      </ScrollView>

      {/* ── CLOSE BUTTON (floating top-right, always visible) ── */}
      <Pressable onPress={() => router.back()} style={S.closeBtn}>
        <FontAwesome name="times" size={15} color={C.goldLight} />
      </Pressable>

    </Animated.View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({

  // ── ROOT ────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: C.cream,
  },
  scroll: {
    flex: 1,
  },

  // ── HERO ────────────────────────────────────────────────────────
  hero: {
    backgroundColor: C.deepBrown,
    paddingBottom: 30,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  heroBlob1: {
    position: "absolute",
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: "rgba(201,162,39,0.06)",
    top: -100, right: -80,
  },
  heroBlob2: {
    position: "absolute",
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(74,44,13,0.2)",
    bottom: -60, left: -50,
  },
  heroArc: {
    position: "absolute",
    width: 340, height: 340, borderRadius: 170,
    borderWidth: 1, borderColor: "rgba(201,162,39,0.06)",
    top: -100, left: -80,
  },
  heroOm: {
    position: "absolute",
    right: 24, top: 60,
    fontSize: 90,
    color: "rgba(201,162,39,0.05)",
    lineHeight: 100,
  },

  // ── TOP BAR ─────────────────────────────────────────────────────
  topBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 20,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(201,162,39,0.12)",
    borderWidth: 1, borderColor: C.goldBorder,
    alignItems: "center", justifyContent: "center",
  },
  topBarTitle: {
    alignItems: "center",
  },
  topBarTitleText: {
    fontSize: 12, fontWeight: "800",
    color: C.goldLight, letterSpacing: 3,
  },

  // ── AVATAR ──────────────────────────────────────────────────────
  avatarWrap: {
    width: 110, height: 110,
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },
  avatarOuterRing: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 2, borderColor: C.gold,
    padding: 3,
    backgroundColor: "rgba(201,162,39,0.08)",
  },
  avatarInnerRing: {
    flex: 1, borderRadius: 43,
    borderWidth: 1,
    borderColor: "rgba(201,162,39,0.25)",
    padding: 2,
  },
  avatarCircle: {
    flex: 1, borderRadius: 40,
    backgroundColor: C.warmBrown,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: {
    fontSize: 30, fontWeight: "800",
    color: C.goldLight, letterSpacing: 2,
  },
  onlineDot: {
    position: "absolute",
    bottom: 6, right: 6,
    width: 15, height: 15, borderRadius: 8,
    backgroundColor: "#27AE60",
    borderWidth: 2.5, borderColor: C.deepBrown,
  },

  // ── USER INFO ───────────────────────────────────────────────────
  heroName: {
    fontSize: 24, fontWeight: "800",
    color: C.cream, letterSpacing: 0.5,
    marginBottom: 5,
  },
  emailRow: {
    flexDirection: "row", alignItems: "center",
    gap: 6, marginBottom: 12,
  },
  heroEmail: {
    fontSize: 12, color: C.goldDark, fontStyle: "italic",
  },
  devoteeBadge: {
    backgroundColor: "rgba(201,162,39,0.12)",
    borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 6,
    marginBottom: 20,
  },
  devoteeBadgeText: {
    fontSize: 11, fontWeight: "700",
    color: C.goldLight, letterSpacing: 0.5,
  },

  // ── STATS ROW ───────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(201,162,39,0.08)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(201,162,39,0.2)",
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: "88%",
    alignItems: "center",
  },
  statCard: {
    flex: 1, alignItems: "center", gap: 3,
  },
  statCardIcon:  { fontSize: 18, marginBottom: 2 },
  statCardValue: {
    fontSize: 16, fontWeight: "800",
    color: C.goldLight, letterSpacing: 0.5,
  },
  statCardLabel: {
    fontSize: 9, color: C.goldDark,
    letterSpacing: 0.5, fontWeight: "600",
  },
  statsVertDivider: {
    width: 1, height: 38,
    backgroundColor: "rgba(201,162,39,0.22)",
  },

  // ── SECTION HEADER ──────────────────────────────────────────────
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  editSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionHeaderLine: {
    flex: 1, height: 1,
    backgroundColor: C.goldDark, opacity: 0.25,
  },
  sectionHeaderPill: {
    flexDirection: "row", alignItems: "center",
    gap: 6,
    backgroundColor: C.creamDark,
    borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
    marginHorizontal: 10,
  },
  sectionHeaderText: {
    fontSize: 9, fontWeight: "800",
    color: C.goldDark, letterSpacing: 2,
  },

  // ── INFO CARD ───────────────────────────────────────────────────
  infoCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.goldBorder,
    overflow: "hidden",
    shadowColor: C.deepBrown,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  infoCardDivider: {
    height: 1,
    backgroundColor: C.goldBorder,
    marginHorizontal: 16,
    opacity: 0.5,
  },
  infoIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(201,162,39,0.08)",
    borderWidth: 1, borderColor: C.goldBorder,
    alignItems: "center", justifyContent: "center",
  },
  infoTextCol: { flex: 1 },
  infoLabel: {
    fontSize: 10, color: C.goldDark,
    fontWeight: "600", letterSpacing: 0.3,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14, color: C.deepBrown,
    fontWeight: "700",
  },

  // ── EDIT CARD ───────────────────────────────────────────────────
  editCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.goldBorder,
    shadowColor: C.deepBrown,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },

  // ── FOOTER VERSE ────────────────────────────────────────────────
  footerVerse: {
    backgroundColor: C.warmBrown,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: C.goldBorder,
    borderLeftWidth: 3,
    borderLeftColor: C.gold,
  },
  footerVerseText: {
    fontSize: 12, color: C.creamDark,
    lineHeight: 20, fontStyle: "italic",
    marginBottom: 8,
  },
  footerVerseRef: {
    fontSize: 10, color: C.goldDark,
    fontWeight: "700", letterSpacing: 0.5,
    textAlign: "right",
  },

  // ── CLOSE BUTTON ────────────────────────────────────────────────
  closeBtn: {
    position: "absolute",
    top: 54, right: 20,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(201,162,39,0.14)",
    borderWidth: 1, borderColor: C.goldBorder,
    alignItems: "center", justifyContent: "center",
    zIndex: 99,
  },
});