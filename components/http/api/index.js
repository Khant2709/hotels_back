import {app} from "../index.js";

import {getAllHotels, getCurrentHotel} from "../methods/getAllHotels.js";
import {getAllApartments, getApartmentsFromHotel, getCurrentApartment} from "../methods/getAllApartments.js";
import {getAllBooking, getCurrentBooking} from "../methods/getAllBooking.js";
import getFilterBooking from "../methods/getFilterBooking.js";

import createReservation from "../methods/post/createReservation.js";
import editReservation from "../methods/patch/editReservation.js";
import deleteReservation from "../methods/delete/deleteReservation.js";
import archiveReservation from "../methods/delete/archiveReservation.js";
import {getQuestion} from "../methods/getQuestion.js";
import callBackPhone from "../methods/post/callBack.js";
import {login} from "../methods/post/login.js";
import checkAuth from "../methods/checkAuth.js";
import {test} from "../methods/post/test.js";

export const startRoutes = () => {
    app.get('/api/getAllHotels', getAllHotels);                                             // Получение всех отелей
    app.get('/api/getCurrentHotel', getCurrentHotel);                                       // Получение конкретного отеля

    app.get('/api/getAllApartments', getAllApartments);                                     // Получение всех номеров
    app.get('/api/getApartmentsFromHotel', getApartmentsFromHotel);                         // Получение конкретного номера
    app.get('/api/getCurrentApartment', getCurrentApartment);                               // Получение конкретного номера

    app.get('/api/getAllBooking', getAllBooking);                                           // Получение всех броней
    app.get('/api/getFilterBooking', getFilterBooking);                                     // Получение всех броней по фильтрации
    app.get('/api/getCurrentBooking', getCurrentBooking);                                   // Получение всех броней по фильтрации
    app.post('/api/createReservation', createReservation)                              // Создание брони

    app.patch('/api/editReservation', checkAuth, editReservation)                      // Редактирование/подтверждение брони  <<< проверки не выполнены
    app.delete('/api/archiveReservation/:id', checkAuth, archiveReservation)           // Архивация брони  <<< проверки не выполнены
    app.delete('/api/deleteReservation/:id', checkAuth, deleteReservation)             // Удаление брони  <<< проверки не выполнены

    app.get('/api/getQuestion', getQuestion);                                               // Получение списка вопрос-ответ

    app.post('/api/formCallBack', callBackPhone);

    app.post('/api/login', login)
    app.post('/api/test', test)
}