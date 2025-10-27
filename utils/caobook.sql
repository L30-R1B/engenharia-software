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

CREATE TABLE `tags` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `nome` varchar(255) UNIQUE NOT NULL COMMENT 'Ex: Golden Retriever, Pug, Engraçado, Fofo'
);

CREATE TABLE `posts_tags` (
  `post_id` integer NOT NULL,
  `tag_id` integer NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`)
);

CREATE TABLE `seguidores` (
  `seguidor_usuario_id` integer NOT NULL,
  `seguido_usuario_id` integer NOT NULL,
  `data_criacao` timestamp DEFAULT (now()),
  PRIMARY KEY (`seguidor_usuario_id`, `seguido_usuario_id`)
);

CREATE TABLE `curtidas_post` (
  `usuario_id` integer NOT NULL COMMENT 'Usuário que curtiu',
  `post_id` integer NOT NULL COMMENT 'Post que foi curtido',
  `data_criacao` timestamp DEFAULT (now()),
  PRIMARY KEY (`usuario_id`, `post_id`)
);

ALTER TABLE `posts` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `posts` ADD FOREIGN KEY (`aprovado_por_usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `seguidores` ADD FOREIGN KEY (`seguidor_usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `seguidores` ADD FOREIGN KEY (`seguido_usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `curtidas_post` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `curtidas_post` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

ALTER TABLE `posts_tags` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

ALTER TABLE `posts_tags` ADD FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`);
