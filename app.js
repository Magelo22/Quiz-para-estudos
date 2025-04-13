
const express = require('express');
const path = require('path');
const app = express();
const pool = require('./db');
const { title } = require('process');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//Endopoints do Aluno

app.get('/alunos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).send("ID não encontrado");
        } else {
            const result = await pool.query('SELECT * FROM alunos WHERE id = $1', [id]);
            const aluno = result.rows[0];
            res.render('pages/adm', { aluno });
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao buscar aluno");
    }
});

app.post('/inserir-alunos', async (req, res) => {
    try {
        console.log(req.body);
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            res.status(400).send("Preencha todos os campos!");
        } else {
            await pool.query('INSERT INTO alunos (nome, email, senha) VALUES ($1 , $2, $3)', [nome, email, senha]);
            res.redirect('/');
            console.log("Aluno criado com sucesso!")
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao criar aluno");
    }
});

app.get('/editar-alunos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(400).send("ID não encontrado!");
        } else {
            const result = await pool.query('SELECT * FROM alunos WHERE id = $1', [id]);
            res.render('pages/editar-aluno', { aluno: result.rows[0], title: "Editar Aluno" });
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao buscar aluno");
    }
});

app.post('/atualizar-alunos/:id', async (req, res) => {
    const id = req.params.id;
    const { nome, email, senha } = req.body;
    try {
        if (!nome || !email || !senha) {
            res.status(400).send("Preencha todos os campos");
        }
        else {
            await pool.query('UPDATE alunos SET nome = $1, email = $2, senha = $3 WHERE id = $4', [nome, email, senha, id]);
            res.redirect('/users');
            console.log("Aluno atualizado com sucesso!");
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao atualizar aluno");
    }
});

app.get('/deletar-alunos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(400).send("Preencha todos os campos");
        } else {
            await pool.query('DELETE FROM alunos WHERE id = $1', [id]);
            res.redirect('/users');
            console.log("Aluno deletado com sucesso!");
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao deletar aluno");
    }
});

//Endpoints dos Professores

app.get('/professores/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(400).send("ID não encontrado!");
        } else {
            const result = await pool.query('SELECT * FROM professores WHERE id = $1', [id]);
            const professor = result.rows;
            res.render('pages/adm');
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao buscar professor");
    }
});

app.post('/inserir-professores', async (req, res) => {
    console.log(req.body);
    const { nome, email, senha } = req.body;
    try {
        if (!nome || !email || !senha) {
            res.status(400).send("Preencha todos os campos!");
        } else {
            await pool.query('INSERT INTO professores (nome, email, senha) VALUES ($1, $2, $3)', [nome, email, senha]);
            res.redirect('/');
            console.log("Professor inserido com sucesso!");
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao inserir professor");
    }
});

app.get('/editar-professores/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(400).send("ID não encontrado!");
        } else {
            const result = await pool.query('SELECT * FROM professores WHERE id = $1', [id]);
            res.render('/editar-professor', { professor: result.rows[0], title: 'Editar Professor' });
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao buscar professor");
    }
});

app.post('atualizar-professores/:id', async (req, res) => {
    const id = req.paramns.id;
    const { nome, email, senha } = req.body;
    try {
        if (!nome || !email || !senha) {
            res.status(400).send("Preencha todos os campos!");
        } else {
            await pool.query('UPDATE professores SET nome = $1, email = $2, senha = $3 WHERE id = $4', [nome, email, senha, id]);
            res.redirect('/users');
            console.log("Professor atualizado com sucesso!");
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao atualizar professor");
    }
});

app.get('/deletar-professores/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(400).send("ID não encontrado!");
        } else {
            await pool.query('DELETE FROM professores WHERE id = $1', [id]);
            res.redirect('/users');
            console.log("Professor deletado com sucesso!");
        }
    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao deletar professor");
    }
});

//Rotas

app.get('/', (req, res) => {
    res.render('pages/index', { title: "Home" });
});

app.get('/explorar', (req, res) => {
    res.render('pages/explorar', { title: "Explorar" });
});

app.get('/login', (req, res) => {
    res.render('pages/login', { title: "Login" });
});

app.get('/login-aluno', (req, res) => {
    res.render('pages/login-aluno', { title: "Login do Aluno" });
});

app.get('/login-professor', (req, res) => {
    res.render('pages/login-professor', { title: "Login do Professor" });
});

app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM alunos');
        const result2 = await pool.query('SELECT * FROM professores');
        const alunos = result.rows;
        const professores = result2.rows;
        res.render('pages/adm', { alunos, professores, title: "Users" });

    } catch (error) {
        console.error('Erro no postgreSQL', error);
        res.status(500).send("Error ao buscar alunos");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta:`, PORT);
});

