const express = require('express');
const UsuariosController = require('../controllers/usuariosController');
const router = express.Router();
const verificarAutenticacao = require('../middleware/usuarioMiddleware');

router.post('/logar-usuario', UsuariosController.logar);
router.get('/users', verificarAutenticacao, UsuariosController.getTodosUsuarios)
router.get('/usuarios/:id', verificarAutenticacao, UsuariosController.getUsuarios);
router.post('/inserir-usuarios', UsuariosController.inserir);
router.get('/editar-usuarios/:id', verificarAutenticacao, UsuariosController.editar);
router.post('/atualizar-usuarios/:id', verificarAutenticacao, UsuariosController.atualizar);
router.get('/deletar-usuarios/:id', verificarAutenticacao, UsuariosController.deletar);

module.exports = router;