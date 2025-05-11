const express = require('express');
const UsuariosController = require('../controllers/usuariosController');
const router = express.Router();

router.post('/logar-usuario', UsuariosController.logar);
router.get('/users', UsuariosController.getTodosUsuarios)
router.get('/usuarios/:id', UsuariosController.getUsuarios);
router.post('/inserir-usuarios', UsuariosController.inserir);
router.get('/editar-usuarios/:id', UsuariosController.editar);
router.post('/atualizar-usuarios/:id', UsuariosController.atualizar);
router.get('/deletar-usuarios/:id', UsuariosController.deletar);

module.exports = router;