document.addEventListener('DOMContentLoaded', function () {
  // set year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  function toggleMobileNav(open) {
    if (!mobileNav) return;
    const expanded = open === undefined ? (mobileNav.classList.toggle('active')) : open;
    const isActive = mobileNav.classList.contains('active');
    mobileNav.style.display = isActive ? 'flex' : 'none';
    if (hamburger) hamburger.setAttribute('aria-expanded', String(isActive));
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMobileNav());
  }

  // Close mobile nav when a link is clicked
  document.querySelectorAll('#mobileNav a').forEach(a => {
    a.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        mobileNav.style.display = 'none';
        if (hamburger) hamburger.setAttribute('aria-expanded','false');
      }
    });
  });

  // simple form handler (simulation)
  const form = document.getElementById('leadForm');
  const feedback = document.getElementById('formFeedback');

  function validateForm() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!name) return 'Please enter your name.';
    if (!phone || phone.length < 7) return 'Please enter a valid phone number.';
    if (!email || !/.+@.+\..+/.test(email)) return 'Please enter a valid email address.';
    return '';
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!feedback) return;
      feedback.textContent = '';
      const err = validateForm();
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
});
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // ===== POPUP LOGIC =====
  const popup = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const popupForm = document.getElementById('popupForm');
  const popupFeedback = document.getElementById('popupFeedback');

  // Show popup after 3 seconds
  setTimeout(() => {
    popup.style.display = 'flex';
  }, 1000);

  // Close popup
  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // Close when clicking outside box
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

  // Handle popup form submission
  popupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    popupFeedback.textContent = "Submitting...";
    setTimeout(() => {
      popupFeedback.textContent = "✅ Thank you! We’ll contact you soon.";
      popupForm.reset();
    }, 1000);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // ===== MOBILE NAV TOGGLE =====
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
  });

  // Close menu when clicking a link
  document.querySelectorAll('.nav.mobile a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileNav.classList.toggle("active");
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav.mobile a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileNav.classList.remove("active");
    });
  });
});





