import express from 'express';
import { promisePool } from '../db.js'; // Adjust this import based on your directory structure

const app = express.Router();

app.get('/search', async (req, res) => {
    const { keyword, category, min_price, max_price, instructor, level, language } = req.query;
    
    let query = 'SELECT * FROM courses';
    let filters = [];

    // Keyword filter
    if (keyword) {
        filters.push(`title LIKE '%${keyword}%'`);
    }

    // Level and Language filters (using OR)
    const orFilters = [];
    if (level) {
        orFilters.push(`level = '${level.trim()}'`);
    }
    if (language) {
        orFilters.push(`language = '${language.trim()}'`);
    }
    if (orFilters.length > 0) {
        filters.push(`(${orFilters.join(' OR ')})`); // Combine level and language with OR
    }

    // Category filter
    if (category) {
        filters.push(`category_id = (SELECT category_id FROM categories WHERE name = '${category}')`);
    }

    // Price range filter
    if (min_price && max_price) {
        filters.push(`price BETWEEN ${min_price} AND ${max_price}`);
    }

    // Instructor filter
    if (instructor) {
        filters.push(`instructor_id = (SELECT user_id FROM users WHERE full_name LIKE '%${instructor}%')`);
    }

    // Construct the final query
    if (filters.length > 0) {
        query += ' WHERE ' + filters.join(' AND ');
    }

    try {
        const [results] = await promisePool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

export default app;
