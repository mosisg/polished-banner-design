import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Analytics } from "@vercel/analytics/react";
import KnowledgeBase from '@/pages/KnowledgeBase';
import AdminUsers from '@/pages/AdminUsers';
import Login from '@/pages/Login';
import { AuthProvider } from '@/contexts/AuthContext';

// Optimize lazy loading by using named chunks
const Index = lazy(() => import(/* webpackChunkName: "index" */ "./pages/Index"));
const MobilePlans = lazy(() => import(/* webpackChunkName: "mobile" */ "./pages/MobilePlans"));
const InternetBoxes = lazy(() => import(/* webpackChunkName: "internet" */ "./pages/InternetBoxes"));
const Telephones = lazy(() => import(/* webpackChunkName: "telephones" */ "./pages/Telephones"));
const Blog = lazy(() => import(/* webpackChunkName: "blog" */ "./pages/Blog"));
const BlogArticle = lazy(() => import(/* webpackChunkName: "blog-article" */ "./pages/BlogArticle"));

// Group less frequently used pages in one chunk
const PolitiqueConfidentialite = lazy(() => 
  import(/* webpackChunkName: "legal-pages" */ "./pages/PolitiqueConfidentialite"));
const PolitiqueCookies = lazy(() => 
  import(/* webpackChunkName: "legal-pages" */ "./pages/PolitiqueCookies"));
const MentionsLegales = lazy(() => 
  import(/* webpackChunkName: "legal-pages" */ "./pages/MentionsLegales"));
const CGV = lazy(() => 
  import(/* webpackChunkName: "legal-pages" */ "./pages/CGV"));
const NotFound = lazy(() => 
  import(/* webpackChunkName: "not-found" */ "./pages/NotFound"));
const Sitemap = lazy(() => 
  import(/* webpackChunkName: "sitemap" */ "./pages/Sitemap"));

// Improved page loader with a more lightweight design
const PageLoader = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="space-y-4 w-full max-w-md p-8">
      <Skeleton className="h-10 w-3/4 mx-auto" />
      <Skeleton className="h-64 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  </div>
);

// Configure Query Client with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (replaces cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Component to handle scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Router>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/mobile" element={<MobilePlans />} />
                  <Route path="/internet" element={<InternetBoxes />} />
                  <Route path="/telephones" element={<Telephones />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogArticle />} />
                  <Route path="/packages" element={<NotFound />} />
                  
                  {/* Policy Pages */}
                  <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                  <Route path="/politique-cookies" element={<PolitiqueCookies />} />
                  <Route path="/mentions-legales" element={<MentionsLegales />} />
                  <Route path="/cgv" element={<CGV />} />
                  
                  {/* Sitemap routes */}
                  <Route path="/sitemap.xml" element={<Sitemap />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/knowledge-base" element={<KnowledgeBase />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
          <Analytics />
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
