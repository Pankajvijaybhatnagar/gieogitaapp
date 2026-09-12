// app/home/BalSanskar.jsx
import Spacer from '@/components/ui/Spacer';
import { ScrollView } from 'react-native';
import BalSanskarSection from '../../components/home/BalSanskarSection';

export default function BalSanskarScreen() {
  return (
    <ScrollView>
      <BalSanskarSection />
      <Spacer height={120} />
    </ScrollView>
  );
}
