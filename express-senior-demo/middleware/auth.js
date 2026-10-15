function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Authentication required',
    });
  }

  if (authHeader !== 'Bearer secret-token') {
    return res.status(403).json({
      message: 'Invalid token',
    });
  }

  next();
}

module.exports = authenticate;