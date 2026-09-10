import { StyleSheet, Text, View } from 'react-native';
import PatrikaCard from './PatrikaCard';

import { COLORS } from '@/constants/brandColors';
import { hairline, radii } from '@/constants/theme';

export default function PatrikaGrid({
  data = [],
  locked = false,
  onPress,
}) {
  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No Patrika Available</Text>
        <Text style={styles.emptyText}>
          New monthly issues will appear here when published.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {data.map((item, index) => (
        <PatrikaCard
          key={item?.id ?? item?.slug ?? index}
          item={item}
          locked={locked}
          onPress={onPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  empty: {
    minHeight: 170,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.deepBrown
  },
  emptyText: {
    marginTop: 7,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown
  }
});
