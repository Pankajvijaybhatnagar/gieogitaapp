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

const { width } = Dimensions.get('window');

const COLORS = {
  deepBrown:   '#2C1A0A',
  warmBrown:   '#4A2C0D',
  richBrown:   '#3D2010',
  gold:        '#C9A227',
  goldLight:   '#E8C55A',
  goldDark:    '#8B6914',
  cream:       '#FDF6E3',
  saffron:     '#E8721C',
  saffronLight:'#F4A44A',
};

// ── Data ──────────────────────────────────────────────────────────────────────

const GITA_PRERNA_ISSUES = [
  { id: 'gp1', month: 'December 2024', issue: 'Issue 48', theme: 'Karma Yoga & Selfless Action', pages: 32, icon: '🕉️', color: 'rgba(232,114,28,0.2)', new: true  },
  { id: 'gp2', month: 'November 2024', issue: 'Issue 47', theme: 'Bhakti — The Path of Devotion', pages: 28, icon: '🪔', color: 'rgba(201,162,39,0.2)', new: false },
  { id: 'gp3', month: 'October 2024',  issue: 'Issue 46', theme: 'Jnana Yoga — Wisdom of the Soul', pages: 30, icon: '📿', color: 'rgba(201,162,39,0.15)', new: false },
  { id: 'gp4', month: 'September 2024',issue: 'Issue 45', theme: 'Dharma — Our Sacred Duty',       pages: 28, icon: '🌸', color: 'rgba(201,162,39,0.1)',  new: false },
  { id: 'gp5', month: 'August 2024',   issue: 'Issue 44', theme: 'Surrender to the Divine',         pages: 32, icon: '🙏', color: 'rgba(201,162,39,0.1)',  new: false },
  { id: 'gp6', month: 'July 2024',     issue: 'Issue 43', theme: 'Meditation & Inner Peace',         pages: 26, icon: '🧘', color: 'rgba(201,162,39,0.08)', new: false },
];

const MASIK_PATRIKA_ISSUES = [
  { id: 'mp1', month: 'December 2024', vol: 'Vol. 12', highlight: 'Gita Jayanti Special Edition', pages: 48, icon: '🏮', color: 'rgba(232,114,28,0.2)', new: true  },
  { id: 'mp2', month: 'November 2024', vol: 'Vol. 11', highlight: 'Navratri & Devotional Songs',   pages: 40, icon: '🎵', color: 'rgba(201,162,39,0.18)', new: false },
  { id: 'mp3', month: 'October 2024',  vol: 'Vol. 10', highlight: 'Cow Sanctuary Feature Report',  pages: 44, icon: '🐄', color: 'rgba(201,162,39,0.15)', new: false },
  { id: 'mp4', month: 'September 2024',vol: 'Vol. 9',  highlight: 'Guru Shishya Parampara',        pages: 36, icon: '📖', color: 'rgba(201,162,39,0.1)',  new: false },
];

const SPIRITUAL_READS = [
  { id: 'sr1', title: 'Bhagwad Gita — As It Is', author: 'A.C. Bhaktivedanta Swami',  category: 'Scripture',    icon: '📜', pages: 800  },
  { id: 'sr2', title: 'Gita Rahasya',             author: 'Bal Gangadhar Tilak',        category: 'Commentary',   icon: '🔑', pages: 600  },
  { id: 'sr3', title: 'The Gospel of Selfless Action', author: 'Mahadev Desai',        category: 'Philosophy',   icon: '🌿', pages: 380  },
  { id: 'sr4', title: 'Swami Vivekananda on Gita',     author: 'Swami Vivekananda',    category: 'Discourse',    icon: '🦁', pages: 250  },
  { id: 'sr5', title: 'Yoga of the Gita',              author: 'Chinmayananda',         category: 'Yoga',         icon: '🧘', pages: 300  },
  { id: 'sr6', title: 'Essence of Bhagwad Gita',       author: 'Eknath Easwaran',       category: 'Essence',      icon: '✨', pages: 240  },
];

