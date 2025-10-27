const prisma = require('../../services/prisma.client');

const tagsController = {
    async getAllTags(req, res) {
        try {
            const tags = await prisma.tag.findMany({
                include: {
                    _count: {
                        select: {
                            posts: true
                        }
                    }
                },
                orderBy: {
                    nome: 'asc'
                }
            });

            res.json(tags);
        } catch (error) {
            console.error('Erro ao buscar tags:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async getPostsByTag(req, res) {
        try {
            const tagNome = req.params.nome;

            const posts = await prisma.post.findMany({
                where: {
                    status: 'aprovado',
                    tags: {
                        some: {
                            tag: {
                                nome: tagNome
                            }
                        }
                    }
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
                },
                orderBy: {
                    dataCriacao: 'desc'
                }
            });

            res.json(posts);
        } catch (error) {
            console.error('Erro ao buscar posts por tag:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
};

module.exports = tagsController;