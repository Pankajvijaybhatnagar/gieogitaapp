import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.48, 190);
const CARD_GAP = 12;
const SIDE_PADDING = 16;

const INSTAGRAM_VIDEO_SCRIPT = `
  (function () {
    function showOnlyVideo() {
      const video = document.querySelector('video');

      if (!video) return;

      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
      document.documentElement.style.width = '100%';
      document.documentElement.style.height = '100%';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.backgroundColor = '#000';

      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.backgroundColor = '#000';

      video.style.position = 'fixed';
      video.style.top = '0';
      video.style.left = '0';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.margin = '0';
      video.style.padding = '0';
      video.style.objectFit = 'contain';
      video.style.objectPosition = 'center';
      video.style.backgroundColor = '#000';
      video.style.zIndex = '2147483647';

      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.setAttribute('controls', '');
    }

    showOnlyVideo();

    const observer = new MutationObserver(function () {
      showOnlyVideo();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    setInterval(showOnlyVideo, 1000);
  })();

  true;
`;

function getInstagramEmbedUrl(url) {
  if (!url) return '';

  const cleanUrl = url.split('?')[0].replace(/\/+$/, '');

  return `${cleanUrl}/embed/`;
}

function ReelCard({ reel }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  return (
    <View style={styles.card}>
      {loading && !failed && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#7A4828" />
        </View>
      )}

      {failed ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Reel unavailable</Text>
        </View>
      ) : (
        <WebView
          source={{
            uri: getInstagramEmbedUrl(reel.instagramUrl),
          }}
          style={styles.webView}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction
          scrollEnabled={false}
          overScrollMode="never"
          bounces={false}
          automaticallyAdjustContentInsets={false}
          injectedJavaScript={INSTAGRAM_VIDEO_SCRIPT}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setFailed(true);
          }}
          onHttpError={() => {
            setLoading(false);
            setFailed(true);
          }}
        />
      )}
    </View>
  );
}

export default function InstagramReelsSection() {
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [reels, setReels] = useState([
    {
      id: '1',
      instagramUrl: 'https://www.instagram.com/reel/DT2m-C8EpOV/',
    },
    {
      id: '2',
      instagramUrl: 'https://www.instagram.com/reel/DUDj--HCNSA/',
    },
    {
      id: '3',
      instagramUrl: 'https://www.instagram.com/reel/DI9HBttzPSe/',
    },
  ]);

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Reels</Text>

      <FlatList
        ref={listRef}
        data={reels}
        horizontal
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ReelCard reel={item} />}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        contentContainerStyle={styles.listContent}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.pagination}>
        {reels.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.paginationDot,
              activeIndex === index && styles.activePaginationDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 16,
  },

  heading: {
    marginLeft: SIDE_PADDING,
    marginBottom: 10,
    color: '#5A321D',
    fontSize: 18,
    fontWeight: '700',
  },

  listContent: {
    paddingHorizontal: SIDE_PADDING,
  },

  card: {
    width: CARD_WIDTH,
    aspectRatio: 9 / 16,
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: '#000',
  },

  webView: {
    flex: 1,
    backgroundColor: '#000',
  },

  loader: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E5D8',
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAD9CA',
  },

  errorText: {
    color: '#7A4828',
    fontSize: 12,
    fontWeight: '600',
  },

  pagination: {
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  paginationDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D8BEAA',
  },

  activePaginationDot: {
    width: 18,
    backgroundColor: '#7A4828',
  },
});
