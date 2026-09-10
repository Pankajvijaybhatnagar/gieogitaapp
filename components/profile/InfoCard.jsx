import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';
import { C } from './constants';
import { hairline } from '@/constants/theme';
import { COLORS } from '@/constants/brandColors';

function SectionHeader({ iconName, label }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLine} />
      <View style={styles.sectionHeaderPill}>
        <FontAwesome name={iconName} size={10} color={C.goldDark} />
        <Text style={styles.sectionHeaderText}>{label}</Text>
      </View>
      <View style={styles.sectionHeaderLine} />
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconBox}>
        <FontAwesome name={icon} size={14} color={C.goldDark} />
      </View>
      <View style={styles.infoTextCol}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

export default function InfoCard({ user }) {
  return (
    <Animated.View entering={FadeInDown.delay(250)} style={styles.infoSection}>
      <SectionHeader iconName="user" label="ACCOUNT INFO" />
      <View style={styles.infoCard}>
        <InfoRow icon="user"       label="Full Name"     value={user?.name}  />
        <View style={styles.infoCardDivider} />
        <InfoRow icon="envelope"   label="Email Address" value={user?.email} />
        <View style={styles.infoCardDivider} />
        <InfoRow icon="phone"      label="Phone"         value={user?.phone} />
        <View style={styles.infoCardDivider} />
        <InfoRow icon="map-marker" label="City"          value={user?.city}  />
      </View>
    </Animated.View>
  );
}

// Also export SectionHeader so EditSection can reuse it
export { SectionHeader };

const styles = StyleSheet.create({
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.goldDark,
    opacity: 0.25
  },
  sectionHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.creamDark,
    borderWidth: 1,
    borderColor: C.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginHorizontal: 10
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.goldDark,
    letterSpacing: 2
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: hairline,
    overflow: 'hidden',
    shadowColor: C.deepBrown,
    shadowOpacity: 0.045,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 10,
    elevation: 2
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14
  },
  infoCardDivider: {
    height: 1,
    backgroundColor: C.goldBorder,
    marginHorizontal: 16,
    opacity: 0.5
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.goldPale,
    borderWidth: 1,
    borderColor: C.goldBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoTextCol: {
    flex: 1
  },
  infoLabel: {
    fontSize: 12,
    color: C.goldDark,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 2
  },
  infoValue: {
    fontSize: 14,
    color: C.deepBrown,
    fontWeight: '700'
  }
});