const fs = require('fs');
const path = require('path');

// Path to index.ts (or compiled index.js)
const indexFilePath = path.join(__dirname, 'src', 'index.ts');

// Read the file content
fs.readFile(indexFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Modify the MongoDB connection code to make it conditional
  let newData = data.replace(
    /\/\/ Connect to MongoDB[\s\S]*?process\.exit\(1\);[\s\S]*?\}\);/,
    `// Connect to MongoDB (if enabled)
if (process.env.USE_MONGODB !== 'false') {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tradechampionx';
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.log('Continuing without MongoDB...');
    });
} else {
  console.log('MongoDB is disabled by configuration. Using SQLite only.');
}`
  );

  // Write the modified content back to the file
  fs.writeFile(indexFilePath, newData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully updated the server code to make MongoDB optional.');
  });
}); 