// Teste rápido de DATABASE_URL
const urls = [
  // URL com pgbouncer
  'postgresql://postgres:AtS%2Fe_eS%2FvpBq65@db.lippbdvedrqdckcnrdyp.supabase.co:6543/postgres?pgbouncer=true',
  // URL direta
  'postgresql://postgres:AtS%2Fe_eS%2FvpBq65@db.lippbdvedrqdckcnrdyp.supabase.co:5432/postgres',
];

urls.forEach((url, i) => {
  try {
    const parsed = new URL(url);
    console.log(`\n✅ URL ${i + 1} válida:`);
    console.log('  Protocol:', parsed.protocol);
    console.log('  Host:', parsed.hostname);
    console.log('  Port:', parsed.port);
    console.log('  Database:', parsed.pathname);
    console.log('  User:', parsed.username);
    console.log('  Password:', parsed.password);
  } catch (error) {
    console.log(`\n❌ URL ${i + 1} inválida:`, error.message);
  }
});
