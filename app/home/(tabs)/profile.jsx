import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import AvatarSection from '../../../components/profile/AvatarSection';
import EditUserDetails from '../../../components/profile/EditUserDetails';
import FooterVerse from '../../../components/profile/FooterVerse';
import InfoCard from '../../../components/profile/InfoCard';
import { C } from '../../../components/profile/constants';

export default function ProfileScreen() {
  const user = useSelector(state => state.auth.user);
  const router = useRouter();

  return (
    <Animated.View entering={FadeIn} style={styles.root}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces>
        {/* ── HERO ── */}
        <View style={styles.hero}>
          {/* Decorative blobs */}
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />
          <View style={styles.heroArc} />
          <Text style={styles.heroOm}>ॐ</Text>

          {/* Top bar */}
          <View style={styles.topBar}>
            <Link href="../" asChild>
              <TouchableOpacity style={styles.backBtn} activeOpacity={0.8}>
                <FontAwesome
                  name="chevron-left"
                  size={14}
                  color={C.goldLight}
                />
              </TouchableOpacity>
            </Link>
            <View style={styles.topBarTitle}>
              <Text style={styles.topBarTitleText}>MY PROFILE</Text>
              <Link href={'/profile'}>new profile</Link>
            </View>
            <View style={{ width: 38 }} />
          </View>

          {/* Avatar + name + stats */}
          <AvatarSection user={user} />
        </View>

        {/* ── INFO CARD ── */}
        <InfoCard user={user} />

        {/* ── EDIT FORM ── */}
        <EditUserDetails />

        {/* ── SHLOKA FOOTER ── */}
        <FooterVerse />

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating close button */}
      <Pressable onPress={() => router.back()} style={styles.closeBtn}>
        <FontAwesome name="times" size={15} color={C.goldLight} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream },
  scroll: { flex: 1 },

  hero: {
    backgroundColor: C.deepBrown,
    paddingBottom: 30,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBlob1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(201,162,39,0.06)',
    top: -100,
    right: -80,
  },
  heroBlob2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(74,44,13,0.2)',
    bottom: -60,
    left: -50,
  },
  heroArc: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.06)',
    top: -100,
    left: -80,
  },
  heroOm: {
    position: 'absolute',
    right: 24,
    top: 60,
    fontSize: 90,
    color: 'rgba(201,162,39,0.05)',
    lineHeight: 100,
  },

  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 20,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1,
    borderColor: C.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: { alignItems: 'center' },
  topBarTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: C.goldLight,
    letterSpacing: 3,
  },

  closeBtn: {
    position: 'absolute',
    top: 54,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(201,162,39,0.14)',
    borderWidth: 1,
    borderColor: C.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
});
