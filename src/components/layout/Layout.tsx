
import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageBreadcrumb from '../navigation/PageBreadcrumb';
import { setupLazyLoading } from '@/utils/performance';

const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Setup performance optimizations on initial render
  useEffect(() => {
    // Initialize lazy loading for images
    setupLazyLoading();
    
    // Report web vitals metrics
    if ('performance' in window && 'PerformanceObserver' in window) {
      // FCP (First Contentful Paint)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log(`FCP: ${entry.startTime}ms`);
        }
      }).observe({ type: 'paint', buffered: true });
      
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log(`LCP: ${entry.startTime}ms`);
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      
      // CLS (Cumulative Layout Shift)
      new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log(`CLS: ${clsValue}`);
      }).observe({ type: 'layout-shift', buffered: true });
    }
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {!isHomePage && (
        <Suspense fallback={<div className="h-10 bg-background animate-pulse" />}>
          <PageBreadcrumb />
        </Suspense>
      )}
      <main className="flex-grow" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default React.memo(Layout);
