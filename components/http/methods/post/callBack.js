import {pool} from "../../../../mySql.js";
import {validateName, validatePhone} from "../../../utils/validation/validationFields.js";

const callBackPhone = async (req, res) => {
    let connection;
    const {name, phone} = req.body;
    console.log(req.body)
    try {
        const checkName = validateName(name);
        const checkPhone = validatePhone(phone);

        if (!checkName.valid) {
            return res.status(400).json({message: checkName.message});
        }

        if (!checkPhone.valid) {
            return res.status(400).json({message: checkPhone.message});
        }


        connection = await pool.getConnection();

        // Проверяем наличие пользователя с таким именем и номером телефона
        const [existingUser] = await connection.execute(
            'SELECT * FROM listguest WHERE nameGuest = ? AND phoneNumberGuest = ?',
            [name, phone]
        );

        if (existingUser.length > 0) {
            // Если пользователь уже существует, увеличиваем счетчик counter на 1
            await connection.execute(
                'UPDATE listguest SET counter = counter + 1 WHERE nameGuest = ? AND phoneNumberGuest = ?',
                [name, phone]
            );
            console.log("Счетчик у пользователя увеличен");
        } else {
            // Если пользователь не найден, добавляем нового пользователя
            await connection.execute(
                'INSERT INTO listguest (nameGuest, phoneNumberGuest, emailGuest, counter) VALUES (?, ?, ?, ?)',
                [name, phone, 'empty', 1]
            );
            console.log("Гость успешно добавлен в БД");
        }

        connection.release();

        return res.status(200).json({message: `${name}, Спасибо за обращеие! Ваша заявка на обратный звонок отправлена, в ближайшее время с вами свяжуться.`})
    } catch (error) {
        console.warn(error);
        return res.status(500).json({message: "Ошибка при отправки запроса! Попробуйте сново или свяжитесь по телефону с оператором."});
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export default callBackPhone;