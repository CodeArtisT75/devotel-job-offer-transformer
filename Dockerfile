###########################################
# Base Stage                              #
###########################################
FROM node:22.13-alpine AS base-stage

# Install necessary dependencies
RUN apk update && \
    apk upgrade && \
    apk add ca-certificates \
    && rm -rf /etc/apk/cache/*

ENV PROJECT_DIR="/app"

###########################################
# Production stage                        #
###########################################
FROM base-stage AS production

# Create working directory
WORKDIR ${PROJECT_DIR}

# Install dependencies
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.build.json ./
RUN npm install

# Copy source code and build app
COPY nest-cli.json ./
COPY src ./src

RUN npm run build

# Running app.
COPY .env ./
EXPOSE 3000
CMD [ "node", "dist/main.js" ]