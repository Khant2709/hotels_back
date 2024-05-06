import {pool} from "../../../../mySql.js";

const deleteReservation = async (req, res) => {
    let connection;

    try {
        const idReservation = req.params.id;

        connection = await pool.getConnection();

        //Проверяем наличие брони в бд
        const [currentBooking] = await connection.execute('SELECT * FROM listreservation WHERE  id = ?', [idReservation]);

        if (currentBooking.length === 0) return res.status(404).json({message: "Ошибка! Бронь не найдена."});

        // Удаляем бронь
        await connection.execute('DELETE FROM listreservation WHERE id = ?', [idReservation]);

        connection.release();
        return res.status(200).json({message: 'Бронь успешна удалена.'})
    } catch (error) {
        console.error('Ошибка при удалении бронирования:', error);
        return res.status(500).json({message: "Что-то пошло не так, бронь не удалена!"});
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export default deleteReservation;