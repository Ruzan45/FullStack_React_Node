import { db } from '../components/db.js';
export const getAll = async (req, res) => {
    await db.query("SELECT * FROM posts")
        .then((result) => {
            if (result.rowCount > 0) {
                res.status(200).json(result.rows)
            } else {
                res.status(400).json({ message: "Статьи не найдены" })
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Ошибка при выполнении запроса, повторите попытку позже" });
            console.log('Ошибка при запросе статей: ' + err);
        })
}
export const getLastTags = async (req, res) => {
    await db.query("SELECT tags FROM posts LIMIT 5")
        .then((result) => {
            if (result.rowCount > 0) {
                const tags = result.rows.map((obj) => obj.tags).flat().join(",").split(",").slice(0, 5);
                res.status(200).json(tags)
            } else {
                res.status(400).json({ message: "Тэги не найдены" })
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Ошибка при выполнении запроса, повторите попытку позже" });
            console.log('Ошибка при запросе статей: ' + err);
        })
}

export const getOne = async (req, res) => {
    const post_id = req.params.id;
    await db.query("SELECT * FROM posts WHERE post_id ='" + post_id + "'")
        .then((result) => {
            if (result.rowCount > 0) {
                const new_count = result.rows[0].views_count + 1; //т к мы посмотрели статью, то нужно добавить колличество просмотров
                db.query("UPDATE posts SET views_count = '" + new_count + "' WHERE post_id ='" + post_id + "' RETURNING *")//RETURNING * возвращает всю обновлённую строку
                    .then((data) => {
                        res.status(200).json(data.rows[0])
                    })
            } else {
                res.status(400).json({ message: "Статья не найдена" })
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Ошибка при выполнении запроса, повторите попытку позже1" });
            console.log('Ошибка при запросе статьи: ' + err);
        })
}
export const remove = async (req, res) => {
    const post_id = req.params.id;
    await db.query("DELETE FROM posts WHERE post_id ='" + post_id + "'")
        .then((result) => {
            if (result.rowCount === 1) {
                res.status(200).json({ message: "Статья удалена" })
            } else {
                res.status(400).json({ message: "Статья не найдена" })
            }

        })
        .catch((err) => {
            res.status(500).json({ message: "Ошибка при выполнении запроса, повторите попытку позже" });
            console.log('Ошибка при удалении статьи: ' + err);
        })
}
export const create = async (req, res) => {
    const values = [req.body.title, req.body.text, req.body.tags, req.body.image_url, req.userId]
    await db.query("INSERT INTO posts (title, text, tags, image_url, user_id) VALUES ($1, $2, $3, $4, $5)", values)
        .then(() => {
            console.log('данные внесены');
            res.json({
                message: 'Данные внесены'// Отправляем в качестве POST ответа
            });
        })
        .catch((err) => {
            console.error('Ошибка при создании статьи', err);
            res.status(500).json({ error: 'Ошибка сервера при обработке запроса ' });
        });
}
export const update = async (req, res) => {
    const post_id = req.params.id;

    let queryText = '';
    if (req.body.title !== undefined && req.body.title !== 'NULL') {
        queryText += "title ='" + req.body.title + "',";
    }
    if (req.body.text !== undefined && req.body.text !== 'NULL') {
        queryText += "text ='" + req.body.text + "',";
    }
    if (req.body.tags !== undefined && req.body.tags !== 'NULL') {
        queryText += "tags ='" + req.body.tags + "',";
    }
    if (req.body.image_url !== undefined && req.body.image_url !== 'NULL') {
        queryText += "image_url ='" + req.body.image_url + "',";
    }

    queryText = queryText.slice(0, -1); //удаляем последнююю запятую

    if (queryText == '') {
        res.status(200).json({ message: "Введите новые данные" })
    } else {
        await db.query("UPDATE posts SET " + queryText + " WHERE post_id = '" + post_id + "' AND user_id = '" + req.userId + "'")
            .then((result) => {
                if (result.rowCount === 1) {
                    res.status(200).json({ message: "Обновлённые данные внесены успешно!" })
                } else {
                    res.status(400).json({ message: "Такая статья не найдена" })
                }
            })
            .catch((err) => {
                console.error('Ошибка при обновлении статьи', err);
                res.status(500).json({ error: 'Ошибка при обработке запроса ' });
            });
    }
}