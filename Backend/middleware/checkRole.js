

const checkRole = (...roles) => {
    return (req, res, next) => {
      const user = req.user; // User object populated by verifyJWT
      if (roles.includes(user.role)) {
        next()
      } else {
        res.status(403).json({ message: 'Forbidden: You do not have the right permissions' })
      }
    }
  }
  
  module.exports = checkRole