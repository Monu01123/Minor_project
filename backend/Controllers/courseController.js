import { CourseService } from "../services/courseService.js";
import logger from "../utils/logger.js";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

export const createCourse = async (req, res) => {
  try {
    const insertId = await CourseService.createCourse(req.body);

    logger.info(`Course created successfully with ID: ${insertId}`);
    cache.del("allCourses"); // Invalidate cache
    res.status(201).json({
      message: "Course created successfully",
      course_id: insertId,
    });
  } catch (error) {
    logger.error("Error creating course", error);
    res.status(500).json({ message: "Error creating course" });
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

export const getCourses = async (req, res) => {
  try {
    const cachedCourses = cache.get("allCourses");
    if (cachedCourses) {
        logger.info("Serving courses from cache");
        return res.json(cachedCourses);
    }

    const rows = await CourseService.getAllCourses();
    const updatedRows = rows.map(course => ({
        ...course,
        image_url: appendSasToken(course.image_url)
    }));
    
    cache.set("allCourses", updatedRows);
    logger.info("Serving courses from database");
    res.json(updatedRows);
  } catch (error) {
    logger.error("Error fetching courses", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

export const getCourseById = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await CourseService.getCourseById(courseId);

    if (course) {
        course.image_url = appendSasToken(course.image_url);
        res.json(course);
    } else {
        res.status(404).json({ message: "Course not found" }); // Handled explicit 404
    }
  } catch (error) {
    logger.error("Error fetching course details", error);
    res.status(500).json({ message: "Error fetching course details" });
  }
};


export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const { instructor_id } = req.body; // Assuming instructor_id comes from body or auth middleware attached to req

  try {
    // Check if the course exists and belongs to the instructor
    const courseInstructorId = await CourseService.getCourseInstructorId(courseId);

    if (!courseInstructorId) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the logged-in instructor matches the course's instructor
    // Note: req.body.instructor_id might need to be sourced from req.user depending on auth middleware
    if (courseInstructorId !== instructor_id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to modify this course" });
    }

    const success = await CourseService.updateCourse(courseId, req.body);

    if (!success) {
      return res.status(404).json({ message: "Course not found or no changes made" });
    }

    logger.info(`Course updated successfully: ${courseId}`);
    cache.del("allCourses"); // Invalidate cache
    res.json({ message: "Course updated successfully" });
  } catch (error) {
    logger.error("Error updating course", error);
    res.status(500).json({ message: "Error updating course" });
  }
};



export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const { instructor_id } = req.body; 

  try {
    // Check permissions
    const courseInstructorId = await CourseService.getCourseInstructorId(courseId);

    if (!courseInstructorId) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (courseInstructorId !== instructor_id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this course" });
    }

    const success = await CourseService.deleteCourse(courseId);

    if (!success) {
      return res.status(404).json({ message: "Course not found in deletion step" });
    }

    logger.info(`Course deleted successfully: ${courseId}`);
    cache.del("allCourses"); // Invalidate cache
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    logger.error("Error deleting course", error); 
    res.status(500).json({ message: "Error deleting course" });
  }
};



export const getCoursesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const rows = await CourseService.getCoursesByCategory(categoryId);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this category" });
    }
    
    const updatedRows = rows.map(course => ({
        ...course,
        image_url: appendSasToken(course.image_url)
    }));
    
    res.json(updatedRows);
  } catch (error) {
    logger.error("Error fetching courses by category", error);
    res.status(500).json({ message: "Error fetching courses by category" });
  }
};


export const getCoursesByInstructor = async (req, res) => {
  const { instructorId } = req.params;
  try {
    const rows = await CourseService.getCoursesByInstructor(instructorId);
    
    const updatedRows = rows.map(course => ({
        ...course,
        image_url: appendSasToken(course.image_url)
    }));
    res.json(updatedRows);
  } catch (error) {
    logger.error("Error fetching courses by instructor", error);
    res.status(500).json({ message: "Error fetching courses by instructor" });
  }
};
