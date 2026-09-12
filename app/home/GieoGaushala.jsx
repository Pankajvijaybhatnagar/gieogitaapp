// app/home/GieoGaushala.jsx
import Spacer from '@/components/ui/Spacer';
import { ScrollView } from 'react-native';
import GieoGaushalaSection from '../../components/home/GieoGaushalaSection';

export default function GieoGaushalaScreen() {
  return (
    <ScrollView>
      <GieoGaushalaSection />
      <Spacer height={120} />
    </ScrollView>
  );
}
