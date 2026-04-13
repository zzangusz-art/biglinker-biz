/* ======================================================
   BigLinker Biz — Shared JS
   Modules: SocialProofToasts · ScrollReveal · FloatingCTA · UrgencyCounter
====================================================== */

/* ── 1. Social Proof Toast System ─────────────────── */
class SocialProofToasts {
  constructor() {
    this.visitorEl  = document.getElementById('sp-visitor');
    this.successEl  = document.getElementById('sp-success');
    this.countEl    = document.getElementById('sp-visitor-count');
    this.VISITOR_BASE = 12;

    this.SUCCESS_POOL = [
      { name: '박○○ 담당자', action: '기업 AI 활용 과정 완료', time: '방금 전' },
      { name: '김○○ 팀장', action: '면접관 역량강화 교육 이수', time: '6분 전' },
      { name: '이○○ 담당자', action: '리더십 코칭 프로그램 완료', time: '14분 전' },
      { name: '최○○ 매니저', action: '고객서비스 역량강화 수료', time: '22분 전' },
      { name: '정○○ 대리', action: 'AI 상향평준화 교육 이수', time: '33분 전' },
      { name: '강○○ 과장', action: '비즈니스 매너·스피치 완료', time: '45분 전' },
      { name: '윤○○ 차장', action: '디지털 디톡스 교육 수료', time: '58분 전' },
      { name: '장○○ 부장', action: '조직 리더십 코칭 완료', time: '1시간 전' },
    ];

    this._shuffle(this.SUCCESS_POOL);
    this.poolIndex = 0;
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  init() {
    if (!this.visitorEl || !this.successEl) return;
    setTimeout(() => this._showVisitor(), 1500);
    setTimeout(() => this._cycleSuccess(), 6000);
  }

  _showVisitor() {
    const count = this.VISITOR_BASE + Math.floor(Math.random() * 5) - 2;
    this.countEl.textContent = count;
    this.visitorEl.classList.remove('is-hidden');
    this.visitorEl.classList.add('is-visible');

    setInterval(() => {
      const cur   = parseInt(this.countEl.textContent, 10);
      const delta = Math.random() > 0.5 ? 1 : -1;
      this.countEl.textContent = Math.max(6, Math.min(22, cur + delta));
    }, 28000 + Math.random() * 12000);
  }

  _cycleSuccess() {
    const data = this.SUCCESS_POOL[this.poolIndex % this.SUCCESS_POOL.length];
    this.poolIndex++;

    this.successEl.querySelector('.sp-toast__name').textContent   = data.name;
    this.successEl.querySelector('.sp-toast__action').textContent = data.action;
    this.successEl.querySelector('.sp-toast__time').textContent   = data.time;
    this.successEl.querySelector('.sp-toast__avatar').textContent = data.name[0];

    this.successEl.classList.remove('is-hidden');
    this.successEl.classList.add('is-visible');

    setTimeout(() => {
      this.successEl.classList.remove('is-visible');
      this.successEl.classList.add('is-hidden');
    }, 6000);

    const nextDelay = 18000 + Math.random() * 16000;
    setTimeout(() => this._cycleSuccess(), nextDelay + 6500);
  }
}


/* ── 2. Scroll Reveal ──────────────────────────────── */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  items.forEach((el) => observer.observe(el));
}


/* ── 3. Floating CTA ───────────────────────────────── */
function initFloatingCTA() {
  const heroActions = document.querySelector('.hero-actions, .hero .btn-primary');
  const floatingCta = document.querySelector('.mobile-floating-cta');
  if (!heroActions || !floatingCta) return;

  const observer = new IntersectionObserver(([entry]) => {
    floatingCta.classList.toggle('is-floating-active', !entry.isIntersecting);
  }, { threshold: 0 });

  observer.observe(heroActions);
}


/* ── 4. Urgency Counter ────────────────────────────── */
function initUrgencyCounter() {
  const el = document.getElementById('urgency-spots');
  if (!el) return;

  const MAP = {
    'enterprise-ai-training':          { spots: 5, month: '5월' },
    'interviewer-training':            { spots: 4, month: '5월' },
    'cs-training':                     { spots: 6, month: '5월' },
    'customer-service-training':       { spots: 3, month: '5월' },
    'digital-detox-training':          { spots: 7, month: '5월' },
    'leadership-training':             { spots: 4, month: '5월' },
    'business-manner-speech-training': { spots: 5, month: '5월' },
  };

  const path = window.location.pathname;
  const key  = Object.keys(MAP).find((k) => path.includes(k));
  if (!key) return;

  const { spots, month } = MAP[key];
  el.textContent = `이번 달 잔여 ${spots}자리`;

  const bandText = el.closest('.urgency-band__text');
  if (bandText) {
    const suffix = bandText.querySelector('.urgency-month');
    if (suffix) suffix.textContent = `${month} 신청 마감 임박`;
  }
}


/* ── Biz Mobile Menu Toggle ────────────────────────── */
function initBizMobileMenu() {
  const toggleBtn  = document.getElementById('bizMenuToggle');
  const menuPanel  = document.getElementById('bizMenuPanel');
  const menuLabel  = document.getElementById('bizMenuLabel');
  if (!toggleBtn || !menuPanel) return;

  /* Set label from active tab */
  const activeTab = menuPanel.querySelector('.category-tab.is-active');
  if (activeTab && menuLabel) {
    menuLabel.textContent = activeTab.textContent.trim();
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = !menuPanel.hidden;
    menuPanel.hidden = isOpen;
    toggleBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  /* Close on item click */
  menuPanel.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      menuPanel.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ── Init ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  new SocialProofToasts().init();
  initScrollReveal();
  initFloatingCTA();
  initUrgencyCounter();
  initBizMobileMenu();
});
