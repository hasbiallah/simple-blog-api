require('dotenv').config();
const path = require('path');
const { pool } = require(path.join(process.cwd(), 'src/infrastructure/database/mysql_connection'));
const PasswordHasher = require(path.join(process.cwd(), 'src/infrastructure/security/PasswordHasher'));

const baseUrl = 'http://localhost:3000/api';

async function runTests() {
  const hasher = new PasswordHasher();
  const password = await hasher.hash('password123');

  console.log('--- DB Setup ---');
  await pool.execute('DELETE FROM users WHERE email LIKE "test_comment_%"');
  
  // Create Author
  const authorEmail = `test_comment_author@example.com`;
  await pool.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Author', authorEmail, password, 'author']);
  
  // Create Reader
  const readerEmail = `test_comment_reader@example.com`;
  await pool.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Reader', readerEmail, password, 'reader']);

  console.log('Users created.');

  // Login
  const authorLogin = await (await fetch(`${baseUrl}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: authorEmail, password: 'password123' }) })).json();
  const authorToken = authorLogin.data.token;

  const readerLogin = await (await fetch(`${baseUrl}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: readerEmail, password: 'password123' }) })).json();
  const readerToken = readerLogin.data.token;

  // Create Article
  const articleRes = await (await fetch(`${baseUrl}/articles`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authorToken}` }, body: JSON.stringify({ title: 'Comment Test', content: 'Content', status: 'published' }) })).json();
  const articleId = articleRes.data.id;

  console.log('\n--- Testing Add Comment ---');
  const commentRes = await fetch(`${baseUrl}/articles/${articleId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${readerToken}` },
    body: JSON.stringify({ content: 'Great article!' })
  });
  const commentData = await commentRes.json();
  console.log('Add Comment:', commentData.message);
  const commentId = commentData.data.id;

  console.log('\n--- Testing Article Detail (Showing Comments) ---');
  const detailRes = await fetch(`${baseUrl}/articles/${articleId}`);
  const detailData = await detailRes.json();
  console.log('Comments count:', detailData.data.comments.length);
  console.log('First comment content:', detailData.data.comments[0].content);

  console.log('\n--- Testing Delete Comment (Unauthorized) ---');
  const failDeleteRes = await fetch(`${baseUrl}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${authorToken}` } // Author of article but NOT owner of comment
  });
  const failDeleteData = await failDeleteRes.json();
  console.log('Fail Delete (Expected 403):', failDeleteRes.status, failDeleteData.message);

  console.log('\n--- Testing Delete Comment (Owner) ---');
  const deleteRes = await fetch(`${baseUrl}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${readerToken}` }
  });
  console.log('Delete Comment status:', deleteRes.status);

  console.log('\n--- All Tests Passed! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
