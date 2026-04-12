const { Client } = require('pg');

async function testPassword(password) {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: password,
    port: 5432,
  });

  try {
    await client.connect();
    console.log(`Success with password: "${password}"`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`Failed with password: "${password}" - ${err.message}`);
    return false;
  }
}

async function run() {
  const passwords = ['postgres', 'admin', 'root', '123456', ''];
  for (const p of passwords) {
    if (await testPassword(p)) {
      process.exit(0);
    }
  }
  process.exit(1);
}

run();
