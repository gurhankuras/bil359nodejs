FROM node:17-alpine 
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
VOLUME ["/app/node_modules"]
CMD ["npm", "run", "start"]