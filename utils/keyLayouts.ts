
export type KeyboardLayout = {
  id: string;
  label: string; // Display on spacebar
  locale: string;
  rows: string[][];
};

export const LAYOUTS: Record<string, KeyboardLayout> = {
  en: {
    id: 'en',
    label: 'English',
    locale: 'en-US',
    rows: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ]
  },
  is: {
    id: 'is',
    label: 'Íslenska',
    locale: 'is-IS',
    rows: [
      // Top row includes ð, ö
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'ð', 'ö'],
      // Middle row includes æ
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'æ'],
      // Bottom row includes þ
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'þ']
    ]
  },
  ru: {
    id: 'ru',
    label: 'Русский',
    locale: 'ru-RU',
    rows: [
      ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х'],
      ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
      ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']
    ]
  },
  es: {
    id: 'es',
    label: 'Español',
    locale: 'es-ES',
    rows: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ]
  }
};

export const LANGUAGE_ORDER = ['en', 'is', 'ru', 'es'];
