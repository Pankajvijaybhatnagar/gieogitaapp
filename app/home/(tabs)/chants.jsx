import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
  Alert,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const COLORS = {
  deepBrown:    '#2C1A0A',
  warmBrown:    '#4A2C0D',
  richBrown:    '#3D2010',
  gold:         '#C9A227',
  goldLight:    '#E8C55A',
  goldDark:     '#8B6914',
  cream:        '#FDF6E3',
  creamDark:    '#F5E6C8',
  saffron:      '#E8721C',
  saffronLight: '#F4A44A',
  purpleDeep:   '#2D1B4E',
  purpleMid:    '#6B3FA0',
  purpleLight:  '#C39BD3',
  white:        '#FFFFFF',
  liveRed:      '#E53935',
};

// ─── 18 ADHYAYS DATA ──────────────────────────────────────────────────────────
const ADHYAYS = [
  { num: 1,  name: 'Arjuna Vishada Yoga',     verses: 47,  icon: '⚔️'  },
  { num: 2,  name: 'Sankhya Yoga',            verses: 72,  icon: '📜'  },
  { num: 3,  name: 'Karma Yoga',              verses: 43,  icon: '🌿'  },
  { num: 4,  name: 'Jnana Karma Sanyasa Yoga',verses: 42,  icon: '🔥'  },
  { num: 5,  name: 'Karma Sanyasa Yoga',      verses: 29,  icon: '🕊️'  },
  { num: 6,  name: 'Atmasanyam Yoga',         verses: 47,  icon: '🧘'  },
  { num: 7,  name: 'Jnana Vijnana Yoga',      verses: 30,  icon: '✨'  },
  { num: 8,  name: 'Aksara Brahma Yoga',      verses: 28,  icon: '🌌'  },
  { num: 9,  name: 'Raja Vidya Yoga',         verses: 34,  icon: '👑'  },
  { num: 10, name: 'Vibhuti Yoga',            verses: 42,  icon: '🌟'  },
  { num: 11, name: 'Vishwarupa Darshana Yoga',verses: 55,  icon: '🌍'  },
  { num: 12, name: 'Bhakti Yoga',             verses: 20,  icon: '🪷'  },
  { num: 13, name: 'Kshetra Kshetrajna Yoga', verses: 34,  icon: '🌱'  },
  { num: 14, name: 'Gunatraya Vibhaga Yoga',  verses: 27,  icon: '⚖️'  },
  { num: 15, name: 'Purushottama Yoga',       verses: 20,  icon: '🌳'  },
  { num: 16, name: 'Daivasura Vibhaga Yoga',  verses: 24,  icon: '🛡️'  },
  { num: 17, name: 'Shraddhatraya Vibhaga',   verses: 28,  icon: '🙏'  },
  { num: 18, name: 'Moksha Sanyasa Yoga',     verses: 78,  icon: '🕉️'  },
];

// ─── REUSABLE: GOLD DIVIDER ───────────────────────────────────────────────────
function GoldDivider() {
  return (
    <View style={sharedStyles.dividerRow}>
      <View style={sharedStyles.dividerLine} />
      <Text style={sharedStyles.dividerSymbol}>🔱</Text>
      <View style={sharedStyles.dividerLine} />
    </View>
  );
}

// ─── REUSABLE: SECTION LABEL ─────────────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <View style={sharedStyles.sectionLabelRow}>
      <View style={sharedStyles.sectionLabelLine} />
      <Text style={sharedStyles.sectionLabelText}>{text}</Text>
      <View style={sharedStyles.sectionLabelLine} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. GLOBAL PAATH COUNT  — animated count-up
