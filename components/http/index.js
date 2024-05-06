import express from 'express';
import cors from 'cors';
import {startRoutes} from "./api/index.js";
import {DIRECTORY_UPLOADS, PORT} from "../../hidedData.js";

// Создаем приложение
export const app = express();

// Позволяет читать JSON, который приходит с запросов
app.use(express.json());

// Устанавливаем заголовки CORS
app.use(cors());

// Устанавливаем заголовки CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Добавьте middleware для обслуживания статических файлов
app.use('/uploads', express.static(DIRECTORY_UPLOADS));


export const startServer = () => {
    app.listen(PORT, () => {
        console.log('Server started on port: ' + PORT);
        startRoutes();
    });
};
