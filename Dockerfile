FROM node:10

WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .
EXPOSE 80
RUN npm run build
CMD ["pm2-runtime", "server.js"]
