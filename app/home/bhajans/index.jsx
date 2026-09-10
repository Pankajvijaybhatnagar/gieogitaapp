import { DESIGN } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import BhajanList from '@/components/bhajans/BhajanList';
import MusicPlayer from '@/components/bhajans/MusicPlayer';
import bhajanServices from '@/lib/services/bhajanServices';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, spacing, type } from '@/constants/theme';

function normalizeBhajan(item) {
  return {
    ...item,

    id: item.id,

    title: item.title || item.name || item.bhajan_name || 'Untitled Bhajan',

    artist: item.artist || item.singer || item.author || item.artist_name || '',

    audioUrl:
      item.audio_full_url ||
      item.audio_url ||
      item.file_full_url ||
      item.file_url ||
      item.audio ||
      '',

    cover:
      item.cover_image_full_url ||
      item.cover_image_url ||
      item.thumbnail_full_url ||
      item.thumbnail_url ||
      item.image_full_url ||
      item.image_url ||
      '',

    plays: item.play_count || item.plays || item.views || 0,

    durationText: item.duration_formatted || item.duration_text || '',
  };
}

export default function BhajansPage() {
  const [bhajans, setBhajans] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  const countedTracks = useRef(new Set());

  const activeTrack = useMemo(() => {
    if (selectedIndex < 0) {
      return null;
    }

    return bhajans[selectedIndex] || null;
  }, [bhajans, selectedIndex]);

  const fetchBhajans = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response = await bhajanServices.getPublicBhajans({
        page: 1,
        limit: 100,
      });

      const rawData =
        response?.data?.data || response?.data || response?.bhajans || [];

      const list = Array.isArray(rawData) ? rawData.map(normalizeBhajan) : [];

      setBhajans(list);
    } catch (err) {
      console.log('Fetch bhajans error:', err);

      setError(err?.message || 'Unable to load bhajans. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBhajans();
  }, [fetchBhajans]);

  const handleSelectTrack = useCallback(
    track => {
      const index = bhajans.findIndex(
        item => String(item.id) === String(track.id),
      );

      if (index === -1) {
        return;
      }

      setSelectedIndex(index);
    },
    [bhajans],
  );

  const handlePrevious = useCallback(() => {
    setSelectedIndex(current => {
      if (current <= 0) {
        return current;
      }

      return current - 1;
    });
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex(current => {
      if (current < 0 || current >= bhajans.length - 1) {
        return current;
      }

      return current + 1;
    });
  }, [bhajans.length]);

  const handleTrackStarted = useCallback(async track => {
    if (!track?.id) {
      return;
    }

    const key = String(track.id);

    if (countedTracks.current.has(key)) {
      return;
    }

    countedTracks.current.add(key);

    try {
      await bhajanServices.playBhajan(track.id);

      setBhajans(current =>
        current.map(item =>
          String(item.id) === key
            ? {
                ...item,
                plays: Number(item.plays || 0) + 1,
              }
            : item,
        ),
      );
    } catch (err) {
      console.log('Play count error:', err);

      countedTracks.current.delete(key);
    }
  }, []);

  const closePlayer = useCallback(() => {
    setSelectedIndex(-1);
    setIsPlaying(false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={20} color={COLORS.dangerRed} />

          <Text style={styles.errorText}>{error}</Text>

          <Pressable onPress={() => fetchBhajans()}>
            <Text style={styles.retry}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.libraryHeader}>
        <View style={styles.headerDecorWrap} pointerEvents="none">
          <Ionicons
            name="musical-notes"
            size={70}
            color={`rgba(${RGB.saffron},0.06)`}
            style={styles.headerDecorNote}
          />
        </View>

        <LinearGradient
          colors={[COLORS.richBrown, COLORS.deepBrown]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.libraryIconBadge}>
          <Ionicons name="musical-notes" size={20} color={COLORS.white} />
        </LinearGradient>

        <View style={styles.libraryTextArea}>
          <Text style={styles.sectionTitle} numberOfLines={1}>
            All Bhajans
          </Text>

          <View style={styles.captionRow}>
            <View style={styles.livePulseDot} />
            <Text style={styles.count} numberOfLines={1}>
              {bhajans.length
                ? `${bhajans.length} tracks · tune in & reflect`
                : 'Curated for your practice'}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => fetchBhajans(true)}
          hitSlop={8}
          style={styles.headerButton}>
          <Ionicons name="refresh" size={16} color={COLORS.richBrown} />
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        <BhajanList
          data={bhajans}
          loading={loading}
          refreshing={refreshing}
          onRefresh={() => fetchBhajans(true)}
          activeId={activeTrack?.id}
          isPlaying={isPlaying}
          onSelect={handleSelectTrack}
        />
      </View>

      {activeTrack && (
        <MusicPlayer
          track={activeTrack}
          isFirst={selectedIndex === 0}
          isLast={selectedIndex === bhajans.length - 1}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onClose={closePlayer}
          onPlayingChange={setIsPlaying}
          onTrackStarted={handleTrackStarted}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: `rgba(${RGB.maroon},0.08)`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  libraryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    overflow: 'hidden'
  },
  headerDecorWrap: {
    position: 'absolute',
    top: -18,
    right: -10
  },
  headerDecorNote: {
    transform: [{ rotate: '18deg' }]
  },
  libraryIconBadge: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.richBrown,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3
  },
  libraryTextArea: {
    flex: 1,
    minWidth: 0
  },
  sectionTitle: {
    ...type.title,
    fontSize: 19,
    color: COLORS.deepBrown,
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: "400",
    letterSpacing: -0.3
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 5
  },
  livePulseDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.saffron
  },
  count: {
    ...type.footnote,
    color: COLORS.warmBrown,
    flexShrink: 1
  },
  listContainer: {
    flex: 1
  },
  errorBox: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: `rgba(${RGB.dangerRed},0.08)`,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  errorText: {
    flex: 1,
    color: COLORS.dangerRed,
    fontSize: 13
  },
  retry: {
    color: COLORS.saffron,
    fontWeight: '700',
    fontSize: 13
  }
});
