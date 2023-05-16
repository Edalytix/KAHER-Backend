FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

RUN npm install pm2 -g

COPY package*.json ./

RUN npm ci && npm cache clean --force

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ] 