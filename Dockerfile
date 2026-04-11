# --- Stage 1 (build): install all dependencies and compile TypeScript ---
FROM node:24-alpine AS build

# setting working directory
WORKDIR /app

COPY package*.json ./

# installing all deps for TypeScript compilation
RUN npm install

# copying source code
COPY . .

# TS -> JS
RUN npm run build

# --- Stage 2 (production): copy compiled output and install production dependencies only ---
FROM node:24-alpine AS production

RUN apk add --no-cache curl

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

# ci - clean install
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

USER node

EXPOSE 4000

CMD ["node", "dist/main.js"]
