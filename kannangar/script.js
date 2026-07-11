/* =========================================================
   MUHYISSUNNA DARS KANNANGAR — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 350);
  });
  setTimeout(() => loader && loader.classList.add('hidden'), 2000);

  /* ---------- Dark / Light mode toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('mdk-theme');
  if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');

  function syncToggleIcon() {
    if (!themeToggle) return;
    const knob = themeToggle.querySelector('.knob i');
    if (!knob) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    knob.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
  syncToggleIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('mdk-theme', 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('mdk-theme', 'dark');
      }
      syncToggleIcon();
    });
  }

  /* ---------- Navbar scroll + mobile toggle ---------- */
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);

    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* Mark active nav link by current page */
  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a[href]').forEach(a => {
    const href = a.getAttribute('href').split('#')[0];
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- Scroll-to-top button ---------- */
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Floating decorative particles (hero soft glow dots) ---------- */
  document.querySelectorAll('.floaters').forEach(container => {
    const count = 14;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'floater';
      const size = 4 + Math.random() * 10;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.animationDuration = `${8 + Math.random() * 10}s`;
      el.style.animationDelay = `${Math.random() * 6}s`;
      container.appendChild(el);
    }
  });

  /* ---------- Canvas particle background (hero) ---------- */
  document.querySelectorAll('.particles-bg canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(60, Math.floor((w * h) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: 0.15 + Math.random() * 0.35
    }));

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,162,39,${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(tick);
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  };
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.classList.toggle('hide', !show);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      if (!lightbox) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });
  document.querySelectorAll('.lightbox-close, .lightbox').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
      }
    });
  });

  /* ---------- Testimonial carousel ---------- */
  const slides = document.querySelectorAll('.t-slide');
  const dotsWrap = document.querySelector('.t-dots');
  if (slides.length) {
    let active = 0;
    slides.forEach((s, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showSlide(i));
      dotsWrap && dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap ? dotsWrap.querySelectorAll('button') : [];
    function showSlide(i) {
      slides[active].classList.remove('active');
      dots[active] && dots[active].classList.remove('active');
      active = i;
      slides[active].classList.add('active');
      dots[active] && dots[active].classList.add('active');
    }
    setInterval(() => showSlide((active + 1) % slides.length), 6000);
  }

  /* ---------- Form validation (contact / registration) ---------- */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        const field = input.closest('.field');
        const isEmpty = !input.value.trim();
        const isBadEmail = input.type === 'email' && input.value && !/^\S+@\S+\.\S+$/.test(input.value);
        if (field) field.classList.toggle('error', isEmpty || isBadEmail);
        if (isEmpty || isBadEmail) valid = false;
      });
      const status = form.querySelector('.form-status');
      if (valid) {
        if (status) {
          status.textContent = 'Thank you — your message has been received. We will get back to you soon, in shaa Allah.';
          status.style.color = '';
          status.classList.add('show');
        }
        form.reset();
      } else if (status) {
        status.textContent = 'Please check the highlighted fields.';
        status.style.color = '#c0392b';
        status.classList.add('show');
      }
    });
  });

  /* ---------- Alumni directory search/filter ---------- */
  const dirSearch = document.querySelector('#directory-search');
  const dirYear = document.querySelector('#directory-year');
  const dirProfession = document.querySelector('#directory-profession');
  const dirRows = document.querySelectorAll('.directory-table tbody tr');
  function filterDirectory() {
    const q = (dirSearch && dirSearch.value || '').toLowerCase();
    const y = dirYear && dirYear.value;
    const p = dirProfession && dirProfession.value;
    dirRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const matchQ = !q || text.includes(q);
      const matchY = !y || y === 'all' || row.dataset.year === y;
      const matchP = !p || p === 'all' || row.dataset.profession === p;
      row.style.display = (matchQ && matchY && matchP) ? '' : 'none';
    });
  }
  [dirSearch, dirYear, dirProfession].forEach(el => el && el.addEventListener('input', filterDirectory));
  [dirYear, dirProfession].forEach(el => el && el.addEventListener('change', filterDirectory));

  /* ---------- Alumni tabs (batch quick filters) ---------- */
  document.querySelectorAll('.alumni-tabs [data-tab-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.alumni-tabs [data-tab-target]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tabTarget;
      document.querySelectorAll('.alumni-card').forEach(card => {
        card.style.display = (target === 'all' || card.dataset.batch === target) ? '' : 'none';
      });
    });
  });

  /* ================================================================
     Donate page — build a UPI deep link and render it as a QR code
     the visitor can scan to open GPay (or any UPI app) directly,
     with the donation purpose pre-filled as the transaction note.
     ================================================================ */
  const qrTarget = document.querySelector('#qrcode');
  if (qrTarget && window.QRCode) {
    const payeeInput = document.querySelector('#upi-id');
    const nameInput = document.querySelector('#payee-name');
    const noteInput = document.querySelector('#upi-note');
    const amountChips = document.querySelectorAll('.amount-chips .chip');
    const gpayBtn = document.querySelector('#gpay-btn');
    let currentAmount = '';

    let qr = new QRCode(qrTarget, {
      text: 'upi://pay',
      width: 200,
      height: 200,
      colorDark: '#0b3d3a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });

    function buildUpiLink() {
      const pa = (payeeInput && payeeInput.value.trim()) || 'muhyissunnadars@okicici';
      const pn = (nameInput && nameInput.value.trim()) || 'Muhyissunna Dars Kannangar';
      const tn = (noteInput && noteInput.value.trim()) || 'Donation for Muhyissunna Dars Kannangar';
      const params = new URLSearchParams({ pa, pn, tn, cu: 'INR' });
      if (currentAmount) params.set('am', currentAmount);
      return `upi://pay?${params.toString()}`;
    }

    function renderQr() {
      const link = buildUpiLink();
      qr.clear();
      qr.makeCode(link);
      if (gpayBtn) gpayBtn.href = link;
    }

    [payeeInput, nameInput, noteInput].forEach(el => el && el.addEventListener('input', renderQr));
    amountChips.forEach(chip => {
      chip.addEventListener('click', () => {
        amountChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentAmount = chip.dataset.amount === 'other' ? '' : chip.dataset.amount;
        renderQr();
      });
    });

    renderQr();
  }

});