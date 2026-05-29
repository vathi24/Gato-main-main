
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

enviarRoutes(app);
loginRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    console.log('Presiona Ctrl+C para detener el servidor.');
});

