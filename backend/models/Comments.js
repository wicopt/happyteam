const { pool } = require("../config/dbConfig");
class Comments {
  static fromDb(raw) {
    return {
      comment_id: Number(raw.comment_id),
      wish_id: Number(raw.wish_id),
      user_id: Number(raw.user_id),
      content: raw.content,
      name: raw.name,
      surname: raw.surname,
      department_name: raw.department_name,
      profile_picture: raw.profile_picture,
      dateNtime: raw.dateNtime
    };
  }
  static async findById(comment_id) {
    const result = await pool.query(
      `SELECT c.user_id, c.comment_id, c.wish_id, 
        c.content, c.dateNtime, u.name, u.surname, u.profile_picture, d.department_name
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       LEFT JOIN departments d ON u.department_id = d.department_id
       WHERE c.comment_id = $1`,
      [comment_id]
    );
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }
    static async create(commentData) {
    const { wish_id, user_id, content } = commentData;

    const query = `
        INSERT INTO comments (user_id, wish_id, content)
        VALUES ($1, $2, $3)
        RETURNING comment_id, user_id, wish_id, content;
    `;

    const values = [user_id, wish_id, content];
    const result = await pool.query(query, values);
    
    // Получаем полные данные созданного комментария
    const createdComment = await this.findById(result.rows[0].comment_id);
    
    return this.fromDb(createdComment);
  }
  static async delete(commentId) {
    const result = await pool.query(
      `DELETE FROM comments 
       WHERE comment_id = $1
       RETURNING *`,
      [commentId]
    );
  }
  static async findAll(wish_id) {
    const result = await pool.query(
      `SELECT c.user_id, c.comment_id, c.wish_id, 
        c.content, u.name, u.surname, u.profile_picture, d.department_name
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       LEFT JOIN departments d ON u.department_id = d.department_id
       WHERE c.wish_id = $1`,
      [wish_id]
    );
    if (result.rows.length === 0) {
      return [];
    }

    return result.rows.map((row) => this.fromDb(row));
  }
}
module.exports = Comments;
