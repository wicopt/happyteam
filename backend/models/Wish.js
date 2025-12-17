const { pool } = require("../config/dbConfig");
class Wish {
  static async FindById(wishId) {
    const result = await pool.query(
      `SELECT wish_id, name, description, link
      FROM wishes WHERE wish_id = $1`,
      [wishId]
    );
    return result.rows[0];
  }
  static async findAll(userId) {
    const result = await pool.query(
      `SELECT wish_id, name, description, link
      FROM wishes WHERE user_id = $1
      ORDER BY wish_id`,
      [userId]
    );
    return result.rows;
  }
  // WITH PRICE
  // static async update(wishId, updateData) {
  //   const { name, description, price, link } = updateData;

  //   const result = await pool.query(
  //     `UPDATE wishes
  //      SET name = $1, description = $2, price = $3 link = $4
  //      WHERE wish_id = $5
  //      RETURNING *`,
  //     [name, description, price, link, wishId]
  //   );

  //   return result.rows[0];
  // }
  static async update(wishId, updateData) {
    const { name, description, link } = updateData;

    const result = await pool.query(
      `UPDATE wishes 
       SET name = $1, description = $2, link = $3
       WHERE wish_id = $4
       RETURNING *`,
      [name, description, link, wishId]
    );

    return result.rows[0];
  }

  static async delete(wishId) {
    const result = await pool.query(
      `DELETE FROM wishes 
       WHERE wish_id = $1
       RETURNING *`,
      [wishId]
    );
  }
  static async create(wishData) {
    const { user_id, name, description, link } = wishData;
    const result = await pool.query(
      `INSERT INTO wishes (user_id, name, description, link, price) 
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
      [user_id, name, description, link, 0]
    );

    return result.rows[0];
  }
}
module.exports = Wish;
