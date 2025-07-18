# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build the SvelteKit application
FROM base AS build
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production stage
FROM base AS production
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/package.json ./

# Expose port 3000 for SvelteKit preview
EXPOSE 8080

# Run the SvelteKit application
USER bun
CMD ["bun", "start", "--host", "0.0.0.0", "--port", "8080"]
