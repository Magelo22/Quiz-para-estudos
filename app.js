const express = require('express');
const path = require('path');
const app = express();
const pool = require('./db');
const { title } = require('process');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
const UsuariosController = require('./src/controllers/usuariosController');
const session = require('express-session');
const verificarAutenticacao = require('./src/middleware/usuarioMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'segredo-super-seguro',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use((req, res, next) => {
    if (req.session && req.session.usuario) {
        res.locals.usuario = req.session.usuario;
    } else {
        res.locals.usuario = null;
    }
    next();
});

app.use('/usuarios', usuariosRoutes);

//Rotas

app.get('/', verificarAutenticacao, async (req, res) => {
    res.render('pages/index', { title: "Home" });
});

app.get('/explorar', verificarAutenticacao, (req, res) => {
    res.render('pages/explorar', { title: "Explorar" });
});

app.get('/login', (req, res) => {
    res.render('pages/login', { title: "Login" });
});

app.get('/cadastro-usuarios', (req, res) => {
    res.render('pages/cadastro-usuarios', { title: "Cadastro do Usuarios" });
});

app.get('/login-usuario', (req, res) => {
    res.render('pages/login-usuario', { title: "Login do Usuario" });
});

app.get('/criar-quiz', (req, res) => {
    res.render('pages/criar-quiz', { title: "Criar Quiz" });
});

app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta:`, PORT);
});

