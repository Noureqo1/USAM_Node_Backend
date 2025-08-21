// readData.js
// Read users.json, parse JSON, and display selected fields

const fs = require('fs');

fs.readFile('users.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    const users = JSON.parse(data);
    console.log('--- All Users ---');
    users.forEach((user) => {
      console.log(`Name: ${user.firstName} ${user.lastName}, Email: ${user.email}`);
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});