
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import IndexPage from './pages/Index';
import MobilePlans from './pages/MobilePlans';
import InternetBoxes from './pages/InternetBoxes';
import Telephones from './pages/Telephones';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import KnowledgeBase from './pages/KnowledgeBase';
import AdminUsers from './pages/AdminUsers';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';
import CGV from './pages/CGV';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import PolitiqueCookies from './pages/PolitiqueCookies';
import MentionsLegales from './pages/MentionsLegales';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="mobile" element={<MobilePlans />} />
            <Route path="internet" element={<InternetBoxes />} />
            <Route path="telephones" element={<Telephones />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogArticle />} />
            <Route path="terms" element={<CGV />} />
            <Route path="privacy" element={<PolitiqueConfidentialite />} />
            <Route path="cookies" element={<PolitiqueCookies />} />
            <Route path="legal" element={<MentionsLegales />} />
            <Route path="sitemap" element={<Sitemap />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Routes d'authentification admin */}
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin/signup" element={<AdminSignup />} />
          
          {/* Routes admin protégées */}
          <Route path="admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
