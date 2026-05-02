import bcrypt from 'bcryptjs';
import { AdminUserRepository } from '../repositories/AdminUserRepository';
import { CreateAdminUserDto, AdminUserPublic } from '../models/AdminUser';

const repo = new AdminUserRepository();

export class AdminUserService {
  async createUser(dto: CreateAdminUserDto): Promise<AdminUserPublic> {
    // Validate required fields
    if (!dto.name || !dto.email || !dto.password) {
      throw { status: 400, message: 'name, email and password are required' };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.email)) {
      throw { status: 400, message: 'Invalid email format' };
    }

    // Password minimum length
    if (dto.password.length < 8) {
      throw { status: 400, message: 'Password must be at least 8 characters' };
    }

    // Check email uniqueness (search without active filter)
    const existing = await repo.findByEmail(dto.email);
    if (existing) {
      throw { status: 409, message: 'A user with that email already exists' };
    }

    const password_hash = await bcrypt.hash(dto.password, 12);

    const created = await repo.create({ ...dto, password_hash });

    // Return without password_hash
    const { password_hash: _, ...user } = created;
    return user as AdminUserPublic;
  }
}
