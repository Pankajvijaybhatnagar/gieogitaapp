export const conf = {
  apiBaseURL:
    process.env.EXPO_PUBLIC_BASE_API_URL || 'https://api.gieogita.org/v1',
  // apiBaseURL: process.env.EXPO_PUBLIC_BASE_API_URL || 'http://localhost:3000/api/v1',
  // Public (non-admin) content host — used by galleryServices.getPublicGallery().
  // Was previously referenced but never defined here, so that call always
  // hit `undefined/gallery?...`. Fallback is a best guess at the main site;
  // set EXPO_PUBLIC_LIVE_URL if the public API actually lives elsewhere.
  liveURL: process.env.EXPO_PUBLIC_LIVE_URL || 'https://gieogita.org',
  googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  youtubeKey: process.env.EXPO_PUBLIC_YT_API,
  joinGieoGitaFormURL: process.env.EXPO_PUBLIC_JOIN_GIEO_GITA_FORM_URL || '',
};
