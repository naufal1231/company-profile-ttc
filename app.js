document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  /* ==========================================================================
       1. THEME SWITCHER (DARK / LIGHT MODE)
       ========================================================================== */
  const themeToggleBtn = document.getElementById("theme-toggle");
  const bodyElement = document.body;

  // Load saved theme or check system preferences
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    bodyElement.className = savedTheme;
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    bodyElement.className = prefersDark ? "dark-theme" : "light-theme";
  }

  // Toggle theme button listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      if (bodyElement.classList.contains("light-theme")) {
        bodyElement.classList.replace("light-theme", "dark-theme");
        localStorage.setItem("theme", "dark-theme");
      } else {
        bodyElement.classList.replace("dark-theme", "light-theme");
        localStorage.setItem("theme", "light-theme");
      }
    });
  }

  /* ==========================================================================
       2. NAVIGATION MENU (STICKY NAVBAR & MOBILE MENU)
       ========================================================================== */
  const navbar = document.getElementById("navbar");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Sticky navbar on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Dynamic link active on scroll
    highlightNavLink();
  });

  // Mobile menu toggle open/close
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      // Toggle hamburger icon to X icon (handled in CSS using classes, but we can double check)
    });
  }

  // Close menu when clicking on nav link (for mobile)
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
      }
    });
  });

  // Highlight menu items active state based on scroll section
  function highlightNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // offset for sticky nav
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelector(`.nav-menu a[href*=${sectionId}]`)
          ?.classList.add("active");
      } else {
        document
          .querySelector(`.nav-menu a[href*=${sectionId}]`)
          ?.classList.remove("active");
      }
    });
  }

  /* ==========================================================================
       3. ANIMATED STATS COUNTER
       ========================================================================== */
  const statsSection = document.querySelector(".stats-section");
  const statNumbers = document.querySelectorAll(".stat-number");
  let animated = false;

  function startCounting() {
    statNumbers.forEach((num) => {
      const target = parseInt(num.getAttribute("data-target"), 10);
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out function
        const easeOutQuad = progress * (2 - progress);

        const currentValue = Math.floor(easeOutQuad * target);
        num.textContent =
          target >= 100 && target !== 150 && target !== 99
            ? currentValue + "+"
            : target === 99
              ? currentValue + "%"
              : target === 150
                ? currentValue + "+"
                : currentValue + "+"; // Fallback text formatting

        // Clean up format when complete
        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          num.textContent = target === 99 ? target + "%" : target + "+";
        }
      }
      requestAnimationFrame(updateNumber);
    });
  }

  // Scroll trigger for counter using IntersectionObserver
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            startCounting();
            animated = true;
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(statsSection);
  }

  /* ==========================================================================
       4. PORTFOLIO FILTERING
       ========================================================================== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioCards = document.querySelectorAll(".portfolio-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Remove active class from all buttons
      filterButtons.forEach((button) => button.classList.remove("active"));
      // Add active to current
      e.target.classList.add("active");

      const filterValue = e.target.getAttribute("data-filter");

      portfolioCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
          // Trigger reflow for transition
          void card.offsetWidth;
          card.classList.add("show");
        } else {
          card.classList.remove("show");
          // Delay display: none to allow fade animation
          setTimeout(() => {
            if (!card.classList.contains("show")) {
              card.style.display = "none";
            }
          }, 500);
        }
      });
    });
  });

  /* ==========================================================================
       5. INTERACTIVE PROCESS TABS (ABOUT US)
       ========================================================================== */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active classes
      tabButtons.forEach((button) => button.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active to clicked button
      btn.classList.add("active");

      // Show matched content
      const tabId = btn.getAttribute("data-tab");
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  /* ==========================================================================
       6. TESTIMONIALS SLIDER
       ========================================================================== */
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".indicator-dot");
  const prevBtn = document.getElementById("prev-testimonial");
  const nextBtn = document.getElementById("next-testimonial");
  let currentSlide = 0;
  const slideCount = slides.length;
  let autoSlideInterval;

  function showSlide(index) {
    // Handle boundary conditions
    if (index >= slideCount) currentSlide = 0;
    else if (index < 0) currentSlide = slideCount - 1;
    else currentSlide = index;

    // Reset all slides and indicators
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Activate target slide and indicator
    slides[currentSlide].classList.add("active");
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add("active");
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Button event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  // Indicator dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetAutoSlide();
    });
  });

  // Auto-slide setup
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 8000); // changes slide every 8s
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  if (slideCount > 0) {
    startAutoSlide();
  }

  /* ==========================================================================
       7. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
       ========================================================================== */
  const contactForm = document.getElementById("contact-form");
  const successAlert = document.getElementById("form-success-alert");
  const alertCloseBtn = document.getElementById("alert-close-btn");

  if (contactForm) {
    const formFields = {
      name: {
        input: document.getElementById("form-name"),
        error: document.getElementById("name-error"),
        validate: (value) => value.trim().length > 0,
      },
      email: {
        input: document.getElementById("form-email"),
        error: document.getElementById("email-error"),
        validate: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value.trim());
        },
      },
      service: {
        input: document.getElementById("form-service"),
        error: document.getElementById("service-error"),
        validate: (value) => value !== "",
      },
      message: {
        input: document.getElementById("form-message"),
        error: document.getElementById("message-error"),
        validate: (value) => value.trim().length > 5,
      },
    };

    // Realtime validation on blur
    Object.keys(formFields).forEach((key) => {
      const field = formFields[key];
      if (field.input) {
        field.input.addEventListener("blur", () => {
          validateField(field);
        });

        // Clear error when typing/selecting
        field.input.addEventListener("input", () => {
          const parent = field.input.closest(".form-group");
          if (parent && parent.classList.contains("has-error")) {
            parent.classList.remove("has-error");
          }
        });
      }
    });

    function validateField(field) {
      const isValid = field.validate(field.input.value);
      const parent = field.input.closest(".form-group");

      if (!isValid) {
        parent.classList.add("has-error");
      } else {
        parent.classList.remove("has-error");
      }
      return isValid;
    }

    // Form submission
        contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let formIsValid = true;

      Object.keys(formFields).forEach((key) => {
        const field = formFields[key];
        const isValid = validateField(field);

        if (!isValid) {
          formIsValid = false;
        }
      });

      if (!formIsValid) return;

      const submitBtn = document.getElementById("form-submit-btn");
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="loading-spinner"></span> Mengirim...';

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          contactForm.style.display = "none";
          successAlert.style.display = "flex";
          contactForm.reset();
        } else {
          alert("Gagal mengirim pesan.");
        }
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat mengirim.");
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
  }

  // Success dialog close button
  if (alertCloseBtn && successAlert && contactForm) {
    alertCloseBtn.addEventListener("click", () => {
      successAlert.style.display = "none";
      contactForm.style.display = "flex";
      // Trigger reflow
      void contactForm.offsetWidth;
      contactForm.style.opacity = "1";
    });
  }

  /* ==========================================================================
       8. NEWSLETTER FORM HANDLER
       ========================================================================== */
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterMsg = document.getElementById("newsletter-msg");

  if (newsletterForm && newsletterMsg) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = newsletterForm.querySelector("button");
      submitBtn.disabled = true;

      // Simulate subscription post
      setTimeout(() => {
        newsletterForm.reset();
        submitBtn.disabled = false;
        newsletterMsg.style.display = "block";

        // Hide message after 5 seconds
        setTimeout(() => {
          newsletterMsg.style.display = "none";
        }, 5000);
      }, 1000);
    });
  }

