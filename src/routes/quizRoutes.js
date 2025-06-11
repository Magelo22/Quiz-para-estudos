const express = require('express');
const QuizControllers = require('../controllers/quizControllers');
const router = express.Router()
const upload = require('../config/quiz-multer');

const verificarAutenticacao = require('../middleware/usuarioMiddleware');

router.get('/quizes', QuizControllers.getTodosQuizes);
router.get('/quiz/:id', QuizControllers.getQuiz);
router.post('/inserir-quizes', verificarAutenticacao, upload, QuizControllers.inserir);
router.post('/atualizar-quizes/:id', verificarAutenticacao, upload, QuizControllers.atualizar);
router.get('/deletar-quizes/:id', verificarAutenticacao, QuizControllers.deletar);
router.get('/imagem/:id', verificarAutenticacao, QuizControllers.getImagem);

module.exports = router;