import { DESIGN } from '@/constants/design';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { hairline, spacing, type } from '@/constants/theme';
import { COLORS } from './constant';

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
// A quiet hairline with room to breathe — no ornamental diamond, no gold.
// Depth/rhythm comes from spacing, not decoration.
export function GoldDivider() {
  return <View style={styles.divider} />;
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
export function SectionHeader({
  title,
  accent,
  icon,
  onSeeAll,
  seeAllLabel = 'See All',
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.titleRow}>
        {icon && (
          <View style={styles.titleIconBadge}>
            <Ionicons name={icon} size={15} color={DESIGN.colors.plum} />
          </View>
        )}

        <Text style={styles.sectionTitle} numberOfLines={1}>
          {title}
          {title && accent ? ' ' : ''}
          {accent ? <Text style={styles.sectionAccent}>{accent}</Text> : null}
        </Text>
      </View>
      {onSeeAll && (
        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={onSeeAll}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.seeAll}>{seeAllLabel}</Text>
          <FontAwesome name="chevron-right" size={11} color={COLORS.saffron} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: DESIGN.colors.border,
    marginHorizontal: 24,
    marginVertical: spacing.sm
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 12
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 8
  },
  titleIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: DESIGN.colors.plumSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    ...type.title,
    color: DESIGN.colors.ink,
    flexShrink: 1,
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: "400",
    letterSpacing: -0.3,
    fontSize: 19,
    lineHeight: 25
  },
  sectionAccent: {
    color: DESIGN.colors.plum
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingLeft: spacing.sm,
    minHeight: 44,
    paddingHorizontal: 10
  },
  seeAll: {
    ...type.subhead,
    color: DESIGN.colors.accent,
    fontSize: 12,
    fontWeight: "600"
  }
});
