import type { LanguageOption } from '../types/game'
import en from './en'
import fi from './fi'

export const i18n = { fi, en } as const

export function getI18n(language: LanguageOption) {
  return i18n[language]
}
