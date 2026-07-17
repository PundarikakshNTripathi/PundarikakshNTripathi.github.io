const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the password you want to use for the Admin dashboard: ', (password) => {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  console.log('\n--- Success! ---');
  console.log('1. Create a file named .env.local in the root directory (it is ignored by git).');
  console.log('2. Add the following line to it:');
  console.log(`VITE_ADMIN_HASH=${hash}`);
  console.log('\nWhen deploying to Vercel/Netlify, add VITE_ADMIN_HASH to your production Environment Variables.');
  rl.close();
});
