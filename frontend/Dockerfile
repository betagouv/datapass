FROM node:16-alpine

WORKDIR /app
COPY ["./package.json", "./package-lock.json*", "./"]

RUN npm i -g npm
RUN npm install

CMD ["npm", "run", "dev"]
