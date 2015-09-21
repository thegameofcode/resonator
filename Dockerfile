FROM nodesource/node:4.1

WORKDIR /app
ADD package.json /app/package.json
ADD . /app
RUN npm install


CMD ["npm", "start"]
