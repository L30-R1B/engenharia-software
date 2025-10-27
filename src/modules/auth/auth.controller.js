const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../services/prisma.client');

const authController = {
    async register(req, res) {
        try {
            const { nomeUsuario, email, senha } = req.body;

            if (!nomeUsuario || !email || !senha) {
                return res.status(400).json({ error: 'Nome de usuário, email e senha são obrigatórios' });
            }

            const usuarioExistente = await prisma.usuarios.findFirst({
                where: {
                    OR: [
                        { nome_usuario: nomeUsuario }, // <-- CORRIGIDO
                        { email }
                    ]
                }
            });

            if (usuarioExistente) {
                return res.status(400).json({ error: 'Nome de usuário ou email já existe' });
            }

            const hashSenha = await bcrypt.hash(senha, 12);

            const novoUsuario = await prisma.usuarios.create({
                data: {
                    nome_usuario: nomeUsuario, // <-- CORRIGIDO
                    email,
                    hash_senha: hashSenha, // <-- CORRIGIDO
                    cargo: 'usuario',
                    nivel: 1,
                    xp: 0,
                    moedas: 0
                },
                select: {
                    id: true,
                    nome_usuario: true,
                    email: true,
                    cargo: true,
                    nivel: true,
                    xp: true,
                    moedas: true,
                    data_criacao: true
                }
            });

            const token = jwt.sign({ id: novoUsuario.id, cargo: novoUsuario.cargo },
                process.env.JWT_SECRET || 'seu_jwt_secret', { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'Usuário criado com sucesso',
                usuario: novoUsuario,
                token
            });
        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const usuario = await prisma.usuarios.findUnique({
                where: { email }
            });

            if (!usuario) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.hash_senha); // <-- CORRIGIDO (baseado no schema)

            if (!senhaValida) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const token = jwt.sign({ id: usuario.id, cargo: usuario.cargo },
                process.env.JWT_SECRET || 'seu_jwt_secret', { expiresIn: '7d' }
            );

            const { hash_senha, ...usuarioSemSenha } = usuario; // <-- CORRIGIDO (baseado no schema)

            res.json({
                message: 'Login realizado com sucesso',
                usuario: usuarioSemSenha,
                token
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
};

module.exports = authController;