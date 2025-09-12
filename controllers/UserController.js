import jwt from 'jsonwebtoken'; // шифровальщик для аутентификации и авторизации
import bcrypt from 'bcrypt'; // шифровальщик паролей
import { db } from '../components/db.js';
import { secretKey } from '../utils/checkAuth.js';

export const register = async (req, res) => {

    const password = req.body.password;
    const sault = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, sault);
    const values = [req.body.fullName, req.body.email, passHash, req.body.avatarUrl];
    await db.query('INSERT INTO users (fullname, email, password_hash, avatar) VALUES ($1, $2, $3, $4)', (values))
        .then(() => {
            console.log('данные внесены');
            res.json({
                message: 'success'// Отправляем в качестве POST ответа
            });

        })
        .catch(err => {
            console.error('Ошибка при вставке данных', err);
            res.status(500).json({ error: 'Ошибка сервера при обработке запроса ' });
        });

};
export const login = async (req, res) => {

    const result = await db.query("SELECT user_id, email, password_hash FROM users WHERE email = '" + req.body.email + "'")
        .then(async (data) => { //в data сохраняем всё что прилетело в result
            if (data.rowCount > 0) {
                const isValidPass = await bcrypt.compare(req.body.password, data.rows[0].password_hash)
                if (!isValidPass) {
                    return res.status(400).json({ error: 'Неверный логин или пароль' });
                } else {
                    const user = data.rows[0];
                    const token = jwt.sign({ userId: user.user_id, email: user.email }, secretKey, { expiresIn: '1d' })
                    return res.status(201).json({ token }); //отправляем сгенерированный токен пользователю
                }
            } else { return res.status(400).json({ error: '1Неверный логин или пароль' }); }

        }
        ).catch(async (err) => {
            console.error('Ошибка: ', err);
            return res.status(400).json({ error: 'Не удалось авторизоваться' });
        }
        );

    /* .then(() => {
            
        })
        .catch(err => {
            console.error('Ошибка при поиске пользователя', err);
            res.status(404).json({ error: 'Неверный логин или пароль' });
            console.log(result)
        }); */


};
export const getMe = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE user_id ='" + req.userId + "'");
        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Пользователь не найден' })
        }
        delete result.rows[0].password_hash; //удаляем пароль из ответа
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: 'Неверный логин или пароль' })
    }
};