#!/bin/bash

echo "=== CORRIGINDO TODOS OS ARQUIVOS PARA OS NOVOS NOMES DO PRISMA ==="

# Substituir prisma.usuario -> prisma.usuarios
find src -name "*.js" -exec sed -i 's/prisma\.usuario\./prisma.usuarios./g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.usuario /prisma.usuarios /g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.usuario)/prisma.usuarios)/g' {} \;

# Substituir prisma.post -> prisma.posts
find src -name "*.js" -exec sed -i 's/prisma\.post\./prisma.posts./g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.post /prisma.posts /g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.post)/prisma.posts)/g' {} \;

# Substituir prisma.tag -> prisma.tags
find src -name "*.js" -exec sed -i 's/prisma\.tag\./prisma.tags./g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.tag /prisma.tags /g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.tag)/prisma.tags)/g' {} \;

# Substituir prisma.seguidor -> prisma.seguidores
find src -name "*.js" -exec sed -i 's/prisma\.seguidor\./prisma.seguidores./g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.seguidor /prisma.seguidores /g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.seguidor)/prisma.seguidores)/g' {} \;

# Substituir prisma.curtidaPost -> prisma.curtidas_post
find src -name "*.js" -exec sed -i 's/prisma\.curtidaPost\./prisma.curtidas_post./g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.curtidaPost /prisma.curtidas_post /g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.curtidaPost)/prisma.curtidas_post)/g' {} \;

# Substituir prisma.postsTags -> prisma.posts_tags
find src -name "*.js" -exec sed -i 's/prisma\.postsTags\./prisma.posts_tags./g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.postsTags /prisma.posts_tags /g' {} \;
find src -name "*.js" -exec sed -i 's/prisma\.postsTags)/prisma.posts_tags)/g' {} \;

echo "✅ Substituição de modelos concluída!"

echo "=== ATUALIZANDO NOMES DE CAMPOS ==="

# Substituir nomes de campos
find src -name "*.js" -exec sed -i '
s/nomeUsuario:/nome_usuario:/g
s/urlFotoPerfil:/url_foto_perfil:/g
s/hashSenha:/hash_senha:/g
s/dataCriacao:/data_criacao:/g
s/usuarioId:/usuario_id:/g
s/aprovadoPorUsuarioId:/aprovado_por_usuario_id:/g
s/seguidorUsuarioId:/seguidor_usuario_id:/g
s/seguidoUsuarioId:/seguido_usuario_id:/g
s/urlImagem:/url_imagem:/g
s/dataAprovacao:/data_aprovacao:/g
' {} \;

echo "✅ Substituição de campos concluída!"

echo "=== ATUALIZANDO SELECTS E INCLUDES ==="

# Substituir em selects e includes
find src -name "*.js" -exec sed -i "
s/'nomeUsuario'/'nome_usuario'/g
s/\"nomeUsuario\"/\"nome_usuario\"/g
s/'urlFotoPerfil'/'url_foto_perfil'/g
s/\"urlFotoPerfil\"/\"url_foto_perfil\"/g
s/'hashSenha'/'hash_senha'/g
s/\"hashSenha\"/\"hash_senha\"/g
s/'dataCriacao'/'data_criacao'/g
s/\"dataCriacao\"/\"data_criacao\"/g
s/'usuarioId'/'usuario_id'/g
s/\"usuarioId\"/\"usuario_id\"/g
s/'aprovadoPorUsuarioId'/'aprovado_por_usuario_id'/g
s/\"aprovadoPorUsuarioId\"/\"aprovado_por_usuario_id\"/g
s/'urlImagem'/'url_imagem'/g
s/\"urlImagem\"/\"url_imagem\"/g
s/'dataAprovacao'/'data_aprovacao'/g
s/\"dataAprovacao\"/\"data_aprovacao\"/g
" {} \;

echo "✅ Substituição em selects concluída!"

echo "=== CORREÇÕES MANUAIS NECESSÁRIAS ==="
echo "1. Verifique os relacionamentos nos includes:"
echo "   - 'autor' pode precisar de ajustes nos campos selecionados"
echo "   - 'tags' pode precisar de ajustes"
echo ""
echo "2. Relacionamentos específicos:"
echo "   - 'seguindo' -> 'seguindo_seguidor'"
echo "   - 'seguidores' -> 'seguidores_seguido'"
echo "   - 'posts' -> 'posts_autor'"
echo "   - 'postsAprovados' -> 'posts_aprovador'"

echo "🎯 Execute o servidor e teste novamente!"