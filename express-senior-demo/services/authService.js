const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validRefreshTokens = new Set();
const env = require('../config/env');
const demoUser = {
  id: 1,
  username: 'lam',
  passwordHash: '$2b$10$wniQCLNr6i/1.1ZR1ZK.KOa34LjvTC0I//o87PUUiUkiBnUFURshW',
  role: 'admin',
};

async function login(username, password) {
  if (username !== demoUser.username) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(
    password,
    demoUser.passwordHash
  );

  if (!passwordMatch) {
    return null;
  }

    const accessToken = jwt.sign(
    {
        id: demoUser.id,
        username: demoUser.username,
        role: demoUser.role,
    },
    env.jwtSecret,
    {
        expiresIn: '15m',
    }
    );

    const refreshToken = jwt.sign(
    {
        id: demoUser.id,
        username: demoUser.username,
        role: demoUser.role,
    },
    env.jwtRefreshSecret,
    {
        expiresIn: '7d',
    }
    );
    validRefreshTokens.add(refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: demoUser.id,
      username: demoUser.username,
      role: demoUser.role,
    },
  };
}
function refreshAccessToken(refreshToken) {
  try {
    if (!validRefreshTokens.has(refreshToken)) {
        return null;
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const accessToken = jwt.sign(
      {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      }
    );

    return accessToken;
  } catch (error) {
    return null;
  }
}

function logout(refreshToken) {
  return validRefreshTokens.delete(refreshToken);
}
module.exports = {
  login,
  refreshAccessToken,
  logout,
};