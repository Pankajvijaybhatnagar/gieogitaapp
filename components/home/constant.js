// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
export { COLORS } from '@/constants/brandColors';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const heroImages = [
  {
    id: '3',
    source: require('@/assets/images/hero3.png'),
    tag: 'DIVINE DARSHAN',
    title: 'A Temple of Devotion & Grace',
  },
  {
    id: '1',
    source: require('@/assets/images/hero1.png'),
    tag: 'SACRED TEXT',
    title: 'Live With Gita, Live According to Gita',
  },
  {
    id: '2',
    source: require('@/assets/images/hero2.png'),
    tag: 'GITA SATSANG',
    title: 'Thousands Gathered in Devotion',
  },
];

// ─── GALLERY ──────────────────────────────────────────────────────────────────
// Real photos already live on gieogita.org — used as the gallery's content
// until the backend's admin-managed gallery folder actually has photos in it
// (galleryServices.getPublicGallery() currently returns an empty list for
// every folder tried; this is the real, live fallback in the meantime).
export const galleryPhotos = [
  { id: 'g1', uri: 'https://gieogita.org/assets/images/project/project-4-1.jpg', caption: '' },
  { id: 'g2', uri: 'https://gieogita.org/assets/images/project/project-4-2.jpg', caption: '' },
  { id: 'g3', uri: 'https://gieogita.org/assets/images/project/project-4-3.jpg', caption: '' },
  { id: 'g4', uri: 'https://gieogita.org/assets/images/project/project-4-31.jpg', caption: '' },
  { id: 'g5', uri: 'https://gieogita.org/assets/images/project/project-4-4.jpg', caption: '' },
  { id: 'g6', uri: 'https://gieogita.org/assets/images/project/project-4-5.jpg', caption: '' },
  { id: 'g7', uri: 'https://gieogita.org/assets/images/project/project-4-6.jpg', caption: '' },
  { id: 'g8', uri: 'https://gieogita.org/assets/images/services/bal%20sanskar.jpg', caption: 'Bal Sanskar' },
  { id: 'g9', uri: 'https://gieogita.org/assets/images/services/dhyanam.jpg', caption: 'Dhyanam' },
  { id: 'g10', uri: 'https://gieogita.org/assets/images/services/aanpurna%20copy.jpg', caption: 'Annapurna Seva' },
  { id: 'g11', uri: 'https://gieogita.org/assets/images/services/join.jpg', caption: 'Join GIEO Gita' },
  { id: 'g12', uri: 'https://gieogita.org/assets/images/services/gieo-gurukul%20copy.jpg', caption: 'GIEO Gurukul' },
  { id: 'g13', uri: 'https://gieogita.org/assets/images/resources/seminar%20copy.jpg', caption: '' },
  { id: 'g14', uri: 'https://gieogita.org/assets/images/resources/seminar%20kuk%20copy.jpg', caption: '' },
  { id: 'g15', uri: 'https://gieogita.org/assets/images/resources/spritual%20copy.jpg', caption: '' },
];

export const exclusiveContent = [
  {
    id: '1',
    icon: '🕉️',
    title: 'Gita Prerna',
    meta: 'Gita Essence',
    badge: '',
  },
  {
    id: '2',
    icon: '📿',
    title: 'Ashtadash Shaloki Gita',
    meta: 'Bhagavad Gita Wisdom',
    badge: null,
  },
  {
    id: '3',
    icon: '🪔',
    title: 'Purushottam Paas',
    meta: 'Gita Chapter 15',
    badge: null,
  },
  {
    id: '4',
    icon: '📖',
    title: 'Sapta Shloki Gita',
    meta: 'Art of Karma Yoga',
    badge: null,
  },
  {
    id: '5',
    icon: '📖',
    title: 'Ek Minute Ek Saath Gita Path',
    meta: 'Art of Karma Yoga',
    badge: null,
  },
];

export const adhyayList = [
  { id: '1', num: 'ADHYAY 1', name: 'Arjuna Vishada Yoga', icon: '🌸' },
  { id: '2', num: 'ADHYAY 2', name: 'Sankhya Yoga', icon: '✨' },
  { id: '3', num: 'ADHYAY 3', name: 'Karma Yoga', icon: '🌿' },
  { id: '4', num: 'ADHYAY 4', name: 'Jnana Karma Sanyasa Yoga', icon: '🪷' },
  { id: '5', num: 'ADHYAY 5', name: 'Karma Sanyasa Yoga', icon: '🌺' },
  { id: '6', num: 'ADHYAY 6', name: 'Dhyana Yoga', icon: '🧘' },
  { id: '7', num: 'ADHYAY 7', name: 'Jnana Vijnana Yoga', icon: '📿' },
  { id: '8', num: 'ADHYAY 8', name: 'Akshara Brahma Yoga', icon: '🕉️' },
  { id: '9', num: 'ADHYAY 9', name: 'Raja Vidya Raja Guhya Yoga', icon: '👑' },
  { id: '10', num: 'ADHYAY 10', name: 'Vibhuti Yoga', icon: '☀️' },
  { id: '11', num: 'ADHYAY 11', name: 'Vishwarupa Darshana Yoga', icon: '🌌' },
  { id: '12', num: 'ADHYAY 12', name: 'Bhakti Yoga', icon: '🙏' },
  {
    id: '13',
    num: 'ADHYAY 13',
    name: 'Kshetra Kshetrajna Vibhaga Yoga',
    icon: '🌾',
  },
  { id: '14', num: 'ADHYAY 14', name: 'Gunatraya Vibhaga Yoga', icon: '🔱' },
  { id: '15', num: 'ADHYAY 15', name: 'Purushottama Yoga', icon: '🌳' },
  {
    id: '16',
    num: 'ADHYAY 16',
    name: 'Daivasura Sampad Vibhaga Yoga',
    icon: '⚖️',
  },
  {
    id: '17',
    num: 'ADHYAY 17',
    name: 'Shraddhatraya Vibhaga Yoga',
    icon: '🪔',
  },
  { id: '18', num: 'ADHYAY 18', name: 'Moksha Sanyasa Yoga', icon: '🕊️' },
];

