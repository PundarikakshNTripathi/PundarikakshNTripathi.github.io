// Theme is a class on <html>. index.html sets it before first paint to avoid a flash;
// this module keeps React and localStorage in sync with it.
const KEY = 'theme';

export function getTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function setTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the class still applies for this visit.
  }
}
