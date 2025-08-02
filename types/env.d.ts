declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      MICROCMS_SERVICE_DOMAIN: string;
      MICROCMS_API_KEY: string;
    }
  }
}

export {};
