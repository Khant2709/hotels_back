import {pool} from "../../mySql.js";

const executeQuery = async (query, values, res, errorHandler, isArray) => {
    let connection;

    try {
        connection = await pool.getConnection();
        let result;

        if (values) {
            result = await connection.execute(query, values);
        } else {
            result = await connection.execute(query);
        }

        connection.release();

        // Логирование успешного выполнения запроса в консоль
        console.log(`Успешное выполнение запроса: ${query}`);

        return result[0] || [];
    } catch (error) {
        console.error(`Ошибка выполнения запроса: ${query}`, error);

        return res.status(500).json({
            data: isArray ? [] : {},
            error: errorHandler,
            errorParameters: error
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export default executeQuery;