//     ==========================================================================
//      9. OVERLAY POP UP IMAGE 
//      ==========================================================================
// const overlay = document.getElementById("lightbox");

// if (overlay) {
//     const lightboxImg = document.getElementById("lightboxImg");
//     const zoomLevelEl = document.getElementById("zoomLevel");
//     let scale = 1;

//     function setZoom(val) {
//         scale = Math.min(4, Math.max(0.5, val));
//         lightboxImg.style.transform = `scale(${scale})`;
//         zoomLevelEl.textContent = Math.round(scale * 100) + "%";
//     }

//     window.openLightbox = function(btn) {
//         lightboxImg.src = btn.dataset.img;
//         lightboxImg.alt = btn.dataset.title;
//         document.getElementById("lightboxTitle").textContent = btn.dataset.title;
//         overlay.classList.remove("hidden");
//         setZoom(1);
//         document.body.style.overflow = "hidden";
//     };

//     function closeLightbox() {
//         overlay.classList.add("hidden");
//         document.body.style.overflow = "";
//     }

//     document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
//     document.getElementById("zoomIn").addEventListener("click", () => setZoom(scale + 0.25));
//     document.getElementById("zoomOut").addEventListener("click", () => setZoom(scale - 0.25));
//     document.getElementById("zoomReset").addEventListener("click", () => setZoom(1));

