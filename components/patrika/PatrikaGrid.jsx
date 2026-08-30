import { StyleSheet, Text, View } from 'react-native';
import PatrikaCard from './PatrikaCard';

const COLORS = {
  deepBrown: '#2C1A0A',
  gold: '#C9A227',
  goldDark: '#8B6914',
};

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
    justifyContent: 'space-between',
  },
  empty: {
    minHeight: 170,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDE1D4',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepBrown,
  },
  emptyText: {
    marginTop: 7,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    color: '#846F5E',
  },
});
