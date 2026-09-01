import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import { useEffect, useRef } from 'react';

import {
  Animated,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

// ============================================================
// BRAND COLOR SYSTEM
// ============================================================

const COLORS = {
  // Your main colors
  deepBrown: '#3a2c16',
  primaryBrown: '#5a3816',

  // Supporting browns
  mediumBrown: '#72502C',
  lightBrown: '#9A7953',

  // Biscuit / cream
  background: '#F4E9D8',
  biscuit: '#EADAC3',
  biscuitLight: '#F8F1E7',
  cream: '#FFFDF8',
  warmWhite: '#FFFBF4',

  // Borders
  border: '#DCC8AA',
  borderSoft: '#E8D9C5',

  // Text
  textPrimary: '#3a2c16',
  textSecondary: '#725F48',
  textMuted: '#9A8872',

  // Soft accent
  accent: '#B89462',
  accentLight: '#D7BE97',

  // Keep YouTube red only for YouTube identity
  youtube: '#FF0033',

  white: '#FFFFFF',
};

// ============================================================
// YOUTUBE SETTINGS
// ============================================================

const YT_CHANNEL_ID = 'UCI0jiDrENDlgGcpe8T61efg';

const YT_PLAYLIST_ID = 'PLisrlFmbmaulMKK7cqY8V0Rk4BJiCJvzm';

const YT_HANDLE = '@GitaManishi';

// ============================================================
// VIDEOS
// Replace these IDs with your actual videos
// ============================================================

const YT_VIDEOS = [
  {
    id: 'v1',
    videoId: 'CO0ZTOnzSv8',
    title: 'Guru Shishya Samvad — गुरु शिष्य संवाद',
    views: '4.9K',
    duration: '18:42',
  },

  {
    id: 'v2',
    videoId: 'CO0ZTOnzSv8',
    title: 'Bhagwad Gita Pravachan by Maharaj Ji',
    views: '12K',
    duration: '45:10',
  },

  {
    id: 'v3',
    videoId: 'CO0ZTOnzSv8',
    title: 'Karma Yoga — The Path of Action | Satsang',
    views: '8.7K',
    duration: '32:18',
  },

  {
    id: 'v4',
    videoId: 'CO0ZTOnzSv8',
    title: 'Gita Saar — Essence of Life | Special Discourse',
    views: '21K',
    duration: '1:10:44',
  },
];

// ============================================================
// SHORTS
// ============================================================

const YT_SHORTS = [
  {
    id: 's1',
    videoId: 'CO0ZTOnzSv8',
    title: 'Morning Kirtan',
    duration: '0:58',
  },

  {
    id: 's2',
    videoId: 'CO0ZTOnzSv8',
    title: 'Gita Shloka Ch 4 V7',
    duration: '0:42',
  },

  {
    id: 's3',
    videoId: 'CO0ZTOnzSv8',
    title: 'Gaushala Blessings',
    duration: '0:55',
  },

  {
    id: 's4',
    videoId: 'CO0ZTOnzSv8',
    title: 'Bal Sanskar Recitation',
    duration: '0:47',
  },

  {
    id: 's5',
    videoId: 'CO0ZTOnzSv8',
    title: 'Ganga Aarti Haridwar',
    duration: '0:50',
  },
];

// ============================================================
// THUMBNAIL
// ============================================================

const thumb = id => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

const thumbMax = id => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

// ============================================================
// YOUTUBE ACTIONS
// ============================================================

const openVideo = videoId =>
  Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);

const openShort = videoId =>
  Linking.openURL(`https://www.youtube.com/shorts/${videoId}`);

const openChannel = () =>
  Linking.openURL(`https://www.youtube.com/@${YT_HANDLE.replace('@', '')}`);

const openPlaylist = () =>
  Linking.openURL(`https://www.youtube.com/playlist?list=${YT_PLAYLIST_ID}`);

// ============================================================
// PULSE DOT
// ============================================================

