# Stage 1: Dependencies installation
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Production dependencies only
FROM node:20-alpine AS production-deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# Stage 4: Development environment
FROM node:20-alpine AS development

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm install -g @nestjs/cli

CMD ["npm", "run", "start:dev"]

# Stage 5: Production runtime
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=production-deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js"]
