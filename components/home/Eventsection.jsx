import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import eventServices from '@/lib/services/eventServices';
import { router } from 'expo-router';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

function EventCard({ item }) {
  
  return (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.85}
      onPress={() => {
        router.push(`/home/events/${item.slug}`);
      }}
    >
      <View style={styles.eventCardTop}>
        <View style={styles.eventDateBox}>
          <Text style={styles.eventDateDay}>
            {item.day}
          </Text>

          <Text style={styles.eventDateMonth}>
            {item.month}
          </Text>
        </View>

        <View style={styles.eventInfo}>
          <Text
            style={styles.eventTitle}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text style={styles.eventLoc}>
            📍 {item.location}
          </Text>

          <Text style={styles.eventTime}>
            ⏰ {item.time}
          </Text>
        </View>
      </View>

      <View style={styles.eventFooter}>
        <View style={styles.eventTagBadge}>
          <Text style={styles.eventTagText}>
            {item.tag}
          </Text>
        </View>

        <Text style={styles.eventCta}>
          Register Now »
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function EventsSection() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchEvents = async () => {
  try {
    setLoading(true);

    const response = await eventServices.getPublicEvents({upcoming: true, limit: 3});

    console.log('Events API Response:', response);

    const events = response?.data?.data;

    if (
      response?.success &&
      response?.data?.status &&
      Array.isArray(events)
    ) {
      const formattedEvents = events.map((event) => {
        const startDate = new Date(
          `${event.start_date}T${
            event.start_time || '00:00:00'
          }`
        );

        const day = startDate
          .getDate()
          .toString()
          .padStart(2, '0');

        const month = startDate
          .toLocaleString('en-US', {
            month: 'short',
          })
          .toUpperCase();

        const formatTime = (time) => {
          if (!time) {
            return '';
          }

          const [hours, minutes] = time.split(':');

          const date = new Date();

          date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
          );

          return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          });
        };

        let eventTime = '';

        if (event.start_date === event.end_date) {
          eventTime = formatTime(event.start_time);

          if (event.end_time) {
            eventTime += ` – ${formatTime(
              event.end_time
            )}`;
          }
        } else {
          eventTime = `${formatTime(
            event.start_time
          )} – ${formatTime(event.end_time)}`;
        }

        const location = [
          event.location_name,
          event.location_address,
        ]
          .filter(Boolean)
          .join(', ');

        let tag = 'EVENT';

        if (event.event_type === 'other') {
          tag = 'DIVINE EVENT';
        } else if (event.event_type) {
          tag = event.event_type.toUpperCase();
        }

        return {
          id: String(event.id),
          day,
          month,
          title: event.title,
          location,
          time: eventTime,
          tag,
          ...event,
        };
      });

      setUpcomingEvents(formattedEvents);
    } else {
      setUpcomingEvents([]);
    }
  } catch (error) {
    console.error(
      'Error fetching events:',
      error
    );

    setUpcomingEvents([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <SectionHeader
        title="📅 Upcoming"
        accent="Events"
        onSeeAll={() => {}}
        seeAllLabel="View all »"
      />

      <View style={styles.eventsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={COLORS.gold}
            />

            <Text style={styles.loadingText}>
              Loading events...
            </Text>
          </View>
        ) : upcomingEvents.length > 0 ? (
          upcomingEvents.map((item) => (
            <EventCard
              key={item.id}
              item={item}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No upcoming events found.
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  eventsContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },

  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 8,
    fontSize: 11,
    color: COLORS.goldLight,
  },

  emptyContainer: {
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 12,
    color: 'rgba(253,246,227,0.6)',
  },

  eventCard: {
    backgroundColor: COLORS.deepBrown,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor:
      'rgba(201,162,39,0.3)',
  },

  eventCardTop: {
    backgroundColor: COLORS.richBrown,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },

  eventDateBox: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignItems: 'center',
    minWidth: 46,
  },

  eventDateDay: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.deepBrown,
    lineHeight: 22,
  },

  eventDateMonth: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.deepBrown,
    letterSpacing: 0.5,
    marginTop: 2,
  },

  eventInfo: {
    flex: 1,
  },

  eventTitle: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 17,
  },

  eventLoc: {
    fontSize: 11,
    color:
      'rgba(253,246,227,0.6)',
    fontStyle: 'italic',
    marginBottom: 2,
  },

  eventTime: {
    fontSize: 11,
    color: COLORS.goldLight,
  },

  eventFooter: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor:
      'rgba(201,162,39,0.15)',
  },

  eventTagBadge: {
    backgroundColor:
      'rgba(232,114,28,0.2)',
    borderWidth: 1,
    borderColor:
      'rgba(232,114,28,0.4)',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },

  eventTagText: {
    color: COLORS.saffronLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  eventCta: {
    fontSize: 11,
    color: COLORS.goldLight,
    fontStyle: 'italic',
  },
});