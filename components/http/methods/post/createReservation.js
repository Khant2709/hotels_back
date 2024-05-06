import { pool } from "../../../../mySql.js";
import { validateEmail, validateName, validatePhone } from "../../../utils/validation/validationFields.js";

const checkHotelExists = async (idHotel) => {
    const [result] = await pool.execute("SELECT id FROM listhotels WHERE id = ?", [idHotel]);
    return result && result.length > 0;
};

const checkApartmentExists = async (idApartment) => {
    const [result] = await pool.execute("SELECT id FROM listapartments WHERE id = ?", [idApartment]);
    return result && result.length > 0;
};

const checkGuestExists = async (nameGuest, phoneGuest) => {
    const [result] = await pool.execute("SELECT id FROM listguest WHERE nameGuest = ? AND phoneNumberGuest = ?", [nameGuest, phoneGuest]);
    return result && result.length > 0;
};

const createReservation = async (req, res) => {
    const {
        idHotel,
        idApartment,
        countPeople,
        startData,
        endData,
        finishPrice,
        nameGuest,
        phoneGuest,
        emailGuest
    } = req.body;

    try {
        // Проверка обязательных полей
        if (!idHotel || !idApartment || !countPeople || !startData || !endData || !nameGuest || !phoneGuest) {
            return res.status(400).json({ message: "Отсутствуют обязательные поля" });
        }

        // Валидация данных
        const checkName = validateName(nameGuest);
        if (!checkName.valid) return res.status(400).json({ message: checkName.message });

        const checkPhone = validatePhone(phoneGuest);
        if (!checkPhone.valid) return res.status(400).json({ message: checkPhone.message });

        const checkEmail = validateEmail(emailGuest);
        if (!checkEmail.valid) return res.status(400).json({ message: checkEmail.message });

        // Получение подключения к базе данных
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        // Проверка существования отеля и апартаментов
        if (!(await checkHotelExists(idHotel))) {
            return res.status(404).json({ message: "Был указан не существующий отель" });
        }

        if (!(await checkApartmentExists(idApartment))) {
            return res.status(404).json({ message: "Был указан не существующий номер" });
        }

        // Проверка количества проживающих
        const [apartmentInfo] = await connection.execute("SELECT bedsCount FROM listapartments WHERE hotel_id = ? AND id = ?", [idHotel, idApartment]);
        const bedsCount = apartmentInfo[0].bedsCount;

        if (countPeople > bedsCount) {
            return res.status(400).json({ message: "Указано некорректное количество проживающих" });
        }

        // Проверка итоговой суммы
        if (finishPrice <= 0) {
            return res.status(400).json({ message: "Указана некорректная цена" });
        }

        // Проверка существования гостя
        if (await checkGuestExists(nameGuest, phoneGuest)) {
            await connection.execute("UPDATE listguest SET counter = counter + 1 WHERE nameGuest = ? AND phoneNumberGuest = ?", [nameGuest, phoneGuest]);
            console.log("Счетчик у пользователя увеличен");
        } else {
            await connection.execute("INSERT INTO listguest (nameGuest, phoneNumberGuest, emailGuest, counter) VALUES (?, ?, ?, ?)", [nameGuest, phoneGuest, emailGuest, 1]);
            console.log("Гость успешно добавлен в БД");
        }

        // Создание резервации
        const query = "INSERT INTO listreservation (idHotel, idApartment, countPeople, nameGuest, phoneNumberGuest, emailGuest, startDataReservation, endDataReservation, finishPrice, verification, prepayment) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        const values = [idHotel, idApartment, countPeople, nameGuest, phoneGuest, emailGuest, startData, endData, finishPrice, false, 0];
        const [result] = await connection.execute(query, values);
        console.log("Запись успешно добавлена в БД");

        // Коммит транзакции
        await connection.commit();
        connection.release();

        return res.status(200).json({ message: `${nameGuest}. Ваша бронь №${result.insertId}. Бронь успешно создана! В ближайшее время с вами свяжется наш оператор для подтверждения.` });
    } catch (error) {
        console.error(error);

        if (connection) {
            await connection.rollback();
            connection.release();
        }

        return res.status(500).json({ message: `${nameGuest}. Ошибка при создании брони! Попробуйте снова или свяжитесь по телефону с оператором.` });
    }
};

export default createReservation;
