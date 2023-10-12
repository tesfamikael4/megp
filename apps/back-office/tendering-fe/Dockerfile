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
RUN turbo prune --scope=tendering-fe --docker

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
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/out/pnpm-lock.yaml  ./pnpm-lock.yaml 
#COPY --from=builder /app/node_modules ./node_modules
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo run build --filter=tendering-fe...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/back-office/tendering-fe/next.config.js .
COPY --from=installer /app/apps/back-office/tendering-fe/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/back-office/tendering-fe/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/back-office/tendering-fe/.next/static ./apps/back-office/tendering-fe/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/back-office/tendering-fe/public ./apps/back-office/tendering-fe/public


# Set environment variables with default values

ENV ENV_AUTH_API="AUTH_API"
ENV ENV_API_BASE_PATH="API_BASE_PATH"
ENV ENV_WEBSITE_DOMAIN="WEBSITE_DOMAIN"
ENV ENV_WEBSITE_BASE_PATH="WEBSITE_BASE_PATH"
#ENV ENV_PUBLIC_VENDOR_API="PUB_VENDOR_API"
ENV ENV_RECAPTCHA_SITE_KEY ""


# Specify the command to run your application, passing the environment variables
CMD ["node", "apps/back-office/tendering-fe/server.js"]
