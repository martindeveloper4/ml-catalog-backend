/**
 * One-time script to create the first superadmin user.
 * Run: npx ts-node src/scripts/seed-admin.ts
 *
 * Optionally pass args:
 *   npx ts-node src/scripts/seed-admin.ts "John Doe" john@example.com MyPassword123
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { getPool } from '../db/connection';

async function main() {
  const args = process.argv.slice(2);

  const name     = args[0] ?? 'Admin';
  const email    = args[1] ?? 'admin@pinateriaml.com';
  const password = args[2] ?? 'Admin1234!';

  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const pool = getPool();

  // Check if email already exists
  const [rows]: any = await pool.query(
    'SELECT id FROM admin_users WHERE email = ?',
    [email],
  );
  if ((rows as any[]).length > 0) {
    console.log(`User with email "${email}" already exists. Nothing to do.`);
    await pool.end();
    return;
  }

  const password_hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO admin_users (name, email, password_hash, role, active)
     VALUES (?, ?, ?, 'superadmin', 1)`,
    [name, email, password_hash],
  );

  console.log('✔ Superadmin created successfully:');
  console.log(`  Name  : ${name}`);
  console.log(`  Email : ${email}`);
  console.log('  Role  : superadmin');
  console.log('\nYou can now log in at POST /api/auth/login with these credentials.');

  await pool.end();
}

main().catch((err) => {
  console.error('Error:', err.message ?? err);
  process.exit(1);
});
