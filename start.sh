#!/bin/bash
export PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x
export PRISMA_QUERY_ENGINE_BINARY=debian-openssl-3.0.x

# Garanta que todas as dependências estejam instaladas
npm install

# Gere o cliente
npx prisma generate

# Execute
npm run dev