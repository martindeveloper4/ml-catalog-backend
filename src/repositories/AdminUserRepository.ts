import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../db/connection';
import { AdminUser, CreateAdminUserDto } from '../models/AdminUser';

export class AdminUserRepository {
  async findByEmail(email: string): Promise<AdminUser | null> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM admin_users WHERE email = ? AND active = 1',
      [email],
    );
    return rows.length ? (rows[0] as AdminUser) : null;
  }

  async findById(id: number): Promise<AdminUser | null> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM admin_users WHERE id = ? AND active = 1',
      [id],
    );
    return rows.length ? (rows[0] as AdminUser) : null;
  }

  async updateLastLogin(id: number): Promise<void> {
    const pool = getPool();
    await pool.query<ResultSetHeader>(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [id],
    );
  }

  async create(dto: CreateAdminUserDto & { password_hash: string }): Promise<AdminUser> {
    const pool = getPool();
    const role = dto.role ?? 'editor';
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO admin_users (name, email, password_hash, role, active)
       VALUES (?, ?, ?, ?, 1)`,
      [dto.name, dto.email, dto.password_hash, role],
    );
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM admin_users WHERE id = ?',
      [result.insertId],
    );
    return rows[0] as AdminUser;
  }
}
