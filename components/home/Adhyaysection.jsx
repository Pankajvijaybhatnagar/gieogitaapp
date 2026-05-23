import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        title="📖 Bhagavad Gita"
        accent="Adhyay"
        onSeeAll={() => {}}
        seeAllLabel="18 Chapters »"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScrollContent}
      >
        {adhyayList.map((item) => (
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
    backgroundColor: COLORS.creamDark,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.45)',
  },
  adhyayImg: {
    width: '100%',
    height: 76,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adhyayIcon: { fontSize: 30 },
  adhyayBody: { padding: 9 },
  adhyayNum: {
    fontSize: 9,
    color: COLORS.saffron,
    fontWeight: '800',
    letterSpacing: 1,
  },
  adhyayName: {
    fontSize: 11,
    color: COLORS.deepBrown,
    fontWeight: '700',
    lineHeight: 15,
    marginTop: 2,
  },
});