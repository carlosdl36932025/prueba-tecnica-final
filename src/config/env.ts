/* // src/config/env.ts
let env: any;

if (typeof process !== 'undefined' && process.env?.JEST_WORKER_ID !== undefined) {
  env = require('./env.node');
} else {
  env = require('./env.vite');
}

export const getEnv = env.getEnv;
export const API_URL = env.API_URL;
export const IMGBB_API_KEY = env.IMGBB_API_KEY;
 */

// src/config/env.ts
// src/config/env.ts

// src/config/env.ts

// src/config/env.ts

/* type EnvModule = {
  getEnv: (key: string) => string;
  API_URL: string;
  IMGBB_API_KEY: string;
};

function getNodeEnv(): EnvModule {
  return {
    getEnv: (key: string) => process.env[key] || '',
    API_URL: process.env.VITE_API_URL || '',
    IMGBB_API_KEY: process.env.VITE_IMGBB_API_KEY || '',
  };
}

function getBrowserEnv(): EnvModule {
  return {
    getEnv: (key: string) => (import.meta as any).env?.[key] || '',
    API_URL: (import.meta as any).env?.VITE_API_URL || '',
    IMGBB_API_KEY: (import.meta as any).env?.VITE_IMGBB_API_KEY || '',
  };
}

function loadEnv(): EnvModule {
  // Jest / Node
  if (typeof window === 'undefined') {
    return getNodeEnv();
  }

  // Browser (Vite)
  return getBrowserEnv();
}

const env = loadEnv();

export const getEnv = env.getEnv;
export const API_URL = env.API_URL;
export const IMGBB_API_KEY = env.IMGBB_API_KEY;
 */

// src/config/env.ts

type EnvModule = {
  getEnv: (key: string) => string;
  API_URL: string;
  IMGBB_API_KEY: string;
};

function getBrowserEnv(): EnvModule {
  const env = (window as any).__VITE_ENV__ || (window as any).VITE_ENV || {};

  return {
    getEnv: (key: string) => env[key] || '',
    API_URL: env.VITE_API_URL || '',
    IMGBB_API_KEY: env.VITE_IMGBB_API_KEY || '',
  };
}

// Node / Jest
function getNodeEnv(): EnvModule {
  return {
    getEnv: (key: string) => process.env[key] || '',
    API_URL: process.env.VITE_API_URL || '',
    IMGBB_API_KEY: process.env.VITE_IMGBB_API_KEY || '',
  };
}

function loadEnv(): EnvModule {
  if (typeof window === 'undefined') {
    // Node / Jest
    return getNodeEnv();
  }

  // Browser
  return getBrowserEnv();
}

const env = loadEnv();

export const getEnv = env.getEnv;
export const API_URL = env.API_URL;
export const IMGBB_API_KEY = env.IMGBB_API_KEY;
