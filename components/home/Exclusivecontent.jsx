import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '@/components/ui/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { radii, spacing, type } from '@/constants/theme';
import { COLORS, exclusiveContent } from './constant';
import { SectionHeader } from './Sharedui';

function ExclusiveCard({ item }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/home/(tabs)/exclusive/${item.id}`)}>
      <Card radius={radii.lg} style={styles.excCard}>
        <ImageBackground source={require('@/assets/images/krishna-bg.jpg')} resizeMode="cover" style={styles.excCardImg}>
          <LinearGradient colors={['rgba(41,24,36,0.08)', 'rgba(41,24,36,0.65)']} style={StyleSheet.absoluteFillObject} />
          <View style={styles.iconMedallion}><Text style={styles.excCardIcon}>{item.icon}</Text></View>
          {/* <Text style={styles.excCardIcon}>{item.icon}</Text> */}
          {item.badge && (
            <View style={styles.excBadge}>
              <Text style={styles.excBadgeText}>{item.badge}</Text>
            </View>
          )}
        </ImageBackground>
        <View style={styles.excCardBody}>
          <Text style={styles.excCardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.excCardMeta}>{item.meta}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function ExclusiveContent() {
  const router = useRouter();

  return (
    <>
      <SectionHeader
        title="✦ Exclusive"
        accent="Content"
        onSeeAll={() => router.push('/home/exclusive-all')}
      />
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.md
  },
  excCard: {
    width: 210
  },
  excCardImg: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  excCardIcon: {
    fontSize: 36,
    zIndex: 1
  },
  excBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: COLORS.saffron,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 2
  },
  excBadgeText: {
    color: COLORS.white,
    ...type.caption,
    fontSize: 10
  },
  excCardBody: {
    padding: spacing.md
  },
  excCardTitle: {
    color: COLORS.deepBrown,
    ...type.headline,
    fontSize: 15,
    lineHeight: 20
  },
  excCardMeta: {
    color: COLORS.warmBrown,
    ...type.footnote,
    marginTop: 4,
    opacity: 0.75
  }
});
