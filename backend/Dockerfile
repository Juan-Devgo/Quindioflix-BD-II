FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG PORT=3001
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["node", "--import", "tsx", "src/index.ts"]
