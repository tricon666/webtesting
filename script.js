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

  // Popup contact form logic (show on every visit)
  const popup = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const popupForm = document.getElementById('popupForm');
  const popupFeedback = document.getElementById('popupFeedback');
  if (popup) {
    // Always show popup on page load/visit after a short delay
    setTimeout(() => { popup.style.display = 'flex'; }, 800);

    // Close handlers
    if (closeBtn) closeBtn.addEventListener('click', () => { popup.style.display = 'none'; });
    popup.addEventListener('click', (e) => { if (e.target === popup) { popup.style.display = 'none'; } });

    if (popupForm) {
      popupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (popupFeedback) popupFeedback.textContent = 'Submitting...';
        // Here you could send data to your server. We'll simulate and then close.
        setTimeout(() => {
          if (popupFeedback) popupFeedback.textContent = '✅ Thank you! We’ll contact you soon.';
          popupForm.reset();
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

  // Project brochure buttons (open modal and pass filename)
  let currentBrochureFile = 'bbc.pdf';
  document.querySelectorAll('.project-brochure').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const f = btn.getAttribute('data-file');
      if (f) currentBrochureFile = f;
      openBrochureModal();
    });
  });

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
  a.href = currentBrochureFile || 'bbc.pdf';
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

  // Projects slider was removed — projects are shown as a static grid now.
});





