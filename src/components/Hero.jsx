import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, FileText, Send, Download, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { socialLinks } from '../data/content';

// Custom SVG icons for all social platforms
const LinkedInIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const XIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const KaggleIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.095.034.18-.035.248l-6.555 6.344 6.836 8.507c.095.118.117.21.074.352z" />
  </svg>
);

const HuggingFaceIcon = ({ size = 28 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-9c.83 0 1.5-.67 1.5-1.5S9.83 8 9 8s-1.5.67-1.5 1.5S8.17 11 9 11zm6 0c.83 0 1.5-.67 1.5-1.5S15.83 8 15 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-3 5.5c-2.33 0-4.32-1.45-5.12-3.5h10.24c-.8 2.05-2.79 3.5-5.12 3.5zM3 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm18 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const customIcons = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  'x-twitter': XIcon,
  kaggle: KaggleIcon,
  huggingface: HuggingFaceIcon,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Hero = () => {
  const [activeMenu, setActiveMenu] = useState(null); // 'resume', 'contact', or null
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleMenuToggle = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
    if (menu !== 'contact') {
      setSubmitStatus(null);
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // IMPORTANT: Replace these with your actual EmailJS credentials
    const serviceID = 'service_74o81x1';
    const templateID = 'template_27u1v0o';
    const publicKey = 'yVSScP3UIh4EX4ibz';

    if (serviceID === 'YOUR_SERVICE_ID') {
      alert('Please configure your EmailJS credentials in Hero.jsx');
      setIsSubmitting(false);
      return;
    }

    emailjs.sendForm(serviceID, templateID, formRef.current, publicKey)
      .then((result) => {
          setSubmitStatus('success');
          setIsSubmitting(false);
          setTimeout(() => {
            setActiveMenu(null);
            setSubmitStatus(null);
            e.target.reset();
          }, 2000);
      }, (error) => {
          console.error(error.text);
          setSubmitStatus('error');
          setIsSubmitting(false);
      });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center max-w-4xl"
      >
        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lavender/20 bg-lavender/5 font-mono text-sm font-semibold tracking-widest uppercase text-lavender">
            <span className="h-1.5 w-1.5 rounded-full bg-lavender animate-pulse" />
            AI & HPC Research
          </span>
        </motion.div>

        {/* Profile Picture */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
            <img 
              src={`${import.meta.env.BASE_URL}my-picture.png`} 
              alt="Pundarikaksh Narayan Tripathi" 
              className="w-full h-full object-cover object-top rounded-full border-4 border-border shadow-[4px_4px_0px_var(--color-border)]"
            />
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="block text-text-primary">Pundarikaksh</span>
          <span className="block gradient-text mt-1">Narayan Tripathi</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="max-w-xl text-base sm:text-lg text-text-secondary leading-relaxed mb-10"
        >
          Bridging foundational Artificial Intelligence research with{' '}
          <span className="text-lavender font-medium">High-Performance Computing</span>{' '}
          infrastructure.
        </motion.p>

        {/* Social Links & Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((link) => {
              const CustomIcon = link.customSvg ? customIcons[link.id] : null;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-xl border border-border bg-bg-card/50 backdrop-blur-sm text-text-secondary hover:text-lavender hover:border-lavender/30 hover:bg-lavender/5 transition-all duration-300"
                  id={`social-${link.id}`}
                  aria-label={link.label}
                >
                  {link.Icon ? (
                    <link.Icon size={28} />
                  ) : CustomIcon ? (
                    <CustomIcon size={28} />
                  ) : null}
                  {/* Tooltip */}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono text-lavender bg-bg-secondary/90 border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {link.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <button
              onClick={() => handleMenuToggle('resume')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-bg-card text-text-primary hover:text-lavender hover:border-lavender/50 hover:bg-lavender/10 transition-all font-medium text-sm sm:text-base cursor-pointer"
            >
              <Download size={18} />
              Download Resume
            </button>
            <button
              onClick={() => handleMenuToggle('contact')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-transparent bg-text-primary text-bg-primary hover:bg-lavender transition-all font-medium text-sm sm:text-base cursor-pointer"
            >
              <Send size={18} />
              Contact Me
            </button>
          </div>

          {/* Expandable Menus */}
          <AnimatePresence>
            {activeMenu === 'resume' && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="w-full max-w-sm overflow-hidden"
              >
                <div className="mt-4 p-4 rounded-xl border border-border bg-bg-card/80 backdrop-blur-md flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-text-primary">Select Resume Version</span>
                    <button onClick={() => setActiveMenu(null)} className="text-text-muted hover:text-pink transition-colors cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>
                  <a
                    href={`${import.meta.env.BASE_URL}resume/Pundarikaksh_Narayan_Tripathi_Research_Resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-lavender/50 hover:bg-lavender/5 transition-colors group text-left"
                  >
                    <div className="p-2 rounded bg-lavender/10 text-lavender group-hover:bg-lavender group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary group-hover:text-lavender transition-colors">Research Resume</div>
                      <div className="text-xs text-text-muted">Focus on publications & academic work</div>
                    </div>
                  </a>
                  <a
                    href={`${import.meta.env.BASE_URL}resume/Pundarikaksh_Narayan_Tripathi_Corporate_Resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-pink/50 hover:bg-pink/5 transition-colors group text-left"
                  >
                    <div className="p-2 rounded bg-pink/10 text-pink group-hover:bg-pink group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary group-hover:text-pink transition-colors">Corporate Resume</div>
                      <div className="text-xs text-text-muted">Focus on engineering & development</div>
                    </div>
                  </a>
                </div>
              </motion.div>
            )}

            {activeMenu === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="w-full max-w-sm overflow-hidden"
              >
                <form
                  ref={formRef}
                  className="mt-4 p-5 rounded-xl border border-border bg-bg-card/80 backdrop-blur-md flex flex-col gap-4 text-left"
                  onSubmit={sendEmail}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-text-primary">Send me a message</span>
                    <button type="button" onClick={() => setActiveMenu(null)} className="text-text-muted hover:text-pink transition-colors cursor-pointer">
                      <X size={16} />
                    </button>
                  </div>
                  <div>
                    <label htmlFor="user_name" className="block text-xs font-medium text-text-secondary mb-1">Name</label>
                    <input type="text" name="user_name" id="user_name" required className="w-full px-3 py-2 rounded-lg border border-border bg-bg-primary text-sm text-text-primary focus:outline-none focus:border-lavender focus:ring-1 focus:ring-lavender transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label htmlFor="user_email" className="block text-xs font-medium text-text-secondary mb-1">Email</label>
                    <input type="email" name="user_email" id="user_email" required className="w-full px-3 py-2 rounded-lg border border-border bg-bg-primary text-sm text-text-primary focus:outline-none focus:border-lavender focus:ring-1 focus:ring-lavender transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-text-secondary mb-1">Message</label>
                    <textarea name="message" id="message" required rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-bg-primary text-sm text-text-primary focus:outline-none focus:border-lavender focus:ring-1 focus:ring-lavender transition-all resize-none" placeholder="Hello..." />
                  </div>
                  {submitStatus === 'error' && (
                    <p className="text-xs text-pink">Something went wrong. Please try again.</p>
                  )}
                  <button 
                    type="submit" 
                    disabled={isSubmitting || submitStatus === 'success'} 
                    className={`w-full py-2.5 rounded-lg transition-colors text-sm font-medium cursor-pointer ${
                      submitStatus === 'success' 
                        ? 'bg-lavender text-white' 
                        : 'bg-text-primary text-bg-primary hover:bg-lavender disabled:opacity-70 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Message Sent!' : 'Send Message'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


      </motion.div>


    </section>
  );
};

export default Hero;
