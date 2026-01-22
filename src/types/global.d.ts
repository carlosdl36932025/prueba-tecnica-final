export {};

declare global {
  interface Window {
    __VITE_ENV__?: {
      VITE_API_URL?: string;
      VITE_IMGBB_API_KEY?: string;
      [key: string]: string | undefined;
    };
  }

  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_IMGBB_API_KEY?: string;
    [key: string]: string | undefined;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
