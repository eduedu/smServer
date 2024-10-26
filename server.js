const express = require('express');
const http = require('http');
const { Server: SocketIo } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new SocketIo(server, {
    cors: {
        origin: '*', // Permitir múltiples orígenes
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors({
    origin: '*', // Permitir solicitudes desde múltiples orígenes
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.static('public'));

let currentStep = 0; // Paso actual
let connectedClients = 0; // Contador de clientes conectados

// Función para manejar el bucle de reproducción
const startLoop = () => {
    currentStep = (currentStep + 1) % 16; // Avanzar al siguiente paso
    // io.emit('stepChanged', currentStep); // Emitir el paso actual a todos los clientes

    if (currentStep === 0) {
        io.emit('startSequence'); // Emitir señal de inicio de secuencia
    }
    setTimeout(startLoop, 120); // Llamar a la función nuevamente después de 100 ms
};

// Iniciar el bucle de reproducción
startLoop();

// Configuración de Socket.IO
io.on('connection', (socket) => {
    connectedClients++; // Incrementar el contador al conectar
    console.log('Nuevo cliente. Total:', connectedClients);

    // Emitir el paso actual al nuevo cliente
    // socket.emit('currentStep', currentStep);

    // Iniciar un bucle de reproducción
    // const loop = setInterval(() => {
    //     currentStep = (currentStep + 1) % 16; // Avanzar al siguiente paso
    //     // io.emit('stepChanged', currentStep); // Emitir el paso actual a todos los clientes
    //     if (currentStep == 0) {
    //         // console.log(currentStep)
    //         io.emit('startSequence'); // Emitir el paso actual a todos los clientes
    //     }
    // }, 100); // Cambia el tiempo según la velocidad deseada

    socket.on('disconnect', () => {
        connectedClients--; // Decrementar el contador al desconectar
        console.log('Cliente desconectado. Total de clientes conectados:', connectedClients);
        // clearInterval(loop); // Detener el bucle si el cliente se desconecta
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
