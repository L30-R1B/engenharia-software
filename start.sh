#!/bin/bash
export PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x
export PRISMA_QUERY_ENGINE_BINARY=debian-openssl-3.0.x

# Limpe o cache do Prisma
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Gere o cliente
npx prisma generate

# Execute
npm run dev