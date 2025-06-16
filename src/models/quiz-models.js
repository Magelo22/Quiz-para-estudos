const pool = require('../../db');

class QuizModels {
    static async findAll() {
        const quizes = await pool.query('SELECT * FROM quizes');
        return quizes.rows;
    }

    static async findById(id) {
        const quiz = await pool.query('SELECT * FROM quizes WHERE id = $1', [id]);
        return quiz.rows[0];
    }

    static async create(titulo, descricao, id_professor, dificuldade, questoes, imagem_path, categoria) {
        const result = await pool.query('INSERT INTO quizes (titulo, descricao, id_professor, dificuldade, questoes, imagem_path, categoria) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING id', [titulo, descricao, id_professor, dificuldade, questoes, imagem_path, categoria]);
        return result.rows[0].id;
    }

    static async update(id, titulo, descricao, dificuldade, questoes, imagem_path, categoria) {
        await pool.query('UPDATE quizes SET titulo = $1, descricao= $2, dificuldade = $4, questoes = $5, imagem_path= $6, categoria = $7 WHERE id= $3', [titulo, descricao, id, dificuldade, questoes, imagem_path,categoria]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM quizes WHERE id= $1', [id]);
    }

    static async getImagem(id) {
        const imagem_path = await pool.query('SELECT imagem_path FROM quizes WHERE id = $1', [id]);
        return imagem_path.rows[0]?.imagem_path;
    }
}

module.exports = QuizModels;