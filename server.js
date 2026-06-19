// ============================================================
// server.js
// Este es el punto de entrada del servidor. Aquí arrancamos
// Express, configuramos los middlewares globales (como el
// manejo de formularios y cookies) y conectamos las rutas.
// Es el primer archivo que se ejecuta al iniciar el proyecto.
// ============================================================

const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { Server } = require('socket.io');

const ideaRoutes = require('./routes/ideaRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cheerioRoutes = require('./routes/cheerioRoutes');
const enviarRoutes = require('./routes/enviar');
const loginRoutes = require('./routes/login');
const scrapingRoutes = require('./routes/scraping');
const { registerChatSocket } = require('./socket/chatSocket');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
const chatUpload = upload.single('file');

app.use('/api', ideaRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', cheerioRoutes);

registerChatSocket(io);

enviarRoutes(app);
loginRoutes(app);
scrapingRoutes(app);

app.post('/api/chat/upload', (req, res, next) => {
  chatUpload(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'El archivo excede el límite de 10 MB.'
        : 'Error al subir el archivo.';
      return res.status(400).json({ error: message });
    }
    next();
  });
}, require('./controllers/chatController').uploadFile);

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