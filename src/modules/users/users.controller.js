const prisma = require('../../services/prisma.client');

const usersController = {
    async getMe(req, res) {
        try {
            const usuario = await prisma.usuarios.findUnique({
                where: { id: req.usuarioLogado.id },
                select: {
                    id: true,
                    nomeUsuario: true,
                    email: true,
                    urlFotoPerfil: true,
                    cargo: true,
                    nivel: true,
                    xp: true,
                    moedas: true,
                    dataCriacao: true,
                    _count: {
                        select: {
                            seguidores: true,
                            seguindo: true,
                            posts: true
                        }
                    }
                }
            });

            res.json(usuario);
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async getUserById(req, res) {
        try {
            const userId = parseInt(req.params.id);

            const usuario = await prisma.usuarios.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    nomeUsuario: true,
                    urlFotoPerfil: true,
                    nivel: true,
                    xp: true,
                    moedas: true,
                    dataCriacao: true,
                    _count: {
                        select: {
                            seguidores: true,
                            seguindo: true,
                            posts: {
                                where: {
                                    status: 'aprovado'
                                }
                            }
                        }
                    }
                }
            });

            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.json(usuario);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async followUser(req, res) {
        try {
            const userIdToFollow = parseInt(req.params.id);
            const currentUserId = req.usuarioLogado.id;

            if (userIdToFollow === currentUserId) {
                return res.status(400).json({ error: 'Não é possível seguir a si mesmo' });
            }

            const usuarioParaSeguir = await prisma.usuarios.findUnique({
                where: { id: userIdToFollow }
            });

            if (!usuarioParaSeguir) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const jaSeguindo = await prisma.seguidores.findUnique({
                where: {
                    seguidorUsuarioId_seguidoUsuarioId: {
                        seguidorUsuarioId: currentUserId,
                        seguidoUsuarioId: userIdToFollow
                    }
                }
            });

            if (jaSeguindo) {
                return res.status(400).json({ error: 'Você já segue este usuário' });
            }

            await prisma.seguidores.create({
                data: {
                    seguidorUsuarioId: currentUserId,
                    seguidoUsuarioId: userIdToFollow
                }
            });

            res.json({ message: 'Usuário seguido com sucesso' });
        } catch (error) {
            console.error('Erro ao seguir usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async unfollowUser(req, res) {
        try {
            const userIdToUnfollow = parseInt(req.params.id);
            const currentUserId = req.usuarioLogado.id;

            const seguindo = await prisma.seguidores.findUnique({
                where: {
                    seguidorUsuarioId_seguidoUsuarioId: {
                        seguidorUsuarioId: currentUserId,
                        seguidoUsuarioId: userIdToUnfollow
                    }
                }
            });

            if (!seguindo) {
                return res.status(400).json({ error: 'Você não segue este usuário' });
            }

            await prisma.seguidores.delete({
                where: {
                    seguidorUsuarioId_seguidoUsuarioId: {
                        seguidorUsuarioId: currentUserId,
                        seguidoUsuarioId: userIdToUnfollow
                    }
                }
            });

            res.json({ message: 'Deixou de seguir o usuário com sucesso' });
        } catch (error) {
            console.error('Erro ao deixar de seguir:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
};

module.exports = usersController;