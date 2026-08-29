# Security Policy

## Scope

`prod-2` is a static GitHub Pages application for Computer Science exam preparation. Browser-side controls such as copy/paste restrictions are defense-in-depth and are not a trusted security boundary.

## Reporting a vulnerability

Please do not publish exploitable details in a public issue. Report suspected vulnerabilities privately through the repository owner's available GitHub security reporting channel.

Include:
- affected page/file
- reproducible steps
- impact
- screenshots or console output when useful

## Security architecture note

The current GitHub Pages deployment is a client-side application. High-stakes examination authority, authentication, server-side scoring, and tamper-resistant audit logging require a trusted backend; they are intentionally not represented as secure server controls in this static deployment.
