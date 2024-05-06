import {pool} from "../../../../mySql.js";

const archiveReservation = async (req, res) => {
    let connection;

    try {
        const idReservation = req.params.id;

        if (!idReservation) return res.status(400).json({ message: "Не указан идентификатор бронирования" });

        connection = await pool.getConnection();

        // Начало транзакции
        await connection.beginTransaction();

        // Выбор бронирования для архивации
        const [rows] = await connection.execute('SELECT * FROM `listreservation` WHERE `id` = ?', [idReservation]);

        if (rows.length === 0) {
            // Если бронь не найдена, отменяем транзакцию и отправляем статус 404 клиенту
            await connection.rollback();
            return res.status(404).json({message: "Бронь не найдена"});
        }

        const {idHotel, idApartment, countPeople, nameGuest, phoneNumberGuest, emailGuest, startDataReservation, endDataReservation, finishPrice,verification, prepayment} = rows[0];

        // Удаление бронирования из основной таблицы
        await connection.execute('DELETE FROM listreservation WHERE id = ?', [idReservation]);

        const query = `INSERT INTO arhivelist
                        (idReservation, idHotel, idApartment, countPeople, nameGuest, phoneNumberGuest, emailGuest, startDataReservation, endDataReservation, finishPrice,verification, prepayment) 
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
        const values = [idReservation, idHotel, idApartment, countPeople, nameGuest, phoneNumberGuest, emailGuest, startDataReservation, endDataReservation, finishPrice,verification, prepayment];

        await connection.execute(query, values);

        // Коммит транзакции
        await connection.commit();

        // Освобождение соединения с базой данных
        connection.release();
        // Возвращаем клиенту статус 200 (OK) с сообщением об успешной архивации
        return res.status(200).json({message: 'Бронь успешна архивирована.'})
    } catch (error) {
        // Если произошла ошибка, откатываем транзакцию и отправляем статус 500 клиенту
        console.error('Ошибка при архивации бронирования:', error);
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        return res.status(500).json({ message: "Произошла ошибка при архивации бронирования" });
    } finally {
        if (connection) {
            // Освобождение соединения с базой данных в любом случае
            connection.release();
        }
    }
}

export default archiveReservation;