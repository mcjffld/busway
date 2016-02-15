FROM node:4.3.0

COPY ./dist /src

ENV NODE_ENV=production

RUN cd /src && npm install --production

EXPOSE 8081

CMD ["node", "/src/server/app.js"]
