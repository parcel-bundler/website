FROM node:10-jessie

LABEL com.github.actions.name="Deploy Parcel To ZEIT"
LABEL com.github.actions.description="Deploy static v2 sites for each Parcel locale"
LABEL repository="https://github.com/coetry/parceljs-www"

COPY package.json /package.json
COPY yarn.lock /yarn.lock
COPY build.sh /build.sh
COPY deploy.js /deploy.js

RUN cd / && ./build.sh && yarn

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]