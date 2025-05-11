const UsuariosModel = require('../models/usuariosModel');

class UsuariosController {
    static async logar(req, res) {
        const { email, senha } = req.body;
        try {
            if (!email || !senha) {
                return res.status(400).send("Preencha todos os campos!");
            }
            const usuario = await UsuariosModel.findByEmail(email);
            if (usuario) {
                if (usuario.senha === senha) {
                    return res.redirect('/');
                } else {
                    return res.status(401).send("Senha incorreta");
                }
            } else {
                return res.status(404).send("Usuario ainda não cadastrado");
            }
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao tentar fazer login");
        }
    }

    static async getTodosUsuarios(req, res) {
        try {
            const usuarios = await UsuariosModel.findAll();
            return res.render('pages/adm', { usuarios, title: "Usuarios" });
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Erro ao buscar usuários");
        }
    }


    static async getUsuarios(req, res) {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(400).send("ID não encontrado");
            }
            const usuario = await UsuariosModel.findById(id);
            res.render('pages/adm', { usuario });
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao buscar Usuario");
        }
    }

    static async editar(req, res) {
        const id = req.params.id;
        try {   
            if (!id) {
                return res.status(400).send("ID não encontrado!");
            }
            const usuario = await UsuariosModel.findById(id);
            res.render('pages/editar-usuarios', { usuario, title: "Editar Usuarios" });
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao buscar Usuario");
        }
    }

    static async inserir(req, res) {
        const { nome, email, senha, papel } = req.body;
        try {
            if (!nome || !email || !senha || !papel) {
                return res.status(400).send("Preencha todos os campos!");
            }
            await UsuariosModel.create(nome, email, senha, papel);
            res.redirect('/login-usuario');
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao cadastrar Usuario");
        }
    }

    static async atualizar(req, res) {
        const id = req.params.id;
        const { nome, email, senha, papel } = req.body;
        try {
            if (!nome || !email || !senha) {
                return res.status(400).send("Preencha todos os campos");
            }
            await UsuariosModel.update(id, nome, email, senha, papel);
            res.redirect('/users');
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao atualizar Usuario");
        }
    }

    static async deletar(req, res) {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(400).send("ID não encontrado!");
            }
            await UsuariosModel.delete(id);
            res.redirect('/users');
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao deletar Usuario");
        }
    }

}

module.exports = UsuariosController;