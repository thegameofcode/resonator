FROM nodesource/node:4.1

RUN mkdir /app
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /app

WORKDIR /app
COPY . /app

ENTRYPOINT ["npm"]
CMD ["start"]
