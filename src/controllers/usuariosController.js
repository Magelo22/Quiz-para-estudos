const UsuariosModel = require('../models/usuariosModel');
const path = require('path');
const fs = require('fs');

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
                    req.session.usuario = usuario;
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
        const { nome, email, senha, telefone, data_nasc, papel } = req.body;
        try {
            if (!nome || !email || !senha || !telefone || !data_nasc) {
                return res.status(400).send("Preencha todos os campos");
            }
            await UsuariosModel.update(id, nome, email, senha, telefone, data_nasc, papel);
            res.redirect('/usuarios/users');
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
            res.redirect('/usuarios/users');
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao deletar Usuario");
        }
    }

    static async getPerfil(req, res) {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(400).send("ID não encontrado!");
            }
            const usuario = await UsuariosModel.findById(id);
            if (!usuario) {
                return res.status(404).send("Usuario não encontrado!");
            }
            res.render('pages/perfil-usuario', { usuario, title: 'Perfil do Usuario' });
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao buscar Usuario");
        }
    }

    static async updateAvatar(req, res) {
        const id = req.params.id;
        if (!req.file) {
            return res.status(400).send("Arquivo não encontrado!");
        }
        try {
            const avatarPath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
            await UsuariosModel.updateAvatar(id, avatarPath);
            res.redirect(`/usuarios/editar-usuario/${id}`);
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao atualizar Avatar");
        }
    }

    static async getAvatar(req, res) {
        const id = req.params.id;
        try {
            const avatarPath = await UsuariosModel.getAvatarPath(id);
            if (!avatarPath || typeof avatarPath !== 'string') {
                return res.sendFile(path.join(__dirname, '../../public/images/default-avatar.png'));
            }
            const fullPath = path.join(__dirname, '../../public', avatarPath);
            if (fs.existsSync(fullPath)) {
                return res.sendFile(fullPath);
            }
            else {
                return res.sendFile(path.join(__dirname, '../../public/images/default-avatar.png'));
            }
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao buscar Avatar");
        }
    }



    static async editPerfil(req, res) {
        const id = req.params.id;
        try {
            if (!id) {
                return res.status(400).send("ID não encontrado!");
            }
            const usuario = await UsuariosModel.findById(id);
            res.render('pages/editar-usuario', { usuario, title: "Editar Perfil" });
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao buscar Usuario");
        }
    }

    static async atualizarPerfil(req, res) {
        const id = req.params.id;
        const { nome, telefone, data_nasc, papel } = req.body;
        try {
            if (!nome || !telefone || !data_nasc || !papel) {
                return res.status(400).send("Preencha todos os campos");
            }
            await UsuariosModel.updatePerfil(id, nome, telefone, data_nasc, papel);
            res.redirect(`/usuarios/perfil-usuario/${id}`);
        } catch (error) {
            console.error('Erro no postgreSQL', error);
            return res.status(500).send("Error ao atualizar Usuario");
        }
    }

}

module.exports = UsuariosController;