// ─────────────────────────────────────────────────────────────────────────────
function TotalPaath() {
  const GLOBAL_TOTAL = 23562558;
  const [displayed, setDisplayed] = useState(0);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6,   useNativeDriver: true }),
    ]).start();

    let current      = 0;
    const stepTime   = 40;
    const totalSteps = Math.ceil(2200 / stepTime);
    const increment  = Math.ceil(GLOBAL_TOTAL / totalSteps);

    const timer = setInterval(() => {
      current += increment;
      if (current >= GLOBAL_TOTAL) { current = GLOBAL_TOTAL; clearInterval(timer); }
      setDisplayed(current);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <Animated.View style={[tcStyles.wrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={tcStyles.bgCircle1} />
      <View style={tcStyles.bgCircle2} />
      <Text style={tcStyles.eyebrow}>🕉️  EK MIN EK SAATH — GLOBAL COUNT</Text>
      <Text style={tcStyles.label}>Total Gita Paath</Text>
      <View style={tcStyles.countBox}>
        <Text style={tcStyles.countText}>{displayed.toLocaleString()}</Text>
      </View>
      <Text style={tcStyles.subText}>Verses recited together worldwide 🙏</Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. YOUR PAATH PROGRESS  — personal stats
// ─────────────────────────────────────────────────────────────────────────────
function YourPaath({ totalPaath, monthProgress, weekProgress }) {
  return (
    <View style={ycStyles.wrapper}>
      <SectionLabel text="YOUR PAATH PROGRESS" />
      <View style={ycStyles.row}>
        {/* Total */}
        <View style={ycStyles.totalBox}>
          <Text style={ycStyles.totalLabel}>Total{'\n'}Paath</Text>
          <View style={ycStyles.totalDivider} />
          <Text style={ycStyles.totalNumber}>{totalPaath}</Text>
          <Text style={ycStyles.totalIcon}>📖</Text>
        </View>

        {/* Month + Week */}
        <View style={ycStyles.progressCol}>
          <View style={ycStyles.progressCard}>
            <View style={ycStyles.progressIconBox}>
              <Text style={ycStyles.progressIcon}>📅</Text>
            </View>
            <View style={ycStyles.progressTextCol}>
              <Text style={ycStyles.progressLabel}>Month Paath</Text>
              <Text style={ycStyles.progressNumber}>{monthProgress}</Text>
            </View>
          </View>

          <View style={ycStyles.progressCard}>
            <View style={ycStyles.progressIconBox}>
              <Text style={ycStyles.progressIcon}>🗓️</Text>
            </View>
            <View style={ycStyles.progressTextCol}>
              <Text style={ycStyles.progressLabel}>Week Paath</Text>
              <Text style={ycStyles.progressNumber}>{weekProgress}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PAATH COUNTER  — submit today's recitations
// ─────────────────────────────────────────────────────────────────────────────
function PaathCounter({ todayPaath, onSubmit }) {
  const [count, setCount]   = useState(0);
  const bounceAnim          = useRef(new Animated.Value(1)).current;
  const submitScaleAnim     = useRef(new Animated.Value(1)).current;

  const bounce = () => {
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: 1.18, useNativeDriver: true, friction: 3 }),
      Animated.spring(bounceAnim, { toValue: 1,    useNativeDriver: true, friction: 5 }),
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        if (g.dy > 10)       decrementCount();
        else if (g.dy < -10) incrementCount();
      },
    })
  ).current;

  const incrementCount = () => { setCount((p) => p + 1); bounce(); };
  const decrementCount = () => { if (count > 0) { setCount((p) => p - 1); bounce(); } };

  const handleSubmit = () => {
    if (count === 0) {
      Alert.alert('🕉️ No Paath', 'Please add at least 1 paath before submitting.');
      return;
    }
    Animated.sequence([
      Animated.spring(submitScaleAnim, { toValue: 0.93, useNativeDriver: true, friction: 4 }),
      Animated.spring(submitScaleAnim, { toValue: 1,    useNativeDriver: true, friction: 4 }),
    ]).start();
    onSubmit(count);
    setCount(0);
  };

  return (
    <View style={ccStyles.wrapper}>
      <SectionLabel text="SUBMIT TODAY'S PAATH" />

      <View style={ccStyles.todayBadge}>
        <Text style={ccStyles.todayBadgeText}>Today's submitted: </Text>
        <Text style={ccStyles.todayBadgeNumber}>{todayPaath}</Text>
      </View>

      <View style={ccStyles.mainRow}>
        {/* ── COUNTER ── */}
        <View style={ccStyles.counterCol}>
          <TouchableOpacity style={ccStyles.arrowBtn} onPress={incrementCount} activeOpacity={0.8}>
            <Text style={ccStyles.arrowText}>▲</Text>
          </TouchableOpacity>

          <Animated.View
            style={[ccStyles.counterBox, { transform: [{ scale: bounceAnim }] }]}
            {...panResponder.panHandlers}
          >
            <Text style={ccStyles.omSymbol}>📖</Text>
            <Text style={ccStyles.counterText}>{count}</Text>
            <Text style={ccStyles.swipeHint}>swipe ↕</Text>
          </Animated.View>

          <TouchableOpacity style={ccStyles.arrowBtn} onPress={decrementCount} activeOpacity={0.8}>
            <Text style={ccStyles.arrowText}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* ── INSTRUCTIONS + SUBMIT ── */}
        <View style={ccStyles.rightCol}>
          <View style={ccStyles.instructionsBox}>
            <Text style={ccStyles.instrTitle}>How to Submit Paath</Text>
            {[
              'Set number of verses recited today.',
              'Drag counter or use ▲ ▼ buttons.',
              'Press Submit to record your paath.',
            ].map((t, i) => (
              <View key={i} style={ccStyles.instrRow}>
                <View style={ccStyles.instrDot} />
                <Text style={ccStyles.instrText}>{t}</Text>
              </View>
            ))}
          </View>

          <Animated.View style={{ transform: [{ scale: submitScaleAnim }] }}>
            <TouchableOpacity style={ccStyles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <FontAwesome name="check-circle" size={16} color={COLORS.deepBrown} style={{ marginRight: 6 }} />
              <Text style={ccStyles.submitBtnText}>Submit Paath</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EK MIN EK SAATH SECTION  — about the campaign
// ─────────────────────────────────────────────────────────────────────────────
function EkMinSection() {
  const shimmer   = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(shimmer,   { toValue: 1, duration: 1800, useNativeDriver: true }),
      Animated.timing(shimmer,   { toValue: 0, duration: 1800, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: -7, duration: 1600, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0,  duration: 1600, useNativeDriver: true }),
    ])).start();
  }, []);

  const shimmerOpacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  const benefits = [
    { icon: '🧘', title: 'Inner Peace',        desc: 'Daily recitation calms the mind'         },
    { icon: '📖', title: '18 Adhyays',          desc: 'Complete Gita in 18 recitations'         },
    { icon: '🌍', title: 'Global Togetherness', desc: 'Millions reciting at the same moment'    },
    { icon: '🪷', title: 'Divine Grace',        desc: "Krishna's blessings on every devotee"    },
  ];

  const howToParticipate = [
    { icon: '⏰', text: 'Join at the designated time — Ek Minute together'    },
    { icon: '📖', text: 'Open your Bhagavad Gita or use the GIEO GITA app'    },
    { icon: '🗣️', text: 'Recite the assigned adhyay verse for that day'       },
    { icon: '🙏', text: 'Offer your paath with full devotion and focus'       },
    { icon: '📲', text: 'Submit your paath count through this screen'         },
    { icon: '🌐', text: 'Share the campaign — invite family & friends'        },
  ];

  return (
    <View style={pmStyles.wrapper}>

      {/* ── HERO BANNER ── */}
      <View style={pmStyles.heroBanner}>
        <View style={pmStyles.decCircle1} />
        <View style={pmStyles.decCircle2} />

        <View style={pmStyles.sacredTag}>
          <Text style={pmStyles.sacredTagText}>✦ GIEO GITA CAMPAIGN ✦</Text>
        </View>

        <Animated.Text style={[pmStyles.deityEmoji, { transform: [{ translateY: floatAnim }] }]}>
          📖
        </Animated.Text>

        <Animated.Text style={[pmStyles.heroTitle, { opacity: shimmerOpacity }]}>
          {'एक मिन\n'}<Text style={pmStyles.heroTitleAccent}>एक साथ</Text>
        </Animated.Text>

        <Text style={pmStyles.heroSubtitle}>Ek Min Ek Saath Gita Paath</Text>

        <Text style={pmStyles.heroDesc}>
          A divine movement — millions reciting the Bhagavad Gita together, one minute at a time, united in devotion across the globe.
        </Text>

        <View style={pmStyles.datePill}>
          <FontAwesome name="users" size={11} color={COLORS.purpleLight} />
          <Text style={pmStyles.datePillText}>18 Adhyays  •  Daily Recitation Campaign</Text>
        </View>
      </View>

      {/* ── ABOUT THE CAMPAIGN ── */}
      <View style={pmStyles.significanceBox}>
        <Text style={pmStyles.pmSectionLabel}>✦ ABOUT THE CAMPAIGN</Text>
        <Text style={pmStyles.significanceTitle}>
          One Minute, <Text style={pmStyles.significanceTitleAccent}>One World, One Gita</Text>
        </Text>
        <Text style={pmStyles.significanceDesc}>
          "Ek Min Ek Saath Gita Paath" is a global initiative by GIEO Gita where millions of devotees pause together for one minute every day to recite a verse from the Bhagavad Gita — creating a powerful wave of collective consciousness and divine energy.
        </Text>
        <View style={pmStyles.shlokaBox}>
          <Text style={pmStyles.shlokaDevanagari}>
            {"\"सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥\""}
          </Text>
          <Text style={pmStyles.shlokaTranslation}>
            Abandon all duties and take refuge in Me alone. I shall liberate you from all sins; do not grieve. — BG 18.66
          </Text>
        </View>
      </View>

      {/* ── 18 ADHYAYS SCROLL ── */}
      <View style={pmStyles.benefitsSection}>
        <Text style={pmStyles.pmSectionLabel}>✦ 18 ADHYAYS — GITA PAATH</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
        >
          {ADHYAYS.map((a) => (
            <TouchableOpacity key={a.num} style={adhyayStyles.card} activeOpacity={0.82}>
              <View style={adhyayStyles.numBadge}>
                <Text style={adhyayStyles.numText}>{a.num}</Text>
              </View>
              <Text style={adhyayStyles.icon}>{a.icon}</Text>
              <Text style={adhyayStyles.name} numberOfLines={2}>{a.name}</Text>
              <Text style={adhyayStyles.verses}>{a.verses} verses</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── HOW TO PARTICIPATE ── */}
      <View style={pmStyles.observanceBox}>
        <Text style={pmStyles.pmSectionLabel}>✦ HOW TO PARTICIPATE</Text>
        {howToParticipate.map((item, i) => (
          <View key={i} style={pmStyles.observanceRow}>
            <View style={pmStyles.observanceIconBox}>
              <Text style={pmStyles.observanceIcon}>{item.icon}</Text>
            </View>
            <Text style={pmStyles.observanceText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* ── CAMPAIGN BENEFITS GRID ── */}
      <View style={[pmStyles.benefitsSection, { marginTop: 0 }]}>
        <Text style={pmStyles.pmSectionLabel}>✦ BENEFITS OF DAILY PAATH</Text>
        <View style={pmStyles.benefitsGrid}>
          {benefits.map((b) => (
            <View key={b.title} style={pmStyles.benefitCard}>
              <Text style={pmStyles.benefitIcon}>{b.icon}</Text>
              <Text style={pmStyles.benefitTitle}>{b.title}</Text>
              <Text style={pmStyles.benefitDesc}>{b.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── CTA ── */}
      <TouchableOpacity style={pmStyles.ctaBtn} activeOpacity={0.85}>
        <Text style={pmStyles.ctaBtnText}>📖  Join Ek Min Ek Saath Today</Text>
      </TouchableOpacity>

    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PAATH DETAIL SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function PaathDetailScreen({ setShowPaath, stats, onSubmit }) {
  return (
    <ScrollView style={cdStyles.container} showsVerticalScrollIndicator={false}>
      <View style={cdStyles.header}>
        <TouchableOpacity style={cdStyles.backBtn} onPress={() => setShowPaath(false)}>
          <FontAwesome name="chevron-left" size={14} color={COLORS.goldLight} />
        </TouchableOpacity>
        <Text style={cdStyles.headerTitle}>Gita Paath</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={{ height: 16 }} />
      <TotalPaath />
      <GoldDivider />
      <YourPaath
        totalPaath={stats.totalChants}
        monthProgress={stats.monthProgress}
        weekProgress={stats.weekProgress}
      />
      <GoldDivider />
      <PaathCounter todayPaath={stats.todayChants} onSubmit={onSubmit} />
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function EkMinEkSaathScreen() {
  const [showPaath, setShowPaath] = useState(false);

  const [stats, setStats] = useState({
    totalChants:   8556,
    monthProgress: 50,
    weekProgress:  20,
    todayChants:   0,
  });

  const handleSubmit = (count) => {
    setStats((prev) => ({
      totalChants:   prev.totalChants   + count,
      monthProgress: prev.monthProgress + count,
      weekProgress:  prev.weekProgress  + count,
      todayChants:   prev.todayChants   + count,
    }));
    Alert.alert('🕉️ Jai Shri Krishna!', `${count} paath submitted! Your devotion is recorded. 🙏`);
  };

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,   duration: 700, useNativeDriver: true }),
    ])).start();
  }, []);

  if (showPaath) {
    return (
      <PaathDetailScreen
        setShowPaath={setShowPaath}
        stats={stats}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <ScrollView style={mainStyles.container} showsVerticalScrollIndicator={false}>

      {/* ── HEADER ── */}
      <Animated.View style={[mainStyles.header, { opacity: fadeAnim }]}>
        <View>
          <Text style={mainStyles.greetingSmall}>🕉️  Jai Shri Krishna</Text>
          <Text style={mainStyles.greeting}>Gita Paath 📖</Text>
        </View>
        <TouchableOpacity style={mainStyles.notifBtn}>
          <MaterialIcons name="notifications" size={20} color={COLORS.goldLight} />
          <View style={mainStyles.notifDot} />
        </TouchableOpacity>
      </Animated.View>

      {/* ── CAMPAIGN BANNER CARD ── */}
      <View style={mainStyles.quoteCard}>
        <View style={mainStyles.quoteCardInner}>
          <View style={mainStyles.quoteTopStrip}>
            <Text style={mainStyles.quoteTopLabel}>✦ EK MIN EK SAATH GITA PAATH ✦</Text>
          </View>
          <Image
            source={{ uri: 'https://your-image-url.com' }}
            style={mainStyles.quoteImage}
          />
          <View style={mainStyles.quoteOverlay} />
          <View style={mainStyles.quoteBody}>
            <Text style={mainStyles.quoteIconText}>❝</Text>
            <Text style={mainStyles.quoteText}>
              Let us all recite the Bhagavad Gita together — one minute, one world, one Krishna. Join millions in this divine movement of collective consciousness.
            </Text>
            <TouchableOpacity style={mainStyles.startDayBtn} activeOpacity={0.85}>
              <Text style={mainStyles.startDayBtnText}>Start Paath Now  ›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <GoldDivider />

      {/* ── GLOBAL PAATH COUNT ── */}
      <TotalPaath />

      <GoldDivider />

      {/* ── YOUR PAATH PROGRESS ── */}
      <YourPaath
        totalPaath={stats.totalChants}
        monthProgress={stats.monthProgress}
        weekProgress={stats.weekProgress}
      />

      <GoldDivider />

      {/* ── PAATH COUNTER ── */}
      <PaathCounter todayPaath={stats.todayChants} onSubmit={handleSubmit} />

      <GoldDivider />

      {/* ── LIVE SESSION ── */}
      <View style={mainStyles.liveSection}>
        <View style={mainStyles.liveTitleRow}>
          <View style={mainStyles.liveBadge}>
            <Animated.View style={[mainStyles.liveDot, { opacity: pulseAnim }]} />
            <Text style={mainStyles.liveBadgeText}>LIVE</Text>
          </View>
          <Text style={mainStyles.liveTitle}>Live Paath Session</Text>
        </View>
        <TouchableOpacity style={mainStyles.liveCard} activeOpacity={0.88}>
          <Image
            source={{ uri: 'https://your-livestream-image-url.com' }}
            style={mainStyles.liveImage}
          />
          <View style={mainStyles.livePlayOverlay}>
            <View style={mainStyles.livePlayBtn}>
              <FontAwesome name="play" size={18} color={COLORS.gold} />
            </View>
          </View>
          <View style={mainStyles.liveCardBody}>
            <Text style={mainStyles.liveDesc} numberOfLines={2}>
              Adhyay 12 — Bhakti Yoga | Ek Min Ek Saath Live Gita Paath with Guruji
            </Text>
            <View style={mainStyles.liveMetaRow}>
              <View style={mainStyles.liveTag}>
                <Text style={mainStyles.liveTagText}>GITA PAATH</Text>
              </View>
              <Text style={mainStyles.liveWatching}>👁  12.8k reciting</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <GoldDivider />

      {/* ── EK MIN EK SAATH SECTION ── */}
      <EkMinSection />

      <GoldDivider />

      {/* ── GO TO PAATH DETAIL ── */}
      <View style={mainStyles.chantsSection}>
        <Text style={mainStyles.chantsSectionTitle}>
          Gita <Text style={mainStyles.chantsSectionAccent}>Paath</Text>
        </Text>
        <Text style={mainStyles.chantsSectionDesc}>
          Record your daily Gita recitation and be a part of this divine global movement.
        </Text>
        <TouchableOpacity
          style={mainStyles.chantsBtn}
          onPress={() => setShowPaath(true)}
          activeOpacity={0.85}
        >
          <Text style={mainStyles.chantsBtnText}>📖  Go to Paath</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADHYAY CARD STYLES
// ─────────────────────────────────────────────────────────────────────────────
const adhyayStyles = StyleSheet.create({
  card: {
    width: 110,
    backgroundColor: COLORS.purpleDeep,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(155,89,182,0.4)',
  },
  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  numText:  { fontSize: 12, fontWeight: '800', color: COLORS.deepBrown },
  icon:     { fontSize: 22, marginBottom: 6 },
  name:     { fontSize: 10, fontWeight: '700', color: COLORS.goldLight, textAlign: 'center', marginBottom: 4, lineHeight: 13 },
  verses:   { fontSize: 9,  color: COLORS.purpleLight, fontStyle: 'italic' },
});

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────────────────────────────────────
const sharedStyles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginVertical: 16,
  },
  dividerLine:   { flex: 1, height: 1, backgroundColor: COLORS.goldDark, opacity: 0.3 },
  dividerSymbol: { fontSize: 14, marginHorizontal: 10 },
  sectionLabelRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 14,
  },
  sectionLabelLine: { flex: 1, height: 1, backgroundColor: COLORS.goldDark, opacity: 0.3 },
  sectionLabelText: {
    fontSize: 9, letterSpacing: 2, fontWeight: '800',
    color: COLORS.goldDark, marginHorizontal: 10,
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TOTAL PAATH STYLES
// ─────────────────────────────────────────────────────────────────────────────
const tcStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.deepBrown, marginHorizontal: 16,
    borderRadius: 20, padding: 22, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)',
    overflow: 'hidden', position: 'relative',
  },
  bgCircle1: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(201,162,39,0.07)', top: -50, right: -40,
  },
  bgCircle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(201,162,39,0.05)', bottom: -30, left: -20,
  },
  eyebrow: { fontSize: 9, letterSpacing: 2, color: COLORS.goldDark, fontWeight: '800', marginBottom: 4 },
  label:   { fontSize: 14, fontWeight: '800', color: COLORS.cream, letterSpacing: 1, marginBottom: 12 },
  countBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(201,162,39,0.1)',
    borderWidth: 2, borderColor: COLORS.gold,
    borderRadius: 50, paddingVertical: 12, paddingHorizontal: 28,
  },
  countText: { fontSize: 30, fontWeight: '800', color: COLORS.goldLight, letterSpacing: 1 },
  subText:   { fontSize: 11, color: 'rgba(253,246,227,0.5)', fontStyle: 'italic', marginTop: 10 },
});

