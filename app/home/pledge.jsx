import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import BirthdayBanner from '../../components/pledge/BirthdayBanner';
import ContactFooter from '../../components/pledge/ContactFooter';
import HeroSection from '../../components/pledge/HeroSection';
import HowItWorks from '../../components/pledge/HowItWorks';
import PaymentModal from '../../components/pledge/PaymentModal';
import SevaList from '../../components/pledge/SevaList';
import SevaCard from '../../components/pledge/SevaCard';
import TrustSection from '../../components/pledge/TrustSection';

import { GoldDivider } from '../../components/pledge/SharedUI';
import { C } from '../../components/pledge/constants';

export default function MyPledge() {
  const [selectedSeva, setSelectedSeva] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDonate = (seva) => {
    setSelectedSeva(seva);
    setModalVisible(true);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />

        <HowItWorks />

        <GoldDivider />

        <SevaList onDonate={handleDonate} />

        <GoldDivider />

        <BirthdayBanner onDonate={handleDonate} />

        <GoldDivider />

        <SevaCard />

        <TrustSection />

        <ContactFooter />

        <View style={{ height: 30 }} />
      </ScrollView>

      <PaymentModal
        visible={modalVisible}
        seva={selectedSeva}
        onClose={() => setModalVisible(false)}
      />
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