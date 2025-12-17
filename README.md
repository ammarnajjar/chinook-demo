# Chinook Demo

## API (apps/api)

API NestJS app

Run the server (from workspace root):

```bash
cd apps/api
npm install --legacy-peer-deps
npm run start:dev
```

Open Swagger at http://localhost:4400/api

Docker build/run

```bash
cd apps/api
docker build -t chinook-api .

# allow the container to reach the DB running on the host
docker run --rm --name api -p 4400:4400 --env-file .env -e DB_HOST=host.docker.internal chinook-api
```

## UI (apps/ui)

UI (lightweight SPA)

Local dev:

- Install dependencies: `cd apps/ui && npm install`
- Start dev server: `npm run start`
- The app runs on `http://localhost:4300` by default.

Config:
- To point the UI to a different API base, set `VITE_API_BASE` when starting the dev server, e.g.

	VITE_API_BASE=http://localhost:4400 npm run start

UI Docker (build & run)

The UI is a Vite app located at `apps/ui`. A multi-stage Dockerfile builds the static assets and serves them with nginx.

Build the UI image from the workspace root:

```bash
cd apps/ui
docker build -t chinook-ui:latest .
```

Run the UI container and map it to host port 4300 (the container proxies API requests to the host):

```bash
docker run --rm --name ui -p 4300:80 --add-host=host.docker.internal:host-gateway chinook-ui:latest
```

Notes:
- The nginx config in the image proxies `/api/` to `host.docker.internal:4400`. If your API uses a different host/port, update `apps/ui/nginx.conf` before building or change the Docker run mapping.
- When running the UI in Docker, open `http://localhost:4300` to access the app.

## Workspace: start:dev & Docker

Quick dev (runs API and UI concurrently from workspace root):

```bash
npm run start:dev
```

This runs the API (`apps/api`) on port `4400` and the UI dev server (`apps/ui`) on port `4300` using the workspace `start:dev` script.

Docker notes — running containers together locally:


```bash
# build images
cd apps/api && docker build -t chinook-api .
cd ../ui && docker build -t chinook-ui:latest .

# run API (allow host DB access)
docker run -d --name chinook-api -p 4400:4400 --env-file apps/api/.env -e DB_HOST=host.docker.internal chinook-api

# run UI and proxy to host API
docker run -d --name chinook-ui -p 4300:80 --add-host=host.docker.internal:host-gateway chinook-ui:latest
```

Stop and remove containers:

```bash
docker rm -f chinook-api chinook-ui
```

License

This repository is licensed under the MIT License — see the `LICENSE` file for details.

