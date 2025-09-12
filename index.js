import express from 'express'; //фреймворк для Node.js
import multer from 'multer'; //библиотека для загрузки файлов
import { checkAuth } from './utils/checkAuth.js'; //проверяем авторизацию пользователя
import { registerValidation, loginValidation, postCreateValidation, postUpdateValidation } from './validations/validations.js'
import HandleValidationErrors from './utils/handleValidationErrors.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

//настройки express
const app = express();

const storage = multer.diskStorage({ //настраиваем multer
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json()); //учим express понимать json
app.use('/uploads', express.static('uploads')) //если придёт запрос uploads, тогда используй функцию static и проверь есть ли в этой папке этот файл

app.listen(4444, (err) => {//запускаем сервер на локалхост
    if (err) {
        return console.log(err)
    }
    console.log('Server OK')
});

//req то что прислал пользователь
//res ответ пользователю

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`, //указываем папку для загрузок
    });
});

app.delete('/posts/:id', checkAuth, PostController.remove);
app.post('/auth/register', registerValidation, HandleValidationErrors, UserController.register);
app.post('/posts', checkAuth, postCreateValidation, HandleValidationErrors, PostController.create);
app.patch('/posts/:id', checkAuth, postUpdateValidation, HandleValidationErrors, PostController.update);
app.post('/auth/login', loginValidation, HandleValidationErrors, UserController.login);