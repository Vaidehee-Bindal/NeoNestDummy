const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
};

// Specific role middlewares
const adminOnly = roleMiddleware(['admin']);
const womanOnly = roleMiddleware(['woman']);
const orgOnly = roleMiddleware(['organization']);
const womanOrOrg = roleMiddleware(['woman', 'organization']);

module.exports = {
  roleMiddleware,
  adminOnly,
  womanOnly,
  orgOnly,
  womanOrOrg,
};
