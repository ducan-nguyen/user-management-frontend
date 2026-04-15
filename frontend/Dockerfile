# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm cả dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# Stage 2: Run with Nginx
FROM nginx:alpine

# Copy built files từ stage build
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Run nginx
CMD ["nginx", "-g", "daemon off;"]