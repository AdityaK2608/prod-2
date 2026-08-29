/* Production security guardrails. This is defense-in-depth only; GitHub Pages cannot make the browser a trusted authority. */
(() => {
  'use strict';

  const SECURITY = Object.freeze({
    version: '1.0.0',
    store: 'test-engine-v4',
    maxQuestions: 2000,
    maxAttempts: 500
  });
  window.TEST_ENGINE_SECURITY = SECURITY;

  const safeArray = (v, max) => Array.isArray(v) ? v.slice(0, max) : [];
  const sanitizeQuestion = q => {
    if (!q || typeof q !== 'object') return null;
    const options = safeArray(q.options, 8).filter(v => typeof v === 'string').map(v => v.slice(0, 1000));
    const answer = Number.isInteger(q.answer) && q.answer >= 0 && q.answer < options.length ? q.answer : null;
    if (typeof q.id !== 'string' || typeof q.question !== 'string' || !options.length || answer === null) return null;
    return {
      id: q.id.slice(0, 120), bank: String(q.bank || '').slice(0, 80), section: String(q.section || '').slice(0, 100),
      topic: String(q.topic || '').slice(0, 100), difficulty: String(q.difficulty || '').slice(0, 30),
      question: q.question.slice(0, 4000), options, answer, explanation: String(q.explanation || '').slice(0, 4000),
      source: String(q.source || '').slice(0, 300)
    };
  };

  window.validateTestState = function(raw) {
    const s = raw && typeof raw === 'object' ? raw : {};
    const questions = safeArray(s.questions, SECURITY.maxQuestions).map(sanitizeQuestion).filter(Boolean);
    const attempts = safeArray(s.attempts, SECURITY.maxAttempts).filter(a => a && typeof a === 'object').map(a => ({
      exam: String(a.exam || '').slice(0, 120), total: Number.isFinite(a.total) ? Math.max(0, Math.min(500, a.total)) : 0,
      correct: Number.isFinite(a.correct) ? Math.max(0, Math.min(500, a.correct)) : 0,
      wrong: Number.isFinite(a.wrong) ? Math.max(0, Math.min(500, a.wrong)) : 0,
      unanswered: Number.isFinite(a.unanswered) ? Math.max(0, Math.min(500, a.unanswered)) : 0,
      score: Number.isFinite(a.score) ? Math.max(-500, Math.min(500, a.score)) : 0,
      date: String(a.date || '').slice(0, 40)
    }));
    return { questions, attempts, templates: safeArray(s.templates, 100) };
  };

  const repairStorage = () => {
    try {
      const raw = localStorage.getItem(SECURITY.store);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const clean = window.validateTestState(parsed);
      localStorage.setItem(SECURITY.store, JSON.stringify(clean));
    } catch (err) {
      try { localStorage.removeItem(SECURITY.store); } catch (_) {}
      console.warn('[security] Invalid local state was discarded.');
    }
  };
  repairStorage();

  // Detect runtime failures and fail visibly instead of leaving a misleading loading screen.
  const report = (kind, err) => {
    console.error(`[security:${kind}]`, err);
    document.documentElement.dataset.runtimeError = kind;
    const app = document.getElementById('app');
    if (app && !app.querySelector('.runtime-error')) {
      const box = document.createElement('section');
      box.className = 'runtime-error';
      box.setAttribute('role', 'alert');
      box.innerHTML = '<strong>Test Engine could not finish loading.</strong><p>Please refresh the page. Your local exam state was not trusted after a runtime error.</p><button type="button">Refresh</button>';
      box.querySelector('button').addEventListener('click', () => location.reload());
      app.appendChild(box);
    }
  };
  window.addEventListener('error', e => report('error', e.error || e.message));
  window.addEventListener('unhandledrejection', e => report('promise', e.reason));

  // Best-effort clickjacking protection for browsers where the CSP is unavailable/ignored.
  try {
    if (window.top !== window.self) window.top.location = window.self.location;
  } catch (_) {
    document.documentElement.dataset.framed = 'true';
  }

  // Prevent stale opener references when this app opens a new browsing context.
  try { window.name = ''; } catch (_) {}

  // Defense-in-depth against accidental sensitive values being sent through forms.
  document.addEventListener('submit', e => {
    const form = e.target;
    if (form && form.tagName === 'FORM' && !form.action) e.preventDefault();
  }, true);
})();
