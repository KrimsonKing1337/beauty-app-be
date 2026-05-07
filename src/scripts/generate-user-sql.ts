import bcrypt from 'bcrypt';

const login = 'user';
const password = '12345';
const name = 'User';

(async () => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    console.log(`
INSERT INTO users (
  id,
  login,
  password_hash,
  name,
  created_at
)
VALUES (
  gen_random_uuid(),
  '${login}',
  '${passwordHash}',
  '${name}',
  now()
);
`);
  } catch (error) {
    console.error(error);
  }
})();
