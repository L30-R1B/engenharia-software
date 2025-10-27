import mysql.connector
from mysql.connector import Error

# --- CONFIGURAÇÕES DO BANCO DE DADOS ---
# !! Altere estes valores para os do seu ambiente MySQL !!
CONFIG = {
    'host': '100.124.95.109',
    'user': 'root',
    'password': 'babilonia-lil2kmnY',
    'database': 'caobook'  # Nome do banco de dados (schema) que será criado/usado
}

# --- LISTA DE TABELAS PARA APAGAR (DROP) ---
# A ordem é importante para evitar erros de chave estrangeira (FK)
# Tabelas que são referenciADAS por outras devem vir por último.
# A forma mais segura é desabilitar a checagem de FK, apagar, e religar.
TABLES_TO_DROP = [
    'curtidas_post',
    'seguidores',
    'posts_tags',
    'tags',
    'posts',
    'usuarios'
]

# --- DEFINIÇÕES DAS TABELAS (SQL) ---
# Lista de todos os comandos CREATE TABLE
TABLE_DEFINITIONS = [
    """
    CREATE TABLE `usuarios` (
      `id` integer PRIMARY KEY AUTO_INCREMENT,
      `nome_usuario` varchar(255) UNIQUE NOT NULL,
      `email` varchar(255) UNIQUE NOT NULL,
      `hash_senha` varchar(255) NOT NULL,
      `url_foto_perfil` varchar(255) COMMENT 'URL para a foto de perfil do usuário',
      `cargo` varchar(255) NOT NULL DEFAULT 'usuario' COMMENT 'Valores: "usuario" ou "admin"',
      `nivel` integer NOT NULL DEFAULT 1,
      `xp` integer NOT NULL DEFAULT 0 COMMENT 'Pontos de experiência',
      `moedas` integer NOT NULL DEFAULT 0 COMMENT 'Moedas virtuais da plataforma',
      `data_criacao` timestamp DEFAULT (now())
    );
    """,
    """
    CREATE TABLE `posts` (
      `id` integer PRIMARY KEY AUTO_INCREMENT,
      `usuario_id` integer NOT NULL COMMENT 'O autor do post',
      `titulo` varchar(255) NOT NULL,
      `url_imagem` varchar(255) NOT NULL COMMENT 'URL da foto do cachorro',
      `descricao` text COMMENT 'Descrição/legenda do post',
      `status` varchar(255) NOT NULL DEFAULT 'pendente' COMMENT 'Valores: pendente, aprovado, rejeitado',
      `aprovado_por_usuario_id` integer COMMENT 'ID do Admin que aprovou o post',
      `data_aprovacao` timestamp,
      `data_criacao` timestamp DEFAULT (now())
    );
    """,
    """
    CREATE TABLE `tags` (
      `id` integer PRIMARY KEY AUTO_INCREMENT,
      `nome` varchar(255) UNIQUE NOT NULL COMMENT 'Ex: Golden Retriever, Pug, Engraçado, Fofo'
    );
    """,
    """
    CREATE TABLE `posts_tags` (
      `post_id` integer NOT NULL,
      `tag_id` integer NOT NULL,
      PRIMARY KEY (`post_id`, `tag_id`)
    );
    """,
    """
    CREATE TABLE `seguidores` (
      `seguidor_usuario_id` integer NOT NULL,
      `seguido_usuario_id` integer NOT NULL,
      `data_criacao` timestamp DEFAULT (now()),
      PRIMARY KEY (`seguidor_usuario_id`, `seguido_usuario_id`)
    );
    """,
    """
    CREATE TABLE `curtidas_post` (
      `usuario_id` integer NOT NULL COMMENT 'Usuário que curtiu',
      `post_id` integer NOT NULL COMMENT 'Post que foi curtido',
      `data_criacao` timestamp DEFAULT (now()),
      PRIMARY KEY (`usuario_id`, `post_id`)
    );
    """
]

# --- DEFINIÇÕES DAS CHAVES ESTRANGEIRAS (ALTER TABLE) ---
FOREIGN_KEY_DEFINITIONS = [
    "ALTER TABLE `posts` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);",
    "ALTER TABLE `posts` ADD FOREIGN KEY (`aprovado_por_usuario_id`) REFERENCES `usuarios` (`id`);",
    "ALTER TABLE `seguidores` ADD FOREIGN KEY (`seguidor_usuario_id`) REFERENCES `usuarios` (`id`);",
    "ALTER TABLE `seguidores` ADD FOREIGN KEY (`seguido_usuario_id`) REFERENCES `usuarios` (`id`);",
    "ALTER TABLE `curtidas_post` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);",
    "ALTER TABLE `curtidas_post` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);",
    "ALTER TABLE `posts_tags` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);",
    "ALTER TABLE `posts_tags` ADD FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`);"
]


def main():
    """
    Função principal para conectar ao MySQL, criar o banco (se não existir)
    e recriar todas as tabelas.
    """
    conn = None
    cursor = None
    db_name = CONFIG['database']

    try:
        # 1. Conectar ao MySQL (sem um banco de dados específico)
        print(f"Conectando ao servidor MySQL em {CONFIG['host']}...")
        conn = mysql.connector.connect(
            host=CONFIG['host'],
            user=CONFIG['user'],
            password=CONFIG['password']
        )
        cursor = conn.cursor()

        # 2. Criar o banco de dados (schema) se ele não existir
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.execute(f"USE {db_name}")
        print(f"Banco de dados '{db_name}' está pronto para uso.")

        # 3. Apagar tabelas existentes (de forma segura)
        print("Removendo tabelas antigas (se existirem)...")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
        for table_name in TABLES_TO_DROP:
            cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
            print(f" - Tabela '{table_name}' removida.")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        print("Tabelas antigas removidas com sucesso.")

        # 4. Criar as novas tabelas
        print("\nCriando novas tabelas...")
        for i, definition in enumerate(TABLE_DEFINITIONS):
            try:
                cursor.execute(definition)
                print(f" - Tabela {i+1} criada com sucesso.")
            except Error as e:
                print(f"Erro ao criar tabela {i+1}: {e}")
                raise  # Levanta o erro para parar a execução
        print("Todas as tabelas foram criadas.")

        # 5. Aplicar as chaves estrangeiras (Foreign Keys)
        print("\nAplicando chaves estrangeiras...")
        for i, fk_def in enumerate(FOREIGN_KEY_DEFINITIONS):
            try:
                cursor.execute(fk_def)
                print(f" - FK {i+1} aplicada com sucesso.")
            except Error as e:
                print(f"Erro ao aplicar FK {i+1}: {e}")
                raise
        print("Chaves estrangeiras aplicadas com sucesso.")
        
        # 6. Comitar as mudanças
        conn.commit()
        print(f"\n✅ Sucesso! O banco de dados '{db_name}' foi inicializado.")

    except Error as e:
        print(f"\n❌ Erro durante a execução: {e}")
        if conn and conn.is_connected():
            conn.rollback() # Reverte qualquer mudança pendente se houver erro
            
    finally:
        # 7. Fechar a conexão
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()
            print("Conexão com o MySQL foi fechada.")


if __name__ == "__main__":
    main()