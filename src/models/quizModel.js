const pool = require('../../db');

class QuizModel{
    static async create(email, titulo, descrição){
        await pool.query('INSERT INTO quiz (email,titulo, descrição) VALUES ($1,$2,$3)', [email,titulo,descrição]);
    }

    static async delete(id){
        await pool.query('DELETE FROM quiz WHERE id = $1', [id]);
    }


}