// Drafts are kept in IndexedDB rather than localStorage: images and GIFs are stored inline
// while drafting, and localStorage tops out around 5 MB. Nothing here leaves the browser.

const DB = 'portfolio-writer';
const VERSION = 1;

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('drafts')) db.createObjectStore('drafts', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run(store, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const result = fn(tx.objectStore(store));
    tx.oncomplete = () => resolve(result?.result ?? result);
    tx.onerror = () => reject(tx.error);
  });
}

export const listDrafts = async () => {
  const all = await run('drafts', 'readonly', (s) => s.getAll());
  return (all || []).sort((a, b) => (b.updated || '').localeCompare(a.updated || ''));
};
export const getDraft = (id) => run('drafts', 'readonly', (s) => s.get(id));
export const saveDraft = (draft) => run('drafts', 'readwrite', (s) => s.put({ ...draft, updated: new Date().toISOString() }));
export const deleteDraft = (id) => run('drafts', 'readwrite', (s) => s.delete(id));

export const getSetting = (key) => run('settings', 'readonly', (s) => s.get(key));
export const setSetting = (key, value) => run('settings', 'readwrite', (s) => s.put(value, key));

export const newDraft = () => ({
  id: String(Date.now()),
  title: '',
  subtitle: '',
  slug: '',
  description: '',
  tags: [],
  pinned: false,
  cover: null,
  date: new Date().toISOString(),
  html: '',
});

// One-time import of drafts from the old localStorage editor.
export async function migrateLegacyDrafts(normalise) {
  let legacy;
  try {
    legacy = JSON.parse(localStorage.getItem('portfolio_blogs') || '[]');
  } catch {
    return 0;
  }
  if (!Array.isArray(legacy) || legacy.length === 0) return 0;
  for (const post of legacy) await saveDraft({ ...newDraft(), ...normalise(post), id: String(post.id) });
  localStorage.removeItem('portfolio_blogs');
  return legacy.length;
}
