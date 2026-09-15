import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

// MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// Basic API
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API is running'
    });
});


// Test database connection
// app.get('/test-db', async (req, res) => {
//     try {

//         const [rows] = await db.query('SELECT 1 AS connected');

//         res.json({
//             success: true,
//             message: 'MySQL connected successfully',
//             data: rows
//         });

//     } catch (error) {

//         console.error('Database Error:', error);

//         res.status(500).json({
//             success: false,
//             message: 'MySQL connection failed',
//             error: error.message
//         });
//     }
// });

app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 AS connected');

        res.json({
            success: true,
            message: 'MySQL connected successfully',
            data: rows
        });

    } catch (error) {
        console.error('Database Error:', error);

        res.status(500).json({
            success: false,
            message: 'MySQL connection failed',
            code: error.code || null,
            error: error.message || null,
            details: error.errors
                ? error.errors.map(err => ({
                    message: err.message,
                    code: err.code,
                    address: err.address,
                    port: err.port
                }))
                : []
        });
    }
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});