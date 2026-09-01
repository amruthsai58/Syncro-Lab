import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavBar } from './components/NavBar';
import { LandingPage } from './pages/LandingPage';
import { ProblemCatalog } from './pages/ProblemCatalog';
import { WorkspacePage } from './pages/WorkspacePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { CertificatesPage } from './pages/CertificatesPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';
import { HexLoader } from './components/HexagonLogo';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-syncro-bg flex items-center justify-center">
        <HexLoader size={64} message="Entering SYNCRO LAB…" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppShell() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/problems" element={<ProtectedRoute><ProblemCatalog /></ProtectedRoute>} />
        <Route path="/problems/:slug" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
        <Route path="/verify/:code" element={<VerifyCertificatePage />} />
        <Route path="/v/:code" element={<VerifyCertificatePage />} />
        <Route path="/verify" element={<VerifyCertificatePage />} />
        <Route path="/certificates/verify/:code" element={<VerifyCertificatePage />} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