// ─────────────────────────────────────────────────────────────────────────────
// YOUR PAATH STYLES
// ─────────────────────────────────────────────────────────────────────────────
const ycStyles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16, backgroundColor: COLORS.creamDark,
    borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)',
  },
  row:          { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  totalBox: {
    backgroundColor: COLORS.deepBrown, borderRadius: 16, padding: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)', flex: 1,
  },
  totalLabel:   { fontSize: 11, color: COLORS.goldDark, fontWeight: '700', textAlign: 'center', letterSpacing: 0.5, marginBottom: 8 },
  totalDivider: { width: 40, height: 1.5, backgroundColor: COLORS.gold, opacity: 0.5, marginBottom: 8 },
  totalNumber:  { fontSize: 34, fontWeight: '800', color: COLORS.goldLight },
  totalIcon:    { fontSize: 22, marginTop: 6 },
  progressCol:  { flex: 1.4, gap: 10, justifyContent: 'space-between' },
  progressCard: {
    backgroundColor: COLORS.deepBrown, borderRadius: 14, padding: 12,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)', flex: 1,
  },
  progressIconBox: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  progressIcon:    { fontSize: 16 },
  progressTextCol: { flex: 1 },
  progressLabel:   { fontSize: 10, color: COLORS.goldDark, marginBottom: 2 },
  progressNumber:  { fontSize: 20, fontWeight: '800', color: COLORS.goldLight },
});

