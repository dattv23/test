const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const requestInfo = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: body || null,
    };

    console.log('Received request:');
    console.log(JSON.stringify(requestInfo, null, 2));

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(
      JSON.stringify(
        {
          message: 'Request received successfully',
          request: requestInfo,
        },
        null,
        2,
      ),
    );
  });

  req.on('error', (error) => {
    console.error('Request stream error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Failed to read request body' }));
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
