FROM node:10-jessie

LABEL com.github.actions.name="Deploy Parcel To ZEIT"
LABEL com.github.actions.description="Deploy static v2 sites for each Parcel locale"
LABEL repository="https://github.com/coetry/parceljs-www"

WORKDIR ~/app

COPY ./src ~/app/src
COPY package.json ~/app/package.json
COPY build.sh ~/app/build.sh
COPY deploy.js ~/app/deploy.js

WORKDIR ~/app
RUN yarn && ./build.sh  

WORKDIR ~/app/node_modules
RUN echo "now-client: $(ls | grep now-client)"

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]