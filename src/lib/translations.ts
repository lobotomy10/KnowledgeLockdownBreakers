export type Language = 'en' | 'ja';

export const translations = {
  en: {
    appName: "CardNote",
    tutorialSteps: {
      welcome: {
        title: "Welcome to CardNote!",
        content: "Learn and share knowledge through bite-sized cards. Swipe right to save useful knowledge, or left to skip."
      },
      tokenEconomy: {
        title: "Token Economy",
        content: "Earn 5 tokens for creating cards. Spend 2 tokens to save useful knowledge cards."
      },
      createCards: {
        title: "Create Knowledge Cards",
        content: "Share your knowledge by creating cards. Add text, images, or videos to make your cards more engaging."
      }
    },
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
    tutorialSteps: {
      welcome: {
        title: "カードノートへようこそ！",
        content: "短いカードで知識を学び、共有しましょう。右スワイプで役立つ知識を保存、左スワイプでスキップします。"
      },
      tokenEconomy: {
        title: "トークンエコノミー",
        content: "カードを作成すると5トークンを獲得。役立つ知識カードを保存するには2トークンを使用します。"
      },
      createCards: {
        title: "知識カードを作成",
        content: "知識カードを作成して知識を共有しましょう。テキスト、画像、動画を追加してカードをより魅力的にできます。"
      }
    },
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
