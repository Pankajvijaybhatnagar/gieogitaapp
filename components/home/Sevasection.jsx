import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, sevaList } from './constant';
import { SectionHeader } from './Sharedui';

export default function SevaSection() {
  const router = useRouter();

  return (
    <>
      <SectionHeader title="🙏 Choose Your" accent="Seva" />
      <View style={styles.sevaBg}>
        <Text style={styles.sevaOverlayText}>॥</Text>
        <Text style={styles.sevaLabel}>SUPPORT OUR MISSION</Text>
        <Text style={styles.sevaTitle}>
          Be Part Of{' '}
          <Text style={styles.sevaTitleAccent}>Gita Seva</Text>
        </Text>
        <View style={styles.sevaChips}>
          {sevaList.map((seva) => (
            <TouchableOpacity
              key={seva.name}
              style={styles.sevaChip}
              activeOpacity={0.75}
              onPress={() => router.push(seva.route)}
            >
              <Text style={styles.sevaChipIcon}>{seva.icon}</Text>
              <Text style={styles.sevaChipText}>{seva.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sevaBg: {
    backgroundColor: COLORS.creamDark,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.45)',
    position: 'relative',
    overflow: 'hidden',
  },
  sevaOverlayText: {
    position: 'absolute',
    right: 14,
    top: 6,
    fontSize: 72,
    color: 'rgba(201,162,39,0.1)',
    lineHeight: 80,
  },
  sevaLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.saffron,
    fontWeight: '800',
    marginBottom: 4,
  },
  sevaTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.deepBrown,
    marginBottom: 12,
  },
  sevaTitleAccent: { color: COLORS.goldDark },
  sevaChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sevaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(44,26,10,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  sevaChipIcon: { fontSize: 12 },
  sevaChipText: {
    fontSize: 11,
    color: COLORS.warmBrown,
    fontWeight: '600',
  },
});