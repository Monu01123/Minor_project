import { promisePool } from "../db.js";

export class CourseService {
  static async createCourse(courseData) {
    const {
      title,
      description,
      price,
      discount_price,
      image_url,
      category_id,
      instructor_id,
      level,
      language,
    } = courseData;

    const [result] = await promisePool.query(
      `INSERT INTO courses (title, description, price, discount_price, image_url, category_id, instructor_id, level, language) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        price,
        discount_price,
        image_url,
        category_id,
        instructor_id,
        level,
        language,
      ]
    );

    return result.insertId;
  }

  static async getAllCourses() {
    const [rows] = await promisePool.query(`SELECT * FROM courses`);
    return rows;
  }

  static async getCourseById(courseId) {
    const [rows] = await promisePool.query(
      `SELECT 
        c.*, 
        u.full_name AS instructor_name, 
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.course_id) AS enrollment_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.user_id
      WHERE c.course_id = ?`,
      [courseId]
    );
    return rows[0];
  }

  static async updateCourse(courseId, courseData) {
    const {
        title,
        description,
        price,
        discount_price,
        image_url,
        category_id,
        level,
        language,
        status,
    } = courseData;

    const [result] = await promisePool.query(
        `UPDATE courses SET title = ?, description = ?, price = ?, discount_price = ?, image_url = ?, category_id = ?, 
        level = ?, language = ?, status = ?, updated_at = NOW() WHERE course_id = ?`,
        [
            title,
            description,
            price,
            discount_price,
            image_url,
            category_id,
            level,
            language,
            status,
            courseId,
        ]
    );
    return result.affectedRows > 0;
  }

  static async deleteCourse(courseId) {
    // Delete related records first to avoid foreign key constraints
    await promisePool.query(`DELETE FROM enrollments WHERE course_id = ?`, [courseId]);
    await promisePool.query(`DELETE FROM course_content WHERE course_id = ?`, [courseId]);
    await promisePool.query(`DELETE FROM reviews WHERE course_id = ?`, [courseId]);
    await promisePool.query(`DELETE FROM wishlist WHERE course_id = ?`, [courseId]);
    await promisePool.query(`DELETE FROM cart WHERE course_id = ?`, [courseId]);

    const [result] = await promisePool.query(
        `DELETE FROM courses WHERE course_id = ?`,
        [courseId]
    );
    return result.affectedRows > 0;
  }

  static async getCourseInstructorId(courseId) {
    const [rows] = await promisePool.query(
        `SELECT instructor_id FROM courses WHERE course_id = ?`,
        [courseId]
    );
    return rows.length > 0 ? rows[0].instructor_id : null;
  }

  static async getCoursesByCategory(categoryId) {
    const [rows] = await promisePool.query(
        `SELECT courses.*, users.full_name AS instructor_name 
         FROM courses 
         JOIN users ON courses.instructor_id = users.user_id 
         WHERE courses.category_id = ?`,
        [categoryId]
    );
    return rows;
  }

  static async getCoursesByInstructor(instructorId) {
    const [rows] = await promisePool.query(
        `SELECT * FROM courses WHERE instructor_id = ?`,
        [instructorId]
    );
    return rows;
  }
}
