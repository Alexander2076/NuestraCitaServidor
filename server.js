const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors());

const servidor = http.createServer(app);

const io = new Server(servidor, {
    cors: {
        origin: "*"
    }
});

app.get("/", (req, res) => {
    res.send("❤️ Servidor Nuestra Cita funcionando ❤️");
});

io.on("connection", (socket) => {

    console.log("❤️ UNA PERSONA SE CONECTÓ");
    console.log("🆔 ID:", socket.id);


    socket.on("pruebaConexion", () => {

        console.log("🧪 PRUEBA DE CONEXIÓN RECIBIDA");
        console.log("🆔 ID DEL SOCKET:", socket.id);

    });


    // Detecta absolutamente cualquier evento que llegue
    socket.onAny((evento, ...datos) => {
        console.log("📩 EVENTO RECIBIDO:", evento);
        console.log("📦 DATOS:", datos);
    });


    socket.on("crearSala", (codigo) => {

        console.log("🎯 CREAR SALA RECIBIDO");
        console.log("🔑 Código:", codigo);

        socket.join(codigo);

        console.log(`💕 Sala creada: ${codigo}`);

        socket.emit("salaCreada", codigo);
    });


    socket.on("unirseSala", (codigo) => {

        console.log("🎯 UNIRSE SALA RECIBIDO");
        console.log("🔑 Código:", codigo);


        const salaAntes = io.sockets.adapter.rooms.get(codigo);


        if (salaAntes && salaAntes.size >= 2) {

            console.log("🚫 SALA LLENA");

            socket.emit("salaLlena");

            return;
        }


        socket.join(codigo);


        const salaDespues = io.sockets.adapter.rooms.get(codigo);


        console.log(`💕 Una persona se unió a: ${codigo}`);


        console.log(
            `👥 PERSONAS EN LA SALA: ${salaDespues ? salaDespues.size : 0}`
        );


        socket.emit("salaUnida", codigo);


        socket.to(codigo).emit("parejaEntro");


        console.log("❤️ EVENTO parejaEntro ENVIADO");

    });


    socket.on("disconnect", () => {

        console.log("💔 UNA PERSONA SE DESCONECTÓ");

    });

});


const PORT = process.env.PORT || 3000;

servidor.listen(PORT, "0.0.0.0", () => {

    console.log(`🚀 Servidor funcionando en el puerto ${PORT}`);

});