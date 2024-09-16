DROP DATABASE IF EXISTS elearning;
create database elearning;
use elearning;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    otp VARCHAR(255),
    otp_expires DATETIME,
    is_active BOOLEAN DEFAULT FALSE,
    role ENUM('student', 'instructor', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE otp (
   id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT NOT NULL,
   otp VARCHAR(6) NOT NULL,
   otp_expiry BIGINT NOT NULL,
   FOREIGN KEY (user_id) REFERENCES users(user_id)  -- Use 'user_id' to match the column in 'users'
);


CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2), -- Optional
    image_url VARCHAR(255),
    category_id INT NOT NULL,
    instructor_id INT NOT NULL,
    average_rating DECIMAL(2, 1) DEFAULT 0, 
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner', 
    language VARCHAR(50) DEFAULT 'English', 
    status ENUM('draft', 'published') DEFAULT 'draft', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_instructor (instructor_id),
    INDEX idx_title (title)
);


CREATE TABLE course_content (
    content_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_type ENUM('video') NOT NULL, 
    content_url VARCHAR(255), 
    content_text TEXT, 
    duration INT DEFAULT 0, 
    content_order INT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_content_order (content_order)
);

CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress FLOAT DEFAULT 0, -- Progress as a percentage
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    rating INT NOT NULL, -- Rating from 1 to 5
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE wishlist (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- Cart Table
CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Cart Items Table
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    course_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (cart_id, course_id) -- Ensure the same course is not added multiple times
);

select * from users;
select * from courses;
select * from categories;
select * from enrollments;
select * from course_content;
select * from reviews;
select * from wishlist;
select * from cart;

-- Insert dummy data into users
INSERT INTO users (full_name, email, password_hash, otp, otp_expires, is_active, role, created_at, updated_at)
VALUES 
    ('John Doe', 'john@example.com', 'password_hash_1', '123456', DATE_ADD(NOW(), INTERVAL 10 MINUTE), TRUE, 'instructor', NOW(), NOW()),
    ('Jane Smith', 'jane@example.com', 'password_hash_2', '654321', DATE_ADD(NOW(), INTERVAL 10 MINUTE), TRUE, 'instructor', NOW(), NOW()),
    ('Alice Johnson', 'alice@example.com', 'password_hash_3', 'abcdef', DATE_ADD(NOW(), INTERVAL 10 MINUTE), TRUE, 'student', NOW(), NOW()),
    ('Bob Brown', 'bob@example.com', 'password_hash_4', 'ghijkl', DATE_ADD(NOW(), INTERVAL 10 MINUTE), TRUE, 'student', NOW(), NOW()),
    ('Chris White', 'chris@example.com', 'password_hash_5', 'mnopqr', DATE_ADD(NOW(), INTERVAL 10 MINUTE), TRUE, 'student', NOW(), NOW()),
    ('Mike Green', 'mike@example.com', 'password_hash_6', 'stuvwx', DATE_ADD(NOW(), INTERVAL 10 MINUTE), TRUE, 'admin', NOW(), NOW()),
    ('Sara Black', 'sara@example.com', 'password_hash_7', 'yzabcd', DATE_ADD(NOW(), INTERVAL 10 MINUTE), TRUE, 'admin', NOW(), NOW());
    
INSERT INTO categories (name, description, created_at, updated_at)
VALUES 
    ("Web Development", "Web Development", NOW(), NOW()),
    ("App Development", "App Development", NOW(), NOW()),
    ("Data Science", "Data Science", NOW(), NOW()),
    ("Artificial Intelligence", "Artificial Intelligence", NOW(), NOW()),
    ("Graphic Design", "Graphic Design", NOW(), NOW()),
    ("Cybersecurity", "Cybersecurity", NOW(), NOW()),
    ("Digital Marketing", "Digital Marketing", NOW(), NOW());

-- Insert dummy data into otp
INSERT INTO otp (user_id, otp, otp_expiry)
VALUES 
    (4, '123456', UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 10 MINUTE))),
    (5, '654321', UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 10 MINUTE))),
    (6, 'abcdef', UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 10 MINUTE))),
    (7, 'ghijkl', UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 10 MINUTE)));