function PulseDot() {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.25,
          duration: 650,
          useNativeDriver: true,
        }),

        Animated.timing(anim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.pulseDot,
        {
          opacity: anim,
        },
      ]}
    />
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHead({ icon, title, accent, onAction, actionLabel }) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionHeadLeft}>
        <View style={styles.sectionIconBox}>
          <Text style={styles.sectionIcon}>{icon}</Text>
        </View>

        <View style={styles.sectionHeadingText}>
          <Text style={styles.sectionTitle}>{title}</Text>

          <Text style={styles.sectionAccent}>{accent}</Text>
        </View>
      </View>

      {onAction && (
        <TouchableOpacity
          style={styles.sectionActionBtn}
          onPress={onAction}
          activeOpacity={0.8}>
          <Text style={styles.sectionActionText}>{actionLabel || 'Open'}</Text>

          <MaterialCommunityIcons
            name="chevron-right"
            size={15}
            color={COLORS.primaryBrown}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ============================================================
// PLAYLIST WEBVIEW
// ============================================================

function YTPlaylistEmbed() {
  const html = `
    <!DOCTYPE html>

    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
        />

        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background: #000;
          }

          body {
            overflow: hidden;
          }

          .container {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%;
            height: 0;
          }

          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <iframe
            src="https://www.youtube-nocookie.com/embed/videoseries?list=${YT_PLAYLIST_ID}&rel=0&modestbranding=1&playsinline=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          >
          </iframe>
        </div>
      </body>
    </html>
  `;

  return (
    <WebView
      source={{ html }}
      style={styles.webView}
      scrollEnabled={false}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      javaScriptEnabled
      domStorageEnabled
      originWhitelist={['*']}
      mixedContentMode="always"
    />
  );
}

// ============================================================
// VIDEO CARD
// ============================================================

function YTVideoCard({ item }) {
  return (
    <TouchableOpacity
      style={styles.videoCard}
      activeOpacity={0.9}
      onPress={() => openVideo(item.videoId)}>
      <View style={styles.videoThumbWrap}>
        <Image
          source={{
            uri: thumb(item.videoId),
          }}
          style={styles.videoThumbImg}
          resizeMode="cover"
        />

        <View style={styles.videoThumbOverlay} />

        {/* PLAY */}

        <View style={styles.videoPlayBtn}>
          <FontAwesome name="play" size={17} color={COLORS.white} />
        </View>

        {/* YOUTUBE */}

        <View style={styles.videoYTBadge}>
          <FontAwesome name="youtube-play" size={13} color={COLORS.youtube} />

          <Text style={styles.videoYTBadgeText}>YouTube</Text>
        </View>

        {/* DURATION */}

        <View style={styles.videoDurationBadge}>
          <Text style={styles.videoDurationText}>{item.duration}</Text>
        </View>
      </View>

      <View style={styles.videoMeta}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.videoMetaRow}>
          <MaterialCommunityIcons
            name="eye-outline"
            size={13}
            color={COLORS.lightBrown}
          />

          <Text style={styles.videoViews}>{item.views} views</Text>

          <View style={styles.metaDot} />

          <MaterialCommunityIcons
            name="clock-outline"
            size={12}
            color={COLORS.lightBrown}
          />

          <Text style={styles.videoDurationMeta}>{item.duration}</Text>
        </View>

        <View style={styles.videoOpenRow}>
          <Text style={styles.videoOpenText}>Watch on YouTube</Text>

          <MaterialCommunityIcons
            name="open-in-new"
            size={11}
            color={COLORS.primaryBrown}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ============================================================
// SHORT CARD
// ============================================================

function YTShortCard({ item }) {
  return (
    <TouchableOpacity
      style={styles.shortCard}
      activeOpacity={0.88}
      onPress={() => openShort(item.videoId)}>
      <View style={styles.shortThumbWrap}>
        <Image
          source={{
            uri: thumb(item.videoId),
          }}
          style={styles.shortThumbImg}
          resizeMode="cover"
        />

        <View style={styles.shortThumbOverlay} />

        <View style={styles.shortTopBadge}>
          <FontAwesome name="youtube-play" size={11} color={COLORS.youtube} />

          <Text style={styles.shortTopBadgeText}>SHORTS</Text>
        </View>

        <View style={styles.shortPlayBtn}>
          <FontAwesome name="play" size={13} color={COLORS.white} />
        </View>

        <View style={styles.shortDurationBadge}>
          <Text style={styles.shortDurationText}>{item.duration}</Text>
        </View>
      </View>

      <View style={styles.shortBottom}>
        <Text style={styles.shortTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <MaterialCommunityIcons
          name="chevron-right"
          size={16}
          color={COLORS.primaryBrown}
        />
      </View>
    </TouchableOpacity>
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function PromotionalScreen() {
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={styles.scrollContent}>
        {/* ===================================================
            HERO
        =================================================== */}

        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <FontAwesome
                name="youtube-play"
                size={13}
                color={COLORS.youtube}
              />

              <Text style={styles.heroBadgeText}>{YT_HANDLE}</Text>
            </View>

            <View style={styles.officialBadge}>
              <View style={styles.officialDot} />

              <Text style={styles.officialBadgeText}>OFFICIAL</Text>
            </View>
          </View>

          <Text style={styles.heroSmallTitle}>SWAMI GIANANAND</Text>

          <Text style={styles.heroHeading}>Watch Maharaj Ji</Text>

          <Text style={styles.heroAccent}>Live & On Demand</Text>

          <Text style={styles.heroDesc}>
            Pravachans, satsangs, aartis and Bhagwad Gita discourses, available
            directly from the official channel.
          </Text>

          {/* STATS */}

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>34.2K</Text>

              <Text style={styles.heroStatLabel}>Subscribers</Text>
            </View>

            <View style={[styles.heroStat, styles.heroStatMiddle]}>
              <Text style={styles.heroStatVal}>1.6K+</Text>

              <Text style={styles.heroStatLabel}>Videos</Text>
            </View>

            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>5M+</Text>

              <Text style={styles.heroStatLabel}>Views</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.heroBtn}
            activeOpacity={0.86}
            onPress={openChannel}>
            <FontAwesome name="youtube-play" size={17} color={COLORS.white} />

            <Text style={styles.heroBtnText}>Visit YouTube Channel</Text>

            <MaterialCommunityIcons
              name="arrow-top-right"
              size={15}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* ===================================================
            PLAYLIST HEADER
        =================================================== */}

        <SectionHead
          icon="▶"
          title="Channel Playlist"
          accent="Featured collection"
          onAction={openPlaylist}
          actionLabel="View All"
        />

        {/* ===================================================
            PLAYLIST
        =================================================== */}

        <View style={styles.embedCard}>
          <View style={styles.embedCardHeader}>
            <View style={styles.embedLivePill}>
              <PulseDot />

              <Text style={styles.embedLivePillText}>NOW PLAYING</Text>
            </View>

            <Text style={styles.embedCardTitle} numberOfLines={1}>
              Swami Giananand
            </Text>

            <FontAwesome name="youtube-play" size={17} color={COLORS.youtube} />
          </View>

          <YTPlaylistEmbed />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openPlaylist}
            style={styles.embedCardFooter}>
            <MaterialCommunityIcons
              name="playlist-play"
              size={18}
              color={COLORS.primaryBrown}
            />

            <Text style={styles.embedCardFooterText}>
              Browse the complete playlist
            </Text>

            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={COLORS.primaryBrown}
            />
          </TouchableOpacity>
        </View>

        {/* ===================================================
            PRAVACHAN
        =================================================== */}

        <SectionHead
          icon="▶"
          title="Pravachan"
          accent="Latest videos"
          onAction={openChannel}
          actionLabel="View All"
        />

        <View style={styles.videosList}>
          {YT_VIDEOS.map(item => (
            <YTVideoCard key={item.id} item={item} />
          ))}
        </View>

        {/* ===================================================
            SHORTS
        =================================================== */}

        <SectionHead
          icon="◆"
          title="YouTube Shorts"
          accent="Short spiritual moments"
          onAction={() =>
            Linking.openURL(`https://www.youtube.com/${YT_HANDLE}/shorts`)
          }
          actionLabel="All Shorts"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shortsRow}
          nestedScrollEnabled>
          {YT_SHORTS.map(item => (
            <YTShortCard key={item.id} item={item} />
          ))}
        </ScrollView>

        {/* ===================================================
            INFO
        =================================================== */}

        <View style={styles.noteCard}>
          <View style={styles.noteIconBox}>
            <MaterialCommunityIcons
              name="information-outline"
              size={17}
              color={COLORS.primaryBrown}
            />
          </View>

          <Text style={styles.noteText}>
            Videos open in YouTube for the best viewing experience. The featured
            playlist can also be watched inside the app.
          </Text>
        </View>

        {/* ===================================================
            CTA
        =================================================== */}

        <View style={styles.ctaCard}>
          <View style={styles.ctaIcon}>
            <FontAwesome name="youtube-play" size={28} color={COLORS.youtube} />
          </View>

          <Text style={styles.ctaHeading}>Never Miss a Pravachan</Text>

          <Text style={styles.ctaDesc}>
            Follow the official channel for Maharaj Ji&apos;s latest pravachans,
            satsangs and Bhagwad Gita discourses.
          </Text>

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={openChannel}
            activeOpacity={0.86}>
            <FontAwesome name="youtube-play" size={15} color={COLORS.white} />

            <Text style={styles.ctaBtnText}>Subscribe on YouTube</Text>
          </TouchableOpacity>

          <View style={styles.ctaBellRow}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={14}
              color={COLORS.primaryBrown}
            />

            <Text style={styles.ctaBellText}>
              Turn on notifications for new videos
            </Text>
          </View>

          <View style={styles.ctaDivider} />

          <Text style={styles.ctaBrand}>GIEO GITA</Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // =========================================================
  // ROOT
  // =========================================================

  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 10,
  },

  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.youtube,
  },

  // =========================================================
  // SECTION HEADER
  // =========================================================

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginHorizontal: 18,
    marginTop: 24,
    marginBottom: 11,
  },

  sectionHeadLeft: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionIconBox: {
    width: 38,
    height: 38,

    borderRadius: 11,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  sectionIcon: {
    color: COLORS.primaryBrown,

    fontSize: 16,
    fontWeight: '800',
  },

  sectionHeadingText: {
    flex: 1,
  },

  sectionTitle: {
    color: COLORS.textPrimary,

    fontSize: 15,
    fontWeight: '800',
  },

  sectionAccent: {
    color: COLORS.textMuted,

    fontSize: 9.5,
    fontWeight: '600',

    marginTop: 1,
  },

  sectionActionBtn: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  sectionActionText: {
    color: COLORS.primaryBrown,

    fontSize: 9.5,
    fontWeight: '800',

    marginRight: 2,
  },

  // =========================================================
  // HERO
  // =========================================================

  hero: {
    marginHorizontal: 18,
    marginTop: 18,

    paddingHorizontal: 18,
    paddingTop: 17,
    paddingBottom: 18,

    borderRadius: 22,

    backgroundColor: COLORS.deepBrown,

    borderWidth: 1,
    borderColor: COLORS.primaryBrown,

    shadowColor: COLORS.deepBrown,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.18,
    shadowRadius: 14,

    elevation: 7,
  },

  heroTopRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 18,
  },

  heroBadge: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: 'rgba(255,255,255,0.08)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.12)',
  },

  heroBadgeText: {
    color: COLORS.warmWhite,

    marginLeft: 6,

    fontSize: 9.5,
    fontWeight: '700',
  },

  officialBadge: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: 'rgba(234,218,195,0.10)',
  },

  officialDot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    marginRight: 5,

    backgroundColor: COLORS.accentLight,
  },

  officialBadgeText: {
    color: COLORS.accentLight,

    fontSize: 8,
    fontWeight: '800',

    letterSpacing: 1,
  },

  heroSmallTitle: {
    color: COLORS.accentLight,

    fontSize: 9,

    fontWeight: '800',

    letterSpacing: 1.8,

    marginBottom: 7,
  },

  heroHeading: {
    color: COLORS.white,

    fontSize: 25,

    fontWeight: '800',

    lineHeight: 31,
  },

  heroAccent: {
    color: COLORS.accentLight,

    fontSize: 23,

    lineHeight: 30,

    fontWeight: '700',

    marginBottom: 11,
  },

  heroDesc: {
    maxWidth: 360,

    color: 'rgba(255,253,248,0.68)',

    fontSize: 11.5,

    lineHeight: 18,

    marginBottom: 17,
  },

  heroStats: {
    flexDirection: 'row',

    marginBottom: 16,

    borderRadius: 13,

    overflow: 'hidden',

    backgroundColor: 'rgba(255,255,255,0.06)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.09)',
  },

  heroStat: {
    flex: 1,

    alignItems: 'center',

    paddingVertical: 12,
  },

  heroStatMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,

    borderColor: 'rgba(255,255,255,0.10)',
  },

  heroStatVal: {
    color: COLORS.accentLight,

    fontSize: 15,

    fontWeight: '800',
  },

  heroStatLabel: {
    color: 'rgba(255,253,248,0.50)',

    fontSize: 8.5,

    marginTop: 3,
  },

  heroBtn: {
    minHeight: 48,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: 12,

    backgroundColor: COLORS.primaryBrown,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.12)',
  },

  heroBtnText: {
    color: COLORS.white,

    marginHorizontal: 8,

    fontSize: 12.5,

    fontWeight: '800',
  },

  // =========================================================
  // WEBVIEW / PLAYLIST
  // =========================================================

  webView: {
    width: '100%',
    height: 212,

    backgroundColor: '#000',
  },

  embedCard: {
    marginHorizontal: 18,

    overflow: 'hidden',

    borderRadius: 17,

    backgroundColor: COLORS.cream,

    borderWidth: 1,

    borderColor: COLORS.border,

    elevation: 4,

    shadowColor: COLORS.deepBrown,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.1,

    shadowRadius: 9,
  },

  embedCardHeader: {
    minHeight: 49,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 13,

    borderBottomWidth: 1,

    borderBottomColor: COLORS.borderSoft,
  },

  embedLivePill: {
    flexDirection: 'row',

    alignItems: 'center',

    marginRight: 9,

    paddingHorizontal: 8,

    paddingVertical: 4,

    borderRadius: 20,

    backgroundColor: '#FFF0F2',
  },

  embedLivePillText: {
    color: COLORS.youtube,

    marginLeft: 5,

    fontSize: 7.5,

    fontWeight: '800',

    letterSpacing: 0.5,
  },

  embedCardTitle: {
    flex: 1,

    color: COLORS.textPrimary,

    fontSize: 11,

    fontWeight: '700',

    marginRight: 7,
  },

  embedCardFooter: {
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 13,

    backgroundColor: COLORS.biscuitLight,

    borderTopWidth: 1,

    borderTopColor: COLORS.borderSoft,
  },

  embedCardFooterText: {
    flex: 1,

    color: COLORS.textSecondary,

    fontSize: 10,

    marginLeft: 7,
  },

  // =========================================================
  // VIDEOS
  // =========================================================

  videosList: {
    marginHorizontal: 18,
  },

  videoCard: {
    marginBottom: 13,

    overflow: 'hidden',

    borderRadius: 16,

    backgroundColor: COLORS.cream,

    borderWidth: 1,

    borderColor: COLORS.borderSoft,

    elevation: 3,

    shadowColor: COLORS.deepBrown,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,

    shadowRadius: 7,
  },

  videoThumbWrap: {
    width: '100%',

    height: width > 500 ? 240 : 188,

    position: 'relative',

    backgroundColor: '#000',
  },

  videoThumbImg: {
    width: '100%',
    height: '100%',
  },

  videoThumbOverlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'rgba(20,12,5,0.24)',
  },

  videoPlayBtn: {
    position: 'absolute',

    alignSelf: 'center',

    top: '36%',

    width: 52,
    height: 52,

    borderRadius: 26,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: COLORS.primaryBrown,

    borderWidth: 2,

    borderColor: 'rgba(255,255,255,0.80)',
  },

  videoDurationBadge: {
    position: 'absolute',

    bottom: 8,
    right: 8,

    paddingHorizontal: 7,
    paddingVertical: 4,

    borderRadius: 5,

    backgroundColor: 'rgba(20,12,5,0.86)',
  },

  videoDurationText: {
    color: COLORS.white,

    fontSize: 9.5,

    fontWeight: '700',
  },

  videoYTBadge: {
    position: 'absolute',

    top: 9,
    left: 9,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: 'rgba(255,255,255,0.94)',
  },

  videoYTBadgeText: {
    color: COLORS.deepBrown,

    fontSize: 8.5,

    fontWeight: '800',

    marginLeft: 4,
  },

  videoMeta: {
    paddingHorizontal: 13,
    paddingVertical: 12,
  },

  videoTitle: {
    color: COLORS.textPrimary,

    fontSize: 13,

    fontWeight: '800',

    lineHeight: 18,

    marginBottom: 8,
  },

  videoMetaRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 8,
  },

  videoViews: {
    color: COLORS.textMuted,

    marginLeft: 4,

    fontSize: 9.5,
  },

  metaDot: {
    width: 3,
    height: 3,

    borderRadius: 2,

    marginHorizontal: 7,

    backgroundColor: COLORS.border,
  },

  videoDurationMeta: {
    color: COLORS.textMuted,

    marginLeft: 4,

    fontSize: 9.5,
  },

  videoOpenRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  videoOpenText: {
    color: COLORS.primaryBrown,

    marginRight: 4,

    fontSize: 9,

    fontWeight: '700',
  },

  // =========================================================
  // SHORTS
  // =========================================================

  shortsRow: {
    paddingHorizontal: 18,
    paddingBottom: 3,
  },

  shortCard: {
    width: 145,

    marginRight: 11,

    overflow: 'hidden',

    borderRadius: 15,

    backgroundColor: COLORS.cream,

    borderWidth: 1,

    borderColor: COLORS.borderSoft,

    elevation: 3,

    shadowColor: COLORS.deepBrown,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,

    shadowRadius: 6,
  },

  shortThumbWrap: {
    width: '100%',

    height: 228,

    position: 'relative',

    backgroundColor: '#000',
  },

  shortThumbImg: {
    width: '100%',
    height: '100%',
  },

  shortThumbOverlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'rgba(24,14,6,0.20)',
  },

  shortTopBadge: {
    position: 'absolute',

    top: 8,
    left: 8,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 7,
    paddingVertical: 4,

    borderRadius: 20,

    backgroundColor: 'rgba(255,255,255,0.94)',
  },

  shortTopBadgeText: {
    color: COLORS.deepBrown,

    marginLeft: 4,

    fontSize: 7,

    fontWeight: '800',
  },

  shortPlayBtn: {
    position: 'absolute',

    alignSelf: 'center',

    top: '42%',

    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: 'rgba(90,56,22,0.92)',

    borderWidth: 1.5,

    borderColor: 'rgba(255,255,255,0.8)',
  },

  shortDurationBadge: {
    position: 'absolute',

    bottom: 8,
    right: 8,

    paddingHorizontal: 6,
    paddingVertical: 3,

    borderRadius: 4,

    backgroundColor: 'rgba(20,12,5,0.84)',
  },

  shortDurationText: {
    color: COLORS.white,

    fontSize: 8.5,

    fontWeight: '700',
  },

  shortBottom: {
    minHeight: 50,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 9,

    paddingVertical: 8,
  },

  shortTitle: {
    flex: 1,

    color: COLORS.textPrimary,

    fontSize: 9.5,

    fontWeight: '700',

    lineHeight: 13,

    marginRight: 3,
  },

  // =========================================================
  // NOTE
  // =========================================================

  noteCard: {
    flexDirection: 'row',

    alignItems: 'center',

    marginHorizontal: 18,

    marginTop: 18,

    paddingHorizontal: 12,

    paddingVertical: 11,

    borderRadius: 13,

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  noteIconBox: {
    width: 31,
    height: 31,

    borderRadius: 16,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 9,

    backgroundColor: COLORS.biscuit,
  },

  noteText: {
    flex: 1,

    color: COLORS.textSecondary,

    fontSize: 9.5,

    lineHeight: 14,
  },

  // =========================================================
  // CTA
  // =========================================================

  ctaCard: {
    marginHorizontal: 18,
    marginTop: 20,

    paddingHorizontal: 20,
    paddingVertical: 22,

    alignItems: 'center',

    borderRadius: 20,

    backgroundColor: COLORS.cream,

    borderWidth: 1,

    borderColor: COLORS.border,

    elevation: 4,

    shadowColor: COLORS.deepBrown,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.1,

    shadowRadius: 8,
  },

  ctaIcon: {
    width: 58,
    height: 58,

    borderRadius: 29,

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 13,

    backgroundColor: COLORS.biscuitLight,

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  ctaHeading: {
    color: COLORS.textPrimary,

    fontSize: 18,

    fontWeight: '800',

    textAlign: 'center',

    marginBottom: 7,
  },

  ctaDesc: {
    maxWidth: 320,

    color: COLORS.textSecondary,

    fontSize: 10.5,

    lineHeight: 16,

    textAlign: 'center',

    marginBottom: 17,
  },

  ctaBtn: {
    width: '100%',

    minHeight: 48,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: 12,

    backgroundColor: COLORS.primaryBrown,

    borderWidth: 1,

    borderColor: COLORS.deepBrown,

    elevation: 3,

    shadowColor: COLORS.deepBrown,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.16,

    shadowRadius: 5,
  },

  ctaBtnText: {
    color: COLORS.white,

    marginLeft: 8,

    fontSize: 12.5,

    fontWeight: '800',
  },

  ctaBellRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 12,

    paddingHorizontal: 11,
    paddingVertical: 7,

    borderRadius: 20,

    backgroundColor: COLORS.biscuitLight,
  },

  ctaBellText: {
    color: COLORS.primaryBrown,

    fontSize: 9,

    fontWeight: '600',

    marginLeft: 6,
  },

  ctaDivider: {
    width: 40,

    height: 1,

    marginTop: 17,
    marginBottom: 9,

    backgroundColor: COLORS.border,
  },

  ctaBrand: {
    color: COLORS.lightBrown,

    fontSize: 8,

    fontWeight: '800',

    letterSpacing: 2,
  },

  // =========================================================
  // END SPACE
  // =========================================================

  bottomSpace: {
    height: 28,
  },
});
