import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext';
import { GroupGiftProvider } from './context/GroupGiftContext';
import { RegionProvider } from './context/RegionContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AIGuidePage from './pages/AIGuidePage';
import QuickFinderPage from './pages/QuickFinderPage';
import QuickGiftDecidePage from './pages/QuickGiftDecidePage';
import GiftSuggestionPage from './pages/GiftSuggestionPage';
import QuickGiftSuggestionPage from './pages/QuickGiftSuggestionPage';
import CheckNearbyPage from './pages/CheckNearbyPage';
import GroupGiftingPage from './pages/GroupGiftingPage';
import RecipientsPage from './pages/RecipientsPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserProvider>
        <RegionProvider>
          <GroupGiftProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/ai-guide" element={<AIGuidePage />} />
                <Route path="/quick-finder" element={<QuickFinderPage />} />
                <Route path="/quick-gift-decide" element={<QuickGiftDecidePage />} />
                <Route path="/gift-suggestions" element={<GiftSuggestionPage />} />
                <Route path="/quick-gift-suggestions" element={<QuickGiftSuggestionPage />} />
                <Route path="/check-nearby" element={<CheckNearbyPage />} />
                <Route path="/group-gifting" element={<GroupGiftingPage />} />
                <Route path="/recipients" element={<RecipientsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </GroupGiftProvider>
        </RegionProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;