# Production Security Checklist

## OWASP Top 10:2025 hardening

- [x] A01 access-control boundary documented; static-site limitation remains
- [x] A02 CSP and browser hardening policy
- [x] A03 dependency/supply-chain CI checks
- [x] A04 no application secrets or cryptographic keys committed
- [x] A05 dynamic question content escaped before HTML rendering
- [x] A06 exam state and integrity assumptions documented
- [x] A07 authentication is not claimed because the current product has no authentication
- [x] A08 client-side data integrity validation and security smoke tests
- [x] A09 production security checks run in GitHub Actions
- [x] A10 local state/error handling and smoke tests

## Static-site limitation

GitHub Pages is a static frontend. It cannot provide a trusted server-side exam authority, secure server-side scoring, authenticated sessions, or centralized security telemetry by itself. Those controls require a backend before this product is used for high-stakes examinations.

## Release gate

Every change to `main` should pass the security smoke workflow. A green workflow is a regression check, not a certification of security or OWASP compliance.
