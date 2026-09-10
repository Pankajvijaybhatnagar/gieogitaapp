import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';
import { testimonials } from '@/lib/data/testimonialsData';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

function Stars({ rating = 5 }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < rating ? 'star' : 'star-outline'}
          size={12}
          color={COLORS.gold}
        />
      ))}
    </View>
  );
}

function TestimonialCard({ item, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.card}>
      <Text style={styles.quoteMark}>❝</Text>

      <Stars rating={item.rating} />

      <Text style={styles.quote} numberOfLines={4}>
        {item.text}
      </Text>

      <View style={styles.footer}>
        <Image source={{ uri: item.imgSrc }} style={styles.avatar} contentFit="cover" transition={200} />

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function TestimonialsSection() {
  const router = useRouter();

  return (
    <>
      <SectionHeader
        title="✦ What People"
        accent="Say"
        onSeeAll={() => router.push('/home/testimonials')}
        seeAllLabel="View All"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment="start"
        contentContainerStyle={styles.hScrollContent}>
        {testimonials.slice(0, 6).map((item, index) => (
          <TestimonialCard
            key={`${item.name}-${index}`}
            item={item}
            onPress={() => router.push('/home/testimonials')}
          />
        ))}
      </ScrollView>
    </>
  );
}

const CARD_WIDTH = 260;
const CARD_GAP = 14;

const styles = StyleSheet.create({
  hScrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.cream,
    borderRadius: radii.xl,
    padding: spacing.md + 4,
    ...shadow.card,
  },
  quoteMark: {
    position: 'absolute',
    top: 6,
    right: spacing.md,
    fontSize: 52,
    color: `rgba(${RGB.gold}, 0.18)`,
    fontWeight: '700',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: spacing.sm,
  },
  quote: {
    ...type.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: COLORS.deepBrown,
    minHeight: 80,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: `rgba(${RGB.gold}, 0.2)`,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.creamDark,
  },
  identity: {
    flex: 1,
  },
  name: {
    ...type.subhead,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepBrown,
  },
  title: {
    ...type.footnote,
    fontSize: 10.5,
    color: COLORS.warmBrown,
    marginTop: 1,
  },
});
