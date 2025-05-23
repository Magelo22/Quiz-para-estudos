const express = require('express');
const UsuariosController = require('../controllers/usuariosController');
const router = express.Router();
const upload = require('../config/multer');

const verificarAutenticacao = require('../middleware/usuarioMiddleware');
const verificarAutoridade = require('../middleware/usuarioAdmin');

router.post('/logar-usuario', UsuariosController.logar);
router.get('/users', verificarAutenticacao, verificarAutoridade, UsuariosController.getTodosUsuarios)
router.get('/usuarios/:id', verificarAutenticacao, UsuariosController.getUsuarios);
router.post('/inserir-usuarios', UsuariosController.inserir);
router.get('/editar-usuarios/:id', verificarAutenticacao, verificarAutoridade, UsuariosController.editar);
router.get('/editar-usuario/:id', verificarAutenticacao, UsuariosController.editPerfil);
router.post('/atualizar-usuarios/:id', verificarAutenticacao, verificarAutoridade, UsuariosController.atualizar);
router.post('/atualizar-usuario/:id', verificarAutenticacao, UsuariosController.atualizarPerfil);
router.get('/deletar-usuarios/:id', verificarAutenticacao, verificarAutoridade, UsuariosController.deletar);
router.get('/perfil-usuario/:id', verificarAutenticacao, UsuariosController.getPerfil);
router.post('/perfil-usuario/:id/avatar', upload, UsuariosController.updateAvatar);
router.get('/avatar/:id', UsuariosController.getAvatar);


router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = router;