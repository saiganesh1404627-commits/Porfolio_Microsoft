document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('img:not([loading])').forEach(image => { image.loading = 'lazy'; image.decoding = 'async'; });
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.setAttribute('aria-hidden', 'true');
  loader.innerHTML = '<span class="loader-mark">Loading portfolio</span>';
  body.prepend(loader);
  body.classList.add('is-loading');
  window.addEventListener('load', () => window.setTimeout(() => {
    loader.classList.add('is-hidden');
    body.classList.remove('is-loading');
  }, reducedMotion ? 0 : 260), { once: true });

  if (!reducedMotion && window.THREE) {
    try {
      const particleCanvas = document.createElement('canvas');
      particleCanvas.className = 'ambient-particles';
      particleCanvas.setAttribute('aria-hidden', 'true');
      body.append(particleCanvas);
      const renderer = new THREE.WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.z = 18;
      const particleCount = window.innerWidth < 680 ? 48 : 100;
      const positions = new Float32Array(particleCount * 3);
      const drift = Array.from({ length: particleCount }, () => ({ x: (Math.random() - .5) * .002, y: (Math.random() - .5) * .002 }));
      const geometry = new THREE.BufferGeometry();
      const bounds = { x: 0, y: 0 };
      const resizeParticles = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = Math.max(14, width / 90);
        camera.updateProjectionMatrix();
        bounds.y = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        bounds.x = bounds.y * camera.aspect;
        for (let index = 0; index < particleCount; index += 1) {
          positions[index * 3] = (Math.random() * 2 - 1) * bounds.x;
          positions[index * 3 + 1] = (Math.random() * 2 - 1) * bounds.y;
          positions[index * 3 + 2] = (Math.random() - .5) * 5;
        }
        geometry.attributes.position.needsUpdate = true;
      };
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({ color: 0xe4e4e4, size: .035, transparent: true, opacity: .62, sizeAttenuation: true });
      scene.add(new THREE.Points(geometry, material));
      resizeParticles();
      let particleFrame;
      const renderParticles = () => {
        for (let index = 0; index < particleCount; index += 1) {
          const offset = index * 3;
          positions[offset] += drift[index].x;
          positions[offset + 1] += drift[index].y;
          if (positions[offset] > bounds.x) positions[offset] = -bounds.x;
          if (positions[offset] < -bounds.x) positions[offset] = bounds.x;
          if (positions[offset + 1] > bounds.y) positions[offset + 1] = -bounds.y;
          if (positions[offset + 1] < -bounds.y) positions[offset + 1] = bounds.y;
        }
        geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
        particleFrame = window.requestAnimationFrame(renderParticles);
      };
      const setParticleVisibility = () => {
        if (document.hidden) window.cancelAnimationFrame(particleFrame);
        else if (!particleFrame || document.hidden === false) renderParticles();
      };
      window.addEventListener('resize', resizeParticles, { passive: true });
      document.addEventListener('visibilitychange', setParticleVisibility);
      renderParticles();
    } catch (error) {
      document.querySelector('.ambient-particles')?.remove();
    }
  }

  const hasGsap = window.gsap && window.ScrollTrigger;
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (!reducedMotion) {
      const heroContent = gsap.utils.toArray('.hero-content > *');
      if (heroContent.length) gsap.from(heroContent, { y: 16, opacity: 0, duration: .75, stagger: .08, ease: 'power2.out', clearProps: 'opacity,transform' });
      gsap.utils.toArray('.hero-visual').forEach(visual => gsap.to(visual, {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: .8 }
      }));
      [
        ['.grid-projects', '.project-card'],
        ['.skill-grid', '.skill-card'],
        ['.achievement-grid', '.achievement-card'],
        ['.education-grid', '.education-card']
      ].forEach(([gridSelector, cardSelector]) => {
        gsap.utils.toArray(gridSelector).forEach(grid => {
          const cards = grid.querySelectorAll(cardSelector);
          if (!cards.length) return;
          gsap.fromTo(cards, { autoAlpha: 0, y: 16 }, {
            autoAlpha: 1,
            y: 0,
            duration: .55,
            stagger: .08,
            ease: 'power2.out',
            overwrite: 'auto',
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: { trigger: grid, start: 'top 88%', once: true }
          });
        });
      });
      const techFloaters = gsap.utils.toArray('.tech-floaters span');
      if (techFloaters.length) gsap.from(techFloaters, {
        y: 8,
        autoAlpha: 0,
        duration: .5,
        stagger: .08,
        delay: .2,
        ease: 'power2.out',
        clearProps: 'opacity,visibility,transform'
      });
    }
  }

  if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
    window.addEventListener('pointermove', event => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
    }, { passive: true });
    const setCardTilt = (card, event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      card.style.setProperty('--tilt-x', `${-y * 4}deg`);
      card.style.setProperty('--tilt-y', `${x * 4}deg`);
    };
    document.addEventListener('pointermove', event => {
      const card = event.target.closest('.project-card, .skill-category, .skill-card-item');
      if (card) setCardTilt(card, event);
    }, { passive: true });
    document.addEventListener('pointerout', event => {
      const card = event.target.closest('.project-card, .skill-category, .skill-card-item');
      if (card && !card.contains(event.relatedTarget)) {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      }
    }, { passive: true });
  }

  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = navMenu ? [...navMenu.querySelectorAll('a')] : [];
  const closeMenu = () => {
    if (!menuToggle || !navMenu || !navOverlay) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  };
  const openMenu = () => {
    if (!menuToggle || !navMenu || !navOverlay) return;
    menuToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    navLinks[0]?.focus();
  };
  menuToggle?.addEventListener('click', () => menuToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu());
  navOverlay?.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
    if (event.key === 'Tab' && menuToggle?.getAttribute('aria-expanded') === 'true' && navLinks.length) {
      const first = navLinks[0];
      const last = navLinks[navLinks.length - 1];
      if (event.shiftKey && document.activeElement === first) { last.focus(); event.preventDefault(); }
      if (!event.shiftKey && document.activeElement === last) { first.focus(); event.preventDefault(); }
    }
  });

  const transition = document.createElement('div');
  transition.className = 'page-transition';
  transition.setAttribute('aria-hidden', 'true');
  body.append(transition);
  document.querySelectorAll('a[href$=".html"]').forEach(link => link.addEventListener('click', event => {
    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin || target.pathname === window.location.pathname || reducedMotion) return;
    event.preventDefault();
    if (hasGsap) {
      gsap.to(transition, { scaleY: 1, transformOrigin: 'bottom', duration: .42, ease: 'power2.inOut', onComplete: () => { window.location.href = target.href; } });
    } else {
      transition.classList.add('is-leaving');
      window.setTimeout(() => { window.location.href = target.href; }, 260);
    }
  }));

  const revealItems = document.querySelectorAll('main section:not(#skills):not(#achievements):not(#education), main section .section-title-wrap > h2, main section .section-title-wrap > p, .timeline-item, .experience-item, .contact-info-item, .contact-form-container');
  revealItems.forEach((item, index) => { item.classList.add('reveal'); item.style.transitionDelay = `${Math.min(index * 35, 240)}ms`; });
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 }) : null;
  revealItems.forEach(item => revealObserver ? revealObserver.observe(item) : item.classList.add('is-visible'));

  if (!hasGsap || reducedMotion) {
    document.querySelectorAll('.grid-projects .project-card, .skill-grid .skill-card, .achievement-grid .achievement-card, .education-grid .education-card').forEach(card => {
      if (reducedMotion || !revealObserver) card.classList.add('is-visible');
      else {
        card.classList.add('reveal');
        revealObserver.observe(card);
      }
    });
  }

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  body.append(progress);
  const updateProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const scrollTop = document.getElementById('scroll-top');
  const updateScrollTop = () => scrollTop?.classList.toggle('is-visible', window.scrollY > window.innerHeight * .7);
  window.addEventListener('scroll', updateScrollTop, { passive: true });
  updateScrollTop();
  scrollTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

  const typingRole = document.getElementById('typing-role');
  if (typingRole) {
    const roles = ['AI', 'Python', 'Machine Learning'];
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;
    const type = () => {
      if (reducedMotion) return;
      const role = roles[roleIndex];
      if (deleting) characterIndex -= 1;
      else characterIndex += 1;
      typingRole.textContent = role.slice(0, characterIndex);
      if (characterIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
      if (characterIndex === roles[roleIndex].length) deleting = true;
      window.setTimeout(type, deleting ? 65 : 105);
    };
    window.setTimeout(type, 1800);
  }

  const projectGrid = document.getElementById('project-grid');
  if (projectGrid) {
    projectGrid.classList.add('is-skeleton');
    const projects = [
      { title: 'Hasthvani – AI Powered Sign Language Recognition Platform', category: 'ai', tags: [], description: 'Hasthvani – AI Powered Sign Language Recognition Platform.', details: 'Project: Hasthvani – AI Powered Sign Language Recognition Platform.' },
      { title: 'Weather Detector Application', category: 'data', tags: [], description: 'Weather Detector Application.', details: 'Project: Weather Detector Application.' },
      { title: 'E-Commerce Web Platform', category: 'web', tags: [], description: 'E-Commerce Web Platform.', details: 'Project: E-Commerce Web Platform.' }
    ];
    let activeFilter = 'all';
    const projectSearch = document.getElementById('project-search');
    const renderProjects = () => {
      const query = projectSearch?.value.trim().toLowerCase() || '';
      const visibleProjects = projects.filter(project => (activeFilter === 'all' || project.category === activeFilter) && `${project.title} ${project.tags.join(' ')} ${project.description}`.toLowerCase().includes(query));
      projectGrid.innerHTML = visibleProjects.length ? visibleProjects.map((project, index) => `<article class="project-card ${index === 0 && activeFilter === 'all' && !query ? 'featured-project' : ''} reveal is-visible" data-category="${project.category}" style="transition-delay:${index * 45}ms"><div class="project-body">${index === 0 && activeFilter === 'all' && !query ? '<span class="featured-label">Featured project</span>' : ''}<span class="project-index">0${index + 1}</span><ul class="project-tags">${project.tags.map(tag => `<li class="project-tag">${tag}</li>`).join('')}</ul><h3 class="project-title">${project.title}</h3><p class="project-desc">${project.description}</p><button class="project-expand" type="button" aria-expanded="false">View details</button><div class="project-details">${project.details}</div></div></article>`).join('') : '<p class="empty-state">No projects match that search.</p>';
      projectGrid.classList.remove('is-skeleton');
      projectGrid.setAttribute('aria-busy', 'false');
      projectGrid.querySelectorAll('.project-expand').forEach(button => button.addEventListener('click', () => {
        const card = button.closest('.project-card');
        const expanded = card.classList.toggle('is-expanded');
        button.setAttribute('aria-expanded', String(expanded));
        button.textContent = expanded ? 'Hide details' : 'View details';
      }));
    };
    document.querySelectorAll('[data-project-filter]').forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.projectFilter;
      document.querySelectorAll('[data-project-filter]').forEach(filter => { filter.classList.toggle('is-active', filter === button); filter.setAttribute('aria-pressed', String(filter === button)); });
      renderProjects();
    }));
    projectSearch?.addEventListener('input', renderProjects);
    renderProjects();
  }

  const skillSearch = document.getElementById('skill-search');
  skillSearch?.addEventListener('input', () => {
    const query = skillSearch.value.trim().toLowerCase();
    document.querySelectorAll('.skill-category').forEach(category => {
      const matches = !query || category.textContent.toLowerCase().includes(query);
      category.classList.toggle('is-filtered', !matches);
    });
  });

  document.querySelectorAll('.skill-card-item').forEach(item => {
    const level = Number(item.dataset.skillLevel || 85);
    item.style.setProperty('--skill-level', `${level}%`);
    item.classList.add('is-visible');
  });

  document.querySelectorAll('.stat-value').forEach(counter => {
    const target = Number(counter.dataset.counter);
    const decimals = Number(counter.dataset.decimals || 0);
    const render = value => { counter.textContent = value.toFixed(decimals); };
    if (reducedMotion) { render(target); return; }
    let start = 0;
    const duration = 1100;
    const started = performance.now();
    const tick = now => {
      start = Math.min((now - started) / duration, 1);
      render(target * (1 - Math.pow(1 - start, 3)));
      if (start < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  document.querySelectorAll('.credential-card').forEach(card => {
    const toggle = card.querySelector('.credential-toggle');
    const setExpanded = expanded => { card.classList.toggle('is-expanded', expanded); toggle?.setAttribute('aria-expanded', String(expanded)); if (toggle) toggle.textContent = expanded ? 'Hide details' : 'View details'; };
    toggle?.addEventListener('click', event => { event.stopPropagation(); setExpanded(!card.classList.contains('is-expanded')); });
    card.addEventListener('click', () => setExpanded(!card.classList.contains('is-expanded')));
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setExpanded(!card.classList.contains('is-expanded')); } });
  });

  document.querySelectorAll('.achievement-toggle').forEach(toggle => toggle.addEventListener('click', () => {
    const card = toggle.closest('.hackathon-card');
    const expanded = card.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? 'Hide achievement details' : 'View achievement details';
  }));

  document.querySelectorAll('[data-resume-download]').forEach(link => link.addEventListener('click', () => {
    const eventName = 'resume_download';
    if (typeof window.gtag === 'function') window.gtag('event', eventName, { file_name: link.getAttribute('download') || link.getAttribute('href') });
    window.dispatchEvent(new CustomEvent(eventName, { detail: { href: link.href } }));
  }));

  const isMobileCursor = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 767px)').matches;
  const useCustomCursor = window.matchMedia('(pointer: fine)').matches && !reducedMotion && !isMobileCursor;

  if (useCustomCursor) {
    const cursorShell = document.createElement('div');
    cursorShell.className = 'cursor-shell';
    cursorShell.setAttribute('aria-hidden', 'true');

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.setAttribute('aria-hidden', 'true');

    const cursorLabel = document.createElement('div');
    cursorLabel.className = 'cursor-label';
    cursorLabel.setAttribute('aria-hidden', 'true');
    cursorLabel.textContent = 'Open';

    body.append(cursorShell, cursorDot, cursorLabel);
    body.classList.add('cursor-enabled');

    const cursorState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      ringScale: 1,
      dotScale: 1,
      targetRingScale: 1,
      targetDotScale: 1,
      labelScale: 0.8,
      targetLabelScale: 0.8,
      labelOpacity: 0,
      targetLabelOpacity: 0
    };

    const setPointerPosition = event => {
      cursorState.targetX = event.clientX;
      cursorState.targetY = event.clientY;
    };

    const updateCursor = () => {
      cursorState.x += (cursorState.targetX - cursorState.x) * 0.14;
      cursorState.y += (cursorState.targetY - cursorState.y) * 0.14;
      cursorState.ringScale += (cursorState.targetRingScale - cursorState.ringScale) * 0.18;
      cursorState.dotScale += (cursorState.targetDotScale - cursorState.dotScale) * 0.18;
      cursorState.labelScale += (cursorState.targetLabelScale - cursorState.labelScale) * 0.18;
      cursorState.labelOpacity += (cursorState.targetLabelOpacity - cursorState.labelOpacity) * 0.18;

      cursorShell.style.left = `${cursorState.x}px`;
      cursorShell.style.top = `${cursorState.y}px`;
      cursorDot.style.left = `${cursorState.x}px`;
      cursorDot.style.top = `${cursorState.y}px`;
      cursorLabel.style.left = `${cursorState.x}px`;
      cursorLabel.style.top = `${cursorState.y}px`;
      cursorShell.style.transform = `translate(-50%, -50%) scale(${cursorState.ringScale})`;
      cursorDot.style.transform = `translate(-50%, -50%) scale(${cursorState.dotScale})`;
      cursorLabel.style.transform = `translate(-50%, -50%) scale(${cursorState.labelScale})`;
      cursorLabel.style.opacity = String(cursorState.labelOpacity);

      requestAnimationFrame(updateCursor);
    };

    const interactiveTargets = '.btn, .nav-link, .floating-nav a, .project-card, .project-link-btn, .social-link, .credential-card, .filter-btn';

    document.addEventListener('pointermove', setPointerPosition, { passive: true });

    document.querySelectorAll(interactiveTargets).forEach(element => {
      const setLabel = (labelText, active) => {
        cursorLabel.textContent = labelText;
        cursorState.targetLabelOpacity = active ? 1 : 0;
        cursorState.targetLabelScale = active ? 1 : 0.8;
      };

      element.addEventListener('pointerenter', event => {
        cursorShell.classList.add('cursor--active');
        cursorDot.classList.add('cursor--active');
        cursorState.targetRingScale = 1.38;
        cursorState.targetDotScale = 1.45;

        const isProjectCard = element.classList.contains('project-card') || element.classList.contains('project-link-btn');
        const isLinkLike = element.closest('a, .nav-link, .floating-nav a, .btn, .social-link, .project-link-btn') || element.matches('a, .nav-link, .floating-nav a, .btn, .social-link, .project-link-btn');
        const labelText = isProjectCard ? 'View' : isLinkLike ? 'Open' : 'Open';

        setLabel(labelText, true);

        const rect = element.getBoundingClientRect();
        const offsetX = (event.clientX - (rect.left + rect.width / 2)) * 0.18;
        const offsetY = (event.clientY - (rect.top + rect.height / 2)) * 0.18;
        element.style.setProperty('--cursor-magnetic-x', `${offsetX}px`);
        element.style.setProperty('--cursor-magnetic-y', `${offsetY}px`);
      });

      element.addEventListener('pointerleave', () => {
        cursorShell.classList.remove('cursor--active');
        cursorDot.classList.remove('cursor--active');
        cursorState.targetRingScale = 1;
        cursorState.targetDotScale = 1;
        cursorState.targetLabelOpacity = 0;
        cursorState.targetLabelScale = 0.8;
        element.style.setProperty('--cursor-magnetic-x', '0px');
        element.style.setProperty('--cursor-magnetic-y', '0px');
      });

      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        const offsetX = (event.clientX - (rect.left + rect.width / 2)) * 0.18;
        const offsetY = (event.clientY - (rect.top + rect.height / 2)) * 0.18;
        element.style.setProperty('--cursor-magnetic-x', `${offsetX}px`);
        element.style.setProperty('--cursor-magnetic-y', `${offsetY}px`);
      });
    });

    requestAnimationFrame(updateCursor);
  }

  // Theme-ready architecture: a future theme can set data-theme without changing components.
  root.dataset.theme = localStorage.getItem('portfolio-theme') || 'dark';
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  const feedback = document.getElementById('form-feedback');
  const fields = [
    { id: 'name', group: 'group-name', validate: value => value.trim().length >= 2 },
    { id: 'email', group: 'group-email', validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) },
    { id: 'subject', group: 'group-subject', validate: value => value.trim().length >= 3 },
    { id: 'message', group: 'group-message', validate: value => value.trim().length >= 10 }
  ];
  const validate = field => { const input = document.getElementById(field.id); const group = document.getElementById(field.group); const valid = field.validate(input.value); group.classList.toggle('has-error', !valid); input.setAttribute('aria-invalid', String(!valid)); return valid; };
  fields.forEach(field => { const input = document.getElementById(field.id); input?.addEventListener('blur', () => validate(field)); input?.addEventListener('input', () => input.getAttribute('aria-invalid') === 'true' && validate(field)); });
  contactForm.addEventListener('submit', event => { event.preventDefault(); const invalid = fields.filter(field => !validate(field)); feedback.className = 'form-feedback'; if (invalid.length) { feedback.classList.add('error'); feedback.textContent = `The form contains ${invalid.length} error${invalid.length === 1 ? '' : 's'}. Please review the highlighted fields.`; document.getElementById(invalid[0].id)?.focus(); return; } feedback.classList.add('success'); feedback.textContent = `Thank you, ${document.getElementById('name').value.trim()}! Your message has been sent successfully.`; contactForm.reset(); fields.forEach(field => { document.getElementById(field.id)?.removeAttribute('aria-invalid'); document.getElementById(field.group)?.classList.remove('has-error'); }); feedback.setAttribute('tabindex', '-1'); feedback.focus(); });
});
