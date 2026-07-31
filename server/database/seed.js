// Seeds a default mock user on first run only — no-op against an already-seeded database.
export async function seedDefaultUser(db) {
  const defaultUser = await db.get('SELECT * FROM users WHERE id = ?', 'user-default');
  if (!defaultUser) {
    await db.run(
      'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
      'user-default',
      'Sarah Jenkins',
      'sarah.jenkins@google.com'
    );
    console.log('Default mock user initialized.');
  }
}
