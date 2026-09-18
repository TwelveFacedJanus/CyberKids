// frontend/src/types/electron.d.ts
export {};

declare global {
  interface Window {
    __API_URL__?: string;
    isElectron?: boolean;
    process?: {
      type: string;
      versions: Record<string, string>;
    };
  }
}