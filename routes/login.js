module.exports = (app) => {
    app.post('/login', (req, res) => {
        const { usuario, clave } = req.body;

        if (usuario === 'admin' && clave === '1234') {
            // Si es correcto, creamos una cookie llamada 'usuarioLogueado' que dura 5 minutos
            res.cookie('usuarioLogueado', 'admin', { maxAge: 300000, httpOnly: true });
            // Redirigimos a la página estática /panel.html
            res.redirect('/panel.html');
        } else {
            res.status(401).send('<h1>Error</h1><p>Usuario o contraseña incorrectos.</p>');
        }
    });

    app.get('/perfil', (req, res) => {
        const usuario = req.cookies && req.cookies.usuarioLogueado;
        if (usuario) {
            // Si el usuario está autenticado, redirigimos a /panel.html
            res.redirect('/panel.html');
        } else {
            res.status(403).send('<h1>Acceso Denegado</h1><p>Debes iniciar sesión primero.</p>');
        }
    });
};