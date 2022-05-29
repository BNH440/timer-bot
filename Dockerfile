FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env dist/.env

CMD [ "npm", "start" ]