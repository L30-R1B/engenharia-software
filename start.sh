#!/bin/bash

# Garanta que todas as dependências estejam instaladas
npm install

# Gere o cliente (em um ambiente limpo, sem a variável)
npx prisma generate

# Execute o servidor, passando a variável de ambiente APENAS para este comando.
# Isso evita "poluir" o terminal.
PRISMA_QUERY_ENGINE_LIBRARY="./node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node" npm run dev
