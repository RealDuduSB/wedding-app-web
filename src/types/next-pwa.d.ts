declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  type NextPwaPlugin = (config: NextConfig) => NextConfig;

  interface NextPwaOptions {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: unknown[];
    fallbacks?: {
      document?: string;
    };
  }

  export default function withPWA(options: NextPwaOptions): NextPwaPlugin;
}
