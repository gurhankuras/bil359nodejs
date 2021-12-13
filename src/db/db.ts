import mysql from 'mysql2'

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '214g7028091',
    database: 'sigorta_db'
})

export default db