export const upcomingEvents = [
  {
    id: '1',
    day: '08',
    month: 'APR',
    title: 'Gita Satsang — Kurukshetra',
    location: 'Kurukshetra, Haryana',
    time: 'Full Day Program',
    tag: 'SATSANG',
  },
  {
    id: '2',
    day: '13',
    month: 'APR',
    title: 'Gita Satsang — Haridwar',
    location: 'Haridwar, Uttarakhand',
    time: '13 April 2026',
    tag: 'DIVINE EVENT',
  },
  {
    id: '3',
    day: '17',
    month: 'APR',
    title: 'Gita Satsang — Panipat',
    location: 'Devi Mandir, Panipat',
    time: '17–19 April 2026',
    tag: 'SATSANG',
  },
];

export const sevaList = [
  {
    name: 'Shringaar Seva',
    icon: '🌸',
    route: '/home/seva',
    desc: 'Adornment & decoration offerings',
  },
  {
    name: 'Aarti Seva',
    icon: '🪔',
    route: '/home/seva',
    desc: 'Sacred lamp ceremony seva',
  },
  {
    name: 'Anna Seva',
    icon: '🍽️',
    route: '/home/seva',
    desc: 'Food offering & distribution',
  },
  {
    name: 'Gaushala Seva',
    icon: '🐄',
    route: '/home/seva',
    desc: 'Sacred cow shelter seva',
  },
  {
    name: 'Vidya Seva',
    icon: '📚',
    route: '/home/seva',
    desc: 'Education & knowledge service',
  },
  {
    name: 'Jal Seva',
    icon: '💧',
    route: '/home/seva',
    desc: 'Sacred water offering seva',
  },
  {
    name: 'Gau-Poojan Seva',
    icon: '🙏',
    route: '/home/seva',
    desc: 'Cow worship & puja ceremony',
  },
  {
    name: 'Gau-Grass Seva',
    icon: '🌿',
    route: '/home/seva',
    desc: 'Feeding grass to sacred cows',
  },
  {
    name: 'Chikitsa Seva',
    icon: '💊',
    route: '/home/seva',
    desc: 'Medical & health care service',
  },
];

export const aboutInitiatives = [
  {
    icon: '📚',
    title: 'Bal Sanskar',
    desc: 'Vedic teachings for children',
    route: 'home/balSanskar',
  },
  {
    icon: '🐄',
    title: 'GIEO Gaushala',
    desc: 'Cow seva & protection',
    route: 'home/GieoGaushala',
  },
  {
    icon: '🌏',
    title: 'Join GIEO Gita',
    desc: 'Spread Gita wisdom globally',
    route: 'home/JoinGieoGita',
  },
];

// ─── SERVICES ─────────────────────────────────────────────────────────────────
// The app's five core services, surfaced as a horizontally scrolling row
// of photo cards on the home page. Titles, descriptions and photos are the
// real ones published on gieogita.org's own "Our Services" section; `icon`
// is an Ionicons name used as a fallback badge where there's no photo yet.
export const servicesList = [
  {
    icon: 'medkit-outline',
    title: 'Health Seva',
    desc: 'Free medical camps & care with Medanta doctors',
    route: '/home/health',
    image: null,
  },
  {
    icon: 'paw-outline',
    title: 'GIEO Gaushala',
    desc: 'Promoting cow protection and seva for preserving indigenous cow breeds',
    route: '/home/GieoGaushala',
    image: 'https://gieogita.org/assets/images/services/services-4-3.jpg',
  },
  {
    icon: 'school-outline',
    title: 'GIEO Gurukul',
    desc: 'Blending ancient Gurukul values with modern learning for holistic education',
    route: '/home/gurukul',
    image: 'https://gieogita.org/assets/images/services/gieo-gurukul%20copy.jpg',
  },
  {
    icon: 'book-outline',
    title: 'Bal Sanskar',
    desc: 'Instilling spiritual values in children through Vedic teachings and cultural education',
    route: '/home/balSanskar',
    image: 'https://gieogita.org/assets/images/services/bal%20sanskar.jpg',
  },
  {
    icon: 'earth-outline',
    title: 'Join GIEO Gita',
    desc: 'Be a part of our mission to spread the wisdom of the Bhagwad Gita in the globe',
    route: '/home/JoinGieoGita',
    image: 'https://gieogita.org/assets/images/services/join.jpg',
  },
];
