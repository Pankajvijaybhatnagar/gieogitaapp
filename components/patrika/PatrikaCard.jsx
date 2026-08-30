import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',
  cream: '#FDF6E3',
  creamDark: '#F5E6C8',
  white: '#FFFFFF',
};

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
            <Ionicons name="book-outline" size={34} color={COLORS.goldLight} />
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
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#EDE1D4',
    shadowColor: '#4E321D',
    shadowOpacity: 0.08,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  coverWrap: {
    height: 195,
    backgroundColor: COLORS.warmBrown,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warmBrown,
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.7,
    color: COLORS.goldLight,
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
    backgroundColor: 'rgba(44,26,10,0.78)',
  },
  topBadgeText: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: '#FFFFFF',
  },
  pagesBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(44,26,10,0.72)',
  },
  pagesBadgeText: {
    fontSize: 7.5,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    padding: 11,
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    color: COLORS.deepBrown,
    minHeight: 36,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 9,
    color: '#8C7664',
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceCaption: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#A58E7B',
  },
  price: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.warmBrown,
  },
  readButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
