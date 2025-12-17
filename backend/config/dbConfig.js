require("dotenv").config();

const {Pool} = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?client_encoding=UTF8`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString, ssl: isProduction ? { rejectUnauthorized: false } : false
});
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Ошибка подключения к БД:', err);
  }
  console.log('Подключение к БД успешно');
  release();
});
module.exports = { pool };