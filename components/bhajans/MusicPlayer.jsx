import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, shadow, spacing, type } from '@/constants/theme';

function formatTime(milliseconds = 0) {
  if (!milliseconds || milliseconds < 0) {
    return '0:00';
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function MusicPlayer({
  track,
  isFirst,
  isLast,
  onPrevious,
  onNext,
  onClose,
  onPlayingChange,
  onTrackStarted,
}) {
  const insets = useSafeAreaInsets();

  const soundRef = useRef(null);
  const progressWidthRef = useRef(0);
  const finishedRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  // Spotify-style two-tier player: a slim bar above the tab bar that
  // expands into a full "Now Playing" screen when tapped.
  const [expanded, setExpanded] = useState(false);

  const updatePlaying = useCallback(
    value => {
      setIsPlaying(value);
      onPlayingChange?.(value);
    },
    [onPlayingChange],
  );

  const unload = useCallback(async () => {
    const sound = soundRef.current;

    soundRef.current = null;

    if (!sound) {
      return;
    }

    try {
      await sound.unloadAsync();
    } catch {}
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!track?.audioUrl) {
      return;
    }

    let active = true;

    const loadTrack = async () => {
      setLoading(true);
      setError('');
      setPosition(0);
      setDuration(0);
      finishedRef.current = false;

      updatePlaying(false);

      await unload();

      try {
        const { sound } = await Audio.Sound.createAsync(
          {
            uri: track.audioUrl,
          },
          {
            shouldPlay: true,
            progressUpdateIntervalMillis: 500,
          },
          status => {
            if (!active || !status.isLoaded) {
              return;
            }

            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 0);

            updatePlaying(status.isPlaying);

            if (status.didJustFinish && !finishedRef.current) {
              finishedRef.current = true;

              if (!isLast) {
                onNext?.();
              } else {
                updatePlaying(false);
              }
            }
          },
        );

        if (!active) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;

        onTrackStarted?.(track);
      } catch (err) {
        console.log('Audio error:', err);

        setError('Unable to play this bhajan.');
        updatePlaying(false);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTrack();

    return () => {
      active = false;
    };
  }, [
    track?.id,
    track?.audioUrl,
    isLast,
    onNext,
    onTrackStarted,
    unload,
    updatePlaying,
  ]);

  useEffect(() => {
    return () => {
      unload();
    };
  }, [unload]);

  const togglePlayback = async () => {
    const sound = soundRef.current;

    if (!sound) {
      return;
    }

    try {
      const status = await sound.getStatusAsync();

      if (!status.isLoaded) {
        return;
      }

      if (status.isPlaying) {
        await sound.pauseAsync();
      } else {
        finishedRef.current = false;

        if (
          status.durationMillis &&
          status.positionMillis >= status.durationMillis - 500
        ) {
          await sound.setPositionAsync(0);
        }

        await sound.playAsync();
      }
    } catch (err) {
      console.log('Playback toggle error:', err);
    }
  };

  const seekTo = async event => {
    const sound = soundRef.current;

    if (!sound || !duration || !progressWidthRef.current) {
      return;
    }

    const x = event.nativeEvent.locationX;

    const percentage = Math.min(Math.max(x / progressWidthRef.current, 0), 1);

    const newPosition = duration * percentage;

    try {
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
    } catch (err) {
      console.log('Seek error:', err);
    }
  };

  const handleClose = async () => {
    setExpanded(false);

    await unload();

    updatePlaying(false);

    onClose?.();
  };

  if (!track) {
    return null;
  }

  const progress =
    duration > 0 ? Math.min((position / duration) * 100, 100) : 0;

  const coverArt = track.cover ? (
    <Image source={{ uri: track.cover }} style={styles.miniCover} contentFit="cover" />
  ) : (
    <View style={styles.miniCoverPlaceholder}>
      <Ionicons name="musical-notes" size={22} color={COLORS.saffron} />
    </View>
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          MINI PLAYER — the slim bar that sits above the tab bar.
          Tapping it (outside the play button) opens the full player.
      ═══════════════════════════════════════════════════════════ */}
      <View style={styles.wrapper}>
        <BlurView intensity={90} tint="light" style={styles.miniBar}>
          {/* Thin progress line along the top edge, Spotify-style. */}
          <View style={styles.miniProgressTrack}>
            <View style={[styles.miniProgressFill, { width: `${progress}%` }]} />
          </View>

          <Pressable
            style={styles.miniContent}
            onPress={() => setExpanded(true)}
            accessibilityRole="button"
            accessibilityLabel="Open now playing">
            {coverArt}

            <View style={styles.miniTextContainer}>
              <Text style={styles.miniTitle} numberOfLines={1}>
                {track.title}
              </Text>

              <Text style={styles.miniArtist} numberOfLines={1}>
                {track.artist || 'Gieogita Bhajan'}
              </Text>
            </View>

            <Pressable
              disabled={loading || !!error}
              onPress={togglePlayback}
              hitSlop={10}
              style={styles.miniPlayButton}>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.richBrown} />
              ) : (
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={22}
                  color={COLORS.richBrown}
                />
              )}
            </Pressable>

            <Pressable onPress={handleClose} hitSlop={10} style={styles.miniCloseButton}>
              <Ionicons name="close" size={18} color={COLORS.warmBrown} />
            </Pressable>
          </Pressable>
        </BlurView>
      </View>

      {/* ═══════════════════════════════════════════════════════════
          FULL "NOW PLAYING" SCREEN
      ═══════════════════════════════════════════════════════════ */}
      <Modal
        visible={expanded}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setExpanded(false)}>
        <View style={[styles.fullScreen, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.fullTopBar}>
            <Pressable
              onPress={() => setExpanded(false)}
              hitSlop={10}
              style={styles.fullTopButton}
              accessibilityRole="button"
              accessibilityLabel="Minimize player">
              <Ionicons name="chevron-down" size={26} color={COLORS.deepBrown} />
            </Pressable>

            <Text style={styles.fullTopLabel} numberOfLines={1}>
              NOW PLAYING
            </Text>

            <Pressable
              onPress={handleClose}
              hitSlop={10}
              style={styles.fullTopButton}
              accessibilityRole="button"
              accessibilityLabel="Stop playback">
              <Ionicons name="close" size={24} color={COLORS.deepBrown} />
            </Pressable>
          </View>

          <View style={styles.fullArtWrap}>
            {track.cover ? (
              <Image
                source={{ uri: track.cover }}
                style={styles.fullArt}
                contentFit="cover"
              />
            ) : (
              <View style={styles.fullArtPlaceholder}>
                <Ionicons name="musical-notes" size={72} color={COLORS.saffron} />
              </View>
            )}
          </View>

          <View style={styles.fullTextBlock}>
            <Text style={styles.fullTitle} numberOfLines={2}>
              {track.title}
            </Text>

            <Text style={styles.fullArtist} numberOfLines={1}>
              {track.artist || 'Gieogita Bhajan'}
            </Text>
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            onPress={seekTo}
            onLayout={event => {
              progressWidthRef.current = event.nativeEvent.layout.width;
            }}
            style={styles.fullProgressTouch}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
              <View style={[styles.progressThumb, { left: `${progress}%` }]} />
            </View>
          </Pressable>

          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(position)}</Text>

            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>

          <View style={styles.fullControls}>
            <Pressable
              disabled={isFirst}
              onPress={onPrevious}
              style={[styles.controlButton, isFirst && styles.disabledControl]}>
              <Ionicons name="play-skip-back" size={30} color={COLORS.deepBrown} />
            </Pressable>

            <Pressable
              disabled={loading || !!error}
              onPress={togglePlayback}
              style={styles.fullPlayButton}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={36}
                  color={COLORS.white}
                  style={!isPlaying && styles.playIcon}
                />
              )}
            </Pressable>

            <Pressable
              disabled={isLast}
              onPress={onNext}
              style={[styles.controlButton, isLast && styles.disabledControl]}>
              <Ionicons name="play-skip-forward" size={30} color={COLORS.deepBrown} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  /* ══════════════════ MINI PLAYER ══════════════════ */
  wrapper: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadow.raised,
  },
  miniBar: {
    backgroundColor: `rgba(${RGB.cream}, 0.9)`,
  },
  miniProgressTrack: {
    height: 2,
    backgroundColor: hairline,
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: COLORS.saffron,
  },
  miniContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
  },
  miniCover: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
  },
  miniCoverPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTextContainer: {
    flex: 1,
    marginLeft: spacing.sm + 2,
    minWidth: 0,
  },
  miniTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.deepBrown,
  },
  miniArtist: {
    marginTop: 2,
    ...type.caption,
    fontWeight: '400',
    letterSpacing: 0,
    color: COLORS.warmBrown,
  },
  miniPlayButton: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCloseButton: {
    width: 32,
    height: 32,
    marginLeft: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ══════════════════ FULL "NOW PLAYING" SCREEN ══════════════════ */
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.cream,
    paddingHorizontal: spacing.lg,
  },
  fullTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  fullTopButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullTopLabel: {
    ...type.caption,
    color: COLORS.warmBrown,
    letterSpacing: 1.5,
  },
  fullArtWrap: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  fullArt: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radii.xl,
    ...shadow.raised,
  },
  fullArtPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radii.xl,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.raised,
  },
  fullTextBlock: {
    marginBottom: spacing.lg,
  },
  fullTitle: {
    ...type.title,
    fontSize: 24,
    color: COLORS.deepBrown,
  },
  fullArtist: {
    marginTop: spacing.xs,
    ...type.body,
    color: COLORS.warmBrown,
  },
  error: {
    color: COLORS.dangerRed,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  fullProgressTouch: {
    paddingVertical: spacing.sm,
  },
  progressBackground: {
    height: 4,
    backgroundColor: hairline,
    borderRadius: radii.pill,
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.saffron,
    borderRadius: radii.pill,
  },
  progressThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.saffron,
    marginLeft: -6,
    ...shadow.card,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  time: {
    ...type.caption,
    fontWeight: '400',
    letterSpacing: 0,
    color: COLORS.warmBrown,
  },
  fullControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledControl: {
    opacity: 0.25,
  },
  fullPlayButton: {
    width: 76,
    height: 76,
    borderRadius: radii.pill,
    backgroundColor: COLORS.richBrown,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  playIcon: {
    marginLeft: 4,
  },
});
