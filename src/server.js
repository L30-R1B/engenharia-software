const express = require('express');
require('dotenv').config();

const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const postsRoutes = require('./modules/posts/posts.routes');
const tagsRoutes = require('./modules/tags/tags.routes');
const adminRoutes = require('./modules/admin/admin.routes');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/tags', tagsRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'API está funcionando' });
});

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});