# Pundarikaksh Narayan Tripathi - Portfolio

A lightning-fast, responsive static personal portfolio built to bridge foundational Artificial Intelligence research with High-Performance Computing infrastructure.

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React + Custom SVGs
- **Typography**: Inter (Sans) + JetBrains Mono (Monospace)
- **Design System**: Custom glassmorphism components with soft pastel accents (Lavender, Pink, Mauve) over a deep dark background.

## Local Development & Testing

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

## Git Strategy

This repository strictly follows a Trunk-Based Feature Flow branching strategy combined with Conventional Commits:

- `main`: Immutable production branch.
- `develop`: Integration and staging branch.
- Supporting branches (`feat/*`, `fix/*`, `chore/*`, `docs/*`): Branched off `develop` and merged back into `develop` before cutting releases to `main`.

## Deployment

This is a fully static website and is configured to be deployed entirely for free on **GitHub Pages**.

### Deploying to GitHub Pages (Free Subdomain)
You can deploy your portfolio directly from this repository. Your site will be hosted at `https://pundarikakshntripathi.github.io/portfolio/`.

Because the `.github/workflows/deploy.yml` file is already fully set up and configured for Vite, deploying is incredibly simple:

1. Go to your GitHub repository on the web.
2. Click on **Settings**.
3. On the left sidebar, scroll down and click on **Pages**.
4. Under **Build and deployment**, look for the **Source** dropdown.
5. Change the source from "Deploy from a branch" to **GitHub Actions**.
6. **That's it!** You do **not** need to click on "Jekyll" or "Static HTML" or configure anything else. GitHub will automatically detect the `deploy.yml` file I created and start building your site.
7. Wait a couple of minutes, and your site will be live.
8. **Note on Custom Domains and HTTPS:** You do not need to add a custom domain (leave it blank), and GitHub automatically enforces HTTPS encryption for you.

## Security Features

To ensure you can develop on this project safely from any device without worrying about dependency vulnerabilities or malicious scripts, several strict security measures have been configured:

1. **Husky Pre-commit Hooks (`.husky/pre-commit`)**: 
   - Every time you attempt to run `git commit`, Husky intercepts it and runs `npm audit --audit-level=high`.
   - If any high-severity vulnerabilities are found in your installed packages, the commit will be blocked, protecting you from pushing vulnerable code.
   - *Note: Because `.husky/` is tracked in Git, this protection works on any device you clone the repo to.*

2. **Strict NPM Configuration (`.npmrc`)**:
   - `audit=true`: Forces NPM to automatically audit packages every time you install something.
   - `strict-peer-deps=true`: Prevents NPM from installing incompatible or conflicting package versions.
   - `save-exact=true`: Forces NPM to save exact version numbers in `package.json` (e.g., `1.2.3` instead of `^1.2.3`). This prevents unexpected malware from sneaking in via automatic minor/patch updates.

3. **Automated Dependabot (`.github/dependabot.yml`)**:
   - GitHub will automatically scan your `package.json` and GitHub Actions weekly.
   - If a security patch is released for any of your dependencies, GitHub will automatically create a Pull Request to update it safely.

## Features & Architecture

### Resume Hosting
The resume download feature does **not** require a database or backend. The resumes are hosted statically within the application. 
- Place your PDF resumes in the `public/resume/` directory.
- The app links directly to these static files (e.g., `/resume/Pundarikaksh_Narayan_Tripathi_Research_Resume.pdf`).
- When a user clicks download, the browser simply fetches the static PDF file.

### Contact Form
The "Contact Me" form uses [EmailJS](https://www.emailjs.com/) to send emails directly to your inbox without requiring a backend server or database.
- The `src/components/Hero.jsx` component is already integrated with the `@emailjs/browser` SDK.
- You simply need to provide your `SERVICE_ID`, `TEMPLATE_ID`, and `PUBLIC_KEY`.
- This ensures the website remains 100% static, fast, and free to host!