// ─────────────────────────────────────────────────────────────────────────────
// PAATH COUNTER STYLES
// ─────────────────────────────────────────────────────────────────────────────
const ccStyles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16, backgroundColor: COLORS.warmBrown,
    borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)',
  },
  todayBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'center',
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 5, marginBottom: 16,
  },
  todayBadgeText:   { fontSize: 12, color: COLORS.creamDark },
  todayBadgeNumber: { fontSize: 14, fontWeight: '800', color: COLORS.goldLight, marginLeft: 4 },
  mainRow:          { flexDirection: 'row', gap: 16, alignItems: 'center' },
  counterCol:       { alignItems: 'center', gap: 8 },
  arrowBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderWidth: 1.5, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  arrowText:   { fontSize: 16, color: COLORS.goldLight, fontWeight: '800' },
  counterBox: {
    width: 90, height: 130, backgroundColor: COLORS.deepBrown,
    borderRadius: 16, borderWidth: 2.5, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  omSymbol:    { fontSize: 22 },
  counterText: { fontSize: 44, fontWeight: '800', color: COLORS.goldLight, lineHeight: 50 },
  swipeHint:   { fontSize: 9, color: COLORS.goldDark, letterSpacing: 0.5 },
  rightCol:    { flex: 1, gap: 14 },
  instructionsBox: {
    backgroundColor: 'rgba(201,162,39,0.08)', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },
  instrTitle: { fontSize: 12, fontWeight: '800', color: COLORS.goldLight, marginBottom: 8, letterSpacing: 0.3 },
  instrRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginBottom: 5 },
  instrDot:   { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.saffron, marginTop: 5, flexShrink: 0 },
  instrText:  { fontSize: 11, color: COLORS.creamDark, lineHeight: 16, flex: 1 },
  submitBtn: {
    backgroundColor: COLORS.gold, borderRadius: 22, paddingVertical: 13,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  submitBtnText: { color: COLORS.deepBrown, fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
});

