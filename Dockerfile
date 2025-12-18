FROM node:20-alpine AS builder

WORKDIR /backend
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine

WORKDIR /backend
COPY --from=builder /backend/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
