document.addEventListener('DOMContentLoaded', function () {
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isActive = !mobileNav.classList.toggle('active');
      hamburger.classList.toggle('active');
      mobileNav.style.display = mobileNav.classList.contains('active') ? 'flex' : 'none';
      hamburger.setAttribute('aria-expanded', String(mobileNav.classList.contains('active')));
      mobileNav.setAttribute('aria-hidden', String(!mobileNav.classList.contains('active')));
    });
  }

  // Close mobile nav when a link is clicked
  document.querySelectorAll('#mobileNav a').forEach(a => {
    a.addEventListener('click', () => {
      if (mobileNav && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        mobileNav.style.display = 'none';
        if (hamburger) hamburger.classList.remove('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // Simple field validator
  function validateFormFields(nameEl, phoneEl, emailEl) {
    const name = nameEl && nameEl.value ? nameEl.value.trim() : '';
    const phone = phoneEl && phoneEl.value ? phoneEl.value.trim() : '';
    const email = emailEl && emailEl.value ? emailEl.value.trim() : '';
    if (!name) return 'Please enter your name.';
    if (!phone || phone.length < 7) return 'Please enter a valid phone number.';
    if (!email || !/.+@.+\..+/.test(email)) return 'Please enter a valid email address.';
    return '';
  }

  // Lead form handling
  const form = document.getElementById('leadForm');
  const feedback = document.getElementById('formFeedback');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!feedback) return;
      feedback.textContent = '';
      const err = validateFormFields(document.getElementById('name'), document.getElementById('phone'), document.getElementById('email'));
      if (err) {
        feedback.style.color = 'crimson';
        feedback.textContent = err;
        return;
      }
      feedback.style.color = 'green';
      feedback.textContent = 'Submitting...';
      const payload = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        project: form.project ? form.project.value : 'Not specified',
        message: form.message ? form.message.value.trim() : ''
      };
      // simulate server
      setTimeout(() => {
        feedback.textContent = `Thanks ${payload.name}! We'll contact you soon at ${payload.phone}.`;
        form.reset();
      }, 900);
    });
  }

  // Popup contact form logic (show once per visitor using localStorage)
  const popup = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const popupForm = document.getElementById('popupForm');
  const popupFeedback = document.getElementById('popupFeedback');
  const POPUP_KEY = 'vd_popup_shown';
  if (popup) {
    const alreadyShown = window.localStorage && localStorage.getItem(POPUP_KEY);
    // Show popup if not shown before
    if (!alreadyShown) {
      setTimeout(() => { popup.style.display = 'flex'; }, 800);
    }

    function markPopupShown() {
      try { localStorage.setItem(POPUP_KEY, '1'); } catch (e) { /* ignore */ }
    }

    // Close handlers
    if (closeBtn) closeBtn.addEventListener('click', () => { popup.style.display = 'none'; markPopupShown(); });
    popup.addEventListener('click', (e) => { if (e.target === popup) { popup.style.display = 'none'; markPopupShown(); } });

    if (popupForm) {
      popupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (popupFeedback) popupFeedback.textContent = 'Submitting...';
        // Here you could send data to your server. We'll simulate and then close.
        setTimeout(() => {
          if (popupFeedback) popupFeedback.textContent = '✅ Thank you! We’ll contact you soon.';
          popupForm.reset();
          markPopupShown();
          setTimeout(() => { popup.style.display = 'none'; }, 800);
        }, 900);
      });
    }
  }

  // ===== BROCHURE DOWNLOAD MODAL =====
  const downloadBtn = document.getElementById('downloadBrochure');
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <h3>Download Brochure</h3>
      <p>Before you download, please share your contact details so we can follow up.</p>
      <form id="brochureForm">
        <div class="row">
          <input name="bname" id="bname" placeholder="Full name" required />
          <input name="bphone" id="bphone" placeholder="Phone" required />
        </div>
        <div style="margin-top:10px">
          <input name="bemail" id="bemail" placeholder="Email" required />
        </div>
        <div class="actions">
          <button type="button" class="btn" id="bCancel">Cancel</button>
          <button type="submit" class="btn primary" id="bSubmit">Download</button>
        </div>
        <p id="bFeedback" style="margin-top:8px;font-size:0.95rem"></p>
      </form>
    </div>`;
  document.body.appendChild(modalOverlay);

  const brochureForm = document.getElementById('brochureForm');
  const bCancel = document.getElementById('bCancel');
  const bFeedback = document.getElementById('bFeedback');

  function openBrochureModal() { modalOverlay.style.display = 'flex'; const el = document.getElementById('bname'); if (el) el.focus(); }
  function closeBrochureModal() { modalOverlay.style.display = 'none'; if (bFeedback) bFeedback.textContent = ''; if (brochureForm) brochureForm.reset(); }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => { e.preventDefault(); openBrochureModal(); });
  }

  // Offer buttons open the same brochure modal
  ['offerBrochure1','offerBrochure2','offerBrochure3'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); openBrochureModal(); });
  });

  if (bCancel) bCancel.addEventListener('click', closeBrochureModal);

  if (brochureForm) {
    brochureForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (bFeedback) bFeedback.textContent = '';
      const nameEl = document.getElementById('bname');
      const phoneEl = document.getElementById('bphone');
      const emailEl = document.getElementById('bemail');
      const err = validateFormFields(nameEl, phoneEl, emailEl);
      if (err) {
        if (bFeedback) { bFeedback.style.color = 'crimson'; bFeedback.textContent = err; }
        return;
      }
      if (bFeedback) { bFeedback.style.color = 'green'; bFeedback.textContent = 'Preparing your download...'; }
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = 'bbc.pdf';
        a.download = 'Vasundhara_Brochure.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        if (bFeedback) bFeedback.textContent = 'Download started. Thank you!';
        setTimeout(closeBrochureModal, 1200);
      }, 800);
    });
  }

  // Menu-toggle button (PNG icons) — keep in sync with hamburger for users using the image button
  const menuToggle = document.getElementById('menuToggle');
  const iconHamburger = document.getElementById('iconHamburger');
  const iconClose = document.getElementById('iconClose');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = mobileNav.classList.toggle('active');
      mobileNav.style.display = isOpen ? 'flex' : 'none';
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      // toggle visual hamburger state
      if (hamburger) hamburger.classList.toggle('active', isOpen);
      if (hamburger) hamburger.setAttribute('aria-expanded', String(isOpen));
      // swap icons
      if (iconHamburger) iconHamburger.style.display = isOpen ? 'none' : '';
      if (iconClose) iconClose.style.display = isOpen ? '' : 'none';
    });
  }

  // ===== Projects slider =====
  (function initProjectsSlider(){
    const sliderWrapper = document.querySelector('.project-slider-wrapper');
    const track = document.querySelector('.slider-track');
    if (!sliderWrapper || !track) return;

    // ensure wrapper is focusable for keyboard nav
    if (!sliderWrapper.hasAttribute('tabindex')) sliderWrapper.tabIndex = 0;

    // collect only element children that look like project cards
    const allItems = Array.from(track.children).filter(ch => ch.nodeType === 1 && ch.classList.contains('project-card'));
    if (allItems.length === 0) return;

    let items = allItems;
    let itemsPerPage = 1;
    let pageIndex = 0;
    let pageCount = 1;
    const prevBtn = sliderWrapper.querySelector('.slider-btn.prev');
    const nextBtn = sliderWrapper.querySelector('.slider-btn.next');
    let dotsContainer = document.querySelector('.slider-dots');
    const AUTOPLAY_INTERVAL = 3600;
    let autoplayTimer = null;

    // helper: compute layout (itemsPerPage, pageCount, itemSize)
    function computeLayout(){
      const wrapperWidth = sliderWrapper.getBoundingClientRect().width;
      // responsive items per page
      if (wrapperWidth >= 1000) itemsPerPage = 3;
      else if (wrapperWidth >= 700) itemsPerPage = 2;
      else itemsPerPage = 1;

      pageCount = Math.max(1, Math.ceil(items.length / itemsPerPage));
      // ensure current pageIndex in bounds
      pageIndex = Math.max(0, Math.min(pageIndex, pageCount - 1));
      buildDots();
      update();
    }

    function buildDots(){
      // create container if missing
      if (!dotsContainer) {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        sliderWrapper.parentElement.insertAdjacentElement('beforeend', dotsContainer);
      } else {
        dotsContainer.innerHTML = '';
      }

      for (let i = 0; i < pageCount; i++){
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', `Go to page ${i+1}`);
        btn.addEventListener('click', () => { goToPage(i); resetAutoplay(); });
        if (i === pageIndex) btn.classList.add('active');
        dotsContainer.appendChild(btn);
      }
    }

    function update(){
      // calculate shift based on wrapper width so pages align cleanly
      const gap = parseFloat(getComputedStyle(track).gap || 0);
      const cardRect = items[0].getBoundingClientRect();
      const cardWidth = cardRect.width;
      // total width for one page (itemsPerPage cards + gaps)
      const pageWidth = (cardWidth * itemsPerPage) + (gap * (itemsPerPage - 1));
      const x = -(pageIndex * pageWidth);
      track.style.transform = `translateX(${x}px)`;

      // update active dot
      const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
      dots.forEach((d, i) => d.classList.toggle('active', i === pageIndex));
    }

    function goToPage(i){
      pageIndex = Math.max(0, Math.min(i, pageCount - 1));
      update();
    }

    function nextPage(){ goToPage(pageIndex + 1 >= pageCount ? 0 : pageIndex + 1); }
    function prevPage(){ goToPage(pageIndex - 1 < 0 ? pageCount - 1 : pageIndex - 1); }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevPage(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextPage(); resetAutoplay(); });

    // touch / pointer drag handling
    let startX = 0, dx = 0, isDown = false;
    track.addEventListener('pointerdown', (e) => { isDown = true; startX = e.clientX; track.style.transition = 'none'; track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointermove', (e) => { if (!isDown) return; dx = e.clientX - startX; });
    track.addEventListener('pointerup', (e) => { if (!isDown) return; isDown = false; track.releasePointerCapture(e.pointerId); track.style.transition = ''; if (Math.abs(dx) > 60) { dx < 0 ? nextPage() : prevPage(); } dx = 0; resetAutoplay(); });
    track.addEventListener('pointercancel', () => { isDown = false; dx = 0; });

    // autoplay controls
    function startAutoplay(){ stopAutoplay(); autoplayTimer = setInterval(nextPage, AUTOPLAY_INTERVAL); }
    function stopAutoplay(){ if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
    function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

    // pause on hover / focus
    sliderWrapper.addEventListener('mouseenter', stopAutoplay);
    sliderWrapper.addEventListener('mouseleave', startAutoplay);
    sliderWrapper.addEventListener('focusin', stopAutoplay);
    sliderWrapper.addEventListener('focusout', startAutoplay);

    // keyboard when wrapper focused
    sliderWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prevPage(); resetAutoplay(); }
      if (e.key === 'ArrowRight') { nextPage(); resetAutoplay(); }
    });

    // recalc on resize with debounce
    let rTimer = null;
    function onResize(){ if (rTimer) clearTimeout(rTimer); rTimer = setTimeout(() => { computeLayout(); }, 120); }
    window.addEventListener('resize', onResize);

    // initialize
    computeLayout();
    startAutoplay();

    // if user navigates to a new page (visibility change), stop autoplay when hidden
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAutoplay(); else startAutoplay(); });
  })();
});





