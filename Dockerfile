FROM   node:0.12

# Bundle app source
COPY . /src
# Install app dependencies
RUN cd /src; npm install

EXPOSE 9000

CMD ["node", "/src/server/app.js"]
