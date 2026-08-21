export const conf = {
  apiBaseURL:
    process.env.EXPO_PUBLIC_BASE_API_URL || 'https://api.gieogita.org/v1',
  // apiBaseURL: process.env.EXPO_PUBLIC_BASE_API_URL || 'http://localhost:3000/api/v1',
  googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  youtubeKey: process.env.EXPO_PUBLIC_YT_API,
  joinGieoGitaFormURL: process.env.EXPO_PUBLIC_JOIN_GIEO_GITA_FORM_URL || '',
};
