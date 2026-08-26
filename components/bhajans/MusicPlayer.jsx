import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
  const soundRef = useRef(null);
  const progressWidthRef = useRef(0);
  const finishedRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

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
    await unload();

    updatePlaying(false);

    onClose?.();
  };

  if (!track) {
    return null;
  }

  const progress =
    duration > 0 ? Math.min((position / duration) * 100, 100) : 0;

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={90} tint="light" style={styles.player}>
        <View style={styles.topRow}>
          <View style={styles.trackInfo}>
            {track.cover ? (
              <Image
                source={{ uri: track.cover }}
                style={styles.cover}
                contentFit="cover"
              />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Ionicons name="musical-notes" size={24} color="#5a3816" />
              </View>
            )}

            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {track.title}
              </Text>

              <Text style={styles.artist} numberOfLines={1}>
                {track.artist || 'Gieogita Bhajan'}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleClose}
            hitSlop={10}
            style={styles.closeButton}>
            <Ionicons name="close" size={22} color="#555" />
          </Pressable>
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          onPress={seekTo}
          onLayout={event => {
            progressWidthRef.current = event.nativeEvent.layout.width;
          }}
          style={styles.progressTouch}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </Pressable>

        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(position)}</Text>

          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controls}>
          <Pressable
            disabled={isFirst}
            onPress={onPrevious}
            style={[styles.controlButton, isFirst && styles.disabledControl]}>
            <Ionicons name="play-skip-back" size={25} color="#333" />
          </Pressable>

          <Pressable
            disabled={loading || !!error}
            onPress={togglePlayback}
            style={styles.mainButton}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={29}
                color="#fff"
                style={!isPlaying && styles.playIcon}
              />
            )}
          </Pressable>

          <Pressable
            disabled={isLast}
            onPress={onNext}
            style={[styles.controlButton, isLast && styles.disabledControl]}>
            <Ionicons name="play-skip-forward" size={25} color="#333" />
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },

  player: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  trackInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cover: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },

  coverPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFF1E3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    flex: 1,
    marginLeft: 11,
    minWidth: 0,
  },

  title: {
    fontSize: 15,
    color: '#222',
    fontWeight: '700',
  },

  artist: {
    marginTop: 3,
    fontSize: 12,
    color: '#777',
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  error: {
    color: '#C62828',
    fontSize: 12,
    marginTop: 8,
  },

  progressTouch: {
    paddingVertical: 10,
    marginTop: 4,
  },

  progressBackground: {
    height: 4,
    backgroundColor: '#E3E3E3',
    borderRadius: 50,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#5a3816',
    borderRadius: 50,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },

  time: {
    fontSize: 10,
    color: '#888',
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
    marginTop: 1,
  },

  controlButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledControl: {
    opacity: 0.25,
  },

  mainButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#5a3816',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playIcon: {
    marginLeft: 3,
  },
});
