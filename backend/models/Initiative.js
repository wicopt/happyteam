const { pool } = require("../config/dbConfig");

class Initiative {
  static fromDb(raw) {
    return {
      initiator_id: raw.initiator_id,
      chat_link: raw.chat_link,
      funds_link: raw.funds_link
    }
  }

  static async findById(user_id) {
    const result = await pool.query(
      `SELECT initiator_id, chat_link, funds_link
       FROM users
       WHERE user_id = $1`,
      [user_id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  static async create(initiativeData) {
    const { user_id, initiator_id, chat_link, funds_link } = initiativeData;

    // ИСПРАВЛЕННЫЙ ЗАПРОС - правильный синтаксис UPDATE
    const query = `
      UPDATE users
      SET initiator_id = $1, 
          chat_link = $2, 
          funds_link = $3
      WHERE user_id = $4
      RETURNING initiator_id, chat_link, funds_link;
    `;
    const values = [initiator_id, chat_link, funds_link, user_id];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(user_id) {
    // ИСПРАВЛЕННЫЙ ЗАПРОС - правильный синтаксис UPDATE
    const result = await pool.query(
      `UPDATE users
       SET initiator_id = NULL, 
           chat_link = NULL, 
           funds_link = NULL
       WHERE user_id = $1
       RETURNING *`,
      [user_id]
    );
    return result.rows[0];
  }
}

module.exports = Initiative;