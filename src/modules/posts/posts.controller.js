const prisma = require('../../services/prisma.client');

const postsController = {
    async createPost(req, res) {
        try {
            const { titulo, urlImagem, descricao } = req.body;
            const usuarioId = req.usuarioLogado.id;

            if (!titulo || !urlImagem) {
                return res.status(400).json({ error: 'Título e URL da imagem são obrigatórios' });
            }

            const novoPost = await prisma.posts.create({
                data: {
                    titulo,
                    urlImagem,
                    descricao,
                    usuarioId,
                    status: 'pendente'
                },
                include: {
                    autor: {
                        select: {
                            id: true,
                            nomeUsuario: true,
                            urlFotoPerfil: true
                        }
                    },
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    _count: {
                        select: {
                            curtidas: true
                        }
                    }
                }
            });

            res.status(201).json(novoPost);
        } catch (error) {
            console.error('Erro ao criar post:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async getPosts(req, res) {
        try {
            const posts = await prisma.posts.findMany({
                where: { status: 'aprovado' },
                include: {
                    autor: {
                        select: {
                            id: true,
                            nomeUsuario: true,
                            urlFotoPerfil: true
                        }
                    },
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    _count: {
                        select: {
                            curtidas: true
                        }
                    }
                },
                orderBy: {
                    dataCriacao: 'desc'
                }
            });

            res.json(posts);
        } catch (error) {
            console.error('Erro ao buscar posts:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async getPostById(req, res) {
        try {
            const postId = parseInt(req.params.id);

            const post = await prisma.posts.findFirst({
                where: {
                    id: postId,
                    status: 'aprovado'
                },
                include: {
                    autor: {
                        select: {
                            id: true,
                            nomeUsuario: true,
                            urlFotoPerfil: true
                        }
                    },
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    _count: {
                        select: {
                            curtidas: true
                        }
                    }
                }
            });

            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }

            res.json(post);
        } catch (error) {
            console.error('Erro ao buscar post:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async toggleLike(req, res) {
        try {
            const postId = parseInt(req.params.id);
            const usuarioId = req.usuarioLogado.id;

            const post = await prisma.posts.findUnique({
                where: { id: postId }
            });

            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }

            const curtidaExistente = await prisma.curtidas_post.findUnique({
                where: {
                    usuarioId_postId: {
                        usuarioId,
                        postId
                    }
                }
            });

            if (curtidaExistente) {
                await prisma.curtidas_post.delete({
                    where: {
                        usuarioId_postId: {
                            usuarioId,
                            postId
                        }
                    }
                });
                return res.json({ message: 'Like removido', liked: false });
            } else {
                await prisma.curtidas_post.create({
                    data: {
                        usuarioId,
                        postId
                    }
                });
                return res.json({ message: 'Post curtido', liked: true });
            }
        } catch (error) {
            console.error('Erro ao curtir post:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async updatePostTags(req, res) {
        try {
            const postId = parseInt(req.params.id);
            const usuarioId = req.usuarioLogado.id;
            const { tags } = req.body;

            if (!Array.isArray(tags)) {
                return res.status(400).json({ error: 'Tags deve ser um array' });
            }

            const post = await prisma.posts.findUnique({
                where: { id: postId }
            });

            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }

            if (post.usuarioId !== usuarioId) {
                return res.status(403).json({ error: 'Apenas o autor pode editar as tags do post' });
            }

            await prisma.posts_tags.deleteMany({
                where: { postId }
            });

            for (const tagNome of tags) {
                let tag = await prisma.tags.findUnique({
                    where: { nome: tagNome }
                });

                if (!tag) {
                    tag = await prisma.tags.create({
                        data: { nome: tagNome }
                    });
                }

                await prisma.posts_tags.create({
                    data: {
                        postId,
                        tagId: tag.id
                    }
                });
            }

            const postAtualizado = await prisma.posts.findUnique({
                where: { id: postId },
                include: {
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });

            res.json(postAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar tags:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
};

module.exports = postsController;