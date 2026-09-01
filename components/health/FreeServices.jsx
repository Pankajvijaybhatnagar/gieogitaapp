import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { FREE_SERVICES } from './constants';

import { SectionHead } from './SharedUI';

const { width } = Dimensions.get('window');

const isSmallScreen = width < 370;

export default function FreeServices() {
  return (
    <View style={styles.servicesSection}>
      <SectionHead label="FREE SERVICES" title="What's" accent="Covered?" />

      <View style={styles.servicesGrid}>
        {FREE_SERVICES.map((svc, i) => (
          <View key={i} style={styles.serviceCard}>
            {/* ICON */}
            <View style={styles.iconContainer}>
              <Text style={styles.serviceCardIcon}>{svc.icon}</Text>
            </View>

            {/* TITLE */}
            <Text style={styles.serviceCardTitle} numberOfLines={2}>
              {svc.title}
            </Text>

            {/* DECORATIVE LINE */}
            <View style={styles.smallLine} />

            {/* DESCRIPTION */}
            <Text style={styles.serviceCardDesc} numberOfLines={4}>
              {svc.desc}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // =========================================================
  // SECTION
  // =========================================================

  servicesSection: {
    paddingHorizontal: 18,
    paddingBottom: 8,
  },

  // =========================================================
  // GRID
  // =========================================================

  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },

  // =========================================================
  // CARD
  // =========================================================

  serviceCard: {
    width: '48.4%',

    minHeight: isSmallScreen ? 155 : 165,

    paddingHorizontal: 13,
    paddingVertical: 14,

    borderRadius: 16,

    backgroundColor: '#FFFDF8',

    borderWidth: 1,
    borderColor: '#DFCCAF',

    shadowColor: '#3a2c16',

    shadowOpacity: 0.08,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowRadius: 8,

    elevation: 3,
  },

  // =========================================================
  // ICON
  // =========================================================

  iconContainer: {
    width: 45,
    height: 45,

    borderRadius: 14,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 11,

    backgroundColor: '#F3E7D6',

    borderWidth: 1,
    borderColor: '#E1CFB5',
  },

  serviceCardIcon: {
    fontSize: 23,
  },

  // =========================================================
  // TITLE
  // =========================================================

  serviceCardTitle: {
    color: '#3a2c16',

    fontSize: isSmallScreen ? 11.5 : 12,

    fontWeight: '800',

    lineHeight: 16,

    marginBottom: 7,
  },

  // =========================================================
  // SMALL ACCENT
  // =========================================================

  smallLine: {
    width: 26,
    height: 2,

    borderRadius: 2,

    marginBottom: 7,

    backgroundColor: '#5a3816',
  },

  // =========================================================
  // DESCRIPTION
  // =========================================================

  serviceCardDesc: {
    flexShrink: 1,

    color: '#7C6952',

    fontSize: isSmallScreen ? 9 : 9.5,

    lineHeight: isSmallScreen ? 13 : 14,

    fontWeight: '500',
  },
});
