import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, shadow } from '@/constants/theme';

export default function PatrikaCard({
  item,
  locked = false,
  onPress,
}) {
  const title = item?.title || 'Monthly Patrika';
  const price = Number(item?.price || 0);
  const issueDate = item?.issue_date || '';
  const previewPages = Number(item?.preview_pages || 0);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => onPress?.(item)}
    >
      <View style={styles.coverWrap}>
        {item?.cover_image_url ? (
          <Image
            source={{ uri: item.cover_image_url }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderCover}>
            <Ionicons name="book-outline" size={34} color={COLORS.saffron} />
            <Text style={styles.placeholderText}>GIEO GITA</Text>
          </View>
        )}

        <View style={styles.topBadge}>
          <Ionicons
            name={locked ? 'lock-closed' : 'book-outline'}
            size={11}
            color="#FFFFFF"
          />
          <Text style={styles.topBadgeText}>
            {locked ? 'PAID' : 'READ'}
          </Text>
        </View>

        {previewPages > 0 ? (
          <View style={styles.pagesBadge}>
            <Text style={styles.pagesBadgeText}>
              {previewPages} preview {previewPages === 1 ? 'page' : 'pages'}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {!!issueDate && (
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={12} color={COLORS.goldDark} />
            <Text style={styles.metaText}>{issueDate}</Text>
          </View>
        )}

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.priceCaption}>ISSUE</Text>
            <Text style={styles.price}>
              {price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Free preview'}
            </Text>
          </View>

          <View style={styles.readButton}>
            <Ionicons name="chevron-forward" size={16} color={COLORS.deepBrown} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 20,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2
  },
  coverWrap: {
    backgroundColor: COLORS.creamDark,
    position: 'relative',
    aspectRatio: 0.76,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden"
  },
  cover: {
    width: '100%',
    height: '100%'
  },
  placeholderCover: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.creamDark
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.7,
    color: COLORS.warmBrown
  },
  topBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: `rgba(${RGB.deepBrown},0.78)`
  },
  topBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.7,
    color: '#FFFFFF'
  },
  pagesBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: `rgba(${RGB.deepBrown},0.72)`
  },
  pagesBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  body: {
    padding: 14
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    color: COLORS.deepBrown,
    minHeight: 48
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    fontSize: 11,
    color: COLORS.warmBrown
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  priceCaption: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: COLORS.warmBrown
  },
  price: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.warmBrown
  },
  readButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: `rgba(${RGB.saffron}, 0.12)`,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
