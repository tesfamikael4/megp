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
RUN yarn global add turbo pnpm
COPY . .
RUN turbo prune --scope=tendering-be --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# Install pnpm
RUN yarn global add pnpm
 

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

RUN yarn turbo run build --filter=tendering-be...

FROM base AS runner

# Copy LibreOffice files from the first stage
COPY --from=libreoffice-build /usr/lib/libreoffice /usr/lib/libreoffice
COPY --from=libreoffice-build /usr/bin/libreoffice* /usr/bin/
COPY --from=libreoffice-build /usr/share/libreoffice /usr/share/libreoffice

# Install necessary Alpine packages for LibreOffice to work
RUN apk add --no-cache \
    libxinerama \
    libxrender \
    ttf-dejavu \
    fontconfig \
    bash \
    msttcorefonts-installer && \
    update-ms-fonts && \
    fc-cache -f

# Install additional fonts to prevent text rendering issues
RUN apk add --no-cache \
    ttf-dejavu \
    ttf-freefont \
    ttf-liberation \
    ttf-linux-libertine \
    ttf-ubuntu-font-family

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

