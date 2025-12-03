const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const EXTERNAL_API = 'https://api.televicentro.com/api/elecciones/candidatos';

// Configuración de CORS: Permite peticiones desde cualquier origen a nuestro proxy
app.use(cors()); 

// Configura Express para servir los archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Endpoint Proxy: 
 * Recibe la petición del navegador y la redirige a la API externa.
 */
app.get('/api/candidatos', async (req, res) => {
    console.log('Petición recibida en el proxy. Llamando a la API externa...');
    try {
        // Petición de servidor a servidor (no afectada por CORS)
        const response = await axios.get(EXTERNAL_API);
        
        // El servidor proxy envía los datos al navegador
        res.json(response.data); 

    } catch (error) {
        console.error('❌ Error al obtener datos de la API externa:', error.message);
        // Respuesta de error al cliente
        res.status(500).json({ 
            error: 'Fallo al conectar con la API externa.',
            detail: error.message
        });
    }
});

// Ruta para servir index.html como ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Proxy corriendo en http://localhost:${PORT}`);
});