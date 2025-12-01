
interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string;
  readonly VITE_ENCRYPTION_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
