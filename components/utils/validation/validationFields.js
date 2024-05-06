export const validateName = (name) => {
    // 1. Проверка, что поле не пустое
    if (!name.trim()) {
        return { valid: false, message: 'Поле не должно быть пустым' };
    }

    // 2. Проверка длины имени от 2 до 30 символов
    if (name.length < 2 || name.length > 50) {
        return { valid: false, message: 'Имя должно быть от 2 до 30 символов' };
    }

    // 3. Проверка, что имя содержит только буквы (как латинские, так и кириллические) и пробелы
    const nameRegex = /^[a-zA-Zа-яА-Я\s]+$/;
    if (!nameRegex.test(name.trim())) {
        return { valid: false, message: 'Можно ввоить только буквы' };
    }

    // 4. Проверка на отсутствие специальных символов
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharsRegex.test(name)) {
        return { valid: false, message: 'Имя не должно содержать специальные символы' };
    }

    // 5. Проверка на наличие пробелов в начале и конце имени
    if (name !== name.trim()) {
        return { valid: false, message: 'Имя не должно начинаться или заканчиваться пробелами' };
    }

    // 6. Проверка на наличие только одного пробела между словами
    const spacesRegex = /\s{2,}/;
    if (spacesRegex.test(name)) {
        return { valid: false, message: 'Между словами должен быть только один пробел' };
    }

    // 7. Валидация успешна
    return { valid: true, message: '' };
};

export const validatePhone = (phone) => {
    // Преобразование номера: удаление всех нецифровых символов
    const transformedPhone = phone.replace(/\D/g, '');

    // 1. Проверка наличия префикса номера (7 или +7)
    if (!/^7/.test(transformedPhone)) {
        return { valid: false, message: 'Номер должен начинаться с 7' };
    }

    // 2. Проверка длины номера (11 цифр)
    if (transformedPhone.length !== 11) {
        return { valid: false, message: 'Номер должен содержать 11 цифр' };
    }

    // 3. Проверка наличия только цифр
    if (!/^\d+$/.test(transformedPhone)) {
        return { valid: false, message: 'Номер должен содержать только цифры' };
    }

    // 4. Проверка на отсутствие специальных символов
    if (/[!@#$%^&*,.?":{}|<>]/.test(phone)) {
        return { valid: false, message: 'Номер не должен содержать специальные символы' };
    }

    // 5. Валидация успешна
    return { valid: true, message: '' };
};

export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 1. Проверка, что поле не пустое
    if (!email.trim()) {
        return { valid: false, message: 'Поле не должно быть пустым' };
    }

    // 2. Проверка на соответствие регулярному выражению
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Введите корректный email' };
    }

    // 3. Проверка длины адреса
    if (email.length > 320) { // максимальная длина email адреса - 320 символов
        return { valid: false, message: 'Email не должен превышать 320 символов' };
    }

    // 4. Валидация успешна
    return { valid: true, message: '' };
};
