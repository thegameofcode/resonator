FROM nodesource/node:4.0

WORKDIR /app
ADD package.json /app/package.json
ADD . /app
RUN npm install


CMD ["npm", "start"]
