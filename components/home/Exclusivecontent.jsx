import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, exclusiveContent } from './constant';
import { SectionHeader } from './Sharedui';

function ExclusiveCard({ item }) {
  return (
    <TouchableOpacity style={styles.excCard} activeOpacity={0.85}>
      <View style={styles.excCardImg}>
        {/* <Text style={styles.excCardIcon}>{item.icon}</Text> */}
        {item.badge && (
          <View style={styles.excBadge}>
            <Text style={styles.excBadgeText}>{item.badge}</Text>
          </View>
        )}
        <View style={styles.excImgOverlay} />
      </View>
      <View style={styles.excCardBody}>
        <Text style={styles.excCardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.excCardMeta}>{item.meta}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ExclusiveContent() {
  return (
    <>
      <SectionHeader title="✦ Exclusive" accent="Content" onSeeAll={() => {}} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScrollContent}>
        {exclusiveContent.map(item => (
          <ExclusiveCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  hScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    gap: 12,
  },
  excCard: {
    width: 300,
    backgroundColor: COLORS.deepBrown,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
  },
  excCardImg: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.warmBrown,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  excCardIcon: { fontSize: 36, zIndex: 1 },
  excImgOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: 'rgba(44,26,10,0.7)',
  },
  excBadge: {
    position: 'absolute',
    top: 7,
    left: 7,
    backgroundColor: COLORS.saffron,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    zIndex: 2,
  },
  excBadgeText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  excCardBody: { padding: 10 },
  excCardTitle: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 15,
  },
  excCardMeta: {
    color: 'rgba(232,197,90,0.6)',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
