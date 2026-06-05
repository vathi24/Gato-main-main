const { extraerTitulos } = require('../services/scrapingService');

module.exports = (app) => {
    // Ruta para registrar títulos extraídos automáticamente desde el cliente
    app.post('/api/registrar-titulos', (req, res) => {
        try {
            const titulos = req.body;

            console.log('📋 Títulos extraídos automáticamente:');
            console.log('URL:', titulos.url);
            console.log('Página:', titulos.pageTitle);
            console.log('H1:', titulos.h1.length > 0 ? titulos.h1 : 'Ninguno');
            console.log('H2:', titulos.h2.length > 0 ? titulos.h2 : 'Ninguno');
            console.log('---');

            res.status(200).json({
                success: true,
                message: 'Títulos registrados correctamente',
                titulosRecibidos: titulos
            });
        } catch (error) {
            console.error('Error en /api/registrar-titulos:', error);
            res.status(500).json({
                error: 'Error al registrar títulos',
                message: error.message
            });
        }
    });

    // Ruta para extraer títulos desde HTML enviado (POST)
    app.post('/api/extraer-titulos', async (req, res) => {
        try {
            const { html } = req.body;

            // Validar que se envió HTML
            if (!html || typeof html !== 'string') {
                return res.status(400).json({
                    error: 'Debe enviar HTML válido en el campo "html"'
                });
            }

            // Extraer títulos
            const titulos = await extraerTitulos(html);

            res.status(200).json({
                success: true,
                message: 'Títulos extraídos correctamente',
                data: titulos
            });
        } catch (error) {
            console.error('Error en /api/extraer-titulos:', error);
            res.status(500).json({
                error: 'Error al procesar el HTML',
                message: error.message
            });
        }
    });

    // Ruta para extraer títulos desde una URL (opcional, requiere otra librería como axios)
    app.get('/api/extraer-titulos-url', async (req, res) => {
        try {
            const { url } = req.query;

            if (!url) {
                return res.status(400).json({
                    error: 'Debe proporcionar una URL en el parámetro "url"'
                });
            }

            // Nota: para esta funcionalidad necesitarías axios o node-fetch
            res.status(501).json({
                error: 'Esta funcionalidad requiere una librería adicional',
                message: 'Instala axios para habilitar esta función: npm install axios'
            });
        } catch (error) {
            console.error('Error en /api/extraer-titulos-url:', error);
            res.status(500).json({
                error: 'Error al procesar la URL',
                message: error.message
            });
        }
    });
};
