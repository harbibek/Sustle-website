// ============================================
//  SUSTLE SOLUTIONS — app.js
// ============================================

// ---- Navbar ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
}, { passive: true });

// ---- Burger menu ----
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- Active nav link ----
function updateActiveNav() {
  const sections = ['home','about','services','technologies','careers','contact'];
  const y = window.scrollY + 120;
  sections.forEach(id => {
    const el = document.getElementById(id);
    const lk = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!el || !lk) return;
    lk.classList.toggle('active', y >= el.offsetTop && y < el.offsetTop + el.offsetHeight);
  });
}

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ---- Count-up animation ----
function countUp(el) {
  const target = +el.dataset.target;
  const dur = 1800;
  const start = performance.now();
  const run = now => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(run);
    else el.textContent = target;
  };
  requestAnimationFrame(run);
}

// ---- Intersection Observer (reveal + counters) ----
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('visible');
    en.target.querySelectorAll('.count[data-target]').forEach(countUp);
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .svc-card, .icard').forEach(el => io.observe(el));

// Run hero counters on load
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero-nums .count[data-target]').forEach(countUp);
  }, 600);
});

// ---- Tech tabs ----
document.querySelectorAll('.ttab').forEach(tab => {
  tab.addEventListener('click', () => {
    const id = tab.dataset.tab;
    document.querySelectorAll('.ttab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tpanel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tp-' + id).classList.add('active');
  });
});

// ---- Image thumbnail swap ----
function swapImg(panelId, src, thumb) {
  document.getElementById('timg-' + panelId).src = src;
  document.querySelectorAll(`#tp-${panelId} .tthumb`).forEach(t => t.classList.remove('act'));
  thumb.classList.add('act');
}

// ---- Contact form ----
// OPTION 1: Formspree (recommended — free, no backend needed)
// Replace YOUR_FORM_ID with your actual Formspree form ID from formspree.io
// The form uses method="POST" action="https://formspree.io/f/YOUR_FORM_ID"
// so it works automatically when you add your ID.
//
// OPTION 2: preventDefault for now (shows success message)
document.getElementById('contactForm').addEventListener('submit', function(e) {
  const action = this.action;
  // If Formspree ID not set, prevent and show local success
  if (!action || action.includes('YOUR_FORM_ID')) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    setTimeout(() => {
      document.getElementById('formOk').classList.add('show');
      btn.disabled = false;
      btn.innerHTML = 'Submit Enquiry <i class="fas fa-arrow-right"></i>';
      this.reset();
      setTimeout(() => document.getElementById('formOk').classList.remove('show'), 6000);
    }, 1200);
  }
  // If Formspree ID is set, form submits normally to Formspree
});

// ============================================
//  AI CHATBOT
// ============================================

let chatIsOpen = false;
const SYSTEM_PROMPT = `You are Sustle AI Assistant, a friendly and knowledgeable energy efficiency advisor for Sustle Solutions Private Limited (www.sustle.co.in).

Company overview:
- Technology-driven engineering company for industrial energy efficiency
- ISO 14001:2015 and ISO 9001:2015 certified
- 500+ successful installations across 20+ industrial sectors
- Average energy savings: 30%+

Technologies & savings:
1. Cooling Tower Fan Retrofits (CFD-optimised + PMSM) — 25–50% savings
2. AHU EC Fan Retrofits — 40–50% savings
3. PMSM IE5 Motors — 8–10% savings
4. High-Efficiency Fans & Blowers — 20–40% savings
5. Pumping Solutions — 15–40% savings
6. Thermal Ceramic Coatings — 5–8% fuel savings

Services: Energy Audits, Water Audits, Electrical Safety Audits, Thermography, M&V Monitoring, GHG Accounting, Energy Performance Assessment, Sustainability Consulting

Industries: Automotive, Pharma, Food Processing, Chemicals, Steel, Cement, Textiles, Commercial Buildings, Manufacturing

Contact: vivek@sustle.co.in | +91-7776837700

Respond in 2–4 short sentences. Be warm, professional and helpful. For technical details or pricing, encourage contacting the expert team. If asked about pricing, say it depends on a site assessment and invite them to reach out.`;

function toggleChat() {
  chatIsOpen = !chatIsOpen;
  document.getElementById('chatWin').classList.toggle('open', chatIsOpen);
  const icon = document.getElementById('chatFabIcon');
  icon.className = chatIsOpen ? 'fas fa-times' : 'fas fa-comments';
  if (chatIsOpen) setTimeout(() => document.getElementById('chatIn').focus(), 300);
}

function qPrompt(text) {
  document.getElementById('chatQbtns')?.remove();
  addUserMsg(text);
  getBotReply(text);
}

function sendChat() {
  const inp = document.getElementById('chatIn');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';
  document.getElementById('chatQbtns')?.remove();
  addUserMsg(msg);
  getBotReply(msg);
}

function addUserMsg(text) {
  const msgs = document.getElementById('chatMsgs');
  msgs.insertAdjacentHTML('beforeend',
    `<div class="cmsg user"><div class="cbubble">${esc(text)}</div></div>`);
  msgs.scrollTop = msgs.scrollHeight;
}

function addBotMsg(html) {
  const msgs = document.getElementById('chatMsgs');
  document.querySelector('.typing-indicator')?.remove();
  msgs.insertAdjacentHTML('beforeend',
    `<div class="cmsg bot"><div class="cbubble">${html}</div></div>`);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMsgs');
  msgs.insertAdjacentHTML('beforeend',
    `<div class="cmsg bot typing-indicator"><div class="typing-row"><div class="td"></div><div class="td"></div><div class="td"></div></div></div>`);
  msgs.scrollTop = msgs.scrollHeight;
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

async function getBotReply(userMsg) {
  document.getElementById('chatSendBtn').disabled = true;
  showTyping();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY_HERE',           // ← Replace with your key
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMsg }]
      })
    });

    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const text = data.content?.[0]?.text || "I couldn't process that. Please contact us at vivek@sustle.co.in.";
    addBotMsg(text.replace(/\n/g, '<br>'));
  } catch {
    addBotMsg("I'm having a connection issue right now. Please reach out directly at <a href='mailto:vivek@sustle.co.in' style='color:var(--green)'>vivek@sustle.co.in</a> or call <a href='tel:+917776837700' style='color:var(--green)'>+91-7776837700</a>.");
  } finally {
    document.getElementById('chatSendBtn').disabled = false;
  }
}
