# 🚀 Souraj Shil - Data Engineer Portfolio
> Personal developer portfolio showcasing production data pipelines, cloud architectures, and interactive visualizers.

A minimalist, high-performance developer portfolio featuring an **interactive ASCII Particle Avatar**, an **animated mathematical Fractal Tree canvas**, a **neural playground sandbox**, and a sleek cyberpunk / editorial aesthetic with full Dark and Light theme support.

---

## ✨ Features

- **✦ Interactive ASCII Particle Avatar:**
  - Real-time image-to-ASCII luminance sampling engine.
  - Hover cursor to disperse particles with elastic spring return physics.
  - One-click upload button to test any image or photo directly in the browser!
  - Switchable character glyph presets (*Classic, Binary, Matrix, Icons*).
- **🌿 Animated Fractal Tree Canvas (YouTube Demo Tribute):**
  - Recursive trigonometric branching botanic visualizer.
  - Harmonic wind sway physics with interactive cursor sway perturbation.
  - Floating blossom particles with color themes (*Cyber, Cherry, Emerald, Violet*).
  - Depth slider and Wind Gust trigger.
- **⚡ Neural Sandbox / Interactive Playground:**
  - Dynamic neural physics canvas where particles connect via synaptic laser lines.
  - Switchable force modes (*Attract, Repel, Vortex*) and Explode trigger.
- **🎨 Minimalist Developer Aesthetics:**
  - Sticky sidebar with active scroll-spy navigation.
  - Dark Mode & Light Mode with persistent `localStorage` preference.
  - High-contrast typography (`Fira Code`, `Space Grotesk`, `Inter`).
  - Filterable project gallery (*Creative, AI/ML, Full-Stack*) with detail modals.
  - Technical skills matrix and experience timeline.
- **⚡ 100% Configurable & Zero Build Friction:**
  - Single configuration file `js/config.js` to change all text, links, projects, and avatar.
  - Zero dependencies or complicated npm build steps required.

---

## 📁 Project Structure

```
personal-portfolio/
├── index.html              # Main single-page application structure
├── styles.css              # Custom styling, glow effects, theme variables & animations
├── README.md               # Quickstart and customization guide
└── js/
    ├── config.js           # ⚙️ YOUR DATA: Edit your name, bio, projects, experience & links here!
    ├── ascii-avatar.js     # ASCII physics canvas engine
    ├── fractal-tree.js     # Recursive fractal tree canvas engine
    ├── playground.js       # Neural sandbox interactive physics widget
    └── app.js              # Main coordinator (theme, filters, modals, scroll-spy)
```

---

## 🚀 Quick Start (Run Locally)

### Option 1: Direct in Browser
Double-click `index.html` to open it immediately in any browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Python Server (Recommended)
Open a terminal in the `personal-portfolio` folder and run:
```bash
# Python 3
python -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

---

## 🛠️ How to Customize Your Info

Everything on the website is controlled by **`js/config.js`**:

1. **Change Your Name, Title, and Bio:**
   Open `js/config.js` and edit the `personal` object:
   ```javascript
   personal: {
     name: "Your Name",
     title: "Software Engineer & AI Researcher",
     email: "your.email@example.com",
     avatarUrl: "https://your-photo-url.jpg" // or a local path like "./my-photo.jpg"
   }
   ```

2. **Update Social Links & Resume:**
   Edit the `socialLinks` array and `resumeUrl` in `js/config.js`.

3. **Add Your Work Experience & Education:**
   Edit the `experience` and `education` arrays in `js/config.js`.

4. **Add Your Projects:**
   Edit the `projects` array with your project titles, tags, demo URLs, and GitHub repository links.

5. **Update Skills:**
   Edit `skillCategories` in `js/config.js`.

---

## 🌐 Free 1-Click Deployment

### Deploy to GitHub Pages (Free)
1. Create a new repository on GitHub (e.g., `my-portfolio` or `username.github.io`).
2. Push all the files in this folder to the `main` branch.
3. Go to **Repository Settings -> Pages -> Source: Deploy from branch (`main` / root)**.
4. Your portfolio is live at `https://yourusername.github.io`!

### Deploy to Vercel / Netlify (Free)
- Drag and drop this folder directly into [Netlify Drop](https://app.netlify.com/drop) or import into [Vercel](https://vercel.com).
- No build command or output directory needed (it's a static site).

---

## 📜 Credits
- Fonts: Google Fonts ([Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [Fira Code](https://fonts.google.com/specimen/Fira+Code), [Inter](https://fonts.google.com/specimen/Inter))
- Icons: [Lucide Icons](https://lucide.dev)
