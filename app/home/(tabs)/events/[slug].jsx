import { DESIGN } from '@/constants/design';
import { useEffect, useMemo, useState } from 'react';

import {
    ActivityIndicator,
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import RenderHTML from 'react-native-render-html';

import { COLORS } from '@/components/home/constant';
import Spacer from '@/components/ui/Spacer';
import { hairline, radii, shadow } from '@/constants/theme';

import eventServices from '@/lib/services/eventServices';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Event() {
  const params = useLocalSearchParams();

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =========================================================
  // FETCH EVENT
  // =========================================================

  const fetchEvent = async () => {
    if (!slug) {
      setLoading(false);
      setError('Event slug is missing.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Fetching event slug:', slug);

      const response = await eventServices.getPublicEvent(slug);

      console.log('Single Event API Response:', response);

      const eventData = response?.data?.data;

      if (Array.isArray(eventData) && eventData.length > 0) {
        setEvent(eventData[0]);
      } else {
        setEvent(null);
        setError('Event not found.');
      }
    } catch (err) {
      console.error('Error fetching single event:', err);

      setEvent(null);
      setError('Unable to load event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  // =========================================================
  // DECODE DESCRIPTION
  // =========================================================

  const decodedDescription = useMemo(() => {
    if (!event?.description) {
      return '';
    }

    let value = event.description;

    try {
      for (let i = 0; i < 3; i++) {
        const decoded = decodeURIComponent(value);

        if (decoded === value) {
          break;
        }

        value = decoded;
      }
    } catch (error) {
      console.log('Description decoding error:', error);
    }

    return value;
  }, [event]);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = date => {
    if (!date) {
      return '';
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = time => {
    if (!time) {
      return '';
    }

    const [hours, minutes] = time.split(':');

    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // =========================================================
  // DATE TEXT
  // =========================================================

  const dateText = useMemo(() => {
    if (!event) {
      return '';
    }

    const startDate = formatDate(event.start_date);

    const endDate = formatDate(event.end_date);

    if (event.end_date && event.end_date !== event.start_date) {
      return `${startDate} – ${endDate}`;
    }

    return startDate;
  }, [event]);

  // =========================================================
  // TIME TEXT
  // =========================================================

  const timeText = useMemo(() => {
    if (!event) {
      return '';
    }

    let value = '';
    // returnng null if start and end tie is 00
    if (event.start_time == '00:00:00' || event.end_time == '00:00:00') {
      value = '';
      return;
    }

    if (event.start_time) {
      value = formatTime(event.start_time);
    }

    if (event.end_time) {
      value += ` – ${formatTime(event.end_time)}`;
    }

    return value;
  }, [event]);

  // =========================================================
  // IMAGE URL
  // =========================================================

  const imageUrl = useMemo(() => {
    if (!event?.cover_image_full_url) {
      return null;
    }

    const image = String(event.cover_image_full_url).trim();

    if (!image) {
      return null;
    }

    return image;
  }, [event]);

  // =========================================================
  // LOCATION
  // =========================================================

  const locationName = event?.location_name || '';

  const locationAddress = event?.location_address || '';

  // =========================================================
  // GOOGLE MAP
  // =========================================================

  const getMapUrl = () => {
    if (!event?.location_map_url) {
      return '';
    }

    let url = String(event.location_map_url).trim();

    url = url.replace(/^\[|\]$/g, '');

    return url;
  };

  const openMap = async () => {
    const url = getMapUrl();

    if (!url) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('Cannot open map URL:', url);
      }
    } catch (error) {
      console.error('Unable to open map:', error);
    }
  };

  // =========================================================
  // DESCRIPTION LINK HANDLER
  // =========================================================
  // Handles links coming from the HTML description.
  //
  // Example:
  // <a href="https://gieogita.org">GIEO Gita</a>
  //
  // Both external websites and our own websites
  // will open in the device browser.
  // =========================================================

  const handleDescriptionLinkPress = async (event, href) => {
    if (!href) {
      return;
    }

    try {
      const url = String(href).trim();

      if (!url) {
        return;
      }

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('Cannot open description link:', url);
      }
    } catch (error) {
      console.error('Unable to open description link:', error);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.saffron} />

        <Text style={styles.loadingText}>Loading event...</Text>
      </View>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (!event) {
    return (
      <View style={styles.emptyContainer}>
        <TouchableOpacity
          style={styles.errorBackButton}
          activeOpacity={0.8}
          onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.emptyIcon}>📅</Text>

        <Text style={styles.emptyTitle}>Event Not Found</Text>

        <Text style={styles.emptyText}>
          {error || 'The event you are looking for is not available.'}
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =========================================================
  // HTML WIDTH
  // =========================================================

  const contentWidth = SCREEN_WIDTH - 24;

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* =====================================================
            BACK BUTTON + IMAGE
        ====================================================== */}

        <View style={styles.topRow}>
          {/* BACK BUTTON */}

          <TouchableOpacity
            style={styles.topBackButton}
            activeOpacity={0.8}
            onPress={() => router.back()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          {/* EVENT IMAGE */}

          {imageUrl ? (
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri: imageUrl,
                }}
                style={styles.coverImage}
                resizeMode="cover"
                onError={err => {
                  console.log('Event image loading error:', err.nativeEvent);

                  console.log('Event image URL:', imageUrl);
                }}
              />
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderIcon}>📅</Text>
            </View>
          )}
        </View>

        {/* =====================================================
            TITLE
        ====================================================== */}

        <Text style={styles.title}>{event.title}</Text>

        {/* =====================================================
            DATE + TIME
        ====================================================== */}

        {dateText ? (
          <View style={styles.infoCard}>
            {/* DATE */}

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>📅</Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date</Text>

                <Text style={styles.infoValue}>{dateText}</Text>
              </View>
            </View>

            {/* TIME */}

            {timeText ? (
              <>
                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <Text style={styles.icon}>⏰</Text>
                  </View>

                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Time</Text>

                    <Text style={styles.infoValue}>{timeText}</Text>
                  </View>
                </View>
              </>
            ) : null}
          </View>
        ) : null}

        {/* =====================================================
            LOCATION
        ====================================================== */}

        {locationName || locationAddress ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Venue</Text>

            <View style={styles.locationCard}>
              {locationName ? (
                <Text style={styles.locationName}>{locationName}</Text>
              ) : null}

              {locationAddress ? (
                <Text style={styles.locationAddress}>{locationAddress}</Text>
              ) : null}

              {event.location_map_url ? (
                <TouchableOpacity
                  style={styles.mapButton}
                  activeOpacity={0.8}
                  onPress={openMap}>
                  <Text style={styles.mapButtonText}>
                    📍 Open in Google Maps
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}

        {decodedDescription ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Event</Text>

            <View style={styles.descriptionCard}>
              <RenderHTML
                contentWidth={contentWidth}

                source={{
                  html: decodedDescription,
                }}

                /*
                 * THIS IS THE ONLY NEW FUNCTIONALITY:
                 * Links inside the API HTML description
                 * are now clickable.
                 */
                renderersProps={{
                  a: {
                    onPress: handleDescriptionLinkPress,
                  },
                }}

                tagsStyles={{
                  p: {
                    color: COLORS.warmBrown,
                    fontSize: 14,
                    lineHeight: 23,
                    marginTop: 0,
                    marginBottom: 12,
                  },

                  span: {
                    color: COLORS.warmBrown,
                  },

                  strong: {
                    color: COLORS.deepBrown,
                    fontWeight: '800',
                  },

                  b: {
                    color: COLORS.deepBrown,
                    fontWeight: '800',
                  },

                  em: {
                    color: COLORS.warmBrown,
                  },

                  i: {
                    color: COLORS.warmBrown,
                  },

                  br: {
                    height: 8,
                  },

                  ul: {
                    marginTop: 5,
                    marginBottom: 10,
                  },

                  ol: {
                    marginTop: 5,
                    marginBottom: 10,
                  },

                  li: {
                    color: COLORS.warmBrown,
                    fontSize: 14,
                    lineHeight: 23,
                    marginBottom: 5,
                  },

                  h1: {
                    color: COLORS.deepBrown,
                    fontSize: 22,
                    fontWeight: '800',
                    marginBottom: 12,
                  },

                  h2: {
                    color: COLORS.deepBrown,
                    fontSize: 19,
                    fontWeight: '800',
                    marginBottom: 10,
                  },

                  h3: {
                    color: COLORS.deepBrown,
                    fontSize: 17,
                    fontWeight: '800',
                    marginBottom: 8,
                  },

                  // =================================================
                  // CLICKABLE LINKS
                  // =================================================

                  a: {
                    color: COLORS.saffron,
                    textDecorationLine: 'underline',
                    fontWeight: '700',
                  },
                }}
              />
            </View>
          </View>
        ) : null}

        {/* =====================================================
            DIRECTIONS
        ====================================================== */}

        {event.location_map_url ? (
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={openMap}>
            <Text style={styles.primaryButtonText}>📍 Get Directions</Text>
          </TouchableOpacity>
        ) : null}

        <Spacer height={120} />
      </ScrollView>
    </View>
  );
}

// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({
  // =========================================================
  // CONTAINER
  // =========================================================

  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
  },
  // =========================================================
  // TOP ROW
  // =========================================================

  topRow: {
    width: '100%',
    flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 14,
  },
  // =========================================================
  // BACK BUTTON
  // =========================================================

  topBackButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  backArrow: {
    color: COLORS.saffron,
    fontSize: 32,
    lineHeight: 35,
    marginTop: -4,
  },
  // =========================================================
  // IMAGE
  // =========================================================

  imageWrapper: {
    flex: 1,
    height: 300,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    height: 230,
    borderRadius: radii.md,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 38,
  },
  // =========================================================
  // TITLE
  // =========================================================

  title: {
    color: COLORS.deepBrown,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400',
    marginBottom: 16,
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4,
  },
  // =========================================================
  // INFO CARD
  // =========================================================

  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: hairline,
    marginBottom: 20,
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  icon: {
    fontSize: 18,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginBottom: 3,
  },
  infoValue: {
    color: COLORS.deepBrown,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  divider: {
    height: 1,
    backgroundColor: hairline,
    marginVertical: 12,
  },
  // =========================================================
  // SECTION
  // =========================================================

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: COLORS.deepBrown,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 9,
  },
  // =========================================================
  // LOCATION
  // =========================================================

  locationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  locationName: {
    color: COLORS.deepBrown,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  locationAddress: {
    color: COLORS.warmBrown,
    fontSize: 13,
    lineHeight: 20,
  },
  mapButton: {
    marginTop: 13,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.richBrown,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mapButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  // =========================================================
  // DESCRIPTION
  // =========================================================

  descriptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  // =========================================================
  // PRIMARY BUTTON
  // =========================================================

  primaryButton: {
    backgroundColor: COLORS.richBrown,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    minHeight: 52,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  // =========================================================
  // LOADING
  // =========================================================

  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.warmBrown,
    fontSize: 12,
  },
  // =========================================================
  // EMPTY
  // =========================================================

  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorBackButton: {
    position: 'absolute',
    top: 14,
    left: 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    color: COLORS.deepBrown,
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 8,
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4,
  },
  emptyText: {
    color: COLORS.warmBrown,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.richBrown,
    borderRadius: radii.lg,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 16,
  },
});
