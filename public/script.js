const socket = io();

const chatFab = document.getElementById('chat-fab');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
const roomSelect = document.getElementById('room-select');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const emojiBtn = document.getElementById('emoji-btn');
const fileBtn = document.getElementById('file-btn');
const fileInput = document.getElementById('file-input');
const messagesLoader = document.getElementById('messages-loader');

let currentRoom = 'General';
let username = '';
let hasShownLoginSuccess = false;
let isLoadingMore = false;
let messagesOffset = 0;
let hasMoreMessages = true;
let emojiPicker = null;

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.15;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
  }
}

function showDesktopNotification(title, body) {
  if (!('Notification' in window)) {
    return;
  }
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/imagen.avif' });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

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

function openChat() {
  chatPanel.classList.remove('hidden');
  chatPanel.setAttribute('aria-hidden', 'false');
  chatFab.classList.add('hidden');
  messageInput.focus();
}

function closeChat() {
  chatPanel.classList.add('hidden');
  chatPanel.setAttribute('aria-hidden', 'true');
  chatFab.classList.remove('hidden');
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function getFileIcon(type) {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎬';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📄';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  if (type.includes('text') || type.includes('document')) return '📝';
  return '📎';
}

function renderMessage(message, isSystem = false) {
  const row = document.createElement('div');
  row.className = `message-item ${isSystem ? 'system' : ''} message-animate`;

  if (isSystem) {
    row.textContent = message.text;
  } else if (message.file) {
    const icon = getFileIcon(message.file.type);
    const isImage = message.file.type.startsWith('image/');
    row.innerHTML = `
      <div class="message-header">
        <strong>${message.user}</strong>
        <span class="message-time">${new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="message-file">
        <div class="file-info">
          <span class="file-icon">${icon}</span>
          <span class="file-name">${message.file.name}</span>
          <span class="file-size">${formatFileSize(message.file.size)}</span>
        </div>
        ${isImage ? `<img src="${message.file.url}" class="file-preview" alt="${message.file.name}" loading="lazy">` : ''}
        <a href="${message.file.url}" target="_blank" class="file-download">${isImage ? 'Ver imagen' : 'Descargar archivo'}</a>
      </div>
    `;
  } else {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    const hasOnlyEmoji = message.text && message.text.replace(emojiRegex, '').trim().length === 0 && message.text.match(emojiRegex);
    const emojiClass = hasOnlyEmoji && hasOnlyEmoji.length <= 3 ? ' message-emoji-only' : '';
    row.innerHTML = `
      <div class="message-header">
        <strong>${message.user}</strong>
        <span class="message-time">${new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="message-text${emojiClass}">${escapeHtml(message.text)}</div>
    `;
  }

  messageContainer.appendChild(row);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function setHistory(messages) {
  messageContainer.innerHTML = '<div class="messages-loader" id="messages-loader">Cargando mensajes anteriores...</div>';
  messagesOffset = messages.length;
  hasMoreMessages = messages.length >= 30;
  messages.forEach((msg) => {
    const row = document.createElement('div');
    row.className = 'message-item message-animate';
    if (msg.file) {
      const icon = getFileIcon(msg.file.type);
      const isImage = msg.file.type.startsWith('image/');
      row.innerHTML = `
        <div class="message-header">
          <strong>${msg.user}</strong>
          <span class="message-time">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="message-file">
          <div class="file-info">
            <span class="file-icon">${icon}</span>
            <span class="file-name">${msg.file.name}</span>
            <span class="file-size">${formatFileSize(msg.file.size)}</span>
          </div>
          ${isImage ? `<img src="${msg.file.url}" class="file-preview" alt="${msg.file.name}" loading="lazy">` : ''}
          <a href="${msg.file.url}" target="_blank" class="file-download">${isImage ? 'Ver imagen' : 'Descargar archivo'}</a>
        </div>
      `;
    } else {
      const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
      const hasOnlyEmoji = msg.text && msg.text.replace(emojiRegex, '').trim().length === 0 && msg.text.match(emojiRegex);
      const emojiClass = hasOnlyEmoji && hasOnlyEmoji.length <= 3 ? ' message-emoji-only' : '';
      row.innerHTML = `
        <div class="message-header">
          <strong>${msg.user}</strong>
          <span class="message-time">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="message-text${emojiClass}">${escapeHtml(msg.text)}</div>
      `;
    }
    messageContainer.appendChild(row);
  });
  updateLoaderVisibility();
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function updateLoaderVisibility() {
  const loader = document.getElementById('messages-loader');
  if (loader) {
    loader.style.display = hasMoreMessages ? 'flex' : 'none';
  }
}

function prependMessages(messages) {
  const loader = document.getElementById('messages-loader');
  const scrollTopBefore = messageContainer.scrollTop;
  const scrollHeightBefore = messageContainer.scrollHeight;

  messages.forEach((msg) => {
    const row = document.createElement('div');
    row.className = 'message-item message-animate';
    if (msg.file) {
      const icon = getFileIcon(msg.file.type);
      const isImage = msg.file.type.startsWith('image/');
      row.innerHTML = `
        <div class="message-header">
          <strong>${msg.user}</strong>
          <span class="message-time">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="message-file">
          <div class="file-info">
            <span class="file-icon">${icon}</span>
            <span class="file-name">${msg.file.name}</span>
            <span class="file-size">${formatFileSize(msg.file.size)}</span>
          </div>
          ${isImage ? `<img src="${msg.file.url}" class="file-preview" alt="${msg.file.name}" loading="lazy">` : ''}
          <a href="${msg.file.url}" target="_blank" class="file-download">${isImage ? 'Ver imagen' : 'Descargar archivo'}</a>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div class="message-header">
          <strong>${msg.user}</strong>
          <span class="message-time">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="message-text">${escapeHtml(msg.text)}</div>
      `;
    }
    messageContainer.insertBefore(row, loader ? loader.nextSibling : messageContainer.firstChild);
  });

  const scrollHeightAfter = messageContainer.scrollHeight;
  messageContainer.scrollTop = scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
  updateLoaderVisibility();
}

async function loadMoreMessages() {
  if (isLoadingMore || !hasMoreMessages) {
    return;
  }

  isLoadingMore = true;
  const loader = document.getElementById('messages-loader');
  if (loader) {
    loader.textContent = 'Cargando...';
    loader.classList.add('loading');
  }

  try {
    const response = await fetch(`/api/chat/messages/${encodeURIComponent(currentRoom)}?offset=${messagesOffset}&limit=30`);
    const data = await response.json();

    if (data.messages && data.messages.length > 0) {
      prependMessages(data.messages);
      messagesOffset += data.messages.length;
      hasMoreMessages = data.hasMore;
    } else {
      hasMoreMessages = false;
    }
  } catch (e) {
    hasMoreMessages = false;
  } finally {
    isLoadingMore = false;
    const loaderEl = document.getElementById('messages-loader');
    if (loaderEl) {
      loaderEl.textContent = 'Cargar mensajes anteriores';
      loaderEl.classList.remove('loading');
    }
    updateLoaderVisibility();
  }
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
  messageInput.focus();
});

messageContainer.addEventListener('scroll', () => {
  if (messageContainer.scrollTop < 80 && hasMoreMessages && !isLoadingMore) {
    loadMoreMessages();
  }
});

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    messageForm.dispatchEvent(new Event('submit'));
  }
});

