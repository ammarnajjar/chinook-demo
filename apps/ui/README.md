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
