const http = require('http');

// Function to make a GET request to the server
function checkEndpoint(endpoint, callback) {
  const options = {
    hostname: 'localhost',
    port: 5002,
    path: endpoint,
    method: 'GET',
    timeout: 5000 // 5 seconds timeout
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        callback(null, { statusCode: res.statusCode, data: jsonData });
      } catch (error) {
        callback(error, { statusCode: res.statusCode, data });
      }
    });
  });
  
  req.on('error', (error) => {
    callback(error);
  });
  
  req.on('timeout', () => {
    req.destroy();
    callback(new Error('Request timed out'));
  });
  
  req.end();
}

// Check health endpoint
console.log('Checking server health...');
checkEndpoint('/health', (error, result) => {
  if (error) {
    console.error('❌ Health check failed:', error.message);
    console.log('The server might not be running. Please start the server with "npm run dev" in the server directory.');
  } else {
    console.log(`✅ Health check: ${result.statusCode === 200 ? 'OK' : 'Failed'}`);
    console.log(result.data);
    
    // If health check passes, check the test endpoint
    console.log('\nChecking test endpoint...');
    checkEndpoint('/api/test', (error, result) => {
      if (error) {
        console.error('❌ Test endpoint check failed:', error.message);
      } else {
        console.log(`✅ Test endpoint: ${result.statusCode === 200 ? 'OK' : 'Failed'}`);
        console.log(result.data);
        
        // If test endpoint passes, check the database connection
        console.log('\nChecking database connection...');
        checkEndpoint('/api/test/db', (error, result) => {
          if (error) {
            console.error('❌ Database check failed:', error.message);
          } else {
            console.log(`✅ Database check: ${result.statusCode === 200 ? 'OK' : 'Failed'}`);
            console.log(result.data);
          }
        });
      }
    });
  }
});
