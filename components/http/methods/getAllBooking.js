import executeQuery from "../../utils/executeQuery.js";
import {sendError, validateResponseBD, validationQueryParam} from "../../utils/validation/validationqueryParam.js";

export const getAllBooking = async (req, res) => {
    const query = "SELECT * FROM listreservation";
    const listBooking = await executeQuery(query, false, res, "Ошибка! Получения всех броней", true);
    return res.status(200).json({
        data: listBooking || [],
        error: false
    });
};


// Получение текущей брони
export const getCurrentBooking = async (req, res) => {
    const {reservationId} = req.query;

    const validQueryParams = validationQueryParam(reservationId);
    if (validQueryParams) {
        return sendError(res, 400, "Отсутствует или некорректное значение параметра reservationId", false, req.query);
    }

    const query = "SELECT * FROM listreservation WHERE id = ?";
    const values = [reservationId]
    const currentBooking = await executeQuery(query, values, res, "Ошибка! Получения текущей брони", false);

    //Валидация ответа с БД
    const validResponse = validateResponseBD(currentBooking);
    if (validResponse) {
        return sendError(res, 404, `Ошибка! Бронь ${reservationId} не найдена`, false);
    }

    return res.status(200).json({
        data: currentBooking[0] || {},
        error: false
    });
};

