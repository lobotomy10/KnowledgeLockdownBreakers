import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      // App.tsx translations
      "No cards to review!": "No cards to review!",
      "Create New Card": "Create New Card",
      "CardNote": "CardNote",
      "Correct": "Correct",
      
      // CreateCard.tsx translations
      "Preview": "Preview",
      "Title": "Title",
      "Content": "Content",
      "Enter knowledge title": "Enter knowledge title",
      "Share your knowledge...": "Share your knowledge...",
      "Add Media": "Add Media",
      "Tags": "Tags",
    },
  },
  ja: {
    translation: {
      // App.tsx translations
      "No cards to review!": "レビューするカードがありません！",
      "Create New Card": "新しいカードを作成",
      "CardNote": "カードノート",
      "Correct": "正解",
      
      // CreateCard.tsx translations
      "Preview": "プレビュー",
      "Title": "タイトル",
      "Content": "内容",
      "Enter knowledge title": "ナレッジのタイトル",
      "Share your knowledge...": "知識をシェア...",
      "Add Media": "メディアを追加",
      "Tags": "タグ",
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
