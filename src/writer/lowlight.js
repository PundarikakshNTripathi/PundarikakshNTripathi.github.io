import { common, createLowlight } from 'lowlight';

// highlight.js "common" grammars plus the language names the picker offers.
export const lowlight = createLowlight(common);

export const LANGUAGES = [
  ['plaintext', 'Plain text'],
  ['python', 'Python'],
  ['cpp', 'C++'],
  ['c', 'C'],
  ['javascript', 'JavaScript'],
  ['typescript', 'TypeScript'],
  ['go', 'Go'],
  ['rust', 'Rust'],
  ['java', 'Java'],
  ['bash', 'Bash'],
  ['shell', 'Shell session'],
  ['sql', 'SQL'],
  ['json', 'JSON'],
  ['yaml', 'YAML'],
  ['markdown', 'Markdown'],
  ['xml', 'HTML / XML'],
  ['css', 'CSS'],
  ['makefile', 'Makefile'],
  ['diff', 'Diff'],
];
