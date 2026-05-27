import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
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

const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  richBrown: '#3D2010',
  gold:      '#C9A227',
  goldLight: '#E8C55A',
  goldDark:  '#8B6914',
  cream:     '#FDF6E3',
  saffron:   '#E8721C',
  ytRed:     '#FF0000',
};

const YT_CHANNEL_ID  = 'UCI0jiDrENDlgGcpe8T61efg';
const YT_PLAYLIST_ID = 'PLisrlFmbmaulMKK7cqY8V0Rk4BJiCJvzm';
const YT_HANDLE      = '@GitaManishi';

// ── Add your real video IDs here — thumbnails load automatically ──────────────
// To get video ID: open any video → copy the part after ?v= in the URL
const YT_VIDEOS = [
  { id: 'v1', videoId: 'CO0ZTOnzSv8', title: 'Guru Shishya Samvad — गुरु शिष्य संवाद',           views: '4.9K',  duration: '18:42' },
  { id: 'v2', videoId: 'CO0ZTOnzSv8', title: 'Bhagwad Gita Pravachan by Maharaj Ji',              views: '12K',   duration: '45:10' },
  { id: 'v3', videoId: 'CO0ZTOnzSv8', title: 'Karma Yoga — The Path of Action | Satsang',        views: '8.7K',  duration: '32:18' },
  { id: 'v4', videoId: 'CO0ZTOnzSv8', title: 'Gita Saar — Essence of Life | Special Discourse',  views: '21K',   duration: '1:10:44' },
];

// ── Shorts — use real short video IDs from your channel ──────────────────────
const YT_SHORTS = [
  { id: 's1', videoId: 'CO0ZTOnzSv8', title: 'Morning Kirtan',          duration: '0:58' },
  { id: 's2', videoId: 'CO0ZTOnzSv8', title: 'Gita Shloka Ch 4 V7',    duration: '0:42' },
  { id: 's3', videoId: 'CO0ZTOnzSv8', title: 'Gaushala Blessings',      duration: '0:55' },
  { id: 's4', videoId: 'CO0ZTOnzSv8', title: 'Bal Sanskar Recitation',  duration: '0:47' },
  { id: 's5', videoId: 'CO0ZTOnzSv8', title: 'Ganga Aarti Haridwar',    duration: '0:50' },
];

// ── YouTube thumbnail URL helper — works for ANY video ID, no API needed ─────
const thumb    = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const thumbMax = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

// ── Open video in YouTube app/browser ────────────────────────────────────────
const openVideo = (videoId) =>
  Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
const openShort = (videoId) =>
  Linking.openURL(`https://www.youtube.com/shorts/${videoId}`);
const openChannel = () =>
  Linking.openURL(`https://www.youtube.com/@${YT_HANDLE.replace('@','')}`);
const openPlaylist = () =>
  Linking.openURL(`https://www.youtube.com/playlist?list=${YT_PLAYLIST_ID}`);

