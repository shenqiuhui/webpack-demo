if (typeof window === 'undefined') {
  global.window = {};
}

const fs = require('fs');
const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server');
const templete = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8');
const data = require('./data.json');

const server = (port) => {
  const app = express();

  app.use(express.static('dist'));

  app.get('/search', (req, res) => {
    const html = renderMarkUp(renderToString(SSR));
    res.status(200).send(html);
  });

  app.listen(port, () => {
    console.log('Server is runnint on port:' + port);
  });
};

const renderMarkUp = (str) => {
  return templete.replace('<!--HTML_PLACEHOLDER-->', str)
    .replace('<!--INITITAL_DATA_PLACEHOLDER-->', '<script>window.__initital_data=' + JSON.stringify(data) + '</script>');
};

server(process.env.PORT || 3000);
