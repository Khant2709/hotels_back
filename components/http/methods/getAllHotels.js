import executeQuery from "../../utils/executeQuery.js";
import {sendError, validateResponseBD, validationQueryParam} from "../../utils/validation/validationqueryParam.js";

// Получение всех отелей
export const getAllHotels = async (req, res) => {
    const query = "SELECT * FROM listhotels";
    const listHotels = await executeQuery(query, false, res, "Ошибка! Получения всех отелей", true);
    return res.status(200).json({
        data: listHotels || [],
        error: false
    });
};


// Получение текущего  отеля
export const getCurrentHotel = async (req, res) => {
    const {hotelNumber} = req.query;

    //Валидация req.query
    const validQueryParams = validationQueryParam(hotelNumber);
    if (validQueryParams) {
        return sendError(res, 400, "Отсутствует или некорректное значение параметра hotelNumber", false, req.query);
    }

    const query = "SELECT * FROM listhotels WHERE numberHotel = ?";
    const values = [hotelNumber]
    const currentHotel = await executeQuery(query, values, res, "Ошибка! Получения текущего отеля", false);

    //Валидация ответа с БД
    const validResponse = validateResponseBD(currentHotel);
    if (validResponse) {
        return sendError(res, 404, `Отель с номером ${hotelNumber} не найден`, false);
    }


    return res.status(200).json({
        data: currentHotel[0] || {},
        error: false
    });
};
