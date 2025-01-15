export type Language = 'en' | 'ja';

export const translations = {
  en: {
    appName: "CardNote",
    noCards: "No cards to review!",
    createNewCard: "Create a new card",
    title: "Title",
    content: "Content",
    addMedia: "Add Media",
    shareKnowledge: "Share your knowledge...",
    preview: "Preview",
    tags: "Tags",
    tokenBalance: "Token Balance",
    correctSwipe: "Correct (-2 tokens)",
    createAccount: "Create Account",
    email: "Email",
    username: "Username",
    password: "Password",
    signUpTitle: "Sign Up for CardNote",
    logout: "Logout",
    loading: "Loading...",
    error: {
      required: "All fields are required",
      signupFailed: "Signup failed",
      fetchFailed: "Failed to load cards",
      swipeFailed: "Failed to process swipe",
    }
  },
  ja: {
    appName: "カードノート",
    noCards: "レビューするカードがありません！",
    createNewCard: "新しいカードを作成",
    title: "タイトル",
    content: "内容",
    addMedia: "メディアを追加",
    shareKnowledge: "知識を共有しましょう...",
    preview: "プレビュー",
    tags: "タグ",
    tokenBalance: "トークン残高",
    correctSwipe: "正解 (-2トークン)",
    createAccount: "アカウント作成",
    email: "メールアドレス",
    username: "ユーザー名",
    password: "パスワード",
    signUpTitle: "カードノートに登録",
    logout: "ログアウト",
    loading: "読み込み中...",
    error: {
      required: "全ての項目を入力してください",
      signupFailed: "登録に失敗しました",
      fetchFailed: "カードの読み込みに失敗しました",
      swipeFailed: "スワイプの処理に失敗しました",
    }
  }
} as const;
