const express = require('express');
const QuizControllers = require('../controllers/quizControllers');
const router = express.Router()
const upload = require('../config/quiz-multer');
const verificarAutenticacao = require('../middleware/usuarioMiddleware');
const verificarProf = require('../middleware/usuarioProf');
const verificarAutoridade = require('../middleware/usuarioAdmin');

router.get('/explorar', verificarAutenticacao, QuizControllers.getTodosQuizes);
router.get('/quiz/:id', verificarAutenticacao, QuizControllers.getQuiz);
router.post('/inserir-quizes', verificarAutenticacao, verificarProf, upload, QuizControllers.inserir);
router.post('/atualizar-quizes/:id', verificarAutenticacao, verificarAutoridade, upload, QuizControllers.atualizar);
router.get('/deletar-quizes/:id', verificarAutenticacao, verificarAutoridade, QuizControllers.deletar);
router.get('/criar-perguntas/:id', verificarAutenticacao, verificarProf, QuizControllers.criarPerguntas);
router.get('/imagem/:id', verificarAutenticacao, QuizControllers.getImagem);

module.exports = router;