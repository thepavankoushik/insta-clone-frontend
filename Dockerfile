FROM --platform=linux/amd64 node:alpine


WORKDIR /app
COPY package.json .
RUN npm install --legacy-peer-deps true
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
