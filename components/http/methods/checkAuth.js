import { LOGIN_TOKEN } from '../../../hidedData.js';

export default (req, res, next) => {
    try {
        let token;

        // Попробуйте извлечь токен из разных мест запроса
        if (req.body && req.body.token) {
            token = req.body.token; // Токен из тела запроса (например, для POST запросов)
        } else if (req.query && req.query.token) {
            token = req.query.token; // Токен из query параметров (например, для GET запросов)
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1]; // Токен из заголовка Authorization (например, для DELETE запросов)
        }

        // Проверяем наличие и соответствие токена
        if (!token || token !== LOGIN_TOKEN) {
            return res.status(403).json({ message: 'Ошибка! Нет доступа.' });
        }

        next(); // Продолжаем выполнение следующего middleware или обработчика маршрута
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        return res.status(500).json({ message: 'Ошибка проверки токена.' });
    }
};
