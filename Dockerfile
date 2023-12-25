FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .

# Copy built application
COPY --from=build /app /app

ENV NODE_ENV production

CMD [ "bun", "run", "start" ]

EXPOSE 3000