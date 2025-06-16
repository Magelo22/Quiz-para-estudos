function verificarProf(req, res, next) {
    if(req.session.usuario.papel === 'Professor'){
        return next();
    } else{
        return res.redirect('/');
    }
}
module.exports = verificarProf;