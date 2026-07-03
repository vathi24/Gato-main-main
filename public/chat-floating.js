// Esperar a que el DOM y socket.io estén disponibles
document.addEventListener('DOMContentLoaded', function() {
    // Si script.js está cargado, él maneja todo el chat (más completo)
    if (Array.from(document.querySelectorAll('script[src]')).some(s => s.src.includes('script.js'))) {
        return;
    }

    // Esperar a que socket.io esté disponible
    let attempts = 0;
    const maxAttempts = 50;
    
    const initChatWhenReady = setInterval(function() {
        if (typeof io !== 'undefined') {
            clearInterval(initChatWhenReady);
            console.log('socket.io cargado, inicializando chat');
            initChat();
            return;
        }
        attempts++;
        if (attempts >= maxAttempts) {
            clearInterval(initChatWhenReady);
            console.error('Socket.io no se cargó después de 5 segundos');
        }
    }, 100);
});

function initChat() {
    const socket = io();
    let currentSocketId = null;

    // Obtener el socket ID del cliente actual
    socket.on('connect', () => {
        currentSocketId = socket.id;
        console.log('Socket conectado:', currentSocketId);
    });

    const chatFab = document.getElementById('chat-fab');
    const chatPanel = document.getElementById('chat-panel');
    const chatClose = document.getElementById('chat-close');
    const roomSelect = document.getElementById('room-select');
    const messageContainer = document.getElementById('message-container');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');

    let currentRoom = 'General';
    let username = '';
    let hasShownLoginSuccess = false;
    let typingTimeout;
    const typingUsers = new Set();

    async function requestUsername() {
        if (username) {
            return username;
        }

        if (typeof Swal === 'undefined') {
            username = (window.prompt('Ingresa tu nombre:', 'Invitado') || 'Invitado').trim() || 'Invitado';
            return username;
        }

        const result = await Swal.fire({
            title: 'Bienvenido al chat',
            input: 'text',
            inputLabel: 'Nombre de usuario',
            inputPlaceholder: 'Ej: Maria',
            inputValue: '',
            allowOutsideClick: false,
            confirmButtonText: 'Entrar al chat',
            inputValidator: (value) => {
                if (!value || !value.trim()) {
                    return 'Debes ingresar un nombre';
                }
                return null;
            },
        });

        username = (result.value || 'Invitado').trim() || 'Invitado';
        return username;
    }

    async function closeChat() {
        if (chatPanel.classList.contains('hidden')) return;
        const text = messageInput?.value.trim();
        if (text && typeof Swal !== 'undefined') {
            const result = await Swal.fire({
                title: '¿Cerrar chat?',
                text: 'Tienes un mensaje sin enviar. ¿Estás seguro de cerrar el chat?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, cerrar',
                cancelButtonText: 'Cancelar',
            });
            if (!result.isConfirmed) return;
        }
        chatPanel.classList.add('hidden');
        chatPanel.setAttribute('aria-hidden', 'true');
        chatPanel.removeAttribute('inert');
        chatFab.classList.remove('hidden');
    }

    function openChat() {
        chatPanel.classList.remove('hidden');
        chatPanel.removeAttribute('aria-hidden');
        chatPanel.removeAttribute('inert');
        chatFab.classList.add('hidden');
    }

    function renderMessage(message, isSystem = false) {
        const row = document.createElement('div');
        row.className = `message-item ${isSystem ? 'system' : ''}`;

        if (isSystem) {
            row.textContent = message.text;
        } else {
            row.innerHTML = `<strong>${message.user}:</strong> ${message.text}`;
        }

        messageContainer.appendChild(row);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    function setHistory(messages) {
        messageContainer.innerHTML = '';
        messages.forEach((msg) => renderMessage(msg));
    }

    async function loadRooms() {
        const response = await fetch('/api/chat/rooms');
        const data = await response.json();

        roomSelect.innerHTML = '';
        data.rooms.forEach((room) => {
            const option = document.createElement('option');
            option.value = room;
            option.textContent = room;
            roomSelect.appendChild(option);
        });

        if (!data.rooms.includes(currentRoom)) {
            currentRoom = data.rooms[0] || 'General';
        }

        roomSelect.value = currentRoom;
    }

    function joinRoom(room) {
        currentRoom = room;
        socket.emit('joinRoom', { room: currentRoom, username });
    }

    chatFab.addEventListener('click', async () => {
        await requestUsername();
        openChat();
        joinRoom(currentRoom);

        if (!hasShownLoginSuccess && typeof Swal !== 'undefined') {
            await Swal.fire({
                icon: 'success',
                title: 'Sesion iniciada',
                text: `Has iniciado sesion con el nick de: "${username}"`,
                confirmButtonText: 'Continuar',
            });
            hasShownLoginSuccess = true;
        }
    });

    roomSelect.addEventListener('change', (event) => {
        joinRoom(event.target.value);
    });

    messageInput.addEventListener('input', () => {
        console.log('Typing event emitted:', { room: currentRoom, user: username });
        socket.emit('userTyping', { room: currentRoom, user: username });
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            console.log('Stopped typing event emitted:', { room: currentRoom, user: username });
            socket.emit('userStoppedTyping', { room: currentRoom, user: username });
        }, 2000);
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = messageInput.value.trim();

        if (!text) {
            return;
        }

        socket.emit('sendMessage', { text });
        clearTimeout(typingTimeout);
        socket.emit('userStoppedTyping', { room: currentRoom, user: username });
        messageInput.value = '';
    });

    socket.on('roomHistory', ({ messages }) => {
        setHistory(messages);
    });

    socket.on('message', (message) => {
        if (message.room === currentRoom) {
            renderMessage(message);
        }
    });

    socket.on('systemMessage', (message) => {
        if (message.room === currentRoom) {
            renderMessage(message, true);
        }
    });

    socket.on('userTyping', ({ user, socketId }) => {
        console.log('User typing received:', user, 'Current user:', username, 'Socket:', socketId, 'Current socket:', currentSocketId);
        if (socketId !== currentSocketId && !typingUsers.has(socketId)) {
            typingUsers.add(socketId);
            // Almacenar también el nombre del usuario para mostrar
            if (!window.typingUserNames) window.typingUserNames = {};
            window.typingUserNames[socketId] = user;
            renderTypingIndicator();
        }
    });

    socket.on('userStoppedTyping', ({ socketId }) => {
        console.log('User stopped typing:', socketId);
        typingUsers.delete(socketId);
        if (window.typingUserNames) delete window.typingUserNames[socketId];
        renderTypingIndicator();
    });

    function renderTypingIndicator() {
        const existingIndicator = document.getElementById('typing-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        if (typingUsers.size > 0) {
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typing-indicator';
            typingDiv.className = 'message-item typing-indicator';
            const usersList = Array.from(typingUsers)
                .map(socketId => (window.typingUserNames && window.typingUserNames[socketId]) || 'Usuario')
                .join(', ');
            typingDiv.textContent = `${usersList} está escribiendo...`;
            messageContainer.appendChild(typingDiv);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }

    loadRooms().catch(() => {
        renderMessage({ text: 'No se pudieron cargar las salas. Revisa el servidor.' }, true);
    });
}
