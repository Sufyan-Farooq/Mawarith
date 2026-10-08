# Mawarith on Oracle

Production URL: `https://mawarith.sufyanfarooq.com`. Host: `84.13.143.155`, Ubuntu ARM64, SSH user `ubuntu`. Directory: `/home/ubuntu/apps/mawarith`. The static Nginx container binds only `127.0.0.1:3300`; existing host Caddy provides HTTPS. No database or server-side account storage is required.

In the `sufyanfarooq.com` DNS zone, add A record `mawarith` → `84.13.143.155`, TTL 300. Preserve records for existing sites and email.

Push `codex/oracle-production` to deploy through `.github/workflows/oracle-production.yml`. GitHub runs the repository's engine tests and production build in an ARM64 Docker build, then sends the image through a pinned-host SSH connection. The dedicated deployment key accepts only named Mawarith/Riyasat releases. The receiver serializes deployment, validates image architecture, waits for health and restores the previous image on failure when one exists. Initial deployments have no previous image to restore.

Server Compose changes and the shared release receiver require a reviewed SSH installation. Runtime memory is capped at 128 MB and container logs are bounded. Monitor disk use and remove obsolete project image tags deliberately, retaining rollback images and other applications. Engine tests are software checks; deployment does not establish scholarly or legal certification.
