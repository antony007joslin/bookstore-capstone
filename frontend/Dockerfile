# Stage 1: Build React Application using Node.js
FROM node:20-alpine AS builder
WORKDIR /app

# Cache node_modules
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve using NGINX Alpine
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built artifacts from builder stage
COPY --from=builder /app/dist .

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
