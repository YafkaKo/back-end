import Fastify from 'fastify';
import db from '../DB/db.js';

// Создаем экземпляр Fastify
const fastify = Fastify({ logger: true });

// Проверка подключения к базе данных
(async () => {
    try {
        const result = await db.query('SELECT datname FROM pg_database');
        fastify.log.info('Тестовый запрос выполнен успешно. Базы данных:', result.rows);
    } catch (err) {
        fastify.log.error('Ошибка при выполнении тестового запроса:', err);
    }
})();

const characterSchema = {
    type: 'object',
    required: ['name', 'avatar', 'description', 'character', 'hobbies', 'favoritePhrases', 'friends'],
    properties: {
        name: { type: 'string' },
        avatar: { type: 'string', format: 'uri' },
        description: { type: 'string' },
        character: { type: 'string' },
        hobbies: { type: 'string' },
        favoritePhrases: {
            type: 'array',
            items: { type: 'string' }
        },
        friends: {
            type: 'array',
            items: { type: 'string' }
        }
    }
};

const characterPatchSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        avatar: { type: 'string', format: 'uri' },
        description: { type: 'string' },
        character: { type: 'string' },
        hobbies: { type: 'string' },
        favoritePhrases: {
            type: 'array',
            items: { type: 'string' }
        },
        friends: {
            type: 'array',
            items: { type: 'string' }
        }
    }
};

fastify.post('/api/characters', {
    schema: {
        body: characterSchema
    }
}, async (request, reply) => {
    const data = request.body;

    try {
        const result = await db.query(
            'INSERT INTO characters (name, avatar, description, character, hobbies, favoritePhrases, friends) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [data.name, data.avatar, data.description, data.character, data.hobbies, data.favoritePhrases, data.friends]
        );

        return reply.status(200).send(result.rows[0]);
    } catch (error) {
        return reply.status(400).send({ error: 'Невалидный JSON' });
    }
});

fastify.get('/api/characters', async (request, reply) => {
    const { page = 1, limit = 5 } = request.query;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return reply.status(400).send({ error: 'Невалидные параметры пагинации' });
    }

    const offset = (page - 1) * limit;

    try {
        const result = await db.query(
            'SELECT * FROM characters ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        const totalResult = await db.query('SELECT COUNT(*) FROM characters');
        const totalItems = parseInt(totalResult.rows[0].count, 10);

        return reply.status(200).send({
            data: result.rows,
            pagination: {
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                itemsPerPage: limit
            }
        });
    } catch (error) {
        return reply.status(500).send({ error: 'Ошибка сервера' });
    }
});

fastify.put('/api/characters/:id', {
    schema: {
        body: characterSchema
    }
}, async (request, reply) => {
    const { id } = request.params;
    const data = request.body;

    try {
        const result = await db.query(
            'UPDATE characters SET name = $1, avatar = $2, description = $3, character = $4, hobbies = $5, favoritePhrases = $6, friends = $7 WHERE id = $8 RETURNING *',
            [data.name, data.avatar, data.description, data.character, data.hobbies, data.favoritePhrases, data.friends, id]
        );

        if (result.rows.length === 0) {
            return reply.status(404).send({ error: 'Ресурс не найден' });
        }

        return reply.status(200).send({
            message: 'Данные обновлены успешно',
            data: result.rows[0]
        });
    } catch (error) {
        return reply.status(400).send({ error: 'Невалидный JSON' });
    }
});

fastify.patch('/api/characters/:id', {
    schema: {
        body: characterPatchSchema
    }
}, async (request, reply) => {
    const { id } = request.params;
    const data = request.body;

    if (Object.keys(data).length === 0) {
        return reply.status(400).send({ error: 'Хотя бы одно поле должно быть заполнено' });
    }

    try {
        const result = await db.query(
            'UPDATE characters SET name = COALESCE($1, name), avatar = COALESCE($2, avatar), description = COALESCE($3, description), character = COALESCE($4, character), hobbies = COALESCE($5, hobbies), favoritePhrases = COALESCE($6, favoritePhrases), friends = COALESCE($7, friends) WHERE id = $8 RETURNING *',
            [data.name, data.avatar, data.description, data.character, data.hobbies, data.favoritePhrases, data.friends, id]
        );

        if (result.rows.length === 0) {
            return reply.status(404).send({ error: 'Ресурс не найден' });
        }

        return reply.status(200).send({
            message: 'Данные обновлены успешно',
            data: result.rows[0]
        });
    } catch (error) {
        return reply.status(400).send({ error: 'Невалидный JSON' });
    }
});

fastify.delete('/api/characters/:id', async (request, reply) => {
    const { id } = request.params;

    try {
        const result = await db.query('DELETE FROM characters WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return reply.status(404).send({ error: 'Ресурс не найден' });
        }

        return reply.status(200).send({
            message: 'Ресурс успешно удален',
            data: result.rows[0]
        });
    } catch (error) {
        return reply.status(500).send({ error: 'Ошибка сервера' });
    }
});

// Запуск сервера
fastify.listen({ port: 8000 }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log('Сервер запущен на http://localhost:8000');
});