// ─────────────────────────────────────────────────────────────────────────────
// EK MIN EK SAATH SECTION STYLES
// ─────────────────────────────────────────────────────────────────────────────
const pmStyles = StyleSheet.create({
  wrapper: { marginBottom: 4 },
  heroBanner: {
    backgroundColor: COLORS.purpleDeep, marginHorizontal: 16, borderRadius: 20,
    padding: 24, overflow: 'hidden', borderWidth: 1,
    borderColor: 'rgba(155,89,182,0.5)', alignItems: 'center',
    marginBottom: 14, position: 'relative',
  },
  decCircle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(107,63,160,0.25)', top: -60, right: -60,
  },
  decCircle2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(155,89,182,0.15)', bottom: -40, left: -30,
  },
  sacredTag: {
    backgroundColor: 'rgba(195,155,211,0.15)', borderWidth: 1,
    borderColor: 'rgba(195,155,211,0.4)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 4, marginBottom: 14,
  },
  sacredTagText:           { fontSize: 9, color: COLORS.purpleLight, letterSpacing: 2, fontWeight: '800' },
  deityEmoji:              { fontSize: 56, marginBottom: 10 },
  heroTitle:               { fontSize: 34, fontWeight: '800', color: COLORS.white, textAlign: 'center', lineHeight: 40, letterSpacing: 1 },
  heroTitleAccent:         { color: COLORS.goldLight, fontSize: 34, fontWeight: '800' },
  heroSubtitle:            { fontSize: 13, color: COLORS.purpleLight, letterSpacing: 1.5, marginTop: 4, marginBottom: 10, textTransform: 'uppercase', textAlign: 'center' },
  heroDesc:                { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20, fontStyle: 'italic', maxWidth: 280, marginBottom: 14 },
  datePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(155,89,182,0.2)', borderWidth: 1,
    borderColor: 'rgba(195,155,211,0.4)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  datePillText:            { fontSize: 11, color: COLORS.purpleLight, fontWeight: '600' },
  significanceBox: {
    backgroundColor: '#F8F0FF', marginHorizontal: 16, borderRadius: 16,
    padding: 18, borderWidth: 1, borderColor: 'rgba(155,89,182,0.2)', marginBottom: 14,
  },
  pmSectionLabel:          { fontSize: 9, letterSpacing: 2, color: COLORS.purpleMid, fontWeight: '800', marginBottom: 6 },
  significanceTitle:       { fontSize: 18, fontWeight: '800', color: COLORS.purpleDeep, marginBottom: 10, lineHeight: 24 },
  significanceTitleAccent: { color: COLORS.purpleMid },
  significanceDesc:        { fontSize: 13, color: '#4A3060', lineHeight: 20, fontStyle: 'italic', marginBottom: 14 },
  shlokaBox:               { backgroundColor: COLORS.purpleDeep, borderRadius: 12, padding: 14, borderLeftWidth: 3, borderLeftColor: COLORS.gold },
  shlokaDevanagari:        { fontSize: 12, color: COLORS.goldLight, lineHeight: 20, fontWeight: '600', marginBottom: 8 },
  shlokaTranslation:       { fontSize: 11, color: COLORS.purpleLight, fontStyle: 'italic', lineHeight: 17 },
  benefitsSection:         { paddingHorizontal: 16, marginBottom: 14 },
  benefitsGrid:            { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  benefitCard: {
    width: (width - 52) / 2, backgroundColor: COLORS.purpleDeep, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: 'rgba(155,89,182,0.4)', alignItems: 'center',
  },
  benefitIcon:             { fontSize: 28, marginBottom: 8 },
  benefitTitle:            { fontSize: 12, fontWeight: '800', color: COLORS.goldLight, textAlign: 'center', marginBottom: 4 },
  benefitDesc:             { fontSize: 10, color: COLORS.purpleLight, textAlign: 'center', lineHeight: 14, fontStyle: 'italic' },
  observanceBox: {
    backgroundColor: '#F8F0FF', marginHorizontal: 16, borderRadius: 16,
    padding: 18, borderWidth: 1, borderColor: 'rgba(155,89,182,0.2)', marginBottom: 14,
  },
  observanceRow:           { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  observanceIconBox:       { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.purpleDeep, alignItems: 'center', justifyContent: 'center' },
  observanceIcon:          { fontSize: 16 },
  observanceText:          { flex: 1, fontSize: 13, color: '#3D2060', lineHeight: 18 },
  ctaBtn: {
    backgroundColor: COLORS.purpleMid, marginHorizontal: 16, borderRadius: 24,
    paddingVertical: 15, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(195,155,211,0.5)', marginBottom: 6,
  },
  ctaBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },
});

