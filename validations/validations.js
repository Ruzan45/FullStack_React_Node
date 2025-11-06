import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(), //проверяем является ли входящая строка емаилом
    body('password', 'Пароль должен состоять минимум из 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(), //проверяем является ли входящая строка емаилом
    body('password', 'Пароль должен состоять минимум из 5 символов').isLength({ min: 5 }),
    body('fullName', 'Укажите корректное имя').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка').optional().isLength({ min: 7 }).isURL(),
];
export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тэгов, максимум 100 символов').optional().isLength({ max: 100 }),
    body('imageUrl', 'Некорректная ссылка на изображение').optional().isURL(),
];
export const postUpdateValidation = [
    body('title', 'Введите заголовок статьи').optional().isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').optional().isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тэгов, максимум 100 символов').optional().isLength({ max: 100 }),
    body('imageUrl', 'Некорректная ссылка на изображение').optional().isURL(),
];