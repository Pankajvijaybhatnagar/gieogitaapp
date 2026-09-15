import GitaText from '@/components/common/GitaText';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Spacer from '@/components/ui/Spacer';
import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, shadow, type } from '@/constants/theme';

const { width } = Dimensions.get('window');

// ── Data ──────────────────────────────────────────────────────────────────────

const GITA_PRERNA_ISSUES = [
  {
    id: 'gp1',
    month: 'December 2024',
    issue: 'Issue 48',
    theme: 'Karma Yoga & Selfless Action',
    pages: 32,
    icon: 'Gita',
    new: true,
  },
  {
    id: 'gp2',
    month: 'November 2024',
    issue: 'Issue 47',
    theme: 'Bhakti — The Path of Devotion',
    pages: 28,
    icon: '🪔',
    new: false,
  },
  {
    id: 'gp3',
    month: 'October 2024',
    issue: 'Issue 46',
    theme: 'Jnana Yoga — Wisdom of the Soul',
    pages: 30,
    icon: '📿',
    new: false,
  },
  {
    id: 'gp4',
    month: 'September 2024',
    issue: 'Issue 45',
    theme: 'Dharma — Our Sacred Duty',
    pages: 28,
    icon: '🌸',
    new: false,
  },
  {
    id: 'gp5',
    month: 'August 2024',
    issue: 'Issue 44',
    theme: 'Surrender to the Divine',
    pages: 32,
    icon: '🙏',
    new: false,
  },
  {
    id: 'gp6',
    month: 'July 2024',
    issue: 'Issue 43',
    theme: 'Meditation & Inner Peace',
    pages: 26,
    icon: '🧘',
    new: false,
  },
];

const MASIK_PATRIKA_ISSUES = [
  {
    id: 'mp1',
    month: 'December 2024',
    vol: 'Vol. 12',
    highlight: 'Gita Jayanti Special Edition',
    pages: 48,
    icon: '🏮',
    new: true,
  },
  {
    id: 'mp2',
    month: 'November 2024',
    vol: 'Vol. 11',
    highlight: 'Navratri & Devotional Songs',
    pages: 40,
    icon: '🎵',
    new: false,
  },
  {
    id: 'mp3',
    month: 'October 2024',
    vol: 'Vol. 10',
    highlight: 'Cow Sanctuary Feature Report',
    pages: 44,
    icon: '🐄',
    new: false,
  },
  {
    id: 'mp4',
    month: 'September 2024',
    vol: 'Vol. 9',
    highlight: 'Guru Shishya Parampara',
    pages: 36,
    icon: '📖',
    new: false,
  },
];

const SPIRITUAL_READS = [
  {
    id: 'sr1',
    title: 'Bhagwad Gita — As It Is',
    author: 'A.C. Bhaktivedanta Swami',
    category: 'Scripture',
    icon: '📜',
    pages: 800,
  },
  {
    id: 'sr2',
    title: 'Gita Rahasya',
    author: 'Bal Gangadhar Tilak',
    category: 'Commentary',
    icon: '🔑',
    pages: 600,
  },
  {
    id: 'sr3',
    title: 'The Gospel of Selfless Action',
    author: 'Mahadev Desai',
    category: 'Philosophy',
    icon: '🌿',
    pages: 380,
  },
  {
    id: 'sr4',
    title: 'Swami Vivekananda on Gita',
    author: 'Swami Vivekananda',
    category: 'Discourse',
    icon: '🦁',
    pages: 250,
  },
  {
    id: 'sr5',
    title: 'Yoga of the Gita',
    author: 'Chinmayananda',
    category: 'Yoga',
    icon: '🧘',
    pages: 300,
  },
  {
    id: 'sr6',
    title: 'Essence of Bhagwad Gita',
    author: 'Eknath Easwaran',
    category: 'Essence',
    icon: '✨',
    pages: 240,
  },
];

