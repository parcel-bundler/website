FROM node:10-jessie

LABEL com.github.actions.name="Deploy Parcel To ZEIT"
LABEL com.github.actions.description="Deploy static v2 sites for each Parcel locale"
LABEL repository="https://github.com/coetry/parceljs-www"

WORKDIR /usr/src/app

COPY src/ ./src
COPY package.json build.sh deploy.js ./

RUN yarn && ./build.sh  


COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]