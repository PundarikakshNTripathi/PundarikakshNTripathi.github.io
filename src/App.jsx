import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Research from './components/Research';
import Projects from './components/Projects';
import Writing from './components/Writing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// The post reader and the editor pull in KaTeX and Jodit; keep them out of the home page bundle.
const BlogView = lazy(() => import('./components/BlogView'));
const WriterHome = lazy(() => import('./writer/WriterHome'));
const Writer = lazy(() => import('./writer/Writer'));

// On route change: go to the #section if there is one, otherwise to the top.
const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // Malformed escape in a shared link; fall back to the raw id instead of crashing.
      }
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

// Remount the boundary on navigation so one failed page doesn't stick.
const RouteBoundary = ({ children }) => {
  const { pathname } = useLocation();
  return <ErrorBoundary key={pathname}>{children}</ErrorBoundary>;
};

const Home = () => (
  <>
    <Hero />
    <About />
    <Work />
    <Research />
    <Projects />
    <Writing />
    <Contact />
  </>
);

// The editor is a distraction-free page with its own header, like Substack's.
const Chrome = ({ children }) => {
  const { pathname } = useLocation();
  return /^\/write\/.+/.test(pathname) ? null : children;
};

function App() {
  return (
    <Router>
      <ScrollManager />
      <Chrome>
        <Navbar />
      </Chrome>
      <main id="main">
        <RouteBoundary>
          <Suspense fallback={<div className="min-h-[60vh]" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog/:id" element={<BlogView />} />
              <Route path="/write" element={<WriterHome />} />
              <Route path="/write/:id" element={<Writer />} />
              <Route path="/admin" element={<Navigate to="/write" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteBoundary>
      </main>
      <Chrome>
        <Footer />
      </Chrome>
    </Router>
  );
}

const NotFound = () => (
  <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
    <h1 className="display text-5xl">Nothing at this address.</h1>
    <p className="prose-serif mt-6">
      The page may have moved. <a href="/" className="link">Go to the home page</a>.
    </p>
  </section>
);

export default App;
