import Spacer from '@/components/ui/Spacer';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
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
      <KeyboardAvoidingView
        style={styles.scroll}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
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

          <Spacer height={120} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* <BookingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        specialty={selectedSpecialty}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.cream,
  },
  scroll: {
    flex: 1,
  },
});
