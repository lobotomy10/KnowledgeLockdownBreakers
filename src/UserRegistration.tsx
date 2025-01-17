import { useState, type ChangeEvent } from 'react';
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";

interface UserRegistrationProps {
  onClose?: () => void;
  onRegister?: () => Promise<void>;
  language?: 'en' | 'ja';
}

const translations = {
  title: {
    en: 'Register New User',
    ja: '新規ユーザー登録'
  },
  username: {
    en: 'Username',
    ja: 'ユーザー名'
  },
  email: {
    en: 'Email',
    ja: 'メールアドレス'
  },
  password: {
    en: 'Password',
    ja: 'パスワード'
  },
  confirmPassword: {
    en: 'Confirm Password',
    ja: 'パスワード確認'
  },
  register: {
    en: 'Register',
    ja: '登録'
  },
  back: {
    en: 'Back',
    ja: '戻る'
  },
  enterUsername: {
    en: 'Enter username',
    ja: 'ユーザー名を入力'
  },
  enterEmail: {
    en: 'Enter email address',
    ja: 'メールアドレスを入力'
  },
  enterPassword: {
    en: 'Enter password',
    ja: 'パスワードを入力'
  },
  confirmPasswordPlaceholder: {
    en: 'Confirm your password',
    ja: 'パスワードを再入力'
  },
  errors: {
    passwordMismatch: {
      en: 'Passwords do not match',
      ja: 'パスワードが一致しません'
    },
    registrationFailed: {
      en: 'Registration failed. Please try again.',
      ja: '登録に失敗しました。もう一度お試しください。'
    }
  }
};

export default function UserRegistration({ onClose, onRegister, language = 'en' }: UserRegistrationProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    
    if (password !== confirmPassword) {
      setError(translations.errors.passwordMismatch[language]);
      return;
    }

    try {
      const response = await fetch('https://cardnote-backend-wbgoevjh.fly.dev/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok && onRegister) {
        await onRegister();
      }
    } catch (error) {
      console.error('Failed to register user:', error);
      setError(translations.errors.registrationFailed[language]);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50">
      <div className="p-4 max-w-md mx-auto mt-16">
        <Card className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={onClose}
              className="text-xl p-2 hover:bg-gray-100/80 rounded-full transition-colors"
            >
              {translations.back[language]}
            </button>
            <h2 className="text-xl font-bold">{translations.title[language]}</h2>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">
                {translations.username[language]}
              </label>
              <input
                type="text"
                value={username}
                name="username"
              onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={translations.enterUsername[language]}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                {translations.email[language]}
              </label>
              <input
                type="email"
                value={email}
                name="email"
              onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={translations.enterEmail[language]}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                {translations.password[language]}
              </label>
              <input
                type="password"
                value={password}
                name="password"
              onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={translations.enterPassword[language]}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                {translations.confirmPassword[language]}
              </label>
              <input
                type="password"
                value={confirmPassword}
                name="confirmPassword"
              onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={translations.confirmPasswordPlaceholder[language]}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
            
            <Button
              onClick={handleSubmit}
              className="w-full mt-6"
            >
              {translations.register[language]}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