// ── Pulse dot ─────────────────────────────────────────────────────────────────
function PulseDot() {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.1, duration: 600, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.pulseDot, { opacity: anim }]} />;
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHead({ icon, title, accent, onAction, actionLabel }) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionHeadLeft}>
        <View style={styles.sectionIconBox}>
          <Text style={styles.sectionIcon}>{icon}</Text>
        </View>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionAccent}>{accent}</Text>
        </View>
      </View>
      {onAction && (
        <TouchableOpacity style={styles.sectionActionBtn} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.sectionActionText}>{actionLabel || 'Open'}</Text>
          <MaterialCommunityIcons name="open-in-new" size={11} color={COLORS.ytRed} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Playlist WebView embed (uses playlist ID — no per-video embedding needed) ─
function YTPlaylistEmbed() {
  // Playlist embed works even when individual video embedding is disabled
  const html = `<!DOCTYPE html><html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
      <style>
        *{margin:0;padding:0;box-sizing:border-box;background:#000;}
        body{overflow:hidden;}
        .c{position:relative;width:100%;padding-bottom:56.25%;height:0;}
        iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:none;}
      </style>
    </head>
    <body><div class="c">
      <iframe
        src="https://www.youtube-nocookie.com/embed/videoseries?list=${YT_PLAYLIST_ID}&rel=0&modestbranding=1&playsinline=1"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
        allowfullscreen>
      </iframe>
    </div></body></html>`;
  return (
    <WebView
      source={{ html }}
      style={{ width: '100%', height: 212 }}
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

// ── Video Card — real thumbnail via img.youtube.com, opens in YT app on tap ──
function YTVideoCard({ item }) {
  return (
    <TouchableOpacity style={styles.videoCard} activeOpacity={0.88} onPress={() => openVideo(item.videoId)}>
      {/* Real thumbnail from YouTube CDN */}
      <View style={styles.videoThumbWrap}>
        <Image
          source={{ uri: thumb(item.videoId) }}
          style={styles.videoThumbImg}
          resizeMode="cover"
        />
        {/* Dark overlay */}
        <View style={styles.videoThumbOverlay} />
        {/* Play button */}
        <View style={styles.videoPlayBtn}>
          <FontAwesome name="play" size={20} color="#fff" />
        </View>
        {/* Duration */}
        <View style={styles.videoDurationBadge}>
          <Text style={styles.videoDurationText}>{item.duration}</Text>
        </View>
        {/* YT badge */}
        <View style={styles.videoYTBadge}>
          <FontAwesome name="youtube-play" size={14} color={COLORS.ytRed} />
        </View>
      </View>
      <View style={styles.videoMeta}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.videoMetaRow}>
          <FontAwesome name="youtube-play" size={10} color={COLORS.ytRed} />
          <Text style={styles.videoViews}>{item.views} views</Text>
          <Text style={styles.videoDot}>·</Text>
          <MaterialCommunityIcons name="clock-outline" size={10} color={COLORS.goldDark} />
          <Text style={styles.videoDurationMeta}>{item.duration}</Text>
        </View>
        <View style={styles.videoOpenRow}>
          <Text style={styles.videoOpenText}>Opens in YouTube</Text>
          <MaterialCommunityIcons name="open-in-new" size={10} color="rgba(253,246,227,0.3)" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Short Card — real thumbnail, opens YouTube Shorts on tap ─────────────────
function YTShortCard({ item }) {
  return (
    <TouchableOpacity style={styles.shortCard} activeOpacity={0.85} onPress={() => openShort(item.videoId)}>
      <View style={styles.shortThumbWrap}>
        <Image
          source={{ uri: thumb(item.videoId) }}
          style={styles.shortThumbImg}
          resizeMode="cover"
        />
        <View style={styles.shortThumbOverlay} />
        <View style={styles.shortPlayBtn}>
          <FontAwesome name="play" size={14} color="#fff" />
        </View>
        <View style={styles.shortDurationBadge}>
          <Text style={styles.shortDurationText}>{item.duration}</Text>
        </View>
        <View style={styles.shortTagBadge}>
          <Text style={styles.shortTagText}>#Shorts</Text>
        </View>
      </View>
      <Text style={styles.shortTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );
}

// ── MAIN SCREEN ───────────────────────────────────────────────────────────────
export default function PromotionalScreen() {
  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <FontAwesome name="youtube-play" size={12} color={COLORS.ytRed} />
            <Text style={styles.heroBadgeText}>Swami Giananand • {YT_HANDLE}</Text>
          </View>
          <Text style={styles.heroHeading}>
            Watch Maharaj Ji{'\n'}
            <Text style={styles.heroAccent}>Live & On Demand</Text>
          </Text>
          <Text style={styles.heroDesc}>
            Pravachans, live aartis, satsangs and Bhagwad Gita discourses —
            tap any video to watch directly in YouTube.
          </Text>
          <View style={styles.heroStats}>
            {[
              { icon: 'users',       val: '34.2K', label: 'Subscribers' },
              { icon: 'play-circle', val: '1.6K+', label: 'Videos'      },
              { icon: 'eye',         val: '5M+',   label: 'Total Views' },
            ].map((s, i) => (
              <View key={s.label} style={[styles.heroStat, i < 2 && styles.heroStatBorder]}>
                <FontAwesome name={s.icon} size={13} color={COLORS.ytRed} style={{ marginBottom: 4 }} />
                <Text style={styles.heroStatVal}>{s.val}</Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.heroBtn} onPress={openChannel} activeOpacity={0.85}>
            <FontAwesome name="youtube-play" size={15} color="#fff" />
            <Text style={styles.heroBtnText}>Subscribe on YouTube</Text>
          </TouchableOpacity>
        </View>

        {/* ── Playlist Embed — works without per-video embedding ── */}
        <SectionHead
          icon="🔴"
          title="Channel Playlist"
          accent="All Videos — Embedded"
          onAction={openPlaylist}
          actionLabel="Open Playlist"
        />
        <View style={styles.embedCard}>
          <View style={styles.embedCardHeader}>
            <View style={styles.embedLivePill}>
              <PulseDot />
              <Text style={styles.embedLivePillText}>PLAYING</Text>
            </View>
            <FontAwesome name="youtube-play" size={15} color={COLORS.ytRed} />
            <Text style={styles.embedCardTitle}>Swami Giananand — Full Playlist</Text>
          </View>
          <YTPlaylistEmbed />
          <View style={styles.embedCardFooter}>
            <MaterialCommunityIcons name="gesture-tap" size={13} color="rgba(253,246,227,0.4)" />
            <Text style={styles.embedCardFooterText}>
              Tap the player · swipe to browse · all {YT_HANDLE} videos
            </Text>
          </View>
        </View>

        {/* ── Pravachan Videos ── */}
        <SectionHead
          icon="▶️"
          title="Pravachan"
          accent="Latest Videos"
          onAction={openChannel}
          actionLabel="View All"
        />
        <View style={styles.videosList}>
          {YT_VIDEOS.map((item) => (
            <YTVideoCard key={item.id} item={item} />
          ))}
        </View>

        {/* ── YouTube Shorts ── */}
        <SectionHead
          icon="⚡"
          title="YouTube"
          accent="Shorts"
          onAction={() => Linking.openURL(`https://www.youtube.com/${YT_HANDLE}/shorts`)}
          actionLabel="All Shorts"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shortsRow}
          nestedScrollEnabled
        >
          {YT_SHORTS.map((item) => (
            <YTShortCard key={item.id} item={item} />
          ))}
        </ScrollView>

        {/* ── Note about embedding ── */}
        <View style={styles.noteCard}>
          <MaterialCommunityIcons name="information-outline" size={16} color={COLORS.goldLight} />
          <Text style={styles.noteText}>
            Videos open in the YouTube app for the best experience.
            The playlist above plays directly in-app.
          </Text>
        </View>

        {/* ── Subscribe CTA ── */}
        <View style={styles.ctaCard}>
          <FontAwesome name="youtube-play" size={40} color={COLORS.ytRed} style={{ marginBottom: 12 }} />
          <Text style={styles.ctaHeading}>Never Miss a Pravachan</Text>
          <Text style={styles.ctaDesc}>
            Subscribe to {YT_HANDLE} on YouTube and hit the bell icon
            to receive notifications for every live aarti, satsang,
            and Gita discourse by Maharaj Ji.
          </Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={openChannel} activeOpacity={0.85}>
            <FontAwesome name="youtube-play" size={15} color="#fff" />
            <Text style={styles.ctaBtnText}>Subscribe Now — It's Free</Text>
          </TouchableOpacity>
          <View style={styles.ctaBellRow}>
            <MaterialCommunityIcons name="bell-ring-outline" size={13} color={COLORS.goldLight} />
            <Text style={styles.ctaBellText}>Tap the 🔔 bell to get notified</Text>
          </View>
          <Text style={styles.ctaNote}>🕉️  Jai Shri Krishna • GIEO Gita</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.cream },
  scroll: { flex: 1 },
  pulseDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.ytRed },

  sectionHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 20, marginTop: 22, marginBottom: 12,
  },
  sectionHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,0,0,0.1)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,0,0,0.2)',
  },
  sectionIcon:   { fontSize: 18 },
  sectionTitle:  { color: COLORS.richBrown, fontSize: 15, fontWeight: '800' },
  sectionAccent: { color: COLORS.ytRed, fontSize: 10, fontWeight: '700', marginTop: 1 },
  sectionActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.3)', backgroundColor: 'rgba(255,0,0,0.08)',
    paddingHorizontal: 10, paddingVertical: 5,
  },
  sectionActionText: { color: COLORS.ytRed, fontSize: 10, fontWeight: '700' },

  hero: {
    backgroundColor: COLORS.richBrown, margin: 20, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)',
  },
  heroBadge: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,0,0,0.15)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(255,0,0,0.3)', marginBottom: 14,
  },
  heroBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  heroHeading:   { color: COLORS.cream, fontSize: 22, fontWeight: '800', lineHeight: 30, marginBottom: 10 },
  heroAccent:    { color: COLORS.goldLight },
  heroDesc:      { color: 'rgba(253,246,227,0.65)', fontSize: 12, lineHeight: 18, fontStyle: 'italic', marginBottom: 16 },
  heroStats: {
    flexDirection: 'row', backgroundColor: 'rgba(201,162,39,0.1)',
    borderRadius: 12, paddingVertical: 12, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },
  heroStat:       { flex: 1, alignItems: 'center' },
  heroStatBorder: { borderRightWidth: 1, borderRightColor: 'rgba(201,162,39,0.25)' },
  heroStatVal:    { color: COLORS.goldLight, fontSize: 15, fontWeight: '800' },
  heroStatLabel:  { color: 'rgba(253,246,227,0.5)', fontSize: 9, marginTop: 2, fontStyle: 'italic' },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.ytRed, borderRadius: 10, paddingVertical: 13,
  },
  heroBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },

  embedCard: {
    backgroundColor: COLORS.richBrown, marginHorizontal: 20, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)', overflow: 'hidden',
  },
  embedCardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,0,0,0.15)',
  },
  embedLivePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,0,0,0.15)', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(255,0,0,0.35)',
  },
  embedLivePillText: { color: COLORS.ytRed, fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  embedCardTitle:    { flex: 1, color: COLORS.cream, fontSize: 12, fontWeight: '700' },
  embedCardFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9,
    borderTopWidth: 1, borderTopColor: 'rgba(201,162,39,0.12)',
  },
  embedCardFooterText: { color: 'rgba(253,246,227,0.4)', fontSize: 10, fontStyle: 'italic' },

  videosList: { marginHorizontal: 20, gap: 12 },
  videoCard: {
    backgroundColor: COLORS.richBrown, borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  videoThumbWrap: { width: '100%', height: 196, position: 'relative' },
  videoThumbImg:  { width: '100%', height: '100%' },
  videoThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  videoPlayBtn: {
    position: 'absolute', alignSelf: 'center', top: '35%',
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,0,0,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  videoDurationBadge: {
    position: 'absolute', bottom: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3,
  },
  videoDurationText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  videoYTBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6, padding: 5,
  },
  videoMeta: { padding: 12 },
  videoTitle: { color: COLORS.cream, fontSize: 13, fontWeight: '700', marginBottom: 7, lineHeight: 18 },
  videoMetaRow:     { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  videoViews:       { color: 'rgba(253,246,227,0.5)', fontSize: 10 },
  videoDot:         { color: 'rgba(253,246,227,0.3)', fontSize: 12 },
  videoDurationMeta:{ color: COLORS.goldLight, fontSize: 10, fontWeight: '600' },
  videoOpenRow:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  videoOpenText:    { color: 'rgba(253,246,227,0.3)', fontSize: 9, fontStyle: 'italic' },

  shortsRow: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
  shortCard: {
    width: 148, backgroundColor: COLORS.richBrown, borderRadius: 14,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  shortThumbWrap: { width: 148, height: 263, position: 'relative' },
  shortThumbImg:  { width: '100%', height: '100%' },
  shortThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  shortPlayBtn: {
    position: 'absolute', alignSelf: 'center', top: '40%',
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,0,0,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  shortDurationBadge: {
    position: 'absolute', bottom: 7, right: 7,
    backgroundColor: 'rgba(0,0,0,0.82)',
    borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
  },
  shortDurationText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  shortTagBadge: {
    position: 'absolute', top: 7, left: 7,
    backgroundColor: 'rgba(255,0,0,0.8)',
    borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
  },
  shortTagText:  { color: '#fff', fontSize: 8, fontWeight: '800' },
  shortTitle:    { color: COLORS.cream, fontSize: 10, fontWeight: '600', padding: 8, lineHeight: 14 },

  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: COLORS.richBrown, marginHorizontal: 20, marginTop: 16,
    borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  noteText: { flex: 1, color: 'rgba(253,246,227,0.55)', fontSize: 10, fontStyle: 'italic', lineHeight: 15 },

  ctaCard: {
    backgroundColor: COLORS.richBrown, margin: 20, borderRadius: 18, padding: 20,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,0,0,0.25)',
  },
  ctaHeading: { color: COLORS.cream, fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  ctaDesc: {
    color: 'rgba(253,246,227,0.6)', fontSize: 11, fontStyle: 'italic',
    textAlign: 'center', lineHeight: 17, marginBottom: 18,
  },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.ytRed, borderRadius: 10,
    paddingVertical: 14, width: '100%', justifyContent: 'center', marginBottom: 12,
  },
  ctaBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  ctaBellRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14,
    backgroundColor: 'rgba(201,162,39,0.1)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  ctaBellText: { color: COLORS.goldLight, fontSize: 11, fontWeight: '600' },
  ctaNote:     { color: 'rgba(253,246,227,0.35)', fontSize: 10, fontStyle: 'italic' },
});