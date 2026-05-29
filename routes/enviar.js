const path = require('path');

module.exports = (app) => {
    app.post('/enviar', (req, res) => {
        const { nombre, apellido, email, comentario } = req.body;
        console.log(`Datos recibidos: ${nombre} ${apellido} - ${email}`);
        // Redirigimos directamente al archivo estático /fenviado.html
        res.redirect('/fenviado.html');
    });

    // Servir /fenviado como página estática (archivo public/fenviado.html)
    app.get('/fenviado', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'fenviado.html'));
    });
};