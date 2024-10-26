"use client";

import { defaultApiKeyState, apiKeySchema } from '@/types/data/apiKey';
import { createPersistedStore } from '@/types/store/base';

export const useApiKeyStore = createPersistedStore(
  'apiKey',
  defaultApiKeyState,
  apiKeySchema,
  'apiKeyState',
  'setApiKeyState',
);
