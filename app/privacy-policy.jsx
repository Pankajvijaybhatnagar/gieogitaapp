// app/privacy-policy.jsx
//
// Real Privacy Policy text, matching what's published at
// https://gieogita.org/privacy-policy — linked from the Profile page's
// Legal section.

import LegalPageLayout from '@/components/legal/LegalPageLayout';

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: 'We collect personal and non-personal information through various channels, including our websites, Parivaar platform, event registrations, donation forms, surveys, and community interactions.',
    list: [
      'Name, email address, phone number, and postal address',
      'Date of birth and anniversary (if voluntarily provided)',
      'Donation details and transaction references',
      'Event, volunteer, or Parivaar membership information',
      'Basic technical data such as IP address and browser type',
    ],
  },
  {
    title: 'Use of Information',
    body: 'Information collected is used strictly for:',
    list: [
      'Processing donations and issuing receipts',
      'Event registrations, community participation, and updates',
      'Internal record keeping and legal compliance',
      'Improving our services, outreach, and spiritual initiatives',
      'Sending greetings and messages on birthdays and anniversaries via WhatsApp, SMS, email, or other messaging platforms',
    ],
  },
  {
    title: 'Donations & Financial Data',
    body: 'GIEO GITA does not store your credit or debit card information. All payment transactions are processed securely through trusted third-party payment gateways. Donation data is used solely for lawful and accounting purposes, including tax compliance under Section 80G of the Income Tax Act, India.',
  },
  {
    title: 'Data Sharing',
    body: 'We do not sell, rent, or trade personal information. Data may be shared only with trusted service providers assisting in payment processing, communications, website operations, or Parivaar platform management, and only for legitimate operational purposes.',
  },
  {
    title: 'Data Security',
    body: 'We implement reasonable technical and organizational safeguards to protect personal information against unauthorized access, misuse, loss, or disclosure. Access to personal data is restricted to authorized personnel only.',
  },
  {
    title: 'Data Retention',
    body: 'Personal data is retained only as long as necessary to fulfill the purposes outlined in this policy or as required by applicable laws and regulatory obligations.',
  },
  {
    title: 'Your Rights',
    body: 'You may request access, correction, or deletion of your personal information by contacting us. Certain information may be retained if required by law or for legitimate organizational purposes.',
  },
  {
    title: 'Communications & Consent',
    body: 'By providing your contact details, you consent to receive communications related to events, donations, Parivaar activities, spiritual initiatives, and greetings such as birthday and anniversary wishes via email, SMS, WhatsApp, phone calls, or other messaging platforms. You may opt out of non-essential communications at any time.',
  },
  {
    title: 'External Links',
    body: 'Our websites may contain links to external platforms. GIEO GITA is not responsible for the privacy practices or content of third-party websites.',
  },
  {
    title: 'Policy Updates',
    body: 'This Privacy Policy may be updated periodically. Any changes will be reflected on this page with the updated date. Continued use of the website indicates acceptance of the revised policy.',
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <LegalPageLayout
      icon="document-text-outline"
      title="Privacy Policy"
      tagline="How we collect, use & protect your information"
      intro="Welcome to GIEO Gita (Global Inspiration & Enlightenment Organization of Bhagavad Gita), our community platform Parivaar (parivaar.gieogita.org) and the GIEO Gita App. We respect your privacy and are committed to safeguarding the personal information shared with us by donors, volunteers, members, and visitors."
      sections={SECTIONS}
    />
  );
}
