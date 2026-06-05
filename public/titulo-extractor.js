// ============================================================
// titulo-extractor.js
// Script que extrae automáticamente todos los títulos (h1-h6)
// de la página que está viendo el usuario
// ============================================================

(function() {
    'use strict';

    // Función para extraer títulos de la página actual
    function extraerTitulosActuales() {
        const titulos = {
            pageTitle: document.title || 'Sin título',
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: [],
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        // Extraer cada tipo de heading
        document.querySelectorAll('h1').forEach(el => {
            const texto = el.textContent.trim();
            if (texto) titulos.h1.push(texto);
        });

        document.querySelectorAll('h2').forEach(el => {
            const texto = el.textContent.trim();
            if (texto) titulos.h2.push(texto);
        });

        document.querySelectorAll('h3').forEach(el => {
            const texto = el.textContent.trim();
            if (texto) titulos.h3.push(texto);
        });

        document.querySelectorAll('h4').forEach(el => {
            const texto = el.textContent.trim();
            if (texto) titulos.h4.push(texto);
        });

        document.querySelectorAll('h5').forEach(el => {
            const texto = el.textContent.trim();
            if (texto) titulos.h5.push(texto);
        });

        document.querySelectorAll('h6').forEach(el => {
            const texto = el.textContent.trim();
            if (texto) titulos.h6.push(texto);
        });

        return titulos;
    }

    // Función para enviar títulos al servidor (opcional)
    function enviarTitulosAlServidor(titulos) {
        fetch('/api/registrar-titulos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(titulos)
        })
        .catch(error => console.log('Info: No se pudo registrar títulos (endpoint opcional)', error.message));
    }

    // Función para mostrar títulos en consola
    function mostrarTitulosEnConsola(titulos) {
        console.group('📋 Títulos extraídos de la página actual');
        console.log('URL:', titulos.url);
        console.log('Título de la página:', titulos.pageTitle);
        
        if (titulos.h1.length > 0) console.log('H1:', titulos.h1);
        if (titulos.h2.length > 0) console.log('H2:', titulos.h2);
        if (titulos.h3.length > 0) console.log('H3:', titulos.h3);
        if (titulos.h4.length > 0) console.log('H4:', titulos.h4);
        if (titulos.h5.length > 0) console.log('H5:', titulos.h5);
        if (titulos.h6.length > 0) console.log('H6:', titulos.h6);
        
        console.log('Extracción realizada a las:', titulos.timestamp);
        console.groupEnd();
    }

    // Hacer la función disponible globalmente
    window.extraerTitulos = function() {
        return extraerTitulosActuales();
    };

    // Ejecutar automáticamente cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                const titulos = extraerTitulosActuales();
                mostrarTitulosEnConsola(titulos);
                enviarTitulosAlServidor(titulos);
            }, 100);
        });
    } else {
        // Si el documento ya está cargado
        const titulos = extraerTitulosActuales();
        mostrarTitulosEnConsola(titulos);
        enviarTitulosAlServidor(titulos);
    }

    // Monitorear cambios dinámicos en la página
    const observer = new MutationObserver(function(mutations) {
        // Solo ejecutar si hay cambios significativos
        const huboCambiosTitulos = mutations.some(mutation => {
            return mutation.target.tagName && /^H[1-6]$/.test(mutation.target.tagName);
        });

        if (huboCambiosTitulos) {
            const titulos = extraerTitulosActuales();
            console.log('📋 Títulos actualizados:', titulos);
        }
    });

    // Observar cambios en el body
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false
    });

})();
