// generateData.js
// Generate sample user data and write it to users.json

const fs = require('fs');

// Sample users array (at least 5)
const users = [
  { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice.smith@example.com', age: 30 },
  { id: 2, firstName: 'Bob', lastName: 'Johnson', email: 'bob.j@example.com', age: 24 },
  { id: 3, firstName: 'Carol', lastName: 'Davis', email: 'carol.davis@example.com', age: 28 },
  { id: 4, firstName: 'David', lastName: 'Miller', email: 'david.miller@example.com', age: 35 },
  { id: 5, firstName: 'Eve', lastName: 'Wilson', email: 'eve.wilson@example.com', age: 22 }
];

// Write JSON to users.json (pretty-printed with 2 spaces)
fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('Sample user data written to users.json');
});