//     overlay.addEventListener("click", (e) => {
//         if (e.target === overlay) closeLightbox();
//     });

//     lightboxImg.addEventListener("wheel", (e) => {
//         e.preventDefault();
//         setZoom(scale + (e.deltaY < 0 ? 0.15 : -0.15));
//     }, { passive: false });

//     document.addEventListener("keydown", (e) => {
//         if (e.key === "Escape") closeLightbox();
//     });
// }

/* ==========================================================================
     9. OVERLAY POP UP IMAGE 
     ========================================================================== */
const overlay = document.getElementById("lightbox");

if (overlay) {
    const lightboxImg = document.getElementById("lightboxImg");
    const zoomLevelEl = document.getElementById("zoomLevel");
    let scale      = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX     = 0;
    let startY     = 0;
    let lastX      = 0;
    let lastY      = 0;

    function setZoom(val) {
        scale = Math.min(4, Math.max(0.5, val));
        lightboxImg.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
        zoomLevelEl.textContent = Math.round(scale * 100) + "%";
    }

    window.openLightbox = function(btn) {
        lightboxImg.src = btn.dataset.img;
        lightboxImg.alt = btn.dataset.title;
        document.getElementById("lightboxTitle").textContent = btn.dataset.title;
        overlay.classList.remove("hidden");
        translateX = 0; translateY = 0;
        lastX = 0; lastY = 0;
        setZoom(1);
        document.body.style.overflow = "hidden";
    };

    function closeLightbox() {
        overlay.classList.add("hidden");
        document.body.style.overflow = "";
    }

    document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
    document.getElementById("zoomIn").addEventListener("click", () => setZoom(scale + 0.25));
    document.getElementById("zoomOut").addEventListener("click", () => setZoom(scale - 0.25));
    document.getElementById("zoomReset").addEventListener("click", () => {
        translateX = 0; translateY = 0;
        lastX = 0; lastY = 0;
        setZoom(1);
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeLightbox();
    });

    lightboxImg.addEventListener("wheel", (e) => {
        e.preventDefault();
        setZoom(scale + (e.deltaY < 0 ? 0.15 : -0.15));
    }, { passive: false });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });

    // ── Mouse Drag ────────────────────────────────────────────
    lightboxImg.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX - lastX;
        startY = e.clientY - lastY;
        lightboxImg.style.cursor = "grabbing";
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        lastX = translateX;
        lastY = translateY;
        lightboxImg.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        lightboxImg.style.cursor = "grab";
    });

    // ── Touch Drag (HP) ───────────────────────────────────────
    lightboxImg.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX - lastX;
            startY = e.touches[0].clientY - lastY;
        }
        e.preventDefault();
    }, { passive: false });

    lightboxImg.addEventListener("touchmove", (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        lastX = translateX;
        lastY = translateY;
        lightboxImg.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
        e.preventDefault();
    }, { passive: false });

    lightboxImg.addEventListener("touchend", () => {
        isDragging = false;
    });
}

  /* ==========================================================================
       10. SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ========================================================================== */
  const scrollAnimatedElements = document.querySelectorAll(".animate-scroll");

  if (scrollAnimatedElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            // Stop observing once animated in
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px", // animate slightly before entering screen
      },
    );

    scrollAnimatedElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

 /* ==========================================================================
       11. HERO PARALLAX EFEK
       ========================================================================== */
  const heroTahanLayar = document.getElementById("hero-tahan-layar");
  const heroSection = document.getElementById("home");
  const heroVideoWrapper = document.querySelector(".hero-video-wrapper");
  const heroOverlay = document.querySelector(".hero-video-overlay");

  const elBadge = document.querySelector(".hero-video-badge-wrapper");
  const elTitle = document.querySelector(".hero-video-title");
  const elLogoWrap = document.querySelector(".hero-video-logo-wrapper");
  const elSlogan = document.querySelector(".hero-video-slogan");
  const elDesc = document.querySelector(".hero-video-deskripsi");

  if (heroTahanLayar && heroSection && heroVideoWrapper) {
    const lerpFactor = 0.07;
    const lerpFactorMouse = 0.1;

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    const state = {
      videoY: { target: 0, current: 0 },
      videoScale: { target: 1, current: 1 },
      badge: { y: 0, yCur: 0, opacity: 1, opCur: 1 },
      title: { y: 0, yCur: 0, opacity: 1, opCur: 1 },
      logo: { y: 0, yCur: 0, scale: 1, scaleCur: 1, rotate: 0, rotateCur: 0, opacity: 1, opCur: 1 },
      slogan: { y: 0, yCur: 0, opacity: 1, opCur: 1 },
      desc: { y: 0, yCur: 0, opacity: 1, opCur: 1 },
      mouseX: { target: 0, current: 0 },
      mouseY: { target: 0, current: 0 },
    };

    function getProgress() {
      const wrapperRect = heroTahanLayar.getBoundingClientRect();
      const scrollableDistance = heroTahanLayar.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return 0;
      const scrolled = -wrapperRect.top;
      return Math.max(0, Math.min(1, scrolled / scrollableDistance));
    }

    function clampOpacity(v) {
      return Math.max(0, Math.min(1, v));
    }

    function updateParallaxTargets() {
      const p = getProgress();
      const vh = window.innerHeight;

      state.videoY.target = p * vh * 0.3;
      state.videoScale.target = 1 + p * 0.15;

      state.badge.y = p * vh * 0.7;
      state.badge.opacity = clampOpacity(1 - p * 3.5);

      state.title.y = p * vh * 0.55;
      state.title.opacity = clampOpacity(1 - p * 3.0);

      state.logo.y = p * vh * 0.35;
      state.logo.scale = 1 + p * 0.8;
      state.logo.rotate = p * 360;
      state.logo.opacity = clampOpacity(1 - p * 2.0);

      state.slogan.y = p * vh * 0.25;
      state.slogan.opacity = clampOpacity(1 - p * 2.5);

      state.desc.y = p * vh * 0.15;
      state.desc.opacity = clampOpacity(1 - p * 2.2);
    }

    if (heroSection) {
      heroSection.addEventListener("mousemove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        state.mouseX.target = ((e.clientX - rect.left) - cx) / cx;
        state.mouseY.target = ((e.clientY - rect.top) - cy) / cy;
      });

      heroSection.addEventListener("mouseleave", () => {
        state.mouseX.target = 0;
        state.mouseY.target = 0;
      });
    }

    function animateParallax() {
      const s = state;
      const lf = lerpFactor;

      s.videoY.current = lerp(s.videoY.current, s.videoY.target, lf);
      s.videoScale.current = lerp(s.videoScale.current, s.videoScale.target, lf);
      heroVideoWrapper.style.transform = `translate3d(0, ${s.videoY.current}px, 0) scale(${s.videoScale.current})`;

      s.mouseX.current = lerp(s.mouseX.current, s.mouseX.target, lerpFactorMouse);
      s.mouseY.current = lerp(s.mouseY.current, s.mouseY.target, lerpFactorMouse);

      if (elBadge) {
        s.badge.yCur = lerp(s.badge.yCur, s.badge.y, lf);
        s.badge.opCur = lerp(s.badge.opCur, s.badge.opacity, lf);
        elBadge.style.transform = `translate3d(0, -${s.badge.yCur}px, 0)`;
        elBadge.style.opacity = s.badge.opCur;
      }

      if (elTitle) {
        s.title.yCur = lerp(s.title.yCur, s.title.y, lf);
        s.title.opCur = lerp(s.title.opCur, s.title.opacity, lf);
        elTitle.style.transform = `translate3d(0, -${s.title.yCur}px, 0)`;
        elTitle.style.opacity = s.title.opCur;
      }

      if (elLogoWrap) {
        s.logo.yCur = lerp(s.logo.yCur, s.logo.y, lf);
        s.logo.scaleCur = lerp(s.logo.scaleCur, s.logo.scale, lf);
        s.logo.rotateCur = lerp(s.logo.rotateCur, s.logo.rotate, lf);
        s.logo.opCur = lerp(s.logo.opCur, s.logo.opacity, lf);

        const tiltX = s.mouseY.current * -15;
        const tiltY = s.mouseX.current * 15;
        const moveX = s.mouseX.current * 50;
        const moveY = s.mouseY.current * 30;

        elLogoWrap.style.transform = `translate3d(${moveX}px, ${moveY - s.logo.yCur}px, 0) scale(${s.logo.scaleCur}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotate(${s.logo.rotateCur}deg)`;
        elLogoWrap.style.opacity = s.logo.opCur;
      }

      if (elSlogan) {
        s.slogan.yCur = lerp(s.slogan.yCur, s.slogan.y, lf);
        s.slogan.opCur = lerp(s.slogan.opCur, s.slogan.opacity, lf);
        elSlogan.style.transform = `translate3d(0, -${s.slogan.yCur}px, 0)`;
        elSlogan.style.opacity = s.slogan.opCur;
      }

      if (elDesc) {
        s.desc.yCur = lerp(s.desc.yCur, s.desc.y, lf);
        s.desc.opCur = lerp(s.desc.opCur, s.desc.opacity, lf);
        elDesc.style.transform = `translate3d(0, -${s.desc.yCur}px, 0)`;
        elDesc.style.opacity = s.desc.opCur;
      }

      requestAnimationFrame(animateParallax);
    }

    window.addEventListener("scroll", updateParallaxTargets, { passive: true });
    requestAnimationFrame(animateParallax);
  }

  /* ==========================================================================
       12. HERO BACKGROUND VIDEO CONTROLS
       ========================================================================== */
  const heroVideo = document.getElementById("hero-video");

  // Playlist of high-quality sample video URLs
  const videoPlaylist = [
    "dist/assets/hero-video.mp4", // User's local video
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  ];
  let currentVideoIndex = 0;

  if (heroVideo) {
    // Change Video with Fade Transition
    function changeVideo(direction) {
      // Fade out video
      heroVideo.style.opacity = 0;

      setTimeout(() => {
        // Calculate next index
        if (direction === "next") {
          currentVideoIndex = (currentVideoIndex + 1) % videoPlaylist.length;
        } else if (direction === "prev") {
          currentVideoIndex = (currentVideoIndex - 1 + videoPlaylist.length) % videoPlaylist.length;
        }

        // Set the video source
        const newSrc = videoPlaylist[currentVideoIndex];
        heroVideo.src = newSrc;
        heroVideo.load();
        
        // Attempt play
        heroVideo.play().then(() => {
          if (playPauseBtn) {
            playPauseBtn.classList.remove("paused");
            playPauseBtn.classList.add("playing");
          }
        }).catch((err) => {
          console.log("Auto-play on change failed:", err);
          if (playPauseBtn) {
            playPauseBtn.classList.remove("playing");
            playPauseBtn.classList.add("paused");
          }
        });

        // Fade video back in
        setTimeout(() => {
          heroVideo.style.opacity = 1;
        }, 150);

      }, 500); // match CSS transition duration (0.5s)
    }

    // Prev / Next button events
    if (prevVideoBtn) {
      prevVideoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        changeVideo("prev");
      });
    }

    if (nextVideoBtn) {
      nextVideoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        changeVideo("next");
      });
    }

    // Mute / Unmute Toggle Function
    if (muteToggleBtn) {
      muteToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        heroVideo.muted = !heroVideo.muted;
        if (heroVideo.muted) {
          muteToggleBtn.classList.add("muted");
        } else {
          muteToggleBtn.classList.remove("muted");
        }
      });
    }

    // Synchronize play button state if video plays/pauses due to other browser behaviors
    heroVideo.addEventListener("play", () => {
      if (playPauseBtn) {
        playPauseBtn.classList.remove("paused");
        playPauseBtn.classList.add("playing");
      }
    });

    heroVideo.addEventListener("pause", () => {
      if (playPauseBtn) {
        playPauseBtn.classList.remove("playing");
        playPauseBtn.classList.add("paused");
      }
    });

    // Fallback if video file doesn't exist (e.g. local hero-video.mp4 hasn't been added yet)
    heroVideo.addEventListener("error", () => {
      console.warn("Video load error for: " + heroVideo.src + ". Trying fallback source.");
      // Skip local file index (0) if it fails, load the next item
      if (currentVideoIndex === 0) {
        currentVideoIndex = 1;
        heroVideo.src = videoPlaylist[currentVideoIndex];
        heroVideo.load();
        heroVideo.play().catch(err => console.log("Fallback play failed:", err));
      }
    });
  }
  

  // 13.maps 
  function updateMapMode() {
    const iframe = document.querySelector('.cd-text iframe');
    if (!iframe) return;

    // deteksi dari class dark-theme di <body>
    const isDark = document.body.classList.contains('dark-theme');

    const roadUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.2064299819226!2d112.68236517500584!3d-7.87345619214876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62b003a4f7cd1%3A0x412c2988fa58286a!2sPergudangan%20Sentral%20Singosari!5e0!3m2!1sid!2sid!4v1782705195340!5m2!1sid!2sid";

    const satelliteUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.2064299819226!2d112.68236517500584!3d-7.87345619214876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62b003a4f7cd1%3A0x412c2988fa58286a!2sPergudangan%20Sentral%20Singosari!5e1!3m2!1sid!2sid!4v1782705195340!5m2!1sid!2sid";

    iframe.src = isDark ? satelliteUrl : roadUrl;
  }

  // jalankan saat halaman pertama load
  updateMapMode();

  // pantau perubahan class di <body> secara otomatis
  const observer = new MutationObserver(updateMapMode);
  observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
  });

