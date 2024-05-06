import executeQuery from "../../utils/executeQuery.js";
import {sendError, validateResponseBD, validationQueryParam} from "../../utils/validation/validationqueryParam.js";

// Получение всех номеров
export const getAllApartments = async (req, res) => {
    const query = "SELECT * FROM listapartments";
    const listApartments = await executeQuery(query, false, res, "Ошибка! Получения всех номеров", true);
    return res.status(200).json({
        data: listApartments || [],
        error: false
    });
};


// Получение всех  номеров текущего отеля
export const getApartmentsFromHotel = async (req, res) => {
    const {hotelNumber} = req.query;

    //Валидация req.query
    const validQueryParams = validationQueryParam(hotelNumber);
    if (validQueryParams) {
        return sendError(res, 400, "Отсутствует или некорректное значение параметра hotelNumber", true, req.query);
    }

    const query = `SELECT * FROM \`listapartments\` WHERE \`numberHotel\` = ?`;
    const values = [hotelNumber]
    const listApartments = await executeQuery(query, values, res, "Ошибка! Получения текущего отеля", true);

    //Валидация ответа с БД
    const validResponse = validateResponseBD(listApartments);
    if (validResponse) {
        return sendError(res, 404, `Отель с номером ${hotelNumber} не найден`, true);
    }

    return res.status(200).json({
        data: listApartments || [],
        error: false
    });
};

// Получение текущего  номера
export const getCurrentApartment = async (req, res) => {
    const {hotelNumber, apartmentId} = req.query;

    //Валидация req.query
    const validQueryParams = validationQueryParam(hotelNumber);
    if (validQueryParams) {
        return sendError(res, 400, "Отсутствует или некорректное значение параметра hotelNumber", false, req.query);
    }

    const validQueryParams2 = validationQueryParam(apartmentId);
    if (validQueryParams2) {
        return sendError(res, 400, "Отсутствует или некорректное значение параметра apartmentId", false, req.query);
    }

    const query = "SELECT * FROM `listapartments` WHERE `numberHotel` = ? AND `id` = ?";
    const values = [hotelNumber, apartmentId];
    const currentApartment = await executeQuery(query, values, res, "Ошибка! Получения текущего номера", false);

    //Валидация ответа с БД
    const validResponse = validateResponseBD(currentApartment);
    if (validResponse) {
        return sendError(res, 404, `Номер ${apartmentId} в отеле ${hotelNumber} не найден`, false);
    }

    return res.status(200).json({
        data: currentApartment[0] || {},
        error: false
    });
};