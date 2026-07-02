/* ========================================
   Configuration
   ======================================== */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxghgvwuE8kHeItdq-1VSxyXt6EjI7BMkYatOwEupar8s0Wt51RU7PyfmR9CIec3oNv/exec";

/* ========================================
   DOM Ready
   ======================================== */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileNav();
  initReveal();
  initMathBackground();
  initCounters();
  initForm();
  initRipple();
  initFooterYear();
});

/* ========================================
   Navbar Scroll Effect
   ======================================== */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ========================================
   Mobile Navigation
   ======================================== */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  document.body.appendChild(overlay);

  const closeNav = () => {
    links.classList.remove("open");
    overlay.classList.remove("active");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    overlay.classList.toggle("active", isOpen);
  });

  overlay.addEventListener("click", closeNav);

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeNav);
  });
}

/* ========================================
   Scroll Reveal
   ======================================== */
function initReveal() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => observer.observe(el));
}

/* ========================================
   Animated Math Background
   ======================================== */
function initMathBackground() {
  const container = document.getElementById("mathBg");
  if (!container) return;

  const symbols = [
    "∫", "∑", "π", "√", "∞", "Δ", "θ", "λ",
    "x²", "y³", "sin", "cos", "tan", "log",
    "f(x)", "∂", "∇", "±", "÷", "×", "α", "β",
    "∮", "≈", "≠", "≤", "≥", "∈", "∀", "∃",
    "aₙ", "n!", "ℝ", "ℤ", "∪", "∩"
  ];

  function createSymbol() {
    const el = document.createElement("span");
    el.className = "math-symbol";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.fontSize = (1.2 + Math.random() * 2.5) + "rem";
    el.style.animationDuration = (10 + Math.random() * 20) + "s";
    el.style.animationDelay = Math.random() * 5 + "s";
    container.appendChild(el);

    setTimeout(() => el.remove(), 35000);
  }

  // Initial batch
  for (let i = 0; i < 20; i++) {
    setTimeout(createSymbol, i * 300);
  }

  // Continuous generation
  setInterval(createSymbol, 2000);
}

/* ========================================
   Counter Animation
   ======================================== */
function initCounters() {
  const counters = document.querySelectorAll("[data-target]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }

  requestAnimationFrame(tick);
}

/* ========================================
   Form Handling
   ======================================== */
function initForm() {
  const form = document.getElementById("enrollForm");
  const submitBtn = document.getElementById("submitBtn");
  const modal = document.getElementById("successModal");
  const modalClose = document.getElementById("modalClose");

  if (!form) return;

  // Real-time validation
  const fields = ["name", "phone", "grade"];
  fields.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", () => validateField(id));
      input.addEventListener("blur", () => validateField(id));
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all
    let valid = true;
    fields.forEach((id) => {
      if (!validateField(id)) valid = false;
    });

    if (!valid) return;

    // Show loading
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    const data = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      grade: document.getElementById("grade").value,
      notes: document.getElementById("notes").value.trim(),
    };

    try {
      // Send to Google Sheets
      if (SCRIPT_URL) {
        await fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      // Build WhatsApp message
      const msg = encodeURIComponent(
        `السلام عليكم،\nأرغب في حجز مكان.\n\nالاسم: ${data.name}\nرقم الهاتف: ${data.phone}\nالمرحلة: ${data.grade}\nملاحظات: ${data.notes || "لا يوجد"}`
      );

      // Open WhatsApp
      window.open(`https://wa.me/201064829713?text=${msg}`, "_blank");

      // Show success modal
      modal.classList.add("active");

      // Reset form
      form.reset();
    } catch (err) {
      alert("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
      console.error(err);
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });

  // Modal close
  modalClose.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
}

function validateField(id) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById(id + "Error");
  if (!input || !errorEl) return true;

  let valid = true;
  let message = "";

  const value = input.value.trim();

  switch (id) {
    case "name":
      if (!value) { valid = false; message = "الاسم مطلوب"; }
      else if (value.length < 3) { valid = false; message = "الاسم يجب أن يكون 3 أحرف على الأقل"; }
      break;
    case "phone":
      if (!value) { valid = false; message = "رقم الهاتف مطلوب"; }
      else if (!/^01[0-9]{9}$/.test(value)) { valid = false; message = "رقم الهاتف غير صحيح (مثال: 01XXXXXXXXX)"; }
      break;
    case "grade":
      if (!value) { valid = false; message = "اختر المرحلة الدراسية"; }
      break;
  }

  input.classList.toggle("error", !valid);
  errorEl.textContent = message;
  return valid;
}

/* ========================================
   Button Ripple Effect
   ======================================== */
function initRipple() {
  document.querySelectorAll(".btn-ripple").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ========================================
   Footer Year
   ======================================== */
function initFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}
