import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from '@/components/auth/SignUp';
import UserProfile from '@/components/profile/UserProfile';
import CreateCard from '@/CreateCard';
import App from '@/App';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp onSignUp={async () => {}} />} />
        <Route path="/profile" element={
          <UserProfile
            username="demo_user"
            tokenBalance={15}
            createdCards={[]}
            correctCards={[]}
            unnecessaryCards={[]}
          />
        } />
        <Route path="/create" element={<CreateCard />} />
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
