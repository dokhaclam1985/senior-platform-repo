const authService = require('../services/authService');

async function login(req, res) {
  const { username, password } = req.body;

  const result = await authService.login(
    username,
    password
  );

  if (!result) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }

 res.json({
  message: 'Login successful',
  accessToken: result.accessToken,
  refreshToken: result.refreshToken,
  user: result.user,
});
}
function refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      message: 'Refresh token is required',
    });
  }

  const accessToken =
    authService.refreshAccessToken(refreshToken);

  if (!accessToken) {
    return res.status(401).json({
      message: 'Invalid or expired refresh token',
    });
  }

  res.json({
    message: 'Token refreshed',
    accessToken,
  });
}

function logout(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      message: 'Refresh token is required',
    });
  }

  authService.logout(refreshToken);

  res.json({
    message: 'Logout successful',
  });
}
module.exports = {
  login,
  refreshToken,
  logout,
};