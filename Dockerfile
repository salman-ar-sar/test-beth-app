FROM oven/bun as base

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .

# Copy built application
COPY --from=base /app /app

ENV NODE_ENV production

CMD [ "bun", "run", "start" ]

EXPOSE 3000