/* ============================================================
   GROUNDED GEMS — script.js
   ============================================================ */

(() => {
  'use strict';

  /* --- PRELOADER --- */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('hidden'), 600);
    }
  });

  /* --- CUSTOM CURSOR --- */
  const cursorGem = document.getElementById('cursorGem');
  const cursorTrail = document.getElementById('cursorTrail');
  let trailX = 0, trailY = 0;
  let gemX = 0, gemY = 0;

  if (cursorGem && cursorTrail && window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
      gemX = e.clientX;
      gemY = e.clientY;
      cursorGem.style.left = gemX + 'px';
      cursorGem.style.top = gemY + 'px';
    });

    const animateTrail = () => {
      trailX += (gemX - trailX) * 0.12;
      trailY += (gemY - trailY) * 0.12;
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
      requestAnimationFrame(animateTrail);
    };
    animateTrail();

    document.querySelectorAll('a, button, .crystal-card, .shop-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* --- SPARKLE CANVAS --- */
  const canvas = document.getElementById('sparkleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['rgba(196,181,253,', 'rgba(168,85,247,', 'rgba(34,211,238,', 'rgba(129,140,248,'];

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.life = Math.random();
        this.maxLife = Math.random() * 0.006 + 0.002;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.maxLife;
        this.twinkle += this.twinkleSpeed;
        if (this.life <= 0 || this.y < -10) this.reset();
      }
      draw() {
        const alpha = Math.max(0, this.life) * (0.5 + 0.5 * Math.sin(this.twinkle));
        ctx.save();
        ctx.globalAlpha = alpha;
        if (Math.random() < 0.1) {
          ctx.font = `${this.size * 6}px serif`;
          ctx.fillStyle = this.color + alpha + ')';
          ctx.fillText('✦', this.x, this.y);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color + alpha + ')';
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < 120; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    };
    animate();

    // Mouse sparkle burst
    document.addEventListener('click', e => {
      for (let i = 0; i < 12; i++) {
        const burst = new Particle();
        burst.x = e.clientX;
        burst.y = e.clientY;
        burst.speedX = (Math.random() - 0.5) * 3;
        burst.speedY = -(Math.random() * 3 + 1);
        burst.life = 1;
        burst.maxLife = 0.025;
        burst.size = Math.random() * 3 + 1;
        particles.push(burst);
      }
    });
  }

  /* --- NAV SCROLL --- */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* --- HAMBURGER MENU --- */
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* --- SCROLL REVEAL --- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* --- CRYSTAL CARD PRISM HOVER --- */
  document.querySelectorAll('.crystal-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease';
    });
  });

  /* --- SHOP CARD TILT --- */
  document.querySelectorAll('.shop-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* --- CONTACT FORM --- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      try {
        const data = new FormData(form);
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data
        });
        if (res.ok) {
          form.reset();
          successMsg.classList.add('visible');
          submitBtn.textContent = 'Sent ✦';
          setTimeout(() => {
            successMsg.classList.remove('visible');
            submitBtn.textContent = 'Send Message ✦';
            submitBtn.disabled = false;
          }, 5000);
        } else {
          throw new Error();
        }
      } catch {
        submitBtn.textContent = 'Try Again';
        submitBtn.disabled = false;
      }
    });
  }

  /* --- MOBILE FLOAT CTA SCROLL BEHAVIOR --- */
  const floatCta = document.getElementById('mobileFloatCta');
  if (floatCta && window.innerWidth <= 768) {
    window.addEventListener('scroll', () => {
      floatCta.style.opacity = window.scrollY > 300 ? '1' : '0';
      floatCta.style.pointerEvents = window.scrollY > 300 ? 'auto' : 'none';
    });
    floatCta.style.opacity = '0';
  }

  /* --- SMOOTH ANCHOR SCROLL WITH OFFSET --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

})();
