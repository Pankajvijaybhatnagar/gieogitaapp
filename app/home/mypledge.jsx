import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const C = {
  deepBrown:    '#2C1A0A',
  warmBrown:    '#4A2C0D',
  richBrown:    '#3D2010',
  gold:         '#C9A227',
  goldLight:    '#E8C55A',
  goldDark:     '#8B6914',
  goldPale:     'rgba(201,162,39,0.12)',
  goldBorder:   'rgba(201,162,39,0.30)',
  cream:        '#FDF6E3',
  creamDark:    '#F5E6C8',
  saffron:      '#E8721C',
  saffronLight: '#F4A44A',
  white:        '#FFFFFF',
  green:        '#27AE60',
  greenLight:   '#2ECC71',
};

// ─── UPI ID FOR PAYMENTS ──────────────────────────────────────────────────────
const UPI_ID   = 'gieogita@upi';     // ← replace with real UPI ID
const UPI_NAME = 'GIEO GITA Trust';

// ─── SEVA DATA WITH DESCRIPTIONS ─────────────────────────────────────────────
const SEVA_LIST = [
  {
    id: '1',
    name: 'Shringaar Seva',
    icon: '👑',
    amount: 501,
    desc: 'Offer divine adornments — flowers, jewels & silken garments to Shri Krishna. This seva beautifies the Lord and brings blessings of beauty, grace and prosperity to the devotee.',
    benefit: 'Beauty & Grace',
    category: 'Krishna Seva',
  },
  {
    id: '2',
    name: 'Aarti Seva',
    icon: '🪔',
    amount: 251,
    desc: 'Sponsor the daily Aarti at Gita Gyan Sansthanam, Kurukshetra. Five-lamp Aarti performed at sunrise and sunset in your name, spreading divine light and removing darkness.',
    benefit: 'Divine Light',
    category: 'Mandir Seva',
  },
  {
    id: '3',
    name: 'Anna Seva',
    icon: '🍛',
    amount: 1001,
    desc: 'Feed the hungry and the pilgrims visiting the temple. Food is offered as Prasad of the Lord. Anna Seva is said to be the highest seva — feeding one soul feeds the universe.',
    benefit: 'Health & Nourishment',
    category: 'Charity',
  },
  {
    id: '4',
    name: 'Gaushala Seva',
    icon: '🐄',
    amount: 501,
    desc: 'Care for sacred cows at GIEO Gaushala. Gau Seva (cow service) is among the most blessed acts in Sanatan Dharma — the cow is considered the earthly form of Kamadhenu.',
    benefit: 'Ancestral Blessings',
    category: 'Gau Seva',
  },
  {
    id: '5',
    name: 'Gau-Poojan Seva',
    icon: '🌸',
    amount: 351,
    desc: 'Sponsor a special Gau Poojan — ritual worship of the sacred cow with flowers, turmeric and ghee diyas. Performed on your behalf on auspicious dates and birthdays.',
    benefit: 'Prosperity & Peace',
    category: 'Gau Seva',
  },
  {
    id: '6',
    name: 'Gau-Grass Seva',
    icon: '🌿',
    amount: 101,
    desc: 'Provide fresh, nutritious grass and fodder for the cows at GIEO Gaushala for an entire day. Even the smallest offering to a cow earns immeasurable divine merit.',
    benefit: 'Daily Merit',
    category: 'Gau Seva',
  },
  {
    id: '7',
    name: 'Gau-Chikitsa Seva',
    icon: '💊',
    amount: 751,
    desc: 'Fund veterinary care and medicine for injured or ailing cows. Healing a sacred cow is equivalent to performing thousands of yagnas according to the scriptures.',
    benefit: 'Good Health',
    category: 'Gau Seva',
  },
  {
    id: '8',
    name: 'Krishna Rajbhog Seva',
    icon: '🍱',
    amount: 1001,
    desc: 'Offer a grand midday Rajbhog (royal feast) to Shri Krishna including 56 types of dishes. Your name is announced during the offering. Ideal for birthdays and anniversaries.',
    benefit: 'Abundance',
    category: 'Krishna Seva',
  },
  {
    id: '9',
    name: 'Krishna Phool Bangla Seva',
    icon: '🌺',
    amount: 2101,
    desc: "Sponsor a magnificent floral decoration (Phool Bangla) for Krishna — the deity's sanctum is beautifully adorned with fresh flowers in your honour on the requested date.",
    benefit: 'Joy & Celebration',
    category: 'Krishna Seva',
  },
  {
    id: '10',
    name: 'Krishna Bhog Seva',
    icon: '🥣',
    amount: 501,
    desc: 'Offer a special Bhog (sacred food) to Shri Krishna. Prepared with love and devotion in the temple kitchen and offered with Vedic mantras before being distributed as Prasad.',
    benefit: 'Fulfilment of Wishes',
    category: 'Krishna Seva',
  },
  {
    id: '11',
    name: 'Vidya Seva',
    icon: '📚',
    amount: 1001,
    desc: 'Support the education of underprivileged children through Bal Sanskar programs. Fund books, uniforms and Vedic education. Vidya (knowledge) is the greatest gift you can give.',
    benefit: 'Wisdom & Education',
    category: 'Charity',
  },
  {
    id: '12',
    name: 'Chikitsa Seva',
    icon: '🏥',
    amount: 501,
    desc: 'Provide free medical assistance and medicines to the poor, pilgrims, and needy devotees who visit GIEO Gita. Seva performed in the name of your loved ones.',
    benefit: 'Health & Healing',
    category: 'Charity',
  },
  {
    id: '13',
    name: 'Jal Seva',
    icon: '💧',
    amount: 201,
    desc: 'Sponsor pure drinking water and refreshments for pilgrims and visitors at GIEO Gita events. Offering water is considered equivalent to performing Teertha Yatra.',
    benefit: 'Purity & Peace',
    category: 'Charity',
  },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Krishna Seva', 'Gau Seva', 'Mandir Seva', 'Charity'];

// ─── OCCASION TYPES ───────────────────────────────────────────────────────────
const OCCASIONS = [
  { label: 'Birthday',          icon: '🎂' },
  { label: 'Anniversary',       icon: '💍' },
  { label: 'In Memory Of',      icon: '🙏' },
  { label: 'Festival',          icon: '🪔' },
  { label: 'General Donation',  icon: '💛' },
];

// ─── GOLD DIVIDER ─────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <View style={S.dividerRow}>
      <View style={S.dividerLine} />
      <Text style={S.dividerIcon}>🔱</Text>
      <View style={S.dividerLine} />
    </View>
  );
}

