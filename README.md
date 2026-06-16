# Pundarikaksh Narayan Tripathi - Portfolio

A lightning-fast, responsive static personal portfolio built to bridge foundational Artificial Intelligence research with High-Performance Computing infrastructure.

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React + Custom SVGs
- **Typography**: Inter (Sans) + JetBrains Mono (Monospace)
- **Design System**: Custom glassmorphism components with soft pastel accents (Lavender, Pink, Mauve) over a deep dark background.

## 🚀 Local Development & Testing

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/PundarikakshNTripathi/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**:
   Ensure you have Node.js (v18+) installed.
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   This will spin up a local server (typically at `http://localhost:5173`). Open this URL in your browser to test the interactive features and animations.

4. **Test the Production Build**:
   To ensure the app builds successfully and to preview the optimized version:
   ```bash
   npm run build
   npm run preview
   ```

## 🏗 Git Strategy

This repository strictly follows a Trunk-Based Feature Flow branching strategy combined with Conventional Commits:

- `main`: Immutable production branch.
- `develop`: Integration and staging branch.
- Supporting branches (`feat/*`, `fix/*`, `chore/*`, `docs/*`): Branched off `develop` and merged back into `develop` before cutting releases to `main`.

## 🌐 Deployment

This is a fully static website and can be deployed entirely for free on platforms like **Vercel**, **Netlify**, or **GitHub Pages**.

### Deploying to Vercel (Recommended)
1. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
2. Click **Add New Project**.
3. Import your `portfolio` repository.
4. Vercel will automatically detect Vite. Leave the default build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**. Your site will be live on a free `.vercel.app` domain with an SSL certificate.

### Deploying to Netlify
1. Go to [Netlify](https://www.netlify.com/) and log in with GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Select your `portfolio` repository.
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**.
