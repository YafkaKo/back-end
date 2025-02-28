import http from 'node:http';

const laughariki =  [
    { id: 1, name: 'Копатыч', article: 'Так говорят все поработители! Сво-бо-ду! Сво-бо-ду!' },
    { id: 2, name: 'Крош', article: 'Ёлки-иголки! Это же просто праздник какой-то!' },
    { id: 3, name: 'Ёжик', article: 'Я не трус, но я боюсь!' },
    { id: 4, name: 'Нюша', article: 'Красота — это страшная сила!' },
    { id: 5, name: 'Бараш', article: 'Я — поэт, зовусь я Бараш, и я пишу стихи для вас!' },
    { id: 6, name: 'Пин', article: 'Это же элементарно, Ватсон!' },
    { id: 7, name: 'Лосяш', article: 'Наука — это круто!' },
    { id: 8, name: 'Совунья', article: 'Здоровье — это главное!' },
    { id: 9, name: 'Кар-Карыч', article: 'В моё время всё было по-другому!' },
    { id: 10, name: 'Биби', article: 'Биби-биби! Я — робот!' }
]

// const pokemons = [{ id: 1, name: 'Pikachu', pic: 'https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/other/official-artwork/25.png' }]

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

                    if(checkoutRequired(parsedBody.name,parsedBody.article,res)){
                        return
                    }

                    const { name, article } = parsedBody;

                    const maxId = Math.max(...laughariki.map(laugharik => laugharik.id), 0); // Учитываем случай пустого массива
                    const newItem = { id: maxId + 1, name, article };

                    laughariki.push(newItem);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(laughariki));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Невалидный JSON' }));
                }
            });
        }
        else if (req.method === 'GET') {
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
        }
        else if(req.method === 'PUT'){
            body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const data = JSON.parse(body);

                    if(checkoutRequired(data.name,data.article,res)){
                        return
                    }

                    console.log('Новые данные:', data);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'Данные обновлены успешно',
                        data: data
                    }));
                } catch (error) {
                    // Обработка ошибок парсинга JSON
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Невалидный JSON' }));
                }
            });
        }
        else if(req.method === 'PATCH'){
            body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const data = JSON.parse(body);

                    if(checkoutOneRequired(data.name,data.article,res)){
                        return
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'Данные обновлены успешно',
                        data: data
                    }));
                } catch (error) {
                    // Обработка ошибок парсинга JSON
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Невалидный JSON' }));
                }
            });
        }
        else if(req.method === 'DELETE'){
            const id = parseInt(req.url.split("/")[2]); // Извлекаем id из URL

            if (isNaN(id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Невалидный ID' }));
                return;
            }

            const index = laughariki.findIndex(item => item.id === id); // Ищем элемент по id

            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ресурс не найден' }));
                return;
            }

            laughariki.splice(index, 1); // Удаляем элемент из массива

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Ресурс успешно удален',
                data: laughariki
            }));
        }
        else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Метод не поддерживается' }));
        }

    } else {

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ресурс не найден' }));
    }
});

function checkoutRequired(name, article,res){
    if (!name || !article) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Поля должны быть обязательно заполненными и не должны быть пустыми строками ' }));
        return true;
    }
}

function checkoutOneRequired(name, article,res){
    if (!name && !article) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Одно из полей должно быть обязательно заполненными и не должны быть пустыми ' }));
        return true;
    }
}

server.listen(8000);