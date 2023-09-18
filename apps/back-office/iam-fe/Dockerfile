FROM node:18-alpine AS base
 
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=web --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install
 
# Build the project ---> replace the file
COPY --from=builder /app/out/full/ .
RUN yarn turbo run build --filter=iam-fe...
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
COPY --from=installer /app/apps/back-office/iam-fe/next.config.js .
COPY --from=installer /app/apps/back-office/iam-fe/package.json .
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/back-office/iam-fe/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/back-office/iam-fe/.next/static ./apps/back-office/iam-fe/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/back-office/iam-fe/public ./apps/back-office/iam-fe/public
 EXPOSE 5511
CMD node apps/back-office/iam-fe/server.js