// ─── SEVA CARD ────────────────────────────────────────────────────────────────
function SevaCard({ seva, onDonate }) {
  const [expanded, setExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.timing(anim, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const maxHeight = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 160] });

  return (
    <View style={S.sevaCard}>
      {/* Category badge */}
      <View style={S.sevaCategoryBadge}>
        <Text style={S.sevaCategoryText}>{seva.category}</Text>
      </View>

      {/* Main row */}
      <View style={S.sevaMainRow}>
        <View style={S.sevaIconBox}>
          <Text style={S.sevaIcon}>{seva.icon}</Text>
        </View>
        <View style={S.sevaInfo}>
          <Text style={S.sevaName}>{seva.name}</Text>
          <Text style={S.sevaBenefit}>✨ {seva.benefit}</Text>
          <Text style={S.sevaAmount}>₹ {seva.amount.toLocaleString()}</Text>
        </View>
        <View style={S.sevaActions}>
          <TouchableOpacity style={S.expandBtn} onPress={toggle} activeOpacity={0.8}>
            <FontAwesome name={expanded ? 'chevron-up' : 'chevron-down'} size={11} color={C.goldDark} />
          </TouchableOpacity>
          <TouchableOpacity style={S.donateSmallBtn} onPress={() => onDonate(seva)} activeOpacity={0.85}>
            <Text style={S.donateSmallBtnText}>Donate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expandable description */}
      <Animated.View style={[S.sevaDescWrap, { maxHeight, overflow: 'hidden' }]}>
        <View style={S.sevaDescInner}>
          <Text style={S.sevaDesc}>{seva.desc}</Text>
          <TouchableOpacity
            style={S.donateLargeBtn}
            onPress={() => onDonate(seva)}
            activeOpacity={0.85}
          >
            <FontAwesome name="heart" size={12} color={C.deepBrown} style={{ marginRight: 6 }} />
            <Text style={S.donateLargeBtnText}>Donate ₹{seva.amount} — {seva.name}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
