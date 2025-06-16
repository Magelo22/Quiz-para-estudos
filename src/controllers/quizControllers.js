const QuizModels = require('../models/quiz-models');
const path = require('path');
const fs = require('fs');
const { title } = require('process');

class QuizControllers {
    static async getTodosQuizes(req, res) {
        try {
            const quizes = await QuizModels.findAll();
            if (!quizes) {
                return res.status(404).send('Quizes não encontrado');
            }
            res.render('pages/explorar', { quizes, title: "Explorar" });
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Erro ao buscar quizes");
        }
    }

    static async getQuiz(req, res) {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(400).send('ID não encontrado');
            }
            const quiz = await QuizModels.findById(id);
            if (!quiz) {
                return res.status(404).send('Quiz não encontrado');
            }
            res.render('pages/explorar', { quiz });
        } catch (error) {
            console.error('Erro no PostgreSQl', error);
            return res.status(500).send('Erro ao buscar quiz');
        }
    }

    static async criarPerguntas(req, res) {
        const id = req.params.id;
        const numQuestoes = req.query.questoes;
        const questaoAtual = req.query.questaoAtual || 1;
        try {
            if (!id) {
                return res.status(400).send('ID não encontrado');
            }
            const quiz = await QuizModels.findById(id);
            if (!quiz) {
                return res.status(404).send('Quiz não encontrado');
            }
            res.render('pages/criar-perguntas', { quiz, numQuestoes, questaoAtual: parseInt(questaoAtual), title: `Criar Questão ${questaoAtual} de ${numQuestoes}` });
        } catch (error) {
            console.error('Erro no PostgreSQl', error);
            return res.status(500).send('Erro ao buscar dados de quiz');
        }
    }

    static async getImagem(req, res) {
        const id = req.params.id;
        try {
            const imagem_path = await QuizModels.getImagem(id);
            const fullPath = path.join(__dirname, '../../public', imagem_path);
            if (fs.existsSync(fullPath)) {
                return res.sendFile(fullPath);
            }
            else {
                return res.status(400).send('Imagem não encontrada');
            }
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao buscar Imagem");
        }
    }

    static async inserir(req, res) {
        const id_professor = req.session.usuario.id;
        const { titulo, descricao, dificuldade, questoes, categoria } = req.body;
        try {
            if (!req.file) {
                return res.status(400).send('Arquivo não encontrado');
            }
            if (!id_professor) {
                return res.status(400).send('ID do professor não encontrado');
            }
            if (!titulo || !descricao || !dificuldade || !questoes || !categoria) {
                return res.status(400).send('Preencha todos os campos')
            }
            const imagem_path = path.join('uploads', req.file.filename).replace(/\\/g, '/');
            const quizId = await QuizModels.create(titulo, descricao, id_professor, dificuldade, questoes, imagem_path, categoria);
            res.redirect(`/quizes/criar-perguntas/${quizId}?questoes=${questoes}`);
        } catch (error) {
            console.error('Erro no PostgreSQL', error);
            return res.status(500).send('Erro ao criar o quiz');
        }
    }

    static async atualizar(req, res) {
        const id = req.params.id;
        const { titulo, descricao, dificuldade, questoes, categoria } = req.body;
        try {
            if (!req.file) {
                return res.status(400).send('Arquivo não encontrado');
            }
            if (!titulo || !descricao || !dificuldade || !questoes || !categoria) {
                return res.status(400).send('Preencha todos os campos');
            }
            const quizExistente = await QuizModels.findById(id);
            if (!quizExistente) {
                return res.status(404).send('Quiz não encontrado');
            }
            const imagem_path = path.join('uploads', req.file.filename).replace(/\\/g, '/');
            await QuizModels.update(titulo, descricao, dificuldade, questoes, imagem_path, categoria);
            res.redirect('/explorar');
        } catch (error) {
            console.error('Erro no PostgreSQL', error);
            return res.status(500).send('Erro ao atualizar o quiz');

        }
    }

    static async deletar(req, res) {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(400).send('ID não encontrado');
            }
            const quizExistente = await QuizModels.findById(id);
            if (!quizExistente) {
                return res.status(404).send('Quiz não encontrado');
            }
            await QuizModels.delete(id);
            res.redirect('/explorar');
        } catch (error) {
            console.error('Erro no PostgreSQL', error);
            return res.status(500).send('Erro ao deletar o quiz');
        }
    }
}

module.exports = QuizControllers;