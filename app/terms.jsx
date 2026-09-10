// app/terms.jsx
//
// Real Terms & Conditions text, matching what's published at
// https://gieogita.org/terms-conditions — linked from the Profile page's
// Legal section.

import LegalPageLayout from '@/components/legal/LegalPageLayout';

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing, browsing, registering, donating, or participating in any activity on GIEO GITA or Parivaar or using the GIEO Gita App, you confirm that you have read, understood, and agreed to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please refrain from using our platforms.',
  },
  {
    title: 'About GIEO GITA, Parivaar & the App',
    body: "GIEO GITA is a spiritual, educational, and cultural organization dedicated to the study, practice, and dissemination of the teachings of the Bhagavad Gita. Parivaar is a community platform created to foster connection, participation, and engagement among devotees, volunteers, and members. The GIEO Gita App is a mobile application designed to provide easy access to GIEO GITA's resources, events, and community features.",
  },
  {
    title: 'User Eligibility & Responsibilities',
    body: 'Users must provide accurate and complete information when registering, donating, or participating. You agree to use the platforms respectfully, lawfully, and in alignment with the spiritual and cultural values of GIEO GITA.',
  },
  {
    title: 'Intellectual Property Rights',
    body: 'All content available on GIEO GITA platforms, including spiritual discourses, texts, images, videos, logos, designs, and Parivaar materials, is the intellectual property of GIEO GITA unless stated otherwise. Content is provided strictly for personal, non-commercial, and spiritual learning. Unauthorized reproduction, distribution, or commercial use is prohibited.',
  },
  {
    title: 'Donations & Payments',
    body: 'All donations are voluntary and support spiritual, educational, cultural, and charitable initiatives.',
    list: [
      'Donations are generally non-refundable.',
      'In case of accidental or erroneous transactions, requests must be made within 48 hours by emailing info@gieogita.org or gieogita@gmail.com.',
      'Donations eligible under Section 80G of the Income Tax Act (India) require accurate donor details.',
    ],
  },
  {
    title: 'Privacy & Data Protection',
    body: 'Personal information is collected and processed in accordance with our Privacy Policy. This may include contact details, date of birth, anniversary, donation records, and Parivaar participation data.',
  },
  {
    title: 'Communications & Consent',
    body: 'By providing your contact details, you consent to receive communications from GIEO GITA and Parivaar related to:',
    list: [
      'Donations, receipts, and acknowledgements',
      'Events, programs, and community initiatives',
      'Spiritual updates and announcements',
      'Birthday and anniversary greetings via WhatsApp, SMS, email, or other messaging platforms',
    ],
  },
  {
    title: 'Events, Programs & Participation',
    body: 'Participation in physical or online events is subject to availability and compliance with organizational guidelines. GIEO GITA reserves the right to modify, reschedule, or cancel events without prior notice.',
  },
  {
    title: 'Limitation of Liability',
    body: 'All services and content are provided in good faith for spiritual and informational purposes. GIEO GITA shall not be liable for any direct, indirect, incidental, or consequential damages arising from use of the platforms or participation in programs.',
  },
  {
    title: 'Governing Law & Jurisdiction',
    body: 'These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts located in Kurukshetra, Haryana.',
  },
  {
    title: 'Updates to These Terms',
    body: 'GIEO GITA reserves the right to update or modify these Terms & Conditions at any time. Continued use of the platforms constitutes acceptance of the revised terms.',
  },
];

export default function TermsScreen() {
  return (
    <LegalPageLayout
      icon="reader-outline"
      title="Terms & Conditions"
      tagline="The terms that govern your use of GIEO Gita"
      intro="Welcome to GIEO GITA (Global Inspiration & Enlightenment Organization of Bhagavad Gita). These Terms & Conditions govern your access to and use of www.gieogita.org, our community platform Parivaar (parivaar.gieogita.org), the GIEO Gita App, and all related services, events, donations, and communications."
      sections={SECTIONS}
    />
  );
}
