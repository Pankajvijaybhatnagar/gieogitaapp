import { StyleSheet, Text, View } from 'react-native';

import { SectionHead } from './SharedUI';

// ============================================================
// BRAND COLORS
// ============================================================

const COLORS = {
  darkBrown: '#3a2c16',
  brown: '#5a3816',

  mediumBrown: '#74512F',
  softBrown: '#957A5B',
  mutedBrown: '#A08B72',

  background: '#F4E9D8',
  biscuit: '#EEDFC9',
  biscuitLight: '#F8F1E7',

  cream: '#FFFDF8',
  white: '#FFFFFF',

  border: '#DDC8AA',
  borderSoft: '#E9DCC8',

  green: '#667747',
  greenLight: '#EFF3E8',
};

// ============================================================
// STATS
// ============================================================

const STATS = [
  {
    value: '45+',
    label: 'Specialties',
  },
  {
    value: '2500+',
    label: 'Beds',
  },
  {
    value: '1000+',
    label: 'Doctors',
  },
  {
    value: 'FREE',
    label: 'At GIEO',
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function AboutMedanta() {
  return (
    <View style={styles.aboutSection}>
      <SectionHead label="ABOUT" title="Medanta at" accent="GIEO GITA" />

      <View style={styles.aboutCard}>
        {/* ===================================================
            TOP ACCENT
        =================================================== */}

        <View style={styles.topAccent}>
          <View style={styles.topAccentDark} />
          <View style={styles.topAccentLight} />
        </View>

        {/* ===================================================
            HOSPITAL HEADER
        =================================================== */}

        <View style={styles.aboutLogoRow}>
          <View style={styles.aboutLogoOuter}>
            <View style={styles.aboutLogoBox}>
              <Text style={styles.aboutLogoText}>M</Text>
            </View>
          </View>

          <View style={styles.aboutLogoTextCol}>
            <Text style={styles.aboutSmallLabel}>HEALTHCARE PARTNER</Text>

            <Text style={styles.aboutLogoTitle}>Medanta — The Medicity</Text>

            <Text style={styles.aboutLogoSub}>
              India's Leading Multi-Specialty Hospital
            </Text>
          </View>
        </View>

        {/* ===================================================
            DIVIDER
        =================================================== */}

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
        </View>

        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <Text style={styles.aboutDesc}>
          Medanta is one of India's largest and most prestigious hospital
          groups. In a divine seva initiative, Medanta has partnered with GIEO
          GITA to provide FREE quality healthcare to devotees, pilgrims and
          visitors at Gita Gyan Sansthanam, Kurukshetra — bringing quality
          healthcare to the holy land.
        </Text>

        {/* ===================================================
            FREE SEVA HIGHLIGHT
        =================================================== */}

        <View style={styles.sevaHighlight}>
          <View style={styles.sevaIconBox}>
            <Text style={styles.sevaIcon}>+</Text>
          </View>

          <View style={styles.sevaTextArea}>
            <Text style={styles.sevaTitle}>Healthcare Seva</Text>

            <Text style={styles.sevaSubtitle}>
              Complimentary medical support at GIEO GITA
            </Text>
          </View>

          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>FREE</Text>
          </View>
        </View>

        {/* ===================================================
            STATS
        =================================================== */}

        <View style={styles.statsTitleRow}>
          <Text style={styles.statsTitle}>Medanta at a Glance</Text>

          <View style={styles.statsTitleLine} />
        </View>

        <View style={styles.aboutStatsRow}>
          {STATS.map((st, index) => {
            const isFree = st.value === 'FREE';

            return (
              <View
                key={st.label}
                style={[styles.aboutStatBox, isFree && styles.freeStatBox]}>
                <View
                  style={[styles.statTopLine, isFree && styles.freeStatTopLine]}
                />

                <Text
                  style={[
                    styles.aboutStatValue,
                    isFree && styles.freeStatValue,
                  ]}>
                  {st.value}
                </Text>

                <Text
                  style={[
                    styles.aboutStatLabel,
                    isFree && styles.freeStatLabel,
                  ]}>
                  {st.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // SECTION
  // ==========================================================

  aboutSection: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  // ==========================================================
  // MAIN CARD
  // ==========================================================

  aboutCard: {
    position: 'relative',

    overflow: 'hidden',

    backgroundColor: COLORS.cream,

    borderRadius: 20,

    paddingHorizontal: 17,
    paddingTop: 20,
    paddingBottom: 17,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.darkBrown,

    shadowOpacity: 0.09,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowRadius: 10,

    elevation: 3,
  },

  // ==========================================================
  // TOP ACCENT
  // ==========================================================

  topAccent: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,

    height: 4,

    flexDirection: 'row',
  },

  topAccentDark: {
    flex: 1,
    backgroundColor: COLORS.darkBrown,
  },

  topAccentLight: {
    flex: 1,
    backgroundColor: COLORS.brown,
  },

  // ==========================================================
  // LOGO
  // ==========================================================

  aboutLogoRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 15,
  },

  aboutLogoOuter: {
    width: 58,
    height: 58,

    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  aboutLogoBox: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: COLORS.brown,

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: COLORS.darkBrown,

    shadowOpacity: 0.15,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowRadius: 5,

    elevation: 2,
  },

  aboutLogoText: {
    fontSize: 20,

    fontWeight: '900',

    color: COLORS.white,
  },

  aboutLogoTextCol: {
    flex: 1,
  },

  aboutSmallLabel: {
    color: COLORS.softBrown,

    fontSize: 7.5,

    fontWeight: '800',

    letterSpacing: 1.2,

    marginBottom: 3,
  },

  aboutLogoTitle: {
    color: COLORS.darkBrown,

    fontSize: 14,

    fontWeight: '800',
  },

  aboutLogoSub: {
    color: COLORS.softBrown,

    fontSize: 9.5,

    lineHeight: 14,

    marginTop: 3,
  },

  // ==========================================================
  // DIVIDER
  // ==========================================================

  dividerRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 14,
  },

  dividerLine: {
    flex: 1,

    height: 1,

    backgroundColor: COLORS.borderSoft,
  },

  dividerDot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    marginHorizontal: 7,

    backgroundColor: COLORS.brown,
  },

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  aboutDesc: {
    color: '#665541',

    fontSize: 11.5,

    lineHeight: 18,

    marginBottom: 16,
  },

  // ==========================================================
  // SEVA HIGHLIGHT
  // ==========================================================

  sevaHighlight: {
    minHeight: 62,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 11,
    paddingVertical: 9,

    marginBottom: 18,

    borderRadius: 14,

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  sevaIconBox: {
    width: 37,
    height: 37,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,

    backgroundColor: COLORS.brown,
  },

  sevaIcon: {
    color: COLORS.white,

    fontSize: 22,

    fontWeight: '500',

    lineHeight: 24,
  },

  sevaTextArea: {
    flex: 1,

    paddingRight: 8,
  },

  sevaTitle: {
    color: COLORS.darkBrown,

    fontSize: 11.5,

    fontWeight: '800',

    marginBottom: 2,
  },

  sevaSubtitle: {
    color: COLORS.softBrown,

    fontSize: 8.5,

    lineHeight: 12.5,
  },

  freeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: COLORS.greenLight,

    borderWidth: 1,
    borderColor: '#CDD8B6',
  },

  freeBadgeText: {
    color: COLORS.green,

    fontSize: 8,

    fontWeight: '900',

    letterSpacing: 0.6,
  },

  // ==========================================================
  // STATS TITLE
  // ==========================================================

  statsTitleRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 11,
  },

  statsTitle: {
    color: COLORS.darkBrown,

    fontSize: 10.5,

    fontWeight: '800',

    marginRight: 9,
  },

  statsTitleLine: {
    flex: 1,

    height: 1,

    backgroundColor: COLORS.borderSoft,
  },

  // ==========================================================
  // STATS
  // ==========================================================

  aboutStatsRow: {
    flexDirection: 'row',

    marginHorizontal: -4,
  },

  aboutStatBox: {
    flex: 1,

    minHeight: 70,

    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: 4,

    paddingHorizontal: 4,
    paddingVertical: 10,

    borderRadius: 12,

    overflow: 'hidden',

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1,
    borderColor: COLORS.border,

    position: 'relative',
  },

  freeStatBox: {
    backgroundColor: COLORS.greenLight,

    borderColor: '#CDD8B6',
  },

  statTopLine: {
    position: 'absolute',

    top: 0,
    left: 8,
    right: 8,

    height: 2,

    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,

    backgroundColor: COLORS.brown,
  },

  freeStatTopLine: {
    backgroundColor: COLORS.green,
  },

  aboutStatValue: {
    color: COLORS.brown,

    fontSize: 15,

    fontWeight: '900',

    marginBottom: 3,
  },

  aboutStatLabel: {
    color: COLORS.softBrown,

    fontSize: 8,

    fontWeight: '600',

    textAlign: 'center',
  },

  freeStatValue: {
    color: COLORS.green,

    fontSize: 13,
  },

  freeStatLabel: {
    color: COLORS.green,
  },
});
