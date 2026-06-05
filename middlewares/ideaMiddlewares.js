// ============================================================
// ideaMiddlewares.js
// Los middlewares son funciones que se ejecutan ANTES de que
// la solicitud llegue al controlador. Sirven para revisar,
// validar o transformar los datos que envía el usuario.
// En este caso, verificamos que el formulario venga completo.
// ============================================================

// Middleware: validar que todos los campos del formulario estén llenos
exports.validadcampos = (req, res, next) => {
    // Extraemos los campos del cuerpo de la solicitud (formulario)
    const { nombre, apellido, email, comentario } = req.body;

    // Si algún campo está vacío o no fue enviado, rechazamos la solicitud
    if (!nombre || !apellido || !email || !comentario) {
        return res.status(400).send(
            "<h1>Error de validación</h1><p>Todos los campos del formulario son obligatorios.</p>"
        );
    }

    // Si todo está bien, llamamos a next() para pasar al controlador
    next();
};
