// app/home/search.jsx
//
// Reached from the header's search icon. Searches the app's real
// navigation destinations (the same list the drawer menu uses) rather
// than a fake/mock dataset — typing filters, tapping actually navigates.

import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { DRAWER_ITEMS } from '@/components/navigation/CustomDrawerContent';
import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, spacing, type } from '@/constants/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return DRAWER_ITEMS;
    }

    return DRAWER_ITEMS.filter(item => item.label.toLowerCase().includes(q));
  }, [query]);

  const goTo = route => {
    router.push(route);
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.richBrown} />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLORS.warmBrown} />

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Home, Chants, Donations..."
            placeholderTextColor={COLORS.warmBrown}
            autoFocus
            returnKeyType="search"
            style={styles.searchInput}
          />

          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.warmBrown} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* RESULTS */}
      <FlatList
        data={results}
        keyExtractor={item => item.route}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.listHeading}>
            {query.trim() ? `Results for "${query.trim()}"` : 'Quick Links'}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconRing}>
              <Ionicons name="search-outline" size={30} color={COLORS.warmBrown} />
            </View>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>
              We couldn&apos;t find anything matching &quot;{query.trim()}&quot;.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.resultRow}
            onPress={() => goTo(item.route)}>
            <View style={styles.resultIconBox}>
              <Ionicons
                name={ICON_MAP[item.icon] || 'ellipse-outline'}
                size={17}
                color={COLORS.richBrown}
              />
            </View>

            <Text style={styles.resultLabel}>{item.label}</Text>

            <Ionicons name="chevron-forward" size={16} color={COLORS.warmBrown} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// The drawer's icon set is FontAwesome names — mapped to their closest
// Ionicons equivalent so this screen's rows match the Ionicons used
// everywhere else in the app's newer screens.
const ICON_MAP = {
  home: 'home-outline',
  music: 'musical-notes-outline',
  book: 'book-outline',
  calendar: 'calendar-outline',
  'video-camera': 'videocam-outline',
  child: 'happy-outline',
  leaf: 'leaf-outline',
  users: 'people-outline',
  medkit: 'medkit-outline',
  bullhorn: 'megaphone-outline',
  'user-circle': 'person-circle-outline',
  'question-circle': 'help-circle-outline',
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `rgba(${RGB.maroon},0.08)`,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.creamDark,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs + 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.deepBrown,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  listHeading: {
    ...type.subhead,
    color: COLORS.warmBrown,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: hairline,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm + 4,
    marginBottom: spacing.xs + 2,
  },
  resultIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `rgba(${RGB.maroon},0.08)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultLabel: {
    flex: 1,
    ...type.body,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.deepBrown,
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...type.headline,
    fontSize: 16,
    color: COLORS.deepBrown,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...type.body,
    color: COLORS.warmBrown,
    textAlign: 'center',
  },
});
