import { DESIGN } from '@/constants/design';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { adhyayList, COLORS } from './constant';
import { SectionHeader } from './Sharedui';

function AdhyayCard({ item }) {
  return (
    <TouchableOpacity style={styles.adhyayCard} activeOpacity={0.85}>
      <View style={styles.adhyayImg}>
        <Text style={styles.adhyayIcon}>{item.icon}</Text>
      </View>
      <View style={styles.adhyayBody}>
        <Text style={styles.adhyayNum}>{item.num}</Text>
        <Text style={styles.adhyayName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AdhyaySection() {
  return (
    <>
      <SectionHeader
        title="📖 Bhagwad Gita"
        accent="Adhyay"
        onSeeAll={() => {}}
        seeAllLabel="18 Chapters »"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScrollContent}>
        {adhyayList.map(item => (
          <AdhyayCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  hScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    gap: 12,
  },
  adhyayCard: {
    width: 112,
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  adhyayImg: {
    width: '100%',
    height: 76,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adhyayIcon: {
    fontSize: 30,
  },
  adhyayBody: {
    padding: 9,
  },
  adhyayNum: {
    fontSize: 12,
    color: COLORS.saffron,
    fontWeight: '600',
    letterSpacing: 1,
  },
  adhyayName: {
    fontSize: 12,
    color: COLORS.deepBrown,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 2,
  },
});
