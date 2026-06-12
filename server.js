// ============================================================
// server.js
// Este es el punto de entrada del servidor. Aquí arrancamos
// Express, configuramos los middlewares globales (como el
// manejo de formularios y cookies) y conectamos las rutas.
// Es el primer archivo que se ejecuta al iniciar el proyecto.
// ============================================================

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const ideaRoutes = require('./routes/ideaRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cheerioRoutes = require('./routes/cheerioRoutes');
const { registerChatSocket } = require('./socket/chatSocket');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', ideaRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', cheerioRoutes);

registerChatSocket(io);

// Manejador de rutas no encontradas (debe ir al final, después de todas las rutas)
// Si ninguna ruta anterior coincidió, Express llega aquí y devuelve la página 404
app.use((req, res) => {
    console.log(`Ruta que ingreso el usuario, no encontrada: ${req.method} ${req.url}`);
    res.status(404).sendFile(__dirname + '/public/404.html');
});

server.listen(PORT, () => {
    console.log("Unidad 3 - Programación Web - Backend");
    console.log(`Servidor en http://localhost:${PORT}`);
});