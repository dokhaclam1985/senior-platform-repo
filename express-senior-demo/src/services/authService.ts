import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import env from '../config/env';

interface DemoUser {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
}

interface AuthTokenPayload extends JwtPayload {
  id: string;
  username: string;
  role: string;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

const validRefreshTokens = new Set<string>();

const demoUser: DemoUser = {
  id: '1',
  username: 'lam',
  passwordHash:
    '$2b$10$wniQCLNr6i/1.1ZR1ZK.KOa34LjvTC0I//o87PUUiUkiBnUFURshW',
  role: 'admin',
};

export async function login(
  username: string,
  password: string
): Promise<LoginResult | null> {
    // Disable demo authentication in production
  if (env.nodeEnv === 'production') {
    return null;
  }
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

export function refreshAccessToken(
  refreshToken: string
): string | null {
    // Disable demo token refresh in production
  if (env.nodeEnv === 'production') {
    return null;
  }
  try {
    if (!validRefreshTokens.has(refreshToken)) {
      return null;
    }

    const decoded = jwt.verify(
      refreshToken,
      env.jwtRefreshSecret
    ) as AuthTokenPayload;

    const accessToken = jwt.sign(
      {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      },
      env.jwtSecret,
      {
        expiresIn: '15m',
      }
    );

    return accessToken;
  } catch {
    return null;
  }
}

export function logout(
  refreshToken: string
): boolean {
  return validRefreshTokens.delete(refreshToken);
}