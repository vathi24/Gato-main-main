const cheerio = require('cheerio');

// Extraer todos los títulos de un HTML
exports.extraerTitulos = async (htmlContent) => {
    try {
        const $ = cheerio.load(htmlContent);
        
        // Extraer todos los títulos (h1, h2, h3, etc.)
        const titulos = {
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: [],
            pageTitle: $('title').text() || 'Sin título'
        };

        // Extraer cada tipo de heading
        $('h1').each((index, element) => {
            titulos.h1.push($(element).text().trim());
        });

        $('h2').each((index, element) => {
            titulos.h2.push($(element).text().trim());
        });

        $('h3').each((index, element) => {
            titulos.h3.push($(element).text().trim());
        });

        $('h4').each((index, element) => {
            titulos.h4.push($(element).text().trim());
        });

        $('h5').each((index, element) => {
            titulos.h5.push($(element).text().trim());
        });

        $('h6').each((index, element) => {
            titulos.h6.push($(element).text().trim());
        });

        console.log(`Títulos extraídos:`, titulos);
        return titulos;
    } catch (error) {
        console.error("Error al extraer títulos", error);
        throw new Error("No se pudo extraer títulos del HTML");
    }
};

// Ejemplo de procesamiento asíncrono avanzado
exports.procesarHtmlEjemplo = async (htmlContent) => {
    try {
        const $ = cheerio.load(htmlContent);
        const titulo = $('h1').text(); // Extraer el título del HTML
        console.log(`Título extraído con Cheerio: ${titulo}`);
        return `Título procesado con Cheerio: ${titulo}`;
    } catch (error) {
        console.error("Error al procesar HTML", error);
        throw new Error("No se pudo procesar el HTML");
    }
};