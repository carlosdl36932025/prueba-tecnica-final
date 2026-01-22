export const getEnv = (key: string): string => {
  return process.env[key] || '';
};

export const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';
export const IMGBB_API_KEY = process.env.VITE_IMGBB_API_KEY || 'test-key';
