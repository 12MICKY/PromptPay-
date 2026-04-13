# Security Policy

## Supported Versions

This project is currently maintained on the `main` branch.

Supported version:

- `main`: actively maintained

## Reporting a Vulnerability

If you discover a security issue, please do not disclose it publicly right away through a public issue.

Recommended process:

1. Contact the repository owner privately through an appropriate contact channel.
2. Clearly describe the issue, including:
   - what the vulnerability is
   - what impact it may have
   - how to reproduce it
   - any relevant request, input, or deployment context
3. If you already have a suggested fix or mitigation, include it as well.

## Scope

Security-related topics for this project may include:

- Docker configuration
- exposed ports and deployment settings
- Nginx configuration
- Cloudflare Tunnel configuration
- service worker and manifest behavior
- user input handling in the front-end

## Notes

This project is currently a static web app and does not include a backend for storing user data or processing real payment transactions.

However, the following points still matter:

- deployment should use properly configured reverse proxy or tunnel layers
- Docker and system-level permissions should not be broader than necessary
- public deployments should use HTTPS
- if a backend is added in the future, the security model should be reviewed again in full
