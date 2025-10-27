const jwt = require('jsonwebtoken');
const prisma = require('../services/prisma.client');

const verifyToken = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token de acesso não fornecido' });
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_jwt_secret');

        const usuario = await prisma.usuario.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                nomeUsuario: true,
                email: true,
                cargo: true,
                nivel: true,
                xp: true,
                moedas: true,
                urlFotoPerfil: true
            }
        });

        if (!usuario) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        req.usuarioLogado = usuario;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.usuarioLogado.cargo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };