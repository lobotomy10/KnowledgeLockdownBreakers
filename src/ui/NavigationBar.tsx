import React from 'react';

interface NavProps {
  language: 'en' | 'ja';
  onRegisterClick?: () => void;
}

const NavigationBar: React.FC<NavProps> = ({ language, onRegisterClick }) => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm p-4 fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">CardNote</h1>
        <ul className="flex gap-6">
          <li>
            <a href="/" className="hover:text-gray-600 transition-colors">
              {language === 'en' ? 'Home' : 'ホーム'}
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-600 transition-colors">
              {language === 'en' ? 'Create Card' : 'カード作成'}
            </a>
          </li>
          <li>
            <button
              onClick={onRegisterClick}
              className="hover:text-gray-600 transition-colors"
            >
              {language === 'en' ? 'Sign Up' : '新規登録'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;
