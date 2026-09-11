import TransformInNineSteps from '@/components/dhyanShivir/TransformInNineSteps';
import ReelCard from '@/components/home/ReelCard.jsx';
import { useHeaderScrollProps } from '@/context/HeaderScrollContext';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { COLORS } from '../../../components/home/constant';
import EventsSection from '../../../components/home/Eventsection';
import ExclusiveContent from '../../../components/home/Exclusivecontent';
import GallerySection from '../../../components/home/GallerySection';
import HeroBanner from '../../../components/home/Herobanner';
import LiveDarshan from '../../../components/home/Livedarshan';
import MaharajSection from '../../../components/home/MaharajSection';
import ServicesSection from '../../../components/home/ServicesSection';
import SevaSection from '../../../components/home/Sevasection';
import { GoldDivider } from '../../../components/home/Sharedui';
import TestimonialsSection from '../../../components/home/TestimonialsSection';
import Questionseva from '../../../components/questionseva/QuestionSevaForm.jsx';

export default function GieoGitaHome() {
  const headerScrollProps = useHeaderScrollProps();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces
        {...headerScrollProps}>
        <HeroBanner />

       
        <GoldDivider />

        <ExclusiveContent />
        <GoldDivider />

        <EventsSection />

        <GoldDivider />

        <ServicesSection />
        <GoldDivider />
       <MaharajSection />
       

        <GoldDivider />

        {/* <AdhyaySection /> */}
        <SevaSection />
            <GoldDivider />
        <Questionseva />

    

        
        <GoldDivider />

        <LiveDarshan />

        <TransformInNineSteps />

        <GoldDivider />

        <TestimonialsSection />
         <GoldDivider />

        <GallerySection />

        <GoldDivider />

        {/* <InitiativesSection /> */}
        <ReelCard />

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.cream
  }
});
