import { promisePool } from '../db.js'; 


export const enrollUserInCourse = async (req, res) => {
  const { user_id, course_id } = req.body;

  try {
    const [existingEnrollment] = await promisePool.query(
      `SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?`,
      [user_id, course_id]
    );

    if (existingEnrollment.length > 0) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }

    const [result] = await promisePool.query(
      `INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)`,
      [user_id, course_id]
    );

    res.status(201).json({
      message: 'User enrolled successfully',
      enrollment_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error enrolling user' });
  }
};

const appendSasToken = (url) => {
    if (!url) return url;
    if (url.includes("blob.core.windows.net")) {
         const baseUrl = url.split("?")[0];
         return `${baseUrl}?${process.env.SAS_TOKEN}`;
    }
    return url;
};

export const getEnrollmentsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await promisePool.query(
      `SELECT e.enrollment_id, e.enrolled_at, e.progress,c.course_id, c.title, c.image_url 
       FROM enrollments e
       JOIN courses c ON e.course_id = c.course_id
       WHERE e.user_id = ?`,
      [userId]
    );

    const updatedRows = rows.map(row => {
        const originalUrl = row.image_url;
        const newUrl = appendSasToken(row.image_url);
        console.log(`[Enrollment] Course: ${row.title}, Original URL: ${originalUrl}, SAS Token: ${process.env.SAS_TOKEN ? 'Present' : 'MISSING'}, New URL: ${newUrl}`);
        return {
            ...row,
            image_url: newUrl
        };
    });

    res.json(updatedRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching enrollments' });
  }
};

export const updateEnrollmentProgress = async (req, res) => {
  const { enrollmentId } = req.params;
  const { progress } = req.body;

  try {
    const [result] = await promisePool.query(
      `UPDATE enrollments SET progress = ?, enrolled_at = NOW() WHERE enrollment_id = ?`,
      [progress, enrollmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating progress' });
  }
};

export const deleteEnrollment = async (req, res) => {
  const { enrollmentId } = req.params;

  try {
    const [result] = await promisePool.query(`DELETE FROM enrollments WHERE enrollment_id = ?`, [enrollmentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ message: 'User unenrolled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting enrollment' });
  }
};


export const getEnrollmentCountByCourseId = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const [rows] = await promisePool.execute(
      'SELECT COUNT(*) AS enrollment_count FROM enrollments WHERE course_id = ?',
      [courseId]
    );

    const enrollmentCount = rows[0].enrollment_count;

    res.status(200).json({ courseId, enrollmentCount });
  } catch (error) {
    console.error('Error fetching enrollment count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

