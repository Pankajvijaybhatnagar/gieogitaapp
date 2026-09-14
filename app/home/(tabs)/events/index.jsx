// app/home/(tabs)/events/index.jsx
//
// "View all" destination for the home page's Events section — the
// section's "View all »" button already pointed at /home/events, but no
// page existed here (only the [slug] detail route did), so it 404'd.
// Shows the real events from the same API the home section already
// calls, not mock/sample data.

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Card from '@/components/ui/Card';
import Spacer from '@/components/ui/Spacer';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';
import eventServices from '@/lib/services/eventServices';

function formatEventTime(time) {
  if (!time) return '';

  const [hours, minutes] = time.split(':');

  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatEvent(event) {
  const startDate = new Date(
    `${event.start_date}T${event.start_time || '00:00:00'}`,
  );

  const day = startDate.getDate().toString().padStart(2, '0');

  const month = startDate
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();

  let eventTime = '';

  if (event.start_date === event.end_date) {
    eventTime = formatEventTime(event.start_time);

    if (event.end_time) {
      eventTime += ` – ${formatEventTime(event.end_time)}`;
    }
  } else {
    const startTime = formatEventTime(event.start_time);
    const endTime = formatEventTime(event.end_time);

    eventTime = [startTime, endTime].filter(Boolean).join(' – ');
  }

  const location = [event.location_name, event.location_address]
    .filter(Boolean)
    .join(', ');

  let tag = 'EVENT';

  if (event.event_type === 'other') {
    tag = 'DIVINE EVENT';
  } else if (event.event_type) {
    tag = event.event_type.toUpperCase();
  }

  return {
    ...event,
    id: String(event.id),
    day,
    month,
    location,
    time: eventTime,
    tag,
  };
}

function Hero({ count, loading }) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroBanner}>
        <View style={styles.heroPatternOne} />
        <View style={styles.heroPatternTwo} />
        <Text style={styles.heroOm}>GITA SATSANG</Text>
      </View>

      <View style={styles.heroIconRing}>
        <View style={styles.heroIcon}>
          <Text style={styles.heroIconText}>📅</Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>Events &amp; Satsangs</Text>
      <View style={styles.heroDivider} />
      <Text style={styles.heroSubtitle}>
        {loading
          ? 'Loading events...'
          : `${count} event${count !== 1 ? 's' : ''} coming up`}
      </Text>
    </View>
  );
}

function EventRow({ item }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/home/events/${item.slug}`)}
      style={styles.rowWrap}>
      <Card radius={radii.xl} style={styles.card}>
        <View style={styles.cardTop}>
          {item.cover_image_full_url ? (
            <Image
              source={{ uri: item.cover_image_full_url }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>{item.day}</Text>
              <Text style={styles.dateMonth}>{item.month}</Text>
            </View>
          )}

          <View style={styles.cardInfo}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>

            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>

            {!!item.location && (
              <Text style={styles.cardMeta} numberOfLines={1}>
                📍 {item.location}
              </Text>
            )}

            {!!item.time && (
              <Text style={styles.cardMeta} numberOfLines={1}>
                ⏰ {item.time}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function EventsListScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const response = await eventServices.getPublicEvents({});

        const raw = response?.data?.data;

        if (response?.success && response?.data?.status && Array.isArray(raw)) {
          if (mounted) setEvents(raw.map(formatEvent));
        } else if (mounted) {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events list:', error);

        if (mounted) setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <FlatList
      style={styles.root}
      data={events}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<Hero count={events.length} loading={loading} />}
      renderItem={({ item }) => <EventRow item={item} />}
      ListEmptyComponent={
        !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconRing}>
              <Text style={styles.emptyIconText}>📅</Text>
            </View>
            <Text style={styles.emptyTitle}>No Events Found</Text>
            <Text style={styles.emptyText}>
              There are no upcoming events right now. Please check back soon.
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        <>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.richBrown} />
            </View>
          ) : null}
          <Spacer height={120} />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },

  /* HERO */
  hero: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginBottom: spacing.sm,
  },
  heroBanner: {
    width: '100%',
    height: 128,
    backgroundColor: COLORS.richBrown,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPatternOne: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    top: -65,
    left: -50,
  },
  heroPatternTwo: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    right: -80,
    top: -90,
  },
  heroOm: {
    color: 'rgba(255,255,255,0.14)',
    fontSize: 28,
    fontWeight: '700',
  },
  heroIconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -44,
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: `rgba(${RGB.maroon},0.1)`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.cream,
  },
  heroIconText: {
    fontSize: 30,
  },
  heroTitle: {
    marginTop: spacing.sm,
    ...type.title,
    fontSize: 23,
    color: COLORS.deepBrown,
    textAlign: 'center',
  },
  heroDivider: {
    width: 40,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: COLORS.gold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...type.subhead,
    color: COLORS.warmBrown,
    marginTop: 2,
    textAlign: 'center',
  },

  /* EVENT CARDS */
  rowWrap: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  card: {
    padding: spacing.sm + 2,
  },
  cardTop: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
  },
  cardImage: {
    width: 76,
    height: 76,
    borderRadius: radii.md,
    backgroundColor: COLORS.creamDark,
  },
  dateBox: {
    width: 76,
    height: 76,
    borderRadius: radii.md,
    backgroundColor: `rgba(${RGB.maroon},0.08)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    ...type.title,
    fontSize: 24,
    color: COLORS.richBrown,
    lineHeight: 28,
  },
  dateMonth: {
    ...type.caption,
    color: COLORS.richBrown,
    fontSize: 11,
    letterSpacing: 1,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `rgba(${RGB.saffron},0.12)`,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
  },
  tagText: {
    ...type.caption,
    fontSize: 9,
    color: COLORS.saffron,
  },
  cardTitle: {
    ...type.headline,
    fontSize: 15,
    color: COLORS.deepBrown,
    lineHeight: 20,
  },
  cardMeta: {
    ...type.footnote,
    color: COLORS.warmBrown,
  },

  /* LOADING / EMPTY */
  loadingContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
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
  emptyIconText: {
    fontSize: 30,
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
