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
    transition.classList.add('is-leaving');
    window.setTimeout(() => { window.location.href = target.href; }, 260);
  }));

  const revealItems = document.querySelectorAll('main section, .project-card, .skill-category, .timeline-item, .experience-item, .contact-info-item, .contact-form-container, .credential-card');
  revealItems.forEach((item, index) => { item.classList.add('reveal'); item.style.transitionDelay = `${Math.min(index * 35, 240)}ms`; });
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 }) : null;
  revealItems.forEach(item => revealObserver ? revealObserver.observe(item) : item.classList.add('is-visible'));

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
    document.querySelectorAll('.skill-category').forEach(category => category.classList.toggle('is-filtered', query && !category.textContent.toLowerCase().includes(query)));
  });
  document.querySelectorAll('.skill-item').forEach(item => {
    const level = item.dataset.level || (65 + (item.textContent.length % 30));
    item.insertAdjacentHTML('beforeend', `<span class="skill-meter" aria-hidden="true"><span style="--skill-level:${level}%"></span></span>`);
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

  if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor-dot';
    cursor.setAttribute('aria-hidden', 'true');
    body.append(cursor);
    window.addEventListener('pointermove', event => { cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`; });
    document.querySelectorAll('a, button, input, textarea, select, .credential-card').forEach(element => {
      element.addEventListener('pointerenter', () => cursor.classList.add('is-hovering'));
      element.addEventListener('pointerleave', () => cursor.classList.remove('is-hovering'));
    });
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
