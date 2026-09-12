// app/home/JoinGieoGita.jsx
import Spacer from '@/components/ui/Spacer';
import { ScrollView } from 'react-native';
import JoinGieoGitaSection from '../../components/home/JoinGieoGitaSection';

export default function JoinGieoGitaScreen() {
  return (
    <ScrollView>
      <JoinGieoGitaSection />
      <Spacer height={120} />
    </ScrollView>
  );
}
