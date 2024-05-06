import {pool} from "../../../mySql.js";
import validationBooking from "../../utils/validation/validationBooking.js";
import {sendError, validateResponseBD, validationQueryParam} from "../../utils/validation/validationqueryParam.js";

const getFilterBooking = async (req, res) => {
    let connection;
    const {startReservation, endReservation, countPeopleReservation} = req.query;

    //Валидация req.query
    const validQueryParams1 = validationQueryParam(startReservation);
    if (validQueryParams1) {
        return sendError(res, 400, "Отсутствует или некорректное значение параметра startReservation", true, req.query);
    }

    const validQueryParams2 = validationQueryParam(endReservation);
    if (validQueryParams2) {
        return sendError(res, 400, "Отсутствует или некорректное значение параметра endReservation", true, req.query);
    }

    const validQueryParams3 = validationQueryParam(countPeopleReservation);
    if (validQueryParams3) {
        return sendError(res, 400, "Отсутствует или некорректное значение параметра countPeopleReservation", true, req.query);
    }

    try {
        connection = await pool.getConnection();

        // 1. Получаем все брони
        const queryBooking = "SELECT * FROM listreservation ";
        const listBooking = await connection.execute(queryBooking);

        //Валидация ответа 1 с БД
        const validResponse1 = validateResponseBD(listBooking);
        if (validResponse1) {
            console.error(`Ошибка выполнения запроса: ${queryBooking}`);
            return sendError(res, 404, "Ошибка! Не удалось получить все брони", true);
        }
        console.log(`Успешное выполнение запроса: ${queryBooking}`);


        // 2. Выводим занятые номера массивом
        const startReservationTime = new Date(startReservation).getTime();
        const endReservationTime = new Date(endReservation).getTime();

        const listBookingFromData = validationBooking({
            listBooking: listBooking[0],
            startDate: startReservationTime,
            endDate: endReservationTime
        });

        //3. Получаем все номера
        const queryApartments = "SELECT * FROM listapartments";
        connection = await pool.getConnection();
        const listApartments = await connection.execute(queryApartments);

        //Валидация ответа 3 с БД
        const validResponse2 = validateResponseBD(listApartments);
        if (validResponse2) {
            console.error(`Ошибка выполнения запроса: ${queryApartments}`);
            return sendError(res, 404, "Ошибка! Не удалось получить все номера", true);
        }
        console.log(`Успешное выполнение запроса: ${queryApartments}`);


        //4. Выводим свободные все номера исключая занятые
        const freeRooms = listApartments[0].filter(apartment => {
            const chekApartment = listBookingFromData.some(booking => {
                //Находим комнату по id
                if (booking.idApartment === apartment.id) {
                    return true
                }

                if (booking.idHotel === apartment.hotel_id) {
                    const currentApartment = listApartments[0].find(apartment => apartment.id === booking.idApartment)

                    const numberApartmentBooking = currentApartment.numberApartment.split('_');
                    const numberApartment = apartment.numberApartment.split('_');

                    // Если забронирован весь котедж, находим его этажи
                    if (numberApartmentBooking[1] === 'all') {
                        if (numberApartmentBooking[0] === numberApartment[0]) {
                            return true
                        }
                    }

                    // Если один этаж, находим его полный котедж
                    if (numberApartmentBooking[1] !== 'all') {
                        if (numberApartmentBooking[0] === numberApartment[0] && numberApartment[1] === 'all') {
                            return true
                        }
                    }
                }

            });
            return !chekApartment;
        });
        console.log("Успешное выполнение фильтрации: freeRooms");


        //5. Фильтруем по колличеству человек
        const checkCountPeople = freeRooms.filter(room => room.bedsCount >= countPeopleReservation);
        console.log("Успешное выполнение фильтрации по кол. чел.: checkCountPeople");

        connection.release(); // Важно освободить соединение после использования
        return res.status(200).json({
            data: checkCountPeople || [],
            error: false
        });
    } catch (error) {
        console.error("Ошибка выполнения запроса:", error);
        // Отправка клиенту сообщения об ошибке
        return sendError(res, 500, "Ошибка! Внутренняя ошибка сервера", true);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export default getFilterBooking;
