/* ====== NAVBAR SCROLL ====== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ====== MOBILE MENU ====== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ====== GALERIE LIGHTBOX ====== */
const galerieItems = document.querySelectorAll('.galerie-item');
const lightbox = document.getElementById('lightbox');

if (lightbox && galerieItems.length) {
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  let currentIndex = 0;

  function getItemData(index) {
    const item = galerieItems[index];
    const img = item.querySelector('img');
    const placeholder = item.querySelector('.image-placeholder');
    if (img) return { src: img.src, label: img.dataset.label || img.alt };
    if (placeholder) return { src: '', label: placeholder.dataset.label };
    return { src: '', label: '' };
  }

  function openLightbox(index) {
    currentIndex = index;
    const data = getItemData(index);
    lightboxCaption.textContent = data.label;
    if (lightboxImage) { lightboxImage.src = data.src; lightboxImage.alt = data.label; }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    currentIndex = (currentIndex + dir + galerieItems.length) % galerieItems.length;
    const data = getItemData(currentIndex);
    lightboxCaption.textContent = data.label;
    if (lightboxImage) { lightboxImage.src = data.src; lightboxImage.alt = data.label; }
  }

  galerieItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

/* ====== CALENDRIER ====== */
const calendarGrid = document.getElementById('calendarGrid');
const calendarMonth = document.getElementById('calendarMonth');
const calendarPrev = document.getElementById('calendarPrev');
const calendarNext = document.getElementById('calendarNext');

if (calendarGrid) {
  const MOIS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  let month = new Date().getMonth();
  let year = new Date().getFullYear();

  // RÉSERVATIONS : modifier ces dates pour chaque propriété
  const reservations = [
    '2025-07-14','2025-07-15','2025-07-16','2025-07-17','2025-07-18','2025-07-19','2025-07-20',
    '2025-08-01','2025-08-02','2025-08-03','2025-08-04','2025-08-05','2025-08-06','2025-08-07',
    '2025-08-08','2025-08-09','2025-08-10','2025-08-11','2025-08-12','2025-08-13','2025-08-14',
  ];

  function isBooked(y, m, d) {
    const s = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return reservations.includes(s);
  }

  function renderCalendar() {
    calendarGrid.querySelectorAll('.calendar-day').forEach(d => d.remove());
    calendarMonth.textContent = `${MOIS_FR[month]} ${year}`;
    const firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date(); today.setHours(0,0,0,0);

    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      calendarGrid.appendChild(empty);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      cell.textContent = day;
      const cellDate = new Date(year, month, day);
      if (cellDate < today) cell.classList.add('past');
      else if (isBooked(year, month, day)) cell.classList.add('booked');
      else cell.classList.add('available');
      calendarGrid.appendChild(cell);
    }
  }

  calendarPrev.addEventListener('click', () => { month--; if (month < 0) { month = 11; year--; } renderCalendar(); });
  calendarNext.addEventListener('click', () => { month++; if (month > 11) { month = 0; year++; } renderCalendar(); });
  renderCalendar();
}

/* ====== FORMULAIRE ====== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    console.log('Formulaire envoyé:', Object.fromEntries(formData.entries()));
    contactForm.innerHTML = `
      <div class="form-success">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h3>Demande envoyée !</h3>
        <p>Merci pour votre message. Nous vous répondrons dans les plus brefs délais.</p>
      </div>
    `;
  });
}

/* ====== SCROLL ANIMATIONS ====== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.section-header, .equip-card, .avis-card, .tarif-direct, .property-card, .avantage-card, .presentation-text, .presentation-image').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

/* ====== SMOOTH SCROLL ====== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  });
});
