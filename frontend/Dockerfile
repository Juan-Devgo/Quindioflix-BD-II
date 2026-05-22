FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

RUN pnpm add -g serve

COPY . .

RUN pnpm build

EXPOSE 5000

CMD ["serve", "-s", "dist", "-l", "5000"]
