import type { Route } from 'next';

export const ROUTE: Record<string, URL | Route<string>> = {
  home: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL as Route<string>,
};
