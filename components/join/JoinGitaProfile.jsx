import { useRouter } from 'expo-router';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

import AshtaDashShalokiGita from './AshtaDashShalokiGita';
import LatestMasikParwas from './LatestMasikParwas';
import ProfileHero from './ProfileHero';
import ProfileInfoCard from './ProfileInfoCard';
import RastSuchna from './RastSuchna';

const COLORS = {
  background: '#F7EFE5',
  primary: '#6E3F1F',
  dark: '#3D2417',
  cream: '#FFF9F2',
};

const JoinGitaProfile = ({ profile, onRefresh }) => {
  const router = useRouter();

  console.log('COMPONENT CHECK:', {
    ProfileHero: typeof ProfileHero,
    ProfileInfoCard: typeof ProfileInfoCard,
    RastSuchna: typeof RastSuchna,
    AshtaDashShalokiGita: typeof AshtaDashShalokiGita,
    LatestMasikParwas: typeof LatestMasikParwas,
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }>
        <ProfileHero profile={profile} onUpdated={onRefresh} />

        <ProfileInfoCard profile={profile} onUpdated={onRefresh} />

        <RastSuchna />

        <AshtaDashShalokiGita />

        <LatestMasikParwas />

        <View style={styles.footer}>
          <Text style={styles.footerSymbol}>ॐ</Text>

          <Text style={styles.footerText}>GIEO GITA</Text>

          <Text style={styles.footerSubtext}>
            Transforming lives through the wisdom of Gita
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  header: {
    minHeight: 68,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerButtonPlaceholder: {
    width: 42,
  },

  headerContent: {
    flex: 1,
    alignItems: 'center',
  },

  headerSmall: {
    color: '#EAD8C5',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },

  headerTitle: {
    marginTop: 2,
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },

  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingBottom: 40,
  },

  footer: {
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 10,
    paddingTop: 28,
    paddingBottom: 10,
  },

  footerSymbol: {
    fontSize: 28,
    color: '#9B6A3E',
  },

  footerText: {
    marginTop: 4,
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },

  footerSubtext: {
    color: '#977C68',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default JoinGitaProfile;
