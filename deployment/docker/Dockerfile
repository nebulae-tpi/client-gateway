FROM node:10.12.0
COPY client-gateway /nebulae/tpi/client-gateway
WORKDIR /nebulae/tpi/client-gateway
RUN npm install --prod
USER node
CMD [ "npm","start" ]
