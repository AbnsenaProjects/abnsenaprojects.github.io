(function () {
  // ---- Data ----
  const specialties = [
    'الإسعاف والطوارئ', 'النساء والولادة', 'الجراحة العامة', 'جراحة الأطفال',
    'جراحة الأعصاب', 'جراحة العظام', 'جراحة الأوعية الدموية', 'جراحة التجميل',
    'جراحة الصدر', 'جراحة المسالك البولية', 'الباطنة العامة', 'أمراض الأطفال',
    'أمراض القلب', 'أمراض الكلى', 'أمراض الجهاز الهضمي', 'العناية الفائقة للكبار',
    'العناية الفائقة للأطفال', 'عناية حديثي الولادة', 'الأشعة التشخيصية', 'المختبر والتحاليل'
  ];

  const doctors = [
    ['أ.د. بشير غرمول', 'جراحة الأطفال'],
    ['أ.د. محمد بادي', 'الباطنة العامة'],
    ['أ.د. أسامة أبورياح', 'الجهاز الهضمي (كبار)'],
    ['أ.د. اعتماد المسلاتي', 'النساء والولادة'],
    ['أ.د. فيصل المصراتي', 'جراحة العظام'],
    ['د. صالح أبوجمرة', 'الجراحة العامة'],
    ['د. فرج الحمادي', 'جراحة الصدر'],
    ['د. موفق الأشهب', 'جراحة الأعصاب'],
    ['د. إسماعيل الفورتية', 'أمراض العقم والتوليد'],
    ['د. طارق سنان', 'جراحة المسالك البولية']
  ];

  const specGrid = document.getElementById('specGrid');
  specGrid.innerHTML = specialties.map((s, i) =>
    `<li><span class="num">${String(i + 1).padStart(2, '0')}</span>${s}</li>`).join('');

  const docList = document.getElementById('docList');
  docList.innerHTML = doctors.map(([name, spec]) => {
    const initial = name.replace(/^(أ\.د\.|د\.)\s*/, '').charAt(0);
    return `<li><span class="avatar">${initial}</span><div><b>${name}</b><span>${spec}</span></div></li>`;
  }).join('');

  // ---- Header & menu ----
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('mainNav');
  const setMenu = open => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // ---- Floor tabs ----
  const tabs = document.querySelectorAll('.floor-tabs button');
  const panels = document.querySelectorAll('.floor-panel');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    const f = tab.dataset.floor;
    tabs.forEach(t => t.classList.toggle('active', t === tab));
    panels.forEach(p => p.classList.toggle('active', p.dataset.floor === f));
  }));

  // ---- Reveal on scroll + counters ----
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countUp = el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (reduce || el.hasAttribute('data-plain')) { el.textContent = target + suffix; return; }
    const start = performance.now(), dur = 1400;
    const step = now => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    setTimeout(() => { el.textContent = target + suffix; }, dur + 200);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---- Lightbox ----
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('figcaption');
  const closeLb = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); };
  document.querySelectorAll('a.g-item').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    lbImg.src = a.getAttribute('href');
    lbImg.alt = a.dataset.caption || '';
    lbCap.textContent = a.dataset.caption || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  }));
  lb.addEventListener('click', e => { if (e.target !== lbImg) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
