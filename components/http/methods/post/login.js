import {LOGIN_NAME, LOGIN_PASSWORD, LOGIN_TOKEN} from "../../../../hidedData.js";

export const login = async (req, res) => {
    const {name, password} = req.body;

    console.log({name, password});
    console.log({LOGIN_NAME, LOGIN_PASSWORD});

    try {
        if (name !== LOGIN_NAME || password !== LOGIN_PASSWORD) {
            return res.status(404).json({isAdmin: false, message: "Ошибка! Нет доступа."});
        }

        return res.status(200).json({isAdmin: true, token: LOGIN_TOKEN})

    } catch (e) {
        return res.status(500).json({isAdmin: false, message: "Ошибка! Что-то пошло не так!"});
    }

}