// ─────────────────────────────────────────────────────────────────────────────
// PAATH DETAIL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const cdStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.deepBrown, paddingTop: 52,
    paddingHorizontal: 20, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: 'rgba(201,162,39,0.3)',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: COLORS.goldLight, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN STYLES
// ─────────────────────────────────────────────────────────────────────────────
const mainStyles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.deepBrown, paddingHorizontal: 20,
    paddingTop: 20, paddingBottom: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  greetingSmall: { fontSize: 11, color: COLORS.goldDark, letterSpacing: 0.5, marginBottom: 2 },
  greeting:      { fontSize: 22, fontWeight: '800', color: COLORS.cream, letterSpacing: 0.5 },
  notifBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: COLORS.saffron, borderWidth: 1, borderColor: COLORS.deepBrown,
  },
  quoteCard:      { margin: 16 },
  quoteCardInner: {
    backgroundColor: COLORS.warmBrown, borderRadius: 18,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)',
  },
  quoteTopStrip: {
    backgroundColor: 'rgba(201,162,39,0.15)', paddingVertical: 7,
    alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(201,162,39,0.2)',
  },
  quoteTopLabel:   { fontSize: 9, color: COLORS.goldLight, letterSpacing: 2, fontWeight: '700' },
  quoteImage:      { width: '100%', height: 180, backgroundColor: COLORS.richBrown },
  quoteOverlay:    { position: 'absolute', top: 34, left: 0, right: 0, height: 180, backgroundColor: 'rgba(44,26,10,0.3)' },
  quoteBody:       { padding: 18 },
  quoteIconText:   { fontSize: 32, color: COLORS.gold, lineHeight: 36, marginBottom: 4 },
  quoteText:       { fontSize: 14, color: COLORS.creamDark, lineHeight: 22, fontStyle: 'italic', marginBottom: 16 },
  startDayBtn:     { backgroundColor: COLORS.gold, paddingVertical: 11, paddingHorizontal: 24, borderRadius: 22, alignSelf: 'flex-start' },
  startDayBtnText: { color: COLORS.deepBrown, fontWeight: '800', fontSize: 13, letterSpacing: 0.3 },
  liveSection:     { paddingHorizontal: 16, marginBottom: 4 },
  liveTitleRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(229,57,53,0.15)',
    borderWidth: 1, borderColor: 'rgba(229,57,53,0.4)',
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3,
  },
  liveDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.liveRed },
  liveBadgeText: { fontSize: 9, color: COLORS.liveRed, fontWeight: '800', letterSpacing: 1 },
  liveTitle:     { fontSize: 17, fontWeight: '800', color: COLORS.deepBrown, letterSpacing: 0.3 },
  liveCard: {
    backgroundColor: COLORS.deepBrown, borderRadius: 16,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
  },
  liveImage:       { width: '100%', height: 160, backgroundColor: COLORS.richBrown },
  livePlayOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 160,
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(44,26,10,0.35)',
  },
  livePlayBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(201,162,39,0.2)',
    borderWidth: 2, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  liveCardBody:   { padding: 14 },
  liveDesc:       { fontSize: 13, color: COLORS.creamDark, lineHeight: 19, fontStyle: 'italic', marginBottom: 10 },
  liveMetaRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  liveTag: {
    backgroundColor: 'rgba(232,114,28,0.2)', borderWidth: 1,
    borderColor: 'rgba(232,114,28,0.45)', borderRadius: 10,
    paddingHorizontal: 9, paddingVertical: 3,
  },
  liveTagText:    { fontSize: 9, color: COLORS.saffronLight, fontWeight: '800', letterSpacing: 0.5 },
  liveWatching:   { fontSize: 11, color: COLORS.goldDark, fontStyle: 'italic' },
  chantsSection: {
    backgroundColor: COLORS.warmBrown, marginHorizontal: 16,
    borderRadius: 18, padding: 20,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)', alignItems: 'center',
  },
  chantsSectionTitle:  { fontSize: 20, fontWeight: '800', color: COLORS.cream, marginBottom: 6 },
  chantsSectionAccent: { color: COLORS.goldLight },
  chantsSectionDesc: {
    fontSize: 12, color: 'rgba(253,246,227,0.65)', textAlign: 'center',
    fontStyle: 'italic', lineHeight: 18, marginBottom: 16, maxWidth: 260,
  },
  chantsBtn:     { backgroundColor: COLORS.gold, paddingVertical: 13, paddingHorizontal: 32, borderRadius: 24 },
  chantsBtnText: { color: COLORS.deepBrown, fontWeight: '800', fontSize: 14, letterSpacing: 0.3 },
});