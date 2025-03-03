// db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres', // Замените на ваше имя пользователя
    host: 'localhost',
    database: 'postgres', // Замените на имя вашей базы данных
    password: 'postgres', // Замените на ваш пароль
    port: 5432,
    client_encoding: 'UTF8', // Явно указываем кодировку
});

// Проверка подключения
pool.on('connect', () => {
    console.log('Подключение к базе данных успешно установлено!');
});

pool.on('error', (err) => {
    console.error('Ошибка подключения к базе данных:', err);
    process.exit(-1); // Завершаем процесс при ошибке подключения
});

const db = {
    query: (text, params) => pool.query(text, params),
};

export default db;