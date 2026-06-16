import GradientBackground from './components/GradientBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Milestones from './components/Milestones';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <GradientBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Milestones />
      </main>
      <Footer />
    </>
  );
}

export default App;
