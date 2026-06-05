
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Registrar rutas (cada archivo exporta una función que recibe `app`)
const enviarRoutes = require('./routes/enviar');
const loginRoutes = require('./routes/login');
const scrapingRoutes = require('./routes/scraping');

enviarRoutes(app);
loginRoutes(app);
scrapingRoutes(app);

// Middleware para manejar rutas no encontradas (debe estar al final)
app.use((req, res) => {
    console.log(`Ruta que ingreso el usuario, no encontrada: ${req.method} ${req.url}`);
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'), (err) => {
        if (err) {
            res.status(404).send('<h1>404 - Página no encontrada</h1>');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    console.log('Presiona Ctrl+C para detener el servidor.');
});


