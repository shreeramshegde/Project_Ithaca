const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ status: 'error', message: 'Missing or invalid Basic Auth header' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [username, password] = credentials.split(':');

  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'admin';

  if (username === expectedUser && password === expectedPass) {
    next();
  } else {
    return res.status(401).json({ status: 'error', message: 'Unauthorized admin credentials' });
  }
};

module.exports = adminMiddleware;
