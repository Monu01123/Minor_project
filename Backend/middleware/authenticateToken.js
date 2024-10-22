import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    console.log("No token provided.");
    return res.sendStatus(401); 
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.sendStatus(403);
    }
    req.user = user; 
    next();
  });
};



export { authenticateToken };
