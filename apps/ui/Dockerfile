### Build stage
FROM node:24-alpine AS builder
WORKDIR /app
## copy only the UI project files into the builder
COPY package.json package-lock.json* ./
RUN npm install --production=false --silent
COPY . ./
RUN npm run build

### Production stage
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# simple nginx config to serve SPA
RUN rm /etc/nginx/conf.d/default.conf
# nginx.conf was copied into the builder image at /app, copy it from there
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/spa.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
