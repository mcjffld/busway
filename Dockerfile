FROM node:4.3.0

COPY ./dist /src

ENV NODE_ENV=production

ENV PORT=80

RUN cd /src && npm install --production

EXPOSE 80

CMD ["node", "/src/server/app.js"]
