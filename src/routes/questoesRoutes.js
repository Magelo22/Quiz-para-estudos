const express = require('express');
const QuestoesController = require('../controllers/questoesControllers');
const router = express.Router()
const upload = require('../config/quiz-multer');
const verificarAutenticacao = require('../middleware/usuarioMiddleware');
const verificarProf = require('../middleware/usuarioProf');
const verificarAutoridade = require('../middleware/usuarioAdmin');

router.get('/questoes/:id', verificarAutenticacao, QuestoesController.getTodasQuestoes);
router.get('/questao/:id', verificarAutenticacao, QuestoesController.getQuestao);
router.post('/inserir-questoes/:id', verificarAutenticacao, verificarProf, upload, QuestoesController.inserir);
router.post('/atualizar-questoes/:id', verificarAutenticacao, verificarAutoridade, upload, QuestoesController.atualizar);
router.get('/deletar-questoes', verificarAutenticacao, verificarAutoridade, QuestoesController.deletar);
router.get('/imagem/:id', verificarAutenticacao, QuestoesController.getImagem);

module.exports = router;