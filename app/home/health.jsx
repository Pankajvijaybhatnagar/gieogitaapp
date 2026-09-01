import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AboutMedanta from '../../components/health/AboutMedanta';
import ContactSection from '../../components/health/ContactSection';
import FreeServices from '../../components/health/FreeServices';
import HeroSection from '../../components/health/HeroSection';
import HowItWorks from '../../components/health/HowItWorks';
import { GoldDivider } from '../../components/health/SharedUI';
import SpecialtyDoctorTabs from '../../components/health/SpecialtyDoctorTabs';
import { C } from '../../components/health/constants';

export default function HealthScreen() {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openBooking = spec => {
    setSelectedSpecialty(spec);
    setModalVisible(true);
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <HeroSection onBookPress={openBooking} />

        <AboutMedanta />

        <GoldDivider />

        <FreeServices />

        <GoldDivider />

        <SpecialtyDoctorTabs onBook={openBooking} />

        <GoldDivider />

        <HowItWorks />

        <GoldDivider />

        <ContactSection />

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* <BookingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        specialty={selectedSpecialty}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream },
  scroll: { flex: 1 },
});
