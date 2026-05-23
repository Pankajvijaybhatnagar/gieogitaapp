import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, upcomingEvents } from './constant';
import { SectionHeader } from './Sharedui';

function EventCard({ item }) {
  return (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.85}>
      <View style={styles.eventCardTop}>
        <View style={styles.eventDateBox}>
          <Text style={styles.eventDateDay}>{item.day}</Text>
          <Text style={styles.eventDateMonth}>{item.month}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.eventLoc}>📍 {item.location}</Text>
          <Text style={styles.eventTime}>⏰ {item.time}</Text>
        </View>
      </View>
      <View style={styles.eventFooter}>
        <View style={styles.eventTagBadge}>
          <Text style={styles.eventTagText}>{item.tag}</Text>
        </View>
        <Text style={styles.eventCta}>Register Now »</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function EventsSection() {
  return (
    <>
      <SectionHeader
        title="📅 Upcoming"
        accent="Events"
        onSeeAll={() => {}}
        seeAllLabel="View all »"
      />
      <View style={styles.eventsContainer}>
        {upcomingEvents.map((item) => (
          <EventCard key={item.id} item={item} />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  eventsContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  eventCard: {
    backgroundColor: COLORS.deepBrown,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
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
  eventInfo: { flex: 1 },
  eventTitle: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 17,
  },
  eventLoc: {
    fontSize: 11,
    color: 'rgba(253,246,227,0.6)',
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
    borderTopColor: 'rgba(201,162,39,0.15)',
  },
  eventTagBadge: {
    backgroundColor: 'rgba(232,114,28,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(232,114,28,0.4)',
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