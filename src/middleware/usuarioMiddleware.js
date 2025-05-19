function verificarAutenticacao(req, res, next) {
    if (req.session && req.session.usuario) {

        return next();
    } else {
        return res.redirect('/login');
    }
}

module.exports = verificarAutenticacao;
