# ベースイメージ
FROM node:22-alpine AS builder

# 作業ディレクトリ
WORKDIR /app

# パッケージのインストール
COPY ./package*.json ./
RUN npm install

# 全てのファイルをnodeユーザーに
RUN chown -R node:node /app

# 実行ステージ
FROM builder AS runner
WORKDIR /app

COPY ./ui-react/* ./

# nodeユーザーに切り替える
USER node

# 開発用コマンドを実行
CMD ["npm", "run", "dev"]