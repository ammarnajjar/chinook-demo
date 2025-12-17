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
