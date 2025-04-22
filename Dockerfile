FROM node:22.12-alpine


WORKDIR /app


COPY package.json ./


RUN npm install --production --no-package-lock


COPY server.js browser_tools.js browser_session.js ./


RUN chmod +x server.js


CMD ["node", "server.js"]
