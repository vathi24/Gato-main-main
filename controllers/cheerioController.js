const fs = require('fs/promises');
const path = require('path');
const scrapingService = require('../services/scrapingService');

async function readLocalHomePageHtml() {
  const indexPath = path.join(__dirname, '..', 'public', 'index.html');
  return fs.readFile(indexPath, 'utf-8');
}

exports.procesarConCheerio = async (req, res) => {
  try {
    const { url } = req.query;
    let html;
    let source;

    if (url) {
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(400).json({
          error: 'No se pudo descargar la URL indicada.',
          status: response.status,
        });
      }

      html = await response.text();
      source = `url:${url}`;
    } else {
      html = await readLocalHomePageHtml();
      source = 'local:public/index.html';
    }

    const analysis = await scrapingService.procesarHtmlEjemplo(html);

    return res.json({
      ok: true,
      source,
      analysis,
      howToUse: {
        local: '/api/cheerio',
        remote: '/api/cheerio?url=https://example.com',
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Error al procesar HTML con Cheerio.',
      detail: error.message,
    });
  }
};
