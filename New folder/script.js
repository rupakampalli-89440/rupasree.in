// Add verified portfolio details here when they are available.
const CONTACT_EMAIL = '';

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');
  const themeToggle = document.getElementById('theme-toggle');
  const contactForm = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');
  const resumeButton = document.getElementById('resume-button');
  const resumeNote = document.getElementById('resume-note');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('current-year').textContent = new Date().getFullYear();

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    siteNav.classList.toggle('open', !isOpen);
  });

  siteNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.focus();
    }
  });

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
  });

  resumeButton.addEventListener('click', () => {
    resumeNote.textContent = 'A resume file has not been added yet.';
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!CONTACT_EMAIL) {
      formNote.textContent = 'Message delivery is not configured. Add your email address in script.js.';
      formNote.classList.add('error');
      return;
    }

    const data = new FormData(contactForm);
    const name = data.get('name').toString().trim();
    const email = data.get('email').toString().trim();
    const mobile = data.get('mobile').toString().trim();
    const message = data.get('message').toString().trim();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      mobile ? `Mobile: ${mobile}` : '',
      '',
      message
    ].filter(Boolean).join('\n');
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
    formNote.textContent = 'Your email app is opening with your message.';
    formNote.classList.remove('error');
  });

  const revealItems = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          siteNav.querySelectorAll('a').forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (!reducedMotion) {
    startParticles(document.getElementById('particles'));
  }
});

function startParticles(canvas) {
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  let width = 0;
  let height = 0;
  let particles = [];

  function resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = Math.min(58, Math.max(25, Math.round(width / 24)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.45,
      speed: Math.random() * 0.16 + 0.035,
      phase: Math.random() * Math.PI * 2,
      tint: Math.random() > 0.5 ? '174, 160, 255' : '103, 217, 243'
    }));
  }

  function animate() {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.phase += 0.012;
      particle.y -= particle.speed;
      if (particle.y < -4) {
        particle.y = height + 4;
        particle.x = Math.random() * width;
      }
      const opacity = 0.18 + (Math.sin(particle.phase) + 1) * 0.22;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${particle.tint}, ${opacity})`;
      context.fill();
    });
    window.requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.requestAnimationFrame(animate);
}
