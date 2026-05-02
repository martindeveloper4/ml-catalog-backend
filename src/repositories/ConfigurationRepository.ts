import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getPool } from '../db/connection';
import { Configuration, UpdateConfigurationDto } from '../models/Configuration';

export class ConfigurationRepository {
  async findAll(): Promise<Configuration[]> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM configuration ORDER BY setting_key ASC',
    );
    return rows as Configuration[];
  }

  async findByKey(key: string): Promise<Configuration | null> {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM configuration WHERE setting_key = ?',
      [key],
    );
    return rows.length ? (rows[0] as Configuration) : null;
  }

  async update(key: string, dto: UpdateConfigurationDto): Promise<Configuration | null> {
    const pool = getPool();
    await pool.query<ResultSetHeader>(
      'UPDATE configuration SET value = ? WHERE setting_key = ?',
      [dto.value, key],
    );
    return this.findByKey(key);
  }
}
