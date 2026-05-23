import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORIES, C, SEVA_LIST } from './constants';
import SevaCard from './SevaCard';

export default function SevaList({ onDonate }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSeva = activeCategory === 'All'
    ? SEVA_LIST
    : SEVA_LIST.filter((s) => s.category === activeCategory);

  return (
    <>
      {/* Category filter */}
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>
          Choose Your <Text style={styles.categoryTitleAccent}>Seva</Text>
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Seva cards */}
      <View style={styles.sevaList}>
        {filteredSeva.map((seva) => (
          <SevaCard key={seva.id} seva={seva} onDonate={onDonate} />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  categorySection: { paddingHorizontal: 16, paddingTop: 4 },
  categoryTitle:   { fontSize: 18, fontWeight: '800', color: C.deepBrown, marginBottom: 12 },
  categoryTitleAccent: { color: C.goldDark },
  categoryScroll:  { marginBottom: 16 },
  categoryChip: {
    backgroundColor: C.creamDark, borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8,
  },
  categoryChipActive:     { backgroundColor: C.deepBrown, borderColor: C.gold },
  categoryChipText:       { fontSize: 12, color: C.warmBrown, fontWeight: '600' },
  categoryChipTextActive: { color: C.goldLight },

  sevaList: { paddingHorizontal: 16, gap: 12 },
});