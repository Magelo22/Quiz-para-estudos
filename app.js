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

app.use('/usuarios', usuariosRoutes);


//Endpoints dos quizes


app.get('/quizes/:id', async (req, res) => {
    const Id = req.params.id;
    try {
        if (!Id) {
            res.status(400).send("ID não encontrado");
        } else {
            const result = await pool.query('SELECT * FROM quizes where id = $1', [Id]);
            const quiz = result.rows[0];
            res.render('pages/quiz');
        }
    } catch (error) {
        console.error("Erro no postgreSQL", error);
        res.status(400).send("Nenhum quiz encontrado");
    }
});

app.post('/inserir-quiz', async (req, res) => {
    console.log(req.body);
    const { email, titulo, descricao } = req.body;
    try {
        if (!titulo || !descricao || !email) {
            res.status(400).send("Preencha todos os campos!");
        } else {
            const result = await pool.query('SELECT id FROM professores WHERE email = $1', [email]);
            const Id = result.rows[0].id;
            await pool.query('INSERT INTO quizes (titulo, descricao, professor_id) VALUES($1, $2, $3)', [titulo, descricao, Id]);
            res.redirect('/');
            console.log("Quiz criado com sucesso!");
        }
    } catch (error) {
        console.error("Erro no postgreSQL", error);
        res.status(400).send("Não foi possível criar o quiz");
    }
});

app.get('/editar-quiz/:id', async (req, res) => {
    const Id = req.paramns.id;
    try {
        if (!Id) {
            res.status(400).send("ID não encontrado!");
        } else {
            const result = await pool.query('SELECT * FROM quizes WHERE id = $1', [Id]);
            res.render('pages/editar-quiz', { quiz: result.rows[0], title: 'Editar Quiz' });
        }
    } catch (eror) {
        console.error("Erro no postgreSQL", error);
        res.status(400).send("Quiz não encontrado");
    }
});

app.post('/atualizar-quiz/:id', async (req, res) => {
    const Id = req.params.id;
    const { titulo, descricao } = req.body;
    try {
        if (!titulo || !descricao) {
            res.status(400).send("Preencha todos os campos!");
        } else {
            await pool.query('UPDATE quizes SET titulo = $1, descricao = $2 where id = $3', [titulo, descricao, Id]);
            res.redirect('/users');
            console.log("Quiz atualizado com sucesso");
        }
    } catch (error) {
        console.error("Erro no postgreSQl", error);
        res.status(400).send("Não foi possível atualizaar o quiz");
    }
});

app.get('/deletar-quizes/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(400).send("ID não encontrado!");
        } else {
            await pool.query('DELETE FROM quizes WHERE id = $1', [id]);
            res.redirect('/users');
            console.log("Quiz deletado com sucesso!");
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao deletar quiz");
    }
});


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

app.get('/users', verificarAutenticacao, UsuariosController.getTodosUsuarios);

app.get('/editar-usuarios/:id', verificarAutenticacao, UsuariosController.editar);

app.get('/criar-quiz', (req, res) => {
    res.render('pages/criar-quiz', { title: "Criar Quiz" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta:`, PORT);
});

