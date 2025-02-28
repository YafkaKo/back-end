# Лабораторная работа 3
## Знакомство с Node HTTP Module на примере реализации RESTful сервера
### Цель работы
Познакомиться с HTTP модулем Node, реализовать HTTP сервер средствами Node без использования сторонных фреймворков

### Технические требования:
- Наличие интернет-соединения
- Наличие [Postman](https://www.postman.com/downloads/) или 
- Наличие [Node](https://docs.docker.com/desktop/) [v22 и выше] или наличие [NVM](https://github.com/nvm-sh/nvm) для переключения между версиями Node

### Ход работы:
1. В директории с лабораторной работой выполните установку зависимостей с помощью команды `npm i`

2. В директории с лабораторной работой выполните запуск проекта с помощью команды `npm start`

3. Выполните запрос для получения списка всех объектов, сохраненных в API. Для этого используйте импорт cURL запроса в Postman
```
curl --location 'localhost:8000/api' \
--header 'accept: application/json'
```

4. Убедитесь в наличии ответа
```
[
    {
        "id": 1,
        "name": "Pikachu",
        "pic": "https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/other/official-artwork/25.png"
    }
]
```

3. Выполните запрос для создания новоого объекта в API
```
curl --location 'localhost:8000/api' \
--header 'accept: application/json' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Snorlax",
    "pic": "https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/other/official-artwork/25.png"
}'
```

Убедитесь в наличии ответа
```
[
    {
        "id": 1,
        "name": "Pikachu",
        "pic": "https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/other/official-artwork/25.png"
    },
    {
        "id": 2,
        "name": "Snorlax",
        "pic": "https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/other/official-artwork/25.png"
    }
]
```


5. Модифицируйте файл `server.js` в директории `src`:
- Добавив валидацию входных данных
- Изменив предметную область в соответствии с выбранной темой
- Добавив пагинацию для GET запроса
```
curl --location 'localhost:8000/api?limit=10&page=1' \
--header 'accept: application/json'
```


- Добавив обработку следующих HTTP методов (в соответствии с RESTful практиками)

PUT
```
curl --location --request PUT 'localhost:8000/api/3' \
--header 'accept: application/json' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Snorlax",
    "pic": "https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/other/official-artwork/25.png"
}'
```


PATCH
```
curl --location --request PATCH 'localhost:8000/api/3' \
--header 'accept: application/json' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Snorlax",
    "pic": "https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/other/official-artwork/25.png"
}'
```

DELETE
```
curl --location --request DELETE 'localhost:8000/api/3' \
--header 'accept: application/json'
```

### Документация:

[Node](https://nodejs.org/docs/latest/api/http.html#httpcreateserveroptions-requestlistener)


### Контрольные вопросы:
1. Что такое Node? 
2. Что такое модуль HTTP и какие возможности он предоставляет?
3. Что такое RESTful?