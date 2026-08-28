// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
export const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  richBrown: '#3D2010',
  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',
  cream: '#FDF6E3',
  creamDark: '#F5E6C8',
  saffron: '#E8721C',
  saffronLight: '#F4A44A',
  textDark: '#1A0E00',
  white: '#FFFFFF',
  liveRed: '#E53935',
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const heroImages = [
  { id: '1', source: require('../../assets/images/ab.png') },
  { id: '2', source: require('../../assets/images/ab.png') },
  { id: '3', source: require('../../assets/images/ab.png') },
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
