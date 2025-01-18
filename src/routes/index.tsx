import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from '@/components/auth/SignUp';
import UserProfile from '@/components/profile/UserProfile';
import CreateCard from '@/CreateCard';
import App from '@/App';
import { authAPI } from '@/services/api';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/signup" element={
        <SignUp
          onSignUp={async (data) => {
            try {
              await authAPI.signup(data);
              window.location.replace('/#/');
            } catch (error) {
              console.error('Signup failed:', error);
              throw error;
            }
          }}
        />
      } />
      <Route path="/profile" element={<UserProfile username="demo_user" tokenBalance={15} />} />
      <Route path="/create" element={<CreateCard />} />
      <Route path="/" element={<App />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
