# 🐱 Gato - Aplicación Web Interactiva

**Gato** es una aplicación web full-stack construida con **Node.js y Express.js** que proporciona funcionalidades avanzadas de comunicación en tiempo real, gestión de ideas y web scraping. El proyecto implementa una arquitectura MVC (Modelo-Vista-Controlador) bien estructurada con APIs RESTful y comunicación mediante WebSockets.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Instalación y Ejecución](#instalación-y-ejecución)
6. [Funcionalidades Principales](#funcionalidades-principales)
7. [Guía de Endpoints](#guía-de-endpoints)
8. [Flujo de Datos](#flujo-de-datos)
9. [Configuración y Customización](#configuración-y-customización)
10. [Créditos](#créditos)

---

## 📌 Descripción General

**Gato** es una plataforma que integra múltiples módulos interconectados:

- **Chat en Tiempo Real**: Sistema de salas de chat con WebSockets (Socket.IO) para mensajería instantánea con otros usuarios
- **Gestión de Ideas**: Formulario para registrar y validar ideas de usuarios con almacenamiento persistente
- **Web Scraping**: Herramienta para extraer información de sitios web (títulos, contenido, etc.) usando Cheerio
- **Autenticación**: Sistema de login básico con gestión de cookies
- **Gestor de Archivos**: Carga y almacenamiento de archivos con validación de tamaño

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución JavaScript del lado servidor
- **Express.js v5.2.1**: Framework web minimalista y flexible
- **Socket.IO v4.7.0**: Librería para comunicación bidireccional en tiempo real
- **Cheerio v1.2.0**: Parser HTML/XML similar a jQuery para web scraping
- **Multer v1.4.5**: Middleware para manejo de carga de archivos
- **Cookie-parser v1.4.7**: Middleware para parsear cookies

### Frontend
- **HTML5 Semántico**: Estructura y accesibilidad mejorada
- **CSS3 Flexbox**: Diseño responsive y flexible
- **JavaScript Vanilla**: Interactividad sin dependencias externas
- **Socket.IO Client**: Conexión a WebSockets desde el navegador

### Persistencia
- **JSON**: Base de datos simple basada en archivos (chat-db.json)

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue el patrón **MVC (Modelo-Vista-Controlador)** complementado con una capa de servicios:

```
┌─────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN        │
│     (public/ - HTML, CSS, JS)       │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│       CAPA DE ENRUTAMIENTO          │
│     (routes/ - Definición URLs)     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  CAPA DE CONTROLADORES (Controllers)│
│     (Lógica de peticiones HTTP)     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   CAPA DE SERVICIOS (Services)      │
│  (Lógica de negocio y procesamiento)│
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│         CAPA DE DATOS               │
│    (database/, data/ - JSON files)  │
└─────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
Gato-main-main/
│
├── 📄 server.js                    # Punto de entrada principal del servidor
├── 📄 package.json                 # Configuración del proyecto y dependencias
├── 📄 README.md                    # Documentación del proyecto
│
├── 📂 public/                      # Archivos estáticos (interfaz del usuario)
│   ├── index.html                  # Página principal
│   ├── panel.html                  # Panel de control
│   ├── 404.html                    # Página de error 404
│   ├── idea-success.html           # Página de éxito al enviar idea
│   ├── idea-error.html             # Página de error en ideas
│   ├── fenviado.html               # Página de contacto enviado
│   ├── contacto-error.html         # Página de error contacto
│   ├── style.css                   # Estilos principales
│   ├── panel.css                   # Estilos del panel
│   ├── chat.css                    # Estilos del chat
│   ├── 404.css                     # Estilos de error 404
│   ├── fenviado.css                # Estilos de envío completado
│   ├── script.js                   # Lógica de la interfaz principal
│   ├── chat-floating.js            # Widget flotante de chat
│   ├── titulo-extractor.js         # Herramienta para extraer títulos
│   └── imagen.avif                 # Imagen del proyecto
│
├── 📂 routes/                      # Definición de rutas y endpoints
│   ├── ideaRoutes.js               # Rutas para gestión de ideas
│   ├── chatRoutes.js               # Rutas para el chat
│   ├── cheerioRoutes.js            # Rutas para web scraping
│   ├── enviar.js                   # Rutas para envío de formularios
│   ├── login.js                    # Rutas de autenticación
│   └── scraping.js                 # Rutas de scraping avanzado
│
├── 📂 controllers/                 # Lógica de procesamiento
│   ├── ideaController.js           # Controlador de ideas
│   ├── chatController.js           # Controlador de chat
│   └── cheerioController.js        # Controlador de scraping
│
├── 📂 services/                    # Lógica de negocio
│   ├── chatService.js              # Servicios de chat
│   └── scrapingService.js          # Servicios de web scraping
│
├── 📂 socket/                      # WebSockets (comunicación en tiempo real)
│   └── chatSocket.js               # Manejador de eventos Socket.IO
│
├── 📂 middleware/                  # Funciones de filtrado
│   └── ideaMiddlewares.js          # Validaciones de ideas
│
├── 📂 database/                    # Configuración de base de datos
│   └── db.js                       # Conexiones y queries
│
└── 📂 data/                        # Almacenamiento de datos
    └── chat-db.json                # Base de datos de mensajes de chat
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- **Node.js** v14 o superior
- **npm** (incluido con Node.js)

### Pasos de Instalación

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/vathi24/Gato.git
cd Gato
```

#### 2. Instalar Dependencias
```bash
npm install
```

Este comando instala todas las dependencias listadas en `package.json`:
- `express` - Framework web
- `socket.io` - WebSockets
- `cheerio` - Web scraping
- `cookie-parser` - Gestión de cookies
- `multer` - Carga de archivos

#### 3. Ejecutar el Servidor
```bash
npm start
```

O directamente:
```bash
node server.js
```

#### 4. Acceder a la Aplicación
Abre tu navegador en:
```
http://localhost:3000
```

**Nota:** El puerto por defecto es **3000**, pero se puede cambiar configurando la variable de entorno `PORT`:
```bash
set PORT=8080    # Windows
export PORT=8080 # Linux/Mac
npm start
```

---

## ✨ Funcionalidades Principales

### 1. **Chat en Tiempo Real** 💬
Sistema de salas de chat con comunicación instantánea usando WebSockets.

**Características:**
- Crear múltiples salas de chat
- Unirse a salas existentes
- Mensajería instantánea con notificaciones
- Historial de mensajes (últimos 30 por defecto)
- Carga de archivos en el chat
- Notificaciones de entrada/salida de usuarios
- Mensajes del sistema

**Endpoints:**
```
GET  /api/chat/rooms                  # Listar todas las salas
POST /api/chat/rooms                  # Crear nueva sala
GET  /api/chat/messages/:room         # Obtener historial de mensajes
POST /api/chat/upload                 # Subir archivo al chat
```

**Eventos WebSocket:**
```javascript
socket.emit('joinRoom', { room: 'General', username: 'Juan' })
socket.on('roomHistory', (data) => { /* historial */ })
socket.on('newMessage', (message) => { /* nuevo mensaje */ })
socket.on('notification', (data) => { /* notificaciones */ })
```

---

### 2. **Gestión de Ideas** 💡
Formulario para que usuarios registren sus ideas con validación automática.

**Características:**
- Validación de campos obligatorios
- Almacenamiento persistente en JSON
- Feedback visual (éxito/error)
- Campos validados:
  - Título (obligatorio, mín. 5 caracteres)
  - Descripción (obligatorio, mín. 20 caracteres)
  - Categoría (obligatorio)
  - Email (formato válido)

**Endpoints:**
```
POST /api/registrar-idea              # Registrar nueva idea
```

**Validación (Middleware):**
```javascript
// Los campos se validan automáticamente antes de guardar
router.post('/registrar-idea', 
  ideaMiddlewares.validarCampos,      // Validación
  ideaController.registrarIdea        // Procesamiento
);
```

---

### 3. **Web Scraping** 🕷️
Herramienta para extraer información de sitios web.

**Características:**
- Extracción de títulos (h1, h2, h3, etc.)
- Extracción del título de la página
- Parsing HTML con Cheerio
- Manejo de URLs externas

**Endpoints:**
```
POST /scraping                        # Realizar scraping en URL
POST /api/extract-titles              # Extraer títulos de HTML
```

**Servicios de Scraping:**
```javascript
exports.extraerTitulos(htmlContent)   # Extrae todos los títulos
```

---

### 4. **Autenticación** 🔐
Sistema básico de login con gestión de sesiones.

**Características:**
- Validación de credenciales
- Gestión de cookies
- Sesiones de usuario

**Endpoints:**
```
POST /login                           # Iniciar sesión
```

---

### 5. **Carga de Archivos** 📁
Sistema de carga con validación de tamaño y tipo.

**Características:**
- Máximo 10 MB por archivo
- Nombres únicos generados automáticamente
- Almacenamiento en carpeta `/uploads`
- Respuesta con URL de acceso

**Endpoint:**
```
POST /api/chat/upload                 # Subir archivo
```

---

## 📡 Guía de Endpoints

### Chat API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/chat/rooms` | Obtiene lista de todas las salas |
| POST | `/api/chat/rooms` | Crea una nueva sala |
| GET | `/api/chat/messages/:room` | Obtiene mensajes de una sala |
| POST | `/api/chat/upload` | Sube un archivo al chat |

**Ejemplo - Crear Sala:**
```bash
curl -X POST http://localhost:3000/api/chat/rooms \
  -H "Content-Type: application/json" \
  -d '{"room": "Desarrollo"}'
```

**Respuesta:**
```json
{
  "room": "Desarrollo"
}
```

---

### Ideas API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/registrar-idea` | Registra una nueva idea |

**Ejemplo - Registrar Idea:**
```bash
curl -X POST http://localhost:3000/api/registrar-idea \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "titulo=Mi%20Idea&descripcion=Una%20descripcion%20detallada&categoria=Tecnologia&email=usuario@example.com"
```

---

### Web Scraping

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/extract-titles` | Extrae títulos de HTML |
| POST | `/scraping` | Realiza scraping en URL |

---

## 🔄 Flujo de Datos

### 1. Flujo de Chat en Tiempo Real

```
Usuario 1 (Cliente)
    │
    ├─► Socket.IO Connection
    │       │
    │       ├─► socket.emit('joinRoom')
    │       │
    │       └─► server escucha en registerChatSocket()
    │           ├─► chatService.createRoom()
    │           ├─► socket.join(room)
    │           ├─► Emite 'roomHistory' (últimos 30 mensajes)
    │           └─► Notifica otros usuarios
    │
    ├─► socket.emit('sendMessage')
    │   └─► Broadcast a todos en la sala
    │
    └─► socket.emit('disconnect')
        └─► Notifica salida de usuario
```

### 2. Flujo de Petición HTTP (Idea)

```
Cliente (Formulario HTML)
    │
    ├─► POST /api/registrar-idea
    │   (Datos del formulario)
    │
    ├─► ideaMiddlewares.validarCampos
    │   ├─► Valida campos obligatorios
    │   └─► Retorna error si falta algo
    │
    ├─► ideaController.registrarIdea
    │   ├─► Procesa los datos
    │   └─► Llama al servicio
    │
    ├─► ideaService.guardarIdea()
    │   └─► Escribe en chat-db.json
    │
    └─► Respuesta al cliente
        ├─► Éxito: Redirige a idea-success.html
        └─► Error: Redirige a idea-error.html
```

### 3. Flujo de Web Scraping

```
Cliente
    │
    ├─► POST /scraping o /api/extract-titles
    │   (URL o HTML content)
    │
    ├─► cheerioController
    │   └─► scrapingService.extraerTitulos()
    │
    ├─► Cheerio Parser
    │   ├─► Carga el HTML
    │   ├─► Busca todos los headings
    │   └─► Extrae contenido
    │
    └─► Respuesta JSON
        └─► Títulos organizados por nivel (h1, h2, h3...)
```

---

## ⚙️ Configuración y Customización

### Cambiar Puerto del Servidor
Edita `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Cambiar 3000 a otro puerto
```

### Aumentar Límite de Subida de Archivos
En `server.js`, modificar:
```javascript
limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB (cambiar número)
```

### Cambiar Límite de Mensajes en Historial
En `controllers/chatController.js`:
```javascript
const limit = parseInt(req.query.limit) || 30; // Cambiar 30
```

### Agregar Nueva Ruta
1. Crear archivo en `routes/nuevaRuta.js`
2. Registrar en `server.js`:
```javascript
const nuevaRuta = require('./routes/nuevaRuta');
app.use('/api', nuevaRuta);
```

### Agregar Validación Personalizada
1. Crear función en `middleware/ideaMiddlewares.js`
2. Usar en la ruta:
```javascript
router.post('/endpoint', miMiddleware, controlador);
```

---

## 📊 Variables de Entorno

Por defecto:
- **PORT**: 3000 (HTTP y WebSocket)
- **NODE_ENV**: development

Para producción, crear archivo `.env`:
```
PORT=8080
NODE_ENV=production
```

---

## 🐛 Troubleshooting

### Error: "Port already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Error: "Module not found"
```bash
npm install
```

### Chat no funciona en tiempo real
- Verificar que Socket.IO está conectado en la consola del navegador
- Comprobar en DevTools → Network → WS

### Archivos no se suben
- Verificar permisos de la carpeta `/uploads`
- Comprobar tamaño del archivo (máx. 10 MB)

---

## 📝 Información del Proyecto

- **Versión**: 1.0.0
- **Licencia**: ISC
- **Repositorio**: [GitHub - Gato](https://github.com/vathi24/Gato)

---

## 👨‍💻 Autor

- **Nombre:** Bastian Morales
- **Carrera:** Ingeniería en Informática / Analista Programador
- **Docente:** Bruno Otárola

---

## 📖 Recursos Útiles

- [Express.js Documentation](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/)
- [Cheerio Documentation](https://cheerio.js.org/)
- [Node.js Official](https://nodejs.org/)

---

**¡Gracias por usar Gato! 🐱**
