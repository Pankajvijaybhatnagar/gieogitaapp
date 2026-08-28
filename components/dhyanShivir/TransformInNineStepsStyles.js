import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = SCREEN_WIDTH * 0.74;
const CARD_HEIGHT = 445;

export const styles = StyleSheet.create({
  section: {
    width: '100%',
    backgroundColor: '#24120D',
    paddingVertical: 30,
    overflow: 'hidden',
    marginTop: 30,
  },

  header: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  headerSmall: {
    color: '#D8A746',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },

  headerTitle: {
    color: '#FFF2D8',
    fontSize: 22,
    lineHeight: 33,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerTitleName: {
    color: '#FFF2D8',
    fontSize: 35,
    lineHeight: 33,
    fontWeight: '300',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  headerSubtitle: {
    color: '#E6D1AD',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '00',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 5,
  },

  headerHighlight: {
    color: '#E7B34C',
    fontWeight: '800',
  },

  headerDescription: {
    color: 'rgba(255,242,216,0.55)',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 310,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 55,
    marginTop: 18,
    marginBottom: 2,
    gap: 10,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(216,167,70,0.22)',
  },

  dividerIcon: {
    color: '#D8A746',
    fontSize: 18,
  },

  sliderArea: {
    position: 'relative',
    minHeight: CARD_HEIGHT + 48,
    justifyContent: 'center',
  },

  backgroundCardOne: {
    position: 'absolute',
    width: CARD_WIDTH - 16,
    height: CARD_HEIGHT - 12,
    left: (SCREEN_WIDTH - (CARD_WIDTH - 16)) / 2,
    top: 30,
    borderRadius: 25,
    backgroundColor: '#4B2A1E',
    borderWidth: 1,
    borderColor: 'rgba(216,167,70,0.16)',
    transform: [
      {
        rotate: '-3deg',
      },
    ],
  },

  backgroundCardTwo: {
    position: 'absolute',
    width: CARD_WIDTH - 32,
    height: CARD_HEIGHT - 25,
    left: (SCREEN_WIDTH - (CARD_WIDTH - 32)) / 2,
    top: 37,
    borderRadius: 25,
    backgroundColor: '#3C2118',
    borderWidth: 1,
    borderColor: 'rgba(216,167,70,0.12)',
    transform: [
      {
        rotate: '4deg',
      },
    ],
  },

  backgroundCardThree: {
    position: 'absolute',
    width: CARD_WIDTH - 50,
    height: CARD_HEIGHT - 38,
    left: (SCREEN_WIDTH - (CARD_WIDTH - 50)) / 2,
    top: 44,
    borderRadius: 25,
    backgroundColor: '#301A13',
    borderWidth: 1,
    borderColor: 'rgba(216,167,70,0.08)',
    transform: [
      {
        rotate: '-6deg',
      },
    ],
  },

  cardWrapper: {
    height: CARD_HEIGHT,
  },

  courseCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3A2118',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(216,167,70,0.38)',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 18,

    elevation: 10,
  },

  imageContainer: {
    height: 235,
    margin: 10,
    borderRadius: 17,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#2C1711',
  },

  courseImage: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(51,27,17,0.15)',
  },

  stepBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(41,21,14,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(225,180,83,0.52)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
  },

  stepText: {
    color: '#F3CA70',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  durationBadge: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(41,21,14,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  durationText: {
    color: '#FFF0D1',
    fontSize: 9,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 17,
  },

  goldLine: {
    width: 28,
    height: 2,
    borderRadius: 10,
    backgroundColor: '#D8A746',
    marginBottom: 9,
  },

  courseTitle: {
    color: '#FFF3DB',
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    marginBottom: 7,
  },

  courseDescription: {
    flex: 1,
    color: 'rgba(255,243,219,0.58)',
    fontSize: 10.5,
    lineHeight: 16,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  guideSection: {
    flex: 1,
  },

  guideLabel: {
    color: 'rgba(255,243,219,0.35)',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 3,
  },

  guideName: {
    color: '#E4B456',
    fontSize: 12,
    fontWeight: '800',
  },

  arrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D8A746',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowText: {
    color: '#321A11',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },

  paginationDot: {
    width: 5,
    height: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(216,167,70,0.23)',
  },

  paginationDotActive: {
    width: 22,
    backgroundColor: '#D8A746',
  },

  pageNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 9,
  },

  currentPage: {
    color: '#E6B957',
    fontSize: 12,
    fontWeight: '800',
  },

  pageSlash: {
    color: 'rgba(255,243,219,0.24)',
    fontSize: 10,
  },

  totalPage: {
    color: 'rgba(255,243,219,0.4)',
    fontSize: 9,
    fontWeight: '600',
  },

  loadingContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#D8A746',
    fontSize: 11,
  },

  emptyContainer: {
    minHeight: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    color: 'rgba(255,243,219,0.5)',
    fontSize: 11,
  },
});
