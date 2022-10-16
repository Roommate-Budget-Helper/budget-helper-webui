FROM node:alpine as runner
RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY ./src /opt/app/src
COPY ./public /opt/app/public
COPY --chown=nextjs:nodejs ./.next /opt/app/.next
COPY ./node_modules /opt/app/node_modules
COPY ./package.json /opt/app/package.json
COPY ./start.sh /opt/app/start.sh
COPY ./next.config.mjs /opt/app/next.config.mjs
RUN chmod +x /opt/app/start.sh

USER nextjs

ENTRYPOINT ["/opt/app/start.sh"]