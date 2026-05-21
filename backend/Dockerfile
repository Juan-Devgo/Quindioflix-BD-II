FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["node", "--import", "tsx", "src/index.ts"]
