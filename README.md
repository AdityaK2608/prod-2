# 🛡️ Sentinel — Cybersecurity Command Center

> A modern, browser-first cybersecurity intelligence workspace for security assessment, investigation, and learning.

[![Status](https://img.shields.io/badge/status-in%20development-8b7cff?style=flat-square)](https://adityak2608.github.io/prod-2/)
[![Deployment](https://img.shields.io/badge/deployment-GitHub%20Pages-222?style=flat-square)](https://pages.github.com/)
[![License](https://img.shields.io/badge/license-TBD-lightgrey?style=flat-square)](https://github.com/AdityaK2608/prod-2)

## 🚧 Current status

**Sentinel is under active development.**

The repository has been reset and is being rebuilt from scratch. The current public page is a temporary product placeholder while the application architecture and first security module are developed.

## 🎯 Product vision

Sentinel is intended to bring commonly used security intelligence workflows into one focused command center.

Planned areas include:

- **Domain Intelligence** — inspect a domain and organize available security-relevant information.
- **Security Headers** — review HTTP security-header posture where browser-safe access is available.
- **TLS / SSL** — surface certificate and transport-security information where technically available.
- **DNS Intelligence** — organize DNS-related information and observations.
- **CVE Explorer** — search and understand vulnerability information.
- **OWASP Assessment** — structured application-security assessment workflows.
- **Security Scoring** — turn verified observations into an understandable security posture view.
- **Security Reports** — present findings, evidence, severity, and remediation guidance clearly.

## 🧭 Development principles

### Verify, don't fabricate

Sentinel will never display a security result simply because a feature is unavailable in the browser. When a check cannot be performed reliably, the UI should say so.

### Browser-first

The first release is designed for **GitHub Pages** and therefore must respect browser security boundaries and static-hosting limitations.

### Privacy-conscious

Where practical, analysis will happen locally in the browser and sensitive input will not be sent to a remote service unless a future feature explicitly requires it.

### Security by design

The project will use OWASP guidance, secure coding practices, input validation, safe DOM handling, dependency hygiene, and automated checks throughout development.

### No fake "security score"

A score is useful only when it is based on clearly defined, reproducible observations. Unsupported or unavailable checks will not be treated as passing findings.

## 🏗️ Planned architecture

The product will be developed incrementally rather than adding a large framework before the first feature is defined.

### Phase 1 — Foundation

- Premium security-console UI
- Responsive application shell
- Design system
- Client-side state model
- Error handling
- Security baseline

### Phase 2 — Domain Intelligence

- Target validation
- Browser-safe intelligence collection
- Findings model
- Evidence display
- Severity classification
- Recommendations

### Phase 3 — Security Modules

- Headers
- TLS / SSL
- DNS
- CVEs
- OWASP

### Phase 4 — Reporting & Analytics

- Security posture dashboard
- Finding history
- Exportable reports
- Remediation tracking

## ⚠️ GitHub Pages limitation

GitHub Pages is a static hosting platform. A browser-only application cannot provide a trusted server-side security scanner, authenticated backend, server-side scoring authority, centralized audit logging, or unrestricted cross-origin network access.

Sentinel will therefore distinguish between:

- **Verified browser-observable data**
- **User-provided data**
- **Third-party/API data**
- **Unavailable checks**

If a future module needs server-side capabilities, it will be designed as a separate backend/API layer rather than pretending that client-side JavaScript can provide those guarantees.

## 🔐 Security

Security is part of the product architecture, not a final checklist item.

The project will progressively address relevant areas of the **OWASP Top 10** and use automated security checks in CI where practical.

See [`SECURITY.md`](./SECURITY.md) when the security policy is introduced and maintained alongside the application.

## 🧑‍💻 Development

The production target is:

**GitHub → `main` → GitHub Pages**

The repository currently remains intentionally lightweight while the new product is being designed.

## 📍 Roadmap

- [x] Reset legacy product
- [x] Establish Sentinel product direction
- [x] Create production placeholder
- [x] Add project documentation
- [ ] Finalize V1 design system
- [ ] Build application shell
- [ ] Build Domain Intelligence V1
- [ ] Add security finding model
- [ ] Add automated test coverage
- [ ] Expand security modules
- [ ] Production hardening

## 📄 License

License terms will be added before the project is released for wider use.

---

**Sentinel** — *See the signal. Understand the risk.*
