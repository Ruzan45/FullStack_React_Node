import { Pool } from 'pg'; //библиотека, набор модулей для взаимодействия с базами данных PostgreSQL

export const db = new Pool({
    host: 'localhost',
    user: 'admin',
    password: '123456',
    database: 'node',
    port: 5432,
});

db.connect()
    .then(() => console.log('DB OK'))
    .catch(err => console.error('DB error', err.stack));