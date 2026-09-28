// Theme is a class on <html>. index.html sets it before first paint to avoid a flash;
// this module keeps React and localStorage in sync with it.
const KEY = 'theme';

export function getTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

const THEME_COLOR = { dark: '#1a0f2e', light: '#fbedf3' };

export function setTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  // Browser chrome (mobile address bar) follows the chosen theme, not just the OS setting.
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', THEME_COLOR[theme]));
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the class still applies for this visit.
  }
}
