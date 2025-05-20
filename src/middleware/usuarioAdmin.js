function verificarAutoridade(req, res, next) {
    if(req.session.usuario.email === 'admin@admin.com' && req.session.usuario.senha === 'admin123'){
        return next();
    } else{
        return res.redirect('/');
    }
}
module.exports = verificarAutoridade;