const EMOJIS = ['😀','😃','😄','😁','😅','😂','🤣','😊','😇','🙂','😉','😌','😍','🥰','😘','😗','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🫢','🤫','🤔','😐','😑','😶','😏','😒','🙄','😬','😮','😯','😲','😳','🥺','😢','😭','😤','😡','🤬','😈','👿','💀','☠️','🤡','👹','👺','👻','👽','🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','💕','💞','💗','💖','💘','💝','💟','👍','👎','👊','✊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦵','🦶','👂','🦻','👃','🧠','🦷','👅','👁️','👀','🗣️','👤','👥','🫂','👶','🧒','👦','👧','🧑','👨','👩','🧔','👱','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','👮','🕵️','💂','🥷','👷','🤴','👸','👳','👲','🧕','🤵','👰','🤰','🫃','🫄','🤱','👼','🎅','🤶','🦸','🦹','🧙','🧚','🧛','🧜','🧝','🧞','🧟','🧌','💆','💇','🚶','🧍','🧎','🏃','💃','🕺','🕴️','👯','🧖','🧘','🛀','🛌','👭','👫','👬','💏','💑','👪','🗣️','👤','👥','🫂'];

let emojiPickerEl = null;
let emojiPickerVisible = false;

function createEmojiPicker() {
  if (emojiPickerEl) return;

  emojiPickerEl = document.createElement('div');
  emojiPickerEl.className = 'emoji-picker hidden';
  emojiPickerEl.innerHTML = EMOJIS.map(e => `<button type="button" class="emoji-option" data-emoji="${e}">${e}</button>`).join('');

  emojiPickerEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.emoji-option');
    if (!btn) return;
    const emoji = btn.dataset.emoji;
    const cursorPos = messageInput.selectionStart;
    const textBefore = messageInput.value.slice(0, cursorPos);
    const textAfter = messageInput.value.slice(cursorPos);
    messageInput.value = textBefore + emoji + textAfter;
    messageInput.selectionStart = messageInput.selectionEnd = cursorPos + emoji.length;
    messageInput.focus();
    hideEmojiPicker();
  });

  document.body.appendChild(emojiPickerEl);

  document.addEventListener('click', (e) => {
    if (emojiPickerVisible && !emojiPickerEl.contains(e.target) && e.target !== emojiBtn) {
      hideEmojiPicker();
    }
  });
}

