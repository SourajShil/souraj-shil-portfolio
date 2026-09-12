/**
 * =========================================================================
 * MAIN APPLICATION SCRIPT (app.js) - SOURAJ SHIL DATA PORTFOLIO
 * =========================================================================
 * Coordinates UI rendering, visualizers, theme management, scroll-spy,
 * project filters, certifications, modals, and user interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.PORTFOLIO_CONFIG || {};

  // Global visualizer instances
  let asciiEngine = null;
  let fractalEngine = null;
  let playgroundEngine = null;
  let currentVisualizerMode = "ascii";

  // -----------------------------------------------------------------------
  // 1. INITIALIZE & POPULATE UI FROM CONFIG
  // -----------------------------------------------------------------------
  function populateProfile() {
    const p = config.personal || {};

    // Names & Titles
    document.title = `${p.name || "Souraj Shil"} | ${p.title || "Data Engineer"}`;
    setText("sidebar-name", p.name);
    setText("mobile-nav-name", p.name);
    setText("hero-name", p.name || "Souraj Shil");
    setText("sidebar-title", p.title);
    setText("hero-greeting", p.greeting || "Hi, I'm");
    setText("sidebar-status", p.status?.text || "Open to Data Engineering job roles");
    setText("hero-location", p.location || "Belonia, South Tripura, India");
    setText("contact-location-text", p.location || "Belonia, South Tripura, India");
    setText("contact-email-text", p.email || "sourajshil@gmail.com");

    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Resume Button Link
    const resumeBtn = document.getElementById("resume-btn");
    if (resumeBtn && p.resumeUrl) {
      resumeBtn.href = p.resumeUrl;
    }

    // Hero short bio
    const heroBio = document.getElementById("hero-bio-short");
    if (heroBio && p.about?.paragraphs?.length > 0) {
      heroBio.textContent = p.about.paragraphs[0];
    }

    // About Paragraphs
    const aboutContainer = document.getElementById("about-paragraphs-container");
    if (aboutContainer && p.about?.paragraphs) {
      aboutContainer.innerHTML = p.about.paragraphs
        .map((para) => `<p class="leading-relaxed">${para}</p>`)
        .join("");
    }

    // About Highlights
    const highlightsContainer = document.getElementById("about-highlights-container");
    if (highlightsContainer && p.about?.highlights) {
      highlightsContainer.innerHTML = p.about.highlights
        .map(
          (h) => `
          <div class="glass-panel p-4 rounded-xl text-center space-y-1 hover:border-emerald-500/40 transition-colors">
            <div class="text-2xl font-heading font-bold text-emerald-400">${h.value}</div>
            <div class="text-xs font-mono text-slate-400">${h.label}</div>
          </div>
        `
        )
        .join("");
    }
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text !== undefined) el.textContent = text;
  }

  // -----------------------------------------------------------------------
  // 2. SOCIAL LINKS RENDERING
  // -----------------------------------------------------------------------
  function populateSocialLinks() {
    const socials = config.socialLinks || [];

    const getSvgIcon = (iconName, sizeClass = "w-4 h-4") => {
      const key = (iconName || "").toLowerCase();
      if (key === "github") {
        return `<svg class="${sizeClass} fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`;
      }
      if (key === "linkedin") {
        return `<svg class="${sizeClass} fill-current shrink-0" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
      }
      return `<svg class="${sizeClass} shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`;
    };

    const makeSocialHtml = (s) => `
      <a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.name}" class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700/60 transition-all hover:scale-105 inline-flex items-center justify-center" title="${s.name}">
        ${getSvgIcon(s.icon, "w-4 h-4")}
      </a>
    `;

    const sidebarContainer = document.getElementById("sidebar-social-container");
    if (sidebarContainer) {
      sidebarContainer.innerHTML = socials.map(makeSocialHtml).join("");
    }

    const mobileContainer = document.getElementById("mobile-social-container");
    if (mobileContainer) {
      mobileContainer.innerHTML = socials.map(makeSocialHtml).join("");
    }

    const contactContainer = document.getElementById("contact-social-container");
    if (contactContainer) {
      contactContainer.innerHTML = socials
        .map(
          (s) => `
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 text-xs font-mono transition-all">
            ${getSvgIcon(s.icon, "w-4 h-4")}
            <span>${s.name}</span>
          </a>
        `
        )
        .join("");
    }
  }

  // -----------------------------------------------------------------------
  // 3. EXPERIENCE & EDUCATION RENDERING
  // -----------------------------------------------------------------------
  function populateExperienceAndEducation() {
    const expList = config.experience || [];
    const expContainer = document.getElementById("experience-list-container");

    if (expContainer) {
      expContainer.innerHTML = expList
        .map(
          (exp) => `
        <div class="glass-panel p-6 rounded-2xl space-y-4 hover:border-cyan-500/40 transition-colors">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 class="text-xl font-heading font-bold text-white">${exp.role}</h3>
              <div class="flex items-center gap-2 text-sm text-cyan-400 font-mono">
                <span>${exp.company}</span>
                <span>&bull;</span>
                <span class="text-slate-400 text-xs">${exp.location}</span>
              </div>
            </div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-slate-300 self-start sm:self-auto">
              <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>${exp.period}</span>
            </div>
          </div>

          <p class="text-sm text-slate-300">${exp.description}</p>

          <ul class="space-y-1.5 list-disc list-inside text-sm text-slate-400 leading-relaxed">
            ${(exp.bullets || []).map((b) => `<li>${b}</li>`).join("")}
          </ul>

          <div class="flex flex-wrap gap-1.5 pt-2">
            ${(exp.skills || []).map((s) => `<span class="tech-badge">${s}</span>`).join("")}
          </div>
        </div>
      `
        )
        .join("");
    }

    const eduList = config.education || [];
    const eduContainer = document.getElementById("education-list-container");

    if (eduContainer) {
      eduContainer.innerHTML = eduList
        .map(
          (edu) => `
        <div class="glass-panel p-5 rounded-xl space-y-2 hover:border-emerald-500/40 transition-colors">
          <div class="text-xs font-mono text-emerald-400">${edu.period}</div>
          <h4 class="font-heading font-bold text-white text-base">${edu.degree}</h4>
          <div class="text-xs text-slate-400 font-mono">${edu.institution} &bull; ${edu.location}</div>
          <p class="text-xs text-slate-300 pt-1 leading-relaxed">${edu.highlights}</p>
        </div>
      `
        )
        .join("");
    }
  }

  // -----------------------------------------------------------------------
  // 4. PROJECTS GALLERY RENDERING & FILTERING
  // -----------------------------------------------------------------------
  function populateProjects(categoryFilter = "all") {
    const projects = config.projects || [];
    const container = document.getElementById("projects-grid-container");
    if (!container) return;

    const filtered = categoryFilter === "all"
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());

    container.innerHTML = filtered
      .map(
        (p) => `
      <div class="project-card glass-panel rounded-2xl overflow-hidden flex flex-col justify-between group">
        <div>
          <!-- Project Preview Image -->
          <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
            <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            <div class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[11px] font-mono text-emerald-400">
              ${p.category}
            </div>
          </div>

          <!-- Project Body -->
          <div class="p-5 sm:p-6 space-y-3">
            <div>
              <h3 class="text-xl font-heading font-bold text-white group-hover:text-cyan-400 transition-colors">${p.title}</h3>
              <p class="text-xs font-mono text-slate-400">${p.subtitle || ""}</p>
            </div>

            <p class="text-sm text-slate-300 leading-relaxed line-clamp-3">${p.description}</p>

            <!-- Tech Badges -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${(p.tags || []).map((t) => `<span class="tech-badge">${t}</span>`).join("")}
            </div>
          </div>
        </div>

        <!-- Project Footer Actions -->
        <div class="p-5 sm:p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-800/60 mt-4">
          <button class="open-project-modal text-xs font-mono text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors" data-id="${p.id}">
            <i data-lucide="info" class="w-3.5 h-3.5"></i>
            <span>Architecture &amp; Details</span>
          </button>

          <div class="flex items-center gap-2">
            ${
              p.githubUrl
                ? `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="GitHub Code"><i data-lucide="github" class="w-4 h-4"></i></a>`
                : ""
            }
            ${
              p.demoUrl
                ? `<a href="${p.demoUrl}" ${p.demoUrl.startsWith("#") ? "" : 'target="_blank" rel="noopener noreferrer"'} class="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"><i data-lucide="external-link" class="w-3.5 h-3.5"></i><span>Pipeline Flow</span></a>`
                : ""
            }
          </div>
        </div>
      </div>
    `
      )
      .join("");

    if (window.lucide) window.lucide.createIcons();
    attachModalHandlers();
  }

  function setupProjectFilters() {
    const filterButtons = document.querySelectorAll(".project-filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => {
          b.classList.remove("active", "bg-emerald-500/20", "text-emerald-300", "border-emerald-500/40");
          b.classList.add("text-slate-400");
        });
        btn.classList.add("active", "bg-emerald-500/20", "text-emerald-300", "border-emerald-500/40");
        btn.classList.remove("text-slate-400");

        const category = btn.getAttribute("data-category");
        populateProjects(category);
      });
    });
  }

  // -----------------------------------------------------------------------
  // 5. PROJECT DETAILS MODAL
  // -----------------------------------------------------------------------
  function attachModalHandlers() {
    const modal = document.getElementById("project-modal");
    const openBtns = document.querySelectorAll(".open-project-modal");
    const closeBtn = document.getElementById("modal-close-btn");

    openBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const project = (config.projects || []).find((p) => p.id === id);
        if (!project || !modal) return;

        setText("modal-category", project.category);
        setText("modal-title", project.title);
        setText("modal-subtitle", project.subtitle);
        setText("modal-description", project.description);

        const img = document.getElementById("modal-image");
        if (img) img.src = project.image;

        const bulletsContainer = document.getElementById("modal-bullets");
        if (bulletsContainer) {
          bulletsContainer.innerHTML = (project.bullets || [])
            .map((b) => `<li>${b}</li>`)
            .join("");
        }

        const tagsContainer = document.getElementById("modal-tags");
        if (tagsContainer) {
          tagsContainer.innerHTML = (project.tags || [])
            .map((t) => `<span class="tech-badge">${t}</span>`)
            .join("");
        }

        const demoBtn = document.getElementById("modal-demo-btn");
        if (demoBtn) {
          demoBtn.href = project.demoUrl || "#";
          demoBtn.style.display = project.demoUrl ? "flex" : "none";
        }

        const githubBtn = document.getElementById("modal-github-btn");
        if (githubBtn) {
          githubBtn.href = project.githubUrl || "#";
          githubBtn.style.display = project.githubUrl ? "flex" : "none";
        }

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        if (window.lucide) window.lucide.createIcons();
      });
    });

    const closeModal = () => {
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // -----------------------------------------------------------------------
  // 6. TECHNICAL SKILLS RENDERING
  // -----------------------------------------------------------------------
  function populateSkills() {
    const categories = config.skillCategories || [];
    const container = document.getElementById("skills-grid-container");
    if (!container) return;

    const iconFallbacks = {
      code: "code",
      terminal: "terminal",
      cpu: "cpu",
      server: "server",
      database: "database",
      layout: "layout",
      layers: "layers",
      palette: "palette",
      sparkles: "sparkles",
      box: "box",
      activity: "activity",
      zap: "zap",
      flame: "flame",
      "git-commit": "git-commit",
      brain: "brain",
      "git-branch": "git-branch",
      eye: "eye",
      compass: "compass",
      cloud: "cloud",
      shield: "shield",
      table: "table",
      "check-circle": "check-circle"
    };

    container.innerHTML = categories
      .map(
        (cat) => `
      <div class="glass-panel p-5 rounded-2xl space-y-4 hover:border-emerald-500/40 transition-colors">
        <h3 class="font-heading font-bold text-white text-lg flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>${cat.name}</span>
        </h3>
        <div class="space-y-2.5">
          ${(cat.skills || [])
            .map(
              (s) => `
            <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div class="flex items-center gap-2.5 text-xs font-mono text-slate-200">
                <i data-lucide="${iconFallbacks[s.icon] || 'check-circle'}" class="w-4 h-4 text-emerald-400"></i>
                <span>${s.name}</span>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded border ${
                s.level === 'Intermediate'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700/60'
              }">${s.level}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("");
  }

  // -----------------------------------------------------------------------
  // 7. CERTIFICATIONS RENDERING
  // -----------------------------------------------------------------------
  function populateCertifications() {
    const certs = config.certifications || [];
    const container = document.getElementById("certifications-grid-container");
    if (!container) return;

    container.innerHTML = certs
      .map(
        (c) => `
      <div class="glass-panel p-4 rounded-xl flex items-start gap-3 hover:border-emerald-500/40 transition-colors">
        <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
          <i data-lucide="${c.icon || 'award'}" class="w-5 h-5"></i>
        </div>
        <div class="space-y-1 min-w-0">
          <div class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700 inline-block">${c.badge}</div>
          <h4 class="font-heading font-semibold text-slate-100 text-sm leading-snug">${c.title}</h4>
          <div class="text-xs font-mono text-slate-400">${c.issuer}</div>
        </div>
      </div>
    `
      )
      .join("");
  }

  // -----------------------------------------------------------------------
  // 8. TYPEWRITER ANIMATION
  // -----------------------------------------------------------------------
  function initTypewriter() {
    const roles = config.personal?.typewriterRoles || ["Data Engineer", "PySpark & Big Data Specialist"];
    const el = document.getElementById("typewriter-text");
    if (!el || roles.length === 0) return;

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function type() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        el.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 45;
      } else {
        el.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        typeSpeed = 1800; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 450; // Pause before next word
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  // -----------------------------------------------------------------------
  // 9. FRACTAL TREE VISUALIZER
  // -----------------------------------------------------------------------
  function initVisualizers() {
    const fractalCanvas = document.getElementById("fractal-canvas");
    if (fractalCanvas && window.FractalTreeEngine) {
      fractalEngine = new window.FractalTreeEngine("fractal-canvas");
      fractalEngine.start();
    }
  }

  // -----------------------------------------------------------------------
  // 10. NEURAL PLAYGROUND INITIALIZATION
  // -----------------------------------------------------------------------
  function initPlayground() {
    const pgCanvas = document.getElementById("playground-canvas");
    if (!pgCanvas || !window.NeuralPlayground) return;

    playgroundEngine = new window.NeuralPlayground("playground-canvas");

    const modeBtns = document.querySelectorAll(".pg-mode-btn");
    modeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        modeBtns.forEach((b) => {
          b.classList.remove("active", "text-cyan-300");
          b.classList.add("text-slate-400");
        });
        btn.classList.add("active", "text-cyan-300");
        btn.classList.remove("text-slate-400");
        const mode = btn.getAttribute("data-mode");
        if (playgroundEngine) playgroundEngine.setMode(mode);
      });
    });

    const explodeBtn = document.getElementById("btn-pg-explode");
    if (explodeBtn && playgroundEngine) {
      explodeBtn.addEventListener("click", () => playgroundEngine.explode());
    }

    const resetBtn = document.getElementById("btn-pg-reset");
    if (resetBtn && playgroundEngine) {
      resetBtn.addEventListener("click", () => playgroundEngine.reset());
    }
  }

  // -----------------------------------------------------------------------
  // 11. THEME SWITCHER (Dark / Light Mode)
  // -----------------------------------------------------------------------
  function initTheme() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("portfolio-theme") || config.visualizer?.defaultTheme || "dark";

    if (savedTheme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      html.classList.add("dark");
      html.classList.remove("light");
    }

    updateThemeIcons();

    const toggleDesktop = document.getElementById("theme-toggle-desktop");
    const toggleMobile = document.getElementById("theme-toggle-mobile");

    const toggle = () => {
      if (html.classList.contains("dark")) {
        html.classList.remove("dark");
        html.classList.add("light");
        localStorage.setItem("portfolio-theme", "light");
      } else {
        html.classList.add("dark");
        html.classList.remove("light");
        localStorage.setItem("portfolio-theme", "dark");
      }
      updateThemeIcons();
    };

    if (toggleDesktop) toggleDesktop.addEventListener("click", toggle);
    if (toggleMobile) toggleMobile.addEventListener("click", toggle);
  }

  function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains("dark");
    document.querySelectorAll(".dark-icon").forEach((el) => {
      el.style.display = isDark ? "block" : "none";
    });
    document.querySelectorAll(".light-icon").forEach((el) => {
      el.style.display = isDark ? "none" : "block";
    });
    if (window.lucide) window.lucide.createIcons();
  }

  // -----------------------------------------------------------------------
  // 12. SCROLL-SPY NAVIGATION
  // -----------------------------------------------------------------------
  function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
      let currentSectionId = "hero";
      const scrollPos = window.scrollY + 160;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        }
      });
    });
  }

  // -----------------------------------------------------------------------
  // 13. MOBILE DRAWER MENU
  // -----------------------------------------------------------------------
  function initMobileMenu() {
    const openBtn = document.getElementById("mobile-menu-btn");
    const closeBtn = document.getElementById("mobile-menu-close");
    const drawer = document.getElementById("mobile-drawer");
    const items = document.querySelectorAll(".mobile-nav-item");

    if (openBtn && drawer) {
      openBtn.addEventListener("click", () => drawer.classList.remove("hidden"));
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener("click", () => drawer.classList.add("hidden"));
    }

    items.forEach((item) => {
      item.addEventListener("click", () => {
        if (drawer) drawer.classList.add("hidden");
      });
    });
  }

  // -----------------------------------------------------------------------
  // 14. CONTACT FORM & ACTIONS
  // -----------------------------------------------------------------------
  function initContactActions() {
    const copyBtn = document.getElementById("btn-copy-email");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const email = config.personal?.email || "sourajshil@gmail.com";
        navigator.clipboard.writeText(email).then(() => {
          showToast(`📋 Copied ${email} to clipboard!`);
        });
      });
    }

    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector("button[type='submit']");
        const origBtnHtml = submitBtn ? submitBtn.innerHTML : "Send Message";

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const subject = document.getElementById("contact-subject").value.trim();
        const message = document.getElementById("contact-message").value.trim();
        const targetEmail = config.personal?.email || "sourajshil@gmail.com";
        const serviceKey = config.personal?.emailServiceKey || "";

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Connecting...</span>
          `;
        }

        const emailBody = `Hi Souraj,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n-- Sent from Souraj Shil Portfolio`;

        // If Web3Forms API Key is configured
        if (serviceKey && serviceKey !== "YOUR_ACCESS_KEY_HERE") {
          try {
            const res = await fetch("https://api.web3forms.com/submit", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Accept": "application/json" },
              body: JSON.stringify({
                access_key: serviceKey,
                name: name,
                email: email,
                subject: `[Portfolio Inquiry] ${subject}`,
                message: message
              })
            });
            const data = await res.json();
            if (data.success) {
              showToast("🚀 Message delivered straight to your Gmail (sourajshil@gmail.com)!", 5000);
              form.reset();
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = origBtnHtml;
                if (window.lucide) window.lucide.createIcons();
              }
              return;
            }
          } catch (err) {
            console.warn("Web3Forms API failed, switching to direct mail composer:", err);
          }
        }

        // Direct Gmail Compose URL (100% reliable on every browser/device)
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open Gmail in a new tab
        const win = window.open(gmailUrl, "_blank");
        if (!win || win.closed || typeof win.closed === "undefined") {
          // Fallback to native mailto if popup blocker blocked new tab
          window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        }

        showToast("📬 Opening Gmail to deliver your message directly to sourajshil@gmail.com!", 5000);
        form.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnHtml;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }
  }

  // -----------------------------------------------------------------------
  // 15. TOAST NOTIFICATIONS
  // -----------------------------------------------------------------------
  function showToast(message, duration = 3500) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => toast.classList.add("show"), 50);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }

  // -----------------------------------------------------------------------
  // EXECUTE INITIALIZATION PIPELINE
  // -----------------------------------------------------------------------
  populateProfile();
  populateSocialLinks();
  populateExperienceAndEducation();
  populateProjects("all");
  setupProjectFilters();
  populateSkills();
  populateCertifications();
  initTypewriter();
  initVisualizers();
  initPlayground();
  initTheme();
  initScrollSpy();
  initMobileMenu();
  initContactActions();

  if (window.lucide) window.lucide.createIcons();
});
