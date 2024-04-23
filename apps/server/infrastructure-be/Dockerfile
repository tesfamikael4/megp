FROM node:20-alpine AS base
# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app
RUN yarn global add turbo pnpm@9.0.4
RUN yarn global add @nestjs/cli

CMD [ "nest build", "packages/be/shared" ]

COPY . .
RUN turbo prune --scope=infrastructure-be --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# Install pnpm
RUN yarn global add pnpm@9.0.4

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml  ./pnpm-lock.yaml 
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN yarn turbo run build --filter=infrastructure-be...

FROM base AS runner
WORKDIR /app
# Don't run production as root
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs
COPY --from=installer /app .

# ENV DATABASE_HOST=196.189.44.47
# ENV DATABASE_NAME=infrastructure
# ENV DATABASE_USER=postgres
# ENV DATABASE_PASSWORD=P@ssw0rd@P
# ENV DATABASE_PORT=5432
# ENV NODE_ENV=production
# ENV APP_NAME=infrastructure-be
# ENV RMQ_URL=amqp://guest:guest@196.189.118.110:32700/

CMD node apps/server/infrastructure-be/dist/main.js