const DAILY_SHLOKAS = [
  { id: 'ds1', chapter: 2,  verse: 47, shloka: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।', meaning: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.' },
  { id: 'ds2', chapter: 4,  verse: 7,  shloka: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।', meaning: 'Whenever there is a decline in righteousness and an increase in unrighteousness, I manifest myself.' },
  { id: 'ds3', chapter: 9,  verse: 22, shloka: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।', meaning: 'For those who worship Me with devotion, meditating on My form, I provide what they lack and preserve what they have.' },
  { id: 'ds4', chapter: 18, verse: 66, shloka: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।', meaning: 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.' },
];

const CATEGORIES = ['All', 'Gita Prerna', 'Masik Patrika', 'Daily Shloka', 'Spiritual Books'];

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
        <TouchableOpacity style={styles.sectionActionBtn} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
          <MaterialCommunityIcons name="chevron-right" size={13} color={COLORS.goldDark} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Gita Prerna Card ─────────────────────────────────────────────────────────
function GitaPrernаCard({ item, onRead }) {
  return (
    <TouchableOpacity style={[styles.magazineCard, { backgroundColor: item.color }]} activeOpacity={0.85} onPress={() => onRead(item)}>
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
      <Text style={styles.magazineTheme} numberOfLines={2}>{item.theme}</Text>
      <View style={styles.magazineFooter}>
        <MaterialCommunityIcons name="book-open-page-variant" size={10} color={COLORS.goldDark} />
        <Text style={styles.magazinePages}>{item.pages} pages</Text>
      </View>
      <View style={styles.readBtn}>
        <FontAwesome name="book" size={10} color={COLORS.deepBrown} />
        <Text style={styles.readBtnText}>Read</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Masik Patrika Card ────────────────────────────────────────────────────────
function MasikPatrikaCard({ item, onRead }) {
  return (
    <TouchableOpacity style={styles.patrikaCard} activeOpacity={0.85} onPress={() => onRead(item)}>
      <View style={[styles.patrikaThumb, { backgroundColor: item.color }]}>
        {item.new && <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>}
        <Text style={styles.patrikaIcon}>{item.icon}</Text>
        <Text style={styles.patrikaVol}>{item.vol}</Text>
      </View>
      <View style={styles.patrikaInfo}>
        <Text style={styles.patrikaMonth}>{item.month}</Text>
        <Text style={styles.patrikaHighlight} numberOfLines={2}>{item.highlight}</Text>
        <View style={styles.patrikaMetaRow}>
          <MaterialCommunityIcons name="book-open" size={10} color={COLORS.goldDark} />
          <Text style={styles.patrikaMeta}>{item.pages} pages</Text>
        </View>
        <View style={styles.patrikaActions}>
          <TouchableOpacity style={styles.patrikaReadBtn} onPress={() => onRead(item)} activeOpacity={0.85}>
            <FontAwesome name="book" size={10} color={COLORS.deepBrown} />
            <Text style={styles.patrikaReadBtnText}>Read</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.patrikaDownloadBtn} activeOpacity={0.85}>
            <MaterialCommunityIcons name="download-outline" size={13} color={COLORS.goldLight} />
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
    <TouchableOpacity style={styles.shlokaCard} activeOpacity={0.85} onPress={() => setExpanded(!expanded)}>
      <View style={styles.shlokaTopRow}>
        <View style={styles.shlokaChapterBadge}>
          <Text style={styles.shlokaChapterText}>Ch. {item.chapter} · V. {item.verse}</Text>
        </View>
        <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.goldDark} />
      </View>
      <Text style={styles.shlokaSanskrit}>{item.shloka}</Text>
      {expanded && (
        <View style={styles.shlokaExpanded}>
          <View style={styles.shlokaDivider} />
          <Text style={styles.shlokaMeaning}>{item.meaning}</Text>
          <TouchableOpacity style={styles.shlokaShareBtn} activeOpacity={0.8}>
            <MaterialCommunityIcons name="share-variant-outline" size={13} color={COLORS.goldLight} />
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
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <View style={styles.bookMetaRow}>
          <MaterialCommunityIcons name="book-open" size={10} color={COLORS.goldDark} />
          <Text style={styles.bookPages}>{item.pages} pages</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookReadBtn} activeOpacity={0.85}>
        <MaterialCommunityIcons name="book-open-variant" size={14} color={COLORS.goldLight} />
      </TouchableOpacity>
    </View>
  );
}

// ── Read Modal ────────────────────────────────────────────────────────────────
function ReadModal({ item, type, onClose }) {
  if (!item) return null;
  const title    = type === 'prerna' ? item.theme  : item.highlight;
  const subtitle = type === 'prerna' ? item.issue  : item.vol;
  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle} numberOfLines={2}>{title}</Text>
              <Text style={styles.modalSub}>{subtitle} · {item.month}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <MaterialCommunityIcons name="close" size={18} color={COLORS.goldDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.modalInfoCard}>
              <MaterialCommunityIcons name="book-open-page-variant" size={40} color={COLORS.goldLight} />
              <Text style={styles.modalInfoTitle}>
                {type === 'prerna' ? 'Gita Prerna Magazine' : 'Masik Patrika'}
              </Text>
              <Text style={styles.modalInfoDesc}>
                {item.pages} pages of divine wisdom, shlokas, discourses, and
                spiritual guidance by Swami Giananand Ji Maharaj.
              </Text>
            </View>
            <TouchableOpacity style={styles.modalReadBtn} activeOpacity={0.85}
              onPress={() => { onClose(); Linking.openURL('https://www.gieogita.org'); }}>
              <FontAwesome name="book" size={14} color={COLORS.deepBrown} />
              <Text style={styles.modalReadBtnText}>Read Online on Website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalDownloadBtn} activeOpacity={0.85}>
              <MaterialCommunityIcons name="download-outline" size={15} color={COLORS.goldLight} />
              <Text style={styles.modalDownloadBtnText}>Download PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalShareBtn} activeOpacity={0.85}>
              <MaterialCommunityIcons name="share-variant-outline" size={14} color="rgba(253,246,227,0.6)" />
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
  const [modalItem,      setModalItem]      = useState(null);
  const [modalType,      setModalType]      = useState(null);
  const [activeShloka,   setActiveShloka]   = useState(0);

  const openRead = (item, type) => {
    setModalItem(item);
    setModalType(type);
  };

  const showAll = (cat) => setActiveCategory(cat);

  const showGitaPrerana  = activeCategory === 'All' || activeCategory === 'Gita Prerna';
  const showMasik        = activeCategory === 'All' || activeCategory === 'Masik Patrika';
  const showShlokas      = activeCategory === 'All' || activeCategory === 'Daily Shloka';
  const showBooks        = activeCategory === 'All' || activeCategory === 'Spiritual Books';

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons name="book-open-variant" size={12} color={COLORS.goldLight} />
            <Text style={styles.heroBadgeText}>Reading & Publications</Text>
          </View>
          <Text style={styles.heroHeading}>
            Nourish Your{' '}
            <Text style={styles.heroAccent}>Spiritual Mind</Text>
          </Text>
          <Text style={styles.heroDesc}>
            Explore Gita Prerna magazine, Masik Patrika, daily shlokas,
            and curated spiritual books — all in one place.
          </Text>
          <View style={styles.heroStats}>
            {[
              { val: '48+',  label: 'Gita Prerna Issues' },
              { val: '12+',  label: 'Masik Patrika Vols' },
              { val: '700+', label: 'Shlokas'            },
              { val: '50+',  label: 'Books'              },
            ].map((s, i) => (
              <View key={s.label} style={[styles.heroStat, i < 3 && styles.heroStatBorder]}>
                <Text style={styles.heroStatVal}>{s.val}</Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Category Filter ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Today's Shloka Feature ── */}
        {showShlokas && (
          <View style={styles.featuredShlokaCard}>
            <View style={styles.featuredShlokaHeader}>
              <View style={styles.featuredShlokaBadge}>
                <Text style={styles.featuredShlokaBadgeText}>🌅  Today's Shloka</Text>
              </View>
              <Text style={styles.featuredShlokaRef}>
                Gita Ch. {DAILY_SHLOKAS[activeShloka].chapter} · V. {DAILY_SHLOKAS[activeShloka].verse}
              </Text>
            </View>
            <Text style={styles.featuredShlokaSanskrit}>{DAILY_SHLOKAS[activeShloka].shloka}</Text>
            <Text style={styles.featuredShlokaMeaning}>{DAILY_SHLOKAS[activeShloka].meaning}</Text>
            <View style={styles.featuredShlokaFooter}>
              <View style={styles.shlokaDots}>
                {DAILY_SHLOKAS.map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => setActiveShloka(i)}>
                    <View style={[styles.shlokaDot, activeShloka === i && styles.shlokaDotActive]} />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.featuredShlokaActions}>
                <TouchableOpacity style={styles.shlokaNavBtn}
                  onPress={() => setActiveShloka((activeShloka - 1 + DAILY_SHLOKAS.length) % DAILY_SHLOKAS.length)}>
                  <MaterialCommunityIcons name="chevron-left" size={18} color={COLORS.goldLight} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shlokaNavBtn}
                  onPress={() => setActiveShloka((activeShloka + 1) % DAILY_SHLOKAS.length)}>
                  <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.goldLight} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shlokaShareFab}>
                  <MaterialCommunityIcons name="share-variant-outline" size={14} color={COLORS.deepBrown} />
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
                A monthly magazine by GIEO Gita featuring Maharaj Ji's discourses,
                devotional poetry, Vedic wisdom, and spiritual guidance for seekers.
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {GITA_PRERNA_ISSUES.map((item) => (
                <GitaPrernаCard key={item.id} item={item} onRead={(i) => openRead(i, 'prerna')} />
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
                The monthly newsletter of GIEO Gita covering events, seva activities,
                Gaushala news, Bal Sanskar updates, and community announcements.
              </Text>
            </View>
            <View style={styles.patrikaList}>
              {MASIK_PATRIKA_ISSUES.map((item) => (
                <MasikPatrikaCard key={item.id} item={item} onRead={(i) => openRead(i, 'patrika')} />
              ))}
            </View>
          </>
        )}

        {/* ── Daily Shlokas ── */}
        {showShlokas && (
          <>
            <SectionHead
              icon="🕉️"
              title="Sacred Shlokas"
              accent="Bhagwad Gita Verses"
              onAction={() => showAll('Daily Shloka')}
              actionLabel="All Shlokas"
            />
            <View style={styles.shlokasList}>
              {DAILY_SHLOKAS.map((item) => (
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
              {SPIRITUAL_READS.map((item) => (
                <BookCard key={item.id} item={item} />
              ))}
            </View>
          </>
        )}

        {/* ── Subscribe CTA ── */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaEmoji}>📬</Text>
          <Text style={styles.ctaHeading}>Get Gita Prerna at Your Doorstep</Text>
          <Text style={styles.ctaDesc}>
            Subscribe to receive the monthly Gita Prerna magazine and Masik Patrika
            delivered to your home. Print edition available across India.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.85}
            onPress={() => Linking.openURL('https://www.gieogita.org')}
          >
            <MaterialCommunityIcons name="newspaper-variant-outline" size={15} color={COLORS.deepBrown} />
            <Text style={styles.ctaBtnText}>Subscribe to Magazine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} activeOpacity={0.85}>
            <MaterialCommunityIcons name="download-outline" size={14} color={COLORS.goldLight} />
            <Text style={styles.ctaSecondaryText}>Download Free Digital Copy</Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>🕉️  Jai Shri Krishna • GIEO Gita</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── Read Modal ── */}
      {modalItem && (
        <ReadModal
          item={modalItem}
          type={modalType}
          onClose={() => { setModalItem(null); setModalType(null); }}
        />
      )}
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.cream },
  scroll: { flex: 1 },

  /* Section header */
  sectionHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 20, marginTop: 22, marginBottom: 10,
  },
  sectionHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(201,162,39,0.12)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  sectionIcon:   { fontSize: 18 },
  sectionTitle:  { color: COLORS.richBrown, fontSize: 15, fontWeight: '800' },
  sectionAccent: { color: COLORS.goldDark, fontSize: 10, fontWeight: '600', marginTop: 1 },
  sectionActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(201,162,39,0.1)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  sectionActionText: { color: COLORS.goldDark, fontSize: 10, fontWeight: '700' },

  /* Hero */
  hero: {
    backgroundColor: COLORS.richBrown, margin: 20, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)',
  },
  heroBadge: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(201,162,39,0.15)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)', marginBottom: 12,
  },
  heroBadgeText: { color: COLORS.goldLight, fontSize: 10, fontWeight: '700' },
  heroHeading:   { color: COLORS.cream, fontSize: 22, fontWeight: '800', lineHeight: 30, marginBottom: 10 },
  heroAccent:    { color: COLORS.goldLight },
  heroDesc:      { color: 'rgba(253,246,227,0.65)', fontSize: 12, lineHeight: 18, fontStyle: 'italic', marginBottom: 16 },
  heroStats: {
    flexDirection: 'row', backgroundColor: 'rgba(201,162,39,0.1)',
    borderRadius: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },
  heroStat:       { flex: 1, alignItems: 'center' },
  heroStatBorder: { borderRightWidth: 1, borderRightColor: 'rgba(201,162,39,0.25)' },
  heroStatVal:    { color: COLORS.goldLight, fontSize: 14, fontWeight: '800' },
  heroStatLabel:  { color: 'rgba(253,246,227,0.45)', fontSize: 8, marginTop: 2, textAlign: 'center', fontStyle: 'italic' },

  /* Categories */
  categoriesRow: { paddingHorizontal: 20, gap: 8, marginBottom: 4, paddingBottom: 4, marginTop: 8 },
  chip: {
    backgroundColor: COLORS.richBrown, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  chipActive: { backgroundColor: COLORS.goldLight, borderColor: COLORS.goldDark },
  chipText:   { color: 'rgba(253,246,227,0.6)', fontSize: 11, fontWeight: '600' },
  chipTextActive: { color: COLORS.deepBrown, fontWeight: '800' },

  /* Featured Shloka */
  featuredShlokaCard: {
    backgroundColor: COLORS.richBrown, marginHorizontal: 20, marginTop: 16,
    borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.35)',
  },
  featuredShlokaHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  featuredShlokaBadge: {
    backgroundColor: 'rgba(201,162,39,0.15)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
  },
  featuredShlokaBadgeText: { color: COLORS.goldLight, fontSize: 10, fontWeight: '700' },
  featuredShlokaRef:       { color: COLORS.goldDark, fontSize: 10, fontStyle: 'italic' },
  featuredShlokaSanskrit: {
    color: COLORS.cream, fontSize: 15, fontWeight: '700',
    lineHeight: 24, marginBottom: 10, textAlign: 'center',
    fontStyle: 'italic',
  },
  featuredShlokaMeaning: {
    color: 'rgba(253,246,227,0.65)', fontSize: 11, lineHeight: 18,
    textAlign: 'center', fontStyle: 'italic', marginBottom: 14,
  },
  featuredShlokaFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shlokaDots:     { flexDirection: 'row', gap: 6 },
  shlokaDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(201,162,39,0.25)' },
  shlokaDotActive:{ width: 16, backgroundColor: COLORS.goldLight },
  featuredShlokaActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  shlokaNavBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(201,162,39,0.12)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  shlokaShareFab: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.goldLight, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  shlokaShareFabText: { color: COLORS.deepBrown, fontSize: 10, fontWeight: '800' },

  /* Gita Prerna desc */
  gitaPrernаDesc: {
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: 'rgba(201,162,39,0.06)',
    borderRadius: 10, padding: 10,
    borderLeftWidth: 3, borderLeftColor: COLORS.goldDark,
  },
  gitaPrernаDescText: { color: 'rgba(60,30,10,0.7)', fontSize: 11, lineHeight: 16, fontStyle: 'italic' },

  /* Magazine card */
  hScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
  magazineCard: {
    width: 150, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
    position: 'relative',
  },
  newBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: COLORS.saffron, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  newBadgeText: { color: '#fff', fontSize: 7, fontWeight: '800', letterSpacing: 0.5 },
  magazineIcon:  { fontSize: 30, marginBottom: 8 },
  magazineIssueBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.richBrown, borderRadius: 6,
    paddingHorizontal: 7, paddingVertical: 2, marginBottom: 6,
  },
  magazineIssueText: { color: COLORS.goldLight, fontSize: 8, fontWeight: '700' },
  magazineMonth:     { color: COLORS.richBrown, fontSize: 10, fontWeight: '700', marginBottom: 4 },
  magazineTheme:     { color: 'rgba(60,30,10,0.7)', fontSize: 10, fontStyle: 'italic', lineHeight: 14, marginBottom: 8 },
  magazineFooter:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  magazinePages:     { color: 'rgba(60,30,10,0.55)', fontSize: 9 },
  readBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    backgroundColor: COLORS.goldLight, borderRadius: 8, paddingVertical: 7,
  },
  readBtnText: { color: COLORS.deepBrown, fontSize: 10, fontWeight: '800' },

  /* Masik Patrika */
  patrikaList: { marginHorizontal: 20, gap: 10 },
  patrikaCard: {
    flexDirection: 'row', backgroundColor: COLORS.richBrown, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)', overflow: 'hidden',
  },
  patrikaThumb: {
    width: 90, alignItems: 'center', justifyContent: 'center',
    padding: 10, position: 'relative',
  },
  patrikaIcon: { fontSize: 30, marginBottom: 6 },
  patrikaVol:  { color: COLORS.richBrown, fontSize: 9, fontWeight: '800' },
  patrikaInfo: { flex: 1, padding: 12 },
  patrikaMonth: { color: COLORS.goldLight, fontSize: 10, fontWeight: '700', marginBottom: 3 },
  patrikaHighlight: { color: COLORS.cream, fontSize: 12, fontWeight: '700', lineHeight: 16, marginBottom: 6 },
  patrikaMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  patrikaMeta:    { color: 'rgba(253,246,227,0.45)', fontSize: 9 },
  patrikaActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  patrikaReadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.goldLight, borderRadius: 8,
    paddingVertical: 7, paddingHorizontal: 12,
  },
  patrikaReadBtnText: { color: COLORS.deepBrown, fontSize: 10, fontWeight: '800' },
  patrikaDownloadBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: 'rgba(201,162,39,0.12)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },

  /* Shlokas list */
  shlokasList: { marginHorizontal: 20, gap: 10 },
  shlokaCard: {
    backgroundColor: COLORS.richBrown, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  shlokaTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  shlokaChapterBadge: {
    backgroundColor: 'rgba(201,162,39,0.18)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  shlokaChapterText: { color: COLORS.goldLight, fontSize: 9, fontWeight: '700' },
  shlokaSanskrit: { color: COLORS.cream, fontSize: 13, fontWeight: '700', lineHeight: 20, fontStyle: 'italic' },
  shlokaExpanded: {},
  shlokaDivider:  { height: 1, backgroundColor: 'rgba(201,162,39,0.15)', marginVertical: 10 },
  shlokaMeaning:  { color: 'rgba(253,246,227,0.65)', fontSize: 11, lineHeight: 17, fontStyle: 'italic', marginBottom: 10 },
  shlokaShareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(201,162,39,0.12)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  shlokaShareText: { color: COLORS.goldLight, fontSize: 10, fontWeight: '600' },

  /* Books */
  booksList: { marginHorizontal: 20, gap: 10 },
  bookCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.richBrown, borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.22)',
  },
  bookIconBox: {
    width: 50, height: 50, borderRadius: 14,
    backgroundColor: 'rgba(201,162,39,0.12)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  bookIcon:  { fontSize: 24 },
  bookInfo:  { flex: 1 },
  bookCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,162,39,0.15)', borderRadius: 6,
    paddingHorizontal: 7, paddingVertical: 2, marginBottom: 4,
  },
  bookCategoryText: { color: COLORS.goldLight, fontSize: 8, fontWeight: '700' },
  bookTitle:   { color: COLORS.cream, fontSize: 12, fontWeight: '700', marginBottom: 3, lineHeight: 16 },
  bookAuthor:  { color: 'rgba(253,246,227,0.5)', fontSize: 10, fontStyle: 'italic', marginBottom: 4 },
  bookMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookPages:   { color: 'rgba(253,246,227,0.4)', fontSize: 9 },
  bookReadBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(201,162,39,0.12)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },

  /* CTA */
  ctaCard: {
    backgroundColor: COLORS.richBrown, margin: 20, borderRadius: 18, padding: 20,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)',
  },
  ctaEmoji:   { fontSize: 36, marginBottom: 10 },
  ctaHeading: { color: COLORS.cream, fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  ctaDesc: {
    color: 'rgba(253,246,227,0.6)', fontSize: 11, fontStyle: 'italic',
    textAlign: 'center', lineHeight: 17, marginBottom: 16,
  },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.goldLight, borderRadius: 10,
    paddingVertical: 13, paddingHorizontal: 24, marginBottom: 10,
  },
  ctaBtnText:       { color: COLORS.deepBrown, fontSize: 13, fontWeight: '800' },
  ctaSecondary: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, marginBottom: 14,
  },
  ctaSecondaryText: { color: COLORS.goldLight, fontSize: 12, fontWeight: '600', textDecorationLine: 'underline' },
  ctaNote:          { color: 'rgba(253,246,227,0.35)', fontSize: 10, fontStyle: 'italic' },

  /* Modal */
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.richBrown, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 36,
    borderTopWidth: 1, borderTopColor: 'rgba(201,162,39,0.4)',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(201,162,39,0.4)', alignSelf: 'center', marginBottom: 16,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  modalIcon:   { fontSize: 30 },
  modalTitle:  { color: COLORS.cream, fontSize: 15, fontWeight: '800', lineHeight: 20, marginBottom: 3 },
  modalSub:    { color: 'rgba(253,246,227,0.5)', fontSize: 10, fontStyle: 'italic' },
  modalCloseBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(201,162,39,0.12)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  modalBody: { gap: 10 },
  modalInfoCard: {
    alignItems: 'center', backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 14, padding: 18, gap: 8,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
  },
  modalInfoTitle: { color: COLORS.cream, fontSize: 14, fontWeight: '800' },
  modalInfoDesc:  { color: 'rgba(253,246,227,0.55)', fontSize: 11, fontStyle: 'italic', textAlign: 'center', lineHeight: 16 },
  modalReadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.goldLight, borderRadius: 12, paddingVertical: 14,
  },
  modalReadBtnText:     { color: COLORS.deepBrown, fontSize: 13, fontWeight: '800' },
  modalDownloadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(201,162,39,0.12)', borderRadius: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
  },
  modalDownloadBtnText: { color: COLORS.goldLight, fontSize: 12, fontWeight: '700' },
  modalShareBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 8,
  },
  modalShareBtnText: { color: 'rgba(253,246,227,0.45)', fontSize: 11, fontStyle: 'italic' },
});