import { promisePool } from "../db.js";


export const createCourse = async (req, res) => {
  try {
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
    } = req.body;

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

    res.status(201).json({
      message: "Course created successfully",
      course_id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating course" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM courses`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

export const getCourseById = async (req, res) => {
  const { courseId } = req.params;
  try {
    const [rows] = await promisePool.query(
      `SELECT * FROM courses WHERE course_id = ?`,
      [courseId]
    );

    // if (rows.length === 0) {
    //   return res.status(404).json({ message: "Course not found" });
    // }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching course" });
  }
};

export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
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
    status,
  } = req.body;

  try {
    // Fetch the course to check the instructor
    const [courseRows] = await promisePool.query(
      `SELECT instructor_id FROM courses WHERE course_id = ?`,
      [courseId]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the logged-in instructor matches the course's instructor
    const courseInstructorId = courseRows[0].instructor_id;
    if (courseInstructorId !== instructor_id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to modify this course" });
    }

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

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating course" });
  }
};



export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const { instructor_id } = req.body; // Make sure this is being passed correctly

  try {
    // Log incoming data for debugging
    console.log(`Deleting Course ID: ${courseId}`);
    console.log(`Instructor ID from request: ${instructor_id}`);

    // Fetch the course to check the instructor
    const [courseRows] = await promisePool.query(
      `SELECT instructor_id FROM courses WHERE course_id = ?`,
      [courseId]
    );

    if (courseRows.length === 0) {
      console.error("Course not found");
      return res.status(404).json({ message: "Course not found" });
    }

    const courseInstructorId = courseRows[0].instructor_id;
    console.log(`Instructor ID from course: ${courseInstructorId}`);

    if (courseInstructorId !== instructor_id) {
      console.error("Permission denied to delete course");
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this course" });
    }

    const [result] = await promisePool.query(
      `DELETE FROM courses WHERE course_id = ?`,
      [courseId]
    );

    if (result.affectedRows === 0) {
      console.error("Course not found in deletion step");
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error); // Log the error for debugging
    res.status(500).json({ message: "Error deleting course" });
  }
};



export const getCoursesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const [rows] = await promisePool.query(
      `SELECT * FROM courses WHERE category_id = ?`,
      [categoryId]
    );
    if (rows.length === 0){
      return res
        .status(404)
        .json({ message: "No courses found for this category" });
    }
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching courses by category" });
  }
};

export const getCoursesByInstructor = async (req, res) => {
  const { instructorId } = req.params;
  try {
    const [rows] = await promisePool.query(
      `SELECT * FROM courses WHERE instructor_id = ?`,
      [instructorId]
    );
    // if (rows.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No courses found for this instructor" });
    // }
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching courses by instructor" });
  }
};
