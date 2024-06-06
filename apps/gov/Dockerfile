FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=gov --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full/ .
COPY public ./apps/gov/public

ARG API_URL

ENV API_URL=${API_URL}

RUN npx turbo run build --filter=gov...

FROM base AS runtime

WORKDIR /app

COPY --from=installer /app/apps/gov/dist/ ./dist
COPY --from=installer /app/node_modules ./node_modules

ARG API_URL

ENV API_URL=${API_URL}
ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD [ "node", "./dist/server/entry.mjs" ]
