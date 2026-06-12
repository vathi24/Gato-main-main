const socket = io();

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
        autocomplete: null,
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

function openChat() {
    chatPanel.classList.remove('hidden');
    chatPanel.setAttribute('aria-hidden', 'false');
    chatFab.classList.add('hidden');
}

function closeChat() {
    chatPanel.classList.add('hidden');
    chatPanel.setAttribute('aria-hidden', 'true');
    chatFab.classList.remove('hidden');
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

chatClose.addEventListener('click', closeChat);

roomSelect.addEventListener('change', (event) => {
    joinRoom(event.target.value);
});

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = messageInput.value.trim();

    if (!text) {
        return;
    }

    socket.emit('sendMessage', { text });
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

loadRooms().catch(() => {
    renderMessage({ text: 'No se pudieron cargar las salas. Revisa el servidor.' }, true);
});
