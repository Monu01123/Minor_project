import { promisePool } from './db.js';

const createTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS video_track (
                track_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                course_id INT NOT NULL,
                content_id INT NOT NULL,
                is_watched BOOLEAN DEFAULT FALSE,
                watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_track (user_id, course_id, content_id),
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                FOREIGN KEY (content_id) REFERENCES course_content(content_id) ON DELETE CASCADE
            );
        `;
        await promisePool.query(query);
        console.log("Table 'video_track' created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error creating table:", error);
        process.exit(1);
    }
};

createTable();
