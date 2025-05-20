const express = require('express');
const UsuariosController = require('../controllers/usuariosController');
const router = express.Router();
const verificarAutenticacao = require('../middleware/usuarioMiddleware');

router.post('/logar-usuario', UsuariosController.logar);
router.get('/users', verificarAutenticacao, UsuariosController.getTodosUsuarios)
router.get('/usuarios/:id', verificarAutenticacao, UsuariosController.getUsuarios);
router.post('/inserir-usuarios', UsuariosController.inserir);
router.get('/editar-usuarios/:id', verificarAutenticacao, UsuariosController.editar);
router.get('/editar-usuario/:id', verificarAutenticacao, UsuariosController.editPerfil);
router.post('/atualizar-usuarios/:id', verificarAutenticacao, UsuariosController.atualizar);
router.post('/atualizar-usuario/:id', verificarAutenticacao, UsuariosController.atualizarPerfil);
router.get('/deletar-usuarios/:id', verificarAutenticacao, UsuariosController.deletar);
router.get('/perfil-usuario/:id', verificarAutenticacao, UsuariosController.getPerfil);

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = router;