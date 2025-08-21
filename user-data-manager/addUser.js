// addUser.js
// Read users.json, add a new user, and write it back

const fs = require('fs');

// New user to add (ensure a unique id)
const newUser = {
  id: Date.now(),              // simple unique id for demo purposes
  firstName: 'Frank',
  lastName: 'Taylor',
  email: 'frank.taylor@example.com',
  age: 27
};

fs.readFile('users.json', 'utf8', (readErr, data) => {
  if (readErr) {
    console.error('Error reading file:', readErr);
    return;
  }

  try {
    const users = data ? JSON.parse(data) : [];

    // ensure id uniqueness if your initial data is small and ids are numeric
    // const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
    // newUser.id = maxId + 1;

    users.push(newUser);

    fs.writeFile('users.json', JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing file:', writeErr);
        return;
      }
      console.log('New user added to users.json:', newUser);
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});