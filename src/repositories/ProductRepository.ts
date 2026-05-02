import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../db/connection';
import {
  ProductWithCategory,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from '../models/Product';

export class ProductRepository {
  async findAll(
    filters: ProductFilters = {},
  ): Promise<{ products: ProductWithCategory[]; total: number }> {
    const pool = getPool();
    const { category_slug, search, active, page = 1, limit = 12 } = filters;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (active !== undefined) {
      conditions.push('p.active = ?');
      params.push(active ? 1 : 0);
    }
    if (category_slug) {
      conditions.push('c.slug = ?');
      params.push(category_slug);
    }
    if (search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${where}`,
      params,
    );
    const total: number = (countRows[0] as RowDataPacket).total;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
         p.*,
         c.slug AS category_slug,
         c.name AS category_name,
         c.icon AS category_icon
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY c.sort_order ASC, p.sort_order ASC, p.id ASC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return { products: rows as ProductWithCategory[], total };
  }

  async findById(id: number): Promise<ProductWithCategory | null> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
         p.*,
         c.slug AS category_slug,
         c.name AS category_name,
         c.icon AS category_icon
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`,
      [id],
    );
    return rows.length ? (rows[0] as ProductWithCategory) : null;
  }

  async create(dto: CreateProductDto): Promise<ProductWithCategory> {
    const pool = getPool();
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO products
         (name, description, price, image_url, category_id,
          badge_text, badge_type, stock_available, active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.name,
        dto.description ?? null,
        dto.price,
        dto.image_url ?? null,
        dto.category_id,
        dto.badge_text ?? null,
        dto.badge_type ?? null,
        dto.stock_available !== false ? 1 : 0,
        dto.active !== false ? 1 : 0,
        dto.sort_order ?? 0,
      ],
    );
    return (await this.findById(result.insertId))!;
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductWithCategory | null> {
    const pool = getPool();
    const fields: string[] = [];
    const values: unknown[] = [];

    if (dto.name            !== undefined) { fields.push('name = ?');            values.push(dto.name); }
    if (dto.description     !== undefined) { fields.push('description = ?');     values.push(dto.description); }
    if (dto.price           !== undefined) { fields.push('price = ?');           values.push(dto.price); }
    if (dto.image_url       !== undefined) { fields.push('image_url = ?');       values.push(dto.image_url); }
    if (dto.category_id     !== undefined) { fields.push('category_id = ?');     values.push(dto.category_id); }
    if (dto.badge_text      !== undefined) { fields.push('badge_text = ?');      values.push(dto.badge_text); }
    if (dto.badge_type      !== undefined) { fields.push('badge_type = ?');      values.push(dto.badge_type); }
    if (dto.stock_available !== undefined) { fields.push('stock_available = ?'); values.push(dto.stock_available ? 1 : 0); }
    if (dto.active          !== undefined) { fields.push('active = ?');          values.push(dto.active ? 1 : 0); }
    if (dto.sort_order      !== undefined) { fields.push('sort_order = ?');      values.push(dto.sort_order); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.query<ResultSetHeader>(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const pool = getPool();
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM products WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  }
}
