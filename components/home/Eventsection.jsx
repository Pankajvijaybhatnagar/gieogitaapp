import { DESIGN } from '@/constants/design';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import eventServices from '@/lib/services/eventServices';
import { router } from 'expo-router';
import Card from '@/components/ui/Card';
import { radii } from '@/constants/theme';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HORIZONTAL_PADDING = 20;
const CARD_GAP = 12;
const CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

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

function EventCard({ item }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        router.push(`/home/events/${item.slug}`);
      }}>
      <Card radius={radii.xl} style={styles.eventCard}>
        <View style={styles.eventCardTop}>
          <View style={styles.eventDateBox}>
            <Text style={styles.eventDateDay}>{item.day}</Text>

            <Text style={styles.eventDateMonth}>{item.month}</Text>
          </View>

          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {item.title}
            </Text>

            {!!item.location && (
              <Text style={styles.eventLoc} numberOfLines={1}>
                📍 {item.location}
              </Text>
            )}

            {!!item.time && (
              <Text style={styles.eventTime} numberOfLines={1}>
                ⏰ {item.time}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.eventTagBadge}>
            <Text style={styles.eventTagText}>{item.tag}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function EventsSection() {
  const flatListRef = useRef(null);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await eventServices.getPublicEvents({
        limit: 5,
      });

      console.log('Events API Response:', response);

      const events = response?.data?.data;

      if (
        response?.success &&
        response?.data?.status &&
        Array.isArray(events)
      ) {
        const formattedEvents = events.map(event => {
          const startDate = new Date(
            `${event.start_date}T${event.start_time || '00:00:00'}`,
          );

          const day = startDate.getDate().toString().padStart(2, '0');

          const month = startDate
            .toLocaleString('en-US', {
              month: 'short',
            })
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
            title: event.title,
            location,
            time: eventTime,
            tag,
          };
        });

        setUpcomingEvents(formattedEvents);
      } else {
        setUpcomingEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleMomentumScrollEnd = event => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / SNAP_INTERVAL);

    setActiveIndex(index);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.cardWrapper}>
        <EventCard item={item} />
      </View>
    );
  };

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Upcoming"
        accent="Events"
        icon="calendar-outline"
        onSeeAll={() => {
          router.push('/home/events');
        }}
        seeAllLabel="View all »"
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.gold} />

          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : upcomingEvents.length > 0 ? (
        <>
          <FlatList
            ref={flatListRef}
            data={upcomingEvents}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
            snapToInterval={SNAP_INTERVAL}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum
            bounces={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            getItemLayout={(_, index) => ({
              length: SNAP_INTERVAL,
              offset: SNAP_INTERVAL * index,
              index,
            })}
          />

          {upcomingEvents.length > 1 && (
            <View style={styles.pagination}>
              {upcomingEvents.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === activeIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No upcoming events found.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%'
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING
  },
  cardWrapper: {
    width: CARD_WIDTH
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.warmBrown
  },
  emptyContainer: {
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.warmBrown,
    opacity: 0.7
  },
  eventCard: {
    width: '100%',
    backgroundColor: DESIGN.colors.surface,
    borderColor: DESIGN.colors.border,
    borderWidth: 1,
    borderRadius: 24,
    shadowOpacity: 0.045,
    elevation: 2
  },
  eventCardTop: {
    backgroundColor: DESIGN.colors.surface,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    minHeight: 132
  },
  eventDateBox: {
    backgroundColor: DESIGN.colors.plumSoft,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60
  },
  eventDateDay: {
    fontSize: 28,
    fontWeight: "500",
    color: DESIGN.colors.plum,
    lineHeight: 32
  },
  eventDateMonth: {
    fontSize: 11,
    fontWeight: "600",
    color: DESIGN.colors.plum,
    letterSpacing: 1.2,
    marginTop: 2
  },
  eventInfo: {
    flex: 1
  },
  eventTitle: {
    color: DESIGN.colors.ink,
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 7,
    lineHeight: 27,
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4
  },
  eventLoc: {
    fontSize: 12,
    color: DESIGN.colors.muted,
    marginBottom: 4,
    lineHeight: 18
  },
  eventTime: {
    fontSize: 12,
    color: DESIGN.colors.accent
  },
  eventFooter: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: DESIGN.colors.border,
    backgroundColor: "#FCFAF7"
  },
  eventTagBadge: {
    backgroundColor: DESIGN.colors.accentSoft,
    borderWidth: 0,
    borderColor: 'rgba(166,83,56,0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  eventTagText: {
    color: DESIGN.colors.accent,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5
  },
  pagination: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(179,149,98,0.25)'
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: COLORS.gold
  }
});
