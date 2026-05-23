import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import AdhyaySection from '../../../components/home/Adhyaysection';
import EventsSection from '../../../components/home/Eventsection';
import ExclusiveContent from '../../../components/home/Exclusivecontent';
import HeroBanner from '../../../components/home/Herobanner';
import InitiativesSection from '../../../components/home/Initiativessection';
import LiveDarshan from '../../../components/home/Livedarshan';
import SevaSection from '../../../components/home/Sevasection';
import { GoldDivider } from '../../../components/home/Sharedui';
import { COLORS } from '../../../components/home/constant';

export default function GieoGitaHome() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.deepBrown} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces>

        <HeroBanner />

        <ExclusiveContent />

        <GoldDivider />

        <LiveDarshan />

        <GoldDivider />

        <AdhyaySection />

        <GoldDivider />

        <EventsSection />

        <GoldDivider />

        <SevaSection />

        <GoldDivider />

        <InitiativesSection />

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
});