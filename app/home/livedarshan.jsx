// app/home/BalSanskar.jsx
import Spacer from '@/components/ui/Spacer';
import LiveDarshan from '../../components/home/Livedarshaan';

import { ScrollView } from 'react-native';

export default function BalSanskarScreen() {
  return (
    <ScrollView>
      <LiveDarshan />
      <Spacer height={120} />
    </ScrollView>
  );
}
