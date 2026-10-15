function validateUser(req, res, next) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'Name is required',
    });
  }

  next();
}

module.exports = validateUser;