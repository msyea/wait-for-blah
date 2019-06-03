FROM node:12-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json /usr/src/app/
RUN npm ci

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "npm", "test" ]