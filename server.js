const http = require('http');

const PORT = process.env.PORT || 3000;
const requestLogs = [];
const MAX_LOGS = 100;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderHomePage = () => {
  const items = requestLogs
    .map((item, index) => {
      const prettyBody = item.body ? item.body : '(empty)';
      return `
        <article class="card">
          <h2>#${requestLogs.length - index} • ${escapeHtml(item.method)} ${escapeHtml(item.url)}</h2>
          <p><strong>Time:</strong> ${escapeHtml(item.timestamp)}</p>
          <details>
            <summary>Headers</summary>
            <pre>${escapeHtml(JSON.stringify(item.headers, null, 2))}</pre>
          </details>
          <details open>
            <summary>Body</summary>
            <pre>${escapeHtml(prettyBody)}</pre>
          </details>
        </article>
      `;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Request Monitor</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; background: #f7f8fa; color: #1f2937; }
    .header { margin-bottom: 16px; }
    .header p { margin: 4px 0; }
    .card { background: #fff; border-radius: 10px; padding: 14px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    pre { overflow-x: auto; background: #0f172a; color: #e2e8f0; padding: 10px; border-radius: 8px; }
    summary { cursor: pointer; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Request Monitor</h1>
    <p>Endpoint hiện tại: <code>https://test-xbxt.onrender.com/</code></p>
    <p>Tổng request đã lưu: <strong>${requestLogs.length}</strong> (giới hạn ${MAX_LOGS})</p>
  </div>
  ${items || '<p>Chưa có request nào được ghi nhận.</p>'}
</body>
</html>`;
};

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
      body: body || '',
    };

    requestLogs.unshift(requestInfo);
    if (requestLogs.length > MAX_LOGS) {
      requestLogs.pop();
    }

    console.log('Received request:');
    console.log(JSON.stringify(requestInfo, null, 2));

    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderHomePage());
      return;
    }

    if (req.url === '/requests') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ count: requestLogs.length, requests: requestLogs }, null, 2));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(
      JSON.stringify(
        {
          message: 'Request received successfully',
          request: requestInfo,
          dashboard: '/'
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
