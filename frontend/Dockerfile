# FROM node:18-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# COPY tsconfig*.json ./

# RUN npm ci

# COPY public/ ./public/
# COPY src/ ./src/

# RUN npm run build

FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# FROM nginx:alpine AS production

# COPY --from=builder /app/build /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]