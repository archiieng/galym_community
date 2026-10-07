# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Vite bakes the API address into the bundle at build time.
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Serve index.html for client-side routes (/opportunities/42 etc.)
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    location / {
        try_files $uri /index.html;
    }
    # Always re-check the page itself, so a rebuilt site is picked up at once;
    # the scripts and styles it points to have hashed names and can be cached.
    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
EOF
EXPOSE 80
