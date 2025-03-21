
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import IndexPage from './pages/Index';
import MobilePlans from './pages/MobilePlans';
import InternetBoxes from './pages/InternetBoxes';
import Telephones from './pages/Telephones';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import Login from './pages/Login';
import Signup from './pages/Signup';
import KnowledgeBase from './pages/KnowledgeBase';
import AdminUsers from './pages/AdminUsers';
import CGV from './pages/CGV';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import PolitiqueCookies from './pages/PolitiqueCookies';
import MentionsLegales from './pages/MentionsLegales';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="mobile" element={<MobilePlans />} />
            <Route path="internet" element={<InternetBoxes />} />
            <Route path="telephones" element={<Telephones />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogArticle />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="admin/knowledge-base" element={
              <ProtectedRoute>
                <KnowledgeBase />
              </ProtectedRoute>
            } />
            <Route path="admin/users" element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="terms" element={<CGV />} />
            <Route path="privacy" element={<PolitiqueConfidentialite />} />
            <Route path="cookies" element={<PolitiqueCookies />} />
            <Route path="legal" element={<MentionsLegales />} />
            <Route path="sitemap" element={<Sitemap />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
