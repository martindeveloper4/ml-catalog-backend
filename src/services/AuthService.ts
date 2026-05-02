import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUserRepository } from '../repositories/AdminUserRepository';
import { LoginDto, JwtPayload, AdminUserPublic } from '../models/AdminUser';

const repo = new AdminUserRepository();

export class AuthService {
  async login(dto: LoginDto): Promise<{ token: string; user: AdminUserPublic }> {
    const user = await repo.findByEmail(dto.email);
    // Use constant-time comparison even for "user not found" to prevent timing attacks
    const dummyHash = '$2a$10$invalidhashusedforusernottofoundsecurity000000000000';
    const hashToCompare = user ? user.password_hash : dummyHash;

    const valid = await bcrypt.compare(dto.password, hashToCompare);
    if (!user || !valid) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    await repo.updateLastLogin(user.id);

    const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not configured');

    const expiresIn = process.env.JWT_EXPIRES_IN ?? '8h';
    const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...publicUser } = user;
    return { token, user: publicUser };
  }
}
