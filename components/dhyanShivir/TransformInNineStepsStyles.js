import { DESIGN } from '@/constants/design';
import { COLORS } from '@/constants/brandColors';
import { hairline } from '@/constants/theme';
import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = SCREEN_WIDTH * 0.74;
const CARD_HEIGHT = 440;

export const styles = StyleSheet.create({
  section: {
    width: '100%',
    backgroundColor: COLORS.cream,
    paddingVertical: 32,
    overflow: 'hidden',
    marginTop: 28
  },
  header: {
    paddingHorizontal: 24,
    alignItems: "flex-start"
  },
  headerSmall: {
    color: COLORS.goldDark,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10
  },
  headerTitle: {
    color: COLORS.deepBrown,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "400",
    textAlign: "left",
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4
  },
  headerTitleName: {
    color: COLORS.saffron,
    fontSize: 32,
    lineHeight: 42,
    fontWeight: "400",
    textAlign: "left",
    textTransform: "none",
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4
  },
  headerSubtitle: {
    color: COLORS.warmBrown,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400",
    textAlign: "left",
    marginTop: 0,
    marginBottom: 5
  },
  headerHighlight: {
    color: COLORS.saffron,
    fontWeight: "600"
  },
  headerDescription: {
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 310
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 55,
    marginTop: 18,
    marginBottom: 2,
    gap: 10
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: hairline
  },
  dividerIcon: {
    color: COLORS.gold,
    fontSize: 18
  },
  sliderArea: {
    position: 'relative',
    minHeight: CARD_HEIGHT + 48,
    justifyContent: 'center'
  },
  backgroundCardOne: {
    position: 'absolute',
    width: CARD_WIDTH - 16,
    height: CARD_HEIGHT - 12,
    left: (SCREEN_WIDTH - (CARD_WIDTH - 16)) / 2,
    top: 30,
    borderRadius: 25,
    backgroundColor: '#4A2C1B',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.16)',
    transform: [{
      rotate: '-3deg'
    }],
    display: "none"
  },
  backgroundCardTwo: {
    position: 'absolute',
    width: CARD_WIDTH - 32,
    height: CARD_HEIGHT - 25,
    left: (SCREEN_WIDTH - (CARD_WIDTH - 32)) / 2,
    top: 37,
    borderRadius: 25,
    backgroundColor: '#3D2416',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.12)',
    transform: [{
      rotate: '4deg'
    }],
    display: "none"
  },
  backgroundCardThree: {
    position: 'absolute',
    width: CARD_WIDTH - 50,
    height: CARD_HEIGHT - 38,
    left: (SCREEN_WIDTH - (CARD_WIDTH - 50)) / 2,
    top: 44,
    borderRadius: 25,
    backgroundColor: '#2B1710',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.08)',
    transform: [{
      rotate: '-6deg'
    }],
    display: "none"
  },
  cardWrapper: {
    height: CARD_HEIGHT
  },
  courseCard: {
    width: '100%',
    height: '100%',
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0,
    shadowRadius: 18,
    elevation: 0
  },
  imageContainer: {
    height: 205,
    margin: 8,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: DESIGN.colors.soft
  },
  courseImage: {
    width: '100%',
    height: '100%'
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(43,23,16,0.15)'
  },
  stepBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: DESIGN.colors.plum,
    borderWidth: 0,
    borderColor: 'rgba(226,192,102,0.52)',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 18
  },
  stepText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2
  },
  durationBadge: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(43,23,16,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  durationText: {
    color: '#FFF3E0',
    fontSize: 11,
    fontWeight: '700'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20
  },
  goldLine: {
    width: 28,
    height: 2,
    borderRadius: 10,
    backgroundColor: COLORS.gold,
    marginBottom: 9
  },
  courseTitle: {
    color: DESIGN.colors.ink,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "400",
    marginBottom: 7,
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4
  },
  courseDescription: {
    flex: 1,
    color: DESIGN.colors.muted,
    fontSize: 13,
    lineHeight: 21
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 10
  },
  guideSection: {
    flex: 1
  },
  guideLabel: {
    color: DESIGN.colors.muted,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.1,
    marginBottom: 3
  },
  guideName: {
    color: DESIGN.colors.plum,
    fontSize: 14,
    fontWeight: "600"
  },
  arrowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DESIGN.colors.plumSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowText: {
    color: DESIGN.colors.plum,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 3
  },
  paginationDot: {
    width: 5,
    height: 5,
    borderRadius: 10,
    backgroundColor: hairline
  },
  paginationDotActive: {
    width: 22,
    backgroundColor: COLORS.saffron
  },
  pageNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 9
  },
  currentPage: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: "600"
  },
  pageSlash: {
    color: COLORS.warmBrown,
    fontSize: 10
  },
  totalPage: {
    color: COLORS.warmBrown,
    fontSize: 10,
    fontWeight: '600'
  },
  loadingContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    color: COLORS.warmBrown,
    fontSize: 12
  },
  emptyContainer: {
    minHeight: 250,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: COLORS.warmBrown,
    fontSize: 12
  }
});
