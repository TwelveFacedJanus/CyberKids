// frontend/src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Добавь другие переменные окружения если есть
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite-plugin-svgr/client" />