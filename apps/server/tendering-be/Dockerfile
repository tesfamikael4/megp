# First stage: Build LibreOffice in an Ubuntu container
FROM ubuntu:latest as libreoffice-build

# Install dependencies for LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean
    
FROM node:20-alpine AS base
# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app
RUN npm install -g pnpm
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=tendering-be --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm
 

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

RUN npx turbo run build --filter=tendering-be
# RUN yarn turbo run build --filter=tendering-be...

FROM base AS runner

RUN apk update

RUN apk add libreoffice
RUN apk add libreoffice-common

RUN apk update

WORKDIR /

# Don't run production as root
# RUN addgroup --system --gid 1001 nestjs
# RUN adduser --system --uid 1001 nestjs

# USER nestjs
COPY --from=installer /app .

# RUN chmod -R 777 /apps/server/tendering-be/dist
# RUN chmod 644 /apps/server/tendering-be/dist/temp.pdf

ARG VERSION_ARG
ENV VERSION=$VERSION_ARG
ENV NODE_ENV=production

CMD node apps/server/tendering-be/dist/main.js
