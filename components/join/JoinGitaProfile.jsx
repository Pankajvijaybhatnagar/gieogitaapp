import { useRouter } from 'expo-router';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Spacer from '@/components/ui/Spacer';
import { COLORS } from '@/constants/brandColors';
import { spacing, type } from '@/constants/theme';
import AshtaDashShalokiGita from './AshtaDashShalokiGita';
import LatestMasikParwas from './LatestMasikParwas';
import ProfileHero from './ProfileHero';
import ProfileInfoCard from './ProfileInfoCard';
import RastSuchna from './RastSuchna';

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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={COLORS.saffron}
            colors={[COLORS.saffron]}
          />
        }>
        <ProfileHero profile={profile} onUpdated={onRefresh} />

        <ProfileInfoCard profile={profile} onUpdated={onRefresh} />

        <RastSuchna />

        <AshtaDashShalokiGita />

        <LatestMasikParwas />

        <View style={styles.footer}>
          <Text style={styles.footerText}>GIEO GITA</Text>

          <Text style={styles.footerSubtext}>
            Transforming lives through the wisdom of Gita
          </Text>
        </View>
        <Spacer height={120} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.creamDark,
  },
  content: {
    paddingBottom: 40,
  },
  footer: {
    alignItems: 'center',
    marginHorizontal: spacing.md + 2,
    marginTop: spacing.sm + 2,
    paddingTop: spacing.lg + 4,
    paddingBottom: spacing.sm + 2,
  },
  footerText: {
    marginTop: spacing.xs,
    ...type.subhead,
    fontSize: 14,
    color: COLORS.deepBrown,
    letterSpacing: 2,
  },
  footerSubtext: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default JoinGitaProfile;
