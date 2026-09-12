/* ============================================================
   TREK BOOKING DEMO -- Main JavaScript
   ============================================================ */

'use strict';

/* -- Navbar scroll behaviour -- */
(function initNavbar() {
  var navbar = document.querySelector('.main-navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      if (navbar.dataset.transparent === 'true') {
        navbar.classList.remove('scrolled');
        navbar.classList.add('transparent');
      }
    }
  }

  if (navbar.dataset.transparent === 'true') {
    navbar.classList.add('transparent');
  } else {
    navbar.classList.add('solid');
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();

/* -- Active nav link -- */
(function setActiveNav() {
  var links = document.querySelectorAll('.main-navbar .nav-link[data-page]');
  var page  = document.body.dataset.page || '';
  links.forEach(function(l) {
    if (l.dataset.page === page) l.classList.add('active');
  });
})();

/* -- Trek filtering (treks.html) -- */
(function initFilters() {
  var filterForm = document.getElementById('trek-filters');
  if (!filterForm) return;

  var cards = document.querySelectorAll('.trek-card-wrap');

  function applyFilters() {
    var destination = document.getElementById('filter-dest') ? document.getElementById('filter-dest').value : '';
    var difficulty  = document.getElementById('filter-diff') ? document.getElementById('filter-diff').value : '';
    var duration    = document.getElementById('filter-dur')  ? document.getElementById('filter-dur').value  : '';
    var price       = document.getElementById('filter-price')? document.getElementById('filter-price').value: '';

    var visible = 0;
    cards.forEach(function(wrap) {
      var d = wrap.dataset;
      var show = true;
      if (destination && d.destination !== destination) show = false;
      if (difficulty  && d.difficulty  !== difficulty)  show = false;
      if (duration    && d.duration    !== duration)    show = false;
      if (price) {
        var parts = price.split('-');
        var min = Number(parts[0]);
        var max = parts[1] ? Number(parts[1]) : Infinity;
        var p = Number(d.price);
        if (p < min || p > max) show = false;
      }
      wrap.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    var noResult = document.getElementById('no-results');
    if (noResult) noResult.style.display = visible === 0 ? '' : 'none';
    var countEl = document.getElementById('results-count');
    if (countEl) countEl.textContent = visible;
  }

  filterForm.addEventListener('change', applyFilters);

  var resetBtn = document.getElementById('filter-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      filterForm.reset(); applyFilters();
    });
  }
})();

/* -- Gallery switcher (trek-details.html) -- */
(function initGallery() {
  var mainImg = document.getElementById('gallery-main-img');
  var thumbs  = document.querySelectorAll('.gallery-thumb');
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      var img = thumb.querySelector('img');
      if (!img) return;
      mainImg.style.opacity = '0';
      setTimeout(function() {
        mainImg.src = img.src;
        mainImg.style.opacity = '1';
      }, 200);
      thumbs.forEach(function(t) { t.classList.remove('active'); });
      thumb.classList.add('active');
    });
  });
})();

/* -- Booking price calculator (booking.html) -- */
(function initPriceCalc() {
  var travellerInput = document.getElementById('num-travellers');
  var totalEl        = document.getElementById('booking-total');
  var totalLabel     = document.getElementById('total-label');
  if (!travellerInput || !totalEl) return;

  function updateTotal() {
    var pricePerPerson = Number(travellerInput.dataset.price) || 14999;
    var count = Math.max(1, parseInt(travellerInput.value) || 1);
    var total = pricePerPerson * count;
    totalEl.textContent = '\u20b9' + total.toLocaleString('en-IN');
    if (totalLabel) totalLabel.textContent = count;
  }

  travellerInput.addEventListener('input', updateTotal);
  updateTotal();
})();

/* -- Date selection (trek-details.html -> booking.html) -- */
(function initDateSelect() {
  var dateBtns = document.querySelectorAll('.select-date-btn');
  dateBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var date  = btn.dataset.date;
      var price = btn.dataset.price || '14999';
      var seats = btn.dataset.seats || '10';
      if (date) {
        window.location.href = 'booking.html?date=' + encodeURIComponent(date) + '&price=' + price + '&seats=' + seats;
      }
    });
  });
})();

/* -- Booking page -- read URL params -- */
(function initBookingParams() {
  if (!document.body.classList.contains('booking-page')) return;
  var params  = new URLSearchParams(window.location.search);
  var date    = params.get('date')  || '18 October 2026';
  var price   = Number(params.get('price')) || 14999;
  var seats   = params.get('seats') || '8';

  var dateEl  = document.getElementById('selected-date');
  var priceEl = document.getElementById('price-per-person');
  var seatsEl = document.getElementById('seats-available');
  var travellerInput = document.getElementById('num-travellers');

  if (dateEl)  dateEl.textContent  = date;
  if (priceEl) priceEl.textContent = '\u20b9' + price.toLocaleString('en-IN');
  if (seatsEl) seatsEl.textContent = seats + ' seats left';
  if (travellerInput) {
    travellerInput.dataset.price = price;
    travellerInput.max = seats;
    travellerInput.dispatchEvent(new Event('input'));
  }
})();

/* -- Payment method selection -- */
(function initPaymentOptions() {
  var options = document.querySelectorAll('.payment-option');
  options.forEach(function(opt) {
    opt.addEventListener('click', function() {
      options.forEach(function(o) { o.classList.remove('active'); });
      opt.classList.add('active');
      var radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
})();

/* -- Booking form submit / fake payment -- */
(function initBookingSubmit() {
  var form    = document.getElementById('booking-form');
  var overlay = document.getElementById('loading-overlay');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    if (overlay) overlay.classList.add('show');
    setTimeout(function() {
      window.location.href = 'confirmation.html';
    }, 2200);
  });
})();

/* -- Admin sidebar toggle (mobile) -- */
(function initAdminSidebar() {
  var toggleBtn = document.getElementById('sidebar-toggle');
  var sidebar   = document.querySelector('.admin-sidebar');
  var overlay   = document.getElementById('sidebar-overlay');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    if (overlay) overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
  });
  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.style.display = 'none';
    });
  }
})();

/* -- Trek card "View Details" links -- */
(function initTrekLinks() {
  document.querySelectorAll('.trek-details-link').forEach(function(btn) {
    btn.addEventListener('click', function() {
      window.location.href = 'trek-details.html';
    });
  });
})();

/* -- Smooth scroll for anchor links -- */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
