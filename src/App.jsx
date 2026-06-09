import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout
import { DashboardLayout } from './components/layout/DashboardLayout';

// Guided tour
import { GuidedTour } from './components/walkthrough/GuidedTour';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Dashboard pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';

// Profile pages
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';

// Original feature pages
import { InvestorsPage } from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { DealsPage } from './pages/deals/DealsPage';
import { ChatPage } from './pages/chat/ChatPage';

// New feature pages (Week 1-3)
import { CalendarPage } from './pages/calendar/CalendarPage';
import { VideoCallPage } from './pages/videocall/VideoCallPage';
import { DocumentChamberPage } from './pages/documents/DocumentChamberPage';
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { SecurityPage } from './pages/security/SecurityPage';
import ScrollToTop from './ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop/>
        <Routes>
          {/* ── Auth routes (no layout) ── */}
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />

          {/* ── Dashboard ── */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="entrepreneur" element={<EntrepreneurDashboard />} />
            <Route path="investor"     element={<InvestorDashboard />} />
          </Route>

          {/* ── Profiles ── */}
          <Route path="/profile" element={<DashboardLayout />}>
            <Route path="entrepreneur/:id" element={<EntrepreneurProfile />} />
            <Route path="investor/:id"     element={<InvestorProfile />} />
          </Route>

          {/* ── Original features ── */}
          <Route path="/investors"     element={<DashboardLayout />}><Route index element={<InvestorsPage />} /></Route>
          <Route path="/entrepreneurs" element={<DashboardLayout />}><Route index element={<EntrepreneursPage />} /></Route>
          <Route path="/messages"      element={<DashboardLayout />}><Route index element={<MessagesPage />} /></Route>
          <Route path="/notifications" element={<DashboardLayout />}><Route index element={<NotificationsPage />} /></Route>
          <Route path="/documents"     element={<DashboardLayout />}><Route index element={<DocumentsPage />} /></Route>
          <Route path="/settings"      element={<DashboardLayout />}><Route index element={<SettingsPage />} /></Route>
          <Route path="/help"          element={<DashboardLayout />}><Route index element={<HelpPage />} /></Route>
          <Route path="/deals"         element={<DashboardLayout />}><Route index element={<DealsPage />} /></Route>

          {/* ── Chat ── */}
          <Route path="/chat" element={<DashboardLayout />}>
            <Route index       element={<ChatPage />} />
            <Route path=":userId" element={<ChatPage />} />
          </Route>

          {/* ── New features (Week 1–3) ── */}
          <Route path="/calendar"          element={<DashboardLayout />}><Route index element={<CalendarPage />} /></Route>
          <Route path="/video-call"        element={<DashboardLayout />}><Route index element={<VideoCallPage />} /></Route>
          <Route path="/document-chamber"  element={<DashboardLayout />}><Route index element={<DocumentChamberPage />} /></Route>
          <Route path="/payments"          element={<DashboardLayout />}><Route index element={<PaymentsPage />} /></Route>
          <Route path="/security"          element={<DashboardLayout />}><Route index element={<SecurityPage />} /></Route>

          {/* ── Fallback ── */}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*"  element={<Navigate to="/login" replace />} />
        </Routes>

        {/* Guided tour floats above everything when authenticated */}
        <GuidedTour />
      </Router>
    </AuthProvider>
  );
}

export default App;
