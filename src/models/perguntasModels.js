const pool = require('../../db');

class PerguntasModels {
    static async findAll() {
        const perguntas = await pool.query('SELECT * FROM perguntas');
        return perguntas.rows;
    }

    static async findById(id){
        const pergunta = await pool.query('SELECT * FROM perguntas WHERE id = $1', [id]);
        return res.pergunta.rows[0];
    }

    static async create(questao, resposta, ){

    }

}