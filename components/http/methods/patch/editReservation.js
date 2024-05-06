import {pool} from "../../../../mySql.js";
import {validateEmail, validateName, validatePhone} from "../../../utils/validation/validationFields.js";

const editReservation = async (req, res) => {
    let connection;

    try {
        const {idReservation, name, phone, email, prepayment, verification} = req.body;

        //Валидация полей
        const checkName = validateName(name);
        const checkPhone = validatePhone(phone);
        const checkEmail = validateEmail(email);
        const checkPrepayment = prepayment === 0 || !prepayment;

        if (checkPrepayment) return res.status(500).json({message: "Ошибка предоплаты! Укажите корректную сумму"});

        connection = await pool.getConnection();

        //Находим текущую бронь
        const query1 = `SELECT * FROM \`listreservation\` WHERE \`id\` = ${idReservation}`;
        const currentBooking = await connection.execute(query1);

        if (currentBooking[0].length === 0) return res.status(500).json({message: "Ошибка! Бронь не найдена."});

        // Запрос на изменение данных в бд
        let query2 = 'UPDATE listreservation SET ';
        let values2 = [];

        if (checkName.valid) {
            query2 += 'nameGuest = ?, ';
            values2.push(name);
        }
        if (checkPhone.valid) {
            query2 += 'phoneNumberGuest = ?, ';
            values2.push(phone);
        }
        if (checkEmail.valid) {
            query2 += 'emailGuest = ?, ';
            values2.push(email);
        }
        query2 += 'prepayment = ?, verification = ? WHERE id = ?';
        values2.push(prepayment, verification, idReservation);

        await connection.execute(query2, values2);
        connection.release();
        return res.status(200).json({message: 'Данные по брони успешно обновлены.'})
    } catch (error) {
        console.warn(error);
        return res.status(500).json({message: "Что-то пошло не так, бронь не изменена!"});
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export default editReservation;