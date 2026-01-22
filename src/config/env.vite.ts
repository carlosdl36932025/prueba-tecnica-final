export const getEnv = (key: string): string => {
  return import.meta.env[key] || '';
};

export const API_URL = getEnv('VITE_API_URL');
console.log('API_URL', API_URL);
export const IMGBB_API_KEY = getEnv('VITE_IMGBB_API_KEY');
console.log('IMGBB_API_KEY', IMGBB_API_KEY);
