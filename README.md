# HR Platform

Multi-tenant HR management SaaS foundation built around Java 17/Spring Boot and React/TypeScript.

## Local development

```bash
docker compose up -d mysql redis
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev
cd frontend-web && npm install && npm run dev
```

For local testing, the `dev` profile seeds `admin@demo.local` with `ChangeMe123!` in tenant `demo`. Override `DEV_USER_EMAIL` and `DEV_USER_PASSWORD`; never enable this profile in production.

The API is available at `http://localhost:8080`, Swagger UI at `/swagger-ui.html`, and the web app at `http://localhost:5173`.

## Structure

- `backend` — Spring Boot API, security, JPA entities, Flyway migrations
- `frontend-web` — React dashboard shell using the Deep Indigo × Slate design system
- `deploy` — Docker Compose, Kubernetes, and Terraform starter manifests
- `.github/workflows` — backend and frontend CI pipelines

All secrets are supplied through environment variables. Never commit credentials, tokens, or private keys.
