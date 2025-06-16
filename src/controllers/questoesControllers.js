const QuestoesModels = require('../models/questoesModels');
const path = require('path');
const fs = require('fs');
const { title } = require('process');
const QuizModels = require('../models/quiz-models');

class QuestoesController {
    static async getTodasQuestoes(req, res) {
        const id_quiz = req.params.id;
        try {
            const questoes = await QuestoesModels.findByQuizId(id_quiz);
            if (!questoes) {
                return res.status(404).send('Questões não encontradas');
            }
            const quiz = await QuizModels.findById(id_quiz);
            res.render('pages/quiz', { questoes, quiz, title: "Quiz" });
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Erro ao buscar questoes");
        }
    }

    static async getQuestao(req, res) {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(404).send('ID não encontrado');
            }
            const questao = await QuestoesModels.findById(id);
            if (!questao) {
                return res.status(404).send('Questão não encontrada');
            }
            res.render('pages/quiz', { questao });
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Erro ao buscar questao");
        }
    }

    static async getImagem(req, res) {
        const id = req.params.id;
        try {
            const imagem_path = await QuestoesModels.getImagem(id);
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
        const id_quiz = req.params.id;
        const questaoAtual = parseInt(req.query.questaoAtual || 1);
        const numQuestoes = parseInt(req.query.numQuestoes);
        const { enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao } = req.body;
        try {
            if (!id_quiz) {
                return res.status(400).send('ID do quiz não encontrado');
            }
            if (!enunciado || !alternativa_a || !alternativa_b || !alternativa_c || !alternativa_d || !alternativa_e || !resposta_correta || !explicacao) {
                return res.status(400).send('Preencha todos os campos');
            }

            const imagem_path = req.file ? path.join('uploads', req.file.filename).replace(/\\/g, '/') : null;
            await QuestoesModels.create(id_quiz, enunciado, imagem_path, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao);

            if (questaoAtual < numQuestoes) {
                const proximaQuestao = questaoAtual + 1;
                return res.redirect(`/quizes/criar-perguntas/${id_quiz}?questoes=${numQuestoes}&questaoAtual=${proximaQuestao}`);
            } else {
                return res.redirect('/quizes/explorar');
            }
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Erro ao inserir questao");
        }
    }

    static async atualizar(req, res) {
        const id = req.params.id;
        const { enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao } = req.body;
        try {
            if (!req.file) {
                return res.status(400).send('Imagem não encontrada');
            }
            if (!id) {
                return res.status(400).send('ID não encontrado');
            }
            if (!enunciado || !alternativa_a || !alternativa_b || !alternativa_c || !alternativa_d || !alternativa_e || !resposta_correta || !explicacao) {
                return res.status(400).send('Preencha todos os campos');
            }
            const questãoExistente = await QuestoesModels.getQuestao(id);
            if (!questãoExistente) {
                return res.status(404).send('Questão não encontrado');
            }
            const imagem_path = path.join('uploads', req.file.filename).replace(/\\/g, '/');
            await QuestoesModels.atualizar(enunciado, imagem_path, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao);
            res.redirect('/explorar');
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Erro ao atualizar questao");
        }
    }

    static async deletar(req, res) {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(400).send('ID não encontrado');
            }
            questaoexistente = await QuestoesModels.getQuestao(id);
            if (!questaoexistente) {
                return res.status(404).send('Questão não encontrada');
            }
            await QuestoesModels.deletar(id);
            res.redirect('/explorar');
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Erro ao deletar questao");
        }
    }
}

module.exports = QuestoesController;