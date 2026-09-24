FROM node:18-alpine
WORKDIR /app
COPY ../mern-demo/package*.json ./
RUN npm install --legacy-peer-deps
COPY server.js ./
EXPOSE 5000

# Sửa index.js thành server.js
CMD ["node", "server.js"]