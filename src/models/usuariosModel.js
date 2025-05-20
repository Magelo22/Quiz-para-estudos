const pool = require('../../db');

class UsuariosModel {
    static async findByEmail(email) {
        const usuario = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        return usuario.rows[0];
    }

    static async findAll() {
        const usuarios = await pool.query('SELECT * FROM usuarios ORDER BY id');
        return usuarios.rows;
    }

    static async findById(id,) {
        const usuario = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        return usuario.rows[0];
    }

    static async create(nome, email, senha, papel) {
        await pool.query('INSERT INTO usuarios (nome,email,senha, papel) VALUES ($1,$2,$3,$4)', [nome, email, senha, papel]);
    }

    static async update(id, nome, email, senha, telefone, data_nasc, papel) {
        await pool.query('UPDATE usuarios SET nome = $1, email = $2, senha = $3, telefone = $4, data_nasc = $5, papel = $6 WHERE id = $7', [nome, email, senha, telefone, data_nasc, papel, id]);
    }

    static async updatePerfil(id, nome, telefone, data_nasc, papel) {
        await pool.query('UPDATE usuarios SET nome = $1, telefone = $2, data_nasc = $3, papel = $4 WHERE id = $5', [nome, telefone, data_nasc, papel, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    }
}

module.exports = UsuariosModel;