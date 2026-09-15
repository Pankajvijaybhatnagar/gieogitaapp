// One-time, syntax-aware migration: edit style objects, never screen content or API code.
const fs = require('fs');
const Path = require('Path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const parse = s =>
  parser.parse(s, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
const expression = s => parser.parseExpression(s);
const val = (o, k) => o.properties.find(p => p.key?.name === k)?.value;
const set = (o, k, v) => {
  const existing = o.properties.find(p => p.key?.name === k);
  const value =
    typeof v === 'string' && v.startsWith('@')
      ? expression(v.slice(1))
      : t.valueToNode(v);
  if (existing) existing.value = value;
  else o.properties.push(t.objectProperty(t.identifier(k), value));
};
const del = (o, k) => {
  o.properties = o.properties.filter(p => p.key?.name !== k);
};
const C = name => '@DESIGN.colors.' + name;
const whiteCard = {
  backgroundColor: C('surface'),
  borderColor: C('border'),
  borderWidth: 1,
  borderRadius: 24,
  shadowOpacity: 0.045,
  elevation: 2,
};
const title = {
  fontFamily: '@DESIGN.fonts.editorial',
  fontWeight: '400',
  letterSpacing: -0.4,
};
const overrides = {
  'components/home/Sharedui.jsx': {
    divider: {
      height: 1,
      backgroundColor: C('border'),
      marginHorizontal: 24,
      marginVertical: 28,
    },
    sectionHeader: {
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 18,
      gap: 12,
      alignItems: 'center',
    },
    sectionTitle: { ...title, fontSize: 25, lineHeight: 33, color: C('ink') },
    sectionAccent: { color: C('plum') },
    seeAllBtn: { minHeight: 44, paddingHorizontal: 10, gap: 7 },
    seeAll: { fontSize: 12, fontWeight: '600', color: C('accent') },
  },
  'components/home/Eventsection.jsx': {
    eventCard: { ...whiteCard },
    eventCardTop: {
      backgroundColor: C('surface'),
      padding: 20,
      gap: 16,
      minHeight: 132,
    },
    eventDateBox: {
      backgroundColor: C('plumSoft'),
      borderRadius: 16,
      paddingVertical: 14,
      minWidth: 60,
    },
    eventDateDay: {
      fontSize: 28,
      lineHeight: 32,
      color: C('plum'),
      fontWeight: '500',
    },
    eventDateMonth: { color: C('plum'), fontSize: 11, letterSpacing: 1.2 },
    eventTitle: { ...title, color: C('ink'), fontSize: 20, lineHeight: 27 },
    eventLoc: { color: C('muted'), fontSize: 12, lineHeight: 18 },
    eventTime: { color: C('accent'), fontSize: 12 },
    eventFooter: {
      paddingHorizontal: 20,
      paddingVertical: 13,
      borderTopColor: C('border'),
      backgroundColor: '#FCFAF7',
    },
    eventTagBadge: {
      backgroundColor: C('accentSoft'),
      borderWidth: 0,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    eventTagText: { fontSize: 10, fontWeight: '600', color: C('accent') },
  },
  'components/home/Sevasection.jsx': {
    wrapper: { marginHorizontal: 24 },
    sevaBg: { ...whiteCard },
    sevaContent: { paddingTop: 24, paddingHorizontal: 24 },
    sevaTitle: { ...title, fontSize: 28, lineHeight: 36 },
    sevaTitleAccent: { color: C('plum') },
    sevaLabel: { fontSize: 10, letterSpacing: 1.5, marginBottom: 8 },
    imageWrapper: {
      marginHorizontal: 12,
      width: undefined,
      borderRadius: 16,
      marginTop: 20,
    },
    bottomButton: {
      backgroundColor: C('plum'),
      margin: 12,
      borderRadius: 16,
      minHeight: 70,
      paddingVertical: 14,
      paddingHorizontal: 18,
    },
    buttonSmallText: { fontSize: 10, letterSpacing: 1.1 },
  },
  'components/dhyanShivir/TransformInNineStepsStyles.js': {
    section: { backgroundColor: C('plum'), paddingVertical: 32, marginTop: 28 },
    header: { paddingHorizontal: 24, alignItems: 'flex-start' },
    headerTitle: {
      ...title,
      fontSize: 30,
      lineHeight: 38,
      textAlign: 'left',
      color: '#FFFFFF',
    },
    headerTitleName: {
      ...title,
      fontSize: 32,
      lineHeight: 42,
      textAlign: 'left',
      textTransform: 'none',
      color: '#DFC99F',
    },
    headerSubtitle: {
      textAlign: 'left',
      fontWeight: '400',
      fontSize: 16,
      lineHeight: 26,
      color: '#F0E7ED',
    },
    headerHighlight: { color: '#DFC99F', fontWeight: '600' },
    backgroundCardOne: { display: 'none' },
    backgroundCardTwo: { display: 'none' },
    backgroundCardThree: { display: 'none' },
    courseCard: { ...whiteCard, shadowOpacity: 0, elevation: 0 },
    imageContainer: {
      height: 205,
      margin: 8,
      borderRadius: 18,
      backgroundColor: C('soft'),
    },
    content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
    courseTitle: { ...title, color: C('ink'), fontSize: 23, lineHeight: 29 },
    courseDescription: { color: C('muted'), fontSize: 13, lineHeight: 21 },
    guideLabel: { color: C('muted'), fontSize: 10, letterSpacing: 1.1 },
    guideName: { color: C('plum'), fontSize: 14, fontWeight: '600' },
    arrowCircle: {
      backgroundColor: C('plumSoft'),
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    arrowText: { color: C('plum') },
    stepBadge: {
      backgroundColor: C('plum'),
      borderWidth: 0,
      paddingVertical: 8,
    },
    stepText: { color: '#FFFFFF', fontSize: 10 },
    durationText: { fontSize: 11 },
    paginationDotActive: { backgroundColor: '#DFC99F' },
  },
  'components/questionseva/QuestionSevaForm.jsx': {
    safeArea: { backgroundColor: C('canvas') },
    screen: {
      backgroundColor: C('canvas'),
      paddingHorizontal: 24,
      paddingTop: 6,
      paddingBottom: 6,
    },
    header: { marginBottom: 20 },
    headerAccent: {
      width: 3,
      height: 42,
      backgroundColor: C('gold'),
      marginRight: 14,
    },
    title: { ...title, fontSize: 28, lineHeight: 36 },
    titleSmall: { fontSize: 26 },
    subtitle: { fontSize: 12, lineHeight: 18, color: C('muted') },
    card: {
      ...whiteCard,
      paddingHorizontal: 20,
      paddingTop: 22,
      paddingBottom: 22,
    },
    cardSmall: {
      paddingHorizontal: 18,
      paddingTop: 20,
      paddingBottom: 20,
      borderRadius: 24,
    },
    loginBox: {
      backgroundColor: C('sageSoft'),
      borderWidth: 0,
      minHeight: 44,
      paddingVertical: 10,
    },
    loginBoxSmall: { minHeight: 44, marginBottom: 16 },
    loginText: { color: C('sage'), fontSize: 12 },
    field: { marginBottom: 16 },
    fieldSmall: { marginBottom: 14 },
    label: { fontSize: 13, marginBottom: 8 },
    input: {
      height: 52,
      fontSize: 15,
      borderRadius: 14,
      backgroundColor: '#FCFAF7',
      borderColor: C('border'),
    },
    inputSmall: { height: 52, fontSize: 15 },
    phoneContainer: {
      height: 52,
      borderRadius: 14,
      backgroundColor: '#FCFAF7',
      borderColor: C('border'),
    },
    phoneContainerSmall: { height: 52 },
    phoneInput: { fontSize: 15 },
    questionInput: {
      minHeight: 120,
      maxHeight: 180,
      fontSize: 15,
      lineHeight: 23,
      borderRadius: 14,
      backgroundColor: '#FCFAF7',
      borderColor: C('border'),
    },
    questionInputSmall: { minHeight: 120, maxHeight: 180, paddingTop: 12 },
    questionInputVerySmall: { minHeight: 120, maxHeight: 180 },
    submitButton: {
      height: 54,
      backgroundColor: C('plum'),
      borderWidth: 0,
      borderRadius: 16,
      elevation: 0,
      shadowOpacity: 0,
    },
    submitButtonSmall: { height: 54 },
    submitText: { fontSize: 15, fontWeight: '600' },
  },
  'components/navigation/CustomDrawerContent.jsx': {
    header: {
      paddingTop: 56,
      paddingBottom: 28,
      backgroundColor: C('plum'),
      borderBottomWidth: 0,
    },
    logoMain: { ...title, color: '#FFFFFF', fontSize: 25 },
    logoSub: { color: '#E4D7DE', fontSize: 13 },
    logoCircle: {
      backgroundColor: '#FFFFFF',
      width: 54,
      height: 54,
      borderRadius: 18,
    },
    drawerItem: {
      minHeight: 56,
      marginHorizontal: 14,
      marginVertical: 3,
      paddingVertical: 10,
      borderRadius: 16,
    },
    drawerItemIconBox: {
      width: 38,
      height: 38,
      borderRadius: 12,
      borderWidth: 0,
      backgroundColor: C('soft'),
    },
    drawerItemLabel: { fontSize: 14, fontWeight: '500', color: C('ink') },
    menuLabel: {
      paddingTop: 24,
      paddingBottom: 12,
      color: C('muted'),
      letterSpacing: 1.6,
      fontSize: 11,
    },
    verseBox: {
      backgroundColor: C('plumSoft'),
      borderColor: C('border'),
      borderLeftColor: C('plum'),
      padding: 18,
      borderRadius: 20,
    },
    verseText: { color: C('plum'), fontSize: 13, lineHeight: 22 },
    verseRef: { color: C('plum') },
    footer: {
      backgroundColor: C('canvas'),
      borderTopColor: C('border'),
      paddingVertical: 20,
    },
    footerText: { color: C('muted'), fontSize: 11 },
  },
  'components/chants/PathCounter.jsx': {
    wrapper: { ...whiteCard, marginHorizontal: 24, padding: 20 },
    mainRow: { flexDirection: 'column', gap: 24 },
    counterCol: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 18,
    },
    counterBox: {
      width: 148,
      height: 148,
      borderRadius: 74,
      borderWidth: 1,
      borderColor: C('gold'),
      backgroundColor: C('plum'),
    },
    counterText: {
      fontSize: 52,
      lineHeight: 62,
      fontWeight: '400',
      color: '#FFFFFF',
    },
    rightCol: { width: '100%', flex: 0, marginLeft: 0 },
    arrowBtn: {
      backgroundColor: C('soft'),
      borderWidth: 0,
      width: 46,
      height: 46,
      borderRadius: 23,
    },
    instructionsBox: {
      backgroundColor: '#FCFAF7',
      padding: 18,
      borderRadius: 16,
    },
    instrText: { fontSize: 13, lineHeight: 21 },
    submitBtn: { backgroundColor: C('plum'), minHeight: 54, borderRadius: 16 },
    todayBadge: {
      backgroundColor: C('sageSoft'),
      borderWidth: 0,
      paddingVertical: 8,
    },
    todayBadgeNumber: { color: C('sage') },
  },
  'components/donations/new/DonationForm.jsx': {
    scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
    header: { marginBottom: 28, gap: 4 },
    headerIcon: {
      width: 50,
      height: 50,
      borderRadius: 17,
      backgroundColor: C('plum'),
    },
    title: { ...title, fontSize: 29, lineHeight: 36 },
    subtitle: { fontSize: 13, lineHeight: 20 },
    card: { ...whiteCard, padding: 20, marginBottom: 20 },
    sectionTitleRow: { marginBottom: 14, flexWrap: 'wrap', gap: 6 },
    sectionTitle: { fontSize: 16, fontWeight: '600' },
    sectionHint: { fontSize: 11 },
    twoColumn: { flexDirection: 'column', gap: 4 },
    submitButton: {
      backgroundColor: C('plum'),
      minHeight: 56,
      borderRadius: 16,
    },
    submitText: { fontSize: 15, lineHeight: 22 },
    secureText: { fontSize: 11, lineHeight: 18 },
  },
  'components/patrika/PatrikaCard.jsx': {
    card: { ...whiteCard, borderRadius: 18, marginBottom: 20 },
    coverWrap: {
      height: undefined,
      aspectRatio: 0.76,
      margin: 8,
      borderRadius: 12,
      overflow: 'hidden',
    },
    body: { padding: 14 },
    title: { ...title, fontSize: 17, lineHeight: 24, minHeight: 48 },
    metaText: { fontSize: 11 },
    priceCaption: { fontSize: 10 },
    price: { fontSize: 14 },
    readButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: C('plumSoft'),
    },
  },
  'app/home/(tabs)/profile/index.jsx': {
    hero: {
      backgroundColor: C('plumSoft'),
      paddingTop: 20,
      paddingBottom: 30,
      borderBottomWidth: 0,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },
    guestHero: { backgroundColor: C('plumSoft'), borderBottomWidth: 0 },
    pageTitle: { ...title, fontSize: 25 },
    profileName: { ...title, fontSize: 30, lineHeight: 39 },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: C('plum'),
      borderColor: '#FFFFFF',
      borderWidth: 5,
    },
    card: { ...whiteCard, marginHorizontal: 20, marginTop: 18, padding: 20 },
    guestCard: { ...whiteCard, marginHorizontal: 20, marginTop: 18 },
    summaryCard: {
      ...whiteCard,
      marginHorizontal: 20,
      marginTop: 20,
      paddingVertical: 20,
    },
    sectionHeader: { marginBottom: 16 },
    sectionTitle: { fontSize: 17, fontWeight: '600' },
    sectionSubtitle: { fontSize: 12, lineHeight: 18 },
    inputWrapper: {
      height: 52,
      borderRadius: 14,
      backgroundColor: '#FCFAF7',
      borderColor: C('border'),
    },
    input: { fontSize: 15, paddingHorizontal: 12 },
    label: { fontSize: 12, marginBottom: 7, color: C('muted') },
    displayRow: { minHeight: 46, paddingVertical: 12 },
    displayLabel: { fontSize: 13 },
    displayValue: { fontSize: 13 },
    twoColumn: { flexDirection: 'column', gap: 8 },
    accountAction: { minHeight: 72 },
    accountActionTitle: { fontSize: 14 },
    accountActionSubtitle: { fontSize: 12, lineHeight: 18 },
    actions: { marginHorizontal: 20, marginTop: 20 },
    logoutCard: { marginHorizontal: 20, marginTop: 18, borderRadius: 24 },
    saveButton: { height: 54, borderRadius: 16, backgroundColor: C('plum') },
  },
};

const colorMap = {
  '#2B1B12': '#292328',
  '#4A3627': '#74696A',
  '#8B2635': '#55334A',
  '#C9A227': '#B39562',
  '#E2C066': '#DFC99F',
  '#A3821D': '#80653B',
  '#FFF9F1': '#F0EAE2',
  '#E8721C': '#A65338',
  '#F5A45C': '#CD8B6E',
  '#FFF8EE': '#F8F5F0',
  '#FFFDF9': '#FFFFFF',
  '#F0E4D3': '#E7DFD7',
  '#F5E6CF': '#E7DFD7',
  '#FFFCF8': '#FCFAF7',
};
let count = 0;
for (const dir of ['app', 'components', 'constants']) {
  for (const file of fs.readdirSync(dir, { recursive: true })) {
    const f = Path.join(dir, file).replaceAll('\\', '/');
    if (
      !/\.(jsx?|tsx?)$/.test(f) ||
      /__tests__|\/redux\/|\/backend\/|constants\/design.ts|constants\/brandColors.js/.test(
        f,
      )
    )
      continue;
    let source = fs.readFileSync(f, 'utf8');
    const ast = parse(source),
      edits = [];
    let needsDesign = false;
    traverse(ast, {
      CallExpression(p) {
        if (
          p.node.callee.object?.name !== 'StyleSheet' ||
          p.node.callee.property?.name !== 'create'
        )
          return;
        const obj = p.node.arguments[0];
        if (!t.isObjectExpression(obj)) return;
        for (const prop of obj.properties) {
          if (!t.isObjectProperty(prop) || !t.isObjectExpression(prop.value))
            continue;
          const name = prop.key.name || prop.key.value,
            style = prop.value;
          const size = val(style, 'fontSize')?.value;
          if (
            typeof size === 'number' &&
            size < 15 &&
            size > 0 &&
            !/icon|emoji|arrow|symbol/i.test(name)
          ) {
            const next = /badge|tag|caption|eyebrow|page|counter|pill/i.test(
              name,
            )
              ? Math.max(size, 10)
              : Math.max(size, 12);
            set(style, 'fontSize', next);
            const line = val(style, 'lineHeight')?.value;
            if (typeof line === 'number' && line < next * 1.45)
              set(style, 'lineHeight', Math.ceil(next * 1.5));
          }
          if (
            typeof size === 'number' &&
            size >= 18 &&
            /title|heading|brandName|profileName/i.test(name) &&
            !/sub|accent|hindi|devanagari/i.test(name)
          ) {
            for (const [k, v] of Object.entries(title)) set(style, k, v);
            const line = val(style, 'lineHeight')?.value;
            if (typeof line === 'number' && line < size * 1.2)
              set(style, 'lineHeight', Math.ceil(size * 1.3));
            needsDesign = true;
          }
          if (val(style, 'fontWeight')?.value === '800')
            set(style, 'fontWeight', '600');
          if (val(style, 'fontWeight')?.value === '00')
            set(style, 'fontWeight', '400');
          if (
            /card$/i.test(name) &&
            val(style, 'backgroundColor') &&
            !/active|selected|dark|hero|back|image|video|skeleton/i.test(name)
          ) {
            const bg = generate(val(style, 'backgroundColor')).code;
            if (/cream|white|#FFF|#fff/.test(bg)) {
              for (const [k, v] of Object.entries(whiteCard)) set(style, k, v);
              needsDesign = true;
            }
          }
          if (
            /^(inputWrapper|inputWrap|inputContainer|searchBox|searchBar|searchWrap|phoneContainer)$/.test(
              name,
            )
          ) {
            const h = val(style, 'height')?.value;
            if (typeof h === 'number' && h < 52) set(style, 'height', 52);
            set(style, 'borderRadius', 14);
          }
          if (
            /^(input|textInput|searchInput|phoneInput|emailInput)$/.test(name)
          ) {
            set(style, 'fontSize', 15);
            const h = val(style, 'height')?.value;
            if (typeof h === 'number' && h < 50) set(style, 'height', 50);
          }
          if (
            /^(primaryButton|submitButton|saveButton|loginButton|donateLargeBtn|submitBtn)$/.test(
              name,
            )
          ) {
            set(style, 'minHeight', 52);
            set(style, 'borderRadius', 16);
            if (typeof val(style, 'height')?.value === 'number')
              del(style, 'height');
            if (val(style, 'shadowOpacity')) set(style, 'shadowOpacity', 0.06);
            if (val(style, 'elevation')) set(style, 'elevation', 2);
          }
          if (overrides[f]?.[name]) {
            for (const [k, v] of Object.entries(overrides[f][name]))
              v === undefined ? del(style, k) : set(style, k, v);
            needsDesign = true;
          }
        }
        edits.push({
          start: obj.start,
          end: obj.end,
          text: generate(obj, { comments: true }).code,
        });
        p.skip();
      },
    });
    for (const e of edits.sort((a, b) => b.start - a.start))
      source = source.slice(0, e.start) + e.text + source.slice(e.end);
    // Exact palette literals only; user-facing strings/data are not rewritten.
    for (const [old, next] of Object.entries(colorMap))
      source = source
        .replaceAll("'" + old + "'", "'" + next + "'")
        .replaceAll('"' + old + '"', '"' + next + '"');
    source = source
      .replaceAll('201,162,39', '179,149,98')
      .replaceAll('232,114,28', '166,83,56')
      .replaceAll('43,27,18', '41,35,40');
    if (needsDesign && !/import\s*\{[^}]*\bDESIGN\b[^}]*\}\s*from/.test(source))
      source = "import { DESIGN } from '@/constants/design';\n" + source;
    if (source !== fs.readFileSync(f, 'utf8')) {
      fs.writeFileSync(f, source);
      count++;
    }
  }
}
console.log(
  'Restyled',
  count,
  'files; screen copy and feature handlers preserved.',
);
