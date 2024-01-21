FROM node:20-alpine

WORKDIR /app

COPY ./dist /app

ENV PORT=3000
ENV MONGO_URI=mongodb://mongo:27017/mern-iot-dashboard-docker
ENV JWT_SECRET=docker-very-secure-secret

EXPOSE 3000:3000

CMD ["node", "server.js"]