function PaymentModal({ visible, seva, onClose }) {
  const [name,        setName]        = useState('');
  const [phone,       setPhone]       = useState('');
  const [occasion,    setOccasion]    = useState('General Donation');
  const [customAmt,   setCustomAmt]   = useState('');

  const amount = customAmt ? parseInt(customAmt, 10) : seva?.amount || 0;

  const openUPI = (app) => {
    if (!name.trim()) {
      Alert.alert('🙏 Required', 'Please enter your name before proceeding.');
      return;
    }
    const note    = `${seva?.name} - ${occasion} - ${name}`;
    const upiUrl  = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    let intentUrl = upiUrl;
    if (app === 'gpay')  intentUrl = `gpay://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    if (app === 'bhim')  intentUrl = `bhim://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    if (app === 'phone') intentUrl = `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    if (app === 'paytm') intentUrl = `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    Linking.canOpenURL(intentUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(intentUrl);
        } else {
          // Fallback to generic UPI
          Linking.openURL(upiUrl).catch(() =>
            Alert.alert('🙏 App not found', `Please install ${app === 'gpay' ? 'Google Pay' : app === 'bhim' ? 'BHIM' : app === 'phone' ? 'PhonePe' : 'Paytm'} or use UPI ID: ${UPI_ID}`)
          );
        }
      });
  };

  if (!seva) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={PM.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={PM.sheet}>
          {/* Handle */}
          <View style={PM.handle} />

          {/* Header */}
          <View style={PM.header}>
            <View style={PM.headerBlob} />
            <Text style={PM.headerEmoji}>{seva.icon}</Text>
            <Text style={PM.headerTitle}>{seva.name}</Text>
            <Text style={PM.headerDesc}>{seva.benefit}</Text>
            <TouchableOpacity style={PM.closeBtn} onPress={onClose}>
              <FontAwesome name="times" size={14} color={C.goldLight} />
            </TouchableOpacity>
          </View>

          <ScrollView style={PM.body} showsVerticalScrollIndicator={false}>

            {/* Amount row */}
            <View style={PM.amountRow}>
              <View style={PM.amountBox}>
                <Text style={PM.amountLabel}>Suggested Amount</Text>
                <Text style={PM.amountValue}>₹ {seva.amount.toLocaleString()}</Text>
              </View>
              <View style={PM.amountInput}>
                <Text style={PM.amountLabel}>Custom Amount</Text>
                <TextInput
                  style={PM.amountTextInput}
                  placeholder="Enter ₹"
                  placeholderTextColor={C.goldDark}
                  keyboardType="numeric"
                  value={customAmt}
                  onChangeText={setCustomAmt}
                />
              </View>
            </View>

            {/* Devotee name */}
            <Text style={PM.fieldLabel}>Your Name *</Text>
            <TextInput
              style={PM.textInput}
              placeholder="Enter your name"
              placeholderTextColor={C.goldDark}
              value={name}
              onChangeText={setName}
            />

            {/* Phone */}
            <Text style={PM.fieldLabel}>Phone (optional)</Text>
            <TextInput
              style={PM.textInput}
              placeholder="For donation receipt"
              placeholderTextColor={C.goldDark}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            {/* Occasion */}
            <Text style={PM.fieldLabel}>Occasion</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={PM.occasionScroll}>
              {OCCASIONS.map((o) => (
                <TouchableOpacity
                  key={o.label}
                  style={[PM.occasionChip, occasion === o.label && PM.occasionChipActive]}
                  onPress={() => setOccasion(o.label)}
                  activeOpacity={0.8}
                >
                  <Text style={PM.occasionIcon}>{o.icon}</Text>
                  <Text style={[PM.occasionLabel, occasion === o.label && PM.occasionLabelActive]}>
                    {o.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Occasion note */}
            {occasion !== 'General Donation' && (
              <View style={PM.occasionNote}>
                <Text style={PM.occasionNoteText}>
                  🪷 This seva will be performed on behalf of{' '}
                  <Text style={{ fontWeight: '800' }}>{name || 'you'}</Text> for{' '}
                  <Text style={{ fontWeight: '800' }}>{occasion}</Text>. A divine ritual will be conducted at Gita Gyan Sansthanam, Kurukshetra in your honour.
                </Text>
              </View>
            )}

            {/* Total */}
            <View style={PM.totalRow}>
              <Text style={PM.totalLabel}>Total Donation</Text>
              <Text style={PM.totalAmount}>₹ {amount.toLocaleString()}</Text>
            </View>

            {/* Pay buttons */}
            <Text style={PM.payLabel}>Choose Payment App</Text>
            <View style={PM.payGrid}>

              <TouchableOpacity style={[PM.payBtn, { backgroundColor: '#1A73E8' }]} onPress={() => openUPI('gpay')} activeOpacity={0.85}>
                <Text style={PM.payBtnEmoji}>G</Text>
                <Text style={PM.payBtnText}>Google Pay</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[PM.payBtn, { backgroundColor: '#00BAF2' }]} onPress={() => openUPI('bhim')} activeOpacity={0.85}>
                <Text style={PM.payBtnEmoji}>₹</Text>
                <Text style={PM.payBtnText}>BHIM UPI</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[PM.payBtn, { backgroundColor: '#5F259F' }]} onPress={() => openUPI('phone')} activeOpacity={0.85}>
                <Text style={PM.payBtnEmoji}>Pe</Text>
                <Text style={PM.payBtnText}>PhonePe</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[PM.payBtn, { backgroundColor: '#00B9F1' }]} onPress={() => openUPI('paytm')} activeOpacity={0.85}>
                <Text style={PM.payBtnEmoji}>P</Text>
                <Text style={PM.payBtnText}>Paytm</Text>
              </TouchableOpacity>

            </View>

            {/* Any UPI button */}
            <TouchableOpacity style={PM.anyUpiBtn} onPress={() => openUPI('any')} activeOpacity={0.85}>
              <FontAwesome name="mobile" size={16} color={C.deepBrown} style={{ marginRight: 8 }} />
              <Text style={PM.anyUpiBtnText}>Pay with Any UPI App</Text>
            </TouchableOpacity>

            {/* UPI ID copy */}
            <View style={PM.upiIdRow}>
              <Text style={PM.upiIdLabel}>UPI ID: </Text>
              <Text style={PM.upiIdValue}>{UPI_ID}</Text>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function MyPledgeScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSeva,   setSelectedSeva]   = useState(null);
  const [modalVisible,   setModalVisible]   = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  const filteredSeva = activeCategory === 'All'
    ? SEVA_LIST
    : SEVA_LIST.filter((s) => s.category === activeCategory);

  const handleDonate = (seva) => {
    setSelectedSeva(seva);
    setModalVisible(true);
  };

  return (
    <View style={S.root}>
      <ScrollView style={S.scroll} showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════
            HERO BANNER
        ══════════════════════════════ */}
        <Animated.View style={[S.hero, { opacity: fadeAnim }]}>
          <View style={S.heroBlob1} />
          <View style={S.heroBlob2} />
          <Text style={S.heroOm}>ॐ</Text>

          <View style={S.heroPill}>
            <Text style={S.heroPillText}>✦ GIEO GITA  •  SEVA & DONATION ✦</Text>
          </View>

          <Text style={S.heroTitle}>
            Be Part Of{'\n'}
            <Text style={S.heroTitleAccent}>Gita Seva</Text>
          </Text>
          <Text style={S.heroDesc}>
            Every donation is a divine offering to Shri Krishna. Your seva supports temple rituals, cow protection, Vedic education and care for the needy — performed in your name with full devotion.
          </Text>

          {/* Feature pills */}
          <View style={S.heroPillsRow}>
            {['🎂 Birthday Rituals', '📿 Performed in Your Name', '🐄 Gau Seva'].map((p) => (
              <View key={p} style={S.heroFeaturePill}>
                <Text style={S.heroFeaturePillText}>{p}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ══════════════════════════════
            HOW IT WORKS
        ══════════════════════════════ */}
        <View style={S.howSection}>
          <View style={S.sectionHeader}>
            <View style={S.sectionLine} />
            <View style={S.sectionPill}>
              <Text style={S.sectionPillText}>HOW IT WORKS</Text>
            </View>
            <View style={S.sectionLine} />
          </View>

          <View style={S.stepsRow}>
            {[
              { num: '01', icon: '🙏', title: 'Choose Seva',    desc: 'Pick any seva from the list below'                 },
              { num: '02', icon: '📝', title: 'Your Occasion',  desc: 'Birthday, anniversary, in memory of a loved one'   },
              { num: '03', icon: '💸', title: 'Donate via UPI', desc: 'Pay instantly with Google Pay, BHIM, PhonePe'      },
              { num: '04', icon: '🪷', title: 'Seva Performed', desc: 'Ritual done at temple in your name on that date'   },
            ].map((step) => (
              <View key={step.num} style={S.stepCard}>
                <View style={S.stepNumBadge}>
                  <Text style={S.stepNum}>{step.num}</Text>
                </View>
                <Text style={S.stepIcon}>{step.icon}</Text>
                <Text style={S.stepTitle}>{step.title}</Text>
                <Text style={S.stepDesc}>{step.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <GoldDivider />

        {/* ══════════════════════════════
            CATEGORY FILTER
        ══════════════════════════════ */}
        <View style={S.categorySection}>
          <Text style={S.categoryTitle}>Choose Your <Text style={S.categoryTitleAccent}>Seva</Text></Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[S.categoryChip, activeCategory === cat && S.categoryChipActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[S.categoryChipText, activeCategory === cat && S.categoryChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ══════════════════════════════
            SEVA CARDS
        ══════════════════════════════ */}
        <View style={S.sevaList}>
          {filteredSeva.map((seva) => (
            <SevaCard key={seva.id} seva={seva} onDonate={handleDonate} />
          ))}
        </View>

        <GoldDivider />

        {/* ══════════════════════════════
            BIRTHDAY / OCCASION BANNER
        ══════════════════════════════ */}
        <View style={S.birthdayBanner}>
          <View style={S.birthdayBannerBlob} />
          <Text style={S.birthdayBannerEmoji}>🎂</Text>
          <Text style={S.birthdayBannerTitle}>
            Celebrate Birthdays &{'\n'}
            <Text style={S.birthdayBannerAccent}>Special Occasions</Text>
            {'\n'}with Divine Seva
          </Text>
          <Text style={S.birthdayBannerDesc}>
            On your behalf, our priests perform a sacred ritual — Gau Poojan, Shringaar, Aarti or Krishna Bhog — at Gita Gyan Sansthanam, Kurukshetra. Your name is announced during the ritual. You receive blessings and Prasad.
          </Text>
          <View style={S.birthdayPoints}>
            {[
              '🪷 Ritual performed by trained temple priests',
              '📸 Photo/video update shared with you',
              '📿 Your name announced in the prayer',
              '🎁 Prasad dispatched on request',
            ].map((p, i) => (
              <View key={i} style={S.birthdayPoint}>
                <Text style={S.birthdayPointText}>{p}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={S.birthdayBtn}
            onPress={() => handleDonate(SEVA_LIST[4])}
            activeOpacity={0.85}
          >
            <Text style={S.birthdayBtnText}>🎂  Book Birthday Seva</Text>
          </TouchableOpacity>
        </View>

        <GoldDivider />

        {/* ══════════════════════════════
            TRUST & ASSURANCE
        ══════════════════════════════ */}
        <View style={S.trustSection}>
          <View style={S.sectionHeader}>
            <View style={S.sectionLine} />
            <View style={S.sectionPill}>
              <Text style={S.sectionPillText}>OUR COMMITMENT</Text>
            </View>
            <View style={S.sectionLine} />
          </View>
          <View style={S.trustGrid}>
            {[
              { icon: '🛡️', title: '100% Transparent',  desc: 'All donations go directly to temple seva'        },
              { icon: '📜', title: 'Tax Exemption',      desc: '80G certificate available on request'           },
              { icon: '🏛️', title: 'Registered Trust',   desc: 'GIEO Gita is a registered charitable trust'    },
              { icon: '🤝', title: 'Seva Receipt',       desc: 'Digital seva confirmation sent to your number'  },
            ].map((t) => (
              <View key={t.title} style={S.trustCard}>
                <Text style={S.trustIcon}>{t.icon}</Text>
                <Text style={S.trustTitle}>{t.title}</Text>
                <Text style={S.trustDesc}>{t.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ══════════════════════════════
            CONTACT FOOTER
        ══════════════════════════════ */}
        <View style={S.contactBox}>
          <Text style={S.contactTitle}>🙏  Need Help with Seva?</Text>
          <Text style={S.contactDesc}>
            For large donations, custom sevas or special occasions, our seva team is happy to assist you personally.
          </Text>
          <View style={S.contactRow}>
            <TouchableOpacity
              style={S.contactBtn}
              onPress={() => Linking.openURL('tel:+919999999999')}
              activeOpacity={0.85}
            >
              <FontAwesome name="phone" size={13} color={C.deepBrown} />
              <Text style={S.contactBtnText}>Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.contactBtn, { backgroundColor: C.saffron }]}
              onPress={() => Linking.openURL('https://wa.me/919999999999')}
              activeOpacity={0.85}
            >
              <FontAwesome name="whatsapp" size={13} color={C.white} />
              <Text style={[S.contactBtnText, { color: C.white }]}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── PAYMENT MODAL ── */}
      <PaymentModal
        visible={modalVisible}
        seva={selectedSeva}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

// ─── MAIN STYLES ──────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.cream },
  scroll: { flex: 1 },

  // DIVIDER
  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.3 },
  dividerIcon: { fontSize: 14, marginHorizontal: 10 },

  // HERO
  hero: {
    backgroundColor: C.deepBrown,
    paddingTop: 24, paddingBottom: 28,
    paddingHorizontal: 22,
    position: 'relative', overflow: 'hidden',
  },
  heroBlob1: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(201,162,39,0.06)', top: -80, right: -60 },
  heroBlob2: { position: 'absolute', width: 140, height: 140, borderRadius: 70,  backgroundColor: 'rgba(74,44,13,0.2)',    bottom: -50, left: -40 },
  heroOm:    { position: 'absolute', right: 20, top: 10, fontSize: 100, color: 'rgba(201,162,39,0.05)', lineHeight: 110 },

  heroPill: {
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
    alignSelf: 'flex-start', marginBottom: 16,
  },
  heroPillText:  { fontSize: 9, color: C.goldLight, letterSpacing: 2, fontWeight: '800' },
  heroTitle:     { fontSize: 28, fontWeight: '800', color: C.cream, lineHeight: 34, marginBottom: 10 },
  heroTitleAccent: { color: C.goldLight },
  heroDesc:      { fontSize: 13, color: 'rgba(253,246,227,0.7)', lineHeight: 20, fontStyle: 'italic', marginBottom: 16 },
  heroPillsRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  heroFeaturePill: {
    backgroundColor: 'rgba(232,114,28,0.15)',
    borderWidth: 1, borderColor: 'rgba(232,114,28,0.35)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  heroFeaturePillText: { fontSize: 10, color: C.saffronLight, fontWeight: '700' },

  // HOW IT WORKS
  howSection:  { paddingHorizontal: 16, paddingTop: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionLine:   { flex: 1, height: 1, backgroundColor: C.goldDark, opacity: 0.25 },
  sectionPill: {
    backgroundColor: C.creamDark, borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginHorizontal: 10,
  },
  sectionPillText: { fontSize: 9, fontWeight: '800', color: C.goldDark, letterSpacing: 2 },
  stepsRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stepCard: {
    width: (width - 52) / 2,
    backgroundColor: C.deepBrown,
    borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center',
  },
  stepNumBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.gold,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  stepNum:   { fontSize: 11, fontWeight: '800', color: C.deepBrown },
  stepIcon:  { fontSize: 24, marginBottom: 6 },
  stepTitle: { fontSize: 12, fontWeight: '800', color: C.goldLight, textAlign: 'center', marginBottom: 4 },
  stepDesc:  { fontSize: 10, color: 'rgba(253,246,227,0.6)', textAlign: 'center', lineHeight: 14, fontStyle: 'italic' },

  // CATEGORY
  categorySection: { paddingHorizontal: 16, paddingTop: 4 },
  categoryTitle:   { fontSize: 18, fontWeight: '800', color: C.deepBrown, marginBottom: 12 },
  categoryTitleAccent: { color: C.goldDark },
  categoryScroll:  { marginBottom: 16 },
  categoryChip: {
    backgroundColor: C.creamDark,
    borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipActive: { backgroundColor: C.deepBrown, borderColor: C.gold },
  categoryChipText:   { fontSize: 12, color: C.warmBrown, fontWeight: '600' },
  categoryChipTextActive: { color: C.goldLight },

  // SEVA LIST
  sevaList: { paddingHorizontal: 16, gap: 12 },

  // SEVA CARD
  sevaCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1, borderColor: C.goldBorder,
    overflow: 'hidden',
    shadowColor: C.deepBrown, shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10,
    elevation: 2,
  },
  sevaCategoryBadge: {
    backgroundColor: C.deepBrown,
    paddingHorizontal: 12, paddingVertical: 4,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 12,
  },
  sevaCategoryText:  { fontSize: 8, color: C.goldDark, letterSpacing: 1.5, fontWeight: '800' },
  sevaMainRow:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  sevaIconBox: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: C.creamDark,
    borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  sevaIcon:     { fontSize: 26 },
  sevaInfo:     { flex: 1 },
  sevaName:     { fontSize: 13, fontWeight: '800', color: C.deepBrown, marginBottom: 2 },
  sevaBenefit:  { fontSize: 10, color: C.saffron, fontStyle: 'italic', marginBottom: 4 },
  sevaAmount:   { fontSize: 16, fontWeight: '800', color: C.goldDark },
  sevaActions:  { alignItems: 'center', gap: 8 },
  expandBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.creamDark, borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  donateSmallBtn: {
    backgroundColor: C.gold, borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  donateSmallBtnText: { fontSize: 11, fontWeight: '800', color: C.deepBrown },
  sevaDescWrap:  {},
  sevaDescInner: {
    backgroundColor: C.creamDark,
    borderTopWidth: 1, borderTopColor: C.goldBorder,
    padding: 14,
  },
  sevaDesc: { fontSize: 12, color: C.warmBrown, lineHeight: 19, fontStyle: 'italic', marginBottom: 12 },
  donateLargeBtn: {
    backgroundColor: C.gold, borderRadius: 20,
    paddingVertical: 11, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  donateLargeBtnText: { fontSize: 12, fontWeight: '800', color: C.deepBrown },

  // BIRTHDAY BANNER
  birthdayBanner: {
    backgroundColor: C.warmBrown,
    marginHorizontal: 16, borderRadius: 20, padding: 22,
    borderWidth: 1, borderColor: C.goldBorder,
    position: 'relative', overflow: 'hidden',
    alignItems: 'center',
  },
  birthdayBannerBlob: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(201,162,39,0.07)', top: -60, right: -50,
  },
  birthdayBannerEmoji: { fontSize: 44, marginBottom: 12 },
  birthdayBannerTitle: {
    fontSize: 20, fontWeight: '800', color: C.cream,
    textAlign: 'center', lineHeight: 28, marginBottom: 10,
  },
  birthdayBannerAccent: { color: C.goldLight },
  birthdayBannerDesc: {
    fontSize: 12, color: 'rgba(253,246,227,0.7)',
    textAlign: 'center', lineHeight: 19, fontStyle: 'italic',
    marginBottom: 16,
  },
  birthdayPoints: { width: '100%', gap: 8, marginBottom: 18 },
  birthdayPoint: {
    backgroundColor: 'rgba(201,162,39,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  birthdayPointText: { fontSize: 12, color: C.creamDark },
  birthdayBtn: {
    backgroundColor: C.gold, borderRadius: 24,
    paddingVertical: 13, paddingHorizontal: 28,
  },
  birthdayBtnText: { fontSize: 14, fontWeight: '800', color: C.deepBrown, letterSpacing: 0.3 },

  // TRUST SECTION
  trustSection: { paddingHorizontal: 16, paddingTop: 4 },
  trustGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  trustCard: {
    width: (width - 52) / 2,
    backgroundColor: C.deepBrown, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center',
  },
  trustIcon:  { fontSize: 26, marginBottom: 8 },
  trustTitle: { fontSize: 12, fontWeight: '800', color: C.goldLight, textAlign: 'center', marginBottom: 4 },
  trustDesc:  { fontSize: 10, color: 'rgba(253,246,227,0.6)', textAlign: 'center', lineHeight: 14, fontStyle: 'italic' },

  // CONTACT
  contactBox: {
    backgroundColor: C.creamDark, marginHorizontal: 16,
    borderRadius: 18, padding: 20, marginTop: 4,
    borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center',
  },
  contactTitle: { fontSize: 16, fontWeight: '800', color: C.deepBrown, marginBottom: 8 },
  contactDesc:  { fontSize: 12, color: C.warmBrown, textAlign: 'center', lineHeight: 18, fontStyle: 'italic', marginBottom: 14 },
  contactRow:   { flexDirection: 'row', gap: 10 },
  contactBtn: {
    backgroundColor: C.gold, borderRadius: 20,
    paddingVertical: 10, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  contactBtnText: { fontSize: 13, fontWeight: '800', color: C.deepBrown },
});

// ─── PAYMENT MODAL STYLES ─────────────────────────────────────────────────────
const PM = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: C.cream,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 2, borderTopColor: C.gold,
    maxHeight: '90%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: C.goldDark, alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },
  header: {
    backgroundColor: C.deepBrown, padding: 20,
    alignItems: 'center', position: 'relative', overflow: 'hidden',
    borderBottomWidth: 1, borderBottomColor: C.gold,
  },
  headerBlob: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(201,162,39,0.07)', top: -60, right: -50,
  },
  headerEmoji: { fontSize: 36, marginBottom: 6 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.cream },
  headerDesc:  { fontSize: 11, color: C.goldDark, fontStyle: 'italic', marginTop: 3 },
  closeBtn: {
    position: 'absolute', top: 12, right: 14,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  body: { paddingHorizontal: 20 },

  amountRow: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 6 },
  amountBox: {
    flex: 1, backgroundColor: C.deepBrown, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center',
  },
  amountLabel: { fontSize: 10, color: C.goldDark, fontWeight: '700', marginBottom: 4 },
  amountValue: { fontSize: 22, fontWeight: '800', color: C.goldLight },
  amountInput: {
    flex: 1, backgroundColor: C.creamDark, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: C.goldBorder,
  },
  amountTextInput: {
    fontSize: 20, fontWeight: '800', color: C.deepBrown,
    borderBottomWidth: 1, borderBottomColor: C.goldBorder, paddingVertical: 2,
  },

  fieldLabel:   { fontSize: 11, fontWeight: '700', color: C.goldDark, marginTop: 12, marginBottom: 6, letterSpacing: 0.5 },
  textInput: {
    backgroundColor: C.white, borderRadius: 12,
    borderWidth: 1, borderColor: C.goldBorder,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, color: C.deepBrown,
  },

  occasionScroll: { marginTop: 2, marginBottom: 4 },
  occasionChip: {
    alignItems: 'center', backgroundColor: C.creamDark,
    borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 14, padding: 10, marginRight: 8, minWidth: 80,
  },
  occasionChipActive: { backgroundColor: C.deepBrown, borderColor: C.gold },
  occasionIcon:  { fontSize: 18, marginBottom: 4 },
  occasionLabel: { fontSize: 10, color: C.warmBrown, fontWeight: '600', textAlign: 'center' },
  occasionLabelActive: { color: C.goldLight },

  occasionNote: {
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 12, padding: 12, marginTop: 10,
    borderWidth: 1, borderColor: C.goldBorder,
    borderLeftWidth: 3, borderLeftColor: C.gold,
  },
  occasionNoteText: { fontSize: 12, color: C.warmBrown, lineHeight: 18, fontStyle: 'italic' },

  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: C.deepBrown, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 12,
    marginTop: 14, marginBottom: 4,
    borderWidth: 1, borderColor: C.goldBorder,
  },
  totalLabel:  { fontSize: 13, color: C.goldDark, fontWeight: '700' },
  totalAmount: { fontSize: 22, fontWeight: '800', color: C.goldLight },

  payLabel: { fontSize: 11, fontWeight: '800', color: C.goldDark, letterSpacing: 1, marginTop: 14, marginBottom: 10 },
  payGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  payBtn: {
    width: (width - 60) / 2,
    borderRadius: 14, paddingVertical: 13,
    alignItems: 'center', flexDirection: 'row',
    justifyContent: 'center', gap: 8,
  },
  payBtnEmoji: { fontSize: 16, fontWeight: '900', color: C.white },
  payBtnText:  { fontSize: 13, fontWeight: '800', color: C.white },

  anyUpiBtn: {
    backgroundColor: C.gold, borderRadius: 22,
    paddingVertical: 13, marginTop: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  anyUpiBtnText: { fontSize: 14, fontWeight: '800', color: C.deepBrown },

  upiIdRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 10,
  },
  upiIdLabel: { fontSize: 11, color: C.goldDark },
  upiIdValue: { fontSize: 12, fontWeight: '800', color: C.deepBrown },
});