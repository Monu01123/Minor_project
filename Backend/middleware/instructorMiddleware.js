
import  jwt from  'jsonwebtoken';

export const instructorOnly = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: "Access denied. Instructor only." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


