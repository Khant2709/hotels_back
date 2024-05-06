import mysql from 'mysql2/promise';
import {DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER} from "./hidedData.js";

export const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const startMysql = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('DataBase ---- Start');
        // Ваш код работы с базой данных
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            connection.release(); // Возвращаем соединение в пул
        }
    }
};