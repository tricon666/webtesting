// UPDATED script.js — includes Google Sheets submission logic
document.addEventListener('DOMContentLoaded', function () {
  // ========== Brochure Modal Creation ========== 
  // Helper to create and show the brochure modal
  function showBrochureModal(pdfFile) {
    // Remove any existing modal
    const oldModal = document.getElementById('brochureModalOverlay');
    if (oldModal) oldModal.remove();

    // Modal HTML
    const modal = document.createElement('div');
    modal.id = 'brochureModalOverlay';
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="popup-box">
        <button class="popup-close" id="brochureModalClose" aria-label="Close">&times;</button>
        <h2>Download Brochure</h2>
        <form id="brochureForm" class="popup-form">
          <input type="text" name="bname" id="bname" placeholder="Name" required />
          <input type="email" name="bemail" id="bemail" placeholder="Email" required />
          <input type="tel" name="bphone" id="bphone" placeholder="Phone" required />
          <button type="submit">Download</button>
        </form>
        <p id="bFeedback" class="popup-feedback"></p>
      </div>
    `;
    document.body.appendChild(modal);

    // Close logic
    modal.querySelector('#brochureModalClose').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    // Attach form handler
    const bf = modal.querySelector('#brochureForm');
    const bfb = modal.querySelector('#bFeedback');
    bf.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (bfb) bfb.textContent = '';
      const nameEl = modal.querySelector('#bname');
      const phoneEl = modal.querySelector('#bphone');
      const emailEl = modal.querySelector('#bemail');
      const err = validateFormFields(nameEl, phoneEl, emailEl);
      if (err) { if (bfb) { bfb.style.color = 'crimson'; bfb.textContent = err; } return; }

      if (bfb) { bfb.style.color = 'black'; bfb.textContent = 'Preparing download...'; }
      // Use brochureScriptURL for brochure form
      const result = await submitToSheet(bf, 'brochureForm', bfb, {
        project: 'Brochure Request',
        message: 'Requested brochure: ' + (pdfFile || 'unknown')
      }, brochureScriptURL);
      if (result.ok) {
        // trigger download
        const a = document.createElement('a');
        a.href = pdfFile || 'bbc.pdf';
        a.download = 'Brochure.pdf';
        document.body.appendChild(a); a.click(); a.remove();
        if (bfb) { bfb.style.color = 'green'; bfb.textContent = '✅ Download starting...'; }
        setTimeout(() => { modal.remove(); }, 1200);
      }
    });
  }
  // ========== Brochure Download Button Logic ========== 
  // For main hero button
  const mainBrochureBtn = document.getElementById('downloadBrochure');
  if (mainBrochureBtn) {
    mainBrochureBtn.addEventListener('click', function (e) {
      e.preventDefault();
      showBrochureModal('bbc.pdf'); // Default main brochure
    });
  }
  // For offer cards and project cards
  document.querySelectorAll('button[id^="offerBrochure"], a.project-brochure').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      // For <a> tags, get data-file attribute
      let file = btn.getAttribute('data-file') || 'bbc.pdf';
      showBrochureModal(file);
    });
  });
  // ========== CONFIG ========== 
  // Main contact form Google Apps Script Web App URL
  const scriptURL = "https://script.google.com/macros/s/AKfycbzTHRBoFCLU_m8QTS3is74kn45WsPPtZ8Ahf-LlTsVZWRx7UUhYCFk7HNEJ9pU7NIL1/exec";
  // Popup form Google Apps Script Web App URL (replace with your own)
  const popupScriptURL = "https://script.google.com/macros/s/AKfycbw-7-ahgizClgn39cH33AqOFlpHIcz9cl_mqpUi240RxgJnbXsysnV144hXB-mFyv_B/exec";
  // Brochure form Google Apps Script Web App URL (replace with your own)
  const brochureScriptURL = "https://script.google.com/macros/s/AKfycbwnYKgIADwIW0gDKaUm5WgKdUqB5lCzJs6ONIP6oaOmAJG22TdgyoxdtR5sGGb5vCo/exec";

  // ========== Year ==========
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ========== Banner Image Loading Optimization ==========
  // Ensure banner images load properly on all devices
  const bannerImages = document.querySelectorAll('.banner-slide img');
  bannerImages.forEach(img => {
    // Add loading optimization
    img.style.transition = 'opacity 0.3s ease';
    img.style.opacity = '0';
    
    const handleImageLoad = () => {
      img.style.opacity = '1';
    };
    
    if (img.complete) {
      handleImageLoad();
    } else {
      img.addEventListener('load', handleImageLoad);
      img.addEventListener('error', () => {
        console.warn('Banner image failed to load:', img.src);
        img.style.opacity = '1'; // Show anyway to prevent blank space
      });
    }
  });

  // ========== Mobile nav toggle (existing) ==========
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
  document.querySelectorAll('#mobileNav a').forEach(a => {
    a.addEventListener('click', () => {
      if (mobileNav && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active'); mobileNav.style.display = 'none';
        if (hamburger) hamburger.classList.remove('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // ========== Validation helper ==========
  function validateFormFields(nameEl, phoneEl, emailEl) {
  const name = nameEl && nameEl.value ? nameEl.value.trim() : '';
  const phone = phoneEl && phoneEl.value ? phoneEl.value.trim() : '';
  const email = emailEl && emailEl.value ? emailEl.value.trim() : '';
  if (!name) return 'Please enter your name.';
  if (!phone || phone.length < 7) return 'Please enter a valid phone number.';
  // Improved email validation: allow common cases, but don't block on minor format
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address.';
  return '';
  }

  // ========== Submit helper: sends FormData to Apps Script ==========
  async function submitToSheet(formEl, sourceLabel = 'website', feedbackEl = null, extraData = {}, customURL) {
    if (!formEl) return { ok: false, message: 'No form element' };

    // Disable submit buttons inside the form
    const submitButtons = formEl.querySelectorAll('[type="submit"]');
    submitButtons.forEach(b => b.disabled = true);

    // Build FormData and normalize names where helpful
    const fd = new FormData(formEl);

    // If brochure form uses bname/bphone/bemail, also append normalized keys
    if (fd.has('bname') && !fd.has('name')) fd.append('name', fd.get('bname'));
    if (fd.has('bphone') && !fd.has('phone')) fd.append('phone', fd.get('bphone'));
    if (fd.has('bemail') && !fd.has('email')) fd.append('email', fd.get('bemail'));

    // Ensure the source is set
    fd.set('source', sourceLabel);

    // Add any extra data (like file name of brochure)
    Object.keys(extraData || {}).forEach(k => fd.set(k, extraData[k]));

    // Use customURL if provided, otherwise default to scriptURL
    const urlToUse = customURL || scriptURL;

    try {
      const res = await fetch(urlToUse, { method: 'POST', body: fd });
      // Parse JSON if possible
      let data = null;
      try { data = await res.json(); } catch (err) { data = null; }

      if (res.ok && (!data || data.result === 'success')) {
        if (feedbackEl) { feedbackEl.style.color = 'green'; feedbackEl.textContent = '✅ Thank you! We received your details.'; }
        formEl.reset();
        submitButtons.forEach(b => b.disabled = false);
        return { ok: true, data };
      } else {
        const msg = (data && data.message) ? data.message : `Submission failed (status ${res.status})`;
        if (feedbackEl) { feedbackEl.style.color = 'crimson'; feedbackEl.textContent = '❌ ' + msg; }
        submitButtons.forEach(b => b.disabled = false);
        return { ok: false, message: msg };
      }
    } catch (err) {
      console.error('submitToSheet error:', err);
      if (feedbackEl) { feedbackEl.style.color = 'crimson'; feedbackEl.textContent = '❌ Submission failed. Please try again later.'; }
      submitButtons.forEach(b => b.disabled = false);
      return { ok: false, message: err.message || String(err) };
    }
  }

  // ========== Lead form handling (main form) ==========
  const form = document.getElementById('leadForm');
  const feedback = document.getElementById('formFeedback');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!feedback) return;
      feedback.textContent = '';
      // Validate using inputs in the form
      const err = validateFormFields(document.getElementById('name'), document.getElementById('phone'), document.getElementById('email'));
      if (err) { feedback.style.color = 'crimson'; feedback.textContent = err; return; }

      feedback.style.color = 'black'; feedback.textContent = 'Submitting...';
      // Send to Google Sheets
      const result = await submitToSheet(form, 'leadForm', feedback);
      if (result.ok) {
        // success message already set by submitToSheet
      }
    });
  }

  // ========== Customer Feedback Form ==========
  (function initFeedbackForm() {
    const fbForm = document.getElementById('feedbackForm');
    const fbList = document.getElementById('feedbackList');
    const fbFeedback = document.getElementById('feedbackFormFeedback');
    const ratingInput = document.getElementById('rating');
    const ratingStars = document.getElementById('ratingStars');

    if (!fbForm) return;

    // Build 5-star rating UI (accessible radio-like buttons)
    function buildStars(initial = 5) {
      ratingStars.innerHTML = '';
      for (let i = 5; i >= 1; i--) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'star';
        btn.setAttribute('data-value', String(i));
        btn.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', String(i === initial));
        btn.innerHTML = '★';
        btn.style.cssText = 'font-size:24px;background:none;border:none;cursor:pointer;color:#ffd055;padding:2px;';
        btn.addEventListener('click', () => {
          ratingInput.value = String(i);
          updateStars(i);
        });
        ratingStars.appendChild(btn);
      }
      updateStars(initial);
    }

    function updateStars(value) {
      Array.from(ratingStars.children).forEach((el) => {
        const v = Number(el.getAttribute('data-value'));
        el.setAttribute('aria-checked', String(v === Number(value)));
        el.style.opacity = v <= Number(value) ? '1' : '0.45';
      });
    }

    buildStars(Number(ratingInput ? ratingInput.value : 5));

    // --- UX improvements: char counter and submit enable/disable ---
    const charCountEl = document.getElementById('charCount');
    const submitButton = fbForm.querySelector('[type="submit"]');

    function updateSubmitState() {
      const nameFilled = !!(document.getElementById('fb_name') && document.getElementById('fb_name').value.trim());
      const reviewFilled = !!(document.getElementById('fb_review') && document.getElementById('fb_review').value.trim());
      if (submitButton) submitButton.disabled = !(nameFilled && reviewFilled);
    }

    if (charCountEl) {
      const reviewEl = document.getElementById('fb_review');
      const update = () => { if (charCountEl && reviewEl) charCountEl.textContent = `${reviewEl.value.length}/500`; };
      if (reviewEl) {
        reviewEl.addEventListener('input', () => { update(); updateSubmitState(); });
        update();
      }
    }

    // show placeholder if no feedback yet
    const fbListPlaceholderId = 'feedbackPlaceholder';
    function ensurePlaceholder() {
      const list = document.getElementById('feedbackList');
      if (!list) return;
      if (!list.firstElementChild) {
        const ph = document.createElement('div');
        ph.id = fbListPlaceholderId;
        ph.style.cssText = 'padding:18px;border-radius:12px;background:#fff;text-align:center;color:#90a4ae;border:1px dashed #e6eef5';
        ph.textContent = 'No feedback yet — be the first to share your experience.';
        list.appendChild(ph);
      } else {
        const existing = document.getElementById(fbListPlaceholderId);
        if (existing) existing.remove();
      }
    }

    ensurePlaceholder();

    // Render a feedback item in the list
    function renderFeedbackItem(item) {
      const wrap = document.createElement('article');
      wrap.className = 'feedback-item animate-in';



      let name = (item.name || '').trim();
      const rating = Number(item.rating) || 5;
      let review = item.review || '';

      // If name missing, try to derive from email (local-part), otherwise fall back to 'Guest'
      if (!name) {
        if (item.email && String(item.email).includes('@')) {
          name = String(item.email).split('@')[0].replace(/[._\-]/g, ' ');
        } else {
          name = 'Guest';
        }
      }

      // build initials for avatar (first two letters of words)
      const initials = String(name).trim().split(/\s+/).map(s => s[0] || '').slice(0,2).join('').toUpperCase() || 'G';

      // build star string (max 5)
      const stars = '★'.repeat(Math.max(1, Math.min(5, rating)));

      wrap.innerHTML = `
        <div class="avatar" aria-hidden="true">${escapeHtml(initials)}</div>
        <div class="meta">
          <div class="head">
            <div class="name">${escapeHtml(name)}</div>
            <div class="stars" aria-hidden="true">${stars}</div>
          </div>
          <div class="review">${escapeHtml(review)}</div>
        </div>
      `;

  // prepend new item and remove placeholder if present
  const placeholder = document.getElementById('feedbackPlaceholder');
  if (placeholder) placeholder.remove();
  // clamp review length for display
  if (review.length > 1000) review = review.slice(0, 1000) + '...';
  fbList.insertBefore(wrap, fbList.firstChild);

      // remove animation class after it finishes to keep DOM clean
      setTimeout(() => { wrap.classList.remove('animate-in'); }, 900);
    }

    // Basic HTML escape to avoid injection when rendering locally
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // Feedback form submit handler
    fbForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (fbFeedback) { fbFeedback.textContent = ''; }

      const nameEl = document.getElementById('fb_name');
      const emailEl = document.getElementById('fb_email');
      const reviewEl = document.getElementById('fb_review');
      const ratingVal = Number(document.getElementById('rating').value || 5);

      // Minimal validation
      if (!nameEl || !reviewEl) {
        if (fbFeedback) { fbFeedback.style.color = 'crimson'; fbFeedback.textContent = 'Form error. Please reload the page.'; }
        return;
      }
      if (!nameEl.value.trim()) {
        if (fbFeedback) { fbFeedback.style.color = 'crimson'; fbFeedback.textContent = 'Please enter your name.'; }
        return;
      }
      if (!reviewEl.value.trim()) {
        if (fbFeedback) { fbFeedback.style.color = 'crimson'; fbFeedback.textContent = 'Please write a short review.'; }
        return;
      }

      if (fbFeedback) { fbFeedback.style.color = 'black'; fbFeedback.textContent = 'Submitting...'; }


      
  // form fields are present on the form element (name, email, rating, review)
  // submitToSheet will build FormData from the form, so no manual FormData needed here.

      // Disable submit button
      const submitBtn = fbForm.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const result = await submitToSheet(fbForm, 'feedbackForm', fbFeedback, {
          project: 'Website Feedback',
          message: reviewEl.value.trim()
        });

        if (result.ok) {
          // Render locally
          renderFeedbackItem({ name: nameEl.value.trim(), rating: ratingVal, review: reviewEl.value.trim() });
          if (fbFeedback) { fbFeedback.style.color = 'green'; fbFeedback.textContent = 'Thank you for your feedback!'; }
          fbForm.reset();
          // reset stars to 5
          ratingInput.value = '5';
          buildStars(5);
        }
      } catch (err) {
        console.error('Feedback submit error', err);
        if (fbFeedback) { fbFeedback.style.color = 'crimson'; fbFeedback.textContent = 'Submission failed. Please try again later.'; }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

  })();

  // ========== Popup contact form ==========
  const popup = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const popupForm = document.getElementById('popupForm');
  const popupFeedback = document.getElementById('popupFeedback');
  if (popup) {
    setTimeout(() => { popup.style.display = 'flex'; }, 1000);
    if (closeBtn) closeBtn.addEventListener('click', () => { popup.style.display = 'none'; });
    popup.addEventListener('click', (e) => { if (e.target === popup) popup.style.display = 'none'; });

    if (popupForm) {
      popupForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (popupFeedback) popupFeedback.textContent = 'Submitting...';
        let nameEl = popupForm.querySelector('#popup_name');
        let emailEl = popupForm.querySelector('#popup_email');
        let phoneEl = popupForm.querySelector('#popup_phone');
        let messageEl = popupForm.querySelector('#popup_message');

        // If still missing, show a clear error
        if (!nameEl || !phoneEl || !emailEl) {
          if (popupFeedback) {
            popupFeedback.style.color = 'crimson';
            popupFeedback.textContent = 'Form error: Could not find all input fields. Please check the form HTML.';
          }
          console.error('Popup form input fields missing:', { nameEl, emailEl, phoneEl });
          return;
        }

        const err = validateFormFields(nameEl, phoneEl, emailEl);
        if (err) {
          if (popupFeedback) {
            popupFeedback.style.color = 'crimson';
            popupFeedback.textContent = err;
          }
          console.error('Popup form validation error:', err);
          return;
        }

        // Build FormData manually for Google Sheet, send both normalized and variant field names
        const fd = new FormData();
        fd.append('name', nameEl.value.trim());
        fd.append('popup_name', nameEl.value.trim());
        fd.append('email', emailEl.value.trim());
        fd.append('popup_email', emailEl.value.trim());
        fd.append('phone', phoneEl.value.trim());
        fd.append('popup_phone', phoneEl.value.trim());
        fd.append('message', messageEl ? messageEl.value.trim() : '');
        fd.append('popup_message', messageEl ? messageEl.value.trim() : '');
        fd.append('source', 'popupForm');

        // Disable submit button
        const submitBtn = popupForm.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
          const res = await fetch(popupScriptURL, { method: 'POST', body: fd });
          let data = null;
          try { data = await res.json(); } catch (err) { data = null; }
          if (res.ok && (!data || data.result === 'success')) {
            if (popupFeedback) {
              popupFeedback.style.color = 'green';
              popupFeedback.textContent = 'Thank you for submitting!';
            }
            popupForm.reset();
            if (submitBtn) submitBtn.disabled = false;
            setTimeout(() => { popup.style.display = 'none'; }, 1200);
          } else {
            const msg = (data && data.message) ? data.message : `Submission failed (status ${res.status})`;
            if (popupFeedback) {
              popupFeedback.style.color = 'crimson';
              popupFeedback.textContent = '❌ ' + msg;
            }
            console.error('Popup form submission error:', msg, res);
            if (submitBtn) submitBtn.disabled = false;
          }
        } catch (err) {
          if (popupFeedback) {
            popupFeedback.style.color = 'crimson';
            popupFeedback.textContent = '❌ Submission failed. Please try again later.';
          }
          console.error('Popup form fetch error:', err);
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }
  }

  // ========== Brochure modal (your existing dynamic modal) ==========
  // The script you shared creates the modal overlay and the form with IDs: brochureForm, bname, bphone, bemail
  // We'll hook into that form's submit event to send to Google Sheets, then trigger the download.

  // Elements were dynamically created in your original code; re-query them now:
  const brochureForm = document.getElementById('brochureForm'); // dynamically created
  const bFeedback = document.getElementById('bFeedback');
  let currentBrochureFile = window.currentBrochureFile || 'bbc.pdf'; // fallback

  // If the brochure modal is created after DOMContentLoaded, the handlers above won't see it.
  // So poll once to attach handler if it's added later:
  function attachBrochureHandler() {
    const bf = document.getElementById('brochureForm');
    if (!bf) return;
    const bfb = document.getElementById('bFeedback');
    bf.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (bfb) bfb.textContent = '';
      // Use bname, bphone, bemail for brochure form
      const nameEl = document.getElementById('bname');
      const phoneEl = document.getElementById('bphone');
      const emailEl = document.getElementById('bemail');
      const err = validateFormFields(nameEl, phoneEl, emailEl);
      if (err) { if (bfb) { bfb.style.color = 'crimson'; bfb.textContent = err; } return; }

      if (bfb) { bfb.style.color = 'black'; bfb.textContent = 'Preparing download...'; }
      // Use brochureScriptURL for brochure form
      const result = await submitToSheet(bf, 'brochureForm', bfb, {
        project: 'Brochure Request',
        message: 'Requested brochure: ' + (currentBrochureFile || 'unknown')
      }, brochureScriptURL);
      if (result.ok) {
        // trigger download
        const a = document.createElement('a');
        a.href = currentBrochureFile || 'bbc.pdf';
        a.download = 'Brochure.pdf';
        document.body.appendChild(a); a.click(); a.remove();
        // close modal after a short delay
        setTimeout(() => {
          const modalOverlay = document.querySelector('.modal-overlay');
          if (modalOverlay) modalOverlay.style.display = 'none';
          if (bfb) bfb.textContent = '';
          bf.reset();
        }, 1100);
      }
    });
  }

  // Attempt attach now and again later (in case modal is injected dynamically)
  attachBrochureHandler();
  setTimeout(attachBrochureHandler, 600);
  setTimeout(attachBrochureHandler, 1500);

  // ========== Menu-toggle PNG (if present) - keep in sync ==========
  const menuToggle = document.getElementById('menuToggle');
  const iconHamburger = document.getElementById('iconHamburger');
  const iconClose = document.getElementById('iconClose');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = mobileNav.classList.toggle('active');
      mobileNav.style.display = isOpen ? 'flex' : 'none';
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      if (hamburger) hamburger.classList.toggle('active', isOpen);
      if (hamburger) hamburger.setAttribute('aria-expanded', String(isOpen));
      if (iconHamburger) iconHamburger.style.display = isOpen ? 'none' : '';
      if (iconClose) iconClose.style.display = isOpen ? '' : 'none';
    });
  }

  // ===== Banner Navigation Indicators (optional) =====
  const bannerSection = document.querySelector('.banner-section');
  const bannerTrack = document.querySelector('.banner-track');
  if (bannerSection && bannerTrack) {
    const slides = bannerTrack.querySelectorAll('.banner-slide');
    if (slides.length > 1) {
      // Create navigation dots
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'banner-dots';
      dotsContainer.style.cssText = `
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        z-index: 10;
      `;
      
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'banner-dot';
        dot.style.cssText = `
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: background 0.3s ease;
        `;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        
        dot.addEventListener('click', () => {
          const track = document.querySelector('.banner-track');
          if (track) {
            const slideWidth = track.offsetWidth;
            track.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
          }
        });
        
        dotsContainer.appendChild(dot);
      });
      
      bannerSection.style.position = 'relative';
      bannerSection.appendChild(dotsContainer);
      
      // Update active dot on scroll
      bannerTrack.addEventListener('scroll', () => {
        const scrollLeft = bannerTrack.scrollLeft;
        const slideWidth = bannerTrack.offsetWidth;
        const activeIndex = Math.round(scrollLeft / slideWidth);
        
        dotsContainer.querySelectorAll('.banner-dot').forEach((dot, index) => {
          dot.style.background = index === activeIndex ? 
            'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)';
        });
      }, { passive: true });
    }
  }

  // Done DOMContentLoaded
});


// ===== Banner auto-scroll with touch support =====
document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.banner-track');
  if (!track) return;
  let autoTimer = null;
  const slides = Array.from(track.children);
  let idx = 0;
  let isUserInteracting = false;
  let touchStartX = 0;
  let touchStartTime = 0;

  function goTo(i){
    idx = (i + slides.length) % slides.length;
    const slide = slides[idx];
    // compute target scrollLeft relative to the track (robust to gaps/padding)
    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const left = (slideRect.left - trackRect.left) + track.scrollLeft;
    track.scrollTo({ left, behavior: 'smooth' });
  }

  function startAuto(){ 
    if (!isUserInteracting) {
      autoTimer = setInterval(()=> goTo(idx+1), 8000); 
    }
  }
  function stopAuto(){ 
    if (autoTimer) { 
      clearInterval(autoTimer); 
      autoTimer = null; 
    } 
  }

  // Mouse events
  track.addEventListener('mouseenter', () => {
    isUserInteracting = true;
    stopAuto();
  });
  track.addEventListener('mouseleave', () => {
    isUserInteracting = false;
    setTimeout(startAuto, 1000);
  });

  // Touch events for mobile/tablet
  track.addEventListener('touchstart', (e) => {
    isUserInteracting = true;
    stopAuto();
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndTime = Date.now();
    const deltaX = touchStartX - touchEndX;
    const deltaTime = touchEndTime - touchStartTime;
    
    // Detect swipe gesture (minimum distance and maximum time)
    if (Math.abs(deltaX) > 50 && deltaTime < 300) {
      if (deltaX > 0) {
        // Swipe left - next slide
        goTo(idx + 1);
      } else {
        // Swipe right - previous slide
        goTo(idx - 1);
      }
    }
    
    // Resume auto-scroll after user interaction
    setTimeout(() => {
      isUserInteracting = false;
      startAuto();
    }, 3000);
  }, { passive: true });

  // Scroll event to update current slide index
  track.addEventListener('scroll', () => {
    const scrollLeft = track.scrollLeft;
    const slideWidth = track.offsetWidth;
    const newIdx = Math.round(scrollLeft / slideWidth);
    if (newIdx !== idx && newIdx >= 0 && newIdx < slides.length) {
      idx = newIdx;
    }
  }, { passive: true });

  // Focus events
  track.addEventListener('focusin', () => {
    isUserInteracting = true;
    stopAuto();
  });
  track.addEventListener('focusout', () => {
    isUserInteracting = false;
    setTimeout(startAuto, 1000);
  });

  // Pause on visibility change (when tab is not active)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAuto();
    } else if (!isUserInteracting) {
      setTimeout(startAuto, 1000);
    }
  });

  // Recompute slides on resize
  window.addEventListener('resize', () => {
    // Reset to current slide position after resize
    setTimeout(() => goTo(idx), 100);
  });

  // Start auto-scroll
  startAuto();
});
