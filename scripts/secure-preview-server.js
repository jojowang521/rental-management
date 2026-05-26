const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 8866);
const host = process.env.HOST || '0.0.0.0';
const sessionCookieName = 'aui_access_session';
const sessionTtlMs = 8 * 60 * 60 * 1000;
const sessions = new Map();
loadLocalEnv();
const passwordHash = process.env.AUI_ACCESS_PASSWORD_HASH
  || (process.env.AUI_ACCESS_PASSWORD ? hash(process.env.AUI_ACCESS_PASSWORD) : '');

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function loadLocalEnv() {
  ['.env.local', '.env'].forEach(fileName => {
    const filePath = path.join(root, fileName);
    if (!fs.existsSync(filePath)) return;

    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index === -1) return;

      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    });
  });
}

function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header.split(';')
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => {
        const index = item.indexOf('=');
        if (index === -1) return [item, ''];
        return [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
      })
  );
}

function isAuthenticated(req) {
  const token = parseCookies(req.headers.cookie)[sessionCookieName];
  if (!token) return false;
  const expiresAt = sessions.get(token);
  if (!expiresAt || expiresAt <= Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(body);
}

function sendJson(res, statusCode, data, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(JSON.stringify(data));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024) {
        req.destroy();
        reject(new Error('Request body is too large.'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function loginPage(error = '') {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AI产品设计系统 - 访问验证</title>
  <style>
    :root {
      color-scheme: light;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      --blue: #1677ff;
      --blue-hover: #0958d9;
      --text: #171717;
      --muted: #777d87;
      --line: #d8dce3;
      --error: #d93025;
    }

    * { box-sizing: border-box; }

    html, body {
      width: 100%;
      min-height: 100%;
      margin: 0;
    }

    body {
      display: grid;
      place-items: center;
      min-height: 100vh;
      padding: 40px;
      color: var(--text);
      background: #fff;
      overflow: hidden;
    }

    .access-card {
      width: min(500px, calc(100vw - 32px));
      min-height: 0;
      background: #fff;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 11px;
      box-shadow: 0 18px 46px rgba(0, 0, 0, 0.11), 0 1px 0 rgba(255, 255, 255, 0.8) inset;
      padding: 42px;
    }

    .access-head {
      display: flex;
      align-items: center;
      gap: 13px;
      margin-bottom: 24px;
    }

    .access-logo {
      width: 42px;
      height: 42px;
      border-radius: 11px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      color: #fff;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0;
      background: linear-gradient(145deg, #2f7dff 0%, #12b4ff 100%);
      box-shadow: 0 12px 28px rgba(22, 119, 255, 0.26);
    }

    .access-title {
      margin: 0;
      font-size: 20px;
      line-height: 1.1;
      font-weight: 760;
      letter-spacing: 0;
    }

    .access-subtitle {
      margin: 7px 0 0;
      font-size: 14px;
      line-height: 1.35;
      color: var(--muted);
    }

    .access-form {
      display: grid;
      gap: 24px;
    }

    .access-input {
      width: 100%;
      height: 50px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 0 18px;
      color: var(--text);
      font-size: 16px;
      outline: none;
      transition: border-color 0.18s ease, box-shadow 0.18s ease;
    }

    .access-input::placeholder {
      color: #8e949c;
    }

    .access-input:focus {
      border-color: var(--blue);
      box-shadow: 0 0 0 4px rgba(22, 119, 255, 0.14);
    }

    .access-error {
      min-height: 16px;
      margin: -12px 0 -3px;
      color: var(--error);
      font-size: 11px;
      line-height: 1.5;
    }

    .access-error:empty {
      display: none;
    }

    .access-button {
      width: 100%;
      height: 41px;
      border: 0;
      border-radius: 6px;
      color: #fff;
      background: var(--blue);
      box-shadow: 0 14px 30px rgba(22, 119, 255, 0.24);
      cursor: pointer;
      font-size: 16px;
      font-weight: 520;
      letter-spacing: 0;
    }

    .access-button:hover {
      background: var(--blue-hover);
    }

    .access-button:disabled {
      cursor: wait;
      opacity: 0.72;
    }

    @media (max-width: 720px) {
      body {
        padding: 24px;
      }

      .access-card {
        width: 100%;
        min-height: auto;
        border-radius: 22px;
        padding: 42px 28px 34px;
      }

      .access-head {
        gap: 16px;
        margin-bottom: 42px;
      }

      .access-logo {
        width: 64px;
        height: 64px;
        border-radius: 18px;
        font-size: 25px;
      }

      .access-input {
        height: 68px;
        border-radius: 12px;
        padding: 0 18px;
      }

      .access-button {
        height: 60px;
        border-radius: 12px;
      }
    }
  </style>
</head>
<body>
  <main class="access-card" aria-label="访问验证">
    <section class="access-head">
      <div class="access-logo" aria-hidden="true">AI</div>
      <div>
        <h1 class="access-title">明源云投建营 AI 产品设计系统</h1>
        <p class="access-subtitle">访问验证</p>
      </div>
    </section>
    <form class="access-form" method="post" action="/auth/login">
      <input class="access-input" name="password" type="password" placeholder="请输入访问密码" autocomplete="current-password" autofocus />
      <div class="access-error" role="status">${error}</div>
      <button class="access-button" type="submit">确认</button>
    </form>
    <script>
      const form = document.querySelector('.access-form');
      const input = document.querySelector('.access-input');
      const error = document.querySelector('.access-error');
      const button = document.querySelector('.access-button');

      form.addEventListener('submit', async event => {
        event.preventDefault();
        error.textContent = '';
        button.disabled = true;
        try {
          const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ password: input.value })
          });
          if (response.ok) {
            window.location.href = '/index.html';
            return;
          }
          error.textContent = '访问密码不正确，请重新输入。';
          input.select();
        } catch {
          error.textContent = '验证失败，请稍后重试。';
        } finally {
          button.disabled = false;
        }
      });
    </script>
  </main>
</body>
</html>`;
}

function serveFile(req, res, pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const target = path.normalize(path.join(root, decodedPath === '/' ? 'index.html' : decodedPath));

  if (!target.startsWith(root)) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.readFile(target, (error, data) => {
    if (error) {
      send(res, error.code === 'ENOENT' ? 404 : 500, error.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType(target),
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8'
  };
  return types[extension] || 'application/octet-stream';
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);

  if (url.pathname === '/auth/login' && req.method === 'POST') {
    try {
      if (!passwordHash) {
        sendJson(res, 503, { ok: false });
        return;
      }

      const body = await readRequestBody(req);
      const params = new URLSearchParams(body);
      const submittedHash = hash(params.get('password') || '');

      if (!safeEqual(submittedHash, passwordHash)) {
        sendJson(res, 401, { ok: false });
        return;
      }

      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, Date.now() + sessionTtlMs);
      sendJson(res, 200, { ok: true }, {
        'Set-Cookie': `${sessionCookieName}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(sessionTtlMs / 1000)}`
      });
    } catch {
      sendJson(res, 400, { ok: false });
    }
    return;
  }

  if (url.pathname === '/auth/login') {
    send(res, 200, loginPage());
    return;
  }

  if (!isAuthenticated(req)) {
    send(res, 200, loginPage());
    return;
  }

  serveFile(req, res, url.pathname);
});

server.listen(port, host, () => {
  const displayHost = host === '0.0.0.0' ? '127.0.0.1' : host;
  console.log(`Secure preview server running at http://${displayHost}:${port}/index.html`);
  if (!passwordHash) {
    console.warn('Missing AUI_ACCESS_PASSWORD_HASH or AUI_ACCESS_PASSWORD. Login is disabled until a password is configured.');
  }
});