-- Insert dummy data into courses
INSERT INTO courses (title, description, price, discount_price, image_url, category_id, instructor_id, average_rating, level, language, status, created_at, updated_at)
VALUES 
    ("Web Development for Beginners", "Learn the basics of web development", 99.99, 49.99, "https://example.com/webdev.jpg", 1, 4, 4.5, 'beginner', 'English', 'published', NOW(), NOW()),
    ("Advanced App Development", "Master app development with advanced techniques", 199.99, 129.99, "https://example.com/appdev.jpg", 2, 5, 4.8, 'advanced', 'English', 'published', NOW(), NOW()),
    ("Data Science Bootcamp", "Comprehensive guide to data science", 299.99, NULL, "https://example.com/datascience.jpg", 3, 6, 4.7, 'intermediate', 'English', 'draft', NOW(), NOW()),
    ("AI for Everyone", "Understanding Artificial Intelligence and its applications", 149.99, 99.99, "https://example.com/ai.jpg", 4, 7, 4.9, 'beginner', 'English', 'published', NOW(), NOW()),
    ("Graphic Design Mastery", "Learn to design stunning visuals", 89.99, 59.99, "https://example.com/graphicdesign.jpg", 5, 4, 4.6, 'intermediate', 'English', 'published', NOW(), NOW()),
    ("Cybersecurity Essentials", "Protect your systems with cybersecurity techniques", 129.99, NULL, "https://example.com/cybersecurity.jpg", 6, 5, 4.4, 'beginner', 'English', 'draft', NOW(), NOW()),
    ("Digital Marketing Strategy", "Boost your business with digital marketing", 199.99, 149.99, "https://example.com/digitalmarketing.jpg", 7, 6, 4.8, 'advanced', 'English', 'published', NOW(), NOW());

-- Insert dummy data into course_content
INSERT INTO course_content (course_id, title, content_type, content_url, content_text, duration, content_order, created_at, updated_at)
VALUES 
    (1, 'Introduction to Web Development', 'video', 'https://example.com/webdev_intro.mp4', NULL, 600, 1, NOW(), NOW()),
    (1, 'HTML Basics', 'video', 'https://example.com/html_basics.mp4', NULL, 1200, 2, NOW(), NOW()),
    (2, 'Advanced Techniques in App Development', 'video', 'https://example.com/appdev_advanced.mp4', NULL, 1800, 1, NOW(), NOW()),
    (3, 'Introduction to Data Science', 'video', 'https://example.com/data_intro.mp4', NULL, 900, 1, NOW(), NOW()),
    (4, 'AI Concepts Overview', 'video', 'https://example.com/ai_overview.mp4', NULL, 1000, 1, NOW(), NOW());

INSERT INTO course_content (course_id, title, content_type, content_url, content_text, duration, content_order, created_at, updated_at)
VALUES 
    (5, 'Introduction to Graphic Design', 'video', 'https://example.com/graphicdesign_intro.mp4', NULL, 700, 1, NOW(), NOW()),
    (5, 'Design Principles', 'video', 'https://example.com/design_principles.mp4', NULL, 800, 2, NOW(), NOW()),
    (6, 'Cybersecurity Fundamentals', 'video', 'https://example.com/cybersecurity_fundamentals.mp4', NULL, 900, 1, NOW(), NOW()),
    (6, 'Threat Analysis and Prevention', 'video', 'https://example.com/threat_analysis.mp4', NULL, 1000, 2, NOW(), NOW()),
    (7, 'Digital Marketing Basics', 'video', 'https://example.com/digitalmarketing_basics.mp4', NULL, 650, 1, NOW(), NOW()),
    (7, 'SEO Strategies', 'video', 'https://example.com/seo_strategies.mp4', NULL, 700, 2, NOW(), NOW());

-- Insert dummy data into enrollments
INSERT INTO enrollments (user_id, course_id, enrolled_at, progress)
VALUES 
    (4, 1, NOW(), 20),
    (4, 2, NOW(), 40),
    (5, 3, NOW(), 10),
    (6, 4, NOW(), 30),
    (7, 5, NOW(), 50);

-- Insert dummy data into reviews
INSERT INTO reviews (user_id, course_id, rating, comment, created_at)
VALUES 
    (4, 1, 5, 'Excellent course for beginners!', NOW()),
    (5, 2, 4, 'Great content but could use more examples.', NOW()),
    (6, 3, 5, 'Highly recommended for data science enthusiasts.', NOW()),
    (7, 4, 4, 'Informative, but needs more practical exercises.', NOW());
    
INSERT INTO reviews (user_id, course_id, rating, comment, created_at)
VALUES 
    (5, 5, 5, 'Amazing course for learning graphic design techniques!', NOW()),
    (6, 6, 4, 'Good introduction to cybersecurity, but could be more in-depth.', NOW()),
    (7, 7, 5, 'Fantastic insights into digital marketing strategies!', NOW());


-- Insert dummy data into wishlist
INSERT INTO wishlist (user_id, course_id, added_at)
VALUES 
    (4, 3, NOW()),
    (5, 4, NOW()),
    (6, 5, NOW());

-- Insert dummy data into cart
INSERT INTO cart (user_id, created_at)
VALUES 
    (4, NOW()),
    (5, NOW());

-- Insert dummy data into cart_items
INSERT INTO cart_items (cart_id, course_id, added_at)
VALUES 
    (1, 1, NOW()),
    (1, 2, NOW()),
    (2, 3, NOW());