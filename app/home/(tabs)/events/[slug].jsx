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

import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import RenderHTML from 'react-native-render-html';

import { COLORS } from '@/components/home/constant';
import { conf } from '@/lib/conf';
import eventServices from '@/lib/services/eventServices';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Event() {
    const params = useLocalSearchParams();

    const slug = Array.isArray(params.slug)
        ? params.slug[0]
        : params.slug;

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

            const response =
                await eventServices.getPublicEvent(slug);

            console.log(
                'Single Event API Response:',
                response
            );

            const eventData = response?.data?.data;

            if (
                Array.isArray(eventData) &&
                eventData.length > 0
            ) {
                setEvent(eventData[0]);
            } else {
                setEvent(null);
                setError('Event not found.');
            }
        } catch (err) {
            console.error(
                'Error fetching single event:',
                err
            );

            setEvent(null);
            setError(
                'Unable to load event. Please try again.'
            );
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
            // Decode multiple times because your backend
            // description is URL encoded.
            for (let i = 0; i < 3; i++) {
                const decoded = decodeURIComponent(value);

                if (decoded === value) {
                    break;
                }

                value = decoded;
            }
        } catch (error) {
            console.log(
                'Description decoding error:',
                error
            );
        }

        return value;
    }, [event]);

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {
        if (!date) {
            return '';
        }

        const parsedDate = new Date(
            `${date}T00:00:00`
        );

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            'en-IN',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }
        );
    };

    // =========================================================
    // FORMAT TIME
    // =========================================================

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

        return date.toLocaleTimeString(
            'en-IN',
            {
                hour: 'numeric',
                minute: '2-digit',
            }
        );
    };

    // =========================================================
    // DATE TEXT
    // =========================================================

    const dateText = useMemo(() => {
        if (!event) {
            return '';
        }

        const startDate = formatDate(
            event.start_date
        );

        const endDate = formatDate(
            event.end_date
        );

        if (
            event.end_date &&
            event.end_date !== event.start_date
        ) {
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
        if (!event?.cover_image_url) {
            return null;
        }

        const image = String(
            event.cover_image_url
        ).trim();

        if (!image) {
            return null;
        }

        // Already a complete URL
        if (
            image.startsWith('http://') ||
            image.startsWith('https://')
        ) {
            return image;
        }

        /*
         * Your API currently returns only:
         *
         * WhatsApp_Image_2026....jpeg
         *
         * Therefore we create the media URL here.
         *
         * If your backend stores event images somewhere else,
         * change only EVENT_IMAGE_PATH below.
         */

        const apiOrigin = conf.apiBaseURL.replace(
            /\/api\/v\d+\/?$/,
            ''
        );

        const EVENT_IMAGE_PATH =
            '/uploads/events/';

        return `${apiOrigin}${EVENT_IMAGE_PATH}${image}`;
    }, [event]);

    // =========================================================
    // LOCATION
    // =========================================================

    const locationName =
        event?.location_name || '';

    const locationAddress =
        event?.location_address || '';

    // =========================================================
    // GOOGLE MAP
    // =========================================================

    const getMapUrl = () => {
        if (!event?.location_map_url) {
            return '';
        }

        let url = String(
            event.location_map_url
        ).trim();

        // Remove [ ] if backend sends:
        // [https://maps.google.com/...]
        url = url.replace(/^\[|\]$/g, '');

        return url;
    };

    const openMap = async () => {
        const url = getMapUrl();

        if (!url) {
            return;
        }

        try {
            const supported =
                await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            } else {
                console.log(
                    'Cannot open map URL:',
                    url
                );
            }
        } catch (error) {
            console.error(
                'Unable to open map:',
                error
            );
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color={COLORS.gold}
                />

                <Text style={styles.loadingText}>
                    Loading event...
                </Text>
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
                    style={styles.floatingBackButton}
                    activeOpacity={0.8}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backArrow}>
                        ‹
                    </Text>
                </TouchableOpacity>

                <Text style={styles.emptyIcon}>
                    📅
                </Text>

                <Text style={styles.emptyTitle}>
                    Event Not Found
                </Text>

                <Text style={styles.emptyText}>
                    {error ||
                        'The event you are looking for is not available.'}
                </Text>

                <TouchableOpacity
                    style={styles.backButton}
                    activeOpacity={0.8}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>
                        ← Go Back
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // =========================================================
    // HTML RENDERER WIDTH
    // =========================================================

    const contentWidth =
        SCREEN_WIDTH - 40;

    // =========================================================
    // RETURN
    // =========================================================

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.scrollContent
                }
            >
                {/* =====================================================
            BACK BUTTON
        ====================================================== */}

                <TouchableOpacity
                    style={styles.floatingBackButton}
                    activeOpacity={0.8}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backArrow}>
                        ‹
                    </Text>
                </TouchableOpacity>

                {/* =====================================================
            COVER IMAGE
        ====================================================== */}

                {imageUrl ? (
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{
                                uri: event.cover_image_full_url,
                            }}
                            style={styles.coverImage}
                            resizeMode="cover"
                            onError={(error) => {
                                console.log(
                                    'Event image loading error:',
                                    error.nativeEvent
                                );

                                console.log(
                                    'Image URL:',
                                    imageUrl
                                );
                            }}
                        />
                    </View>
                ) : null}

                {/* =====================================================
            TITLE
        ====================================================== */}

                <Text style={styles.title}>
                    {event.title}
                </Text>

                {/* =====================================================
            DATE
        ====================================================== */}

                {dateText ? (
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.iconBox}>
                                <Text style={styles.icon}>
                                    📅
                                </Text>
                            </View>

                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>
                                    Date
                                </Text>

                                <Text style={styles.infoValue}>
                                    {dateText}
                                </Text>
                            </View>
                        </View>

                        {timeText ? (
                            <>
                                <View style={styles.divider} />

                                <View style={styles.infoRow}>
                                    <View
                                        style={styles.iconBox}
                                    >
                                        <Text
                                            style={styles.icon}
                                        >
                                            ⏰
                                        </Text>
                                    </View>

                                    <View
                                        style={styles.infoContent}
                                    >
                                        <Text
                                            style={
                                                styles.infoLabel
                                            }
                                        >
                                            Time
                                        </Text>

                                        <Text
                                            style={
                                                styles.infoValue
                                            }
                                        >
                                            {timeText}
                                        </Text>
                                    </View>
                                </View>
                            </>
                        ) : null}
                    </View>
                ) : null}

                {/* =====================================================
            LOCATION
        ====================================================== */}

                {(locationName ||
                    locationAddress) ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            📍 Venue
                        </Text>

                        <View
                            style={styles.locationCard}
                        >
                            {locationName ? (
                                <Text
                                    style={
                                        styles.locationName
                                    }
                                >
                                    {locationName}
                                </Text>
                            ) : null}

                            {locationAddress ? (
                                <Text
                                    style={
                                        styles.locationAddress
                                    }
                                >
                                    {locationAddress}
                                </Text>
                            ) : null}

                            {event.location_map_url ? (
                                <TouchableOpacity
                                    style={styles.mapButton}
                                    activeOpacity={0.8}
                                    onPress={openMap}
                                >
                                    <Text
                                        style={
                                            styles.mapButtonText
                                        }
                                    >
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
                        <Text style={styles.sectionTitle}>
                            About This Event
                        </Text>

                        <View
                            style={styles.descriptionCard}
                        >
                            <RenderHTML
                                contentWidth={contentWidth}
                                source={{
                                    html: decodedDescription,
                                }}
                                tagsStyles={{
                                    p: {
                                        color:
                                            'rgba(253,246,227,0.78)',
                                        fontSize: 14,
                                        lineHeight: 23,
                                        marginTop: 0,
                                        marginBottom: 12,
                                    },

                                    span: {
                                        color:
                                            'rgba(253,246,227,0.78)',
                                    },

                                    strong: {
                                        color: COLORS.goldLight,
                                        fontWeight: '800',
                                    },

                                    b: {
                                        color: COLORS.goldLight,
                                        fontWeight: '800',
                                    },

                                    em: {
                                        color:
                                            'rgba(253,246,227,0.78)',
                                        fontStyle: 'italic',
                                    },

                                    i: {
                                        color:
                                            'rgba(253,246,227,0.78)',
                                        fontStyle: 'italic',
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
                                        color:
                                            'rgba(253,246,227,0.78)',
                                        fontSize: 14,
                                        lineHeight: 23,
                                        marginBottom: 5,
                                    },

                                    h1: {
                                        color: COLORS.cream,
                                        fontSize: 22,
                                        fontWeight: '800',
                                        marginBottom: 12,
                                    },

                                    h2: {
                                        color: COLORS.cream,
                                        fontSize: 19,
                                        fontWeight: '800',
                                        marginBottom: 10,
                                    },

                                    h3: {
                                        color: COLORS.goldLight,
                                        fontSize: 17,
                                        fontWeight: '800',
                                        marginBottom: 8,
                                    },

                                    a: {
                                        color: COLORS.goldLight,
                                        textDecorationLine:
                                            'underline',
                                    },
                                }}
                            />
                        </View>
                    </View>
                ) : null}

                {/* =====================================================
            MAP / DIRECTIONS
        ====================================================== */}

                {event.location_map_url ? (
                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.85}
                        onPress={openMap}
                    >
                        <Text
                            style={
                                styles.primaryButtonText
                            }
                        >
                            📍 Get Directions
                        </Text>
                    </TouchableOpacity>
                ) : null}

                <View style={styles.bottomSpace} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // =========================================================
    // CONTAINER
    // =========================================================

    container: {
        flex: 1,
        backgroundColor: COLORS.deepBrown,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 30,
    },

    // =========================================================
    // BACK BUTTON
    // =========================================================

    floatingBackButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor:
            'rgba(201,162,39,0.16)',
        borderWidth: 1,
        borderColor:
            'rgba(201,162,39,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },

    backArrow: {
        color: COLORS.gold,
        fontSize: 32,
        lineHeight: 35,
        marginTop: -4,
    },

    // =========================================================
    // IMAGE
    // =========================================================

    imageWrapper: {
        width: '100%',
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: COLORS.richBrown,
        marginBottom: 20,
        borderWidth: 1,
        borderColor:
            'rgba(201,162,39,0.25)',
    },

    coverImage: {
        width: '100%',
        height: 220,
    },

    // =========================================================
    // TITLE
    // =========================================================

    title: {
        color: COLORS.cream,
        fontSize: 25,
        lineHeight: 34,
        fontWeight: '800',
        marginBottom: 18,
    },

    // =========================================================
    // INFO CARD
    // =========================================================

    infoCard: {
        backgroundColor: COLORS.richBrown,
        borderRadius: 16,
        padding: 15,
        borderWidth: 1,
        borderColor:
            'rgba(201,162,39,0.25)',
        marginBottom: 22,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 11,
        backgroundColor:
            'rgba(201,162,39,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    icon: {
        fontSize: 19,
    },

    infoContent: {
        flex: 1,
    },

    infoLabel: {
        color:
            'rgba(253,246,227,0.48)',
        fontSize: 10,
        marginBottom: 3,
    },

    infoValue: {
        color: COLORS.cream,
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 19,
    },

    divider: {
        height: 1,
        backgroundColor:
            'rgba(201,162,39,0.12)',
        marginVertical: 13,
    },

    // =========================================================
    // SECTION
    // =========================================================

    section: {
        marginBottom: 22,
    },

    sectionTitle: {
        color: COLORS.goldLight,
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 10,
    },

    // =========================================================
    // LOCATION
    // =========================================================

    locationCard: {
        backgroundColor: COLORS.richBrown,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor:
            'rgba(201,162,39,0.25)',
    },

    locationName: {
        color: COLORS.cream,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },

    locationAddress: {
        color:
            'rgba(253,246,227,0.68)',
        fontSize: 13,
        lineHeight: 20,
    },

    mapButton: {
        marginTop: 14,
        alignSelf: 'flex-start',
        backgroundColor:
            'rgba(201,162,39,0.14)',
        borderWidth: 1,
        borderColor:
            'rgba(201,162,39,0.35)',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },

    mapButtonText: {
        color: COLORS.goldLight,
        fontSize: 11,
        fontWeight: '700',
    },

    // =========================================================
    // DESCRIPTION
    // =========================================================

    descriptionCard: {
        backgroundColor: COLORS.richBrown,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor:
            'rgba(201,162,39,0.2)',
    },

    // =========================================================
    // PRIMARY BUTTON
    // =========================================================

    primaryButton: {
        backgroundColor: COLORS.gold,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },

    primaryButtonText: {
        color: COLORS.deepBrown,
        fontSize: 14,
        fontWeight: '800',
    },

    // =========================================================
    // LOADING
    // =========================================================

    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.deepBrown,
        alignItems: 'center',
        justifyContent: 'center',
    },

    loadingText: {
        marginTop: 10,
        color: COLORS.goldLight,
        fontSize: 12,
    },

    // =========================================================
    // EMPTY
    // =========================================================

    emptyContainer: {
        flex: 1,
        backgroundColor: COLORS.deepBrown,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },

    emptyIcon: {
        fontSize: 42,
        marginBottom: 12,
    },

    emptyTitle: {
        color: COLORS.cream,
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 8,
    },

    emptyText: {
        color:
            'rgba(253,246,227,0.6)',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },

    backButton: {
        backgroundColor: COLORS.gold,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 11,
    },

    backButtonText: {
        color: COLORS.deepBrown,
        fontSize: 13,
        fontWeight: '800',
    },

    bottomSpace: {
        height: 20,
    },
});