function showEmojiPicker() {
  createEmojiPicker();
  const rect = emojiBtn.getBoundingClientRect();
  emojiPickerEl.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
  emojiPickerEl.style.left = Math.max(8, rect.left) + 'px';
  emojiPickerEl.classList.remove('hidden');
  emojiPickerVisible = true;
}

function hideEmojiPicker() {
  if (emojiPickerEl) {
    emojiPickerEl.classList.add('hidden');
    emojiPickerVisible = false;
  }
}

emojiBtn.addEventListener('click', () => {
  if (emojiPickerVisible) {
    hideEmojiPicker();
  } else {
    showEmojiPicker();
  }
});

fileBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    if (typeof Swal !== 'undefined') {
      await Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'El archivo excede el límite de 10 MB.',
      });
    } else {
      alert('El archivo excede el límite de 10 MB.');
    }
    fileInput.value = '';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  fileBtn.disabled = true;
  fileBtn.textContent = '⏳';

  try {
    const response = await fetch('/api/chat/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir archivo');
    }

    const data = await response.json();

    socket.emit('sendFileMessage', { file: data.file });
  } catch (e) {
    if (typeof Swal !== 'undefined') {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo subir el archivo. Intenta de nuevo.',
      });
    } else {
      alert('No se pudo subir el archivo.');
    }
  } finally {
    fileBtn.disabled = false;
    fileBtn.textContent = '📎';
    fileInput.value = '';
  }
});

socket.on('roomHistory', ({ messages, total, hasMore }) => {
  setHistory(messages);
  messagesOffset = messages.length;
  hasMoreMessages = hasMore;
});

socket.on('message', (message) => {
  if (message.room === currentRoom) {
    renderMessage(message);
  }
  if (message.user !== username) {
    playNotificationSound();
    showDesktopNotification(
      `${message.user} dice:`,
      message.file ? `Compartió un archivo: ${message.file.name}` : (message.text || '')
    );
  }
});

socket.on('systemMessage', (message) => {
  if (message.room === currentRoom) {
    renderMessage(message, true);
  }
});

socket.on('notification', (data) => {
  if (data.type === 'join') {
    playNotificationSound();
    showDesktopNotification('Nuevo usuario', data.text);
  }
});

loadRooms().catch(() => {
  renderMessage({ text: 'No se pudieron cargar las salas. Revisa el servidor.' }, true);
});
