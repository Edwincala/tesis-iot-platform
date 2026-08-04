# FROM node:18-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# COPY tsconfig*.json ./

# RUN npm ci

# COPY src/ ./src/

# RUN npm run build

FROM node:18-alpine AS development

WORKDIR /app

RUN npm install -g nodemon ts-node

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]

# FROM node:18-alpine AS production

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci --only=production

# COPY --from=builder /app/dist ./dist

# ENV NODE_ENV=production
# ENV PORT=3001

# EXPOSE 3001

# USER node

# CMD ["node", "dist/index.js"]