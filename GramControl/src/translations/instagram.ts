interface LanguageTranslations {
  explore: string;
  reels: string;
  suggestedForYou: string;
  comment: string;
}

const languageTranslations: Record<string, LanguageTranslations> = {
  english: {
    explore: 'Explore',
    reels: 'Reels',
    suggestedForYou: 'Suggested for you',
    comment: 'Comment',
  },

  spanish: {
    explore: 'Explorar',
    reels: 'Reels',
    suggestedForYou: 'Sugerencias para ti',
    comment: 'Comentar',
  },

  portuguese: {
    explore: 'Explorar',
    reels: 'Reels',
    suggestedForYou: 'Sugestões para ti',
    comment: 'Comentar',
  },

  brasil: {
    explore: 'Explorar',
    reels: 'Reels',
    suggestedForYou: 'Sugestões para você',
    comment: 'Comentar',
  },

  french: {
    explore: 'Découvrir',
    reels: 'Reels',
    suggestedForYou: 'Suggestions pour vous',
    comment: 'Commenter',
  },

  german: {
    explore: 'Entdecken',
    reels: 'Reels',
    suggestedForYou: 'Für dich vorgeschlagen',
    comment: 'Kommentar',
  },

  italian: {
    explore: 'Esplora',
    reels: 'Reels',
    suggestedForYou: 'Suggeriti per te',
    comment: 'Commenta',
  },

  turkish: {
    explore: 'Keşfet',
    reels: 'Reels',
    suggestedForYou: 'Senin için önerilenler',
    comment: 'Yorum Yap',
  },

  arabic: {
    explore: 'استكشاف',
    reels: 'ريلز',
    suggestedForYou: 'اقتراحات قد تعجبك',
    comment: 'تعليق',
  },

  czech: {
    explore: 'Objevujte',
    reels: 'Reels',
    suggestedForYou: 'Návrhy pro vás',
    comment: 'Okomentovat',
  },

  polish: {
    explore: 'Eksploruj',
    reels: 'Rolki',
    suggestedForYou: 'Propozycje dla Ciebie',
    comment: 'Skomentuj',
  },

  danish: {
    explore: 'Udforsk',
    reels: 'Reels',
    suggestedForYou: 'Foreslået til dig',
    comment: 'Kommenter',
  },

  dutch: {
    explore: 'Ontdekken',
    reels: 'Reels',
    suggestedForYou: 'Voorgesteld voor jou',
    comment: 'Reageren',
  },

  norwegian: {
    explore: 'Utforsk',
    reels: 'Reels',
    suggestedForYou: 'Forslag til deg',
    comment: 'Kommenter',
  },

  swedish: {
    explore: 'Utforska',
    reels: 'Reels',
    suggestedForYou: 'Förslag för dig',
    comment: 'Kommentera',
  },

  finnish: {
    explore: 'Tutki',
    reels: 'Reels',
    suggestedForYou: 'Sinulle ehdotettua',
    comment: 'Kommentoi',
  },

  greek: {
    explore: 'Εξερεύνηση',
    reels: 'Reels',
    suggestedForYou: 'Προτάσεις για εσάς',
    comment: 'Σχόλιο',
  },

  hungarian: {
    explore: 'Felfedezés',
    reels: 'Reels',
    suggestedForYou: 'Neked javasoltak',
    comment: 'Hozzászólás',
  },

  indonesian: {
    explore: 'Jelajahi',
    reels: 'Reels',
    suggestedForYou: 'Disarankan untuk Anda',
    comment: 'Komentari',
  },

  malay: {
    explore: 'Terokai',
    reels: 'Reels',
    suggestedForYou: 'Dicadangkan untuk anda',
    comment: 'Komen',
  },

  thai: {
    explore: 'สำรวจ',
    reels: 'Reels',
    suggestedForYou: 'แนะนำสำหรับคุณ',
    comment: 'ความคิดเห็น',
  },

  japanese: {
    explore: '発見',
    reels: 'リール動画',
    suggestedForYou: 'おすすめ',
    comment: 'コメント',
  },

  korean: {
    explore: '탐색 탭',
    reels: '릴스',
    suggestedForYou: '회원님을 위한 추천',
    comment: '댓글 달기',
  },

  russian: {
    explore: 'Интересное',
    reels: 'Reels',
    suggestedForYou: 'Рекомендации для вас',
    comment: 'Комментировать',
  },

  ukrainian: {
    explore: 'Цікаве',
    reels: 'Reels',
    suggestedForYou: 'Рекомендації для вас',
    comment: 'Коментувати',
  },

  vietnamese: {
    explore: 'Khám phá',
    reels: 'Reels',
    suggestedForYou: 'Gợi ý cho bạn',
    comment: 'Bình luận',
  },

  bulgarian: {
    explore: 'Проучване',
    reels: 'Ленти',
    suggestedForYou: 'Предложено за вас',
    comment: 'Коментар',
  },

  hindi: {
    explore: 'एक्सप्लोर करें',
    reels: 'Reels',
    suggestedForYou: 'आपके लिए सुझाए गए',
    comment: 'कमेंट करें',
  },

  romanian: {
    explore: 'Explorează',
    reels: 'Reels',
    suggestedForYou: 'Sugestii pentru tine',
    comment: 'Comentează',
  },

  serbian: {
    explore: 'Истражите',
    reels: 'Reels',
    suggestedForYou: 'Предлажемо за вас',
    comment: 'Коментар',
  },

  slovak: {
    explore: 'Preskúmať',
    reels: 'Filmové pásy',
    suggestedForYou: 'Návrhy pre vás',
    comment: 'Komentovať',
  },

  croatian: {
    explore: 'Istraži',
    reels: 'Reels',
    suggestedForYou: 'Predloženo za vas',
    comment: 'Komentar',
  },

  chinese: {
    explore: '探索',
    reels: 'Reels',
    suggestedForYou: '为你推荐',
    comment: '评论',
  },

  taiwanese: {
    explore: '探索',
    reels: 'Reel',
    suggestedForYou: '為你推薦',
    comment: '回應',
  },
};

const activeLanguages = Object.keys(languageTranslations) as (keyof typeof languageTranslations)[];

export interface InstagramTranslations {
  explore: string[];
  reels: string[];
  suggestedForYou: string[];
  comment: string[];
}

export const translations: InstagramTranslations = {
  explore: activeLanguages.map(lang => languageTranslations[lang].explore),
  reels: activeLanguages.map(lang => languageTranslations[lang].reels),
  suggestedForYou: activeLanguages.map(lang => languageTranslations[lang].suggestedForYou),
  comment: activeLanguages.map(lang => languageTranslations[lang].comment),
};

export const selectors = {
  explore: translations.explore.map(label => `svg[aria-label="${label}"]`).join(', '),
  reels: translations.reels.map(label => `svg[aria-label="${label}"].x5n08af`).join(', '),
};

export const matchesTranslation = (
  text: string | null | undefined,
  translationList: string[],
  caseInsensitive = false
): boolean => {
  if (!text) return false;
  const trimmed = text.trim();
  
  if (caseInsensitive) {
    const lower = trimmed.toLowerCase();
    return translationList.some(t => lower.includes(t.toLowerCase()));
  }
  
  return translationList.some(t => trimmed === t);
};
