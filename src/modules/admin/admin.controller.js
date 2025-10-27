const prisma = require('../../services/prisma.client');

const adminController = {
    async getPendingPosts(req, res) {
        try {
            const posts = await prisma.posts.findMany({
                where: { status: 'pendente' },
                include: {
                    autor: {
                        select: {
                            id: true,
                            nome_usuario: true,
                            url_foto_perfil: true
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
                    data_criacao: 'desc'
                }
            });

            res.json(posts);
        } catch (error) {
            console.error('Erro ao buscar posts pendentes:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async approvePost(req, res) {
        try {
            const postId = parseInt(req.params.id);
            const adminId = req.usuarioLogado.id;

            const post = await prisma.posts.findUnique({
                where: { id: postId }
            });

            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }

            const postAtualizado = await prisma.posts.update({
                where: { id: postId },
                data: {
                    status: 'aprovado',
                    aprovado_por_usuario_id: adminId,
                    data_aprovacao: new Date()
                },
                include: {
                    autor: {
                        select: {
                            id: true,
                            nome_usuario: true,
                            url_foto_perfil: true
                        }
                    },
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            });

            res.json({ message: 'Post aprovado com sucesso', post: postAtualizado });
        } catch (error) {
            console.error('Erro ao aprovar post:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async rejectPost(req, res) {
        try {
            const postId = parseInt(req.params.id);

            const post = await prisma.posts.findUnique({
                where: { id: postId }
            });

            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }

            const postAtualizado = await prisma.posts.update({
                where: { id: postId },
                data: {
                    status: 'rejeitado'
                }
            });

            res.json({ message: 'Post rejeitado com sucesso', post: postAtualizado });
        } catch (error) {
            console.error('Erro ao rejeitar post:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async deletePost(req, res) {
        try {
            const postId = parseInt(req.params.id);

            const post = await prisma.posts.findUnique({
                where: { id: postId }
            });

            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }

            await prisma.posts.delete({
                where: { id: postId }
            });

            res.json({ message: 'Post deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar post:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async deleteUser(req, res) {
        try {
            const userId = parseInt(req.params.id);

            const usuario = await prisma.usuarios.findUnique({
                where: { id: userId }
            });

            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            if (usuario.cargo === 'admin') {
                return res.status(400).json({ error: 'Não é possível deletar um administrador' });
            }

            await prisma.usuarios.delete({
                where: { id: userId }
            });

            res.json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
};

module.exports = adminController;