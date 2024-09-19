FROM node:22
EXPOSE 5173

WORKDIR /Client

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY ./Client ./

CMD ["npm", "run", "dev"]
