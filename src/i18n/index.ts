import * as zhCN from '../locales/zh-CN'
import * as enUS from '../locales/en-US'
import { useAppStore } from '../store'
import type { Language } from '../store'

export type Locale = typeof zhCN

const localeMaps: Record<Language, Locale> = {
  'zh-CN': zhCN,
  'en-US': enUS as unknown as Locale,
}

/** React hook: subscribe to language and return the active locale object. */
export function useTranslation(): Locale {
  const language = useAppStore((s) => s.language)
  return localeMaps[language]
}

/** Non-component getter: read the active locale from the store without subscribing. */
export function getTranslation(): Locale {
  return localeMaps[useAppStore.getState().language]
}

export type { Language }
