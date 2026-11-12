(function () {
  const body = document.body;
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("site-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function animateCount(el, target, duration) {
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        if (!isNaN(target)) animateCount(el, target, 1100);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count") || el.textContent;
    });
  }

  function refCode(prefix) {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
    return prefix + s;
  }

  const applyForm = document.getElementById("apply-form");
  if (applyForm) {
    applyForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(applyForm).entries());
      const ref = refCode("IQ-APP-");
      const lines = [
        "Hello Iqra Islamic School, I would like to apply for a place.",
        "",
        "Application reference: " + ref,
        "Pupil name: " + data.pupilName,
        "Date of birth: " + data.dob,
        "Grade applying for: " + data.grade,
        "Parent / guardian: " + data.guardianName,
        "Phone: " + data.phone,
        "Email: " + (data.email || "(not provided)"),
        "Notes: " + (data.notes || "(none)")
      ];
      // WhatsApp target +260975912167 is taken from a public map listing (and the school's Blogspot contact page, where it is listed for the Principal). It has not been confirmed as a WhatsApp number.
      const WA_NUMBER = "260975912167";
      const url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      document.getElementById("apply-ref").textContent = ref;
      document.getElementById("apply-form-wrap").classList.add("hidden");
      document.getElementById("apply-confirm").classList.remove("hidden");
      const waBtn = document.getElementById("apply-wa");
      if (waBtn) waBtn.href = url;
      window.open(url, "_blank", "noopener");
    });
  }

  const EXAMPLE_FEES = {
    "Nursery": 2200,
    "Grade 1": 3000, "Grade 2": 3000, "Grade 3": 3000, "Grade 4": 3000,
    "Grade 5": 3000, "Grade 6": 3000, "Grade 7": 3000,
    "Grade 8": 4200, "Grade 9": 4200, "Grade 10": 4200,
    "Grade 11": 4200, "Grade 12": 4200
  };

  const gradeSelect = document.getElementById("fee-grade");
  const amountInput = document.getElementById("fee-amount");
  if (gradeSelect && amountInput) {
    function syncAmount() {
      const fee = EXAMPLE_FEES[gradeSelect.value];
      if (fee) amountInput.value = fee;
    }
    gradeSelect.addEventListener("change", syncAmount);
    if (!amountInput.value) syncAmount();
  }

  const feesForm = document.getElementById("fees-form");
  if (feesForm) {
    const methodInputs = feesForm.querySelectorAll('input[name="method"]');
    const cardFields = document.getElementById("card-fields");
    const mobileFields = document.getElementById("mobile-fields");

    function updateMethod() {
      const method = (feesForm.querySelector('input[name="method"]:checked') || {}).value;
      const isCard = method === "Card";
      cardFields.classList.toggle("hidden", !isCard);
      mobileFields.classList.toggle("hidden", isCard);
      cardFields.querySelectorAll("input").forEach(function (el) { el.required = isCard; });
      mobileFields.querySelectorAll("input").forEach(function (el) { el.required = !isCard; });
    }
    methodInputs.forEach(function (el) { el.addEventListener("change", updateMethod); });
    updateMethod();

    feesForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(feesForm).entries());
      const ref = refCode("IQ-PAY-");
      const amount = Number(data.amount || 0);
      const formatted = "K" + amount.toLocaleString("en-ZM");
      document.getElementById("rc-ref").textContent = ref;
      document.getElementById("rc-pupil").textContent = data.pupilName;
      document.getElementById("rc-grade").textContent = data.grade;
      document.getElementById("rc-term").textContent = data.term;
      document.getElementById("rc-amount").textContent = formatted;
      document.getElementById("rc-method").textContent = data.method;
      document.getElementById("rc-date").textContent = new Date().toLocaleString("en-ZM", {
        dateStyle: "medium",
        timeStyle: "short"
      });
      document.getElementById("fees-form-wrap").classList.add("hidden");
      document.getElementById("fees-receipt").classList.remove("hidden");
    });
  }

  const printBtn = document.getElementById("print-receipt");
  if (printBtn) {
    printBtn.addEventListener("click", function () { window.print(); });
  }
})();
