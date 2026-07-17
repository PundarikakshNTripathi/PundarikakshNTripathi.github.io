import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GradientBackground from './components/GradientBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WorkExperience from './components/WorkExperience';
import Research from './components/Research';
import Projects from './components/Projects';
import Milestones from './components/Milestones';
import Footer from './components/Footer';
import ScrollIndicator from './components/ScrollIndicator';
import Contact from './components/Contact';
import Blog from './components/Blog';
import BlogView from './components/BlogView';
import BlogAdmin from './components/BlogAdmin';

const PortfolioHome = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <About />
      <WorkExperience />
      <Research />
      <Projects />
      <Milestones />
      <Blog />
    </main>
    <Contact />
    <Footer />
    <ScrollIndicator />
  </>
);

function App() {
  return (
    <Router>
      <GradientBackground />
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/blog/:id" element={<BlogView />} />
        <Route path="/admin" element={<BlogAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
