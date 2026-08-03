const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  const senhaCorreta = process.env.ADMIN_PASSWORD;

  if (!senhaCorreta) {
    res.status(500).send('Senha de admin não configurada no servidor.');
    return;
  }

  const auth = req.headers.authorization;
  const esperado = 'Basic ' + Buffer.from('admin:' + senhaCorreta).toString('base64');

  if (!auth || auth !== esperado) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Acesso restrito - DiiH Keys"');
    res.status(401).send('Acesso negado. Digite a senha.');
    return;
  }

  // Senha correta: libera a página admin de verdade
  const filePath = path.join(__dirname, '..', 'admin-panel.html');
  const html = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
};
