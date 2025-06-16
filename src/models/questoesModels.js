const pool = require('../../db');

class QuestoesModels {
    static async findAll() {
        const questoes = await pool.query('SELECT * FROM questoes');
        return questoes.rows;
    }
    static async findByQuizId(id_quiz) {
        const questoes = await pool.query('SELECT * FROM questoes WHERE id_quiz = $1', [id_quiz]);
        return questoes.rows;
    }

    static async findById(id) {
        const questao = await pool.query('SELECT * FROM questoes WHERE id = $1', [id]);
        return questao.rows[0];
    }

    static async create(id_quiz, enunciado, imagem_path, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao) {
        const result = await pool.query(`INSERT INTO questoes (id_quiz, enunciado, imagem_path, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`, [id_quiz, enunciado, imagem_path, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao]
        );
        return result.rows[0].id;
    }

    static async update(id, enunciado, imagem_path, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao) {
        await pool.query(`UPDATE questoes SET enunciado = $1, imagem_path = $2, alternativa_a = $3, alternativa_b = $4, alternativa_c = $5, alternativa_d = $6, alternativa_e = $7, resposta_correta = $8, explicacao = $9 WHERE id = $10`, [enunciado, imagem_path, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM questoes WHERE id = $1', [id]);
    }

    static async getImagem(id) {
        const imagem_path = await pool.query('SELECT imagem_path FROM questoes WHERE id = $1', [id]);
        return imagem_path.rows[0]?.imagem_path;
    }
}

module.exports = QuestoesModels;