// ==========================================================================
  // 14. BILINGUAL SYSTEM (LOADED FROM JSON FILES) — 3 BAHASA + DROPDOWN
  // ==========================================================================

  const LANGS = {
    id: { label: "ID", flag: "https://flagcdn.com/id.svg", name: "Indonesia" },
    en: { label: "EN", flag: "https://flagcdn.com/gb.svg", name: "English" },
    zh: { label: "繁中", flag: "https://flagcdn.com/tw.svg", name: "繁體中文" }
  };

  let translations = {};
  let currentLang = localStorage.getItem("lang") || "id";

  async function initLanguageSystem() {
    try {
      const isSubFolder = window.location.pathname.includes("/mesin/");
      const basePath = isSubFolder ? "../lang/" : "./lang/";
      const [idRes, enRes, zhRes] = await Promise.all([
        fetch(`${basePath}id.json`),
        fetch(`${basePath}en.json`),
        fetch(`${basePath}zh.json`)
      ]);

      translations.id = await idRes.json();
      translations.en = await enRes.json();
      translations.zh = await zhRes.json();

      applyTranslations(currentLang);
      updateLangButton(currentLang);
    } catch (err) {
      console.error("Gagal memuat file bahasa JSON:", err);
    }
  }

  function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;

    // Animate body
    document.body.classList.add("lang-switching");
    setTimeout(() => document.body.classList.remove("lang-switching"), 400);

    // Translate text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key] !== undefined) {
        el.placeholder = t[key];
      }
    });

    // Update lang attribute on html (zh pakai zh-TW biar akurat untuk traditional chinese)
    document.documentElement.lang = lang === "zh" ? "zh-TW" : lang;
  }

  function updateLangButton(lang) {
    const btn = document.getElementById("lang-toggle");
    const label = document.getElementById("lang-label");
    const flag = document.getElementById("lang-flag");
    const menu = document.getElementById("lang-dropdown-menu");

    if (!btn || !label || !flag) return;

    const data = LANGS[lang];
    label.textContent = data.label;
    flag.src = data.flag;
    flag.alt = data.name;
    btn.title = "Switch Language";

    // Tandai opsi aktif di dropdown
    if (menu) {
      menu.querySelectorAll(".lang-option").forEach(opt => {
        opt.classList.toggle("active", opt.dataset.lang === lang);
      });
    }
  }

  function setLanguage(lang) {
    if (!LANGS[lang]) return;

    if (lang !== currentLang) {
      currentLang = lang;
      localStorage.setItem("lang", currentLang);
      applyTranslations(currentLang);
      updateLangButton(currentLang);

      // Re-init lucide icons (some elements might have been re-rendered)
      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }
    closeDropdown();
  }

  function openDropdown() {
    const btn = document.getElementById("lang-toggle");
    const menu = document.getElementById("lang-dropdown-menu");
    if (!btn || !menu) return;
    menu.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }

  function closeDropdown() {
    const btn = document.getElementById("lang-toggle");
    const menu = document.getElementById("lang-dropdown-menu");
    if (!btn || !menu) return;
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  function toggleDropdown() {
    const menu = document.getElementById("lang-dropdown-menu");
    if (!menu) return;
    menu.classList.contains("open") ? closeDropdown() : openDropdown();
  }

  // Init language on load
  initLanguageSystem();

  // Attach dropdown open/close event
  const langToggleBtn = document.getElementById("lang-toggle");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown();
    });
  }

  // Attach click event untuk setiap opsi bahasa
  document.querySelectorAll(".lang-option").forEach(opt => {
    opt.addEventListener("click", () => setLanguage(opt.dataset.lang));
  });

  // Klik di luar dropdown -> tutup otomatis
  document.addEventListener("click", (e) => {
    const wrapper = document.querySelector(".lang-dropdown-wrapper");
    if (wrapper && !wrapper.contains(e.target)) {
      closeDropdown();
    }
  });

  // Tekan Escape -> tutup dropdown
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });

});

