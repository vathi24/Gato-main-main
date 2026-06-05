// ============================================================
// chatService.js
// Script para manejar la funcionalidad del botón flotante de chat
// ============================================================

(function() {
    'use strict';

    // Función para inicializar el chat
    function initializeChat() {
        const chatButton = document.getElementById('chatButton');
        
        if (!chatButton) return;

        // Event listener para click
        chatButton.addEventListener('click', openChat);

        // Event listener para teclado (accesibilidad)
        chatButton.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openChat();
            }
        });
    }

    // Función para abrir el chat
    function openChat() {
        // Aquí puedes integrar un chatbot real como:
        // - Crisp Chat
        // - Intercom
        // - Freshchat
        // - Drift
        // - Etc.
        
        console.log('Chat abierto - Función disponible próximamente');
        alert('Chat de asistente - Función disponible próximamente\n\nAquí pronto tendrás acceso a un asistente 24/7 para ayudarte.');
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChat);
    } else {
        initializeChat();
    }

    // Exportar función para uso externo
    window.openChat = openChat;

})();
