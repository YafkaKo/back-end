import http  from 'http'
import db from'../DB/db.js';

// Проверка подключения и выполнения запроса
(async () => {
    try {
        const result = await db.query('SELECT datname FROM pg_database');
        console.log('Тестовый запрос выполнен успешно. Базы данных:', result.rows);
    } catch (err) {
        console.error('Ошибка при выполнении тестового запроса:', err);
    }
})();

const server = http.createServer(async (req, res) => {
    if (req.url.startsWith('/api')) {
        let body = '';

        if (req.method === 'POST') {
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const parsedBody = JSON.parse(body);

                    if (checkoutRequired(parsedBody, res)) {
                        return;
                    }

                    const { name, avatar, description, character, hobbies, favoritePhrases, friends } = parsedBody;

                    const result = await db.query(
                        'INSERT INTO characters (name, avatar, description, character, hobbies, favoritePhrases, friends) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                        [name, avatar, description, character, hobbies, favoritePhrases, friends]
                    );

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.rows[0]));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Невалидный JSON' }));
                }
            });
        } else if (req.method === 'GET') {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const page = parseInt(url.searchParams.get('page')) || 1;
            const limit = parseInt(url.searchParams.get('limit')) || 5;

            if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Невалидные параметры пагинации' }));
                return;
            }

            const offset = (page - 1) * limit;

            try {
                const result = await db.query(
                    'SELECT * FROM characters ORDER BY id LIMIT $1 OFFSET $2',
                    [limit, offset]

                );
                console.log(result);

                const totalResult = await db.query('SELECT COUNT(*) FROM characters');
                const totalItems = parseInt(totalResult.rows[0].count, 10);

                console.log(result.rows);

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    data: result.rows,
                    pagination: {
                        totalItems,
                        currentPage: page,
                        totalPages: Math.ceil(totalItems / limit),
                        itemsPerPage: limit
                    }
                }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ошибка сервера' }));
            }
        } else if (req.method === 'PUT') {
            body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);

                    if (checkoutRequired(data, res)) {
                        return;
                    }

                    const id = parseInt(req.url.split("/")[2]);

                    if (isNaN(id)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Невалидный ID' }));
                        return;
                    }

                    const { name, avatar, description, character, hobbies, favoritePhrases, friends } = data;

                    const result = await db.query(
                        'UPDATE characters SET name = $1, avatar = $2, description = $3, character = $4, hobbies = $5, favoritePhrases = $6, friends = $7 WHERE id = $8 RETURNING *',
                        [name, avatar, description, character, hobbies, favoritePhrases, friends, id]
                    );

                    if (result.rows.length === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Ресурс не найден' }));
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'Данные обновлены успешно',
                        data: result.rows[0]
                    }));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Невалидный JSON' }));
                }
            });
        } else if (req.method === 'DELETE') {
            const id = parseInt(req.url.split("/")[2]);

            if (isNaN(id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Невалидный ID' }));
                return;
            }

            try {
                const result = await db.query('DELETE FROM characters WHERE id = $1 RETURNING *', [id]);

                if (result.rows.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Ресурс не найден' }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Ресурс успешно удален',
                    data: result.rows[0]
                }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ошибка сервера' }));
            }
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Метод не поддерживается' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ресурс не найден' }));
    }
});

function checkoutRequired(data, res) {
    if (!data.name || !data.avatar || !data.description || !data.character || !data.hobbies || !data.favoritePhrases || !data.friends) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Все поля должны быть заполнены' }));
        return true;
    }
    return false;
}

server.listen(8000, () => {
    console.log('Сервер запущен на http://localhost:8000');
});