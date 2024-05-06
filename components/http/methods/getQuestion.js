import executeQuery from "../../utils/executeQuery.js";
import {sendError, validateResponseBD, validationQueryParam} from "../../utils/validation/validationqueryParam.js";

export const getQuestion = async (req, res) => {
    const {numberHotel} = req.query;

    //Валидация req.query
    const validQueryParams = validationQueryParam(numberHotel);
    if (validQueryParams) {
        return sendError(res, 400, "Отсутствует или некорректное значение параметра numberHotel", true, req.query);
    }

    const query = "SELECT * FROM listquestion WHERE numberHotel = ?";
    const values = [numberHotel]; // Передаем значение numberHotel как параметр
    const listQuestion = await executeQuery(query, values, res, "Ошибка! Получения списка вопрос-ответов", true);

    //Валидация ответа с БД
    const validResponse = validateResponseBD(listQuestion);
    if (validResponse) {
        return sendError(res, 404, `Ошибка! Вопросы у отеля ${numberHotel} не найдена`, true);
    }

    return res.status(200).json({
        data: listQuestion || [],
        error: false
    });

};