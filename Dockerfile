# --- Stage 1 (build): install all dependencies and compile TypeScript ---
FROM node:24-alpine AS build

# setting working directory
WORKDIR /app

COPY package*.json ./

# installing all deps for TypeScript compilation
RUN npm install

# copying source code
COPY . .

RUN npx prisma generate

# TS -> JS
RUN npm run build

# --- Stage 2 (production): copy compiled output and install production dependencies only ---
FROM node:24-alpine AS production

RUN apk add --no-cache curl

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

COPY --from=build /app/prisma ./prisma

# ci - clean install
RUN npm ci --omit=dev && npx prisma generate

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

USER node

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
