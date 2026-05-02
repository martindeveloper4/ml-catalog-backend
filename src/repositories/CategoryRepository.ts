import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../db/connection';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/Category';

export class CategoryRepository {
  async findAll(activeOnly = false): Promise<Category[]> {
    const pool = getPool();
    const sql = activeOnly
      ? 'SELECT * FROM categories WHERE active = 1 ORDER BY sort_order ASC'
      : 'SELECT * FROM categories ORDER BY sort_order ASC';
    const [rows] = await pool.query<RowDataPacket[]>(sql);
    return rows as Category[];
  }

  async findById(id: number): Promise<Category | null> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id],
    );
    return rows.length ? (rows[0] as Category) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories WHERE slug = ?',
      [slug],
    );
    return rows.length ? (rows[0] as Category) : null;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const pool = getPool();
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO categories (slug, name, icon, sort_order, active)
       VALUES (?, ?, ?, ?, ?)`,
      [dto.slug, dto.name, dto.icon, dto.sort_order ?? 0, dto.active !== false ? 1 : 0],
    );
    return (await this.findById(result.insertId))!;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category | null> {
    const pool = getPool();
    const fields: string[] = [];
    const values: unknown[] = [];

    if (dto.slug       !== undefined) { fields.push('slug = ?');       values.push(dto.slug); }
    if (dto.name       !== undefined) { fields.push('name = ?');       values.push(dto.name); }
    if (dto.icon       !== undefined) { fields.push('icon = ?');       values.push(dto.icon); }
    if (dto.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(dto.sort_order); }
    if (dto.active     !== undefined) { fields.push('active = ?');     values.push(dto.active ? 1 : 0); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.query<ResultSetHeader>(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const pool = getPool();
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM categories WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  }
}
