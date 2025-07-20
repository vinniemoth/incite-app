# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.17.0

FROM node:${NODE_VERSION}-alpine as builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN corepack enable
RUN npm install --global corepack@latest
RUN corepack use pnpm@latest-10

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
  --mount=type=cache,target=/root/.npm \
  pnpm install --frozen-lockfile --prod

COPY prisma/ prisma/
RUN pnpm dlx prisma generate

# Runtime
FROM node:${NODE_VERSION}-alpine as runtime

WORKDIR /app

EXPOSE 5000

USER node

# Copy the rest of the source files into the image.
COPY src/ src/
COPY --from=builder /app/node_modules/ node_modules/
COPY --from=builder /app/src/generated/ src/generated/

# Run the application.
CMD node ./src/app.js
