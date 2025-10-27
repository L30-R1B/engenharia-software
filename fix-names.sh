#!/bin/bash

echo "Atualizando nomes dos modelos Prisma nos arquivos..."

# Atualizar nomes nos arquivos JavaScript
find src -name "*.js" -exec sed -i '
  s/prisma\.usuario\./prisma.usuarios./g
  s/prisma\.post\./prisma.posts./g
  s/prisma\.tag\./prisma.tags./g
  s/prisma\.seguidor\./prisma.seguidores./g
  s/prisma\.curtidaPost\./prisma.curtidas_post./g
  s/prisma\.postsTags\./prisma.posts_tags./g
' {} \;

echo "Atualização concluída!"