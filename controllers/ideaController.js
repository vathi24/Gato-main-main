const path = require('path');

// ============================================================
// ideaController.js
// El controlador contiene la lógica principal de cada ruta.
// Solo se ejecuta si el middleware ya validó los datos.
// Su trabajo es procesar la información y enviar una respuesta
// al navegador del usuario.
// ============================================================

exports.registrarIdea = (req, res) => {
    const { nombre, departamento, idea } = req.body;

    // Validación de Negocio (Semana 9/10)
    if (departamento === 'Informática' && idea.length < 20) {
        return res.status(400).sendFile(path.join(__dirname, '..', 'public', 'idea-error.html'));
    }

    // Seguridad: Crear cookie de sesión (Semana 7)
    res.cookie('tokenSesion', 'ST-777', { maxAge: 600000, httpOnly: true });

    const nombreParam = encodeURIComponent(nombre);
    const departamentoParam = encodeURIComponent(departamento);
    res.redirect(`/idea-success.html?nombre=${nombreParam}&departamento=${departamentoParam}`);
};