import { DESIGN } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS, RGB } from '@/constants/brandColors';
import { radii, spacing, type } from '@/constants/theme';

function BhajanItem({ item, active, isPlaying, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.item,
        active && styles.activeItem,
        pressed && styles.pressedItem,
      ]}>
      <View style={styles.coverContainer}>
        {item.cover ? (
          <Image
            source={{ uri: item.cover }}
            style={styles.cover}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons
              name="musical-notes"
              size={24}
              color={COLORS.saffron}
            />
          </View>
        )}

        {active && (
          <View style={styles.playingOverlay}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={18}
              color={COLORS.white}
            />
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text
          style={[styles.title, active && styles.activeTitle]}
          numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.subtitle} numberOfLines={1}>
          {item.artist || 'Gieogita Bhajan'}
        </Text>

        {!!item.plays && (
          <View style={styles.stats}>
            <Ionicons
              name="headset-outline"
              size={13}
              color={COLORS.warmBrown}
            />
            <Text style={styles.statsText}>
              {Number(item.plays).toLocaleString()} plays
            </Text>
          </View>
        )}
      </View>

      <View style={styles.right}>
        {item.durationText ? (
          <Text style={styles.duration}>{item.durationText}</Text>
        ) : null}

        <Ionicons
          name={active ? 'musical-notes' : 'play-circle-outline'}
          size={26}
          color={active ? COLORS.saffron : COLORS.warmBrown}
        />
      </View>
    </Pressable>
  );
}

export default function BhajanList({
  data,
  loading,
  refreshing,
  onRefresh,
  activeId,
  isPlaying,
  onSelect,
}) {
  if (loading && !data.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.saffron} />
        <Text style={styles.loadingText}>Loading bhajans...</Text>
      </View>
    );
  }

  if (!loading && !data.length) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="musical-notes-outline"
          size={48}
          color={COLORS.warmBrown}
        />

        <Text style={styles.emptyTitle}>No bhajans found</Text>

        <Text style={styles.emptyText}>
          Bhajans will appear here when available.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => (
        <BhajanItem
          item={item}
          active={String(activeId) === String(item.id)}
          isPlaying={isPlaying}
          onPress={onSelect}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 180
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radii.md,
    marginBottom: 2
  },
  activeItem: {
    backgroundColor: `rgba(${RGB.saffron}, 0.08)`
  },
  pressedItem: {
    opacity: 0.75
  },
  coverContainer: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    overflow: 'hidden'
  },
  cover: {
    width: '100%',
    height: '100%'
  },
  coverPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  details: {
    flex: 1,
    marginLeft: spacing.md - 4,
    minWidth: 0
  },
  title: {
    ...type.subhead,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.deepBrown
  },
  activeTitle: {
    color: COLORS.saffron
  },
  subtitle: {
    ...type.footnote,
    fontSize: 13,
    color: COLORS.warmBrown,
    marginTop: 3
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4
  },
  statsText: {
    ...type.caption,
    fontWeight: '400',
    letterSpacing: 0,
    color: COLORS.warmBrown
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
    marginLeft: spacing.sm
  },
  duration: {
    ...type.caption,
    fontWeight: '400',
    letterSpacing: 0,
    color: COLORS.warmBrown
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl - 2
  },
  loadingText: {
    marginTop: spacing.md - 4,
    color: COLORS.warmBrown
  },
  emptyTitle: {
    ...type.headline,
    fontSize: 18,
    color: COLORS.deepBrown,
    marginTop: spacing.md - 2,
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: "400",
    letterSpacing: -0.4
  },
  emptyText: {
    ...type.body,
    fontSize: 14,
    color: COLORS.warmBrown,
    marginTop: spacing.xs + 1,
    textAlign: 'center'
  }
});
