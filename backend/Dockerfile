FROM node:17-alpine3.14

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm install --only=production


COPY ./ ./



CMD ["npm", "start"]

