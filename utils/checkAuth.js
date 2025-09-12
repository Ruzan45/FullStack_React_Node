import jwt from 'jsonwebtoken';

const secretKey = '1234Hacker';

const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); //удаляем Bearer из начала строки с помощью рег. выражений
    if (token) {
        try {
            const decoded = jwt.verify(token, secretKey);//раскодируем токен который прислал браузер пользователя
            req.userId = decoded.userId; //в request запихиваем userID чтобы потом этот ID использовать где угодно
            next();
        } catch (error) {
            console.log(error)
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }

}
export { secretKey, checkAuth };