const DAILY_SHLOKAS = [
  {
    id: 'ds1',
    chapter: 2,
    verse: 47,
    shloka: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
    meaning:
      'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
  },
  {
    id: 'ds2',
    chapter: 4,
    verse: 7,
    shloka: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।',
    meaning:
      'Whenever there is a decline in righteousness and an increase in unrighteousness, I manifest myself.',
  },
  {
    id: 'ds3',
    chapter: 9,
    verse: 22,
    shloka: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।',
    meaning:
      'For those who worship Me with devotion, meditating on My form, I provide what they lack and preserve what they have.',
  },
  {
    id: 'ds4',
    chapter: 18,
    verse: 66,
    shloka: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।',
    meaning:
      'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.',
  },
];

const CATEGORIES = [
  'All',
  'Gita Prerna',
  'Masik Patrika',
  'Daily Shloka',
  'Spiritual Books',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionHead({ icon, title, accent, onAction, actionLabel }) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionHeadLeft}>
        <View style={styles.sectionIconBox}>
          <Text style={styles.sectionIcon}>{icon}</Text>
        </View>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionAccent}>{accent}</Text>
        </View>
      </View>
      {onAction && (
        <TouchableOpacity
          style={styles.sectionActionBtn}
          onPress={onAction}
          activeOpacity={0.8}>
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={13}
            color={COLORS.saffron}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Gita Prerna Card ─────────────────────────────────────────────────────────
function GitaPrernаCard({ item, onRead }) {
  return (
    <TouchableOpacity
      style={styles.magazineCard}
      activeOpacity={0.85}
      onPress={() => onRead(item)}>
      {item.new && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}
      <Text style={styles.magazineIcon}>{item.icon}</Text>
      <View style={styles.magazineIssueBadge}>
        <Text style={styles.magazineIssueText}>{item.issue}</Text>
      </View>
      <Text style={styles.magazineMonth}>{item.month}</Text>
      <Text style={styles.magazineTheme} numberOfLines={2}>
        {item.theme}
      </Text>
      <View style={styles.magazineFooter}>
        <MaterialCommunityIcons
          name="book-open-page-variant"
          size={10}
          color={COLORS.goldDark}
        />
        <Text style={styles.magazinePages}>{item.pages} pages</Text>
      </View>
      <View style={styles.readBtn}>
        <FontAwesome name="book" size={10} color={COLORS.white} />
        <Text style={styles.readBtnText}>Read</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Masik Patrika Card ────────────────────────────────────────────────────────
function MasikPatrikaCard({ item, onRead }) {
  return (
    <TouchableOpacity
      style={styles.patrikaCard}
      activeOpacity={0.85}
      onPress={() => onRead(item)}>
      <View style={styles.patrikaThumb}>
        {item.new && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        <Text style={styles.patrikaIcon}>{item.icon}</Text>
        <Text style={styles.patrikaVol}>{item.vol}</Text>
      </View>
      <View style={styles.patrikaInfo}>
        <Text style={styles.patrikaMonth}>{item.month}</Text>
        <Text style={styles.patrikaHighlight} numberOfLines={2}>
          {item.highlight}
        </Text>
        <View style={styles.patrikaMetaRow}>
          <MaterialCommunityIcons
            name="book-open"
            size={10}
            color={COLORS.goldDark}
          />
          <Text style={styles.patrikaMeta}>{item.pages} pages</Text>
        </View>
        <View style={styles.patrikaActions}>
          <TouchableOpacity
            style={styles.patrikaReadBtn}
            onPress={() => onRead(item)}
            activeOpacity={0.85}>
            <FontAwesome name="book" size={10} color={COLORS.white} />
            <Text style={styles.patrikaReadBtnText}>Read</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.patrikaDownloadBtn}
            activeOpacity={0.85}>
            <MaterialCommunityIcons
              name="download-outline"
              size={13}
              color={COLORS.warmBrown}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Daily Shloka Card ─────────────────────────────────────────────────────────
function ShlokaCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={styles.shlokaCard}
      activeOpacity={0.85}
      onPress={() => setExpanded(!expanded)}>
      <View style={styles.shlokaTopRow}>
        <View style={styles.shlokaChapterBadge}>
          <Text style={styles.shlokaChapterText}>
            Ch. {item.chapter} · V. {item.verse}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={COLORS.goldDark}
        />
      </View>
      <Text style={styles.shlokaSanskrit}>{item.shloka}</Text>
      {expanded && (
        <View style={styles.shlokaExpanded}>
          <View style={styles.shlokaDivider} />
          <Text style={styles.shlokaMeaning}>{item.meaning}</Text>
          <TouchableOpacity style={styles.shlokaShareBtn} activeOpacity={0.8}>
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={13}
              color={COLORS.warmBrown}
            />
            <Text style={styles.shlokaShareText}>Share Shloka</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Spiritual Book Card ───────────────────────────────────────────────────────
function BookCard({ item }) {
  return (
    <View style={styles.bookCard}>
      <View style={styles.bookIconBox}>
        <Text style={styles.bookIcon}>{item.icon}</Text>
      </View>
      <View style={styles.bookInfo}>
        <View style={styles.bookCategoryBadge}>
          <Text style={styles.bookCategoryText}>{item.category}</Text>
        </View>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <View style={styles.bookMetaRow}>
          <MaterialCommunityIcons
            name="book-open"
            size={10}
            color={COLORS.goldDark}
          />
          <Text style={styles.bookPages}>{item.pages} pages</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookReadBtn} activeOpacity={0.85}>
        <MaterialCommunityIcons
          name="book-open-variant"
          size={14}
          color={COLORS.saffron}
        />
      </TouchableOpacity>
    </View>
  );
}

// ── Read Modal ────────────────────────────────────────────────────────────────
function ReadModal({ item, type: readType, onClose }) {
  if (!item) return null;
  const title = readType === 'prerna' ? item.theme : item.highlight;
  const subtitle = readType === 'prerna' ? item.issue : item.vol;
  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {title}
              </Text>
              <Text style={styles.modalSub}>
                {subtitle} · {item.month}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <MaterialCommunityIcons
                name="close"
                size={18}
                color={COLORS.goldDark}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.modalInfoCard}>
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={40}
                color={COLORS.saffron}
              />
              <Text style={styles.modalInfoTitle}>
                {readType === 'prerna'
                  ? 'Gita Prerna Magazine'
                  : 'Masik Patrika'}
              </Text>
              <Text style={styles.modalInfoDesc}>
                {item.pages} pages of divine wisdom, shlokas, discourses, and
                spiritual guidance by Swami Giananand Ji Maharaj.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalReadBtn}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                Linking.openURL('https://www.gieogita.org');
              }}>
              <FontAwesome name="book" size={14} color={COLORS.white} />
              <Text style={styles.modalReadBtnText}>
                Read Online on Website
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalDownloadBtn}
              activeOpacity={0.85}>
              <MaterialCommunityIcons
                name="download-outline"
                size={15}
                color={COLORS.warmBrown}
              />
              <Text style={styles.modalDownloadBtnText}>Download PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalShareBtn} activeOpacity={0.85}>
              <MaterialCommunityIcons
                name="share-variant-outline"
                size={14}
                color={COLORS.warmBrown}
              />
              <Text style={styles.modalShareBtnText}>Share with a Devotee</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── MAIN SCREEN ───────────────────────────────────────────────────────────────
export default function ReadingScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [activeShloka, setActiveShloka] = useState(0);

  const openRead = (item, readType) => {
    setModalItem(item);
    setModalType(readType);
  };

  const showAll = cat => setActiveCategory(cat);

  const showGitaPrerana =
    activeCategory === 'All' || activeCategory === 'Gita Prerna';
  const showMasik =
    activeCategory === 'All' || activeCategory === 'Masik Patrika';
  const showShlokas =
    activeCategory === 'All' || activeCategory === 'Daily Shloka';
  const showBooks =
    activeCategory === 'All' || activeCategory === 'Spiritual Books';

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons
              name="book-open-variant"
              size={12}
              color={COLORS.saffron}
            />
            <Text style={styles.heroBadgeText}>Reading & Publications</Text>
          </View>
          <Text style={styles.heroHeading}>
            Nourish Your <Text style={styles.heroAccent}>Spiritual Mind</Text>
          </Text>
          <Text style={styles.heroDesc}>
            Explore Gita Prerna magazine, Masik Patrika, daily shlokas, and
            curated spiritual books — all in one place.
          </Text>
          <View style={styles.heroStats}>
            {[
              { val: '48+', label: 'Gita Prerna Issues' },
              { val: '12+', label: 'Masik Patrika Vols' },
              { val: '700+', label: 'Shlokas' },
              { val: '50+', label: 'Books' },
            ].map((s, i) => (
              <View
                key={s.label}
                style={[styles.heroStat, i < 3 && styles.heroStatBorder]}>
                <Text style={styles.heroStatVal}>{s.val}</Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Category Filter ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.chipText,
                  activeCategory === cat && styles.chipTextActive,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Today's Shloka Feature ── */}
        {showShlokas && (
          <View style={styles.featuredShlokaCard}>
            <View style={styles.featuredShlokaHeader}>
              <View style={styles.featuredShlokaBadge}>
                <Text style={styles.featuredShlokaBadgeText}>
                  🌅 Today&apos;s Shloka
                </Text>
              </View>
              <Text style={styles.featuredShlokaRef}>
                Gita Ch. {DAILY_SHLOKAS[activeShloka].chapter} · V.{' '}
                {DAILY_SHLOKAS[activeShloka].verse}
              </Text>
            </View>
            <Text style={styles.featuredShlokaSanskrit}>
              {DAILY_SHLOKAS[activeShloka].shloka}
            </Text>
            <Text style={styles.featuredShlokaMeaning}>
              {DAILY_SHLOKAS[activeShloka].meaning}
            </Text>
            <View style={styles.featuredShlokaFooter}>
              <View style={styles.shlokaDots}>
                {DAILY_SHLOKAS.map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => setActiveShloka(i)}>
                    <View
                      style={[
                        styles.shlokaDot,
                        activeShloka === i && styles.shlokaDotActive,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.featuredShlokaActions}>
                <TouchableOpacity
                  style={styles.shlokaNavBtn}
                  onPress={() =>
                    setActiveShloka(
                      (activeShloka - 1 + DAILY_SHLOKAS.length) %
                        DAILY_SHLOKAS.length,
                    )
                  }>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={18}
                    color={COLORS.saffron}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.shlokaNavBtn}
                  onPress={() =>
                    setActiveShloka((activeShloka + 1) % DAILY_SHLOKAS.length)
                  }>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={18}
                    color={COLORS.saffron}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shlokaShareFab}>
                  <MaterialCommunityIcons
                    name="share-variant-outline"
                    size={14}
                    color={COLORS.white}
                  />
                  <Text style={styles.shlokaShareFabText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── Gita Prerna Magazine ── */}
        {showGitaPrerana && (
          <>
            <SectionHead
              icon="📰"
              title="Gita Prerna"
              accent="Monthly Spiritual Magazine"
              onAction={() => showAll('Gita Prerna')}
              actionLabel="All Issues"
            />
            <View style={styles.gitaPrernаDesc}>
              <Text style={styles.gitaPrernаDescText}>
                A monthly magazine by GIEO Gita featuring Maharaj Ji&apos;s
                discourses, devotional poetry, Vedic wisdom, and spiritual
                guidance for seekers.
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}>
              {GITA_PRERNA_ISSUES.map(item => (
                <GitaPrernаCard
                  key={item.id}
                  item={item}
                  onRead={i => openRead(i, 'prerna')}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* ── Masik Patrika ── */}
        {showMasik && (
          <>
            <SectionHead
              icon="📋"
              title="Masik Patrika"
              accent="Monthly Newsletter"
              onAction={() => showAll('Masik Patrika')}
              actionLabel="All Issues"
            />
            <View style={styles.gitaPrernаDesc}>
              <Text style={styles.gitaPrernаDescText}>
                The monthly newsletter of GIEO Gita covering events, seva
                activities, Gaushala news, Bal Sanskar updates, and community
                announcements.
              </Text>
            </View>
            <View style={styles.patrikaList}>
              {MASIK_PATRIKA_ISSUES.map(item => (
                <MasikPatrikaCard
                  key={item.id}
                  item={item}
                  onRead={i => openRead(i, 'patrika')}
                />
              ))}
            </View>
          </>
        )}

        {/* ── Daily Shlokas ── */}
        {showShlokas && (
          <>
            <SectionHead
              icon="Gita"
              title="Sacred Shlokas"
              accent="Bhagwad Gita Verses"
              onAction={() => showAll('Daily Shloka')}
              actionLabel="All Shlokas"
            />
            <View style={styles.shlokasList}>
              {DAILY_SHLOKAS.map(item => (
                <ShlokaCard key={item.id} item={item} />
              ))}
            </View>
          </>
        )}

        {/* ── Spiritual Books ── */}
        {showBooks && (
          <>
            <SectionHead
              icon="📚"
              title="Spiritual Books"
              accent="Curated Reading List"
              onAction={() => showAll('Spiritual Books')}
              actionLabel="View All"
            />
            <View style={styles.booksList}>
              {SPIRITUAL_READS.map(item => (
                <BookCard key={item.id} item={item} />
              ))}
            </View>
          </>
        )}

        {/* ── Subscribe CTA ── */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaEmoji}>📬</Text>
          <Text style={styles.ctaHeading}>
            Get Gita Prerna at Your Doorstep
          </Text>
          <Text style={styles.ctaDesc}>
            Subscribe to receive the monthly Gita Prerna magazine and Masik
            Patrika delivered to your home. Print edition available across
            India.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.85}
            onPress={() => Linking.openURL('https://www.gieogita.org')}>
            <MaterialCommunityIcons
              name="newspaper-variant-outline"
              size={15}
              color={COLORS.white}
            />
            <Text style={styles.ctaBtnText}>Subscribe to Magazine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} activeOpacity={0.85}>
            <MaterialCommunityIcons
              name="download-outline"
              size={14}
              color={COLORS.saffron}
            />
            <Text style={styles.ctaSecondaryText}>
              Download Free Digital Copy
            </Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>
            <GitaText /> Jai Shri Krishna • GIEO Gita
          </Text>
        </View>

        <Spacer height={120} />
      </ScrollView>

      {/* ── Read Modal ── */}
      {modalItem && (
        <ReadModal
          item={modalItem}
          type={modalType}
          onClose={() => {
            setModalItem(null);
            setModalType(null);
          }}
        />
      )}
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scroll: {
    flex: 1,
  },
  /* Section header */
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
  },
  sectionHeadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: hairline,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    color: COLORS.deepBrown,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionAccent: {
    color: COLORS.warmBrown,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  sectionActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: hairline,
  },
  sectionActionText: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '700',
  },
  /* Hero */
  hero: {
    backgroundColor: COLORS.cream,
    margin: 20,
    borderRadius: radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: hairline,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: COLORS.saffron,
    fontSize: 10,
    fontWeight: '700',
  },
  heroHeading: {
    ...type.title,
    color: COLORS.deepBrown,
    marginBottom: 10,
  },
  heroAccent: {
    color: COLORS.saffron,
  },
  heroDesc: {
    ...type.body,
    color: COLORS.warmBrown,
    marginBottom: 16,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: hairline,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatBorder: {
    borderRightWidth: 1,
    borderRightColor: hairline,
  },
  heroStatVal: {
    color: COLORS.saffron,
    fontSize: 14,
    fontWeight: '600',
  },
  heroStatLabel: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  /* Categories */
  categoriesRow: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 4,
    paddingBottom: 4,
    marginTop: 8,
  },
  chip: {
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: hairline,
  },
  chipActive: {
    backgroundColor: COLORS.saffron,
    borderColor: COLORS.saffron,
  },
  chipText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  /* Featured Shloka */
  featuredShlokaCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  featuredShlokaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  featuredShlokaBadge: {
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: hairline,
  },
  featuredShlokaBadgeText: {
    color: COLORS.saffron,
    fontSize: 10,
    fontWeight: '700',
  },
  featuredShlokaRef: {
    color: COLORS.warmBrown,
    fontSize: 12,
  },
  featuredShlokaSanskrit: {
    color: COLORS.richBrown,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  featuredShlokaMeaning: {
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 14,
  },
  featuredShlokaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shlokaDots: {
    flexDirection: 'row',
    gap: 6,
  },
  shlokaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: hairline,
  },
  shlokaDotActive: {
    width: 16,
    backgroundColor: COLORS.saffron,
  },
  featuredShlokaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shlokaNavBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: hairline,
  },
  shlokaShareFab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.saffron,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  shlokaShareFabText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  /* Gita Prerna desc */
  gitaPrernаDesc: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.sm,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.saffron,
  },
  gitaPrernаDescText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
  },
  /* Magazine card */
  hScroll: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
  },
  magazineCard: {
    width: 150,
    borderRadius: 24,
    padding: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: hairline,
    position: 'relative',
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.saffron,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  magazineIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  magazineIssueBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.creamDark,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 6,
  },
  magazineIssueText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    fontWeight: '700',
  },
  magazineMonth: {
    color: COLORS.richBrown,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  magazineTheme: {
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  magazineFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  magazinePages: {
    color: COLORS.warmBrown,
    fontSize: 10,
  },
  readBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: COLORS.richBrown,
    borderRadius: radii.sm,
    paddingVertical: 7,
  },
  readBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  /* Masik Patrika */
  patrikaList: {
    marginHorizontal: 20,
    gap: 10,
  },
  patrikaCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: hairline,
    overflow: 'hidden',
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  patrikaThumb: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    position: 'relative',
    backgroundColor: COLORS.creamDark,
  },
  patrikaIcon: {
    fontSize: 30,
    marginBottom: 6,
  },
  patrikaVol: {
    color: COLORS.warmBrown,
    fontSize: 12,
    fontWeight: '600',
  },
  patrikaInfo: {
    flex: 1,
    padding: 12,
  },
  patrikaMonth: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
  },
  patrikaHighlight: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 6,
  },
  patrikaMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  patrikaMeta: {
    color: COLORS.warmBrown,
    fontSize: 12,
  },
  patrikaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patrikaReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.richBrown,
    borderRadius: radii.sm,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  patrikaReadBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  patrikaDownloadBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: hairline,
  },
  /* Shlokas list */
  shlokasList: {
    marginHorizontal: 20,
    gap: 10,
  },
  shlokaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  shlokaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  shlokaChapterBadge: {
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  shlokaChapterText: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '700',
  },
  shlokaSanskrit: {
    color: COLORS.richBrown,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
  },
  shlokaExpanded: {},
  shlokaDivider: {
    height: 1,
    backgroundColor: hairline,
    marginVertical: 10,
  },
  shlokaMeaning: {
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  shlokaShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-end',
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: hairline,
  },
  shlokaShareText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    fontWeight: '600',
  },
  /* Books */
  booksList: {
    marginHorizontal: 20,
    gap: 10,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  bookIconBox: {
    width: 50,
    height: 50,
    borderRadius: radii.md,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: hairline,
  },
  bookIcon: {
    fontSize: 24,
  },
  bookInfo: {
    flex: 1,
  },
  bookCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.creamDark,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 4,
  },
  bookCategoryText: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '700',
  },
  bookTitle: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
    lineHeight: 18,
  },
  bookAuthor: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginBottom: 4,
  },
  bookMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookPages: {
    color: COLORS.warmBrown,
    fontSize: 10,
  },
  bookReadBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: hairline,
  },
  /* CTA */
  ctaCard: {
    backgroundColor: COLORS.white,
    margin: 20,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  ctaEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  ctaHeading: {
    color: COLORS.deepBrown,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaDesc: {
    color: COLORS.warmBrown,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.saffron,
    borderRadius: radii.md,
    paddingVertical: 13,
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  ctaBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  ctaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 14,
  },
  ctaSecondaryText: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  ctaNote: {
    color: COLORS.warmBrown,
    fontSize: 12,
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: `rgba(${RGB.deepBrown},0.55)`,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: hairline,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: hairline,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  modalIcon: {
    fontSize: 30,
  },
  modalTitle: {
    color: COLORS.deepBrown,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 3,
  },
  modalSub: {
    color: COLORS.warmBrown,
    fontSize: 12,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: hairline,
  },
  modalBody: {
    gap: 10,
  },
  modalInfoCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: hairline,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  modalInfoTitle: {
    color: COLORS.deepBrown,
    fontSize: 14,
    fontWeight: '600',
  },
  modalInfoDesc: {
    color: COLORS.warmBrown,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.richBrown,
    borderRadius: radii.md,
    paddingVertical: 14,
  },
  modalReadBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  modalDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: hairline,
  },
  modalDownloadBtnText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    fontWeight: '700',
  },
  modalShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  modalShareBtnText: {
    color: COLORS.warmBrown,
    fontSize: 12,
  },
});
