// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
export const C = {
  deepBrown:    '#2C1A0A',
  warmBrown:    '#4A2C0D',
  richBrown:    '#3D2010',
  gold:         '#C9A227',
  goldLight:    '#E8C55A',
  goldDark:     '#8B6914',
  goldPale:     'rgba(201,162,39,0.12)',
  goldBorder:   'rgba(201,162,39,0.30)',
  cream:        '#FDF6E3',
  creamDark:    '#F5E6C8',
  saffron:      '#E8721C',
  saffronLight: '#F4A44A',
  white:        '#FFFFFF',
  green:        '#27AE60',
  greenLight:   '#2ECC71',
};

// ─── UPI CONFIG ───────────────────────────────────────────────────────────────
export const UPI_ID   = 'gieogita@upi';   // ← replace with real UPI ID
export const UPI_NAME = 'GIEO GITA Trust';

// ─── SEVA DATA ────────────────────────────────────────────────────────────────
export const SEVA_LIST = [
  {
    id: '1',
    name: 'Shringaar Seva',
    icon: '👑',
    amount: 501,
    desc: 'Offer divine adornments — flowers, jewels & silken garments to Shri Krishna. This seva beautifies the Lord and brings blessings of beauty, grace and prosperity to the devotee.',
    benefit: 'Beauty & Grace',
    category: 'Krishna Seva',
  },
  {
    id: '2',
    name: 'Aarti Seva',
    icon: '🪔',
    amount: 251,
    desc: 'Sponsor the daily Aarti at Gita Gyan Sansthanam, Kurukshetra. Five-lamp Aarti performed at sunrise and sunset in your name, spreading divine light and removing darkness.',
    benefit: 'Divine Light',
    category: 'Mandir Seva',
  },
  {
    id: '3',
    name: 'Anna Seva',
    icon: '🍛',
    amount: 1001,
    desc: 'Feed the hungry and the pilgrims visiting the temple. Food is offered as Prasad of the Lord. Anna Seva is said to be the highest seva — feeding one soul feeds the universe.',
    benefit: 'Health & Nourishment',
    category: 'Charity',
  },
  {
    id: '4',
    name: 'Gaushala Seva',
    icon: '🐄',
    amount: 501,
    desc: 'Care for sacred cows at GIEO Gaushala. Gau Seva (cow service) is among the most blessed acts in Sanatan Dharma — the cow is considered the earthly form of Kamadhenu.',
    benefit: 'Ancestral Blessings',
    category: 'Gau Seva',
  },
  {
    id: '5',
    name: 'Gau-Poojan Seva',
    icon: '🌸',
    amount: 351,
    desc: 'Sponsor a special Gau Poojan — ritual worship of the sacred cow with flowers, turmeric and ghee diyas. Performed on your behalf on auspicious dates and birthdays.',
    benefit: 'Prosperity & Peace',
    category: 'Gau Seva',
  },
  {
    id: '6',
    name: 'Gau-Grass Seva',
    icon: '🌿',
    amount: 101,
    desc: 'Provide fresh, nutritious grass and fodder for the cows at GIEO Gaushala for an entire day. Even the smallest offering to a cow earns immeasurable divine merit.',
    benefit: 'Daily Merit',
    category: 'Gau Seva',
  },
  {
    id: '7',
    name: 'Gau-Chikitsa Seva',
    icon: '💊',
    amount: 751,
    desc: 'Fund veterinary care and medicine for injured or ailing cows. Healing a sacred cow is equivalent to performing thousands of yagnas according to the scriptures.',
    benefit: 'Good Health',
    category: 'Gau Seva',
  },
  {
    id: '8',
    name: 'Krishna Rajbhog Seva',
    icon: '🍱',
    amount: 1001,
    desc: 'Offer a grand midday Rajbhog (royal feast) to Shri Krishna including 56 types of dishes. Your name is announced during the offering. Ideal for birthdays and anniversaries.',
    benefit: 'Abundance',
    category: 'Krishna Seva',
  },
  {
    id: '9',
    name: 'Krishna Phool Bangla Seva',
    icon: '🌺',
    amount: 2101,
    desc: "Sponsor a magnificent floral decoration (Phool Bangla) for Krishna — the deity's sanctum is beautifully adorned with fresh flowers in your honour on the requested date.",
    benefit: 'Joy & Celebration',
    category: 'Krishna Seva',
  },
  {
    id: '10',
    name: 'Krishna Bhog Seva',
    icon: '🥣',
    amount: 501,
    desc: 'Offer a special Bhog (sacred food) to Shri Krishna. Prepared with love and devotion in the temple kitchen and offered with Vedic mantras before being distributed as Prasad.',
    benefit: 'Fulfilment of Wishes',
    category: 'Krishna Seva',
  },
  {
    id: '11',
    name: 'Vidya Seva',
    icon: '📚',
    amount: 1001,
    desc: 'Support the education of underprivileged children through Bal Sanskar programs. Fund books, uniforms and Vedic education. Vidya (knowledge) is the greatest gift you can give.',
    benefit: 'Wisdom & Education',
    category: 'Charity',
  },
  {
    id: '12',
    name: 'Chikitsa Seva',
    icon: '🏥',
    amount: 501,
    desc: 'Provide free medical assistance and medicines to the poor, pilgrims, and needy devotees who visit GIEO Gita. Seva performed in the name of your loved ones.',
    benefit: 'Health & Healing',
    category: 'Charity',
  },
  {
    id: '13',
    name: 'Jal Seva',
    icon: '💧',
    amount: 201,
    desc: 'Sponsor pure drinking water and refreshments for pilgrims and visitors at GIEO Gita events. Offering water is considered equivalent to performing Teertha Yatra.',
    benefit: 'Purity & Peace',
    category: 'Charity',
  },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export const CATEGORIES = ['All', 'Krishna Seva', 'Gau Seva', 'Mandir Seva', 'Charity'];

// ─── OCCASIONS ────────────────────────────────────────────────────────────────
export const OCCASIONS = [
  { label: 'Birthday',         icon: '🎂' },
  { label: 'Anniversary',      icon: '💍' },
  { label: 'In Memory Of',     icon: '🙏' },
  { label: 'Festival',         icon: '🪔' },
  { label: 'General Donation', icon: '💛' },
];

// ─── HOW IT WORKS STEPS ───────────────────────────────────────────────────────
export const HOW_STEPS = [
  { num: '01', icon: '🙏', title: 'Choose Seva',    desc: 'Pick any seva from the list below'               },
  { num: '02', icon: '📝', title: 'Your Occasion',  desc: 'Birthday, anniversary, in memory of a loved one' },
  { num: '03', icon: '💸', title: 'Donate via UPI', desc: 'Pay instantly with Google Pay, BHIM, PhonePe'    },
  { num: '04', icon: '🪷', title: 'Seva Performed', desc: 'Ritual done at temple in your name on that date' },
];

// ─── TRUST ITEMS ──────────────────────────────────────────────────────────────
export const TRUST_ITEMS = [
  { icon: '🛡️', title: '100% Transparent', desc: 'All donations go directly to temple seva'       },
  { icon: '📜', title: 'Tax Exemption',     desc: '80G certificate available on request'          },
  { icon: '🏛️', title: 'Registered Trust',  desc: 'GIEO Gita is a registered charitable trust'   },
  { icon: '🤝', title: 'Seva Receipt',      desc: 'Digital seva confirmation sent to your number' },
];

// ─── BIRTHDAY POINTS ──────────────────────────────────────────────────────────
export const BIRTHDAY_POINTS = [
  '🪷 Ritual performed by trained temple priests',
  '📸 Photo/video update shared with you',
  '📿 Your name announced in the prayer',
  '🎁 Prasad dispatched on request',
];