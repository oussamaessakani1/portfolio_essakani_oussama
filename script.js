document.addEventListener('DOMContentLoaded', function () {
  darkMode();
  typingEffect();
  revealSections();
  navBarSticky();
  mobileMenu();
  handleForm();
});

function darkMode() {
  var btn = document.getElementById('btnTheme');
  var moon = document.querySelector('.dark-icon');
  var sun = document.querySelector('.light-icon');
  if (!btn) return;

  var saved = localStorage.getItem('theme');
  var systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (saved === 'light' || (!saved && systemLight)) {
    document.body.classList.add('light-mode');
    moon.style.display = 'none';
    sun.style.display = 'inline-block';
  } else {
    document.body.classList.remove('light-mode');
    moon.style.display = 'inline-block';
    sun.style.display = 'none';
  }

  btn.addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    var isLight = document.body.classList.contains('light-mode');
    if (isLight) {
      localStorage.setItem('theme', 'light');
      moon.style.display = 'none';
      sun.style.display = 'inline-block';
    } else {
      localStorage.setItem('theme', 'dark');
      moon.style.display = 'inline-block';
      sun.style.display = 'none';
    }
  });
}

function navBarSticky() {
  var header = document.querySelector('.navbar');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  var sections = document.querySelectorAll('section');
  var links = document.querySelectorAll('.nav-center a');

  window.addEventListener('scroll', function () {
    var currentId = '';
    for (var s = 0; s < sections.length; s++) {
      var sec = sections[s];
      var top = sec.offsetTop;
      if (window.scrollY >= top - 100) {
        currentId = sec.getAttribute('id');
      }
    }
    for (var i = 0; i < links.length; i++) {
      links[i].classList.remove('active');
      if (links[i].getAttribute('href').includes(currentId)) {
        links[i].classList.add('active');
      }
    }
  });
}

function typingEffect() {
  var el = document.getElementById('typingText');
  if (!el) return;

  var lines = ['Web Designer', 'Brand Strategist', 'Digital Artist', 'UI/UX Expert'];
  var lineColors = [
    'var(--accent-cyan)',
    'var(--accent-purple)',
    '#f59e0b',
    '#10b981',
    '#f43f5e',
    '#3b82f6'
  ];
  var whichLine = 0;
  var pos = 0;
  var goingBack = false;
  var delay = 100;

  el.style.color = lineColors[Math.floor(Math.random() * lineColors.length)];

  function tick() {
    var text = lines[whichLine];

    if (goingBack) {
      el.textContent = text.substring(0, pos - 1);
      pos--;
      delay = 50;
    } else {
      el.textContent = text.substring(0, pos + 1);
      pos++;
      delay = 150;
    }

    if (!goingBack && pos === text.length) {
      goingBack = true;
      delay = 2000;
    } else if (goingBack && pos === 0) {
      goingBack = false;
      whichLine = (whichLine + 1) % lines.length;
      el.style.color = lineColors[Math.floor(Math.random() * lineColors.length)];
      delay = 500;
    }

    setTimeout(tick, delay);
  }

  tick();
}

function revealSections() {
  var options = { threshold: 0.2 };
  var obs = new IntersectionObserver(function (entries) {
    for (var k = 0; k < entries.length; k++) {
      if (entries[k].isIntersecting) {
        entries[k].target.classList.add('active');
      }
    }
  }, options);

  var boxes = document.querySelectorAll('[data-reveal]');
  for (var b = 0; b < boxes.length; b++) {
    obs.observe(boxes[b]);
  }
}

function mobileMenu() {
  var openBtn = document.querySelector('.mobile-toggle');
  var closeBtn = document.querySelector('.menu-close');
  var menu = document.querySelector('.mobile-menu-overlay');
  var items = document.querySelectorAll('.mobile-nav a');

  if (!openBtn || !menu) return;

  function closeMenu() {
    menu.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  openBtn.addEventListener('click', function () {
    menu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }
  for (var m = 0; m < items.length; m++) {
    items[m].addEventListener('click', closeMenu);
  }
}

function handleForm() {
  var f = document.getElementById('contactForm');
  if (!f) return;

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = f.querySelector('.submit-btn');
    var oldLabel = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(function () {
      btn.textContent = 'Message Sent!';
      btn.style.backgroundColor = '#2563eb';
      f.reset();

      setTimeout(function () {
        btn.textContent = oldLabel;
        btn.style.backgroundColor = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}
