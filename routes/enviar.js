const path = require('path');

function validarContacto(req, res, next) {
    const { nombre, apellido, email, comentario } = req.body;
    if (!nombre || !apellido || !email || !comentario) {
        return res.status(400).sendFile(path.join(__dirname, '..', 'public', 'contacto-error.html'));
    }
    next();
}

module.exports = (app) => {
    app.post('/enviar', validarContacto, (req, res) => {
        const { nombre, apellido, email, comentario } = req.body;
        console.log(`Datos recibidos: ${nombre} ${apellido} - ${email}`);
        res.redirect('/fenviado.html');
    });

    app.get('/fenviado', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'fenviado.html'));
    });
};