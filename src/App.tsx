
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from './components/layout/Layout';

// Eager load the index page for fast initial loading
import IndexPage from './pages/Index';

// Lazy load less critical routes
const MobilePlans = lazy(() => import('./pages/MobilePlans'));
const InternetBoxes = lazy(() => import('./pages/InternetBoxes'));
const Telephones = lazy(() => import('./pages/Telephones'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogArticle = lazy(() => import('./pages/BlogArticle'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));

// Lazy load infrequently accessed routes
const CGV = lazy(() => import('./pages/CGV'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const PolitiqueCookies = lazy(() => import('./pages/PolitiqueCookies'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <div className="App">
      <Suspense fallback={<LoadingIndicator />}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            
            {/* Major routes */}
            <Route path="mobile" element={
              <Suspense fallback={<LoadingIndicator />}>
                <MobilePlans />
              </Suspense>
            } />
            <Route path="internet" element={
              <Suspense fallback={<LoadingIndicator />}>
                <InternetBoxes />
              </Suspense>
            } />
            <Route path="telephones" element={
              <Suspense fallback={<LoadingIndicator />}>
                <Telephones />
              </Suspense>
            } />
            
            {/* Blog routes */}
            <Route path="blog" element={
              <Suspense fallback={<LoadingIndicator />}>
                <Blog />
              </Suspense>
            } />
            <Route path="blog/:slug" element={
              <Suspense fallback={<LoadingIndicator />}>
                <BlogArticle />
              </Suspense>
            } />
            
            {/* Admin routes */}
            <Route path="knowledge-base" element={
              <Suspense fallback={<LoadingIndicator />}>
                <KnowledgeBase />
              </Suspense>
            } />
            
            {/* Legal routes */}
            <Route path="terms" element={
              <Suspense fallback={<LoadingIndicator />}>
                <CGV />
              </Suspense>
            } />
            <Route path="privacy" element={
              <Suspense fallback={<LoadingIndicator />}>
                <PolitiqueConfidentialite />
              </Suspense>
            } />
            <Route path="cookies" element={
              <Suspense fallback={<LoadingIndicator />}>
                <PolitiqueCookies />
              </Suspense>
            } />
            <Route path="legal" element={
              <Suspense fallback={<LoadingIndicator />}>
                <MentionsLegales />
              </Suspense>
            } />
            <Route path="sitemap" element={
              <Suspense fallback={<LoadingIndicator />}>
                <Sitemap />
              </Suspense>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={
              <Suspense fallback={<LoadingIndicator />}>
                <NotFound />
              </Suspense>
            } />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
