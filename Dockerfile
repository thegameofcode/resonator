FROM nodesource/trusty:0.12.3

WORKDIR /app
ADD package.json /app/package.json
ADD . /app
RUN cd /app
RUN npm install


CMD ["npm", "start"]
