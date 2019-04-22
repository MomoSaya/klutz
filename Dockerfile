FROM snakeliwei/nodebase as BUILD
LABEL Author "snakeliwei@gmail.com"
COPY . /app
WORKDIR /app
RUN npm install && \
    npm run build && \
    echo "$(git log -1 --pretty=format:"%h - %an, %ar: %s")" > /app/dist/version

FROM alpine
COPY --from=BUILD /app/dist /dist
COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
