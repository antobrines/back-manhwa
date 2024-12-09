FROM node AS builder
WORKDIR /backend
COPY package.json ./
RUN npm i

FROM node
WORKDIR /backend
COPY --from=builder /backend/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]