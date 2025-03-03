import http from 'node:http';

const laughariki = [
    {
        id: 1,
        name: 'Копатыч',
        avatar: 'https://example.com/kopatych.png', // Ссылка на изображение
        description: 'Копатыч — добрый и трудолюбивый медведь, который обожает садоводство и природу.',
        character: 'Спокойный, заботливый, иногда немного наивный.',
        hobbies: 'Садоводство, выращивание овощей, забота о природе.',
        favoritePhrases: ['Так говорят все поработители! Сво-бо-ду! Сво-бо-ду!', 'Ох, уж эти городские жители!'],
        friends: ['Лосяш', 'Совунья', 'Бараш']
    },
    {
        id: 2,
        name: 'Крош',
        avatar: 'https://example.com/krosh.png',
        description: 'Крош — веселый и энергичный кролик, который обожает приключения и шутки.',
        character: 'Оптимист, любит шутки, иногда бывает безответственным.',
        hobbies: 'Приключения, спорт, веселье.',
        favoritePhrases: ['Ёлки-иголки!', 'Это же просто праздник какой-то!'],
        friends: ['Ёжик', 'Нюша', 'Бараш']
    },
    {
        id: 3,
        name: 'Ёжик',
        avatar: 'https://example.com/ezhik.png',
        description: 'Ёжик — скромный и добрый друг Кроша, который всегда готов помочь.',
        character: 'Скромный, застенчивый, но очень преданный друг.',
        hobbies: 'Чтение, коллекционирование, помощь друзьям.',
        favoritePhrases: ['Я не трус, но я боюсь!', 'Ой, что-то мне страшно...'],
        friends: ['Крош', 'Нюша', 'Бараш']
    },
    {
        id: 4,
        name: 'Нюша',
        avatar: 'https://example.com/nyusha.png',
        description: 'Нюша — романтичная и мечтательная свинка, которая обожает моду и красоту.',
        character: 'Мечтательная, немного капризная, но добрая.',
        hobbies: 'Мода, красота, танцы.',
        favoritePhrases: ['Красота — это страшная сила!', 'Я хочу быть принцессой!'],
        friends: ['Крош', 'Ёжик', 'Бараш']
    },
    {
        id: 5,
        name: 'Бараш',
        avatar: 'https://example.com/barash.png',
        description: 'Бараш — меланхоличный поэт, который пишет стихи и любит философствовать.',
        character: 'Мечтательный, романтичный, иногда грустный.',
        hobbies: 'Поэзия, философия, размышления.',
        favoritePhrases: ['Я — поэт, зовусь я Бараш, и я пишу стихи для вас!', 'Всё в этом мире тленно...'],
        friends: ['Нюша', 'Копатыч', 'Совунья']
    },
    {
        id: 6,
        name: 'Пин',
        avatar: 'https://example.com/pin.png',
        description: 'Пин — гениальный изобретатель, который создает невероятные устройства.',
        character: 'Умный, изобретательный, иногда немного рассеянный.',
        hobbies: 'Изобретения, наука, конструирование.',
        favoritePhrases: ['Это же элементарно, Ватсон!', 'Моя новая идея!'],
        friends: ['Лосяш', 'Копатыч', 'Кар-Карыч']
    },
    {
        id: 7,
        name: 'Лосяш',
        avatar: 'https://example.com/losyash.png',
        description: 'Лосяш — умный и любознательный лось, который увлекается наукой.',
        character: 'Умный, любознательный, иногда немного занудный.',
        hobbies: 'Наука, эксперименты, чтение.',
        favoritePhrases: ['Наука — это круто!', 'Это противоречит законам физики!'],
        friends: ['Пин', 'Копатыч', 'Совунья']
    },
    {
        id: 8,
        name: 'Совунья',
        avatar: 'https://example.com/sovunya.png',
        description: 'Совунья — заботливая сова, которая следит за здоровьем и порядком.',
        character: 'Заботливая, мудрая, иногда строгая.',
        hobbies: 'Здоровье, кулинария, забота о друзьях.',
        favoritePhrases: ['Здоровье — это главное!', 'Пора делать зарядку!'],
        friends: ['Копатыч', 'Лосяш', 'Бараш']
    },
    {
        id: 9,
        name: 'Кар-Карыч',
        avatar: 'https://example.com/karkarych.png',
        description: 'Кар-Карыч — мудрый ворон, который любит рассказывать истории из прошлого.',
        character: 'Мудрый, немного ностальгирующий, иногда ворчливый.',
        hobbies: 'Рассказывать истории, философствовать.',
        favoritePhrases: ['В моё время всё было по-другому!', 'Эх, молодёжь...'],
        friends: ['Пин', 'Лосяш', 'Совунья']
    },
    {
        id: 10,
        name: 'Биби',
        avatar: 'https://example.com/bibi.png',
        description: 'Биби — маленький робот, который всегда готов помочь.',
        character: 'Добрый, любознательный, немного наивный.',
        hobbies: 'Помощь друзьям, изучение мира.',
        favoritePhrases: ['Биби-биби! Я — робот!', 'Я могу помочь!'],
        friends: ['Пин', 'Крош', 'Ёжик']
    }
];

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api')) {
        let body = '';

        if (req.method === 'POST') {
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const parsedBody = JSON.parse(body);

                    if (checkoutRequired(parsedBody, res)) {
                        return;
                    }

                    const { name, avatar, description, character, hobbies, favoritePhrases, friends } = parsedBody;

                    const maxId = Math.max(...laughariki.map(laugharik => laugharik.id), 0);
                    const newItem = {
                        id: maxId + 1,
                        name,
                        avatar,
                        description,
                        character,
                        hobbies,
                        favoritePhrases,
                        friends
                    };

                    laughariki.push(newItem);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(laughariki));
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

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedData = laughariki.slice(startIndex, endIndex);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                data: paginatedData,
                pagination: {
                    totalItems: laughariki.length,
                    currentPage: page,
                    totalPages: Math.ceil(laughariki.length / limit),
                    itemsPerPage: limit
                }
            }));
        } else if (req.method === 'PUT') {
            body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
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

                    const index = laughariki.findIndex(item => item.id === id);

                    if (index === -1) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Ресурс не найден' }));
                        return;
                    }

                    laughariki[index] = { ...laughariki[index], ...data };

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'Данные обновлены успешно',
                        data: laughariki[index]
                    }));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Невалидный JSON' }));
                }
            });
        } else if (req.method === 'PATCH') {
            body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const data = JSON.parse(body);

                    if (checkoutOneRequired(data, res)) {
                        return;
                    }

                    const id = parseInt(req.url.split("/")[2]);

                    if (isNaN(id)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Невалидный ID' }));
                        return;
                    }

                    const index = laughariki.findIndex(item => item.id === id);

                    if (index === -1) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Ресурс не найден' }));
                        return;
                    }

                    laughariki[index] = { ...laughariki[index], ...data };

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'Данные обновлены успешно',
                        data: laughariki[index]
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

            const index = laughariki.findIndex(item => item.id === id);

            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ресурс не найден' }));
                return;
            }

            laughariki.splice(index, 1);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Ресурс успешно удален',
                data: laughariki
            }));
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

function checkoutOneRequired(data, res) {
    if (!data.name && !data.avatar && !data.description && !data.character && !data.hobbies && !data.favoritePhrases && !data.friends) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Хотя бы одно поле должно быть заполнено' }));
        return true;
    }
    return false;
}

server.listen(8000, () => {
    console.log('Сервер запущен на http://localhost:8000');
});